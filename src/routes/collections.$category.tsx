import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { categories, productsByCategory, type ProductCategory } from "@/lib/products";
import { useDbProductsByCategory } from "@/lib/dbProducts";


import engagementImg from "@/assets/collection-engagement.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import braceletsImg from "@/assets/product-tennis.jpg";
import pendantsImg from "@/assets/collection-pendants.jpg";
import bridalImg from "@/assets/collection-bridal.jpg";
import labgrownImg from "@/assets/collection-labgrown.jpg";
import editorialImg from "@/assets/editorial-emerald.jpg";

const banners: Record<ProductCategory, string> = {
  "engagement-rings": engagementImg,
  rings: engagementImg,
  earrings: earringsImg,
  bracelets: braceletsImg,
  necklaces: pendantsImg,
  pendants: pendantsImg,
  "mens-jewelry": braceletsImg,
  bridal: bridalImg,
  "lab-grown": labgrownImg,
  natural: engagementImg,
};

const chapterN: Record<ProductCategory, string> = {
  "engagement-rings": "01",
  rings: "02",
  earrings: "03",
  bracelets: "04",
  necklaces: "05",
  pendants: "06",
  "mens-jewelry": "07",
  bridal: "08",
  "lab-grown": "09",
  natural: "10",
};

const validCats: ProductCategory[] = [
  "engagement-rings",
  "rings",
  "earrings",
  "bracelets",
  "necklaces",
  "pendants",
  "mens-jewelry",
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
  const banner = banners[category];
  const labelWords = info.label.split(" ");


  return (
    <div className="bg-ink">
      <section className="relative isolate overflow-hidden bg-obsidian text-ivory min-h-[38svh] md:min-h-[42svh] flex items-end">
        <img
          src={banner}
          alt={info.label}
          className="absolute inset-0 h-full w-full object-cover opacity-70 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/30 to-obsidian" />
        <div className="absolute inset-0 vignette" />

        <div className="relative mx-auto max-w-[1500px] w-full px-6 pt-28 pb-8 md:px-16 md:pt-32 md:pb-10">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <p className="eyebrow">Chapter {chapterN[category]}</p>
          </div>
          <h1 className="mt-8 font-serif text-6xl md:text-[9rem] leading-[0.9] tracking-[-0.02em]">
            {labelWords.map((w, i) => (
              <span key={i} className={`block ${i === labelWords.length - 1 ? "italic text-gold-gradient" : ""}`}>
                {w}
              </span>
            ))}
          </h1>
          <p className="mt-8 max-w-lg text-[15px] leading-[1.8] text-ivory/80">{info.blurb}</p>
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
            <div className="mb-10 flex items-center justify-between border-b border-white/8 pb-5">
              <p className="text-[14px] tracking-[0.4em] uppercase text-ivory/50">
                {items.length} piece{items.length !== 1 ? "s" : ""}
              </p>
              <p className="text-[14px] tracking-[0.4em] uppercase text-ivory/50">
                Sorted · Featured
              </p>
            </div>

            {items.length === 0 ? (
              <div className="border border-white/10 py-32 text-center">
                <p className="eyebrow">Coming Soon</p>
                <p className="mt-6 font-serif text-3xl text-ivory">New pieces in preparation.</p>
                <p className="mt-3 text-sm text-ivory/50">Message the atelier for pre-launch access.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-4">
                {items.map((p, i) => (
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
      <p className="text-[14px] tracking-[0.42em] uppercase text-gold pb-3 border-b border-white/10">
        {title}
      </p>
      <ul className="mt-5 space-y-3">
        {options.map((o) => (
          <li key={o}>
            <label className="flex items-center gap-3 text-sm text-ivory/60 hover:text-ivory cursor-pointer transition">
              <span className="grid h-3.5 w-3.5 place-items-center border border-white/20" />
              {o}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
