import { Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import type { Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to="/product/$slug"
      params={{ slug: product.slug }}
      className="group block"
    >
      <div className="relative overflow-hidden bg-secondary aspect-[4/5]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
        />
        <span className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-700 bg-gradient-to-t from-ink/20 to-transparent" />
        <button
          type="button"
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-diamond/80 backdrop-blur border border-white/40 text-ink opacity-0 group-hover:opacity-100 transition"
        >
          <Heart className="h-4 w-4" strokeWidth={1.4} />
        </button>
        <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between opacity-0 group-hover:opacity-100 transition duration-500 translate-y-2 group-hover:translate-y-0">
          <span className="bg-ink/85 text-ivory text-[10px] tracking-[0.3em] uppercase px-3 py-2 backdrop-blur">
            View Details
          </span>
        </span>
      </div>
      <div className="mt-5 space-y-1">
        <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
          {product.collection}
        </p>
        <h3 className="font-serif text-xl leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground line-clamp-1">{product.short}</p>
      </div>
    </Link>
  );
}
