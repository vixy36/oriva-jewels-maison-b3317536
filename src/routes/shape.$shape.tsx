import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { products, buildWhatsAppLink } from "@/lib/products";

const SHAPES: Record<string, { label: string; blurb: string; character: string }> = {
  marquise: {
    label: "Marquise",
    blurb: "Elongated and regal — a shape that lengthens the finger and catches light along two apexes.",
    character: "Confident · Elongating",
  },
  oval: {
    label: "Oval",
    blurb: "Softly elongated brilliance. All the fire of a round, in a more modern silhouette.",
    character: "Modern · Timeless",
  },
  emerald: {
    label: "Emerald",
    blurb: "Step-cut clarity and hall-of-mirrors elegance. For those who prefer restraint over sparkle.",
    character: "Architectural · Refined",
  },
  pear: {
    label: "Pear",
    blurb: "Rounded at one end, pointed at the other — a shape of quiet movement, worn point-up.",
    character: "Romantic · Distinctive",
  },
  heart: {
    label: "Heart",
    blurb: "A sculpted expression of devotion. Best in a size that reveals the cut's symmetry.",
    character: "Sentimental · Bold",
  },
  round: {
    label: "Round Brilliant",
    blurb: "The most studied cut in the world. Fifty-eight facets engineered for maximum fire.",
    character: "Classic · Brilliant",
  },
};

export const Route = createFileRoute("/shape/$shape")({
  loader: ({ params }) => {
    const key = params.shape.toLowerCase();
    const meta = SHAPES[key];
    if (!meta) throw notFound();
    const list = products.filter((p) => p.shape.toLowerCase().includes(key));
    return { key, meta, list };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Shape — Oriva Jewels" }, { name: "robots", content: "noindex" }] };
    const { meta } = loaderData;
    return {
      meta: [
        { title: `${meta.label} Diamond Jewellery — Oriva Jewels` },
        { name: "description", content: meta.blurb },
        { property: "og:title", content: `${meta.label} — Oriva Jewels` },
        { property: "og:description", content: meta.blurb },
      ],
    };
  },
  component: ShapePage,
  notFoundComponent: ShapeNotFound,
});

function ShapePage() {
  const { meta, list } = Route.useLoaderData();
  return (
    <div className="bg-obsidian text-ivory">
      <section className="pt-40 pb-16 md:pt-52 md:pb-24 border-b border-white/5">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16">
          <p className="eyebrow">— Shop by Shape</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92]">
            {meta.label}<span className="text-gold">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[15px] leading-[1.9] text-ivory/85">{meta.blurb}</p>
          <p className="mt-6 text-[13px] tracking-[0.4em] uppercase text-gold">{meta.character}</p>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-ink">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16">
          {list.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-serif text-3xl md:text-4xl text-ivory">
                No archive pieces in <em className="text-gold-gradient">{meta.label}</em> — yet.
              </p>
              <p className="mt-6 text-[15px] text-ivory/70">
                Every Oriva piece can be re-cut to your chosen shape. Speak with our atelier.
              </p>
              <a
                href={buildWhatsAppLink(`Hello Oriva, I'd like a ${meta.label} diamond piece.`)}
                target="_blank"
                rel="noreferrer"
                className="mt-10 inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
              >
                Enquire via WhatsApp <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 md:gap-x-10 md:gap-y-20">
              {list.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-24 flex flex-wrap justify-center gap-3 border-t border-white/10 pt-16">
            <p className="w-full text-center eyebrow mb-6">Explore other shapes</p>
            {Object.entries(SHAPES).map(([k, v]) => (
              <Link
                key={k}
                to="/shape/$shape"
                params={{ shape: k }}
                className="px-5 py-2.5 border border-white/15 text-[12px] tracking-[0.32em] uppercase text-ivory/80 hover:border-gold hover:text-gold transition"
              >
                {v.label}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function ShapeNotFound() {
  return (
    <div className="min-h-[70svh] grid place-items-center bg-obsidian text-ivory px-6">
      <div className="text-center">
        <p className="eyebrow">Shape unavailable</p>
        <h1 className="mt-6 font-serif text-5xl md:text-6xl">This shape hasn't found its chapter.</h1>
        <Link to="/" className="mt-10 inline-flex items-center gap-3 text-[11px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1">
          Return home <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
