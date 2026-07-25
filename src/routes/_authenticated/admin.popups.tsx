import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/popups")({
  component: PopupsPage,
});

type Popup = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  link_url: string | null;
  cta_label: string | null;
  size: "small" | "medium" | "large";
  pages: string[];
  active: boolean;
  delay_seconds: number;
  frequency: "once" | "session" | "always";
  start_at: string | null;
  end_at: string | null;
  priority: number;
};

const SIZES: Popup["size"][] = ["small", "medium", "large"];
const FREQUENCIES: Popup["frequency"][] = ["once", "session", "always"];
const PAGE_PRESETS = [
  { label: "Home only", value: "/" },
  { label: "All pages", value: "*" },
  { label: "All collections", value: "/collections/*" },
  { label: "All product pages", value: "/product/*" },
  { label: "Offers", value: "/offers" },
  { label: "Gifts", value: "/gifts" },
];

const empty: Omit<Popup, "id"> = {
  title: "",
  description: "",
  image_url: "",
  link_url: "",
  cta_label: "Explore",
  size: "medium",
  pages: ["/"],
  active: true,
  delay_seconds: 3,
  frequency: "session",
  start_at: null,
  end_at: null,
  priority: 0,
};

function PopupsPage() {
  const [items, setItems] = useState<Popup[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Popup | null>(null);
  const [form, setForm] = useState<Omit<Popup, "id">>(empty);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pagesText, setPagesText] = useState("/");

  async function load() {
    setLoading(true);
    const { data, error } = await supabase.from("popups").select("*").order("priority", { ascending: false }).order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as Popup[]) ?? []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openNew() {
    setEditing(null);
    setForm(empty);
    setPagesText(empty.pages.join(", "));
    setOpen(true);
  }

  function openEdit(p: Popup) {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description ?? "",
      image_url: p.image_url ?? "",
      link_url: p.link_url ?? "",
      cta_label: p.cta_label ?? "Explore",
      size: p.size,
      pages: p.pages ?? [],
      active: p.active,
      delay_seconds: p.delay_seconds,
      frequency: p.frequency,
      start_at: p.start_at,
      end_at: p.end_at,
      priority: p.priority,
    });
    setPagesText((p.pages ?? []).join(", "));
    setOpen(true);
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const key = `popups/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(key, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;
      // Bucket is private → use a long-lived signed URL (10 years)
      const { data: signed, error: sErr } = await supabase.storage
        .from("product-images")
        .createSignedUrl(key, 60 * 60 * 24 * 365 * 10);
      if (sErr) throw sErr;
      setForm((f) => ({ ...f, image_url: signed.signedUrl }));
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    setSaving(true);
    const pages = pagesText.split(",").map((s) => s.trim()).filter(Boolean);
    const payload = { ...form, pages: pages.length ? pages : ["/"] };
    let error;
    if (editing) {
      ({ error } = await supabase.from("popups").update(payload).eq("id", editing.id));
    } else {
      ({ error } = await supabase.from("popups").insert(payload));
    }
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(editing ? "Popup updated" : "Popup created");
    setOpen(false);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this popup?")) return;
    const { error } = await supabase.from("popups").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  async function toggleActive(p: Popup) {
    const { error } = await supabase.from("popups").update({ active: !p.active }).eq("id", p.id);
    if (error) return toast.error(error.message);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow flex items-center gap-2"><MessageSquare className="h-3 w-3" /> Offers · Popups</p>
          <h1 className="mt-2 font-serif text-3xl">Site Popups</h1>
          <p className="mt-2 text-sm text-muted-foreground max-w-xl">
            Create timed popups with an image, link, CTA, size, and target pages.
          </p>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" /> New popup</Button>
      </div>

      <div className="border border-border/60 bg-card">
        {loading ? (
          <div className="p-8 text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-sm text-muted-foreground">No popups yet.</div>
        ) : (
          <ul className="divide-y divide-border/60">
            {items.map((p) => (
              <li key={p.id} className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-muted overflow-hidden shrink-0">
                  {p.image_url && <img src={p.image_url} alt="" className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{p.title || "(untitled)"}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {p.size} · {p.frequency} · pages: {p.pages?.join(", ") || "—"}
                  </div>
                </div>
                <Switch checked={p.active} onCheckedChange={() => toggleActive(p)} />
                <Button variant="outline" size="sm" onClick={() => openEdit(p)}><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="outline" size="sm" onClick={() => remove(p.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit popup" : "New popup"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Winter Edit is here" />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea rows={3} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short pitch shown under the title" />
            </div>

            <div>
              <Label>Image</Label>
              <div className="flex items-center gap-3">
                {form.image_url && <img src={form.image_url} alt="" className="w-20 h-20 object-cover border border-border/60" />}
                <label className="inline-flex items-center gap-2 text-xs px-3 py-2 border border-border/60 cursor-pointer hover:bg-muted">
                  <Upload className="h-3.5 w-3.5" />
                  {uploading ? "Uploading…" : "Upload"}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
                </label>
                <Input value={form.image_url ?? ""} onChange={(e) => setForm({ ...form, image_url: e.target.value })} placeholder="Or paste image URL" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Link URL (button)</Label>
                <Input value={form.link_url ?? ""} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="/collections/pendants" />
              </div>
              <div>
                <Label>Button label</Label>
                <Input value={form.cta_label ?? ""} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="Explore" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Size</Label>
                <Select value={form.size} onValueChange={(v) => setForm({ ...form, size: v as Popup["size"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {SIZES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Frequency</Label>
                <Select value={form.frequency} onValueChange={(v) => setForm({ ...form, frequency: v as Popup["frequency"] })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {FREQUENCIES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Delay (seconds)</Label>
                <Input type="number" min={0} value={form.delay_seconds} onChange={(e) => setForm({ ...form, delay_seconds: Number(e.target.value) || 0 })} />
              </div>
            </div>

            <div>
              <Label>Pages to show on</Label>
              <Input value={pagesText} onChange={(e) => setPagesText(e.target.value)} placeholder="/ , /collections/*, /product/*" />
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PAGE_PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      const current = pagesText.split(",").map((s) => s.trim()).filter(Boolean);
                      if (!current.includes(p.value)) current.push(p.value);
                      setPagesText(current.join(", "));
                    }}
                    className="text-[11px] px-2 py-1 border border-border/60 hover:bg-muted"
                  >
                    + {p.label}
                  </button>
                ))}
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Comma separated. Use <code>*</code> for all pages, or <code>/collections/*</code> for a section.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Start (optional)</Label>
                <Input type="datetime-local" value={form.start_at?.slice(0, 16) ?? ""} onChange={(e) => setForm({ ...form, start_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
              <div>
                <Label>End (optional)</Label>
                <Input type="datetime-local" value={form.end_at?.slice(0, 16) ?? ""} onChange={(e) => setForm({ ...form, end_at: e.target.value ? new Date(e.target.value).toISOString() : null })} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Priority</Label>
                <Input type="number" value={form.priority} onChange={(e) => setForm({ ...form, priority: Number(e.target.value) || 0 })} />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex items-center gap-3">
                  <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
                  <Label>Active</Label>
                </div>
              </div>
            </div>

            <div className="border border-border/60 bg-muted/30 p-4 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-1">Viewing conditions</div>
              <ul className="space-y-1 list-disc pl-4">
                <li>Only shown on pages that match the list above.</li>
                <li>Waits <b>{form.delay_seconds}s</b> after the page loads.</li>
                <li>Frequency <b>{form.frequency}</b>: {form.frequency === "once" ? "shown one time per visitor (localStorage)" : form.frequency === "session" ? "once per browser session" : "every page view"}.</li>
                <li>Respects the start / end schedule when set.</li>
                <li>Higher priority popups win when multiple match.</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
