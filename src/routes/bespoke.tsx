import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import atelier from "@/assets/about-atelier.jpg";
import editorial from "@/assets/editorial-emerald.jpg";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/bespoke")({
  head: () => ({
    meta: [
      { title: "Commission an Heirloom - Oriva Jewels" },
      { name: "description", content: "Design a one-of-one diamond piece with the Oriva atelier. A private, three-step commissioning journey." },
      { property: "og:title", content: "Commission an Heirloom - Oriva Jewels" },
      { property: "og:description", content: "A private, three-step diamond commissioning journey with our atelier." },
      { property: "og:image", content: atelier },
    ],
  }),
  component: BespokePage,
});

const steps = [
  { n: "I.", title: "The Conversation", body: "A private consultation - in person by hand, or by WhatsApp. We listen: the person, the moment, the intent." },
  { n: "II.", title: "The Design", body: "Hand sketches, CAD renderings and a curated selection of natural or lab grown diamonds - presented for your approval." },
  { n: "III.", title: "The Making", body: "Wax, casting, setting and polish, entirely within our atelier. Six to ten weeks, delivered with certification and insurance." },
];

function BespokePage() {
  return (
    <div className="bg-obsidian text-ivory" data-surface="dark">
      {/* HERO */}
      <section className="relative isolate overflow-hidden min-h-[80svh]">
        <img src={atelier} alt="Oriva atelier" className="absolute inset-0 h-full w-full object-cover opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-obsidian/50 to-obsidian/95" />
        <div className="relative z-10 mx-auto max-w-[1400px] px-6 md:px-16 pt-24 pb-8 md:pt-28 md:pb-12">
          <p className="eyebrow">- Bespoke Commission</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92] tracking-[-0.02em] text-ivory">
            Commission<br />an <em className="text-gold-gradient drop-shadow-sm">heirloom.</em>
          </h1>
          <p className="mt-10 max-w-xl text-[15px] leading-[1.9] text-ivory/95 font-medium drop-shadow-sm">
            One piece. One person. One moment. A private diamond commission, made entirely by hand in our atelier.
          </p>
          <a
            href={buildWhatsAppLink("Hello Oriva, I'd like to commission a bespoke piece.")}
            target="_blank"
            rel="noreferrer"
            className="mt-12 inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
          >
            Begin the conversation <ArrowRight className="h-4 w-4" strokeWidth={1.4} />
          </a>
        </div>
      </section>

      {/* STEPS */}
      <section className="py-8 md:py-14 bg-ink">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16">
          <Reveal>
            <p className="eyebrow">- The Journey</p>
            <h2 className="mt-6 font-serif text-3xl md:text-5xl">Three <em className="text-gold-gradient">chapters.</em></h2>
          </Reveal>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 100}>
                <div className="border-t border-gold/40 pt-8 h-full">
                  <span className="font-serif text-4xl text-gold italic">{s.n}</span>
                  <h3 className="mt-6 font-serif text-3xl md:text-4xl text-ivory">{s.title}</h3>
                  <p className="mt-6 text-[15px] leading-[1.9] text-ivory/85">{s.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden bg-obsidian">
        <div className="mx-auto max-w-[1600px] grid md:grid-cols-2 items-stretch">
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[560px]">
            <img src={editorial} alt="Commission" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
          </div>
          <div className="flex items-center px-6 py-24 md:px-20 md:py-32">
            <Reveal>
              <p className="eyebrow">- Ready when you are</p>
              <h2 className="mt-8 font-serif text-3xl md:text-4xl">
                Every heirloom begins with a <em className="text-gold-gradient">letter.</em>
              </h2>
              <p className="mt-8 max-w-md text-[15px] leading-[1.9] text-ivory/80">
                Share the story, the stone or the sentiment. We'll take it from there.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={buildWhatsAppLink("Hello Oriva, I'd like to commission a bespoke piece.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 bg-ivory px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-obsidian"
                >
                  WhatsApp our atelier
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-3 border border-ivory/25 px-9 py-4 text-[11px] tracking-[0.4em] uppercase text-ivory hover:border-gold hover:text-gold transition"
                >
                  Book an appointment
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
