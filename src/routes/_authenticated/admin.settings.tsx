import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Loader2, Info } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/settings")({
  component: SettingsAdmin,
});

function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    id: "",
    google_analytics_id: "",
    header_scripts: "",
    body_scripts: "",
  });

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .maybeSingle();

        if (error) throw error;

        if (data) {
          setSettings({
            id: data.id,
            google_analytics_id: data.google_analytics_id || "",
            header_scripts: data.header_scripts || "",
            body_scripts: data.body_scripts || "",
          });
        }
      } catch (err: any) {
        toast.error("Failed to load settings: " + err.message);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        google_analytics_id: settings.google_analytics_id.trim() || null,
        header_scripts: settings.header_scripts.trim() || null,
        body_scripts: settings.body_scripts.trim() || null,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (settings.id) {
        const { error: updateError } = await supabase
          .from("settings")
          .update(payload)
          .eq("id", settings.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from("settings")
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error("Failed to save settings: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <p className="eyebrow">System</p>
        <h1 className="mt-2 font-serif text-3xl">Site Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage site-wide analytics and custom scripts. These scripts will be injected into all pages.
        </p>
      </div>

      <div className="space-y-8 border border-border/60 p-6 bg-background shadow-sm">
        <div className="space-y-4">
          <div>
            <Label htmlFor="ga_id" className="text-xs tracking-[0.2em] uppercase font-bold text-[#071c37]">Google Analytics ID (Measurement ID)</Label>
            <Input
              id="ga_id"
              value={settings.google_analytics_id}
              onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
              placeholder="G-XXXXXXXXXX"
              className="mt-2"
            />
            <p className="mt-1 text-xs text-muted-foreground">Enter your G-TAG ID to enable Google Analytics.</p>
          </div>

          <div className="pt-4">
            <Label htmlFor="header_scripts" className="text-xs tracking-[0.2em] uppercase font-bold text-[#071c37]">Header Scripts</Label>
            <Textarea
              id="header_scripts"
              value={settings.header_scripts}
              onChange={(e) => setSettings({ ...settings, header_scripts: e.target.value })}
              placeholder="<!-- Add custom <script> or <link> tags here -->"
              className="mt-2 font-mono text-sm h-48"
            />
            <p className="mt-1 text-xs text-muted-foreground">These scripts will be placed inside the &lt;head&gt; tag.</p>
          </div>

          <div className="pt-4">
            <Label htmlFor="body_scripts" className="text-xs tracking-[0.2em] uppercase font-bold text-[#071c37]">Body Scripts (Footer)</Label>
            <Textarea
              id="body_scripts"
              value={settings.body_scripts}
              onChange={(e) => setSettings({ ...settings, body_scripts: e.target.value })}
              placeholder="<!-- Add custom tracking pixels or chat widgets here -->"
              className="mt-2 font-mono text-sm h-48"
            />
            <p className="mt-1 text-xs text-muted-foreground">These scripts will be placed at the end of the &lt;body&gt; tag.</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/30 border border-border/40 rounded-sm">
          <Info className="h-5 w-5 text-[#071c37]/60" />
          <p className="text-[13px] text-[#071c37]/70 leading-relaxed">
            <strong>Caution:</strong> Adding incorrect scripts can break your website. Please double-check your code before saving. 
            The Google Analytics ID automatically adds the gtag.js script.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/60">
          <Button onClick={handleSave} disabled={saving} className="bg-[#071c37] text-white hover:bg-[#071c37]/90 px-8">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
