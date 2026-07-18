import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, MessageCircle, ShieldCheck, Gem, Globe2, Sparkles } from "lucide-react";
import { GsapReveal } from "@/components/site/GsapReveal";
import { Sparkles as GsapSparkles } from "@/components/site/Sparkles";

import heroImg from "@/assets/hero-marquise.jpg";
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
      { title: "Oriva Jewels - Fine Diamond Jewellery, Hong Kong" },
      {
        name: "description",
        content:
          "A Hong Kong maison of natural and lab grown diamond jewellery. Engagement rings, earrings, bracelets and bridal pieces, made by hand.",
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

const insta = [insta1, insta2, insta5, insta4, insta6, editorialImg];

function HomePage() {
  return (
    <div className="bg-background">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-obsidian text-ivory min-h-[100svh]">
        <img
          src={heroImg}
          alt="Marquise diamond solitaire"
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover object-center animate-slow-zoom will-change-transform"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/70 via-obsidian/25 to-obsidian" />
        <div className="absolute inset-0 bg-gradient-to-r from-obsidian/80 via-obsidian/15 to-transparent" />
        <div className="absolute inset-0 vignette" />

        {/* Aurora gold glow - infinite rotating radial */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-[20%] animate-aurora opacity-70 mix-blend-screen"
          style={{
            background:
              "radial-gradient(closest-side at 30% 30%, oklch(0.79 0.11 82 / 0.35), transparent 60%), radial-gradient(closest-side at 70% 65%, oklch(0.62 0.11 72 / 0.28), transparent 55%)",
          }}
        />

        {/* Diagonal light sweep */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 animate-light-sweep"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.95 0.05 84 / 0.18) 40%, oklch(0.95 0.05 84 / 0.3) 50%, oklch(0.95 0.05 84 / 0.18) 60%, transparent)",
            filter: "blur(6px)",
          }}
        />

        {/* Sparkles - bigger, more visible, infinite */}
        <Sparkle style={{ top: "18%", left: "12%" }} delay={0}   size={3} />
        <Sparkle style={{ top: "26%", left: "82%" }} delay={0.7} size={4} />
        <Sparkle style={{ top: "38%", left: "68%" }} delay={1.6} size={3} />
        <Sparkle style={{ top: "48%", left: "22%" }} delay={2.2} size={2} />
        <Sparkle style={{ top: "58%", left: "78%" }} delay={0.4} size={3} />
        <Sparkle style={{ top: "68%", left: "16%" }} delay={2.4} size={4} />
        <Sparkle style={{ top: "78%", left: "58%" }} delay={0.9} size={3} />
        <Sparkle style={{ top: "86%", left: "38%" }} delay={1.9} size={2} />
        <Sparkle style={{ top: "14%", left: "46%" }} delay={3.2} size={3} />
        <Sparkle style={{ top: "34%", left: "36%" }} delay={1.2} size={2} />
        <Sparkle style={{ top: "72%", left: "88%" }} delay={2.7} size={3} />
        <Sparkle style={{ top: "22%", left: "94%" }} delay={0.2} size={2} drift />
        <Sparkle style={{ top: "82%", left: "6%"  }} delay={1.4} size={2} drift />

        <div className="pointer-events-none absolute inset-y-0 left-6 hidden md:flex flex-col justify-between py-32 z-10">
          <span className="text-[14px] tracking-[0.5em] uppercase text-ivory/60 [writing-mode:vertical-rl] rotate-180">
            Hong Kong · MMXXV
          </span>
          <span className="text-[14px] tracking-[0.5em] uppercase text-gold [writing-mode:vertical-rl] rotate-180">
            Maison N° 01
          </span>
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-6 hidden md:flex flex-col justify-between py-32 z-10">
          <span className="text-[14px] tracking-[0.5em] uppercase text-ivory/60 [writing-mode:vertical-rl]">
            Natural · Lab Grown
          </span>
          <span className="text-[14px] tracking-[0.5em] uppercase text-ivory/60 [writing-mode:vertical-rl]">
            GIA · IGI Certified
          </span>
        </div>

        <div className="relative z-10 mx-auto max-w-[1500px] w-full px-6 pt-40 pb-24 md:px-16 md:pt-48 md:pb-32 min-h-[100svh] flex flex-col justify-end">
          <div className="max-w-4xl animate-rise-slow">
            <div className="flex items-center gap-4">
              <span className="h-px w-14 bg-gold" />
              <p className="eyebrow">The Winter Edit · MMXXV</p>
            </div>
            <h1 className="mt-8 font-serif font-light text-[16vw] md:text-[9rem] lg:text-[11rem] leading-[0.88] tracking-[-0.035em]">
              <span className="block">Objects</span>
              <span className="block italic text-gold-gradient -mt-2 md:-mt-4">of quiet</span>
              <span className="block">brilliance.</span>
            </h1>
          </div>

          <div className="mt-14 flex flex-col md:flex-row md:items-end md:justify-between gap-10 animate-rise-slow" style={{ animationDelay: "0.4s" }}>
            <p className="max-w-md text-[15px] leading-[1.7] text-ivory/85">
              A Hong Kong maison of natural and lab grown diamond jewellery. Made slowly, by hand, for
              the lives worth marking.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/collections/engagement-rings"
                className="group relative inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[10.5px] tracking-[0.4em] uppercase text-obsidian overflow-hidden"
              >
                <span className="relative">Explore Collections</span>
                <ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" strokeWidth={1.4} />
              </Link>
              <a
                href={buildWhatsAppLink("Hello Oriva Jewels, I'd like a private consultation.")}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-3 border border-ivory/25 px-9 py-4 text-[10.5px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition"
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
        <div className="animate-marquee flex gap-24 whitespace-nowrap">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-24">
              {[
                "Natural Diamonds",
                "Lab Grown Diamonds",
                "GIA & IGI Certified",
                "Hong Kong Atelier",
                "Bespoke Design",
                "Insured Worldwide",
                "By Appointment",
              ].map((t) => (
                <span key={t} className="flex items-center gap-24 font-serif italic text-2xl md:text-3xl text-ivory/80">
                  <span className="text-gold text-3xl md:text-4xl">✦</span>
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* MANIFESTO */}
      <section className="relative py-32 md:py-48 bg-ink">
        <GsapReveal className="mx-auto max-w-[1400px] px-6 md:px-16">
          <div className="grid gap-16 md:grid-cols-12 md:gap-24 items-start">
            <div className="md:col-span-4 md:sticky md:top-40">
              <p data-gsap className="eyebrow">- Manifesto</p>
              <p data-gsap className="mt-8 text-[13px] tracking-[0.25em] uppercase text-ivory/50">
                Chapter One
              </p>
            </div>
            <div className="md:col-span-8">
              <p data-gsap className="font-serif font-light text-3xl md:text-5xl lg:text-6xl leading-[1.15] text-ivory">
                We believe the finest jewellery is <em className="text-gold-gradient">never loud</em>.
                It is worn every day, folded into small gestures - a hand raised, a
                letter signed, a promise made. It becomes, in time, a
                <em className="text-gold-gradient"> quiet second skin</em>.
              </p>
              <div data-gsap className="mt-12 flex items-center gap-6">
                <span className="h-px flex-1 bg-white/10" />
                <span className="text-[14px] tracking-[0.42em] uppercase text-gold">Oriva · Hong Kong</span>
              </div>
            </div>
          </div>
        </GsapReveal>
      </section>


      {/* COLLECTIONS INDEX - Chapter Wheel */}
      <section className="relative overflow-hidden pb-24 md:pb-36 bg-ink">
        {/* Ambient gold aurora */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(closest-side at 50% 55%, oklch(0.72 0.11 82 / 0.18), transparent 60%)",
          }}
        />

        <div className="relative mx-auto max-w-[1500px] px-6 md:px-16">
          <Reveal className="border-t border-white/10 pt-16 md:pt-20 text-center">
            <p className="eyebrow">- The Index</p>
            <h2 className="mt-6 font-serif text-5xl md:text-7xl leading-[1] text-ivory">
              Six chapters.{" "}
              <em className="text-gold-gradient">One maison.</em>
            </h2>
            <p className="mx-auto mt-6 max-w-lg text-[15px] leading-[1.85] text-ivory/70">
              A curated volume of six edits - each with its own hand, its own hour of the day.
            </p>
          </Reveal>

          {/* Desktop: circular wheel */}
          <div className="relative mx-auto mt-20 hidden md:block aspect-square max-w-[820px]">
            {/* Rotating dashed ring */}
            <div
              aria-hidden
              className="absolute inset-[8%] rounded-full border border-dashed border-gold/25 animate-spin-slow"
            />
            <div
              aria-hidden
              className="absolute inset-[18%] rounded-full border border-white/5"
            />

            {/* Center hub */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <Sparkles className="h-6 w-6 text-gold" strokeWidth={1.2} />
              <p className="mt-5 text-[12px] tracking-[0.5em] uppercase text-gold">Maison N° 01</p>
              <p className="mt-4 font-serif italic text-2xl md:text-3xl text-ivory/90 max-w-xs leading-snug">
                Turn the wheel.<br />Enter a chapter.
              </p>
              <Link
                to="/about"
                className="mt-6 inline-flex items-center gap-2 text-[12px] tracking-[0.4em] uppercase text-ivory/70 border-b border-white/20 pb-1 hover:text-gold hover:border-gold transition"
              >
                Our craftsmanship <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Medallions on ellipse */}
            {collections.map((c, i) => {
              const angle = (-90 + i * 60) * (Math.PI / 180);
              const r = 46; // percent
              const x = 50 + r * Math.cos(angle);
              const y = 50 + r * Math.sin(angle);
              return (
                <div
                  key={c.title}
                  className="absolute animate-fade-in"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: "translate(-50%, -50%)",
                    animationDelay: `${i * 120}ms`,
                  }}
                >
                  <Link to={c.to} className="group block">
                    <div className="relative h-40 w-40 lg:h-48 lg:w-48 rounded-full overflow-hidden border border-white/15 group-hover:border-gold/70 transition duration-500 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
                      <img
                        src={c.img}
                        alt={c.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-obsidian/45 group-hover:bg-obsidian/25 transition duration-500" />
                      <span className="absolute inset-0 flex items-center justify-center font-serif italic text-4xl lg:text-5xl text-ivory group-hover:text-gold group-hover:opacity-0 transition duration-500">
                        {c.n}
                      </span>
                      <span className="absolute inset-0 flex items-center justify-center font-serif text-xl lg:text-2xl text-gold opacity-0 group-hover:opacity-100 transition duration-500 px-3 text-center">
                        {c.title}
                      </span>
                      <span className="pointer-events-none absolute inset-1 rounded-full border border-gold/0 group-hover:border-gold/60 transition duration-500" />
                    </div>
                    <p className="mt-4 text-center text-[11px] tracking-[0.42em] uppercase text-ivory/70 group-hover:text-gold transition whitespace-nowrap">
                      {c.title}
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Mobile: medallion grid */}
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-10 md:hidden">
            {collections.map((c, i) => (
              <Reveal key={c.title} delay={i * 70}>
                <Link to={c.to} className="group flex flex-col items-center">
                  <div className="relative aspect-square w-full max-w-[180px] rounded-full overflow-hidden border border-white/15 group-hover:border-gold/70 transition">
                    <img src={c.img} alt={c.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-obsidian/45" />
                    <span className="absolute inset-0 flex items-center justify-center font-serif italic text-3xl text-ivory">
                      {c.n}
                    </span>
                  </div>
                  <p className="mt-4 text-[11px] tracking-[0.4em] uppercase text-ivory/75">{c.title}</p>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center md:hidden">
            <Link
              to="/about"
              className="inline-flex items-center gap-2 text-[12px] tracking-[0.4em] uppercase text-gold border-b border-gold/60 pb-1"
            >
              Our craftsmanship <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </section>

      {/* SIGNATURE */}
      <section className="relative isolate overflow-hidden bg-obsidian text-ivory">
        <div className="mx-auto max-w-[1600px] grid md:grid-cols-2 items-stretch">
          <div className="relative aspect-[4/5] md:aspect-[4/5] md:min-h-[720px] overflow-hidden order-2 md:order-1 bg-ink">
            <img
              src={editorialImg}
              alt="Signature marquise on velvet"
              loading="lazy"
              className="absolute inset-0 h-full w-full object-contain object-center"
            />
            <GsapSparkles count={6} />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-obsidian/40 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-ivory/85">
              <span className="text-[14px] tracking-[0.42em] uppercase">Ref. OR-MRQ-001</span>
              <span className="text-[14px] tracking-[0.42em] uppercase">Plate I</span>
            </div>
          </div>

          <div className="relative order-1 md:order-2 flex items-center px-6 py-24 md:px-20 md:py-32">
            <GsapReveal className="max-w-lg">
              <p data-gsap className="eyebrow">- The Signature</p>
              <h2 data-gsap className="mt-8 font-serif text-5xl md:text-7xl leading-[0.98] text-ivory">
                The Oriva <em className="text-gold-gradient block">Marquise.</em>
              </h2>
              <div data-gsap className="mt-10 hairline-gold w-24" />
              <p data-gsap className="mt-10 text-[15px] leading-[1.8] text-ivory/80 max-w-md">
                A single elongated diamond, held by four platinum prongs on a whisper of a band.
                A study in restraint - and the piece that opened our maison.
              </p>

              <dl data-gsap className="mt-12 grid grid-cols-2 gap-y-4 gap-x-8 max-w-md text-sm">
                {[
                  ["Cut", "Marquise Brilliant"],
                  ["Setting", "Four Prong"],
                  ["Metal", "Platinum 950"],
                  ["Origin", "Hand-set, Hong Kong"],
                ].map(([k, v]) => (
                  <div key={k} className="border-t border-white/10 pt-3">
                    <dt className="text-[14px] tracking-[0.42em] uppercase text-gold">{k}</dt>
                    <dd className="mt-1.5 font-serif text-lg text-ivory">{v}</dd>
                  </div>
                ))}
              </dl>

              <Link
                data-gsap
                to="/product/$slug"
                params={{ slug: "marquise-solitaire-ring" }}
                className="mt-14 group inline-flex items-center gap-3 text-[10.5px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-2 hover:text-ivory hover:border-ivory transition"
              >
                Discover the piece
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" strokeWidth={1.4} />
              </Link>
            </GsapReveal>
          </div>
        </div>
      </section>

      {/* BEST SELLERS */}
      <section className="relative py-24 md:py-36 bg-ink">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16">
          <GsapReveal className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p data-gsap className="eyebrow">- Selected</p>
              <h2 data-gsap className="mt-6 font-serif text-5xl md:text-6xl text-ivory">
                Most <em className="text-gold-gradient">requested.</em>
              </h2>
              <p data-gsap className="mt-4 max-w-md text-sm text-ivory/55">
                A rotating edit of the pieces our clients return to, season after season.
              </p>
            </div>
            <Link
              data-gsap
              to="/collections/engagement-rings"
              className="text-[14px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory hover:border-ivory transition"
            >
              View entire archive
            </Link>
          </GsapReveal>

          <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-3 md:gap-x-10 md:gap-y-20">
            {products.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={i * 60}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP BY SHAPE */}
      <section className="relative py-24 md:py-36 bg-obsidian overflow-hidden">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16">
          <Reveal className="flex items-end justify-between gap-6 flex-wrap">
            <div className="max-w-xl">
              <p className="eyebrow">- Shop by Shape</p>
              <h2 className="mt-6 font-serif text-5xl md:text-7xl leading-[1] text-ivory">
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

          <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-8">
            {[
              { key: "marquise", label: "Marquise", img: heroImg },
              { key: "oval", label: "Oval", img: engagementImg },
              { key: "emerald", label: "Emerald", img: editorialImg },
              { key: "pear", label: "Pear", img: bridalImg },
              { key: "heart", label: "Heart", img: earringsImg },
              { key: "round", label: "Round", img: braceletsImg },
            ].map((s, i) => (
              <Reveal key={s.key} delay={i * 60}>
                <Link to="/shape/$shape" params={{ shape: s.key }} className="group relative block aspect-[4/5] overflow-hidden">
                  <img src={s.img} alt={s.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/25 to-transparent" />
                  <div className="absolute inset-0 border border-transparent group-hover:border-gold/40 transition" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
                    <p className="text-[12px] tracking-[0.4em] uppercase text-gold">0{i + 1}</p>
                    <h3 className="mt-2 font-serif text-2xl md:text-3xl text-ivory italic">{s.label}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ATELIER */}
      <section className="relative bg-obsidian py-24 md:py-36 overflow-hidden">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16 grid gap-12 md:grid-cols-12 md:gap-16 items-center">
          <Reveal className="md:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img src={atelier} alt="Oriva atelier, Hong Kong" loading="lazy" className="h-full w-full object-cover" />
              <div className="absolute inset-0 border border-gold/20" />
            </div>
            <p className="mt-4 text-[14px] tracking-[0.42em] uppercase text-ivory/80">
              Plate II · The Atelier
            </p>
          </Reveal>

          <Reveal delay={150} className="md:col-span-7 md:pl-8">
            <p className="eyebrow">- The Atelier</p>
            <h2 className="mt-6 font-serif text-5xl md:text-7xl leading-[1] text-ivory">
              Every stone <em className="text-gold-gradient">chosen</em>.
              <br />Every piece <em className="text-gold-gradient">finished</em> by hand.
            </h2>
            <div className="mt-10 space-y-6 text-[15px] leading-[1.8] text-ivory/80 max-w-lg">
              <p>
                Our atelier sits in Central, Hong Kong. It is small - deliberately so. Every piece
                that leaves it has been sourced, set and signed by the same hands.
              </p>
              <p>
                We work in both natural and lab grown diamonds, certified by GIA and IGI - with the
                same craftsmanship applied to both. The choice is yours; the standard is ours.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-lg">
              {[
                ["05", "Diamond specialists"],
                ["100%", "Certified stones"],
                ["30d", "Bespoke lead time"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="font-serif text-3xl md:text-4xl text-gold-gradient">{k}</p>
                  <p className="mt-2 text-[14px] tracking-[0.32em] uppercase text-ivory/50">{v}</p>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="mt-12 inline-flex items-center gap-3 text-[10.5px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-2 hover:text-ivory hover:border-ivory transition"
            >
              Enter the maison <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* OCCASIONS */}
      <section className="py-24 md:py-36 bg-ink">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16">
          <Reveal className="text-center max-w-xl mx-auto">
            <p className="eyebrow">- The Occasions</p>
            <h2 className="mt-6 font-serif text-5xl md:text-6xl text-ivory">
              For every <em className="text-gold-gradient">moment worth marking.</em>
            </h2>
          </Reveal>

          <div className="mt-20 grid grid-cols-2 gap-6 md:grid-cols-5 md:gap-8">
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

      {/* PROMISES */}
      <section className="relative isolate overflow-hidden bg-obsidian py-24 md:py-36">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 15% 20%, oklch(0.79 0.11 82 / 0.15), transparent 45%), radial-gradient(circle at 85% 80%, oklch(0.62 0.11 72 / 0.18), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-[1500px] px-6 md:px-16">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">- The Standard</p>
            <h2 className="mt-6 font-serif text-5xl md:text-7xl leading-[1] text-ivory">
              Four <em className="text-gold-gradient">promises</em>,
              made once, held forever.
            </h2>
          </Reveal>

          <div className="mt-20 grid gap-px bg-white/10 border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, n: "I", title: "Certified Origin", body: "Every stone accompanied by GIA or IGI certification, individually inspected in our atelier." },
              { icon: Gem, n: "II", title: "Natural or Lab", body: "The same craftsmanship applied to both - the choice is entirely yours, without compromise." },
              { icon: Sparkles, n: "III", title: "Bespoke Atelier", body: "One-to-one design consultations for engagement rings and reimagined heirloom pieces." },
              { icon: Globe2, n: "IV", title: "Insured Worldwide", body: "Delivered by hand or by air, fully insured to Hong Kong, Dubai, Singapore, EU and US." },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="h-full bg-obsidian p-8 md:p-10 group">
                  <div className="flex items-center justify-between">
                    <f.icon className="h-6 w-6 text-gold" strokeWidth={1.1} />
                    <span className="font-serif italic text-3xl text-white/10 group-hover:text-gold/40 transition">{f.n}</span>
                  </div>
                  <h3 className="mt-10 font-serif text-2xl md:text-3xl text-ivory">{f.title}</h3>
                  <p className="mt-4 text-sm text-ivory/55 leading-[1.7]">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <section className="py-24 md:py-36 bg-ink">
        <div className="mx-auto max-w-[1600px] px-6 md:px-16">
          <Reveal className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <p className="eyebrow">- @orivajewels</p>
              <h2 className="mt-6 font-serif text-4xl md:text-6xl text-ivory">
                Follow the <em className="text-gold-gradient">maison.</em>
              </h2>
            </div>
            <a
              href="https://instagram.com/orivajewels"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-[14px] tracking-[0.4em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-ivory hover:border-ivory transition"
            >
              Follow on Instagram <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </Reveal>

          <div className="mt-14 grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
            {insta.map((img, i) => (
              <a
                key={i}
                href="https://instagram.com/orivajewels"
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square overflow-hidden"
              >
                <img
                  src={img}
                  alt="Oriva Jewels on Instagram"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-110"
                />
                <span className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition duration-500 grid place-items-center">
                  <span className="text-gold text-2xl">✦</span>
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
