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
import { Pencil, Trash2, Plus, X, ImagePlus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

type Product = {
  id: string;
  slug: string;
  name: string;
  product_code: string | null;
  category: string;
  subcategory: string | null;
  price_from: number | null;
  currency: string;
  short_description: string | null;
  description: string | null;
  images: string[];
  diamond_type: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
};

const CATEGORIES = [
  "engagement-rings", "rings", "earrings", "bracelets",
  "necklaces", "pendants", "mens-jewelry", "bridal",
];
const DIAMOND_TYPES = ["Natural", "Lab Grown", "Both"];

const empty: Partial<Product> = {
  slug: "", name: "", product_code: "", category: "rings", price_from: null, currency: "USD",
  short_description: "", description: "", images: [], diamond_type: "Both",
  is_active: true, is_featured: false, sort_order: 0,
};


function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function ProductsPage() {
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Product> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").order("sort_order").order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setItems((data as unknown as Product[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(p: Product) {
    if (!confirm(`Delete "${p.name}"?`)) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-2 font-serif text-3xl">Products</h1>
        </div>
        <Button onClick={() => setEditing({ ...empty })}><Plus className="h-4 w-4 mr-2" /> New Product</Button>
      </div>

      <div className="mt-8 border border-border/60 bg-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Loading…</div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">No products yet. Add your first one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-widest">
                <tr>
                  <th className="text-left p-3">Image</th>
                  <th className="text-left p-3">Code</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Category</th>
                  <th className="text-left p-3">Price</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-right p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="p-3">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded" />
                      ) : (
                        <div className="w-12 h-12 bg-muted rounded" />
                      )}
                    </td>
                    <td className="p-3 font-mono text-xs">{p.product_code || "—"}</td>
                    <td className="p-3">
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">/{p.slug}</div>
                    </td>
                    <td className="p-3 capitalize">{p.category.replace(/-/g, " ")}</td>
                    <td className="p-3">{p.price_from ? `${p.currency} ${p.price_from}` : "—"}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${p.is_active ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                      {p.is_featured && <span className="ml-2 text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">Featured</span>}
                    </td>
                    <td className="p-3 text-right">
                      <Button size="sm" variant="ghost" onClick={() => setEditing(p)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => remove(p)}><Trash2 className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && (
        <ProductEditor
          initial={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}
    </div>
  );
}

function ProductEditor({ initial, onClose, onSaved }: { initial: Partial<Product>; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState<Partial<Product>>(initial);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const isNew = !initial.id;

  function upd<K extends keyof Product>(k: K, v: Product[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function uploadImages(files: FileList) {
    setUploading(true);
    const newUrls: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });
        if (upErr) throw upErr;
        // Bucket is private → use a long-lived signed URL (10 years)
        const { data: signed, error: sErr } = await supabase.storage
          .from("product-images")
          .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
        if (sErr) throw sErr;
        newUrls.push(signed.signedUrl);
      }
      upd("images", [...(form.images || []), ...newUrls]);
      toast.success(`${newUrls.length} image${newUrls.length > 1 ? "s" : ""} uploaded`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function save() {
    if (!form.name || !form.category) return toast.error("Name and category are required");
    const payload = {
      slug: form.slug || slugify(form.name),
      name: form.name,
      product_code: form.product_code || generateCode(),
      category: form.category,
      subcategory: form.subcategory || null,
      price_from: form.price_from || null,
      currency: form.currency || "USD",
      short_description: form.short_description || null,
      description: form.description || null,
      images: form.images || [],
      diamond_type: form.diamond_type || null,
      is_active: form.is_active ?? true,
      is_featured: form.is_featured ?? false,
      sort_order: form.sort_order ?? 0,
    };
    setSaving(true);
    const { error } = isNew
      ? await supabase.from("products").insert(payload)
      : await supabase.from("products").update(payload).eq("id", initial.id!);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(isNew ? "Product created" : "Product updated");
    onSaved();
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "New Product" : "Edit Product"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={form.name || ""} onChange={(e) => upd("name", e.target.value)} />
            </div>
            <div>
              <Label>Product Code</Label>
              <div className="flex gap-2">
                <Input value={form.product_code || ""} onChange={(e) => upd("product_code", e.target.value)} placeholder="auto-generated" className="font-mono" />
                <Button type="button" variant="outline" size="sm" onClick={() => upd("product_code", generateCode())}>Regenerate</Button>
              </div>
            </div>
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={form.slug || ""} onChange={(e) => upd("slug", e.target.value)} placeholder="auto from name" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category *</Label>
              <Select value={form.category} onValueChange={(v) => upd("category", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c.replace(/-/g, " ")}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Diamond Type</Label>
              <Select value={form.diamond_type || "Both"} onValueChange={(v) => upd("diamond_type", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIAMOND_TYPES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Price From</Label>
              <Input type="number" step="0.01" value={form.price_from ?? ""} onChange={(e) => upd("price_from", e.target.value ? parseFloat(e.target.value) : null)} />
            </div>
            <div>
              <Label>Currency</Label>
              <Input value={form.currency || "USD"} onChange={(e) => upd("currency", e.target.value)} />
            </div>
            <div>
              <Label>Sort Order</Label>
              <Input type="number" value={form.sort_order ?? 0} onChange={(e) => upd("sort_order", parseInt(e.target.value) || 0)} />
            </div>
          </div>

          <div>
            <Label>Short Description</Label>
            <Input value={form.short_description || ""} onChange={(e) => upd("short_description", e.target.value)} />
          </div>

          <div>
            <Label>Full Description</Label>
            <Textarea rows={4} value={form.description || ""} onChange={(e) => upd("description", e.target.value)} />
          </div>

          <div>
            <Label>Images</Label>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {(form.images || []).map((url, i) => (
                <div key={i} className="relative aspect-square border border-border/60 group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => upd("images", form.images!.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="aspect-square border border-dashed border-border/60 flex flex-col items-center justify-center cursor-pointer hover:border-foreground/40 hover:bg-muted/40 text-xs text-muted-foreground transition">
                <ImagePlus className="h-6 w-6 mb-1" />
                {uploading ? "Uploading…" : "Add Photos"}
                <span className="text-[10px] opacity-60 mt-0.5">Multiple OK</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => e.target.files?.length && uploadImages(e.target.files)}
                />
              </label>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.is_active ?? true} onCheckedChange={(v) => upd("is_active", v)} /> Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <Switch checked={form.is_featured ?? false} onCheckedChange={(v) => upd("is_featured", v)} /> Featured
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Product"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
