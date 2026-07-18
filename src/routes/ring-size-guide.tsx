import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/ring-size-guide")({
  head: () => ({
    meta: [
      { title: "Ring Size Guide - Oriva Jewels" },
      { name: "description", content: "Find your ring size accurately from home. String method, printable sizer and international conversions from the Oriva atelier." },
      { property: "og:title", content: "Ring Size Guide - Oriva Jewels" },
      { property: "og:description", content: "Find your ring size accurately from home." },
    ],
  }),
  component: RingSizePage,
});

// mm circumference → US size (approximate)
const sizeTable: { us: string; uk: string; eu: string; mm: number }[] = [
  { us: "4",  uk: "H",   eu: "47", mm: 46.8 },
  { us: "4.5",uk: "I",   eu: "48", mm: 48.0 },
  { us: "5",  uk: "J½",  eu: "49", mm: 49.3 },
  { us: "5.5",uk: "K½",  eu: "50", mm: 50.6 },
  { us: "6",  uk: "L½",  eu: "51", mm: 51.9 },
  { us: "6.5",uk: "M½",  eu: "53", mm: 53.1 },
  { us: "7",  uk: "N½",  eu: "54", mm: 54.4 },
  { us: "7.5",uk: "O½",  eu: "55", mm: 55.7 },
  { us: "8",  uk: "P½",  eu: "57", mm: 57.0 },
  { us: "8.5",uk: "Q½",  eu: "58", mm: 58.3 },
  { us: "9",  uk: "R½",  eu: "59", mm: 59.5 },
  { us: "9.5",uk: "S½",  eu: "61", mm: 60.8 },
  { us: "10", uk: "T½",  eu: "62", mm: 62.1 },
];

function findSize(mm: number) {
  if (!mm || mm < 40 || mm > 70) return null;
  return sizeTable.reduce((prev, cur) =>
    Math.abs(cur.mm - mm) < Math.abs(prev.mm - mm) ? cur : prev
  );
}

function RingSizePage() {
  const [mm, setMm] = useState<string>("");
  const parsed = parseFloat(mm);
  const match = !isNaN(parsed) ? findSize(parsed) : null;

  return (
    <div className="bg-obsidian text-ivory">
      <section className="pt-40 pb-16 md:pt-52 md:pb-24 border-b border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <p className="eyebrow">- Client Services</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92]">
            Ring size, <em className="text-gold-gradient">privately.</em>
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-[1.9] text-ivory/85">
            Three quiet methods to find your size at home - or send us an existing ring and we'll size it for you.
          </p>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="py-20 md:py-28 bg-ink border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 md:px-16 grid gap-14 md:grid-cols-2 items-start">
          <Reveal>
            <p className="eyebrow">- Instant Converter</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl">
              Enter the inner <em className="text-gold-gradient">circumference.</em>
            </h2>
            <p className="mt-6 text-[14px] leading-[1.8] text-ivory/70">
              Wrap a string around the base of the finger, mark, then measure in millimetres.
            </p>
            <label className="mt-10 block">
              <span className="text-[12px] tracking-[0.4em] uppercase text-gold">Circumference (mm)</span>
              <input
                type="number"
                step="0.1"
                min="40"
                max="70"
                value={mm}
                onChange={(e) => setMm(e.target.value)}
                placeholder="e.g. 54.4"
                className="mt-4 w-full border-b border-white/20 bg-transparent py-3 text-2xl font-serif text-ivory outline-none focus:border-gold transition"
              />
            </label>
          </Reveal>

          <Reveal delay={100}>
            <div className="border border-gold/30 p-10 md:p-14 bg-obsidian/50">
              <p className="text-[12px] tracking-[0.4em] uppercase text-gold">Your size</p>
              {match ? (
                <>
                  <p className="mt-6 font-serif text-6xl md:text-7xl text-ivory">
                    US <em className="text-gold-gradient not-italic">{match.us}</em>
                  </p>
                  <dl className="mt-10 grid grid-cols-3 gap-6 text-sm">
                    <div>
                      <dt className="text-[12px] tracking-[0.3em] uppercase text-ivory/60">UK</dt>
                      <dd className="mt-2 font-serif text-2xl text-ivory">{match.uk}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] tracking-[0.3em] uppercase text-ivory/60">EU</dt>
                      <dd className="mt-2 font-serif text-2xl text-ivory">{match.eu}</dd>
                    </div>
                    <div>
                      <dt className="text-[12px] tracking-[0.3em] uppercase text-ivory/60">mm</dt>
                      <dd className="mt-2 font-serif text-2xl text-ivory">{match.mm}</dd>
                    </div>
                  </dl>
                </>
              ) : (
                <p className="mt-6 font-serif text-2xl italic text-ivory/50">
                  Awaiting measurement.
                </p>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* METHODS */}
      <section className="py-20 md:py-28 bg-obsidian">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <p className="eyebrow">- Methods</p>
            <h2 className="mt-6 font-serif text-4xl md:text-6xl">Three quiet ways.</h2>
          </Reveal>
          <div className="mt-16 grid gap-10 md:grid-cols-3">
            {[
              { n: "I.", t: "The String Method", b: "Wrap a soft string around the base of the finger. Mark where it meets. Measure in millimetres against a ruler - this is your circumference." },
              { n: "II.", t: "An Existing Ring", b: "Measure the inner diameter of a ring that fits well. Multiply by 3.14 for your circumference. Warm hands measure larger - measure at day's end." },
              { n: "III.", t: "The Atelier Sizer", b: "Request our complimentary ring sizer - a discreet paper gauge, posted anywhere in the world within days." },
            ].map((m, i) => (
              <Reveal key={m.t} delay={i * 80}>
                <div className="border-t border-white/15 pt-8 h-full">
                  <span className="font-serif text-3xl italic text-gold">{m.n}</span>
                  <h3 className="mt-4 font-serif text-2xl md:text-3xl text-ivory">{m.t}</h3>
                  <p className="mt-4 text-[14px] leading-[1.8] text-ivory/75">{m.b}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-20 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink("Hello Oriva, could you send me a complimentary ring sizer?")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
            >
              Request a complimentary sizer <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 border border-ivory/25 px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition"
            >
              Speak with the atelier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
