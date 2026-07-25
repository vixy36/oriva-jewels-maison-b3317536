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
import { Pencil, Trash2, Plus, X, ImagePlus, Play } from "lucide-react";
import { Lightbox } from "@/components/site/Lightbox";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: ProductsPage,
});

type Variant = {
  label: string;
  swatch?: string;
  image?: string;
  price_from?: number | null;
  mrp?: number | null;
};

type Product = {
  id: string;
  slug: string;
  name: string;
  product_code: string | null;
  category: string;
  categories: string[];
  subcategory: string | null;
  price_from: number | null;
  mrp: number | null;
  show_price: boolean;
  offer_id: string | null;
  currency: string;
  short_description: string | null;
  description: string | null;
  images: string[];
  video_url: string | null;
  diamond_type: string | null;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  metal_options: Variant[];
};

type OfferOpt = { id: string; title: string };

const CATEGORIES = [
  "rings", "earrings", "bracelets", "necklaces", "pendants", "mens-jewelry",
  "engagement-rings", "bespoke", "lab-grown", "natural", "offers",
];
const DIAMOND_TYPES = ["Natural", "Lab Grown", "Both"];

const empty: Partial<Product> = {
  slug: "", name: "", product_code: "", category: "rings", categories: ["rings"],
  price_from: null, mrp: null, show_price: true, offer_id: null, currency: "USD",
  short_description: "", description: "", images: [], video_url: null, diamond_type: "Both",
  is_active: true, is_featured: false, sort_order: 0,
  stock_quantity: 0, low_stock_threshold: 3, track_inventory: false,
  metal_options: [],
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
                    <td className="p-3">
                      {p.show_price === false ? (
                        <span className="text-xs text-muted-foreground italic">hidden</span>
                      ) : p.price_from ? (
                        <div className="leading-tight">
                          <div>{p.currency} {p.price_from}</div>
                          {p.mrp && p.mrp > (p.price_from ?? 0) && (
                            <div className="text-[11px] text-muted-foreground line-through">{p.currency} {p.mrp}</div>
                          )}
                        </div>
                      ) : "—"}
                    </td>

                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded ${p.is_active ? "bg-green-500/10 text-green-700 dark:text-green-400" : "bg-muted text-muted-foreground"}`}>
                        {p.is_active ? "Active" : "Hidden"}
                      </span>
                      {p.is_featured && <span className="ml-2 text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">Featured</span>}
                      {p.track_inventory && (
                        <div className="mt-1 text-[11px]">
                          {p.stock_quantity === 0 ? (
                            <span className="text-red-600">Out of stock</span>
                          ) : p.stock_quantity <= p.low_stock_threshold ? (
                            <span className="text-amber-600">Low: {p.stock_quantity} left</span>
                          ) : (
                            <span className="text-muted-foreground">Stock: {p.stock_quantity}</span>
                          )}
                        </div>
                      )}
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
  const [offers, setOffers] = useState<OfferOpt[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const isNew = !initial.id;

  useEffect(() => {
    supabase.from("offers").select("id,title").eq("is_active", true).order("priority", { ascending: false })
      .then(({ data }) => setOffers((data as OfferOpt[]) ?? []));
  }, []);

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

  async function uploadVideo(file: File) {
    if (file.size > 3 * 1024 * 1024) {
      return toast.error("Video must be under 3MB");
    }
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "mp4";
      const path = `videos/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "video/mp4",
      });
      if (upErr) throw upErr;
      const { data: signed, error: sErr } = await supabase.storage
        .from("product-images")
        .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (sErr) throw sErr;
      upd("video_url", signed.signedUrl);
      toast.success("Video uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }


  async function save() {
    const cats = (form.categories && form.categories.length ? form.categories : (form.category ? [form.category] : [])) as string[];
    if (!form.name || cats.length === 0) return toast.error("Name and at least one category are required");
    const payload = {
      slug: form.slug || slugify(form.name),
      name: form.name,
      product_code: form.product_code || undefined,
      category: cats[0],
      categories: cats,
      subcategory: form.subcategory || null,
      price_from: form.price_from || null,
      mrp: form.mrp || null,
      show_price: form.show_price ?? true,
      offer_id: form.offer_id || null,
      currency: form.currency || "USD",
      short_description: form.short_description || null,
      description: form.description || null,
      images: form.images || [],
      video_url: form.video_url || null,
      diamond_type: form.diamond_type || null,
      is_active: form.is_active ?? true,
      is_featured: form.is_featured ?? false,
      sort_order: form.sort_order ?? 0,
      stock_quantity: form.stock_quantity ?? 0,
      low_stock_threshold: form.low_stock_threshold ?? 3,
      track_inventory: form.track_inventory ?? false,
    };


    setSaving(true);
    let error: any = null;
    if (isNew) {
      let attempt = 0;
      let trySlug = payload.slug;
      while (attempt < 5) {
        const res = await supabase.from("products").insert({ ...payload, slug: trySlug });
        if (!res.error) { error = null; break; }
        if (res.error.code === "23505" && res.error.message.includes("products_slug_key")) {
          attempt++;
          trySlug = `${payload.slug}-${Math.random().toString(36).slice(2, 6)}`;
          continue;
        }
        error = res.error; break;
      }
    } else {
      const res = await supabase.from("products").update(payload).eq("id", initial.id!);
      error = res.error;
    }
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
                <Input value={form.product_code || ""} onChange={(e) => upd("product_code", e.target.value)} placeholder="auto (ORV-1, ORV-2…)" className="font-mono" />

              </div>
            </div>
          </div>

          <div>
            <Label>Slug</Label>
            <Input value={form.slug || ""} onChange={(e) => upd("slug", e.target.value)} placeholder="auto from name" />
          </div>

          <div>
            <Label>Categories * <span className="text-xs text-muted-foreground font-normal">(pick one or more)</span></Label>
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2 rounded border border-border/60 p-3">
              {CATEGORIES.map((c) => {
                const selected = (form.categories || []).includes(c);
                return (
                  <label key={c} className="flex items-center gap-2 text-sm cursor-pointer hover:text-foreground">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...(form.categories || []), c]
                          : (form.categories || []).filter((x) => x !== c);
                        upd("categories", next);
                        // keep primary category in sync (first selected)
                        if (next.length) upd("category", next[0]);
                      }}
                      className="h-4 w-4 accent-foreground"
                    />
                    <span className="capitalize">{c.replace(/-/g, " ")}</span>
                  </label>
                );
              })}
            </div>
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


          <div className="rounded border border-border/60 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold">Pricing</Label>
              <label className="flex items-center gap-2 text-xs">
                <Switch checked={form.show_price ?? true} onCheckedChange={(v) => upd("show_price", v)} />
                Show price on website
              </label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <Label className="text-xs">MRP</Label>
                <Input type="number" step="0.01" value={form.mrp ?? ""} placeholder="Original"
                  onChange={(e) => upd("mrp", e.target.value ? parseFloat(e.target.value) : null)} />
              </div>
              <div>
                <Label className="text-xs">Selling Price</Label>
                <Input type="number" step="0.01" value={form.price_from ?? ""} placeholder="Discounted"
                  onChange={(e) => upd("price_from", e.target.value ? parseFloat(e.target.value) : null)} />
              </div>
              <div>
                <Label className="text-xs">Currency</Label>
                <Select value={form.currency || "USD"} onValueChange={(v) => upd("currency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["USD", "HKD", "EUR", "GBP", "AED", "INR", "SGD"].map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Sort Order</Label>
                <Input type="number" value={form.sort_order ?? 0}
                  onChange={(e) => upd("sort_order", parseInt(e.target.value) || 0)} />
              </div>
            </div>
            <div>
              <Label className="text-xs">Link an Offer (optional)</Label>
              <Select
                value={form.offer_id || "__none"}
                onValueChange={(v) => upd("offer_id", v === "__none" ? null : v)}
              >
                <SelectTrigger><SelectValue placeholder="No offer" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">— No offer —</SelectItem>
                  {offers.map((o) => (
                    <SelectItem key={o.id} value={o.id}>{o.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {offers.length === 0 && (
                <p className="text-[11px] text-muted-foreground mt-1">
                  No active offers yet. Create one in Admin → Offers.
                </p>
              )}
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
            <div className="mt-2 flex flex-wrap gap-2">
              {(form.images || []).map((url, i) => (
                <div key={i} className="relative h-20 w-20 border border-border/60 group overflow-hidden rounded">
                  <button
                    type="button"
                    onClick={() => setLightboxIdx(i)}
                    className="block h-full w-full"
                    aria-label="Preview image"
                  >
                    <img src={url} alt="" className="w-full h-full object-cover" />
                  </button>
                  <button
                    type="button"
                    onClick={() => upd("images", form.images!.filter((_, j) => j !== i))}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <label className="h-20 w-20 border border-dashed border-border/60 rounded flex flex-col items-center justify-center cursor-pointer hover:border-foreground/40 hover:bg-muted/40 text-[11px] text-muted-foreground transition">
                <ImagePlus className="h-5 w-5 mb-1" />
                {uploading ? "Uploading…" : "Add"}
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

          <div>
            <Label>Video <span className="text-xs text-muted-foreground font-normal">(optional, max 3MB)</span></Label>
            <div className="mt-2 flex items-center gap-3">
              {form.video_url ? (
                <div className="relative h-20 w-20">
                  <button
                    type="button"
                    onClick={() => setVideoOpen(true)}
                    className="block h-full w-full overflow-hidden rounded border border-border/60 relative group"
                    aria-label="Preview video"
                  >
                    <video src={form.video_url} className="h-full w-full object-cover" muted playsInline />
                    <span className="absolute inset-0 grid place-items-center bg-black/30 group-hover:bg-black/50 transition">
                      <Play className="h-5 w-5 text-white" fill="white" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => upd("video_url", null)}
                    className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded"
                    aria-label="Remove video"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : null}
              <label className="inline-flex items-center gap-2 px-3 py-2 border border-dashed border-border/60 rounded cursor-pointer hover:border-foreground/40 hover:bg-muted/40 text-xs text-muted-foreground transition">
                <ImagePlus className="h-4 w-4" />
                {uploading ? "Uploading…" : form.video_url ? "Replace Video" : "Add Video"}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && uploadVideo(e.target.files[0])}
                />
              </label>
            </div>
            <div className="mt-3">
              <Label className="text-xs font-normal text-muted-foreground">Or paste a video link (YouTube, Vimeo, or direct .mp4 URL)</Label>
              <Input
                type="url"
                placeholder="https://www.youtube.com/watch?v=… or https://…/clip.mp4"
                value={form.video_url ?? ""}
                onChange={(e) => upd("video_url", e.target.value.trim() || null)}
                className="mt-1"
              />
            </div>
          </div>

          {lightboxIdx !== null && form.images && form.images.length > 0 && (
            <Lightbox
              images={form.images}
              index={lightboxIdx}
              onClose={() => setLightboxIdx(null)}
              onIndexChange={setLightboxIdx}
            />
          )}

          {videoOpen && form.video_url && (
            <div
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-6"
              onClick={() => setVideoOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <button
                type="button"
                onClick={() => setVideoOpen(false)}
                aria-label="Close"
                className="absolute top-6 right-6 grid h-11 w-11 place-items-center bg-black/70 border border-white/40 text-white hover:bg-white hover:text-black transition"
              >
                <X className="h-5 w-5" />
              </button>
              <video
                src={form.video_url}
                controls
                autoPlay
                className="max-h-[85vh] max-w-[92vw]"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}


          <div className="border-t border-border/60 pt-4">
            <label className="flex items-center gap-2 text-sm mb-3">
              <Switch checked={form.track_inventory ?? false} onCheckedChange={(v) => upd("track_inventory", v)} />
              Track inventory for this product
            </label>
            {form.track_inventory && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Stock Quantity</Label>
                  <Input type="number" min={0} value={form.stock_quantity ?? 0}
                    onChange={(e) => upd("stock_quantity", parseInt(e.target.value) || 0)} />
                </div>
                <div>
                  <Label className="text-xs">Low-stock alert at</Label>
                  <Input type="number" min={0} value={form.low_stock_threshold ?? 3}
                    onChange={(e) => upd("low_stock_threshold", parseInt(e.target.value) || 0)} />
                </div>
              </div>
            )}
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
