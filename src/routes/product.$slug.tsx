import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, MessageCircle, ArrowLeft, ShieldCheck, Truck, Sparkles, ArrowRight, ZoomIn } from "lucide-react";

import { findProduct, buildWhatsAppLink, products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} - Oriva Jewels` : "Oriva Jewels" },
      { name: "description", content: loaderData?.product.short ?? "Fine diamond jewellery." },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();

  const [diamondType, setDiamondType] = useState(product.diamondTypes[0]);
  const [karat, setKarat] = useState<"18K" | "14K" | "9K">("18K");
  const [goldColor, setGoldColor] = useState<"White" | "Yellow" | "Rose">(
    product.metal.includes("Yellow") ? "Yellow" : product.metal.includes("Rose") ? "Rose" : "White",
  );
  const [size, setSize] = useState(product.sizes?.[2] ?? "");
  const [carat, setCarat] = useState<number>(1.5);
  const [backing, setBacking] = useState(product.backings?.[0] ?? "");
  const [length, setLength] = useState(product.lengths?.[1] ?? "");
  const [engraving, setEngraving] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const gallery = [product.image, product.image, product.image, product.image];

  const message = useMemo(() => {
    const lines = [
      "Hello Oriva Jewels,",
      "",
      "I'm interested in:",
      `Product: ${product.name}`,
      `Diamond Type: ${diamondType}`,
      `Metal: ${karat} ${goldColor} Gold`,
      `Centre Stone: ${carat.toFixed(2)} ct`,
    ];
    if (product.sizes) lines.push(`Ring Size: ${size}`);
    if (product.backings) lines.push(`Backing: ${backing}`);
    if (product.lengths) lines.push(`Length: ${length}`);
    if (engraving) lines.push(`Engraving: ${engraving}`);
    lines.push(
      "",
      "I would like to attach a reference photo and share more details.",
      "Please share pricing and availability.",
    );
    return lines.join("\n");
  }, [product, diamondType, karat, goldColor, carat, size, backing, length, engraving]);

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);


  return (
    <div className="bg-ink pt-24 md:pt-28">
      <div className="mx-auto max-w-[1600px] px-6 md:px-16">
        <Link
          to="/collections/$category"
          params={{ category: product.category }}
          className="inline-flex items-center gap-2 text-[14px] tracking-[0.4em] uppercase text-ivory/50 hover:text-gold transition"
        >
          <ArrowLeft className="h-3 w-3" /> Back to {product.category.replace("-", " ")}
        </Link>

        <div className="mt-10 grid gap-14 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">

            <button
              type="button"
              onClick={() => setLightboxIndex(0)}
              className="relative overflow-hidden bg-charcoal aspect-[4/5] group border border-white/5 w-full text-left cursor-zoom-in"
              aria-label="Open image gallery"
            >
              <img
                src={product.image}
                alt={product.name}
                fetchPriority="high"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.06]"
              />
              <span
                aria-label="Wishlist"
                onClick={(e) => e.stopPropagation()}
                className="absolute top-5 right-5 grid h-11 w-11 place-items-center bg-obsidian/70 backdrop-blur border border-white/15 text-ivory hover:border-gold hover:text-gold transition"
              >
                <Heart className="h-4 w-4" strokeWidth={1.3} />
              </span>
              <span className="absolute top-5 left-5 text-[14px] tracking-[0.42em] uppercase text-ivory/85 bg-obsidian/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                Ref. OR-{product.slug.slice(0, 4).toUpperCase()}
              </span>
              <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-obsidian/70 backdrop-blur border border-white/15 px-4 py-2 text-[14px] tracking-[0.35em] uppercase text-ivory opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-500">
                <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.4} /> Zoom
              </span>
            </button>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxIndex(i)}
                  className="aspect-square overflow-hidden bg-charcoal border border-white/5 hover:border-gold transition"
                >
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="md:sticky md:top-40">
              <p className="eyebrow">{product.collection}</p>
              <h1 className="mt-5 font-serif text-4xl md:text-6xl leading-[1] text-ivory">{product.name}</h1>
              <p className="mt-6 text-[15px] leading-[1.8] text-ivory/80 max-w-lg">
                {product.description}
              </p>

              <div className="mt-8 hairline-gold w-16" />

              <div className="mt-8 space-y-7">
                <PillGroup
                  label="Diamond"
                  value={diamondType}
                  options={product.diamondTypes}
                  onChange={(v) => setDiamondType(v as typeof diamondType)}
                />
                <PillGroup
                  label="Gold Karat"
                  value={karat}
                  options={["18K", "14K", "9K"]}
                  onChange={(v) => setKarat(v as typeof karat)}
                />
                <PillGroup
                  label="Gold Color"
                  value={goldColor}
                  options={["White", "Yellow", "Rose"]}
                  onChange={(v) => setGoldColor(v as typeof goldColor)}
                />

                <div>
                  <div className="flex items-baseline justify-between">
                    <p className="text-[14px] tracking-[0.42em] uppercase text-gold">Centre Stone</p>
                    <p className="font-serif text-2xl text-ivory">{carat.toFixed(2)} <span className="text-[12px] tracking-[0.3em] uppercase text-ivory/60">ct</span></p>
                  </div>
                  <input
                    type="range"
                    min={0.3}
                    max={10}
                    step={0.1}
                    value={carat}
                    onChange={(e) => setCarat(parseFloat(e.target.value))}
                    className="mt-4 w-full accent-[color:var(--gold)]"
                  />
                  <div className="mt-1 flex justify-between text-[11px] tracking-[0.3em] uppercase text-ivory/55">
                    <span>0.30 ct</span><span>10.00 ct</span>
                  </div>
                </div>

                {product.sizes && (
                  <PillGroup label="Ring Size" value={size} options={product.sizes} onChange={setSize} />
                )}
                {product.backings && (
                  <PillGroup label="Backing" value={backing} options={product.backings} onChange={setBacking} />
                )}
                {product.lengths && (
                  <PillGroup label="Length" value={length} options={product.lengths} onChange={setLength} />
                )}
                <div>
                  <label className="text-[14px] tracking-[0.42em] uppercase text-gold">
                    Engraving (optional)
                  </label>
                  <input
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value.slice(0, 20))}
                    placeholder="Up to 20 characters"
                    className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold transition"
                  />
                </div>
                <p className="text-[12px] leading-[1.7] tracking-[0.06em] text-ivory/60">
                  You may attach a reference photo directly on WhatsApp after tapping enquire.
                </p>
              </div>

              <div className="mt-10 border border-white/10 bg-charcoal/50 p-6">
                <p className="text-[14px] tracking-[0.42em] uppercase text-gold">Your Configuration</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  <dt className="text-ivory/80">Diamond</dt><dd className="text-ivory">{diamondType}</dd>
                  <dt className="text-ivory/80">Metal</dt><dd className="text-ivory">{karat} {goldColor} Gold</dd>
                  <dt className="text-ivory/80">Centre Stone</dt><dd className="text-ivory">{carat.toFixed(2)} ct</dd>
                  {product.sizes && (<><dt className="text-ivory/80">Size</dt><dd className="text-ivory">{size}</dd></>)}
                  {product.backings && (<><dt className="text-ivory/80">Backing</dt><dd className="text-ivory">{backing}</dd></>)}
                  {product.lengths && (<><dt className="text-ivory/80">Length</dt><dd className="text-ivory">{length}</dd></>)}
                  {engraving && (<><dt className="text-ivory/80">Engraving</dt><dd className="text-ivory">"{engraving}"</dd></>)}
                </dl>
              </div>


              <a
                href={buildWhatsAppLink(message)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-3 bg-gold text-obsidian py-5 text-[14px] tracking-[0.4em] uppercase hover:bg-ivory transition group"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Enquire on WhatsApp
              </a>
              <p className="mt-4 text-center text-[14px] tracking-[0.35em] uppercase text-ivory/80">
                Pricing shared privately · Response within 24h
              </p>

              <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                {[
                  { icon: ShieldCheck, t: "Certified" },
                  { icon: Truck, t: "Insured" },
                  { icon: Sparkles, t: "Bespoke" },
                ].map((i) => (
                  <div key={i.t} className="border-t border-white/10 pt-4">
                    <i.icon className="mx-auto h-5 w-5 text-gold" strokeWidth={1.2} />
                    <p className="mt-2.5 text-[14px] tracking-[0.32em] uppercase text-ivory/50">{i.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pb-32">
          <div className="flex items-end justify-between border-b border-white/10 pb-6">
            <div>
              <p className="eyebrow">- The Adjacent</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-ivory">You may also love</h2>
            </div>
            <Link
              to="/collections/$category"
              params={{ category: product.category }}
              className="text-[14px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory hover:border-ivory transition"
            >
              See collection <ArrowRight className="inline h-3 w-3 ml-1" />
            </Link>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
            {related.map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={gallery}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </div>
  );
}

function PillGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <p className="text-[14px] tracking-[0.42em] uppercase text-gold">{label}</p>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`px-4 py-2.5 text-[14px] tracking-[0.15em] transition ${
                active
                  ? "bg-gold text-obsidian"
                  : "border border-white/15 text-ivory/85 hover:border-gold hover:text-gold"
              }`}
            >
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
