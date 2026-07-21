import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import editorialImg from "@/assets/editorial-emerald.jpg";
import atelier from "@/assets/about-atelier.jpg";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/education")({
  head: () => ({
    meta: [
      { title: "The Diamond Guide - Oriva Jewels" },
      {
        name: "description",
        content:
          "Cut, Colour, Clarity, Carat - and the difference between natural and lab grown diamonds. The Oriva Jewels education guide.",
      },
      { property: "og:title", content: "The Diamond Guide - Oriva Jewels" },
      { property: "og:description", content: "The 4Cs, natural vs lab grown, and how to choose a diamond that lasts a lifetime." },
      { property: "og:image", content: editorialImg },
    ],
  }),
  component: EducationPage,
});

const fourCs = [
  {
    letter: "C·1",
    title: "Cut",
    body: "The most decisive of the four. Cut governs how light travels through a diamond - its fire, brilliance and scintillation. A well-cut stone of modest weight will always outshine a poorly cut, heavier one.",
    grades: ["Excellent", "Very Good", "Good"],
  },
  {
    letter: "C·2",
    title: "Colour",
    body: "Graded from D (colourless) to Z. At Oriva we work almost exclusively in D–G - near-imperceptible warmth, priced to be worn every day.",
    grades: ["D", "E", "F", "G"],
  },
  {
    letter: "C·3",
    title: "Clarity",
    body: "The presence, or absence, of internal characteristics. From Flawless (FL) to Included (I). Most of our pieces sit in the VS1–VVS2 range - eye-clean under any light.",
    grades: ["VVS1", "VVS2", "VS1", "VS2"],
  },
  {
    letter: "C·4",
    title: "Carat",
    body: "A measure of weight, not size. Two diamonds of equal carat can look strikingly different - proportions and cut govern presence on the finger.",
    grades: ["0.5", "1.0", "2.0", "3.0+"],
  },
];

function EducationPage() {
  return (
    <div className="bg-obsidian text-ivory">
      {/* HERO */}
      <section className="relative isolate overflow-hidden min-h-[70svh]">
        <img src={editorialImg} alt="Diamond study" className="absolute inset-0 h-full w-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/60 to-obsidian" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-16 pt-24 pb-8 md:pt-28 md:pb-12">
          <p className="eyebrow">- The Diamond Guide</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92] tracking-[-0.02em]">
            The <em className="text-gold-gradient">Four Cs.</em><br />And what lies beyond.
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-[1.8] text-ivory/80">
            A quiet primer on how we choose the stones that leave our atelier - and how you might choose one for yourself.
          </p>
        </div>
      </section>

      {/* 4Cs */}
      <section className="py-8 md:py-14 bg-ink">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 space-y-24">
          {fourCs.map((c, i) => (
            <Reveal key={c.title}>
              <div className="grid gap-10 md:grid-cols-12 items-start border-t border-white/10 pt-16">
                <div className="md:col-span-3">
                  <span className="text-[14px] tracking-[0.4em] uppercase text-gold">{c.letter}</span>
                  <h2 className="mt-6 font-serif text-5xl md:text-6xl italic text-ivory">{c.title}</h2>
                </div>
                <div className="md:col-span-6">
                  <p className="text-[15px] leading-[1.9] text-ivory/85">{c.body}</p>
                </div>
                <div className="md:col-span-3">
                  <p className="text-[13px] tracking-[0.3em] uppercase text-ivory/60 mb-4">Oriva selects</p>
                  <ul className="space-y-2">
                    {c.grades.map((g) => (
                      <li key={g} className="flex items-center gap-3 font-serif text-lg text-ivory">
                        <span className="h-px w-6 bg-gold" /> {g}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* LAB vs NATURAL */}
      <section className="relative py-8 md:py-14 bg-obsidian">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <p className="eyebrow">- Origin</p>
            <h2 className="mt-6 font-serif text-5xl md:text-7xl">
              Natural, or <em className="text-gold-gradient">lab grown.</em>
            </h2>
            <p className="mt-8 max-w-2xl text-[15px] leading-[1.9] text-ivory/80">
              Chemically, optically and structurally identical. The difference lies in origin - and in the story you wish the piece to carry.
            </p>
          </Reveal>

          <div className="mt-10 grid gap-10 md:grid-cols-2">
            {[
              {
                k: "Natural",
                tag: "Born of the earth",
                body: "Formed over billions of years under extraordinary pressure. Each stone is finite, traceable and unrepeatable. GIA certified.",
              },
              {
                k: "Lab Grown",
                tag: "Crafted with intention",
                body: "Grown in weeks using the same conditions found deep within the earth. Chemically identical, with a lighter footprint and a modern conscience. IGI certified.",
              },
            ].map((x) => (
              <Reveal key={x.k} className="border border-white/10 p-10 md:p-14 hover:border-gold/40 transition">
                <p className="text-[13px] tracking-[0.4em] uppercase text-gold">{x.tag}</p>
                <h3 className="mt-6 font-serif text-4xl md:text-5xl italic">{x.k}</h3>
                <p className="mt-8 text-[15px] leading-[1.9] text-ivory/80">{x.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-8 md:py-14 bg-ink border-t border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 md:px-16 text-center">
          <Sparkles className="mx-auto h-6 w-6 text-gold" strokeWidth={1.2} />
          <h2 className="mt-8 font-serif text-4xl md:text-6xl">
            A private consultation, <em className="text-gold-gradient">at your pace.</em>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-[15px] leading-[1.8] text-ivory/80">
            Speak with a diamond specialist. We source, curate and hand-set every stone by hand.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink("Hello Oriva, I'd like a diamond consultation.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
            >
              Book a consultation <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <Link
              to="/bespoke"
              className="inline-flex items-center gap-3 border border-ivory/25 px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition"
            >
              Commission a piece
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
