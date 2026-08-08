import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Pencil, Trash2, Plus, Upload, X, Tag, Clock } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/offers")({
  component: OffersPage,
});

type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  promo_code: string | null;
  discount_type: "percentage" | "fixed" | "free_shipping" | "gift" | "custom";
  discount_value: number | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  category: string | null;
  badge: string | null;
  starts_at: string | null;
  ends_at: string | null;
  priority: number;
  is_active: boolean;
  terms: string | null;
};

const DISCOUNT_TYPES: Offer["discount_type"][] = ["percentage", "fixed", "free_shipping", "gift", "custom"];
const CATEGORIES = ["Seasonal", "Festive", "Bridal", "First Order", "Loyalty", "Clearance", "Limited Edition"];

const empty: Partial<Offer> = {
  title: "", subtitle: "", description: "", promo_code: "",
  discount_type: "percentage", discount_value: null, image_url: "",
  cta_label: "Shop the Offer", cta_url: "/collections/rings",
  category: "Seasonal", badge: "", starts_at: null, ends_at: null,
  priority: 0, is_active: true, terms: "",
};

function toLocalInput(iso: string | null | undefined) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromLocalInput(v: string) {
  return v ? new Date(v).toISOString() : null;
}

function statusOf(o: Offer): { label: string; tone: string } {
  const now = Date.now();
  if (!o.is_active) return { label: "Hidden", tone: "bg-muted text-muted-foreground" };
  if (o.starts_at && new Date(o.starts_at).getTime() > now) return { label: "Scheduled", tone: "bg-blue-500/10 text-blue-700 dark:text-blue-400" };
  if (o.ends_at && new Date(o.ends_at).getTime() < now) return { label: "Expired", tone: "bg-red-500/10 text-red-700 dark:text-red-400" };
  return { label: "Live", tone: "bg-green-500/10 text-green-700 dark:text-green-400" };
}

function OffersPage() {
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Offer> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("offers").select("*").order("priority", { ascending: false }).order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as unknown as Offer[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(o: Offer) {
    if (!confirm(`Delete "${o.title}"?`)) return;
    const { error } = await supabase.from("offers").delete().eq("id", o.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Promotions</p>
          <h1 className="mt-2 font-serif text-3xl">Offers & Discounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage promotions shown on the site and the dedicated Offers page.</p>
        </div>
        <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" /> New Offer</Button>
      </div>

      <div className="mt-8 border border-border/60 bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No offers yet. Add your first one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Offer</th>
                  <th className="text-left p-3">Code</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Window</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((o) => {
                  const s = statusOf(o);
                  const val = o.discount_type === "percentage" ? `${o.discount_value ?? 0}%`
                    : o.discount_type === "fixed" ? `$${o.discount_value ?? 0}`
                    : o.discount_type === "free_shipping" ? "Free Ship"
                    : o.discount_type === "gift" ? "Free Gift"
                    : "-";
                  return (
                    <tr key={o.id} className="border-t border-border/60">
                      <td className="p-3">
                        {o.image_url ? (
                          <img src={o.image_url} alt="" className="w-14 h-14 object-cover rounded" />
                        ) : (
                          <div className="w-14 h-14 bg-muted rounded flex items-center justify-center"><Tag className="h-5 w-5 text-muted-foreground" /></div>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="font-medium">{o.title}</div>
                        <div className="text-xs text-muted-foreground">{o.category ?? "-"} · Priority {o.priority}</div>
                      </td>
                      <td className="p-3 font-mono text-xs">{o.promo_code || "-"}</td>
                      <td className="p-3">{val}</td>
                      <td className="p-3 text-xs text-muted-foreground">
                        {o.starts_at ? new Date(o.starts_at).toLocaleDateString() : "-"}
                        <span className="mx-1">→</span>
                        {o.ends_at ? new Date(o.ends_at).toLocaleDateString() : "∞"}
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded ${s.tone}`}>{s.label}</span>
                      </td>
                      <td className="p-3 text-right">
                        <Button size="sm" variant="ghost" onClick={() => setEditing(o)}><Pencil className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(o)}><Trash2 className="h-4 w-4" /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <OfferEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function OfferEditor({ initial, onClose, onSaved }: { initial: Partial<Offer>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Offer>>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isNew = !initial.id;

  function upd<K extends keyof Offer>(k: K, v: Offer[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `offers/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file);
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      upd("image_url", data.publicUrl);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.title) return toast.error("Title is required");
    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      description: form.description || null,
      promo_code: form.promo_code ? form.promo_code.toUpperCase().trim() : null,
      discount_type: form.discount_type || "percentage",
      discount_value: form.discount_value ?? null,
      image_url: form.image_url || null,
      cta_label: form.cta_label || null,
      cta_url: form.cta_url || null,
      category: form.category || null,
      badge: form.badge || null,
      starts_at: form.starts_at || null,
      ends_at: form.ends_at || null,
      priority: form.priority ?? 0,
      is_active: form.is_active ?? true,
      terms: form.terms || null,
    };
    setSaving(true);
    const { error } = isNew
      ? await supabase.from("offers").insert(payload)
      : await supabase.from("offers").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Offer created" : "Offer updated");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New Offer" : "Edit Offer"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={form.title || ""} onChange={(e) => upd("title", e.target.value)} placeholder="Festive Radiance - 15% Off Lab Diamonds" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Subtitle</Label>
              <Input value={form.subtitle || ""} onChange={(e) => upd("subtitle", e.target.value)} placeholder="This Diwali only" />
            </div>
            <div>
              <Label>Badge</Label>
              <Input value={form.badge || ""} onChange={(e) => upd("badge", e.target.value)} placeholder="Limited Time" />
            </div>
          </div>

          <div>
            <Label>Description</Label>
            <Textarea rows={3} value={form.description || ""} onChange={(e) => upd("description", e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Discount Type</Label>
              <Select value={form.discount_type} onValueChange={(v) => upd("discount_type", v as Offer["discount_type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISCOUNT_TYPES.map((t) => <SelectItem key={t} value={t}>{t.replace(/_/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <Input type="number" step="0.01" value={form.discount_value ?? ""} onChange={(e) => upd("discount_value", e.target.value ? parseFloat(e.target.value) : null)} placeholder={form.discount_type === "percentage" ? "15" : "100"} />
            </div>
            <div>
              <Label>Promo Code</Label>
              <Input value={form.promo_code || ""} onChange={(e) => upd("promo_code", e.target.value)} placeholder="ORIVA15" className="uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category || ""} onValueChange={(v) => upd("category", v)}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Priority (higher = shown first)</Label>
              <Input type="number" value={form.priority ?? 0} onChange={(e) => upd("priority", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Starts At</Label>
              <Input type="datetime-local" value={toLocalInput(form.starts_at)} onChange={(e) => upd("starts_at", fromLocalInput(e.target.value))} />
            </div>
            <div>
              <Label className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> Ends At</Label>
              <Input type="datetime-local" value={toLocalInput(form.ends_at)} onChange={(e) => upd("ends_at", fromLocalInput(e.target.value))} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>CTA Label</Label>
              <Input value={form.cta_label || ""} onChange={(e) => upd("cta_label", e.target.value)} placeholder="Shop the Offer" />
            </div>
            <div>
              <Label>CTA URL</Label>
              <Input value={form.cta_url || ""} onChange={(e) => upd("cta_url", e.target.value)} placeholder="/collections/engagement-rings" />
            </div>
          </div>

          <div>
            <Label>Image</Label>
            <div className="mt-2 flex items-start gap-3">
              {form.image_url ? (
                <div className="relative w-28 h-28 border border-border/60 group">
                  <img src={form.image_url} alt="" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => upd("image_url", "")} className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
              <label className="w-28 h-28 border border-dashed border-border/60 flex flex-col items-center justify-center cursor-pointer hover:border-foreground/40 text-xs text-muted-foreground">
                <Upload className="h-5 w-5 mb-1" />
                {uploading ? "Uploading…" : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])} />
              </label>
            </div>
          </div>

          <div>
            <Label>Terms & Conditions</Label>
            <Textarea rows={2} value={form.terms || ""} onChange={(e) => upd("terms", e.target.value)} placeholder="Cannot be combined with other offers. On select styles only." />
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.is_active ?? true} onCheckedChange={(v) => upd("is_active", v)} /> Active
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Offer"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
