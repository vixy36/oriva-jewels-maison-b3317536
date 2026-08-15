import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Gem, Globe2, Award, HeartHandshake, Sparkles } from "lucide-react";
import atelier from "@/assets/about-atelier.jpg";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";
import { CustomPageWrapper } from "@/components/site/CustomPageWrapper";

export const Route = createFileRoute("/assurance")({
  head: () => ({
    meta: [
      { title: "Maison Assurance | Oriva Jewels" },
      { name: "description", content: "GIA and IGI certification, lifetime warranty, and traceable provenance at OrivaJewels.com. The Oriva promise." },
      { property: "og:title", content: "Maison Assurance | Oriva Jewels" },
      { property: "og:description", content: "Certification, warranty, and provenance - the Oriva promise at OrivaJewels.com." },
      { property: "og:image", content: atelier },
    ],
  }),
  component: AssurancePage,
});

const pillars = [
  { Icon: Award, t: "GIA · IGI Certified", b: "Every diamond above 0.30 ct arrives with an independent laboratory grading report. Natural stones by GIA, lab grown by IGI." },
  { Icon: ShieldCheck, t: "Lifetime Warranty", b: "Every Oriva piece is warranted for life against manufacturing defects. Complimentary cleaning, prong-checks and re-polishing, forever." },
  { Icon: Globe2, t: "Insured Worldwide", b: "Complimentary insured shipping to over 90 countries. Signature required. Discreetly packaged, entirely traceable." },
  { Icon: Gem, t: "Traceable Provenance", b: "Conflict-free sourcing, verified supply chain. Kimberley Process and RJC standards, without exception." },
  { Icon: HeartHandshake, t: "30-Day Exchange", b: "A rare piece deserves rare confidence. Exchange or resize within 30 days of receipt, unworn." },
  { Icon: Sparkles, t: "Complimentary Care", b: "Annual cleaning and inspection at our atelier - or by post, with insured return." },
];

const advantageItems = [
  {
    t: "In-House Manufacturing",
    b: "Operating our own state-of-the-art facilities ensures absolute quality control at every stage of production."
  },
  {
    t: "Direct Factory Pricing",
    b: "Eliminating the middleman allows us to deliver unparalleled luxury and value directly from our foundry to you."
  },
  {
    t: "Bespoke Customization",
    b: "Offering complete design freedom with 100% custom tailoring to bring your unique vision to life."
  },
  {
    t: "Global Reach",
    b: "Bringing our bespoke craftsmanship to a worldwide clientele with fully insured, seamless international shipping."
  },
  {
    t: "Engagement Ring Specialists",
    b: "Crafting the ultimate symbols of love with meticulously selected certified lab diamonds and flawless settings."
  }
];

const expertiseItems = [
  {
    t: "Certified Diamond Cultivation",
    b: "Creating masterfully grown, fully certified lab diamonds that mirror the flawless brilliance of nature."
  },
  {
    t: "Artisanal Fine Jewelry",
    b: "Fusing meticulous precision engineering with high-end craftsmanship for exceptional, enduring designs."
  },
  {
    t: "Bespoke Development",
    b: "Collaborating from initial custom design concepts through to meticulous, large-scale manufacturing."
  },
  {
    t: "Private Label Partnerships",
    b: "Providing premier OEM solutions and reliable manufacturing excellence for global jewelry brands."
  },
  {
    t: "Conscious Luxury",
    b: "Leading with uncompromising ethical sourcing and sustainable standards for a modern, greener future."
  }
];

function AssurancePage() {
  return (
    <CustomPageWrapper slug="assurance" title="Maison Assurance">

      <div className="bg-obsidian text-ivory">
      <section className="relative isolate overflow-hidden min-h-[70svh]">
        <img src={atelier} alt="Oriva atelier" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/60 to-obsidian" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-16 pt-24 pb-8 md:pt-28 md:pb-12">
          <p className="eyebrow">- Maison Assurance</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92] tracking-[-0.02em] text-white">
            The Oriva <em className="text-gold-gradient not-italic">promise.</em>
          </h1>
          <div className="mt-12 max-w-2xl">
            <h2 className="text-gold text-[13px] tracking-[0.4em] uppercase mb-6 font-bold">Setting the New Standard for Sustainable Luxury</h2>
            <p className="text-[17px] leading-[1.9] text-ivory/85 font-medium">
              Our vision is to become a global leader in conscious fine jewelry, proving that the world's most magnificent designs can be crafted responsibly. By seamlessly bridging a decade of heritage industry knowledge with forward-thinking sustainable innovation, Oriva Jewels aims to shape a greener, more brilliant future where luxury and nature thrive together for generations to come.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-obsidian border-y border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <h2 className="font-serif text-5xl md:text-7xl mb-16 text-white">The Oriva <span className="text-gold-gradient italic">Advantage</span></h2>
          </Reveal>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {advantageItems.map((item, i) => (
              <Reveal key={item.t} delay={i * 100}>
                <div className="group border-l border-gold/30 pl-8 py-4 hover:border-gold transition-colors duration-500">
                  <h3 className="font-serif text-3xl mb-4 text-white group-hover:text-gold transition-colors duration-500">{item.t}</h3>
                  <p className="text-ivory/70 text-[15px] leading-[1.8] font-medium">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-ink">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <h2 className="font-serif text-5xl md:text-7xl mb-16 text-white text-right">Our Core <span className="text-gold-gradient italic">Expertise</span></h2>
          </Reveal>
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {expertiseItems.map((item, i) => (
              <Reveal key={item.t} delay={i * 100}>
                <div className="group border-r border-gold/30 pr-8 py-4 text-right hover:border-gold transition-colors duration-500">
                  <h3 className="font-serif text-3xl mb-4 text-white group-hover:text-gold transition-colors duration-500">{item.t}</h3>
                  <p className="text-ivory/70 text-[15px] leading-[1.8] font-medium ml-auto max-w-sm">{item.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-32 bg-obsidian">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <span className="eyebrow text-gold mb-12 block">Certification & Service</span>
          </Reveal>
          <div className="grid gap-x-14 gap-y-16 md:grid-cols-2">
            {pillars.map((p, i) => (
              <Reveal key={p.t} delay={i * 60}>
                <div className="flex gap-8 border-t border-white/10 pt-10">
                  <div className="shrink-0">
                    <div className="grid h-14 w-14 place-items-center border border-gold/40 text-gold">
                      <p.Icon className="h-5 w-5" strokeWidth={1.2} />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif text-3xl md:text-4xl text-ivory italic">{p.t}</h3>
                    <p className="mt-4 text-[15px] leading-[1.9] text-ivory/80 max-w-md">{p.b}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-obsidian border-t border-white/5">
        <div className="mx-auto max-w-[1000px] px-6 md:px-16 text-center">
          <p className="eyebrow">- Questions</p>
          <h2 className="mt-6 font-serif text-3xl md:text-4xl">
            Something we haven't <em className="text-gold-gradient">answered?</em>
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink("Hello Oriva, I have a question about your maison assurance.")}
              onClick={(e) => {
                e.preventDefault();
                window.location.href = buildWhatsAppLink("Hello Oriva, I have a question about your maison assurance.");
              }}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
            >
              Message the atelier
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 border border-ivory/25 px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition"
            >
              Written correspondence
            </Link>
          </div>
        </div>
      </section>
    </div>
    </CustomPageWrapper>
  );
}
