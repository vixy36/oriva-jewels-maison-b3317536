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
      { title: "The Maison — Oriva Jewels, Hong Kong" },
      { name: "description", content: "A Hong Kong maison of natural and lab grown diamond jewellery. Our story, our craftsmanship, our beliefs." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="bg-ink">
      <section className="relative isolate overflow-hidden bg-obsidian text-ivory min-h-[80svh] flex items-end">
        <img src={atelier} alt="Oriva atelier" className="absolute inset-0 h-full w-full object-cover opacity-55 animate-slow-zoom" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/50 via-obsidian/40 to-obsidian" />
        <div className="absolute inset-0 vignette" />
        <div className="relative mx-auto max-w-[1500px] w-full px-6 pt-48 pb-24 md:px-16 md:pt-56 md:pb-32">
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />
            <p className="eyebrow">The Maison</p>
          </div>
          <h1 className="mt-8 font-serif text-6xl md:text-[9rem] leading-[0.9] tracking-[-0.02em]">
            <span className="block">A quiet</span>
            <span className="block italic text-gold-gradient">house</span>
            <span className="block">of light.</span>
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-[1.8] text-ivory/70">
            Oriva Jewels is a modern maison of natural and lab grown diamond jewellery — designed
            in Hong Kong, finished by hand, worn for a lifetime.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-32 md:py-48 text-center">
        <Reveal>
          <span className="text-gold text-4xl">✦</span>
          <p className="mt-10 font-serif text-3xl md:text-6xl leading-[1.12] italic text-ivory">
            "The most beautiful jewellery <span className="text-gold-gradient not-italic">is the piece</span> you never take off."
          </p>
          <p className="mt-10 text-[10px] tracking-[0.42em] uppercase text-ivory/40">— Founder's Note</p>
        </Reveal>
      </section>

      {[
        {
          n: "I",
          eyebrow: "— Modern Luxury",
          title: "Refined,",
          titleAccent: "never showy.",
          body: "We believe luxury is a whisper. Our pieces are designed to feel personal — quiet from a distance, extraordinary up close. Nothing is added for effect; nothing is spared for craft.",
          img: editorial,
        },
        {
          n: "II",
          eyebrow: "— Certified Craftsmanship",
          title: "Every stone,",
          titleAccent: "personally sourced.",
          body: "We work only with GIA and IGI certified diamonds — Natural and Lab Grown — and finish each piece by hand in our Hong Kong atelier. Every setting is checked, every prong is tuned.",
          img: insta5,
          flip: true,
        },
        {
          n: "III",
          eyebrow: "— Timeless Design",
          title: "Made to be",
          titleAccent: "worn forever.",
          body: "Silhouettes drawn from decades of jewellery history, made lighter and more wearable for how we live now. Not fashion. Not trend. Something to be handed on.",
          img: bridal,
        },
      ].map((s) => (
        <section key={s.n} className="py-20 md:py-32">
          <div className={`mx-auto max-w-[1500px] px-6 md:px-16 grid gap-12 md:grid-cols-12 md:gap-16 md:items-center ${s.flip ? "md:[&>div:first-child]:order-2" : ""}`}>
            <Reveal className="md:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img src={s.img} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                <div className="absolute inset-0 border border-gold/15" />
                <span className="absolute top-4 left-4 text-[10px] tracking-[0.42em] uppercase text-ivory/70 bg-obsidian/60 px-2.5 py-1 backdrop-blur">
                  Plate {s.n}
                </span>
              </div>
            </Reveal>
            <Reveal delay={150} className="md:col-span-6 md:pl-6">
              <p className="eyebrow">{s.eyebrow}</p>
              <h2 className="mt-6 font-serif text-5xl md:text-7xl leading-[1] text-ivory">
                {s.title}<br />
                <em className="text-gold-gradient">{s.titleAccent}</em>
              </h2>
              <div className="mt-8 hairline-gold w-16" />
              <p className="mt-8 text-[15px] leading-[1.8] text-ivory/65 max-w-lg">{s.body}</p>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="relative isolate overflow-hidden bg-obsidian text-ivory">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 50% 100%, oklch(0.79 0.11 82 / 0.2), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 py-32 md:px-16 md:py-40 text-center">
          <p className="eyebrow">— Private Consultation</p>
          <h2 className="mt-8 font-serif text-5xl md:text-8xl leading-[0.95]">
            Design something <em className="text-gold-gradient">singular.</em>
          </h2>
          <p className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.8] text-ivory/65">
            Speak with our atelier about a bespoke piece, an engagement ring, or a family
            heirloom reimagined for the way you live now.
          </p>
          <Link
            to="/contact"
            className="mt-12 inline-flex items-center gap-3 bg-gold text-obsidian px-10 py-4 text-[10.5px] tracking-[0.4em] uppercase hover:bg-ivory transition"
          >
            Book a Consultation
            <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
          </Link>
        </div>
      </section>
    </div>
  );
}
