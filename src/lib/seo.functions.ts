import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSeoMeta = createServerFn({ method: "GET" })
  .validator((d: { path: string }) => z.object({ path: z.string() }).parse(d))
  .handler(async ({ data }) => {
    try {
      console.log(`[SEO] Fetching metadata for path: ${data.path}`);
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      
      const { data: seo, error } = await supabaseAdmin
        .from("seo_meta")
        .select("*")
        .eq("route_path", data.path)
        .eq("is_published", true)
        .maybeSingle();
      
      if (error) {
        console.error("[SEO] Database error:", error);
        return null;
      }
      
      return seo;
    } catch (err) {
      console.error("[SEO] Server function error:", err);
      return null;
    }
  });

