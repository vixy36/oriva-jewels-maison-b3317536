import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, MessageCircle, ArrowLeft, ShieldCheck, Truck, Sparkles, ArrowRight } from "lucide-react";

import { findProduct, buildWhatsAppLink, products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = findProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData ? `${loaderData.product.name} — Oriva Jewels` : "Oriva Jewels" },
      { name: "description", content: loaderData?.product.short ?? "Fine diamond jewellery." },
      { property: "og:image", content: loaderData?.product.image ?? "" },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();

  const [diamondType, setDiamondType] = useState(product.diamondTypes[0]);
  const [metal, setMetal] = useState(product.metal);
  const [size, setSize] = useState(product.sizes?.[2] ?? "");
  const [carat, setCarat] = useState(product.carats?.[1] ?? "");
  const [backing, setBacking] = useState(product.backings?.[0] ?? "");
  const [length, setLength] = useState(product.lengths?.[1] ?? "");
  const [engraving, setEngraving] = useState("");

  const metalOptions = ["18K White Gold", "18K Yellow Gold", "18K Rose Gold", "Platinum 950"];

  const message = useMemo(() => {
    const lines = [
      "Hello Oriva Jewels,",
      "",
      "I'm interested in:",
      `Product: ${product.name}`,
      `Diamond Type: ${diamondType}`,
      `Metal: ${metal}`,
    ];
    if (product.sizes) lines.push(`Ring Size: ${size}`);
    if (product.carats) lines.push(`Carat: ${carat}`);
    if (product.backings) lines.push(`Backing: ${backing}`);
    if (product.lengths) lines.push(`Length: ${length}`);
    if (engraving) lines.push(`Engraving: ${engraving}`);
    lines.push("", "Please share pricing and availability.");
    return lines.join("\n");
  }, [product, diamondType, metal, size, carat, backing, length, engraving]);

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);

  return (
    <div className="bg-ink pt-32 md:pt-36">
      <div className="mx-auto max-w-[1600px] px-6 md:px-16">
        <Link
          to="/collections/$category"
          params={{ category: product.category }}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.4em] uppercase text-ivory/50 hover:text-gold transition"
        >
          <ArrowLeft className="h-3 w-3" /> Back to {product.category.replace("-", " ")}
        </Link>

        <div className="mt-10 grid gap-14 md:grid-cols-12 md:gap-20">
          <div className="md:col-span-7">
            <div className="relative overflow-hidden bg-charcoal aspect-[4/5] group border border-white/5">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.06]"
              />
              <button
                aria-label="Wishlist"
                className="absolute top-5 right-5 grid h-11 w-11 place-items-center bg-obsidian/70 backdrop-blur border border-white/15 text-ivory hover:border-gold hover:text-gold transition"
              >
                <Heart className="h-4 w-4" strokeWidth={1.3} />
              </button>
              <span className="absolute top-5 left-5 text-[9px] tracking-[0.42em] uppercase text-ivory/70 bg-obsidian/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                Ref. OR-{product.slug.slice(0, 4).toUpperCase()}
              </span>
            </div>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <button key={i} className="aspect-square overflow-hidden bg-charcoal border border-white/5 hover:border-gold transition">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="md:sticky md:top-40">
              <p className="eyebrow">{product.collection}</p>
              <h1 className="mt-5 font-serif text-4xl md:text-6xl leading-[1] text-ivory">{product.name}</h1>
              <p className="mt-6 text-[15px] leading-[1.8] text-ivory/65 max-w-lg">
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
                <PillGroup label="Metal" value={metal} options={metalOptions} onChange={setMetal} />
                {product.carats && (
                  <PillGroup label="Carat" value={carat} options={product.carats} onChange={setCarat} />
                )}
                {product.sizes && (
                  <PillGroup label="Ring Size" value={size} options={product.sizes} onChange={setSize} />
                )}
                {product.backings && (
                  <PillGroup label="Backing" value={backing} options={product.backings} onChange={setBacking} />
                )}
                {product.lengths && (
                  <PillGroup label="Length" value={length} options={product.lengths} onChange={setLength} />
                )}
                {product.sizes && (
                  <div>
                    <label className="text-[9.5px] tracking-[0.42em] uppercase text-gold">
                      Engraving (optional)
                    </label>
                    <input
                      value={engraving}
                      onChange={(e) => setEngraving(e.target.value.slice(0, 20))}
                      placeholder="Up to 20 characters"
                      className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/25 outline-none focus:border-gold transition"
                    />
                  </div>
                )}
              </div>

              <div className="mt-10 border border-white/10 bg-charcoal/50 p-6">
                <p className="text-[9.5px] tracking-[0.42em] uppercase text-gold">Your Configuration</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  <dt className="text-ivory/40">Diamond</dt><dd className="text-ivory">{diamondType}</dd>
                  <dt className="text-ivory/40">Metal</dt><dd className="text-ivory">{metal}</dd>
                  {product.carats && (<><dt className="text-ivory/40">Carat</dt><dd className="text-ivory">{carat}</dd></>)}
                  {product.sizes && (<><dt className="text-ivory/40">Size</dt><dd className="text-ivory">{size}</dd></>)}
                  {product.backings && (<><dt className="text-ivory/40">Backing</dt><dd className="text-ivory">{backing}</dd></>)}
                  {product.lengths && (<><dt className="text-ivory/40">Length</dt><dd className="text-ivory">{length}</dd></>)}
                  {engraving && (<><dt className="text-ivory/40">Engraving</dt><dd className="text-ivory">"{engraving}"</dd></>)}
                </dl>
              </div>

              <a
                href={buildWhatsAppLink(message)}
                target="_blank"
                rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-3 bg-gold text-obsidian py-5 text-[11px] tracking-[0.4em] uppercase hover:bg-ivory transition group"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Enquire on WhatsApp
              </a>
              <p className="mt-4 text-center text-[10px] tracking-[0.35em] uppercase text-ivory/40">
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
                    <p className="mt-2.5 text-[9.5px] tracking-[0.32em] uppercase text-ivory/50">{i.t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32 pb-32">
          <div className="flex items-end justify-between border-b border-white/10 pb-6">
            <div>
              <p className="eyebrow">— The Adjacent</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl text-ivory">You may also love</h2>
            </div>
            <Link
              to="/collections/$category"
              params={{ category: product.category }}
              className="text-[10px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory hover:border-ivory transition"
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
      <p className="text-[9.5px] tracking-[0.42em] uppercase text-gold">{label}</p>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`px-4 py-2.5 text-[11px] tracking-[0.15em] transition ${
                active
                  ? "bg-ivory text-obsidian"
                  : "border border-white/15 text-ivory/70 hover:border-gold hover:text-gold"
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
