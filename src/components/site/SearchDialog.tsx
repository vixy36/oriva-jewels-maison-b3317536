import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X, Loader2 } from "lucide-react";
import { products as staticProducts } from "@/lib/products";
import { supabase } from "@/integrations/supabase/client";

type Hit = {
  slug: string;
  name: string;
  image: string;
  category: string;
  subtitle: string;
  source: "static" | "db";
};

const POPULAR = ["Engagement Rings", "Solitaire", "Diamond Earrings", "Tennis Bracelet", "Lab Grown"];

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [dbHits, setDbHits] = useState<Hit[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setDbHits([]);
      setTimeout(() => inputRef.current?.focus(), 30);
      const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      window.addEventListener("keydown", onKey);
      document.body.style.overflow = "hidden";
      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  // Debounced DB search
  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (!term) { setDbHits([]); return; }
    setLoading(true);
    const t = setTimeout(async () => {
      const like = `%${term}%`;
      const { data } = await supabase
        .from("products")
        .select("slug,name,category,subcategory,short_description,images,product_code")
        .eq("is_active", true)
        .or(`name.ilike.${like},short_description.ilike.${like},category.ilike.${like},subcategory.ilike.${like},product_code.ilike.${like}`)
        .limit(20);
      const hits: Hit[] = (data ?? []).map((d) => ({
        slug: d.slug,
        name: d.name,
        image: (d.images as string[] | null)?.[0] ?? "",
        category: d.category,
        subtitle: d.subcategory || d.short_description || "",
        source: "db",
      }));
      setDbHits(hits);
      setLoading(false);
    }, 220);
    return () => clearTimeout(t);
  }, [q, open]);

  const combined = useMemo<Hit[]>(() => {
    const term = q.trim().toLowerCase();
    const staticHits: Hit[] = staticProducts
      .filter((p) => !term || [p.name, p.category, p.collection, p.shape, p.metal, p.short].join(" ").toLowerCase().includes(term))
      .map((p) => ({
        slug: p.slug, name: p.name, image: p.image,
        category: p.category, subtitle: `${p.shape} · ${p.metal}`, source: "static",
      }));
    const seen = new Set<string>();
    return [...dbHits, ...staticHits].filter((h) => {
      if (seen.has(h.slug)) return false;
      seen.add(h.slug);
      return true;
    });
  }, [q, dbHits]);

  const grouped = useMemo(() => {
    const g: Record<string, Hit[]> = {};
    combined.forEach((h) => { (g[h.category] ??= []).push(h); });
    return g;
  }, [combined]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-obsidian/95 backdrop-blur-xl animate-fade-in" data-surface="dark">
      <div className="mx-auto max-w-3xl px-6 pt-20 md:pt-28">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-gold">Search the Maison</p>
          <button aria-label="Close search" onClick={onClose} className="text-ivory hover:text-gold transition">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 flex items-center gap-3 border-b border-white/15 pb-3 focus-within:border-gold transition">
          <Search className="h-5 w-5 text-gold" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, code, category, shape…"
            className="w-full bg-transparent text-lg md:text-xl text-ivory placeholder:text-ivory/40 outline-none py-2"
          />
          {loading && <Loader2 className="h-4 w-4 text-gold animate-spin" />}
        </div>

        {!q.trim() && (
          <div className="mt-6 flex flex-wrap gap-2">
            <span className="text-[11px] tracking-widest uppercase text-ivory/50 mr-2 self-center">Popular</span>
            {POPULAR.map((p) => (
              <button
                key={p}
                onClick={() => setQ(p)}
                className="px-3 py-1.5 text-xs tracking-widest uppercase border border-white/15 text-ivory/80 hover:border-gold hover:text-gold transition"
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div className="mt-8 max-h-[60vh] overflow-y-auto">
          {combined.length === 0 && q.trim() && !loading ? (
            <p className="text-sm text-ivory/60 py-8">No pieces match "{q}".</p>
          ) : (
            Object.entries(grouped).map(([cat, items]) => (
              <div key={cat} className="mb-6">
                <p className="text-[11px] tracking-[0.35em] uppercase text-gold/80 mb-2">{cat.replace(/-/g, " ")}</p>
                <ul className="divide-y divide-white/10">
                  {items.map((p) => (
                    <li key={p.slug + p.source}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={onClose}
                        className="group flex items-center gap-5 py-4 hover:bg-white/5 px-2 -mx-2 transition"
                      >
                        {p.image ? (
                          <img src={p.image} alt={p.name} className="h-16 w-16 object-cover" />
                        ) : (
                          <div className="h-16 w-16 bg-white/5 grid place-items-center text-[10px] text-ivory/40">No image</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-xl text-ivory group-hover:text-gold transition truncate">{p.name}</p>
                          {p.subtitle && (
                            <p className="text-[13px] tracking-[0.2em] uppercase text-ivory/60 mt-1 truncate">{p.subtitle}</p>
                          )}
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
