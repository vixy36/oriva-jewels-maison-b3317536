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

const chapterN: Record<ProductCategory, string> = {
  "engagement-rings": "01",
  earrings: "02",
  bracelets: "03",
  pendants: "04",
  bridal: "05",
  "lab-grown": "06",
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
    if (!validCats.includes(params.category as ProductCategory)) throw notFound();
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
  const labelWords = info.label.split(" ");

  return (
    <div className="bg-ink">
      <section className="relative isolate overflow-hidden bg-obsidian text-ivory min-h-[75svh] flex items-end">
        <img
          src={banner}
          alt={info.label}
          className="absolute inset-0 h-full w-full object-cover opacity-70 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/30 to-obsidian" />
        <div className="absolute inset-0 vignette" />

        <div className="relative mx-auto max-w-[1500px] w-full px-6 pt-48 pb-20 md:px-16 md:pt-56 md:pb-28">
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
            <div className="md:sticky md:top-40 space-y-10">
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
              <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 md:gap-y-20">
                {items.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <ProductCard product={p} />
                  </Reveal>
                ))}
              </div>
            )}

            <Reveal className="mt-24">
              <div className="relative overflow-hidden aspect-[16/7] md:aspect-[16/6] border border-white/10">
                <img src={editorialImg} alt="Oriva Jewels editorial" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-obsidian/85 via-obsidian/40 to-transparent" />
                <div className="relative flex h-full items-center p-8 md:p-16 text-ivory">
                  <div className="max-w-md">
                    <p className="eyebrow">— The Oriva Way</p>
                    <p className="mt-6 font-serif text-3xl md:text-5xl leading-[1] italic">
                      Every diamond, <span className="text-gold-gradient">personally sourced.</span>
                    </p>
                    <Link
                      to="/about"
                      className="mt-8 inline-flex items-center gap-2 text-[14px] tracking-[0.4em] uppercase border-b border-gold text-gold pb-1 hover:text-ivory hover:border-ivory transition"
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
