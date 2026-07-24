import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

async function assertAdmin(ctx: { supabase: any; userId: string }) {
  const { data, error } = await ctx.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", ctx.userId);
  if (error) throw new Error(error.message);
  if (!data?.some((r: any) => r.role === "admin")) throw new Error("Admin role required");
}

export const generateSeoMeta = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z.object({
      route_path: z.string().min(1),
      hint: z.string().optional(),
    }).parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context as any);
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway not configured");

    const prompt = `You are an SEO expert writing metadata for ORIVA JEWELS — a Hong Kong-based luxury fine jewellery maison specializing in Natural and Lab Grown Diamond jewellery.

Generate SEO metadata for the route path: "${data.route_path}"
${data.hint ? `\nAdditional context: ${data.hint}` : ""}

Return strict JSON with these keys:
- title: 50-60 chars, includes "Oriva Jewels" where natural, compelling
- description: 140-160 chars, benefit-driven, includes keywords naturally
- keywords: comma-separated, 6-10 relevant terms
- og_title: 40-60 chars, share-optimized variant
- og_description: 140-160 chars, share-optimized

Return ONLY valid JSON. No markdown, no code fences.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI gateway error (${res.status}): ${text.slice(0, 200)}`);
    }
    const json = await res.json();
    const content: string = json.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json\s*|\s*```/g, "").trim();
    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("AI returned invalid JSON");
      parsed = JSON.parse(match[0]);
    }
    return {
      title: String(parsed.title ?? "").slice(0, 70),
      description: String(parsed.description ?? "").slice(0, 180),
      keywords: String(parsed.keywords ?? ""),
      og_title: String(parsed.og_title ?? parsed.title ?? ""),
      og_description: String(parsed.og_description ?? parsed.description ?? ""),
    };
  });
