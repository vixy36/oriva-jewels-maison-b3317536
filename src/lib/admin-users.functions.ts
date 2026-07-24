import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw new Error(error.message);
  if (!data?.some((r: any) => r.role === "admin")) {
    throw new Error("Admin role required");
  }
}

export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [usersRes, rolesRes] = await Promise.all([
      supabaseAdmin.auth.admin.listUsers({ perPage: 200 }),
      supabaseAdmin.from("user_roles").select("user_id, role"),
    ]);
    if (usersRes.error) throw new Error(usersRes.error.message);
    if (rolesRes.error) throw new Error(rolesRes.error.message);
    const roleMap = new Map<string, string[]>();
    (rolesRes.data ?? []).forEach((r: any) => {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role);
      roleMap.set(r.user_id, arr);
    });
    return usersRes.data.users.map((u) => ({
      id: u.id,
      email: u.email ?? "",
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
      roles: roleMap.get(u.id) ?? [],
    }));
  });

export const setUserRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      userId: z.string().uuid(),
      role: z.enum(["admin", "editor", "user"]),
      grant: z.boolean(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    if (data.grant) {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      if (data.role === "admin" && data.userId === (context as any).userId) {
        throw new Error("You cannot remove your own admin role");
      }
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const createAdminUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      email: z.string().email(),
      password: z.string().min(8, "Password must be at least 8 characters"),
      roles: z.array(z.enum(["admin", "editor", "user"])).default([]),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
    });
    if (error) throw new Error(error.message);
    const userId = created.user?.id;
    if (!userId) throw new Error("Failed to create user");
    if (data.roles.length > 0) {
      const rows = data.roles.map((role) => ({ user_id: userId, role }));
      const { error: rErr } = await supabaseAdmin
        .from("user_roles")
        .upsert(rows, { onConflict: "user_id,role" });
      if (rErr) throw new Error(rErr.message);
    }
    return { ok: true, userId };
  });

export const sendManualEmail = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      recipients: z.array(z.string().email()).min(1, "At least one recipient"),
      subject: z.string().min(1),
      body: z.string().min(1),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);

    let sendTemplateEmail:
      | ((name: string, to: string, opts?: { templateData?: Record<string, unknown>; subject?: string; idempotencyKey?: string }) => Promise<{ sent: boolean; reason?: string }>)
      | null = null;
    try {
      const modPath = "@/lib/email-templates/send-email";
      const mod: any = await import(/* @vite-ignore */ modPath).catch(() => null);
      if (mod?.sendTemplateEmail) sendTemplateEmail = mod.sendTemplateEmail;
    } catch { /* not configured */ }

    if (!sendTemplateEmail) {
      throw new Error("Email delivery is not configured yet. Set up the email domain to enable sending.");
    }

    let sent = 0;
    const failures: string[] = [];
    for (const to of data.recipients) {
      try {
        const res = await sendTemplateEmail("generic-notification", to, {
          subject: data.subject,
          templateData: { body: data.body, subject: data.subject },
          idempotencyKey: `manual-${Date.now()}-${to}`,
        });
        if (res.sent) sent++;
        else failures.push(`${to}: ${res.reason ?? "skipped"}`);
      } catch (e: any) {
        failures.push(`${to}: ${e?.message ?? "failed"}`);
      }
    }
    return { sent, failures, total: data.recipients.length };
  });
