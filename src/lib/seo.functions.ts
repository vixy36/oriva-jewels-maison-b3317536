import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const getSeoMeta = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ path: z.string() }).parse(d))
  .handler(async ({ data }) => {
    const { supabase } = await import("@/integrations/supabase/client.server");
    const { data: seo } = await supabase
      .from("seo_meta")
      .select("*")
      .eq("route_path", data.path)
      .eq("is_published", true)
      .maybeSingle();
    
    return seo;
  });
