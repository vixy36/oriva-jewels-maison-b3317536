import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/content")({
  component: ContentPage,
});

type Row = { id: string; key: string; label: string | null; value: Record<string, unknown> };

const empty: Partial<Row> = { key: "", label: "", value: {} };

type Seed = { key: string; label: string; value: Record<string, unknown> };
const SUGGESTED: Seed[] = [
  { key: "home.hero", label: "Homepage Hero", value: { eyebrow: "A Fine Jewellery Maison", tagline: "We design your dreams with diamonds", subtitle: "We are end to end manufacturers of DIAMONDS & JEWELLERY" } },
  { key: "home.marquee", label: "Homepage Marquee", value: { items: ["Direct Factory Pricing", "GIA & IGI Certified", "Engagement Ring Specialist", "Worldwide Insured Shipping"] } },
  { key: "site.contact", label: "Contact Info", value: { whatsapp: "85253176253", email: "care@orivajewels.com", hours: "24/7 by appointment" } },
];

function ContentPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_content").select("*").order("key");
    if (error) toast.error(error.message);
    setRows((data as unknown as Row[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(r: Row) {
    if (!confirm(`Delete "${r.key}"?`)) return;
    await supabase.from("site_content").delete().eq("id", r.id);
    load();
  }

  async function seed(item: (typeof SUGGESTED)[number]) {
    const { error } = await supabase.from("site_content").insert(item);
    if (error) return toast.error(error.message);
    toast.success(`Added ${item.key}`);
    load();
  }

  const existingKeys = new Set(rows.map((r) => r.key));
  const suggestions = SUGGESTED.filter((s) => !existingKeys.has(s.key));

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Site</p>
          <h1 className="mt-2 font-serif text-3xl">Content Blocks</h1>
          <p className="mt-1 text-sm text-muted-foreground">JSON-based content editable without code.</p>
        </div>
        <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" /> New Block</Button>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-6 border border-dashed border-border/60 p-4 bg-card">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Quick add</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s.key} onClick={() => seed(s)} className="text-xs px-3 py-1.5 border border-border/60 rounded hover:bg-muted">
                + {s.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 border border-border/60 bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No content blocks yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Key</th>
                  <th className="text-left p-3">Label</th>
                  <th className="text-left p-3">Preview</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="p-3 font-mono text-xs">{r.key}</td>
                    <td className="p-3">{r.label}</td>
                    <td className="p-3 max-w-md truncate text-xs text-muted-foreground">{JSON.stringify(r.value)}</td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <ContentEditor initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function ContentEditor({ initial, onClose, onSaved }: { initial: Partial<Row>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({
    key: initial.key || "",
    label: initial.label || "",
    valueStr: JSON.stringify(initial.value ?? {}, null, 2),
  });
  const [saving, setSaving] = useState(false);
  const isNew = !initial.id;

  async function save() {
    let parsed: unknown;
    try { parsed = JSON.parse(form.valueStr); } catch { return toast.error("Value must be valid JSON"); }
    if (!form.key) return toast.error("Key required");
    setSaving(true);
    const payload = { key: form.key, label: form.label || null, value: parsed };
    const { error } = isNew
      ? await supabase.from("site_content").insert(payload)
      : await supabase.from("site_content").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader><DialogTitle>{isNew ? "New Content Block" : "Edit Content"}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Key *</Label>
            <Input value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} placeholder="home.hero" />
          </div>
          <div>
            <Label>Label</Label>
            <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          </div>
          <div>
            <Label>Value (JSON)</Label>
            <Textarea rows={12} className="font-mono text-xs" value={form.valueStr} onChange={(e) => setForm({ ...form, valueStr: e.target.value })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
