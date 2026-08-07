import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { ArrowRight, ArrowUpRight, MessageCircle, Paperclip, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
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
import emeraldProduct from "@/assets/product-emerald-studs.jpg";


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
      { title: "Oriva Jewels | Fine Natural & Lab Grown Diamond Jewellery" },
      {
        name: "description",
        content:
          "A modern maison of fine natural and lab grown diamond jewellery. Shop engagement rings, earrings, and custom pieces at OrivaJewels.com.",
      },
      { property: "og:title", content: "Oriva Jewels | Fine Natural & Lab Grown Diamond Jewellery" },
      { property: "og:description", content: "Timeless brilliance, crafted for modern elegance. Natural and lab grown diamonds at OrivaJewels.com." },
      { property: "og:image", content: heroImg },
      { name: "twitter:image", content: heroImg },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  { n: "05", title: "HipHop", to: "/collections/hiphop", img: braceletsImg },
  { n: "06", title: "Lab Grown Diamonds", to: "/collections/lab-grown", img: labgrownImg },
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
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const selectedSix = useMemo(() => products.slice(0, 8), []);
  
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
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = buildWhatsAppLink("Hello Oriva Jewels, I'd like a private consultation.");
                }}
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


      {/* THE INDEX - Clean category grid */}
      <section className="py-20 bg-background overflow-hidden border-b border-ivory/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="eyebrow block mb-4">THE INDEX</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Six chapters. <span className="italic font-light">One maison.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-muted-foreground uppercase tracking-widest">
              A curated volume of six edits—each with its own character, designed for a lifetime.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 md:gap-8">
            {collections.map((c, i) => (
              <Reveal key={c.title} delay={i * 100}>
                <Link
                  to={c.to}
                  className="group block relative w-full"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                      src={c.img}
                      alt={c.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-obsidian/10 group-hover:bg-obsidian/0 transition-colors duration-500" />
                  </div>
                  <div className="mt-4 flex items-start justify-between">
                    <div>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-medium mb-1 block">Chapter {c.n}</span>
                      <h3 className="text-[13px] sm:text-[15px] font-serif text-obsidian uppercase tracking-wide">{c.title}</h3>
                    </div>
                    <ArrowUpRight className="h-3.5 w-3.5 text-obsidian transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>





      {/* MOST REQUESTED - Clean product showcase */}
      <section className="py-20 bg-background overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="eyebrow block mb-4">MOST REQUESTED</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                The Selected Six. <span className="italic font-light">Fine diamond edits.</span>
              </h2>
            </div>
            <Link
              to="/collections/engagement-rings"
              className="text-[13px] tracking-[0.3em] uppercase text-obsidian border-b border-gold/40 pb-1 hover:text-gold transition-colors"
            >
              View entire collection
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5 md:gap-7">
            {selectedSix.slice(0, 6).map((p, i) => (
              <Reveal key={p.slug} delay={i * 100}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* SHOP BY SHAPE */}
      <section className="py-24 bg-background border-b border-ivory/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="eyebrow block mb-4">SHOP BY SHAPE</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                Find your <span className="italic font-light">silhouette.</span>
              </h2>
            </div>
            <Link to="/education" className="text-[13px] tracking-[0.3em] uppercase text-gold border-b border-gold/50 pb-1 hover:text-obsidian hover:border-obsidian transition-colors">
              The diamond guide
            </Link>
          </Reveal>

          <div className="mt-8 flex overflow-x-auto md:overflow-visible pb-8 md:pb-0 snap-x snap-mandatory hide-scrollbar gap-6 md:gap-12 justify-start md:justify-center max-w-[1200px] mx-auto">
            {[
              { key: "marquise", label: "Marquise", img: heroImg },
              { key: "oval", label: "Oval", img: engagementImg },
              { key: "emerald", label: "Emerald", img: emeraldProduct },
              { key: "pear", label: "Pear", img: bridalImg },
              { key: "heart", label: "Heart", img: earringsImg },
              { key: "round", label: "Round", img: braceletsImg },
            ].map((s, i) => (
              <Reveal key={s.key} delay={i * 60} className="flex-none w-[110px] md:w-[130px] snap-center">
                <Link to="/shape/$shape" params={{ shape: s.key }} className="group block text-center max-w-[110px] md:max-w-[130px] mx-auto">
                  <div className="relative aspect-square overflow-hidden bg-muted mb-4 rounded-full border border-ivory/10 group-hover:border-gold transition-colors">
                    <img src={s.img} alt={s.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110" />
                  </div>
                  <h3 className="font-serif text-[13px] md:text-[14px] text-obsidian uppercase tracking-[0.2em] font-medium">{s.label}</h3>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* THE ATELIER - High contrast craftsmanship */}
      <section className="py-24 bg-obsidian text-ivory overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
            <Reveal className="lg:col-span-5 lg:pr-12">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm max-w-[450px] mx-auto lg:mx-0">
                <img
                  src={atelier}
                  alt="The Oriva Atelier"
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-obsidian/10" />
              </div>
            </Reveal>

            <Reveal delay={200} className="lg:col-span-7">
              <div className="max-w-2xl">
                <span className="eyebrow block mb-6 text-gold">- THE ATELIER</span>
                <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">
                  Every stone <span className="italic">chosen.</span><br />
                  Every piece <span className="italic">signed by hand.</span>
                </h2>
                <div className="space-y-6 text-ivory/70 text-[16px] leading-relaxed mb-12">
                  <p>
                    We are end-to-end manufacturers. From the rough stone to the final polish, your piece never leaves our care. This ensures a level of precision and ethical transparency that only a direct maison can provide.
                  </p>
                  <p>
                    Whether natural or lab-grown, our standard remains absolute. Every diamond is hand-selected for its fire and brilliance, certified by GIA or IGI, and set by master craftsmen in our private workshop.
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-12 border-t border-ivory/10 pt-10">
                  <div>
                    <span className="text-4xl font-bold text-ivory block mb-2 font-sans">100%</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gold">Certified stones</span>
                  </div>
                  <div>
                    <span className="text-4xl font-bold text-ivory block mb-2 font-sans">30D</span>
                    <span className="text-[10px] tracking-[0.3em] uppercase text-gold">Bespoke lead time</span>
                  </div>
                </div>

                <div className="mt-12">
                  <Link
                    to="/about"
                    className="inline-flex items-center gap-4 text-[13px] tracking-[0.4em] uppercase text-gold border-b border-gold pb-1 hover:text-ivory hover:border-ivory transition-colors"
                  >
                    Enter the maison <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* THE OCCASIONS - Bold lifestyle grid */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="eyebrow block mb-4">THE OCCASIONS</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              For every <span className="italic">moment worth marking.</span>
            </h2>
          </Reveal>

          <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6">
            {occasions.map((o, i) => (
              <Reveal key={o.label} delay={i * 100} className="flex-none w-[200px] md:w-[260px] snap-center">
                <Link to="/occasions" className="group block relative overflow-hidden aspect-square rounded-sm">
                  <img
                    src={o.img}
                    alt={o.label}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-obsidian/30 group-hover:bg-obsidian/10 transition-colors duration-500" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-8 text-ivory">
                    <span className="text-[9px] tracking-[0.3em] uppercase text-gold block mb-1">{o.tag}</span>
                    <h3 className="text-lg md:text-xl font-serif tracking-wide uppercase">{o.label}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* THE PROCESS - Simple linear steps */}
      <section className="py-24 bg-background border-t border-ivory/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="eyebrow block mb-4">THE PROCESS</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight">
                From a sketch <span className="italic font-light">to her finger.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-muted-foreground uppercase tracking-widest">
              Three unhurried steps to your forever piece. Masterfully crafted, personally delivered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { n: "01", title: "Consultation", desc: "A private conversation about your vision, the diamond's character, and the budget that moves you." },
              { n: "02", title: "CAD & Reveal", desc: "A photorealistic 3D rendering of your design. We refine every facet together until it is unmistakably yours." },
              { n: "03", title: "Craft & Delivery", desc: "Hand-set by our master jewellers and delivered securely to your door, worldwide and fully insured." },
            ].map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="relative pt-12 border-t border-ivory/10 group">
                  <span className="absolute top-0 left-0 text-[11px] tracking-[0.4em] uppercase text-gold py-4">{s.n}</span>
                  <h3 className="text-2xl font-serif text-obsidian uppercase tracking-wide mb-6 group-hover:text-gold transition-colors">{s.title}</h3>
                  <p className="text-[15px] leading-relaxed text-muted-foreground max-w-sm">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 text-center">
            <a
              href={buildWhatsAppLink("Hello Oriva Jewels, I'd like to begin a bespoke design consultation.")}
              className="inline-flex items-center justify-center gap-4 bg-obsidian text-ivory px-12 py-5 text-[12px] tracking-[0.5em] uppercase hover:bg-gold hover:text-obsidian transition-colors duration-500"
            >
              <MessageCircle className="h-5 w-5" />
              Begin your piece
            </a>
          </div>
        </div>
      </section>

      {/* ENGAGEMENT RINGS - Custom Commission */}
      <EngagementRingsSection />




      {/* THE CLIENTELE - Refined editorial reviews */}
      <section className="py-24 bg-background overflow-hidden border-t border-ivory/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <span className="eyebrow block mb-4">THE CLIENTELE</span>
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              In their <span className="italic">own words.</span>
            </h2>
          </Reveal>

          <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar gap-8 md:gap-12">
            {[
              {
                q: "The most personal buying experience I've ever had. The CAD reveal made me tear up—and the ring somehow exceeded it.",
                a: "Sarah W.",
                place: "London",
              },
              {
                q: "I sent a photo on WhatsApp at midnight. By morning I had sketches. Six weeks later the ring was on my fiancée's finger.",
                a: "Rohit M.",
                place: "Dubai",
              },
              {
                q: "Lab grown, three carats, hidden halo. Photographed it, showed my jeweller friend—she asked who did it. That says everything.",
                a: "Amelia K.",
                place: "New York",
              },
            ].map((r, i) => (
              <Reveal key={r.a} delay={i * 100} className="flex-none w-[280px] md:w-[400px] snap-center">
                <div className="flex flex-col h-full text-center group">
                  <div className="flex justify-center gap-1 text-gold mb-8">
                    {Array.from({ length: 5 }).map((_, k) => <span key={k}>★</span>)}
                  </div>
                  <blockquote className="flex-grow font-serif italic text-2xl md:text-3xl leading-relaxed text-obsidian/90 mb-10 group-hover:text-obsidian transition-colors">
                    "{r.q}"
                  </blockquote>
                  <div className="pt-8 border-t border-ivory/10">
                    <p className="text-[12px] tracking-[0.4em] uppercase text-obsidian font-semibold mb-1">{r.a}</p>
                    <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground">{r.place}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-obsidian text-ivory overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12 grid gap-16 lg:grid-cols-12 items-start">
          <Reveal className="lg:col-span-4">
            <span className="eyebrow block mb-6 text-gold">- FREQUENTLY ASKED</span>
            <h2 className="text-4xl font-serif leading-tight mb-8">
              A few <span className="italic">answers.</span>
            </h2>
            <p className="text-ivory/60 text-[15px] leading-relaxed">
              If your question isn't covered here, our atelier is available for a direct conversation worldwide.
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:col-span-8">
            <div className="divide-y divide-ivory/10 border-y border-ivory/10">
              {[
                {
                  q: "Do you offer lab grown and natural diamonds?",
                  a: "Yes - both, at every price point. Every stone is GIA or IGI certified, and the same setters finish both. The choice is yours; the standard is ours.",
                },
                {
                  q: "What metals and karats are available?",
                  a: "18K, 14K and 9K gold in White, Yellow and Rose for select pieces. Any Oriva design can be crafted in any of them.",
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
      <section className="py-24 bg-obsidian border-t border-ivory/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div className="max-w-xl">
              <span className="eyebrow block mb-4">@ORIVA__JEWELS</span>
              <h2 className="text-4xl md:text-5xl font-serif leading-tight text-ivory">
                The <span className="italic">Digital Maison.</span>
              </h2>
            </div>
            <p className="max-w-xs text-[14px] leading-relaxed text-ivory/60 uppercase tracking-widest">
              Follow our journey, from raw stones to finished masterworks.
            </p>
          </Reveal>


          <div className="mt-10 flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6">
            {instagramReels.map((reel) => (
              <a
                key={reel.href}
                href={reel.href}
                target="_blank"
                rel="noreferrer"
                aria-label={`Open ${reel.title} on Instagram`}
                className="flex-none w-[200px] md:w-[260px] snap-center group relative aspect-[4/5] overflow-hidden bg-obsidian border border-white/5 block rounded-sm"
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
  const goldColors = ["White Gold", "Yellow Gold", "Rose Gold"];
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
    window.location.href = buildWhatsAppLink(msg);
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
        <Reveal className="md:col-span-4 lg:col-span-4">
          <div className="relative aspect-[3/4] overflow-hidden rounded-sm max-w-[380px] mx-auto md:mx-0">
            <img
              src={engagementModel}
              alt="Diamond engagement ring on hand"
              loading="lazy"
              width={1024}
              height={1024}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 border border-gold/10" />
          </div>
          <p className="mt-4 text-[12px] tracking-[0.4em] uppercase text-ivory/60 text-center md:text-left">
            Plate III · Engagement
          </p>
        </Reveal>

        <Reveal delay={120} className="md:col-span-8 lg:col-span-8 md:pl-8">
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
        <div className="border border-white/10 bg-black/30 overflow-hidden">
          <button
            type="button"
            onClick={() => setIsEnquiryOpen(!isEnquiryOpen)}
            className="flex w-full items-center justify-between p-6 md:p-10 text-left"
          >
            <div>
              <p className="eyebrow">- Enquiry Form</p>
              <h3 className="mt-3 font-serif text-2xl md:text-3xl text-ivory">
                Begin your <em className="text-gold-gradient">commission.</em>
              </h3>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 text-[12px] text-ivory/60">
                <Paperclip className="h-3.5 w-3.5 text-gold" strokeWidth={1.4} />
                Attach reference photos in WhatsApp.
              </div>
              {isEnquiryOpen ? (
                <ChevronUp className="h-6 w-6 text-gold" />
              ) : (
                <ChevronDown className="h-6 w-6 text-gold" />
              )}
            </div>
          </button>

          {isEnquiryOpen && (
            <div className="px-6 pb-6 md:px-10 md:pb-10">

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
          )}
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

