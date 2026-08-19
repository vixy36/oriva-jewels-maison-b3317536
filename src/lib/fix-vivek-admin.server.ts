import { supabase } from "@/integrations/supabase/client";

export async function ensureVivekIsAdmin() {
  const vivekEmail = "vivekchoudharyjpr@gmail.com";
  
  // 1. Get Vivek's user ID
  const { data: users, error: userError } = await supabase
    .from("profiles") // Using profiles or auth metadata if available, but let's assume we can get it via email search in a server context or just use the ID we found
    .select("id")
    .eq("email", vivekEmail)
    .single();

  const vivekId = "e67ff4c7-bbe3-49d6-bb10-7d664f05a67f"; // Hardcoded from our check

  // 2. Upsert admin role
  const { error: roleError } = await supabase
    .from("user_roles")
    .upsert(
      { user_id: vivekId, role: "admin" },
      { onConflict: "user_id,role" }
    );

  if (roleError) console.error("Error setting admin role:", roleError);
}
