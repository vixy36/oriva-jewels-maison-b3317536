import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  const gallery = (product.images && product.images.length > 0 ? product.images : [product.image]).filter(Boolean);
  const [idx, setIdx] = useState(0);
  const hasMultiple = gallery.length > 1;

  const go = (e: React.MouseEvent, dir: 1 | -1) => {
    e.preventDefault();
    e.stopPropagation();
    setIdx((i) => (i + dir + gallery.length) % gallery.length);
  };

  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden bg-charcoal aspect-[4/5]">
        <img
          src={gallery[idx]}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-t from-obsidian/60 via-transparent to-transparent"
        />

        <span className="absolute top-3 left-3 text-[9px] md:text-[10px] font-medium tracking-[0.28em] uppercase text-ivory/90">
          <span className="border-b border-gold/60 pb-0.5">
            {product.diamondTypes.includes("Lab Grown") && product.diamondTypes.includes("Natural")
              ? "Natural / Lab"
              : product.diamondTypes[0]}
          </span>
        </span>

        {hasMultiple && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              onClick={(e) => go(e, -1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-obsidian/70 border border-gold/50 text-gold hover:bg-obsidian/90 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              aria-label="Next image"
              onClick={(e) => go(e, 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 flex items-center justify-center bg-obsidian/70 border border-gold/50 text-gold hover:bg-obsidian/90 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <span
                  key={i}
                  className={`h-1 rounded-full transition-all ${i === idx ? "w-4 bg-gold" : "w-1.5 bg-ivory/50"}`}
                />
              ))}
            </div>
          </>
        )}

        <span className="absolute inset-x-6 bottom-5 flex items-center justify-center gap-2 border border-ivory/80 bg-obsidian/25 backdrop-blur-sm text-ivory px-4 py-2.5 text-[10px] md:text-[11px] tracking-[0.36em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-500">
          View
          <span aria-hidden className="text-gold">→</span>
        </span>

      </div>

      <div className="mt-4 md:mt-5 text-center">
        <p className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-gold">
          {product.collection}
        </p>
        <h3 className="mt-2 font-serif text-[17px] md:text-[20px] leading-tight text-ivory group-hover:text-gold transition line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-1.5 text-[12px] md:text-[13px] text-ivory/70 line-clamp-1">
          {product.shape} · {product.metal}
        </p>
      </div>
    </Link>
  );
}
