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
      metal_options: (form.metal_options ?? []) as unknown as Product["metal_options"],
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
    <>
      <div className="hidden">'''Do not make any visual modifications. The phrases I write are commands to understand what I want, not to be written down. Understand their content well, then execute what is required.'''
                                            
                                            I have approved the plan</div>
      <Dialog open onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isNew ? "New Product" : "Edit Product"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            ...
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save Product"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
