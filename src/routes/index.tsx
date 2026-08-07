import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, MessageCircle, Paperclip, Sparkles } from "lucide-react";
import { GsapReveal } from "@/components/site/GsapReveal";
import { Sparkles as GsapSparkles } from "@/components/site/Sparkles";

import heroImg from "@/assets/hero-diamond-hand.jpg";
import engagementImg from "@/assets/collection-engagement.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import braceletsImg from "@/assets/product-tennis.jpg";
import pendantsImg from "@/assets/collection-pendants.jpg";
import bridalImg from "@/assets/collection-bridal.jpg";
import labgrownImg from "@/assets/collection-labgrown.jpg";
import editorialImg from "@/assets/editorial-emerald.jpg";

import insta1 from "@/assets/insta-1.jpg";
import insta6 from "@/assets/insta-6.jpg";
import reelPreview1 from "@/assets/reel-preview-1.jpg";
import reelPreview2 from "@/assets/reel-preview-2.jpg";
import reelPreview3 from "@/assets/reel-preview-3.jpg";
import reelPreview4 from "@/assets/reel-preview-4.jpg";
import atelier from "@/assets/about-atelier.jpg";
import engagementModel from "@/assets/engagement-model.jpg";

import { ProductCard } from "@/components/site/ProductCard";
import { Reveal } from "@/components/site/Reveal";
import { products, buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oriva Jewels - Fine Natural & Lab Grown Diamond Jewellery" },
      {
        name: "description",
        content:
          "A modern maison of natural and lab grown diamond jewellery. Engagement rings, earrings, bracelets and bridal pieces, made by hand.",
      },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
    ],
    links: [
      { rel: "preload", as: "image", href: heroImg, fetchpriority: "high" },
    ],
  }),
  component: HomePage,
});

const collections = [
  { n: "01", title: "Engagement", to: "/collections/engagement-rings", img: engagementImg },
  { n: "02", title: "Earrings", to: "/collections/earrings", img: earringsImg },
  { n: "03", title: "Bracelets", to: "/collections/bracelets", img: braceletsImg },
  { n: "04", title: "Pendants", to: "/collections/pendants", img: pendantsImg },
  { n: "05", title: "Bridal", to: "/collections/bridal", img: bridalImg },
  { n: "06", title: "Lab Grown", to: "/collections/lab-grown", img: labgrownImg },
];

const occasions = [
  { label: "Engagement", img: engagementImg, tag: "Bridal" },
  { label: "Anniversary", img: insta6, tag: "Milestone" },
  { label: "Wedding", img: bridalImg, tag: "Bridal" },
  { label: "Gift", img: insta1, tag: "Occasion" },
  { label: "Everyday", img: earringsImg, tag: "Daily" },
];

const instagramReels = [
  {
    href: "https://www.instagram.com/reel/DZHQxFnNSXD/?igsh=MXNreG1nYmtqejE5Mg==",
    img: reelPreview1,
    title: "Diamond jewellery reel",
  },
  {
    href: "https://www.instagram.com/reel/DZaOergteY2/?igsh=MXRzMWRkaW5mbW9lNg==",
    img: reelPreview2,
    title: "Fine jewellery reel",
  },
  {
    href: "https://www.instagram.com/reel/DaIgCG4tmDZ/?igsh=MWt5MmVrOXEyNXpq",
    img: reelPreview3,
    title: "Oriva diamonds reel",
  },
  {
    href: "https://www.instagram.com/reel/DaLQ2G7Nrj-/?igsh=eTBjenNqeHR2YWRl",
    img: reelPreview4,
    title: "Oriva jewels reel",
  },
];

function HomePage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-obsidian text-ivory pt-16 md:pt-20">
        <img
          src={heroImg}
          alt="Marquise diamond solitaire"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/75 via-obsidian/40 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/20 to-transparent" />
        <div className="absolute inset-0 vignette" />

        <div className="pointer-events-none absolute inset-y-0 left-6 hidden md:flex flex-col justify-between py-32 z-10">
          <span className="text-[14px] tracking-[0.5em] uppercase text-ivory/60 [writing-mode:vertical-rl] rotate-180">
            End-to-end Manufacturers
          </span>
          <span />
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-6 hidden md:flex flex-col justify-between py-32 z-10">
          <span className="text-[14px] tracking-[0.5em] uppercase text-ivory/60 [writing-mode:vertical-rl]">
            Natural · Lab Grown
          </span>
          <span className="text-[14px] tracking-[0.5em] uppercase text-ivory/60 [writing-mode:vertical-rl]">
            GIA · IGI Certified
          </span>
        </div>


        <div className="relative z-10 mx-auto max-w-[1240px] w-full px-6 pt-6 pb-6 md:px-16 md:pt-10 md:pb-10 flex flex-col justify-center">
          <div className="max-w-4xl animate-rise-slow">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-gold" />
              <p className="eyebrow">A Fine Jewellery Maison</p>
            </div>
            <h1 className="mt-6 md:mt-8 font-serif font-light text-[12vw] md:text-[9rem] lg:text-[11rem] leading-[0.88] tracking-[-0.035em]">
              <span className="block">Oriva</span>
              <span className="block italic text-gold-gradient -mt-2 md:-mt-4">Jewels</span>
            </h1>
            <p className="mt-2 md:mt-6 font-serif italic text-lg md:text-4xl text-ivory/90 max-w-3xl">
              We design your dreams <span className="text-gold-gradient not-italic">with diamonds.</span>
            </p>
          </div>

          <div className="mt-10 md:mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-8 md:gap-10 animate-rise-slow" style={{ animationDelay: "0.4s" }}>
            <p className="mt-6 md:mt-0 max-w-xl font-serif italic text-xl md:text-2xl leading-[1.5] text-gold-gradient">
              We are end to end manufacturers of
              <span className="not-italic font-sans tracking-[0.08em] text-ivory"> DIAMONDS &amp; JEWELLERY.</span>
            </p>


            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
              <Link
                to="/collections/engagement-rings"
                className="group relative inline-flex items-center justify-center gap-3 bg-ivory px-9 py-4 text-[10.5px] tracking-[0.4em] uppercase text-obsidian overflow-hidden whitespace-nowrap"
              >
                <span className="relative">Explore Collections</span>
                <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" strokeWidth={1.4} />
              </Link>
              <a
                href={buildWhatsAppLink("Hello Oriva Jewels, I'd like a private consultation.")}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center justify-center gap-3 border border-ivory/25 px-9 py-4 text-[10.5px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition whitespace-nowrap"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
                Private Consultation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div className="relative overflow-hidden border-y border-white/5 bg-obsidian py-6">
        <div className="animate-marquee flex gap-10 whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              {[
                "Natural Diamonds",
                "Lab Grown Diamonds",
                "GIA & IGI Certified",
                "Own Manufacturing",
                "Direct Factory Pricing",
                "100% Customization Available",
                "Worldwide Shipping",
                "Engagement Ring Specialist",
              ].map((t) => (
                <span key={t} className="flex items-center gap-3 font-serif italic text-2xl md:text-3xl text-ivory/80">
                  <span className="text-gold text-3xl md:text-4xl">✦</span>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>


      {/* COLLECTIONS INDEX - Editorial image grid */}
      <section className="relative overflow-hidden py-8 md:py-14 bg-ink">

        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(closest-side at 50% 20%, oklch(0.72 0.11 82 / 0.14), transparent 65%)",
          }}
        />

        <div className="relative mx-auto max-w-[1280px] px-5 md:px-10">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-t border-ivory/15 pt-8 md:pt-10">
            <div>
              <p className="eyebrow">- The Index</p>
              <h2 className="mt-3 font-serif text-2xl md:text-3xl leading-[1.1] text-ivory">
                Six chapters.{" "}
                <em className="italic text-gold">One maison.</em>
              </h2>
            </div>
            <p className="max-w-sm text-[13px] leading-[1.7] text-ivory/70">
              A curated volume of six edits — each with its own hand, its own hour of the day.
            </p>
          </Reveal>


          <div className="mt-8 md:mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
            {collections.map((c, i) => (
              <Reveal key={c.title} delay={i * 60}>
                <Link
                  to={c.to}
                  className="group relative block overflow-hidden bg-obsidian aspect-square"
                >
                  <img
                    src={c.img}
                    alt={c.title}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian/85 via-obsidian/25 to-transparent" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-gold/60 transition duration-500" />

                  <div className="absolute top-3 left-3 md:top-4 md:left-4 flex items-center gap-2">
                    <span className="h-px w-5 md:w-6 bg-gold/70" />
                    <span className="font-serif italic text-[11px] md:text-xs text-gold">
                      Chapter {c.n}
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 md:p-4">
                    <h3 className="font-serif text-base md:text-lg leading-tight text-ivory">
                      {c.title}
                    </h3>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 text-[9px] md:text-[10px] tracking-[0.32em] uppercase text-ivory/75 group-hover:text-gold transition">
                      Explore <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>


          <div className="mt-10 md:mt-14 text-center">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.4em] uppercase text-gold border-b border-gold/60 pb-1 hover:text-ivory hover:border-ivory transition"
            >
              Our craftsmanship <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>





      {/* MOST REQUESTED - tonal editorial */}
      <section className="relative py-12 md:py-20 bg-obsidian text-ivory" data-surface="dark">
        <div className="mx-auto max-w-[1200px] px-5 md:px-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14">
            <div>
              <span className="block text-[10px] tracking-[0.4em] uppercase text-gold mb-3">Most Requested</span>
              <h2 className="font-serif italic font-light leading-[1.05] text-ivory text-4xl md:text-5xl">
                The Selected Six
              </h2>
            </div>
            <Link
              to="/collections/engagement-rings"
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ivory/80 border-b border-gold/40 pb-1 hover:text-gold hover:border-gold transition-colors duration-300"
            >
              View entire collection <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-8 md:gap-y-10">
            {products.slice(0, 8).map((p) => {
              const tag =
                p.diamondTypes.includes("Lab Grown") && p.diamondTypes.includes("Natural")
                  ? "Nat · Lab"
                  : p.diamondTypes[0];
              return (
                <Link
                  key={p.slug}
                  to="/product/$slug"
                  params={{ slug: p.slug }}
                  className="group block"
                >
                  <div className="relative aspect-square overflow-hidden bg-ivory/[0.04] mb-3 md:mb-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-obsidian/20 mix-blend-multiply"
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-obsidian/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    <span className="absolute top-2.5 left-2.5 text-[9px] tracking-[0.28em] uppercase text-ivory/90 bg-obsidian/50 backdrop-blur-sm px-2 py-0.5 border border-white/10">
                      {tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-[15px] md:text-base leading-tight text-ivory transition-colors duration-300 group-hover:text-gold line-clamp-1">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-[10px] tracking-[0.24em] uppercase text-ivory/55 line-clamp-1">
                    {p.shape} · {p.metal}
                  </p>
                </Link>
              );
            })}
          </div>


          <div className="mt-12 md:hidden flex justify-center">
            <Link
              to="/collections/engagement-rings"
              className="inline-flex items-center gap-2 text-[11px] tracking-[0.3em] uppercase text-ivory/80 border-b border-gold/40 pb-1"
            >
              View entire collection <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>


      {/* SHOP BY SHAPE */}
      <section className="relative py-8 md:py-10 bg-obsidian overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-6 md:px-16">
          <Reveal className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-xl">
              <p className="eyebrow">- Shop by Shape</p>
              <h2 className="mt-6 font-serif text-3xl md:text-3xl leading-[1] text-ivory">
                Find your <em className="text-gold-gradient">silhouette.</em>
              </h2>
              <p className="mt-6 max-w-md text-[15px] text-ivory/70 leading-[1.8]">
                Six diamond shapes, each with its own quiet character. Choose the one that feels most yours.
              </p>
            </div>
            <Link to="/education" className="hidden md:inline-flex items-center gap-2 text-[14px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory hover:border-ivory transition">
              The diamond guide <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <div className="mt-8 grid grid-cols-3 gap-3 md:grid-cols-6 md:gap-4 max-w-[1100px] mx-auto">
            {[
              { key: "marquise", label: "Marquise", img: heroImg },
              { key: "oval", label: "Oval", img: engagementImg },
              { key: "emerald", label: "Emerald", img: editorialImg },
              { key: "pear", label: "Pear", img: bridalImg },
              { key: "heart", label: "Heart", img: earringsImg },
              { key: "round", label: "Round", img: braceletsImg },
            ].map((s, i) => (
              <Reveal key={s.key} delay={i * 60}>
                <Link to="/shape/$shape" params={{ shape: s.key }} className="group relative block aspect-square overflow-hidden">
                  <img src={s.img} alt={s.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition" />
                  <div className="absolute inset-x-0 bottom-0 p-2.5 md:p-3">
                    <p className="text-[9px] tracking-[0.3em] uppercase text-gold">0{i + 1}</p>
                    <h3 className="mt-0.5 font-serif text-sm md:text-base text-ivory italic">{s.label}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER */}
      <section className="relative bg-obsidian py-8 md:py-10 overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-6 md:px-16 grid gap-12 md:grid-cols-12 md:gap-16 items-center">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={atelier} alt="Oriva atelier" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 border border-gold/20" />
            </div>
            <p className="mt-4 text-[14px] tracking-[0.42em] uppercase text-ivory/80">
              Plate II · The Atelier
            </p>
          </Reveal>

          <Reveal delay={150} className="md:col-span-7 md:pl-8">
            <p className="eyebrow">- The Atelier</p>
            <h2 className="mt-6 font-serif text-xl md:text-2xl leading-[1.2] text-ivory">
              Every stone <em className="text-gold-gradient">chosen</em>.
              <br />Every piece <em className="text-gold-gradient">finished</em> by hand.
            </h2>
            <div className="mt-10 space-y-6 text-[15px] leading-[1.8] text-ivory/80 max-w-lg">
              <p>
                We are end-to-end manufacturers of diamonds and diamond jewellery. Every piece is
                sourced, set and signed by the same hands - never outsourced, never rushed.
              </p>
              <p>
                We work in both natural and lab grown diamonds, certified by GIA and IGI, with the
                same craftsmanship applied to both. The choice is yours; the standard is ours.
              </p>
            </div>



            <div className="flex flex-col sm:flex-row items-start gap-8 mt-12">
              <Link
                to="/about"
                className="inline-flex items-center gap-3 text-[10.5px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-2 hover:text-ivory hover:border-ivory transition shrink-0"
              >
                Enter the maison <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
              </Link>

              <div className="flex items-center gap-10 md:gap-14 border-l border-white/10 pl-8">
                <div>
                  <span className="block font-sans text-3xl md:text-5xl font-bold text-ivory tracking-tight">100%</span>
                  <span className="mt-1 block text-[9px] tracking-[0.3em] uppercase text-gold whitespace-nowrap">Certified stones</span>
                </div>
                <div>
                  <span className="block font-sans text-3xl md:text-5xl font-bold text-ivory tracking-tight">30D</span>
                  <span className="mt-1 block text-[9px] tracking-[0.3em] uppercase text-gold whitespace-nowrap">Bespoke lead time</span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="py-8 md:py-10 bg-ink">
        <div className="mx-auto max-w-[1240px] px-6 md:px-16">
          <Reveal className="text-center max-w-xl mx-auto">
            <p className="eyebrow">- The Occasions</p>
            <h2 className="mt-6 font-serif text-3xl md:text-4xl text-ivory">
              For every <em className="text-gold-gradient">moment worth marking.</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-8">
            {occasions.map((o, i) => (
              <Reveal key={o.label} delay={i * 60} className="group">
                <Link to="/occasions" className="block">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                      src={o.img}
                      alt={o.label}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 via-obsidian/10 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-4 md:p-6">
                      <p className="text-[14px] tracking-[0.42em] uppercase text-gold">{o.tag}</p>
                      <p className="mt-1 font-serif text-2xl md:text-3xl text-ivory">{o.label}</p>
                    </div>
                    <span className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition duration-500" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* PROCESS - From Inspiration to Reality */}
      <section className="relative py-8 md:py-10 bg-ink overflow-hidden">
        <div className="mx-auto max-w-[1240px] px-6 md:px-16">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">- The Process</p>
            <h2 className="mt-6 font-serif text-3xl md:text-3xl leading-[1] text-ivory">
              From a sketch <em className="text-gold-gradient">to her finger.</em>
            </h2>
            <p className="mt-6 max-w-md text-[15px] leading-[1.85] text-ivory/70">
              Three unhurried steps. A private conversation, a CAD reveal, and the moment the piece
              finally leaves our hands - hers.
            </p>
          </Reveal>

          <div className="mt-8 grid grid-cols-3 gap-2 md:gap-4">
            {[
              { title: "Consultation", desc: "A private conversation about her, the moment, and the vision behind the piece." },
              { title: "CAD & Approval", desc: "A photoreal 3D reveal, refined together until every detail feels unmistakably hers." },
              { title: "Crafted & Delivered", desc: "Hand-set by our master jewellers in Hong Kong and delivered, insured, worldwide." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 90}>
                <div className="group h-full border border-white/10 bg-obsidian/40 px-4 py-3 md:px-6 md:py-4 hover:border-gold/40 transition">
                  <h3 className="font-serif text-base md:text-xl text-ivory">{s.title}</h3>
                  <span className="mt-2 block h-px w-8 bg-gold/60" />
                  <p className="mt-2 text-[12px] md:text-[13px] leading-[1.6] text-ivory/70">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-14 flex justify-center">
            <a
              href={buildWhatsAppLink("Hello Oriva Jewels, I'd like to begin a bespoke design consultation.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-gold px-10 py-4 text-[12px] tracking-[0.4em] uppercase text-obsidian hover:bg-ivory transition"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
              Begin your piece
            </a>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT RINGS - Custom Commission */}
      <EngagementRingsSection />




      {/* REVIEWS */}
      <section className="relative py-8 md:py-10 bg-ink">
        <div className="mx-auto max-w-[1240px] px-6 md:px-16">
          <Reveal className="text-center max-w-xl mx-auto">
            <p className="eyebrow">- The Clientele</p>
            <h2 className="mt-6 font-serif text-3xl md:text-4xl text-ivory">
              In their <em className="text-gold-gradient">own words.</em>
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-8">
            {[
              {
                q: "The most personal buying experience I've ever had. The CAD reveal made me tear up - and the ring somehow exceeded it.",
                a: "Sarah W.",
                place: "London",
              },
              {
                q: "I sent a photo on WhatsApp at midnight. By morning I had sketches. Six weeks later the ring was on my fiancée's finger.",
                a: "Rohit M.",
                place: "Dubai",
              },
              {
                q: "Lab grown, three carats, hidden halo. Photographed it, showed my jeweller friend - she asked who did it. That says everything.",
                a: "Amelia K.",
                place: "New York",
              },
            ].map((r, i) => (
              <Reveal key={r.a} delay={i * 80}>
                <figure className="group h-full border border-white/10 bg-obsidian/30 p-8 md:p-10 hover:border-gold/40 transition">
                  <div className="flex gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, k) => <span key={k}>★</span>)}
                  </div>
                  <blockquote className="mt-6 font-serif italic text-xl leading-[1.55] text-ivory/90">
                    "{r.q}"
                  </blockquote>
                  <figcaption className="mt-8 flex items-center gap-3 text-[13px] tracking-[0.35em] uppercase">
                    <span className="h-px w-8 bg-gold/60" />
                    <span className="text-gold">{r.a}</span>
                    <span className="text-ivory/60">· {r.place}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="relative py-8 md:py-10 bg-obsidian">
        <div className="mx-auto max-w-[1200px] px-6 md:px-16 grid gap-16 md:grid-cols-12">
          <Reveal className="md:col-span-4">
            <p className="eyebrow">- Frequently Asked</p>
            <h2 className="mt-6 font-serif text-2xl md:text-4xl leading-[1.05] text-ivory">
              A few <em className="text-gold-gradient">answers.</em>
            </h2>
            <p className="mt-6 text-sm leading-[1.85] text-ivory/70">
              Can't find yours? Message an advisor - available 24×7, worldwide.
            </p>
          </Reveal>

          <Reveal delay={120} className="md:col-span-8">
            <div className="divide-y divide-white/10 border-y border-white/10">
              {[
                {
                  q: "Do you offer lab grown and natural diamonds?",
                  a: "Yes - both, at every price point. Every stone is GIA or IGI certified, and the same setters finish both. The choice is yours; the standard is ours.",
                },
                {
                  q: "What metals and karats are available?",
                  a: "18K, 14K and 9K gold in White, Yellow and Rose - along with Platinum 950 for select pieces. Any Oriva design can be crafted in any of them.",
                },
                {
                  q: "How does the enquiry process work?",
                  a: "Every piece is made to order. Tap Enquire, share your details on WhatsApp, and we respond with pricing, CAD renders and a lead time - usually within 24 hours.",
                },
                {
                  q: "Do you ship worldwide?",
                  a: "Yes. We ship fully insured to over 40 countries, hand-delivered where possible. All duties and paperwork handled by our maison.",
                },
                {
                  q: "Can I customise an existing design?",
                  a: "Entirely. Change the stone, the shape, the metal, the setting - or begin from a reference photo. 100% customisation is at the heart of what we do.",
                },
              ].map((f) => (
                <details key={f.q} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                    <span className="font-serif text-xl md:text-2xl text-ivory group-hover:text-gold transition">{f.q}</span>
                    <span className="shrink-0 text-2xl text-gold transition group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-4 text-sm leading-[1.85] text-ivory/70 max-w-2xl">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-8 md:py-10 bg-ink">

        <div className="mx-auto max-w-[1600px] px-6 md:px-16">
          <Reveal className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-xl">
              <p className="eyebrow">- @oriva__jewels</p>
              <h2 className="mt-4 font-serif text-3xl md:text-4xl text-ivory">
                <em className="text-gold-gradient">Instagram.</em>
              </h2>
              <p className="mt-4 text-[15px] leading-[1.75] text-ivory/70">
                Learn, engage and grow. Connect with ORIVA.
              </p>
            </div>
            <a
              href="https://www.instagram.com/oriva__jewels/reels/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[14px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory hover:border-ivory transition"
            >
              Watch all reels <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Reveal>


          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {instagramReels.map((reel) => (
              <a
                key={reel.href}
                href={reel.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${reel.title} on Instagram`}
                className="group relative aspect-[9/16] overflow-hidden bg-obsidian border border-white/5 block"
              >
                <img
                  src={reel.img}
                  alt={reel.title}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-obsidian/10 to-transparent" />
                <span className="absolute inset-0 ring-1 ring-inset ring-white/10 group-hover:ring-gold/60 transition" />
                <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-obsidian/75 text-gold backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-gold group-hover:text-obsidian">
                  ▶
                </span>
                <span className="absolute inset-x-0 bottom-0 p-4 text-[10px] tracking-[0.32em] uppercase text-ivory/90">
                  Watch reel
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
  drift = false,
}: {
  style: React.CSSProperties;
  delay?: number;
  size?: number;
  drift?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={`absolute pointer-events-none rounded-full bg-gold z-10 ${drift ? "animate-float-drift" : "animate-twinkle"}`}
      style={{
        ...style,
        width: `${size * 2.5}px`,
        height: `${size * 2.5}px`,
        boxShadow:
          "0 0 22px 4px var(--gold), 0 0 55px 10px oklch(0.79 0.11 82 / 0.45), 0 0 90px 20px oklch(0.79 0.11 82 / 0.18)",
        animationDelay: `${delay}s`,
      }}
    />
  );
}

function EngagementRingsSection() {
  const [form, setForm] = useState({
    name: "",
    goldQuality: "18K",
    goldColor: "White Gold",
    ringSize: "",
    diamondCut: "Round",
    stoneSize: "1.00 ct",
    notes: "",
  });

  const goldQualities = ["18K", "14K", "9K"];
  const goldColors = ["White Gold", "Yellow Gold", "Rose Gold", "Platinum"];
  const diamondCuts = ["Round", "Oval", "Emerald", "Cushion", "Marquise", "Pear", "Heart", "Princess", "Radiant"];

  const submitToWhatsApp = () => {
    const msg =
      `Hello Oriva Jewels, I'd like to enquire about a custom engagement ring.\n\n` +
      `Name: ${form.name || "-"}\n` +
      `Gold Quality: ${form.goldQuality}\n` +
      `Gold Color: ${form.goldColor}\n` +
      `Ring Size: ${form.ringSize || "-"}\n` +
      `Diamond Cut: ${form.diamondCut}\n` +
      `Stone Size: ${form.stoneSize}\n` +
      `Notes: ${form.notes || "-"}\n\n` +
      `(I will attach reference photos in this chat.)`;
    window.open(buildWhatsAppLink(msg), "_blank");
  };

  const fieldCls =
    "w-full bg-transparent border border-white/15 px-4 py-3 text-[14px] text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold transition";
  const labelCls = "block text-[11px] tracking-[0.32em] uppercase text-gold mb-2";

  return (
    <section className="relative py-12 md:py-14 bg-obsidian overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 12% 18%, oklch(0.79 0.11 82 / 0.14), transparent 45%), radial-gradient(circle at 88% 82%, oklch(0.62 0.11 72 / 0.16), transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-[1240px] px-6 md:px-16 grid gap-12 md:grid-cols-12 md:gap-16 items-start">
        <Reveal className="md:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden">
            <img
              src={engagementModel}
              alt="Diamond engagement ring on hand"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 border border-gold/20" />
          </div>
          <p className="mt-4 text-[14px] tracking-[0.42em] uppercase text-ivory/80">
            Plate III · Engagement
          </p>
        </Reveal>

        <Reveal delay={120} className="md:col-span-7 md:pl-8">
          <p className="eyebrow">- Engagement Rings</p>
          <h2 className="mt-6 font-serif text-3xl md:text-4xl leading-[1.05] text-ivory">
            From a sketch to <em className="text-gold-gradient">her finger.</em>
          </h2>
          <p className="mt-6 max-w-xl text-[15px] leading-[1.85] text-ivory/80">
            Turn your vision into reality. From Inspiration to Reality - how we work.
          </p>

          <ol className="mt-10 space-y-6 max-w-xl">
            {[
              {
                n: "Step 1",
                title: "The Design Consultation",
                body: "Share your ideas, sketches, or reference photos with our designers. We will guide you through choosing the perfect stone shape, metal, and setting style to match your budget and vision.",
              },
              {
                n: "Step 2",
                title: "The 3D Digital Model (CAD)",
                body: "We create a highly detailed, 3D digital rendering of your ring. This allows you to view the design from every angle and make adjustments before we begin production.",
              },
              {
                n: "Step 3",
                title: "Master Craftsmanship",
                body: "Once you approve the design, our expert jewellers hand-forge your setting, meticulously place every accent stone, and polish your ring to a breathtaking sparkle.",
              },
            ].map((s) => (
              <li key={s.n} className="border-l border-gold/40 pl-5">
                <p className="text-[11px] tracking-[0.4em] uppercase text-gold">{s.n}</p>
                <h3 className="mt-2 font-serif text-2xl text-ivory">{s.title}</h3>
                <p className="mt-2 text-[14px] leading-[1.75] text-ivory/70">{s.body}</p>
              </li>
            ))}
          </ol>

        </Reveal>
      </div>

      {/* Enquiry Form - Full Width */}
      <Reveal delay={80} className="relative mx-auto max-w-[1240px] px-6 md:px-16 mt-16 md:mt-20">
        <div className="border border-white/10 bg-black/30 p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="eyebrow">- Enquiry Form</p>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl text-ivory">
                Begin your <em className="text-gold-gradient">commission.</em>
              </h3>
            </div>
            <div className="flex items-center gap-2 text-[12px] text-ivory/60">
              <Paperclip className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
              Attach reference photos directly in the WhatsApp chat.
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div>
              <label className={labelCls}>Your Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
                className={fieldCls}
              />
            </div>

            <div>
              <label className={labelCls}>Gold Quality</label>
              <select
                value={form.goldQuality}
                onChange={(e) => setForm({ ...form, goldQuality: e.target.value })}
                className={fieldCls}
              >
                {goldQualities.map((g) => (
                  <option key={g} value={g} className="bg-obsidian">{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Gold Color</label>
              <select
                value={form.goldColor}
                onChange={(e) => setForm({ ...form, goldColor: e.target.value })}
                className={fieldCls}
              >
                {goldColors.map((g) => (
                  <option key={g} value={g} className="bg-obsidian">{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Ring Size</label>
              <input
                type="text"
                value={form.ringSize}
                onChange={(e) => setForm({ ...form, ringSize: e.target.value })}
                placeholder="e.g. US 6 / EU 52"
                className={fieldCls}
              />
            </div>

            <div>
              <label className={labelCls}>Diamond Cut</label>
              <select
                value={form.diamondCut}
                onChange={(e) => setForm({ ...form, diamondCut: e.target.value })}
                className={fieldCls}
              >
                {diamondCuts.map((c) => (
                  <option key={c} value={c} className="bg-obsidian">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Stone Size</label>
              <input
                type="text"
                value={form.stoneSize}
                onChange={(e) => setForm({ ...form, stoneSize: e.target.value })}
                placeholder="e.g. 1.00 ct, 1.50 ct"
                className={fieldCls}
              />
            </div>

            <div className="md:col-span-3">
              <label className={labelCls}>Notes / Reference</label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Anything else we should know"
                className={fieldCls}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={submitToWhatsApp}
            className="mt-8 inline-flex items-center gap-3 bg-gold px-8 py-4 text-[12px] tracking-[0.4em] uppercase text-obsidian hover:bg-ivory transition"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.4} />
            Send Enquiry on WhatsApp
          </button>
        </div>
      </Reveal>

    </section>
  );
}

