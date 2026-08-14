import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Plus, Trash2, Pencil, ArrowUp, ArrowDown, ExternalLink, Save, ArrowLeft, Eye, EyeOff, Copy,
  LayoutGrid, ChevronDown, ChevronRight
} from "lucide-react";
import { BLOCK_LABELS, newBlock, parseBlocks, slugify, type BlockType, type PageBlock } from "@/lib/page-blocks";
import { getBuiltInBlocks } from "@/lib/built-in-pages";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: PagesAdmin,
});

type PageRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  seo_title: string | null;
  seo_description: string | null;
  hero_image_url: string | null;
  blocks: unknown;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
};

const BUILT_IN: { label: string; path: string; slug: string }[] = [
  { label: "Home", path: "/", slug: "home" },
  { label: "About Us", path: "/about", slug: "about" },
  { label: "Maison Assurance", path: "/assurance", slug: "assurance" },
  { label: "Diamonds", path: "/diamonds", slug: "diamonds" },
  { label: "Bespoke", path: "/bespoke", slug: "bespoke" },
  { label: "Custom Order", path: "/custom-order", slug: "custom-order" },
  { label: "Gift Ideas", path: "/gifts", slug: "gifts" },
  { label: "Occasions", path: "/occasions", slug: "occasions" },
  { label: "Offers", path: "/offers", slug: "offers" },
  { label: "Education", path: "/education", slug: "education" },
  { label: "Ring Size Guide", path: "/ring-size-guide", slug: "ring-size-guide" },
  { label: "Contact", path: "/contact", slug: "contact" },
  { label: "Wishlist", path: "/wishlist", slug: "wishlist" },
];

type Draft = {
  id?: string;
  slug: string;
  title: string;
  subtitle: string;
  seo_title: string;
  seo_description: string;
  hero_image_url: string;
  is_published: boolean;
  sort_order: number;
  blocks: PageBlock[];
};

function emptyDraft(): Draft {
  return {
    slug: "",
    title: "",
    subtitle: "",
    seo_title: "",
    seo_description: "",
    hero_image_url: "",
    is_published: true,
    sort_order: 0,
    blocks: [newBlock("heading"), newBlock("paragraph")],
  };
}

function toDraft(row: PageRow): Draft {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle ?? "",
    seo_title: row.seo_title ?? "",
    seo_description: row.seo_description ?? "",
    hero_image_url: row.hero_image_url ?? "",
    is_published: row.is_published,
    sort_order: row.sort_order,
    blocks: parseBlocks(row.blocks),
  };
}

function PagesAdmin() {
  const [rows, setRows] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("pages")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as unknown as PageRow[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function remove(row: PageRow) {
    if (!confirm(`Delete "${row.title}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("pages").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Page deleted");
    load();
  }

  async function togglePublished(row: PageRow) {
    const { error } = await supabase.from("pages").update({ is_published: !row.is_published }).eq("id", row.id);
    if (error) return toast.error(error.message);
    load();
  }

  if (draft) {
    return (
      <PageBuilder
        draft={draft}
        onCancel={() => setDraft(null)}
        onSaved={(saved) => { setDraft(saved); load(); }}
        onClose={() => { setDraft(null); load(); }}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Content</p>
          <h1 className="mt-2 font-serif text-3xl">Pages</h1>
          <p className="mt-2 text-sm text-muted-foreground">Build and manage custom pages, published at /pages/your-slug.</p>
        </div>
        <Button onClick={() => setDraft(emptyDraft())}><Plus className="h-4 w-4 mr-2" /> New Page</Button>
      </div>

      <div className="mt-8 border border-border/60">
        <div className="px-4 py-3 border-b border-border/60 bg-muted/30 text-xs tracking-[0.24em] uppercase">Custom pages</div>
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-muted/50 animate-pulse" />)}
          </div>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-sm text-muted-foreground">No custom pages yet. Click "New Page" to build your first.</p>
        ) : (
          <ul className="divide-y divide-border/60">
            {rows.map((row) => (
              <li key={row.id} className="p-4 flex items-center gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{row.title}</p>
                  <p className="text-xs text-muted-foreground truncate">/pages/{row.slug}</p>
                </div>
                <span className={`text-[10px] tracking-[0.2em] uppercase px-2 py-1 border ${row.is_published ? "border-border/60 text-muted-foreground" : "border-destructive/50 text-destructive"}`}>
                  {row.is_published ? "Published" : "Draft"}
                </span>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" title={row.is_published ? "Unpublish" : "Publish"} onClick={() => togglePublished(row)}>
                    {row.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button variant="ghost" size="icon" title="Edit" onClick={() => setDraft(toDraft(row))}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="View" asChild>
                    <Link to="/pages/$slug" params={{ slug: row.slug }} target="_blank"><ExternalLink className="h-4 w-4" /></Link>
                  </Button>
                  <Button variant="ghost" size="icon" title="Duplicate" onClick={() => {
                    const d = toDraft(row);
                    setDraft({ ...d, id: undefined, slug: `${d.slug}-copy`, title: `${d.title} (copy)` });
                  }}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Delete" onClick={() => remove(row)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-8 border border-border/60">
        <div className="px-4 py-3 border-b border-border/60 bg-muted/30 text-xs tracking-[0.24em] uppercase">Site pages (built-in)</div>
        <ul className="divide-y divide-border/60">
          {BUILT_IN.map((p) => {
            const customVersion = rows.find(r => r.slug === p.slug);
            return (
              <li key={p.path} className="p-4 flex items-center gap-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs text-muted-foreground">{p.path}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" title="Edit Content" onClick={() => {
                    if (customVersion) {
                      setDraft(toDraft(customVersion));
                    } else {
                      // Import built-in content as starting point
                      setDraft({
                        ...emptyDraft(),
                        title: p.label,
                        slug: p.slug,
                        blocks: getBuiltInBlocks(p.slug)
                      });
                    }
                  }}>

                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="View" asChild>
                    <a href={p.path} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

const BLOCK_TYPES = Object.keys(BLOCK_LABELS) as BlockType[];

function PageBuilder({
  draft, onCancel, onSaved, onClose,
}: {
  draft: Draft;
  onCancel: () => void;
  onSaved: (d: Draft) => void;
  onClose: () => void;
}) {
  const [d, setD] = useState<Draft>(draft);
  const [saving, setSaving] = useState(false);

  // Load existing content for built-in pages if it exists in the draft but is empty
  useEffect(() => {
    if (d.slug && (!d.blocks || d.blocks.length <= 2)) {
      // If it's a built-in page, we might want to "import" its current hardcoded content
      // but that's complex since it's JSX. For now, we ensure the draft passed in is used.
    }
  }, [d.slug]);

  function set<K extends keyof Draft>(key: K, value: Draft[K]) {
    setD((prev) => ({ ...prev, [key]: value }));
  }

  function updateBlock(id: string, patch: Partial<PageBlock>) {
    setD((prev) => ({ ...prev, blocks: prev.blocks.map((b) => (b.id === id ? { ...b, ...patch } : b)) }));
  }
  function removeBlock(id: string) {
    setD((prev) => ({ ...prev, blocks: prev.blocks.filter((b) => b.id !== id) }));
  }
  function moveBlock(index: number, dir: -1 | 1) {
    setD((prev) => {
      const next = [...prev.blocks];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      const a = next[index]!;
      next[index] = next[target]!;
      next[target] = a;
      return { ...prev, blocks: next };
    });
  }
  function addBlock(type: BlockType) {
    setD((prev) => ({ ...prev, blocks: [...prev.blocks, newBlock(type)] }));
  }

  async function save() {
    const title = d.title.trim();
    if (!title) return toast.error("Please add a page title");
    const slug = slugify(d.slug || title);
    if (!slug) return toast.error("Please add a valid URL slug");

    setSaving(true);
    const payload = {
      slug,
      title,
      subtitle: d.subtitle.trim() || null,
      seo_title: d.seo_title.trim() || null,
      seo_description: d.seo_description.trim() || null,
      hero_image_url: d.hero_image_url.trim() || null,
      is_published: d.is_published,
      sort_order: Number(d.sort_order) || 0,
      blocks: d.blocks as unknown as never,
    };

    if (d.id) {
      const { error } = await supabase.from("pages").update(payload).eq("id", d.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Page saved");
      onSaved({ ...d, slug });
      return;
    }

    // For built-in pages, check if we're "creating" a record for a slug that already exists in the table
    // (e.g. user clicks Edit on a built-in page that hasn't been saved to DB yet)
    const { data: existing } = await supabase.from("pages").select("id").eq("slug", slug).maybeSingle();
    
    if (existing) {
      const { error } = await supabase.from("pages").update(payload).eq("id", existing.id);
      setSaving(false);
      if (error) return toast.error(error.message);
      toast.success("Page updated");
      onSaved({ ...d, slug, id: existing.id });
      return;
    }

    const { data, error } = await supabase.from("pages").insert(payload).select("id").single();
    setSaving(false);
    if (error) {
      toast.error(error.message.includes("duplicate") ? "That URL slug is already in use" : error.message);
      return;
    }
    toast.success("Page created");
    onSaved({ ...d, slug, id: (data as { id: string }).id });
  }


  return (
    <div className="pb-24">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <button onClick={onClose} className="text-xs tracking-[0.24em] uppercase text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
            <ArrowLeft className="h-3.5 w-3.5" /> All pages
          </button>
          <h1 className="mt-3 font-serif text-3xl">{d.id ? "Edit page" : "New page"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">/pages/{slugify(d.slug || d.title) || "your-slug"}</p>
        </div>
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm p-4 border border-border/60 flex items-center gap-2">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            <Save className="h-4 w-4 mr-2" /> {saving ? "Saving..." : "Save all changes"}
          </Button>
        </div>

      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-4 border border-border/60 p-5 h-fit">
          <p className="text-xs tracking-[0.24em] uppercase text-muted-foreground">Page settings</p>
          <div>
            <Label>Title</Label>
            <Input value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="The Atelier Story" />
          </div>
          <div>
            <Label>URL slug</Label>
            <Input value={d.slug} onChange={(e) => set("slug", e.target.value)} placeholder="atelier-story" />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea rows={2} value={d.subtitle} onChange={(e) => set("subtitle", e.target.value)} />
          </div>
          <div>
            <Label>Hero image URL</Label>
            <div className="mt-1 flex gap-3">
              <Input value={d.hero_image_url} onChange={(e) => set("hero_image_url", e.target.value)} placeholder="https://..." />
              {d.hero_image_url && (
                <div className="h-10 w-10 shrink-0 border border-border/60">
                  <img src={d.hero_image_url} alt="Hero Preview" className="h-full w-full object-cover" />
                </div>
              )}
            </div>
          </div>
          <div>
            <Label>SEO title</Label>
            <Input value={d.seo_title} onChange={(e) => set("seo_title", e.target.value)} />
          </div>
          <div>
            <Label>SEO description</Label>
            <Textarea rows={3} value={d.seo_description} onChange={(e) => set("seo_description", e.target.value)} />
          </div>
          <div>
            <Label>Sort order</Label>
            <Input type="number" value={d.sort_order} onChange={(e) => set("sort_order", Number(e.target.value))} />
          </div>
          <div className="flex items-center justify-between pt-2">
            <Label>Published</Label>
            <Switch checked={d.is_published} onCheckedChange={(v) => set("is_published", v)} />
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="border border-border/60 p-5">
            <p className="text-xs tracking-[0.24em] uppercase text-muted-foreground">Add a block</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(BLOCK_LABELS).map(([t, label]) => (
                <button
                  key={t}
                  onClick={() => addBlock(t as BlockType)}
                  className="border border-border/60 px-3 py-2 text-xs hover:bg-muted transition flex items-center gap-2"
                >
                  <Plus className="h-3 w-3" /> {label}
                </button>
              ))}
            </div>
          </div>

          {d.blocks.length === 0 ? (
            <p className="border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
              No blocks yet. Add your first block above.
            </p>
          ) : (
            d.blocks.map((b, i) => (
              <div key={b.id} className="border border-border/60 p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs tracking-[0.24em] uppercase">{i + 1}. {BLOCK_LABELS[b.type]}</p>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={() => moveBlock(i, -1)} disabled={i === 0}><ArrowUp className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => moveBlock(i, 1)} disabled={i === d.blocks.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => removeBlock(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <BlockFields block={b} onChange={(patch) => updateBlock(b.id, patch)} />
                  <div className="pt-4 border-t border-border/40 flex justify-end">
                    <Button size="sm" variant="ghost" className="text-xs h-8" onClick={save} disabled={saving}>
                      <Save className="h-3 w-3 mr-2" /> {saving ? "Saving..." : "Save section"}
                    </Button>
                  </div>
                </div>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function BlockFields({ block: b, onChange }: { block: PageBlock; onChange: (patch: Partial<PageBlock>) => void }) {
  switch (b.type) {
    case "heading":
      return (
        <>
          <div><Label>Eyebrow</Label><Input value={b.eyebrow ?? ""} onChange={(e) => onChange({ eyebrow: e.target.value })} /></div>
          <div><Label>Heading</Label><Input value={b.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} /></div>
        </>
      );
    case "paragraph":
      return <div><Label>Text</Label><Textarea rows={5} value={b.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} /></div>;
    case "image":
      return (
        <>
          <div>
            <Label>Image URL</Label>
            <div className="mt-1 flex gap-3">
              <Input value={b.image ?? ""} onChange={(e) => onChange({ image: e.target.value })} placeholder="https://..." />
              {b.image && (
                <div className="h-12 w-12 shrink-0 border border-border/60 bg-muted/20 overflow-hidden">
                  <img src={b.image} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>
          <div><Label>Caption</Label><Input value={b.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value })} /></div>
        </>
      );
    case "image_text":
      return (
        <>
          <div><Label>Heading</Label><Input value={b.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} /></div>
          <div><Label>Text</Label><Textarea rows={4} value={b.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} /></div>
          <div>
            <Label>Image URL</Label>
            <div className="mt-1 flex gap-3">
              <Input value={b.image ?? ""} onChange={(e) => onChange({ image: e.target.value })} placeholder="https://..." />
              {b.image && (
                <div className="h-12 w-12 shrink-0 border border-border/60 bg-muted/20 overflow-hidden">
                  <img src={b.image} alt="Preview" className="h-full w-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between pt-1">
            <Label>Image on the right</Label>
            <Switch checked={Boolean(b.reverse)} onCheckedChange={(v) => onChange({ reverse: v })} />
          </div>
        </>
      );
    case "gallery":
      return (
        <div className="space-y-2">
          <Label>Image URLs</Label>
          {(b.images ?? []).map((src, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex gap-2">
                    <Input value={src} onChange={(e) => {
                      const next = [...(b.images ?? [])];
                      next[i] = e.target.value;
                      onChange({ images: next });
                    }} placeholder={`Image ${i + 1} URL`} />
                    <Button variant="ghost" size="icon" onClick={() => {
                      const next = (b.images ?? []).filter((_, idx) => idx !== i);
                      onChange({ images: next });
                    }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                  {src && (
                    <div className="h-20 w-full border border-border/60 overflow-hidden bg-muted/20">
                      <img src={src} alt={`Preview ${i + 1}`} className="h-full w-full object-contain" />
                    </div>
                  )}
                </div>
              </div>
          ))}
          <Button variant="outline" size="sm" onClick={() => onChange({ images: [...(b.images ?? []), ""] })}>+ Add Image</Button>
        </div>
      );
    case "homepage_section":
      return (
        <div className="space-y-4">
          <div>
            <Label>Section Type</Label>
            <select 
              value={b.sectionType} 
              onChange={(e) => onChange({ sectionType: e.target.value as any })}
              className="w-full bg-transparent border border-border/60 px-3 py-2 text-sm"
            >
              <option value="index" className="bg-background">The Index (Collections)</option>
              <option value="atelier" className="bg-background">The Atelier</option>
              <option value="occasions" className="bg-background">The Occasions</option>
              <option value="instagram" className="bg-background">Instagram Reels</option>
              <option value="custom" className="bg-background">Custom Slider</option>
            </select>
          </div>
          <div><Label>Section Heading</Label><Input value={b.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} /></div>
          <div><Label>Subheading/Description</Label><Textarea rows={2} value={b.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} /></div>
          <div className="space-y-3">
            <Label>Items</Label>
            {(b.items ?? []).map((item, i) => (
              <div key={item.id} className="border border-border/40 p-3 space-y-2 relative group/item">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover/item:opacity-100" 
                  onClick={() => onChange({ items: b.items?.filter(it => it.id !== item.id) })}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <div><Label className="text-[10px]">Title</Label><Input className="h-8 text-xs" value={item.title} onChange={(e) => {
                    const next = [...(b.items ?? [])];
                    next[i] = { ...item, title: e.target.value };
                    onChange({ items: next });
                  }} /></div>
                  <div><Label className="text-[10px]">Subtitle/Chapter</Label><Input className="h-8 text-xs" value={item.subtitle ?? ""} onChange={(e) => {
                    const next = [...(b.items ?? [])];
                    next[i] = { ...item, subtitle: e.target.value };
                    onChange({ items: next });
                  }} /></div>
                </div>
                <div>
                  <Label className="text-[10px]">Image URL</Label>
                  <div className="mt-1 flex gap-2">
                    <Input className="h-8 text-xs flex-1" value={item.image} onChange={(e) => {
                      const next = [...(b.items ?? [])];
                      next[i] = { ...item, image: e.target.value };
                      onChange({ items: next });
                    }} />
                    {item.image && (
                      <div className="h-8 w-8 shrink-0 border border-border/60">
                        <img src={item.image} alt="Preview" className="h-full w-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
                <div><Label className="text-[10px]">Link</Label><Input className="h-8 text-xs" value={item.link} onChange={(e) => {
                  const next = [...(b.items ?? [])];
                  next[i] = { ...item, link: e.target.value };
                  onChange({ items: next });
                }} /></div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => onChange({ 
              items: [...(b.items ?? []), { id: Math.random().toString(36).slice(2), title: "New Item", image: "", link: "" }] 
            })}>+ Add Item</Button>
          </div>
        </div>
      );
    case "quote":
      return (
        <>
          <div><Label>Quote</Label><Textarea rows={3} value={b.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} /></div>
          <div><Label>Attribution</Label><Input value={b.caption ?? ""} onChange={(e) => onChange({ caption: e.target.value })} /></div>
        </>
      );
    case "cta":
      return (
        <>
          <div><Label>Heading</Label><Input value={b.title ?? ""} onChange={(e) => onChange({ title: e.target.value })} /></div>
          <div><Label>Text</Label><Textarea rows={2} value={b.text ?? ""} onChange={(e) => onChange({ text: e.target.value })} /></div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Button label</Label><Input value={b.ctaLabel ?? ""} onChange={(e) => onChange({ ctaLabel: e.target.value })} /></div>
            <div><Label>Button link</Label><Input value={b.ctaHref ?? ""} onChange={(e) => onChange({ ctaHref: e.target.value })} placeholder="/custom-order" /></div>
          </div>
        </>
      );
    case "divider":
      return <p className="text-xs text-muted-foreground italic">A horizontal line to separate sections.</p>;
    default:
      return null;
  }
}
