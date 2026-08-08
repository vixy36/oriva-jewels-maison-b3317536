import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

type Automation = {
  id: string;
  name: string;
  trigger_type: string;
  trigger_status: string;
  template_name: string;
  subject_override: string | null;
  is_active: boolean;
  run_count: number;
};

/**
 * Runs all active automations matching a status change.
 * If Lovable Emails is configured, sends the email using the registered template.
 * Otherwise records the trigger (run_count + last_run_at) so the admin can see the flow.
 */
export const runStatusAutomations = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      triggerType: z.enum(["order_status", "enquiry_status"]),
      status: z.string().min(1),
      recipient: z.object({
        email: z.string().email(),
        name: z.string().optional().nullable(),
      }),
      // Free-form data merged into templateData for the email
      data: z.record(z.string(), z.any()).optional().nullable(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase } = context as { supabase: any };

    const { data: rows, error } = await supabase
      .from("marketing_automations")
      .select("*")
      .eq("trigger_type", data.triggerType)
      .eq("trigger_status", data.status)
      .eq("is_active", true);
    if (error) throw new Error(error.message);

    const automations = (rows ?? []) as Automation[];
    if (automations.length === 0) return { triggered: 0, sent: 0, skipped: 0 };

    let sent = 0;
    let skipped = 0;

    // Attempt to load the email sender lazily - it only exists once emails are scaffolded.
    let sendTemplateEmail:
      | ((name: string, to: string, opts?: { templateData?: Record<string, unknown>; subject?: string; idempotencyKey?: string }) => Promise<{ sent: boolean; reason?: string }>)
      | null = null;
    try {
      const modPath = "@/lib/email-templates/send-email";
      const mod: any = await import(/* @vite-ignore */ modPath).catch(() => null);
      if (mod?.sendTemplateEmail) sendTemplateEmail = mod.sendTemplateEmail;
    } catch { /* emails not configured yet */ }

    for (const a of automations) {
      if (sendTemplateEmail) {
        try {
          const res = await sendTemplateEmail(a.template_name, data.recipient.email, {
            templateData: { name: data.recipient.name ?? undefined, ...(data.data ?? {}) },
            subject: a.subject_override ?? undefined,
            idempotencyKey: `${a.id}-${data.triggerType}-${data.status}-${data.recipient.email}`,
          });
          if (res.sent) sent++; else skipped++;
        } catch (e) {
          console.error("[automation] send failed", a.name, e);
          skipped++;
        }
      } else {
        skipped++;
      }

      await supabase
        .from("marketing_automations")
        .update({ last_run_at: new Date().toISOString(), run_count: (a.run_count ?? 0) + 1 })
        .eq("id", a.id);
    }

    return { triggered: automations.length, sent, skipped };
  });
