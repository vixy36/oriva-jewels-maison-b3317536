import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { SortableList } from "@/components/admin/SortableList";
import { Pencil, Trash2, Plus, Upload, X, Image as ImageIcon } from "lucide-react";

export const Route = createFileRoute("/_authenticated/admin/categories")({
  component: AdminCategoriesPage,
});

type Category = {
  id: string;
  slug: string;
  name: string;
  blurb: string | null;
  banner_url: string | null;
  sort_order: number;
  is_active: boolean;
};

function slugify(v: string) {
  return v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [items, setItems] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadBanner(file: File) {
    if (!editing) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const key = `categories/${crypto.randomUUID()}.${ext}`;
      const { error: upErr } = await supabase.storage.from("product-images").upload(key, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;
      const { data: signed, error: sErr } = await supabase.storage
        .from("product-images")
        .createSignedUrl(key, 60 * 60 * 24 * 365 * 10);
      if (sErr) throw sErr;
      setEditing({ ...editing, banner_url: signed.signedUrl });
      toast.success("Banner uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const { data, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as Category[];
    },
  });

  useEffect(() => {
    if (data) setItems(data);
  }, [data]);

  const reorderMut = useMutation({
    mutationFn: async (next: Category[]) => {
      const updates = next.map((c, i) => ({ id: c.id, sort_order: (i + 1) * 10 }));
      for (const u of updates) {
        const { error } = await supabase.from("categories").update({ sort_order: u.sort_order }).eq("id", u.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Order saved");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["public-categories"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save order"),
  });

  const saveMut = useMutation({
    mutationFn: async (c: Partial<Category> & { id?: string }) => {
      if (c.id) {
        const { error } = await supabase.from("categories").update({
          slug: c.slug, name: c.name, blurb: c.blurb, banner_url: c.banner_url, is_active: c.is_active,
        }).eq("id", c.id);
        if (error) throw error;
      } else {
        const max = Math.max(0, ...items.map((i) => i.sort_order));
        const { error } = await supabase.from("categories").insert({
          slug: c.slug!, name: c.name!, blurb: c.blurb ?? null, banner_url: c.banner_url ?? null,
          is_active: c.is_active ?? true, sort_order: max + 10,
        });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Category saved");
      setOpen(false);
      setEditing(null);
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["public-categories"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed"),
  });

  const delMut = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("categories").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Category deleted");
      qc.invalidateQueries({ queryKey: ["admin-categories"] });
      qc.invalidateQueries({ queryKey: ["public-categories"] });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to delete"),
  });

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="eyebrow">Catalog</p>
          <h1 className="font-serif text-3xl">Categories</h1>
          <p className="text-sm text-muted-foreground mt-1">Drag to reorder. Slug is the URL segment used at /collections/[slug].</p>
        </div>
        <Button onClick={() => { setEditing({ id: "", slug: "", name: "", blurb: "", banner_url: "", sort_order: 0, is_active: true }); setOpen(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Add category
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <SortableList
          items={items}
          onReorder={(next) => { setItems(next); reorderMut.mutate(next); }}
          renderItem={(c) => (
            <div className="flex items-center gap-3 w-full">
              <div className="h-12 w-16 shrink-0 rounded overflow-hidden border bg-muted flex items-center justify-center">
                {c.banner_url ? (
                  <img src={c.banner_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium truncate">{c.name}</span>
                  {!c.is_active && <span className="text-[10px] uppercase tracking-widest px-1.5 py-0.5 bg-muted rounded">Hidden</span>}
                </div>
                <div className="text-xs text-muted-foreground truncate">/collections/{c.slug}</div>
              </div>
              <Button size="sm" variant="ghost" onClick={() => { setEditing(c); setOpen(true); }}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost" onClick={() => {
                if (confirm(`Delete "${c.name}"? Products using this category will lose their link.`)) delMut.mutate(c.id);
              }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          )}
        />
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit category" : "New category"}</DialogTitle>
          </DialogHeader>
          {editing && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.id ? editing.slug : slugify(e.target.value) })}
                />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={editing.slug} onChange={(e) => setEditing({ ...editing, slug: slugify(e.target.value) })} />
                <p className="text-xs text-muted-foreground mt-1">URL: /collections/{editing.slug || "…"}</p>
              </div>
              <div>
                <Label>Blurb</Label>
                <Textarea rows={3} value={editing.blurb ?? ""} onChange={(e) => setEditing({ ...editing, blurb: e.target.value })} />
              </div>
              <div>
                <Label>Hero / header banner image</Label>
                <p className="text-xs text-muted-foreground mb-2">Shown at the top of /collections/{editing.slug || "…"}. Recommended: 2000×900px landscape.</p>
                {editing.banner_url ? (
                  <div className="relative group border rounded overflow-hidden bg-muted">
                    <img src={editing.banner_url} alt="Banner preview" className="w-full h-40 object-cover" />
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, banner_url: "" })}
                      className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 hover:bg-black"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center border-2 border-dashed rounded h-40 cursor-pointer hover:bg-muted/50 transition">
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">{uploading ? "Uploading…" : "Click to upload banner"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && uploadBanner(e.target.files[0])}
                    />
                  </label>
                )}
                <Input
                  className="mt-2"
                  value={editing.banner_url ?? ""}
                  onChange={(e) => setEditing({ ...editing, banner_url: e.target.value })}
                  placeholder="Or paste image URL"
                />
              </div>
              <div className="flex items-center justify-between border rounded px-3 py-2">
                <Label className="mb-0">Visible on site</Label>
                <Switch checked={editing.is_active} onCheckedChange={(v) => setEditing({ ...editing, is_active: v })} />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button
              disabled={!editing?.name || !editing?.slug || saveMut.isPending}
              onClick={() => editing && saveMut.mutate(editing)}
            >
              {saveMut.isPending ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
