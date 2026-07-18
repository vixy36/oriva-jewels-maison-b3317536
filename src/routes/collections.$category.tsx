import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { categories, productsByCategory, type ProductCategory } from "@/lib/products";

import engagementImg from "@/assets/collection-engagement.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import braceletsImg from "@/assets/product-tennis.jpg";
import pendantsImg from "@/assets/collection-pendants.jpg";
import bridalImg from "@/assets/collection-bridal.jpg";
import labgrownImg from "@/assets/collection-labgrown.jpg";
import editorialImg from "@/assets/editorial-emerald.jpg";

const banners: Record<ProductCategory, string> = {
  "engagement-rings": engagementImg,
  earrings: earringsImg,
  bracelets: braceletsImg,
  pendants: pendantsImg,
  bridal: bridalImg,
  "lab-grown": labgrownImg,
};

const validCats: ProductCategory[] = [
  "engagement-rings",
  "earrings",
  "bracelets",
  "pendants",
  "bridal",
  "lab-grown",
];

export const Route = createFileRoute("/collections/$category")({
  loader: ({ params }) => {
    if (!validCats.includes(params.category as ProductCategory)) {
      throw notFound();
    }
    return { category: params.category as ProductCategory };
  },
  head: ({ params }) => {
    const key = params.category as ProductCategory;
    const cat = validCats.includes(key) ? categories[key] : undefined;
    const label = cat?.label ?? "Collection";
    return {
      meta: [
        { title: `${label} — Oriva Jewels` },
        { name: "description", content: cat?.blurb ?? "Fine diamond jewellery by Oriva." },
      ],
    };
  },
  component: CollectionPage,
  notFoundComponent: () => (
    <div className="py-40 text-center">
      <p className="eyebrow">Collection</p>
      <h1 className="mt-4 font-serif text-4xl">Not found</h1>
    </div>
  ),
});

function CollectionPage() {
  const data = Route.useLoaderData();
  const category = data.category as ProductCategory;
  const info = categories[category];
  const items = productsByCategory(category);
  const banner = banners[category];

  return (
    <div>
      {/* Cinematic banner */}
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        <img
          src={banner}
          alt={info.label}
          className="absolute inset-0 h-full w-full object-cover opacity-70 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/40 to-ink" />
        <div className="relative mx-auto max-w-[1400px] px-6 pt-40 pb-24 md:px-10 md:pt-56 md:pb-32">
          <p className="eyebrow">The Collections</p>
          <h1 className="mt-6 font-serif text-5xl md:text-8xl leading-[0.95] max-w-3xl">
            {info.label}
          </h1>
          <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-ivory/70">{info.blurb}</p>
        </div>
      </section>

      {/* Editorial intro */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center md:py-28">
        <Reveal>
          <p className="eyebrow">Overview</p>
          <p className="mt-6 font-serif text-2xl md:text-3xl leading-relaxed italic text-foreground/85">
            "A collection curated with intention — every stone, every setting considered."
          </p>
        </Reveal>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-8">
          {/* Filter sidebar */}
          <aside className="md:col-span-2">
            <div className="md:sticky md:top-28 space-y-8">
              <FilterGroup title="Diamond Type" options={["Natural", "Lab Grown"]} />
              <FilterGroup title="Shape" options={["Round", "Marquise", "Oval", "Pear", "Emerald", "Heart"]} />
              <FilterGroup title="Metal" options={["White Gold", "Yellow Gold", "Rose Gold", "Platinum"]} />
              <FilterGroup title="Style" options={["Solitaire", "Halo", "Three Stone", "Pavé"]} />
              <FilterGroup title="Price" options={["Under $2,000", "$2,000 – $5,000", "$5,000 – $15,000", "$15,000+"]} />
            </div>
          </aside>

          <div className="md:col-span-6">
            <div className="mb-8 flex items-center justify-between">
              <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
                {items.length} piece{items.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[11px] tracking-[0.32em] uppercase text-muted-foreground">
                Sort · Featured
              </p>
            </div>

            {items.length === 0 ? (
              <div className="border border-border py-24 text-center">
                <p className="font-serif text-2xl">New pieces coming soon.</p>
                <p className="mt-3 text-sm text-muted-foreground">
                  Message the atelier for pre-launch access.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:gap-10">
                {items.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}

            {/* Storytelling banner */}
            <Reveal className="mt-20">
              <div className="relative overflow-hidden aspect-[16/7]">
                <img src={editorialImg} alt="Oriva Jewels editorial" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-transparent" />
                <div className="relative flex h-full items-center p-8 md:p-14 text-ivory">
                  <div className="max-w-md">
                    <p className="eyebrow text-champagne">The Oriva Difference</p>
                    <p className="mt-4 font-serif text-3xl md:text-4xl italic leading-tight">
                      Every diamond, personally sourced.
                    </p>
                    <Link
                      to="/about"
                      className="mt-6 inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase border-b border-champagne text-champagne pb-1"
                    >
                      Read our story <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div>
      <p className="text-[10px] tracking-[0.32em] uppercase text-foreground pb-3 border-b border-border">
        {title}
      </p>
      <ul className="mt-4 space-y-2.5">
        {options.map((o) => (
          <li key={o}>
            <label className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <input type="checkbox" className="h-3.5 w-3.5 accent-foreground" />
              {o}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
