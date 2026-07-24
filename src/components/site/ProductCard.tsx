import { Link } from "@tanstack/react-router";
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
