import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { generateSeoMeta } from "@/lib/seo-ai.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, AlertCircle, CheckCircle2, Sparkles, Wand2 } from "lucide-react";


export const Route = createFileRoute("/_authenticated/admin/seo")({
  component: SeoPage,
});

type SeoRow = {
  id: string;
  route_path: string;
  title: string | null;
  description: string | null;
  keywords: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
  canonical: string | null;
  robots: string | null;
  json_ld: unknown;
  is_published: boolean;
};

const empty: Partial<SeoRow> = {
  route_path: "/", title: "", description: "", keywords: "",
  og_title: "", og_description: "", og_image: "", canonical: "",
  robots: "index,follow", is_published: true,
};

function scoreRow(r: SeoRow) {
  const checks = [
    !!r.title && r.title.length >= 20 && r.title.length <= 60,
    !!r.description && r.description.length >= 50 && r.description.length <= 160,
    !!r.og_title,
    !!r.og_description,
    !!r.og_image,
    !!r.canonical,
  ];
  const pass = checks.filter(Boolean).length;
  return { pass, total: checks.length };
}

const COMMON_ROUTES: { path: string; label: string }[] = [
  { path: "/", label: "Home" },
  { path: "/about", label: "About" },
  { path: "/contact", label: "Contact" },
  { path: "/bespoke", label: "Bespoke" },
  { path: "/custom-order", label: "Custom Order" },
  { path: "/education", label: "Education" },
  { path: "/offers", label: "Offers" },
  { path: "/ring-size-guide", label: "Ring Size Guide" },
  { path: "/assurance", label: "Assurance" },
  { path: "/collections/rings", label: "Rings" },
  { path: "/collections/earrings", label: "Earrings" },
  { path: "/collections/bracelets", label: "Bracelets" },
  { path: "/collections/necklaces", label: "Necklaces" },
  { path: "/collections/pendants", label: "Pendants" },
  { path: "/collections/engagement-rings", label: "Engagement Rings" },
  { path: "/collections/mens-jewelry", label: "Men's Jewelry" },
];

function SeoPage() {
  const [rows, setRows] = useState<SeoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<SeoRow> | null>(null);
  const [bulkBusy, setBulkBusy] = useState(false);
  const generate = useServerFn(generateSeoMeta);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("seo_meta").select("*").order("route_path");
    if (error) toast.error(error.message);
    setRows((data as unknown as SeoRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(r: SeoRow) {
    if (!confirm(`Delete SEO entry for ${r.route_path}?`)) return;
    const { error } = await supabase.from("seo_meta").delete().eq("id", r.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  const missingRoutes = COMMON_ROUTES.filter((c) => !rows.some((r) => r.route_path === c.path));

  async function autoFillAll() {
    if (missingRoutes.length === 0) {
      toast.info("Every common route already has SEO metadata.");
      return;
    }
    if (!confirm(`Auto-generate SEO for ${missingRoutes.length} missing route(s) with AI?`)) return;
    setBulkBusy(true);
    let ok = 0;
    for (const r of missingRoutes) {
      try {
        const meta = await generate({ data: { route_path: r.path, hint: r.label } });
        const { error } = await supabase.from("seo_meta").insert({
          route_path: r.path,
          title: meta.title,
          description: meta.description,
          keywords: meta.keywords,
          og_title: meta.og_title,
          og_description: meta.og_description,
          canonical: r.path,
          robots: "index,follow",
          is_published: true,
        });
        if (!error) ok++;
      } catch (e: any) {
        console.error("autoFill", r.path, e);
      }
    }
    setBulkBusy(false);
    toast.success(`Generated SEO for ${ok}/${missingRoutes.length} routes`);
    load();
  }

  const overall = rows.reduce((a, r) => {
    const s = scoreRow(r);
    return { pass: a.pass + s.pass, total: a.total + s.total };
  }, { pass: 0, total: 0 });
  const pct = overall.total ? Math.round((overall.pass / overall.total) * 100) : 0;

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Search</p>
          <h1 className="mt-2 font-serif text-3xl">SEO Manager</h1>
          <p className="mt-1 text-sm text-muted-foreground">Automate with AI, or edit every field by hand.</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={autoFillAll} disabled={bulkBusy || missingRoutes.length === 0}>
            <Sparkles className="h-4 w-4 mr-2" />
            {bulkBusy ? "Generating…" : `Auto-fill missing (${missingRoutes.length})`}
          </Button>
          <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" /> New Page</Button>
        </div>
      </div>

      {missingRoutes.length > 0 && (
        <div className="mt-4 border border-border/60 bg-muted/30 p-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Quick add — routes without SEO</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {missingRoutes.map((r) => (
              <button
                key={r.path}
                onClick={() => setEditing({ ...empty, route_path: r.path, canonical: r.path })}
                className="text-xs px-3 py-1.5 border border-border/60 bg-card hover:border-foreground/40 transition"
              >
                + {r.label} <span className="text-muted-foreground font-mono">{r.path}</span>
              </button>
            ))}
          </div>
        </div>
      )}



      <div className="mt-6 border border-border/60 bg-card p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Overall SEO Health</p>
            <p className="mt-2 font-serif text-3xl">{pct}%</p>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            {overall.pass} / {overall.total} checks passed<br />
            {rows.length} pages configured
          </div>
        </div>
        <div className="mt-4 h-2 bg-muted rounded overflow-hidden">
          <div className="h-full bg-foreground transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="mt-8 border border-border/60 bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No SEO entries. Add one to override page metadata.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Route</th>
                  <th className="text-left p-3">Title</th>
                  <th className="text-left p-3">Score</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => {
                  const s = scoreRow(r);
                  return (
                    <tr key={r.id} className="border-t border-border/60">
                      <td className="p-3 font-mono text-xs">{r.route_path}</td>
                      <td className="p-3">
                        <div className="max-w-xs truncate">{r.title || <span className="text-muted-foreground italic">— missing —</span>}</div>
                        <div className="text-xs text-muted-foreground max-w-xs truncate">{r.description || "no description"}</div>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-xs">
                          {s.pass === s.total ? <CheckCircle2 className="h-3 w-3 text-green-600" /> : <AlertCircle className="h-3 w-3 text-amber-600" />}
                          {s.pass}/{s.total}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${r.is_published ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                          {r.is_published ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(r)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <SeoEditor initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </div>
  );
}

function SeoEditor({ initial, onClose, onSaved }: { initial: Partial<SeoRow>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<SeoRow>>(initial);
  const [saving, setSaving] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [hint, setHint] = useState("");
  const generate = useServerFn(generateSeoMeta);
  const isNew = !initial.id;

  function upd<K extends keyof SeoRow>(k: K, v: SeoRow[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const titleLen = (form.title || "").length;
  const descLen = (form.description || "").length;

  async function runAi() {
    if (!form.route_path) return toast.error("Enter a route path first");
    setAiBusy(true);
    try {
      const meta = await generate({ data: { route_path: form.route_path, hint: hint || undefined } });
      setForm((f) => ({
        ...f,
        title: meta.title,
        description: meta.description,
        keywords: meta.keywords,
        og_title: meta.og_title,
        og_description: meta.og_description,
        canonical: f.canonical || f.route_path || "",
      }));
      toast.success("AI generated metadata — review and save");
    } catch (e: any) {
      toast.error(e?.message ?? "AI generation failed");
    } finally {
      setAiBusy(false);
    }
  }

  async function save() {
    if (!form.route_path) return toast.error("Route path is required");
    const payload = {
      route_path: form.route_path,
      title: form.title || null,
      description: form.description || null,
      keywords: form.keywords || null,
      og_title: form.og_title || null,
      og_description: form.og_description || null,
      og_image: form.og_image || null,
      canonical: form.canonical || null,
      robots: form.robots || "index,follow",
      is_published: form.is_published ?? true,
    };
    setSaving(true);
    const { error } = isNew
      ? await supabase.from("seo_meta").insert(payload)
      : await supabase.from("seo_meta").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Saved");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New SEO Page" : `Edit SEO — ${initial.route_path}`}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Route Path *</Label>
            <Input value={form.route_path || ""} onChange={(e) => upd("route_path", e.target.value)} placeholder="/about" />
          </div>

          <div className="border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Wand2 className="h-4 w-4 text-amber-600" />
              <p className="text-xs uppercase tracking-widest">AI Auto-Generate</p>
            </div>
            <Input
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Optional: describe this page (e.g. 'Lab-grown diamond engagement rings')"
            />
            <Button type="button" size="sm" variant="outline" onClick={runAi} disabled={aiBusy}>
              <Sparkles className="h-3 w-3 mr-2" />
              {aiBusy ? "Generating…" : "Generate with AI"}
            </Button>
            <p className="text-[11px] text-muted-foreground">Fills title, description, keywords, and OG fields. Edit freely below.</p>
          </div>


          <div>
            <div className="flex justify-between"><Label>Title</Label><span className={`text-xs ${titleLen > 60 || (titleLen > 0 && titleLen < 20) ? "text-amber-600" : "text-muted-foreground"}`}>{titleLen}/60</span></div>
            <Input value={form.title || ""} onChange={(e) => upd("title", e.target.value)} />
          </div>
          <div>
            <div className="flex justify-between"><Label>Description</Label><span className={`text-xs ${descLen > 160 || (descLen > 0 && descLen < 50) ? "text-amber-600" : "text-muted-foreground"}`}>{descLen}/160</span></div>
            <Textarea rows={2} value={form.description || ""} onChange={(e) => upd("description", e.target.value)} />
          </div>
          <div>
            <Label>Keywords</Label>
            <Input value={form.keywords || ""} onChange={(e) => upd("keywords", e.target.value)} placeholder="diamond, jewelry" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>OG Title</Label>
              <Input value={form.og_title || ""} onChange={(e) => upd("og_title", e.target.value)} />
            </div>
            <div>
              <Label>OG Image URL</Label>
              <Input value={form.og_image || ""} onChange={(e) => upd("og_image", e.target.value)} placeholder="https://…" />
            </div>
          </div>
          <div>
            <Label>OG Description</Label>
            <Textarea rows={2} value={form.og_description || ""} onChange={(e) => upd("og_description", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Canonical URL</Label>
              <Input value={form.canonical || ""} onChange={(e) => upd("canonical", e.target.value)} />
            </div>
            <div>
              <Label>Robots</Label>
              <Input value={form.robots || "index,follow"} onChange={(e) => upd("robots", e.target.value)} />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={form.is_published ?? true} onCheckedChange={(v) => upd("is_published", v)} /> Published
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
