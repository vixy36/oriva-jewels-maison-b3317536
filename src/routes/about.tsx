import { createFileRoute, Link } from "@tanstack/react-router";
import atelier from "@/assets/about-atelier.jpg";
import editorial from "@/assets/editorial-emerald.jpg";
import insta5 from "@/assets/insta-5.jpg";
import bridal from "@/assets/collection-bridal.jpg";
import { Reveal } from "@/components/site/Reveal";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Oriva Jewels, Hong Kong" },
      { name: "description", content: "A Hong Kong-based fine jewellery house crafting Natural and Lab Grown Diamond jewellery." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div>
      <section className="relative isolate overflow-hidden bg-ink text-ivory">
        <img src={atelier} alt="Oriva atelier" className="absolute inset-0 h-full w-full object-cover opacity-60 animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/40 to-ink" />
        <div className="relative mx-auto max-w-[1400px] px-6 pt-40 pb-28 md:px-10 md:pt-56 md:pb-36">
          <p className="eyebrow">Our Maison</p>
          <h1 className="mt-6 font-serif text-5xl md:text-8xl leading-[0.95] max-w-4xl">
            A Hong Kong-based <em className="italic text-champagne-gradient">fine jewellery house</em>.
          </h1>
          <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-ivory/70">
            Oriva Jewels is a modern maison devoted to Natural and Lab Grown Diamond jewellery —
            designed for the way life is worn today.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
        <Reveal>
          <p className="eyebrow text-center">Our Belief</p>
          <p className="mt-8 font-serif text-3xl md:text-4xl leading-[1.25] italic text-center">
            "The most beautiful jewellery is the piece you never take off."
          </p>
        </Reveal>
      </section>

      {[
        {
          eyebrow: "Modern Luxury",
          title: "Refined, never showy.",
          body: "We believe luxury is a whisper. Our pieces are designed to feel personal — quiet from a distance, extraordinary up close.",
          img: editorial,
        },
        {
          eyebrow: "Certified Craftsmanship",
          title: "Every stone, personally sourced.",
          body: "We work only with GIA and IGI certified diamonds — Natural and Lab Grown — and finish each piece by hand in our Hong Kong atelier.",
          img: insta5,
          flip: true,
        },
        {
          eyebrow: "Timeless Design",
          title: "Made to be worn forever.",
          body: "Silhouettes drawn from decades of jewellery history, made lighter and more wearable for the way we live now.",
          img: bridal,
        },
      ].map((s, i) => (
        <section key={s.title} className="py-16 md:py-24">
          <div className={`mx-auto max-w-[1400px] px-6 md:px-10 grid gap-10 md:grid-cols-2 md:items-center ${s.flip ? "md:[&>div:first-child]:order-2" : ""}`}>
            <Reveal>
              <div className="aspect-[4/5] overflow-hidden">
                <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
              </div>
            </Reveal>
            <Reveal delay={120}>
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{s.title}</h2>
              <p className="mt-6 text-[15px] leading-relaxed text-muted-foreground max-w-lg">{s.body}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="relative isolate overflow-hidden bg-emerald-deep text-ivory">
        <div className="mx-auto max-w-[1200px] px-6 py-24 md:px-10 md:py-32 text-center">
          <p className="eyebrow text-champagne">Personal Consultation</p>
          <h2 className="mt-6 font-serif text-4xl md:text-6xl italic">Design something singular.</h2>
          <p className="mx-auto mt-6 max-w-xl text-[15px] text-ivory/75">
            Speak with our atelier about a bespoke piece, an engagement ring, or a family
            reimagined heirloom.
          </p>
          <Link
            to="/contact"
            className="mt-10 inline-flex items-center gap-3 border border-champagne px-8 py-4 text-[11px] tracking-[0.32em] uppercase text-champagne hover:bg-champagne hover:text-emerald-deep transition"
          >
            Book a Consultation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
