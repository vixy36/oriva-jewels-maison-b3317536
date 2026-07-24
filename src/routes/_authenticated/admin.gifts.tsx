import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, ImagePlus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/gifts")({
  component: GiftsAdmin,
});

type Gift = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  price_from: number | null;
  currency: string | null;
  occasion: string | null;
  audience: string | null;
  product_slug: string | null;
  cta_label: string | null;
  sort_order: number;
  is_active: boolean;
};

function GiftsAdmin() {
  const [rows, setRows] = useState<Gift[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Gift | null>(null);
  const [creating, setCreating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("gifts").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as unknown as Gift[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(g: Gift) {
    if (!confirm(`Delete "${g.title}"?`)) return;
    const { error } = await supabase.from("gifts").delete().eq("id", g.id);
    if (error) return toast.error(error.message);
    load();
  }

  async function toggleActive(g: Gift) {
    await supabase.from("gifts").update({ is_active: !g.is_active }).eq("id", g.id);
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Curation</p>
          <h1 className="mt-2 font-serif text-3xl">Gift Ideas</h1>
          <p className="mt-2 text-sm text-muted-foreground">Manage the gift edit shown at /gifts.</p>
        </div>
        <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-2" /> New Gift</Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 bg-muted/50 animate-pulse rounded" />
          ))
        ) : rows.length === 0 ? (
          <p className="col-span-full text-sm text-muted-foreground p-8 text-center border border-dashed border-border/60">
            No gift ideas yet. Click "New Gift" to add your first.
          </p>
        ) : rows.map((g) => (
          <div key={g.id} className="border border-border/60 bg-card overflow-hidden">
            <div className="aspect-[5/4] bg-muted relative">
              {g.image_url ? (
                <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full grid place-items-center text-muted-foreground text-xs">No image</div>
              )}
              {!g.is_active && <span className="absolute top-3 left-3 text-[10px] bg-red-500/90 text-white px-2 py-1 uppercase tracking-widest">Hidden</span>}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-serif text-lg truncate">{g.title}</p>
                  {g.subtitle && <p className="text-xs text-muted-foreground truncate">{g.subtitle}</p>}
                </div>
                <div className="flex items-center gap-1">
                  <Switch checked={g.is_active} onCheckedChange={() => toggleActive(g)} />
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5 text-[10px]">
                {g.occasion && <span className="px-2 py-0.5 bg-muted uppercase tracking-widest">{g.occasion}</span>}
                {g.audience && <span className="px-2 py-0.5 bg-muted uppercase tracking-widest">{g.audience}</span>}
                {g.price_from != null && <span className="px-2 py-0.5 bg-muted">from {g.currency} {g.price_from}</span>}
              </div>
              <div className="mt-4 flex justify-end gap-1">
                <Button size="sm" variant="ghost" onClick={() => setEditing(g)}><Pencil className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => remove(g)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && <GiftEditor gift={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {creating && <GiftEditor gift={null} onClose={() => setCreating(false)} onSaved={() => { setCreating(false); load(); }} />}
    </div>
  );
}

function GiftEditor({ gift, onClose, onSaved }: { gift: Gift | null; onClose: () => void; onSaved: () => void }) {
  const isNew = !gift;
  const [form, setForm] = useState<Partial<Gift>>(gift ?? {
    title: "", subtitle: "", description: "", image_url: "",
    price_from: null, currency: "USD", occasion: "", audience: "",
    product_slug: "", cta_label: "Explore", sort_order: 100, is_active: true,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  function upd<K extends keyof Gift>(k: K, v: Gift[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function upload(file: File) {
    setUploading(true);
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `gifts/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: false });
    if (error) { setUploading(false); return toast.error(error.message); }
    const { data: signed } = await supabase.storage.from("product-images").createSignedUrl(path, 60 * 60 * 24 * 365 * 5);
    if (signed?.signedUrl) upd("image_url", signed.signedUrl);
    setUploading(false);
  }

  async function save() {
    if (!form.title) return toast.error("Title is required.");
    setSaving(true);
    const payload = {
      title: form.title!,
      subtitle: form.subtitle || null,
      description: form.description || null,
      image_url: form.image_url || null,
      price_from: form.price_from ?? null,
      currency: form.currency || "USD",
      occasion: form.occasion || null,
      audience: form.audience || null,
      product_slug: form.product_slug || null,
      cta_label: form.cta_label || "Explore",
      sort_order: Number(form.sort_order) || 100,
      is_active: form.is_active ?? true,
    };
    const { error } = isNew
      ? await supabase.from("gifts").insert(payload)
      : await supabase.from("gifts").update(payload).eq("id", gift!.id);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Gift added" : "Gift updated");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New Gift Idea" : `Edit "${gift!.title}"`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label className="text-xs">Title</Label>
              <Input value={form.title ?? ""} onChange={(e) => upd("title", e.target.value)} placeholder="For Her First Anniversary" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Subtitle / Eyebrow</Label>
              <Input value={form.subtitle ?? ""} onChange={(e) => upd("subtitle", e.target.value)} placeholder="Diamond Studs" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Description</Label>
              <Textarea rows={3} value={form.description ?? ""} onChange={(e) => upd("description", e.target.value)} />
            </div>
          </div>

          <div>
            <Label className="text-xs">Image</Label>
            <div className="mt-2 flex items-center gap-3">
              {form.image_url ? (
                <img src={form.image_url} alt="" className="h-20 w-20 object-cover border border-border" />
              ) : (
                <div className="h-20 w-20 border border-dashed border-border grid place-items-center text-muted-foreground">
                  <ImagePlus className="h-5 w-5" />
                </div>
              )}
              <label className="inline-flex items-center gap-2 border border-border px-4 py-2 text-xs uppercase tracking-widest cursor-pointer hover:bg-muted">
                <input type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); }} />
                {uploading ? "Uploading…" : form.image_url ? "Replace" : "Upload"}
              </label>
              {form.image_url && (
                <Button variant="ghost" size="sm" onClick={() => upd("image_url", "")}>Remove</Button>
              )}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label className="text-xs">Occasion</Label>
              <Input value={form.occasion ?? ""} onChange={(e) => upd("occasion", e.target.value)} placeholder="Anniversary" />
            </div>
            <div>
              <Label className="text-xs">Audience</Label>
              <Input value={form.audience ?? ""} onChange={(e) => upd("audience", e.target.value)} placeholder="For Her" />
            </div>
            <div>
              <Label className="text-xs">Price from</Label>
              <Input type="number" step="0.01" value={form.price_from ?? ""} onChange={(e) => upd("price_from", e.target.value ? Number(e.target.value) : null)} />
            </div>
            <div>
              <Label className="text-xs">Currency</Label>
              <Input value={form.currency ?? "USD"} onChange={(e) => upd("currency", e.target.value.toUpperCase())} />
            </div>
            <div>
              <Label className="text-xs">Links to product slug</Label>
              <Input value={form.product_slug ?? ""} onChange={(e) => upd("product_slug", e.target.value)} placeholder="solitaire-oval" />
            </div>
            <div>
              <Label className="text-xs">CTA Label</Label>
              <Input value={form.cta_label ?? ""} onChange={(e) => upd("cta_label", e.target.value)} placeholder="Explore" />
            </div>
            <div>
              <Label className="text-xs">Sort order</Label>
              <Input type="number" value={form.sort_order ?? 100} onChange={(e) => upd("sort_order", parseInt(e.target.value) || 100)} />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.is_active ?? true} onCheckedChange={(v) => upd("is_active", v)} /> Active
              </label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : isNew ? "Create Gift" : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
