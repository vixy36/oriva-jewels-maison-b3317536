import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Heart, MessageCircle, ArrowLeft, ShieldCheck, Truck, Sparkles, ArrowRight, ZoomIn, ChevronLeft, ChevronRight, Play } from "lucide-react";

import { findProduct, buildWhatsAppLink, products, type Product, type ProductCategory } from "@/lib/products";
import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { Lightbox } from "@/components/site/Lightbox";
import { supabase } from "@/integrations/supabase/client";
import { useWishlist } from "@/lib/wishlist";
import { detectVideo } from "@/lib/video-embed";

async function fetchDbBySlug(slug: string): Promise<Product | null> {
  const { data } = await supabase
    .from("products")
    .select("slug,name,category,subcategory,short_description,description,images,video_url,diamond_type,is_active,product_code,price_from,mrp,currency,show_price,metal_options")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();
  if (!data) return null;
  const dt = (data.diamond_type || "Both").toLowerCase();
  const diamondTypes: ("Natural" | "Lab Grown")[] =
    dt === "natural" ? ["Natural"] : dt === "lab grown" ? ["Lab Grown"] : ["Natural", "Lab Grown"];
  const imgs = (data.images as string[] | null) ?? [];
  const rawVariants = (data as { metal_options?: unknown }).metal_options;
  const variants = Array.isArray(rawVariants)
    ? (rawVariants as any[])
        .filter((v) => v && typeof v === "object" && v.label)
        .map((v) => ({
          label: String(v.label),
          swatch: v.swatch ? String(v.swatch) : undefined,
          image: v.image ? String(v.image) : undefined,
          price_from: typeof v.price_from === "number" ? v.price_from : null,
          mrp: typeof v.mrp === "number" ? v.mrp : null,
        }))
    : [];
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
    productCode: (data as { product_code?: string | null }).product_code ?? undefined,
    priceFrom: (data as { price_from?: number | null }).price_from ?? null,
    mrp: (data as { mrp?: number | null }).mrp ?? null,
    currency: (data as { currency?: string | null }).currency ?? "USD",
    showPrice: (data as { show_price?: boolean | null }).show_price ?? true,
    variants,
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
  const { has: isSaved, toggle: toggleSaved } = useWishlist();


  const [diamondType, setDiamondType] = useState(product.diamondTypes[0]);
  const [karat, setKarat] = useState<"18K" | "14K" | "9K">("18K");
  const [goldColor, setGoldColor] = useState<"White" | "Yellow" | "Rose">(
    product.metal.includes("Yellow") ? "Yellow" : product.metal.includes("Rose") ? "Rose" : "White",
  );
  const [size, setSize] = useState(product.sizes?.[2] ?? "");
  const [caratSize, setCaratSize] = useState<number>(1.00);
  const [backing, setBacking] = useState(product.backings?.[0] ?? "");
  const [length, setLength] = useState(product.lengths?.[1] ?? "");
  const [specialReq, setSpecialReq] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const variants: NonNullable<Product["variants"]> = product.variants ?? [];
  const [activeVariant, setActiveVariant] = useState(0);
  const currentVariant = variants[activeVariant];

  const baseImages: string[] = ((product.images && product.images.length ? product.images : [product.image]) as string[]).filter(Boolean);
  const imageList: string[] = currentVariant?.image
    ? [currentVariant.image, ...baseImages.filter((s) => s !== currentVariant.image)]
    : baseImages;
  const media: MediaItem[] = [
    ...imageList.map((src) => ({ type: "image" as const, src })),
    ...(product.videoUrl ? [{ type: "video" as const, src: product.videoUrl }] : []),
  ];
  const safeIdx = Math.min(activeIdx, media.length - 1);
  const current = media[safeIdx];
  const gallery = imageList;


  const isRing = product.category === "engagement-rings" || product.category === "rings" || product.category === "bridal";

  const effectivePriceFrom = currentVariant?.price_from ?? product.priceFrom;
  const effectiveMrp = currentVariant?.mrp ?? product.mrp;
  const showPrice = product.showPrice !== false && !!effectivePriceFrom;
  const priceLabel = showPrice
    ? `${product.currency || "USD"} ${effectivePriceFrom!.toLocaleString()}`
    : null;
  const mrpLabel = showPrice && effectiveMrp && effectiveMrp > (effectivePriceFrom ?? 0)
    ? `${product.currency || "USD"} ${effectiveMrp.toLocaleString()}`
    : null;

  const message = useMemo(() => {
    const lines = [
      "Hello Oriva Jewels,",
      "",
      "I'm interested in:",
      `Product: ${product.name}`,
    ];
    if (product.productCode) lines.push(`Product Code: ${product.productCode}`);
    if (currentVariant) lines.push(`Option: ${currentVariant.label}`);
    if (priceLabel) lines.push(`Price: ${priceLabel}${mrpLabel ? ` (MRP ${mrpLabel})` : ""}`);
    lines.push(
      `Diamond Type: ${diamondType}`,
      `Metal: ${karat} ${goldColor} Gold`,
      `Centre Stone: ${caratSize.toFixed(2)} ct`,
    );
    if (isRing || product.sizes) lines.push(`Ring Size: ${size || "—"}`);
    if (product.backings) lines.push(`Backing: ${backing}`);
    if (product.lengths) lines.push(`Length: ${length}`);
    if (specialReq) lines.push(`Special Requirements: ${specialReq}`);
    lines.push(
      "",
      "Please share pricing and availability.",
    );
    return lines.join("\n");
  }, [product, diamondType, karat, goldColor, caratSize, size, backing, length, specialReq, isRing, priceLabel, mrpLabel]);

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

          <div className="md:col-span-7">
            <div className="flex gap-3 md:gap-4">
              {media.length > 1 && (
                <div className="hidden md:flex flex-col gap-2.5 w-[84px] shrink-0 max-h-[520px] overflow-y-auto pr-1">
                  {media.map((m, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIdx(i)}
                      className={`relative aspect-square w-full overflow-hidden bg-charcoal border transition shrink-0 ${
                        i === safeIdx ? "border-gold" : "border-white/10 hover:border-white/40"
                      }`}
                      aria-label={m.type === "video" ? "Video" : `Image ${i + 1}`}
                    >
                      {m.type === "video" ? (
                        <>
                          {detectVideo(m.src)?.kind === "file" ? (
                            <video src={m.src} muted playsInline className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full bg-obsidian" />
                          )}
                          <span className="absolute inset-0 grid place-items-center bg-obsidian/40">
                            <Play className="h-4 w-4 text-ivory" strokeWidth={1.6} />
                          </span>
                        </>
                      ) : (
                        <img src={m.src} alt="" loading="lazy" className="h-full w-full object-cover" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <div className="relative overflow-hidden bg-charcoal aspect-square group border border-white/5 flex-1 max-w-[520px]">
                {current?.type === "video" ? (
                  (() => {
                    const v = detectVideo(current.src);
                    if (!v) return null;
                    return v.kind === "file" ? (
                      <video
                        src={v.embed}
                        controls
                        playsInline
                        className="h-full w-full object-cover bg-obsidian"
                      />
                    ) : (
                      <iframe
                        src={v.embed}
                        title="Product video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full bg-obsidian"
                      />
                    );
                  })()
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
                    <span className="absolute bottom-5 right-5 inline-flex items-center gap-2 bg-gold border border-gold px-4 py-2.5 text-[13px] font-semibold tracking-[0.3em] uppercase text-obsidian opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition duration-500">
                      <ZoomIn className="h-4 w-4" strokeWidth={2} /> Zoom
                    </span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => toggleSaved(product.slug)}
                  aria-label={isSaved(product.slug) ? "Remove from wishlist" : "Add to wishlist"}
                  aria-pressed={isSaved(product.slug)}
                  className={`absolute top-4 right-4 grid h-10 w-10 place-items-center border transition ${
                    isSaved(product.slug)
                      ? "bg-gold border-gold text-obsidian"
                      : "bg-obsidian/90 border-gold/50 text-gold hover:bg-gold hover:text-obsidian"
                  }`}
                >
                  <Heart className="h-4 w-4" strokeWidth={1.6} fill={isSaved(product.slug) ? "currentColor" : "none"} />
                </button>

                {media.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveIdx((safeIdx - 1 + media.length) % media.length)}
                      aria-label="Previous"
                      className="absolute left-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center bg-obsidian/90 border border-gold/50 text-gold hover:bg-gold hover:text-obsidian transition"
                    >
                      <ChevronLeft className="h-5 w-5" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveIdx((safeIdx + 1) % media.length)}
                      aria-label="Next"
                      className="absolute right-3 top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center bg-obsidian/90 border border-gold/50 text-gold hover:bg-gold hover:text-obsidian transition"
                    >
                      <ChevronRight className="h-5 w-5" strokeWidth={1.8} />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] font-semibold tracking-[0.4em] uppercase text-gold bg-obsidian/85 px-2.5 py-1 border border-gold/40">
                      {String(safeIdx + 1).padStart(2, "0")} / {String(media.length).padStart(2, "0")}
                    </div>
                  </>
                )}
              </div>
            </div>

            {media.length > 1 && (
              <div className="mt-3 grid grid-cols-5 gap-2 md:hidden">
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
                        {detectVideo(m.src)?.kind === "file" ? (
                          <video src={m.src} muted playsInline className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-obsidian" />
                        )}
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


          <div className="md:col-span-5">

            <div className="md:sticky md:top-40">
              <p className="eyebrow">{product.collection}</p>
              <h1 className="mt-5 font-serif text-3xl md:text-4xl leading-[1] text-ivory">{product.name}</h1>
              {product.productCode && (
                <p className="mt-3 text-[11px] font-mono tracking-[0.3em] uppercase text-ivory/60">
                  Ref. {product.productCode}
                </p>
              )}
              {priceLabel && (
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-serif text-2xl md:text-3xl text-gold">{priceLabel}</span>
                  {mrpLabel && (
                    <span className="text-sm text-ivory/50 line-through">{mrpLabel}</span>
                  )}
                </div>
              )}
              <p className="mt-6 text-[15px] leading-[1.8] text-ivory/80 max-w-lg">
                {product.description}
              </p>


              <div className="mt-8 hairline-gold w-16" />

              <div className="mt-8 space-y-7">
                {variants.length > 0 && (
                  <div>
                    <p className="text-[14px] tracking-[0.42em] uppercase text-gold">Options</p>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {variants.map((v, i) => {
                        const active = i === activeVariant;
                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => { setActiveVariant(i); setActiveIdx(0); }}
                            title={v.label}
                            className={`h-10 w-10 rounded-full border-2 transition ${active ? "border-gold ring-2 ring-gold/30" : "border-white/25 hover:border-white/60"}`}
                            style={{
                              background: v.image
                                ? `url(${v.image}) center/cover`
                                : (v.swatch || "#e5e4e2"),
                            }}
                          />
                        );
                      })}
                    </div>
                    {currentVariant && (
                      <p className="mt-3 text-[13px] tracking-[0.2em] uppercase text-ivory font-semibold">{currentVariant.label}</p>
                    )}
                  </div>
                )}
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
                    <p className="font-serif text-2xl text-ivory">{caratSize.toFixed(2)} <span className="text-[12px] uppercase tracking-widest text-gold font-sans ml-1">ct</span></p>
                  </div>
                  <div className="mt-6">
                    <input
                      type="range"
                      min="0.20"
                      max="10.00"
                      step="0.05"
                      value={caratSize}
                      onChange={(e) => setCaratSize(parseFloat(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-gold hover:accent-gold-deep transition-all"
                    />
                    <div className="mt-3 flex justify-between text-[10px] tracking-[0.3em] uppercase text-ivory/40 font-bold">
                      <span>0.20 ct</span>
                      <span>10.00 ct</span>
                    </div>
                  </div>
                </div>

                {isRing && (
                  <div>
                    <label className="text-[14px] tracking-[0.42em] uppercase text-gold">Ring Size</label>
                    <input
                      value={size}
                      onChange={(e) => setSize(e.target.value.slice(0, 20))}
                      placeholder="e.g. US 6, EU 52, HK 13"
                      className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold transition"
                    />
                    <p className="mt-2 text-[11px] tracking-[0.06em] text-ivory/55">
                      Not sure? See our <Link to="/ring-size-guide" className="text-gold underline underline-offset-2">ring size guide</Link>.
                    </p>
                  </div>
                )}
                {!isRing && product.sizes && (
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
                    Special Requirements
                  </label>
                  <textarea
                    value={specialReq}
                    onChange={(e) => setSpecialReq(e.target.value.slice(0, 500))}
                    placeholder="Share any custom details, engraving, gifting notes, delivery timeline…"
                    rows={3}
                    className="mt-3 w-full border-b border-white/15 bg-transparent py-2.5 text-sm text-ivory placeholder:text-ivory/40 outline-none focus:border-gold transition resize-none"
                  />
                </div>
              </div>

              <div className="mt-10 border border-white/10 bg-charcoal/50 p-6">
                <p className="text-[14px] tracking-[0.42em] uppercase text-gold">Your Configuration</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
                  <dt className="text-ivory/80">Diamond</dt><dd className="text-ivory">{diamondType}</dd>
                  <dt className="text-ivory/80">Metal</dt><dd className="text-ivory">{karat} {goldColor} Gold</dd>
                  <dt className="text-ivory/80">Centre Stone</dt><dd className="text-ivory">{caratSize.toFixed(2)} ct</dd>
                  {product.sizes && (<><dt className="text-ivory/80">Size</dt><dd className="text-ivory">{size}</dd></>)}
                  {isRing && !product.sizes && size && (<><dt className="text-ivory/80">Ring Size</dt><dd className="text-ivory">{size}</dd></>)}
                  {product.backings && (<><dt className="text-ivory/80">Backing</dt><dd className="text-ivory">{backing}</dd></>)}
                  {product.lengths && (<><dt className="text-ivory/80">Length</dt><dd className="text-ivory">{length}</dd></>)}
                  {specialReq && (<><dt className="text-ivory/80">Special Requirements</dt><dd className="text-ivory">{specialReq}</dd></>)}
                </dl>
              </div>


              <button
                type="button"
                onClick={async () => {
                  const configuration = {
                    diamondType, karat, goldColor, caratSize,
                    size: (isRing || product.sizes) ? (size || undefined) : undefined,
                    backing: product.backings ? backing : undefined,
                    length: product.lengths ? length : undefined,
                    specialRequirements: specialReq || undefined,
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
                className="mt-5 flex w-full items-center justify-center gap-3 bg-gold text-obsidian py-5 text-[14px] font-semibold tracking-[0.4em] uppercase hover:bg-gold-deep hover:text-ivory transition group cursor-pointer"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                Enquire on WhatsApp
              </button>
              <p className="mt-4 text-center text-[14px] tracking-[0.35em] uppercase text-ivory/80">
                Pricing shared privately · Response within 24h
              </p>

              <div className="mt-10 grid grid-cols-3 gap-2 text-center">
                {[
                  { icon: ShieldCheck, t: "IGI Certified" },
                  { icon: Truck, t: "Insured" },
                  { icon: Sparkles, t: "Bespoke" },
                ].map((i) => (
                  <div key={i.t} className="border-t border-white/10 pt-4">
                    <i.icon className="mx-auto h-5 w-5 text-gold" strokeWidth={2.5} />
                    <p className="mt-2.5 text-[11px] md:text-[12px] tracking-[0.2em] uppercase text-ivory font-bold whitespace-nowrap">{i.t}</p>
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
