import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle, ShieldCheck, Sparkles, Globe2, Gem } from "lucide-react";


import engagementImg from "@/assets/collection-engagement.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import braceletsImg from "@/assets/product-tennis.jpg";
import pendantsImg from "@/assets/collection-pendants.jpg";
import bridalImg from "@/assets/collection-bridal.jpg";
import labgrownImg from "@/assets/collection-labgrown.jpg";
import editorialImg from "@/assets/editorial-emerald.jpg";

import insta1 from "@/assets/insta-1.jpg";
import insta2 from "@/assets/insta-2.jpg";
import insta4 from "@/assets/insta-4.jpg";
import insta5 from "@/assets/insta-5.jpg";
import insta6 from "@/assets/insta-6.jpg";
import atelier from "@/assets/about-atelier.jpg";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { products, buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oriva Jewels — Timeless Brilliance in Natural & Lab Grown Diamonds" },
      {
        name: "description",
        content:
          "A Hong Kong fine jewellery house. Discover exceptional engagement rings, earrings, bracelets and bridal jewellery in Natural and Lab Grown diamonds.",
      },
    ],
  }),
  component: HomePage,
});

const collections = [
  { title: "Engagement Rings", to: "/collections/engagement-rings", img: engagementImg, tall: true },
  { title: "Earrings", to: "/collections/earrings", img: earringsImg },
  { title: "Bracelets", to: "/collections/bracelets", img: braceletsImg },
  { title: "Pendants", to: "/collections/pendants", img: pendantsImg, tall: true },
  { title: "Bridal Collection", to: "/collections/bridal", img: bridalImg },
  { title: "Lab Grown Diamonds", to: "/collections/lab-grown", img: labgrownImg },
];

const occasions = [
  { label: "Engagement", img: engagementImg },
  { label: "Wedding", img: bridalImg },
  { label: "Anniversary", img: insta6 },
  { label: "Gift", img: insta1 },
  { label: "Everyday", img: earringsImg },
];

const insta = [
  { img: insta1, span: "row-span-2" },
  { img: insta2, span: "" },
  { img: insta5, span: "row-span-2" },
  { img: insta4, span: "" },
  { img: insta6, span: "" },
  { img: editorialImg, span: "" },
];

function HomePage() {
  return (
    <div className="bg-background">
      {/* HERO — 3D cinematic */}
      <section className="relative isolate overflow-hidden text-ivory min-h-[100svh] flex items-end md:items-center">
        {/* subtle vignette so text stays legible over 3D */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-transparent to-ink pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/30 pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1400px] w-full px-6 pb-24 pt-40 md:px-10 md:py-32">
          <div className="max-w-2xl animate-rise">
            <p className="eyebrow text-champagne">Hong Kong · Est. Fine Jewellery</p>
            <h1 className="mt-6 font-serif text-[13vw] leading-[0.95] tracking-[-0.02em] md:text-[5.5rem]">
              Timeless <span className="italic text-champagne-gradient">Brilliance</span>,
              <br />
              Crafted for Modern Elegance.
            </h1>
            <p className="mt-8 max-w-lg text-[15px] leading-relaxed text-ivory/75">
              Discover exceptional Natural and Lab Grown Diamond jewellery designed to celebrate
              life's most meaningful moments.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to="/collections/engagement-rings"
                className="group inline-flex items-center gap-3 bg-ivory px-8 py-4 text-[11px] tracking-[0.32em] uppercase text-ink hover:bg-champagne transition"
              >
                Explore Collections
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={1.5} />
              </Link>
              <a
                href={buildWhatsAppLink("Hello Oriva Jewels, I'd like to book a consultation.")}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border border-ivory/40 px-8 py-4 text-[11px] tracking-[0.32em] uppercase text-ivory hover:border-champagne hover:text-champagne transition backdrop-blur-sm"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
                WhatsApp Consultation
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-ivory/50">
          <span className="text-[9px] tracking-[0.5em] uppercase">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-champagne to-transparent" />
        </div>
      </section>

      {/* Cinematic 3D reveal band — lets the diamond breathe between sections */}
      <section className="relative h-[80vh] md:h-[110vh] flex items-center justify-center text-ivory">
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink pointer-events-none" />
        <div className="relative z-10 text-center px-6">
          <p className="eyebrow text-champagne">A single stone</p>
          <h2 className="mt-6 font-serif italic text-4xl md:text-7xl max-w-3xl mx-auto leading-[1.05]">
            Light, held in place by <span className="text-champagne-gradient">gold</span>.
          </h2>
        </div>
      </section>


      {/* MARQUEE */}
      <div className="border-y border-border/60 bg-ivory overflow-hidden">
        <div className="animate-marquee flex gap-16 whitespace-nowrap py-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-16">
              {[
                "GIA & IGI Certified",
                "Natural & Lab Grown",
                "Bespoke Atelier",
                "Worldwide Shipping",
                "Hong Kong · Dubai · Singapore",
                "Handcrafted",
              ].map((t) => (
                <span key={t} className="flex items-center gap-16 text-[11px] tracking-[0.4em] uppercase text-ink/70">
                  <span className="h-1 w-1 rounded-full bg-champagne" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* FEATURED COLLECTIONS */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">The Collections</p>
            <h2 className="mt-5 font-serif text-4xl md:text-6xl leading-[1.02]">
              An edit of quiet, considered pieces.
            </h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
            {collections.map((c, i) => (
              <Reveal key={c.title} delay={i * 80} className={c.tall ? "md:row-span-2" : ""}>
                <Link
                  to={c.to}
                  className="group relative block overflow-hidden bg-secondary"
                >
                  <div className={`relative ${c.tall ? "aspect-[3/4] md:aspect-[3/5]" : "aspect-[4/5]"}`}>
                    <img
                      src={c.img}
                      alt={c.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 text-ivory">
                      <h3 className="font-serif text-2xl md:text-3xl">{c.title}</h3>
                      <span className="mt-3 inline-flex items-center gap-2 text-[10px] tracking-[0.32em] uppercase text-ivory/80">
                        Explore Collection
                        <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" strokeWidth={1.5} />
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="bg-secondary/40 py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow">Best Sellers</p>
              <h2 className="mt-5 font-serif text-4xl md:text-5xl">Loved by our clients.</h2>
            </div>
            <Link
              to="/collections/engagement-rings"
              className="text-[11px] tracking-[0.32em] uppercase border-b border-foreground pb-1 hover:text-champagne hover:border-champagne transition"
            >
              View all
            </Link>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-6 md:grid-cols-3 md:gap-10 lg:grid-cols-3">
            {products.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL — EMERALD VELVET */}
      <section className="relative isolate overflow-hidden bg-emerald-deep text-ivory">
        <img
          src={editorialImg}
          alt="Marquise diamond ring on emerald velvet"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover object-right opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-deep via-emerald-deep/70 to-transparent" />

        <div className="relative mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
          <Reveal className="max-w-xl">
            <p className="eyebrow">Editorial</p>
            <h2 className="mt-5 font-serif text-5xl md:text-7xl italic leading-[0.95]">
              Designed to be remembered.
            </h2>
            <p className="mt-8 max-w-md text-[15px] leading-relaxed text-ivory/75">
              The Oriva Marquise — a study in poise. A single elongated diamond, four platinum
              prongs, and nothing else.
            </p>
            <Link
              to="/product/$slug"
              params={{ slug: "marquise-solitaire-ring" }}
              className="mt-10 inline-flex items-center gap-3 border border-champagne px-8 py-4 text-[11px] tracking-[0.32em] uppercase text-champagne hover:bg-champagne hover:text-emerald-deep transition"
            >
              Discover the piece
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* SHOP BY OCCASION */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal className="text-center">
            <p className="eyebrow">Shop by Occasion</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">For every meaningful moment.</h2>
          </Reveal>

          <div className="mt-16 grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-10">
            {occasions.map((o, i) => (
              <Reveal key={o.label} delay={i * 60} className="group text-center">
                <Link
                  to="/collections/engagement-rings"
                  className="block"
                >
                  <div className="relative mx-auto aspect-square w-full max-w-[220px] overflow-hidden rounded-full">
                    <img
                      src={o.img}
                      alt={o.label}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                    />
                    <span className="absolute inset-0 rounded-full ring-1 ring-inset ring-champagne/30" />
                  </div>
                  <p className="mt-5 font-serif text-xl">{o.label}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHY ORIVA */}
      <section className="relative isolate overflow-hidden bg-ink text-ivory py-24 md:py-32">
        <div className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, oklch(0.79 0.055 78 / 0.25), transparent 40%), radial-gradient(circle at 80% 70%, oklch(0.32 0.06 160 / 0.35), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Why Oriva</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              The maison way — refined, personal, uncompromising.
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Certified Diamonds", body: "GIA and IGI certified stones, individually inspected." },
              { icon: Gem, title: "Natural & Lab Grown", body: "Freedom of choice with equal craftsmanship." },
              { icon: Globe2, title: "Worldwide Shipping", body: "Insured delivery to Hong Kong, Dubai, Singapore and beyond." },
              { icon: Sparkles, title: "Personal Consultation", body: "Guided design and sourcing, one client at a time." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 80}>
                <div className="h-full border border-white/10 bg-white/[0.02] backdrop-blur-sm p-8 hover:border-champagne/40 hover:bg-white/[0.04] transition">
                  <f.icon className="h-6 w-6 text-champagne" strokeWidth={1.2} />
                  <h3 className="mt-6 font-serif text-2xl">{f.title}</h3>
                  <p className="mt-3 text-sm text-ivory/60 leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER STRIP */}
      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 grid gap-12 md:grid-cols-2 md:items-center">
          <Reveal>
            <p className="eyebrow">The Atelier</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">
              A Hong Kong-based <em className="italic text-champagne">fine jewellery house</em>.
            </h2>
            <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-lg">
              Oriva was born from a simple conviction — that fine jewellery should feel personal.
              Every piece is designed in Hong Kong and finished by hand, one stone at a time.
            </p>
            <Link
              to="/about"
              className="mt-10 inline-flex items-center gap-3 border-b border-foreground pb-1 text-[11px] tracking-[0.32em] uppercase hover:text-champagne hover:border-champagne transition"
            >
              Our Story <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            </Link>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative aspect-[4/3] overflow-hidden">
              <img src={atelier} alt="Oriva atelier" loading="lazy" className="h-full w-full object-cover" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="pb-24 md:pb-32">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10">
          <Reveal className="text-center">
            <p className="eyebrow">@orivajewels</p>
            <h2 className="mt-5 font-serif text-4xl md:text-5xl">Follow the maison.</h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 auto-rows-[180px] md:auto-rows-[240px]">
            {insta.map((it, i) => (
              <a
                key={i}
                href="https://instagram.com/orivajewels"
                target="_blank"
                rel="noreferrer"
                className={`group relative overflow-hidden ${it.span}`}
              >
                <img
                  src={it.img}
                  alt="Oriva Jewels on Instagram"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition duration-500 grid place-items-center">
                  <span className="text-[10px] tracking-[0.3em] uppercase text-ivory">
                    View on Instagram
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Sparkle({
  style,
  delay = 0,
  size = 2,
}: {
  style: React.CSSProperties;
  delay?: number;
  size?: number;
}) {
  return (
    <span
      className="absolute pointer-events-none rounded-full bg-champagne blur-[0.5px] animate-sparkle"
      style={{
        ...style,
        width: `${size * 2}px`,
        height: `${size * 2}px`,
        boxShadow: "0 0 12px 2px var(--champagne)",
        animationDelay: `${delay}s`,
      }}
    />
  );
}
