import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Gem, Globe2, Award, HeartHandshake, Sparkles } from "lucide-react";
import atelier from "@/assets/about-atelier.jpg";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/assurance")({
  head: () => ({
    meta: [
      { title: "Maison Assurance - Oriva Jewels" },
      { name: "description", content: "GIA and IGI certification, lifetime warranty, insured worldwide shipping and traceable provenance. The Oriva promise." },
      { property: "og:title", content: "Maison Assurance - Oriva Jewels" },
      { property: "og:description", content: "Certification, warranty, insurance and provenance - the Oriva promise." },
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

function AssurancePage() {
  return (
    <div className="bg-obsidian text-ivory">
      <section className="relative isolate overflow-hidden min-h-[70svh]">
        <img src={atelier} alt="Oriva atelier" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/60 to-obsidian" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-16 pt-24 pb-8 md:pt-28 md:pb-12">
          <p className="eyebrow">- Maison Assurance</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92] tracking-[-0.02em]">
            The Oriva <em className="text-gold-gradient">promise.</em>
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-[1.9] text-ivory/85">
            A piece from our atelier arrives with more than a certificate. It arrives with our word.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-14 bg-ink">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 grid gap-x-14 gap-y-16 md:grid-cols-2">
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
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
            >
              Speak with our concierge
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
  );
}
