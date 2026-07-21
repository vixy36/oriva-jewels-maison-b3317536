import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/ring-size-guide")({
  head: () => ({
    meta: [
      { title: "Ring Size Guide - Oriva Jewels" },
      { name: "description", content: "Find your ring size in 30 seconds with the Oriva ruler-tape method. International conversion chart for US, UK, EU, Hong Kong, India, Japan and China." },
      { property: "og:title", content: "Ring Size Guide - Oriva Jewels" },
      { property: "og:description", content: "Find your ring size in 30 seconds with the Oriva ruler-tape method." },
    ],
  }),
  component: RingSizePage,
});

interface Row {
  diameter: number; // mm
  circumference: number; // mm
  us: string;
  uk: string;
  hk: string;
  india: string;
  eu: string;
  jp: string;
}

// Full international chart, from the Oriva reference sheet.
const sizeTable: Row[] = [
  { diameter: 14.1, circumference: 44.2, us: "3",    uk: "F",    hk: "6",  india: "4",  eu: "44",    jp: "4"  },
  { diameter: 14.5, circumference: 45.5, us: "3½",   uk: "G",    hk: "7",  india: "5",  eu: "45½",   jp: "5"  },
  { diameter: 14.9, circumference: 46.8, us: "4",    uk: "H",    hk: "8",  india: "7",  eu: "46¾",   jp: "7"  },
  { diameter: 15.3, circumference: 48.0, us: "4½",   uk: "I",    hk: "9",  india: "8",  eu: "48",    jp: "8"  },
  { diameter: 15.7, circumference: 49.3, us: "5",    uk: "J½",   hk: "10", india: "9",  eu: "49¼",   jp: "9"  },
  { diameter: 16.1, circumference: 50.6, us: "5½",   uk: "K½",   hk: "11", india: "10", eu: "50½",   jp: "10" },
  { diameter: 16.5, circumference: 51.9, us: "6",    uk: "L½",   hk: "12", india: "12", eu: "51¾",   jp: "11" },
  { diameter: 16.9, circumference: 53.1, us: "6½",   uk: "M½",   hk: "13", india: "13", eu: "53",    jp: "13" },
  { diameter: 17.3, circumference: 54.4, us: "7",    uk: "N½",   hk: "14", india: "14", eu: "54¼",   jp: "14" },
  { diameter: 17.7, circumference: 55.7, us: "7½",   uk: "O½",   hk: "15", india: "15", eu: "55½",   jp: "15" },
  { diameter: 18.1, circumference: 57.0, us: "8",    uk: "P½",   hk: "16", india: "16", eu: "56¾",   jp: "16" },
  { diameter: 18.5, circumference: 58.3, us: "8½",   uk: "Q½",   hk: "17", india: "17", eu: "58",    jp: "17" },
  { diameter: 18.9, circumference: 59.5, us: "9",    uk: "R½",   hk: "18", india: "18", eu: "59¼",   jp: "18" },
  { diameter: 19.4, circumference: 60.8, us: "9½",   uk: "S½",   hk: "20", india: "19", eu: "60¾",   jp: "19" },
  { diameter: 19.8, circumference: 62.1, us: "10",   uk: "T½",   hk: "21", india: "20", eu: "62",    jp: "20" },
  { diameter: 20.2, circumference: 63.4, us: "10½",  uk: "U½",   hk: "22", india: "22", eu: "63¼",   jp: "22" },
  { diameter: 20.6, circumference: 64.6, us: "11",   uk: "V½",   hk: "23", india: "23", eu: "64½",   jp: "23" },
  { diameter: 21.0, circumference: 65.9, us: "11½",  uk: "W½",   hk: "24", india: "24", eu: "65¾",   jp: "24" },
  { diameter: 21.4, circumference: 67.2, us: "12",   uk: "X½",   hk: "25", india: "25", eu: "67",    jp: "25" },
  { diameter: 21.8, circumference: 68.0, us: "12½",  uk: "Z",    hk: "26", india: "26", eu: "68",    jp: "26" },
  { diameter: 22.2, circumference: 69.7, us: "13",   uk: "Z+1",  hk: "27", india: "27", eu: "69",    jp: "27" },
];

function findByCircumference(mm: number): Row | null {
  if (!mm || mm < 40 || mm > 75) return null;
  return sizeTable.reduce((prev, cur) =>
    Math.abs(cur.circumference - mm) < Math.abs(prev.circumference - mm) ? cur : prev
  );
}

function RingSizePage() {
  const [mode, setMode] = useState<"circ" | "diam">("circ");
  const [value, setValue] = useState<string>("");
  const parsed = parseFloat(value);
  const mmCirc = !isNaN(parsed)
    ? (mode === "circ" ? parsed : parsed * Math.PI)
    : NaN;
  const match = !isNaN(mmCirc) ? findByCircumference(mmCirc) : null;

  return (
    <div className="bg-obsidian text-ivory">
      {/* HERO */}
      <section className="pt-40 pb-16 md:pt-52 md:pb-24 border-b border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <p className="eyebrow">- Client Services</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92]">
            Ring size, <em className="text-gold-gradient">in 30 seconds.</em>
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-[1.9] text-ivory/85">
            A quiet method to size your finger at home - or send us an existing ring and we'll size it for you. Full international conversion below.
          </p>
        </div>
      </section>

      {/* METHOD */}
      <section className="py-20 md:py-28 bg-ink border-b border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 grid gap-16 md:grid-cols-2 items-start">
          <Reveal>
            <p className="eyebrow">- The 30-Second Ruler Tape</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl leading-[1.1]">
              Easiest for <em className="text-gold-gradient">fingertips.</em>
            </h2>
            <p className="mt-6 text-[15px] leading-[1.9] text-ivory/80">
              If you don't have a ring to reference, you can measure the finger itself using standard household supplies.
            </p>

            <ol className="mt-10 space-y-6">
              {[
                "Cut a thin strip of paper, or use a piece of non-stretchy tape (like masking tape).",
                "Wrap it snugly around the base of the target finger.",
                "Mark the exact spot where the tape overlaps with a pen.",
                "Remove the tape, lay it flat, and measure the distance to the mark in millimetres using a standard ruler.",
                "Enter that measurement in the converter opposite to read your international size.",
              ].map((step, i) => (
                <li key={i} className="flex gap-5 border-t border-white/10 pt-5">
                  <span className="font-serif italic text-2xl text-gold shrink-0 w-10">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[15px] leading-[1.85] text-ivory/85">{step}</p>
                </li>
              ))}
            </ol>

            <p className="mt-10 text-[13px] leading-[1.8] text-ivory/60 italic">
              Warm hands measure larger. For daily-wear rings, measure at the end of the day when fingers are at their fullest.
            </p>
          </Reveal>

          {/* CONVERTER */}
          <Reveal delay={100}>
            <div className="border border-gold/30 p-8 md:p-12 bg-obsidian/60">
              <p className="text-[12px] tracking-[0.4em] uppercase text-gold">- Instant Converter</p>
              <h3 className="mt-4 font-serif text-3xl md:text-4xl">Enter your measurement.</h3>

              <div className="mt-8 inline-flex border border-white/15 p-1">
                {([
                  { k: "circ", label: "Circumference" },
                  { k: "diam", label: "Diameter" },
                ] as const).map((t) => (
                  <button
                    key={t.k}
                    onClick={() => setMode(t.k)}
                    className={`px-4 py-2 text-[11px] tracking-[0.35em] uppercase transition ${
                      mode === t.k ? "bg-gold text-obsidian" : "text-ivory/80 hover:text-ivory"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <label className="mt-8 block">
                <span className="text-[12px] tracking-[0.4em] uppercase text-gold">
                  {mode === "circ" ? "Inner circumference (mm)" : "Inner diameter (mm)"}
                </span>
                <input
                  type="number"
                  step="0.1"
                  min={mode === "circ" ? 40 : 12}
                  max={mode === "circ" ? 75 : 24}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder={mode === "circ" ? "e.g. 54.4" : "e.g. 17.3"}
                  className="mt-4 w-full border-b border-white/20 bg-transparent py-3 text-2xl font-serif text-ivory outline-none focus:border-gold transition"
                />
              </label>

              <div className="mt-10 border-t border-white/10 pt-8">
                <p className="text-[12px] tracking-[0.4em] uppercase text-ivory/60">Your size</p>
                {match ? (
                  <>
                    <p className="mt-4 font-serif text-6xl md:text-7xl text-ivory">
                      US <em className="text-gold-gradient not-italic">{match.us}</em>
                    </p>
                    <dl className="mt-8 grid grid-cols-3 gap-x-6 gap-y-5 text-sm">
                      {[
                        ["UK / AU", match.uk],
                        ["EU / FR", match.eu],
                        ["Hong Kong", match.hk],
                        ["India", match.india],
                        ["Japan / CN", match.jp],
                        ["mm", `${match.circumference}`],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <dt className="text-[11px] tracking-[0.3em] uppercase text-ivory/55">{k}</dt>
                          <dd className="mt-2 font-serif text-xl text-ivory">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </>
                ) : (
                  <p className="mt-4 font-serif text-2xl italic text-ivory/50">
                    Awaiting measurement.
                  </p>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* QUICK REFERENCE */}
      <section className="py-20 md:py-28 bg-obsidian border-b border-white/5">
        <div className="mx-auto max-w-[1200px] px-6 md:px-16">
          <Reveal>
            <p className="eyebrow">- Quick Reference</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl">
              Once you have your <em className="text-gold-gradient">millimetres.</em>
            </h2>
            <p className="mt-6 max-w-xl text-[15px] leading-[1.9] text-ivory/75">
              A shorthand list to match your measurement to the standard US size.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { d: 14.1, c: 44.2, s: 3 },
              { d: 14.9, c: 46.8, s: 4 },
              { d: 15.7, c: 49.3, s: 5 },
              { d: 16.5, c: 51.9, s: 6 },
              { d: 17.3, c: 54.4, s: 7 },
              { d: 18.1, c: 57.0, s: 8 },
              { d: 19.0, c: 59.5, s: 9 },
              { d: 19.8, c: 62.1, s: 10 },
            ].map((r, i) => (
              <Reveal key={r.s} delay={i * 40}>
                <div className="border border-white/10 p-6 hover:border-gold/50 transition h-full">
                  <p className="text-[11px] tracking-[0.4em] uppercase text-gold">US Size</p>
                  <p className="mt-3 font-serif text-5xl text-ivory">{r.s}</p>
                  <div className="mt-5 space-y-1 text-[13px] text-ivory/75">
                    <p>{r.d.toFixed(1)} mm diameter</p>
                    <p>{r.c.toFixed(1)} mm circumference</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FULL INTERNATIONAL CHART */}
      <section className="py-20 md:py-28 bg-ink">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <p className="eyebrow">- International Chart</p>
            <h2 className="mt-6 font-serif text-4xl md:text-5xl">
              Every standard, <em className="text-gold-gradient">side by side.</em>
            </h2>
          </Reveal>

          <div className="mt-12 overflow-x-auto border border-white/10">
            <table className="w-full min-w-[720px] text-left text-[14px]">
              <thead>
                <tr className="bg-obsidian/60 text-[11px] tracking-[0.3em] uppercase text-gold">
                  <th className="px-4 py-4 font-normal">Diameter</th>
                  <th className="px-4 py-4 font-normal">Circumference</th>
                  <th className="px-4 py-4 font-normal">US / CA</th>
                  <th className="px-4 py-4 font-normal">UK / AU</th>
                  <th className="px-4 py-4 font-normal">Hong Kong</th>
                  <th className="px-4 py-4 font-normal">India</th>
                  <th className="px-4 py-4 font-normal">EU / FR</th>
                  <th className="px-4 py-4 font-normal">JP / CN</th>
                </tr>
              </thead>
              <tbody className="text-ivory/85">
                {sizeTable.map((r, i) => (
                  <tr key={i} className="border-t border-white/5 hover:bg-obsidian/40 transition">
                    <td className="px-4 py-3">{r.diameter.toFixed(1)} mm</td>
                    <td className="px-4 py-3">{r.circumference.toFixed(1)} mm</td>
                    <td className="px-4 py-3 font-serif text-ivory">{r.us}</td>
                    <td className="px-4 py-3">{r.uk}</td>
                    <td className="px-4 py-3">{r.hk}</td>
                    <td className="px-4 py-3">{r.india}</td>
                    <td className="px-4 py-3">{r.eu}</td>
                    <td className="px-4 py-3">{r.jp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-16 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildWhatsAppLink("Hello Oriva, I'd like help sizing my ring. Could you guide me?")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian hover:bg-gold transition"
            >
              Speak with an advisor <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-3 border border-ivory/25 px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition"
            >
              Contact the atelier
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
