import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, MessageCircle, ArrowLeft, ShieldCheck, Truck, Sparkles, ArrowRight, ZoomIn, ChevronLeft, ChevronRight, Play } from "lucide-react";

import { findProduct, buildWhatsAppLink, products, type Product, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { supabase } from "@/integrations/supabase/client";

async function fetchDbBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("slug,name,category,subcategory,short_description,description,images,video_url,diamond_type,is_active")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  const dt = (data.diamond_type || "Both").toLowerCase();
  const diamondTypes: ("Natural" | "Lab Grown")[] =
    dt === "natural" ? ["Natural"] : dt === "lab grown" ? ["Lab Grown"] : ["Natural", "Lab Grown"];
  const imgs = (data.images as string[] | null) ?? [];
  return {
    slug: data.slug,
    name: data.name,
    category: data.category as ProductCategory,
    collection: data.subcategory || "Oriva",
    short: data.short_description || "",
    description: data.description || "",
    image: imgs[0] || "",
    images: imgs,
    videoUrl: (data as { video_url?: string | null }).video_url ?? undefined,
    shape: "—",
    metal: "18K White Gold",
    diamondTypes,
    customizable: true,
  };
}

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }) => {
    const product = findProduct(params.slug) ?? (await fetchDbBySlug(params.slug));
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


type MediaItem = { type: "image" | "video"; src: string };

function ProductPage() {
  const { product } = Route.useLoaderData();

  const [diamondType, setDiamondType] = useState(product.diamondTypes[0]);
  const [karat, setKarat] = useState<"18K" | "14K" | "9K">("18K");
  const [goldColor, setGoldColor] = useState<"White" | "Yellow" | "Rose">(
    product.metal.includes("Yellow") ? "Yellow" : product.metal.includes("Rose") ? "Rose" : "White",
  );
  const [size, setSize] = useState(product.sizes?.[2] ?? "");
  const [caratFrom, setCaratFrom] = useState<string>("1.00");
  const [caratTo, setCaratTo] = useState<string>("2.00");
  const [backing, setBacking] = useState(product.backings?.[0] ?? "");
  const [length, setLength] = useState(product.lengths?.[1] ?? "");
  const [engraving, setEngraving] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  const imageList: string[] = ((product.images && product.images.length ? product.images : [product.image]) as string[]).filter(Boolean);
  const media: MediaItem[] = [
    ...imageList.map((src) => ({ type: "image" as const, src })),
    ...(product.videoUrl ? [{ type: "video" as const, src: product.videoUrl }] : []),
  ];
  const safeIdx = Math.min(activeIdx, media.length - 1);
  const current = media[safeIdx];
  const gallery = imageList;


  const message = useMemo(() => {
    const lines = [
      "Hello Oriva Jewels,",
      "",
      "I'm interested in:",
      `Product: ${product.name}`,
      `Diamond Type: ${diamondType}`,
      `Metal: ${karat} ${goldColor} Gold`,
      `Centre Stone: ${caratFrom} ct - ${caratTo} ct`,
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
  }, [product, diamondType, karat, goldColor, caratFrom, caratTo, size, backing, length, engraving]);

  const related = products.filter((p) => p.slug !== product.slug).slice(0, 3);


  return (
    <div className="bg-ink pt-16 md:pt-20">
      <div className="mx-auto max-w-[1600px] px-6 md:px-16">
        <Link
          to="/collections/$category"
          params={{ category: product.category }}
          className="inline-flex items-center gap-2 text-[12px] tracking-[0.4em] uppercase text-ivory/50 hover:text-gold transition"
        >
          <ArrowLeft className="h-3 w-3" /> Back to {product.category.replace("-", " ")}
        </Link>

        <div className="mt-4 md:mt-6 grid gap-10 md:grid-cols-12 md:gap-14">

          <div className="md:col-span-8">
            <div className="relative overflow-hidden bg-charcoal aspect-[4/5] md:aspect-[5/6] group border border-white/5 w-full">
              {current?.type === "video" ? (
                <video
                  src={current.src}
                  controls
                  playsInline
                  className="h-full w-full object-cover bg-obsidian"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setLightboxIndex(imageList.indexOf(current?.src ?? ""))}
                  className="block h-full w-full text-left cursor-zoom-in"
                  aria-label="Open image gallery"
                >
                  <img
                    src={current?.src}
                    alt={product.name}
                    fetchPriority="high"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.05]"
                  />
                  <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-obsidian/70 backdrop-blur border border-white/15 px-4 py-2 text-[12px] tracking-[0.35em] uppercase text-ivory opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-500">
                    <ZoomIn className="h-3.5 w-3.5" strokeWidth={1.4} /> Zoom
                  </span>
                </button>
              )}

              <span
                role="button"
                tabIndex={0}
                aria-label="Wishlist"
                className="absolute top-5 right-5 grid h-11 w-11 place-items-center bg-obsidian/70 backdrop-blur border border-white/15 text-ivory hover:border-gold hover:text-gold transition"
              >
                <Heart className="h-4 w-4" strokeWidth={1.3} />
              </span>
              <span className="absolute top-5 left-5 text-[12px] tracking-[0.42em] uppercase text-ivory/85 bg-obsidian/60 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                Ref. OR-{product.slug.slice(0, 4).toUpperCase()}
              </span>

              {media.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => setActiveIdx((safeIdx - 1 + media.length) % media.length)}
                    aria-label="Previous"
                    className="absolute left-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center bg-obsidian/70 backdrop-blur border border-white/15 text-ivory hover:border-gold hover:text-gold transition"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.4} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveIdx((safeIdx + 1) % media.length)}
                    aria-label="Next"
                    className="absolute right-4 top-1/2 -translate-y-1/2 grid h-11 w-11 place-items-center bg-obsidian/70 backdrop-blur border border-white/15 text-ivory hover:border-gold hover:text-gold transition"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.4} />
                  </button>
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[11px] tracking-[0.4em] uppercase text-ivory/70 bg-obsidian/60 backdrop-blur px-3 py-1 border border-white/10">
                    {String(safeIdx + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
                  </div>
                </>
              )}
            </div>

            {media.length > 1 && (
              <div className="mt-4 grid grid-cols-5 md:grid-cols-6 gap-2.5">
                {media.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveIdx(i)}
                    className={`relative aspect-square overflow-hidden bg-charcoal border transition ${
                      i === safeIdx ? "border-gold" : "border-white/10 hover:border-white/40"
                    }`}
                    aria-label={m.type === "video" ? "Video" : `Image ${i + 1}`}
                  >
                    {m.type === "video" ? (
                      <>
                        <video src={m.src} muted playsInline className="h-full w-full object-cover" />
                        <span className="absolute inset-0 grid place-items-center bg-obsidian/40">
                          <Play className="h-5 w-5 text-ivory" strokeWidth={1.6} />
                        </span>
                      </>
                    ) : (
                      <img src={m.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4">

            <div className="md:sticky md:top-40">
              <p className="eyebrow">{product.collection}</p>
              <h1 className="mt-5 font-serif text-3xl md:text-4xl leading-[1] text-ivory">{product.name}</h1>
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
                    <p className="text-[14px] tracking-[0.42em] uppercase text-gold">Centre Stone Size</p>
                    <p className="text-[11px] tracking-[0.3em] uppercase text-ivory/60">Carats</p>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <label className="block">
                      <span className="text-[11px] tracking-[0.3em] uppercase text-ivory/60">From</span>
                      <input
                        type="number"
                        min={0.1}
                        max={20}
                        step={0.05}
                        value={caratFrom}
                        onChange={(e) => setCaratFrom(e.target.value)}
                        placeholder="e.g. 1.00"
                        className="mt-2 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold transition"
                      />
                    </label>
                    <label className="block">
                      <span className="text-[11px] tracking-[0.3em] uppercase text-ivory/60">To</span>
                      <input
                        type="number"
                        min={0.1}
                        max={20}
                        step={0.05}
                        value={caratTo}
                        onChange={(e) => setCaratTo(e.target.value)}
                        placeholder="e.g. 2.00"
                        className="mt-2 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold transition"
                      />
                    </label>
                  </div>
                  <p className="mt-2 text-[11px] tracking-[0.06em] text-ivory/55">Enter your preferred carat range manually.</p>
                </div>

                {product.sizes && (
                  <PillGroup label="Ring Size" value={size} options={product.sizes} onChange={setSize} />
                )}
                {product.backings && (
                  <PillGroup label="Backing" value={backing} options={product.backings} onChange={setBacking} />
                )}
                {product.lengths && (
                  <PillGroup label={product.category === "bracelets" ? "Bracelet Length (in / cm)" : "Length"} value={length} options={product.lengths} onChange={setLength} />
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
                  <dt className="text-ivory/80">Centre Stone</dt><dd className="text-ivory">{caratFrom} - {caratTo} ct</dd>
                  {product.sizes && (<><dt className="text-ivory/80">Size</dt><dd className="text-ivory">{size}</dd></>)}
                  {product.backings && (<><dt className="text-ivory/80">Backing</dt><dd className="text-ivory">{backing}</dd></>)}
                  {product.lengths && (<><dt className="text-ivory/80">Length</dt><dd className="text-ivory">{length}</dd></>)}
                  {engraving && (<><dt className="text-ivory/80">Engraving</dt><dd className="text-ivory">"{engraving}"</dd></>)}
                </dl>
              </div>


              <button
                type="button"
                onClick={async () => {
                  const configuration = {
                    diamondType, karat, goldColor, caratFrom, caratTo,
                    size: product.sizes ? size : undefined,
                    backing: product.backings ? backing : undefined,
                    length: product.lengths ? length : undefined,
                    engraving: engraving || undefined,
                  };
                  try {
                    await supabase.from("enquiries").insert({
                      name: "WhatsApp Product Enquiry",
                      message: message,
                      source: "whatsapp_product",
                      product_slug: product.slug,
                      subject: product.name,
                      configuration,
                      metadata: { productName: product.name, category: product.category },
                    });
                  } catch {}
                  window.open(buildWhatsAppLink(message), "_blank", "noopener");
                }}
                className="mt-5 flex w-full items-center justify-center gap-3 bg-gold text-obsidian py-5 text-[14px] tracking-[0.4em] uppercase hover:bg-ivory transition group cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Enquire on WhatsApp
              </button>
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
              <h2 className="mt-4 font-serif text-2xl md:text-4xl text-ivory">You may also love</h2>
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
      <p className="text-[14px] font-bold tracking-[0.42em] uppercase text-gold">{label}</p>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {options.map((o) => {
          const active = o === value;
          return (
            <button
              key={o}
              type="button"
              onClick={() => onChange(o)}
              className={`px-4 py-2.5 text-[14px] font-bold tracking-[0.15em] transition ${
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
