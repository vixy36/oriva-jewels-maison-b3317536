import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { products } from "@/lib/products";

export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
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

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return products.slice(0, 6);
    return products.filter((p) =>
      [p.name, p.category, p.collection, p.shape, p.metal, p.short]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [q]);

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
            placeholder="Search rings, earrings, shapes…"
            className="w-full bg-transparent text-lg md:text-xl text-ivory placeholder:text-ivory/40 outline-none py-2"
          />
        </div>
        <div className="mt-8 max-h-[60vh] overflow-y-auto">
          {results.length === 0 ? (
            <p className="text-sm text-ivory/60 py-8">No pieces match "{q}".</p>
          ) : (
            <ul className="divide-y divide-white/10">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    to="/product/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className="group flex items-center gap-5 py-4 hover:bg-white/5 px-2 -mx-2 transition"
                  >
                    <img src={p.image} alt={p.name} className="h-16 w-16 object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-xl text-ivory group-hover:text-gold transition truncate">
                        {p.name}
                      </p>
                      <p className="text-[13px] tracking-[0.2em] uppercase text-ivory/60 mt-1">
                        {p.shape} · {p.metal}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
