import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { SortSelect, useSortedProducts } from "@/components/site/SortSelect";
import { categories, productsByCategory, type ProductCategory } from "@/lib/products";
import { useDbProductsByCategory } from "@/lib/dbProducts";



import engagementImg from "@/assets/collection-engagement.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import braceletsImg from "@/assets/product-tennis.jpg";

import pendantHero from "@/assets/pendant-hero.jpg.asset.json";
import bridalImg from "@/assets/collection-bridal.jpg";
import labgrownImg from "@/assets/collection-labgrown.jpg";
import editorialImg from "@/assets/editorial-emerald.jpg";

const banners: Record<ProductCategory, string> = {
  "engagement-rings": engagementImg,
  rings: engagementImg,
  earrings: earringsImg,
  bracelets: braceletsImg,
  necklaces: pendantHero.url,
  pendants: pendantHero.url,
  "mens-jewelry": braceletsImg,
  "hip-hop-jewelry": braceletsImg,
  bridal: bridalImg,
  "lab-grown": labgrownImg,
  natural: engagementImg,
};

// Categories whose hero image should be shown fully (no crop)
const containCats = new Set<ProductCategory>(["pendants", "necklaces"]);


const validCats: ProductCategory[] = [
  "engagement-rings",
  "rings",
  "earrings",
  "bracelets",
  "necklaces",
  "pendants",
  "mens-jewelry",
  "hip-hop-jewelry",
  "bridal",
  "lab-grown",
  "natural",
];

export const Route = createFileRoute("/collections/$category")({
  loader: ({ params }) => {
    if (!validCats.includes(params.category as ProductCategory)) throw notFound();
    return { category: params.category as ProductCategory };
  },
  head: ({ params }) => {
    const key = params.category as ProductCategory;
    const cat = validCats.includes(key) ? categories[key] : undefined;
    const label = cat?.label ?? "Collection";
    return {
      meta: [
        { title: `${label} - Oriva Jewels` },
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
  const staticItems = productsByCategory(category);
  const { data: dbItems = [] } = useDbProductsByCategory(category);
  const items = [...dbItems, ...staticItems];
  const { sort, setSort, sorted } = useSortedProducts(items);
  const banner = banners[category];
  const labelWords = info.label.split(" ");


  return (
    <div className="bg-ink">
      <section className={`relative isolate overflow-hidden text-ivory min-h-[38svh] md:min-h-[48svh] flex items-end ${containCats.has(category) ? "bg-[#071c37]" : "bg-obsidian"}`}>
        <img
          src={banner}
          alt={info.label}
          className={`absolute inset-0 h-full w-full ${containCats.has(category) ? "object-contain object-center" : "object-cover opacity-70 animate-slow-zoom"}`}
        />
        {!containCats.has(category) && <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/30 to-obsidian" />}
        {!containCats.has(category) && <div className="absolute inset-0 vignette" />}

        <div className="relative mx-auto max-w-[1500px] w-full px-6 pt-24 pb-6 md:px-16 md:pt-28 md:pb-8">
          <h1 className="font-serif text-5xl md:text-7xl leading-[0.95] tracking-[-0.02em]">
            {labelWords.map((w, i) => (
              <span key={i} className={i === labelWords.length - 1 ? "italic text-gold-gradient" : ""}>
                {w}{i < labelWords.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>
          <p className="mt-4 max-w-lg text-[14px] leading-[1.7] text-ivory/75">{info.blurb}</p>
        </div>
      </section>

      <section className="mx-auto max-w-[1500px] px-6 py-20 md:px-16 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <aside className="md:col-span-3">
            {/* Mobile: collapsible dropdown */}
            <details className="md:hidden group border border-white/10 bg-obsidian/40 backdrop-blur">
              <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-[13px] tracking-[0.4em] uppercase text-ivory">
                <span className="flex items-center gap-3">
                  <SlidersHorizontal className="h-4 w-4 text-gold" strokeWidth={1.4} />
                  Refine
                </span>
                <ChevronDown className="h-4 w-4 text-gold transition-transform duration-300 group-open:rotate-180" strokeWidth={1.4} />
              </summary>
              <div className="px-5 pb-6 pt-2 space-y-8 border-t border-white/10">
                <FilterGroup title="Diamond" options={["Natural", "Lab Grown"]} />
                <FilterGroup title="Shape" options={["Round", "Marquise", "Oval", "Pear", "Emerald", "Heart"]} />
                <FilterGroup title="Metal" options={["White Gold", "Yellow Gold", "Rose Gold", "Platinum"]} />
                <FilterGroup title="Style" options={["Solitaire", "Halo", "Three Stone", "Pavé"]} />
              </div>
            </details>

            {/* Desktop: sticky sidebar */}
            <div className="hidden md:block md:sticky md:top-40 space-y-10">
              <FilterGroup title="Diamond" options={["Natural", "Lab Grown"]} />
              <FilterGroup title="Shape" options={["Round", "Marquise", "Oval", "Pear", "Emerald", "Heart"]} />
              <FilterGroup title="Metal" options={["White Gold", "Yellow Gold", "Rose Gold", "Platinum"]} />
              <FilterGroup title="Style" options={["Solitaire", "Halo", "Three Stone", "Pavé"]} />
            </div>
          </aside>

          <div className="md:col-span-9">
            <div className="mb-10 flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-5">
              <p className="text-[12px] md:text-[14px] tracking-[0.4em] uppercase text-ivory/55">
                {sorted.length} piece{sorted.length !== 1 ? "s" : ""}
              </p>
              <SortSelect value={sort} onChange={setSort} />
            </div>

            {sorted.length === 0 ? (
              <div className="border border-white/10 py-32 text-center">
                <p className="eyebrow">Coming Soon</p>
                <p className="mt-6 font-serif text-3xl text-ivory">New pieces in preparation.</p>
                <p className="mt-3 text-sm text-ivory/50">Message the atelier for pre-launch access.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-5 gap-y-12 md:gap-x-8 md:gap-y-16 lg:grid-cols-3">
                {sorted.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}



          </div>
        </div>
      </section>
    </div>
  );
}


function FilterGroup({ title, options }: { title: string; options: string[] }) {
  return (
    <div>
      <p className="text-[14px] font-bold tracking-[0.42em] uppercase text-gold pb-3 border-b border-white/10">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {options.map((o) => (
          <li key={o}>
            <label className="flex items-center gap-3 text-sm font-bold text-ivory/60 hover:text-ivory cursor-pointer transition">
              <span className="grid h-3.5 w-3.5 place-items-center border border-white/20" />
              {o}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
