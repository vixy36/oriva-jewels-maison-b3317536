import { Link } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden bg-charcoal aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.06]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-t from-obsidian/80 via-transparent to-obsidian/20"
        />
        <span aria-hidden className="pointer-events-none absolute top-0 left-0 h-6 w-6 border-t border-l border-gold/0 group-hover:border-gold/70 transition duration-700" />
        <span aria-hidden className="pointer-events-none absolute top-0 right-0 h-6 w-6 border-t border-r border-gold/0 group-hover:border-gold/70 transition duration-700" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 left-0 h-6 w-6 border-b border-l border-gold/0 group-hover:border-gold/70 transition duration-700" />
        <span aria-hidden className="pointer-events-none absolute bottom-0 right-0 h-6 w-6 border-b border-r border-gold/0 group-hover:border-gold/70 transition duration-700" />

        <span className="absolute top-4 left-4 text-[12px] tracking-[0.35em] uppercase text-ivory/70 bg-obsidian/60 backdrop-blur-sm px-2.5 py-1 border border-white/10">
          {product.diamondTypes.includes("Lab Grown") && product.diamondTypes.includes("Natural")
            ? "Natural · Lab"
            : product.diamondTypes[0]}
        </span>

        <span className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-ivory text-obsidian px-5 py-2.5 text-[12px] tracking-[0.32em] uppercase opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition duration-500 whitespace-nowrap">
          <Plus className="h-3 w-3" strokeWidth={1.5} />
          View Piece
        </span>
      </div>

      <div className="mt-6 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[12px] tracking-[0.4em] uppercase text-gold">
            {product.collection}
          </p>
          <h3 className="mt-2 font-serif text-[22px] leading-tight text-ivory group-hover:text-gold transition">
            {product.name}
          </h3>
          <p className="mt-1.5 text-xs text-ivory/45 line-clamp-1">{product.shape} · {product.metal}</p>
        </div>
        <span className="mt-2 shrink-0 text-[12px] tracking-[0.32em] uppercase text-ivory/40">
          Enquire
        </span>
      </div>
    </Link>
  );
}
