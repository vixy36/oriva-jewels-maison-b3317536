import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, MessageCircle, ArrowLeft, ShieldCheck, Truck, Sparkles } from "lucide-react";

import { findProduct, buildWhatsAppLink, products } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Tilt3D } from "@/components/site/Tilt3D";

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
    <div className="pt-24 md:pt-28">
      <div className="mx-auto max-w-[1500px] px-6 md:px-10">
        <Link
          to="/collections/$category"
          params={{ category: product.category }}
          className="inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-3 w-3" /> Back to collection
        </Link>

        <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* Gallery */}
          <div className="space-y-4">
            <Tilt3D max={9} className="aspect-[4/5]">
              <div className="relative h-full w-full overflow-hidden bg-secondary group">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                />
                <button
                  aria-label="Wishlist"
                  className="absolute top-5 right-5 grid h-11 w-11 place-items-center rounded-full bg-diamond/85 backdrop-blur border border-white/40"
                >
                  <Heart className="h-4 w-4" strokeWidth={1.4} />
                </button>
              </div>
            </Tilt3D>
            <div className="grid grid-cols-4 gap-3">
              {[product.image, product.image, product.image, product.image].map((src, i) => (
                <button key={i} className="aspect-square overflow-hidden bg-secondary ring-1 ring-transparent hover:ring-champagne transition">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="md:sticky md:top-28 md:self-start">
            <p className="eyebrow">{product.collection}</p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl leading-[1.05]">{product.name}</h1>
            <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground max-w-lg">
              {product.description}
            </p>

            <div className="mt-8 hairline" />

            <div className="mt-8 space-y-7">
              <PillGroup
                label="Diamond Type"
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
                  <label className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground">
                    Engraving (optional)
                  </label>
                  <input
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value.slice(0, 20))}
                    placeholder="Up to 20 characters"
                    className="mt-3 w-full border-b border-border bg-transparent py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
              )}
            </div>

            {/* Selected config */}
            <div className="mt-10 border border-border bg-secondary/40 p-6">
              <p className="text-[10px] tracking-[0.32em] uppercase text-champagne">Your Configuration</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <dt className="text-muted-foreground">Diamond</dt><dd>{diamondType}</dd>
                <dt className="text-muted-foreground">Metal</dt><dd>{metal}</dd>
                {product.carats && (<><dt className="text-muted-foreground">Carat</dt><dd>{carat}</dd></>)}
                {product.sizes && (<><dt className="text-muted-foreground">Size</dt><dd>{size}</dd></>)}
                {product.backings && (<><dt className="text-muted-foreground">Backing</dt><dd>{backing}</dd></>)}
                {product.lengths && (<><dt className="text-muted-foreground">Length</dt><dd>{length}</dd></>)}
                {engraving && (<><dt className="text-muted-foreground">Engraving</dt><dd>"{engraving}"</dd></>)}
              </dl>
            </div>

            <a
              href={buildWhatsAppLink(message)}
              target="_blank"
              rel="noreferrer"
              className="mt-6 flex items-center justify-center gap-3 bg-ink text-ivory py-5 text-[11px] tracking-[0.32em] uppercase hover:bg-emerald-deep transition group"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
              Enquire on WhatsApp
            </a>

            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              {[
                { icon: ShieldCheck, t: "Certified" },
                { icon: Truck, t: "Insured Shipping" },
                { icon: Sparkles, t: "Bespoke" },
              ].map((i) => (
                <div key={i.t} className="border-t border-border pt-4">
                  <i.icon className="mx-auto h-5 w-5 text-champagne" strokeWidth={1.3} />
                  <p className="mt-2 text-[10px] tracking-[0.28em] uppercase text-muted-foreground">{i.t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        <div className="mt-32 pb-24">
          <div className="flex items-end justify-between">
            <h2 className="font-serif text-3xl md:text-4xl">You may also love</h2>
            <Link
              to="/collections/$category"
              params={{ category: product.category }}
              className="text-[10px] tracking-[0.32em] uppercase border-b border-foreground pb-1"
            >
              See all
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10">
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
      <p className="text-[10px] tracking-[0.32em] uppercase text-muted-foreground">{label}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`rounded-full border px-4 py-2 text-xs tracking-wide transition ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-transparent text-foreground hover:border-foreground"
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
