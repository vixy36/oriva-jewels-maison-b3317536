import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import engagementImg from "@/assets/collection-engagement.jpg";
import bridalImg from "@/assets/collection-bridal.jpg";
import earringsImg from "@/assets/collection-earrings.jpg";
import pendantsImg from "@/assets/collection-pendants.jpg";
import insta1 from "@/assets/insta-1.jpg";
import insta6 from "@/assets/insta-6.jpg";
import { Reveal } from "@/components/site/Reveal";
import { buildWhatsAppLink } from "@/lib/products";

export const Route = createFileRoute("/occasions")({
  head: () => ({
    meta: [
      { title: "The Occasion Guide - Oriva Jewels" },
      { name: "description", content: "Proposals, anniversaries, milestones. Fine diamond jewellery for the moments worth marking." },
      { property: "og:title", content: "Occasions - Oriva Jewels" },
      { property: "og:description", content: "Curated pieces for proposals, anniversaries, weddings and quiet milestones." },
      { property: "og:image", content: engagementImg },
    ],
  }),
  component: OccasionsPage,
});

const occasions = [
  { n: "01", label: "The Proposal", img: engagementImg, blurb: "Solitaires and hidden halos - a promise made in a single stone.", cta: "engagement-rings", msg: "engagement ring" },
  { n: "02", label: "The Wedding", img: bridalImg, blurb: "Matched bands and eternity rings, worn for a lifetime.", cta: "bridal", msg: "wedding band" },
  { n: "03", label: "The Anniversary", img: insta6, blurb: "Marking the years quietly - tennis lines, eternity bands, drop earrings.", cta: "bracelets", msg: "anniversary gift" },
  { n: "04", label: "Milestones", img: pendantsImg, blurb: "Births, promotions, private victories. A pendant to remember them by.", cta: "pendants", msg: "milestone piece" },
  { n: "05", label: "The Gift", img: insta1, blurb: "For someone deserving of something rare. We wrap by hand by hand.", cta: "earrings", msg: "gift" },
  { n: "06", label: "Everyday", img: earringsImg, blurb: "Pieces that live with you - worn to work, to sleep, and everywhere between.", cta: "earrings", msg: "everyday piece" },
];

function OccasionsPage() {
  return (
    <div className="bg-obsidian text-ivory">
      <section className="pt-28 pb-10 md:pt-32 md:pb-12 border-b border-white/5">
        <div className="mx-auto max-w-[1400px] px-6 md:px-16 text-center">
          <p className="eyebrow">- Shop by Occasion</p>
          <h1 className="mt-8 font-serif font-light text-6xl md:text-8xl lg:text-9xl leading-[0.92]">
            The <em className="text-gold-gradient">moments</em><br />worth marking.
          </h1>
          <p className="mx-auto mt-10 max-w-xl text-[15px] leading-[1.9] text-ivory/85">
            Every Oriva piece is made for a life. Below, our guide to the ones our clients return to most.
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16 bg-ink">
        <div className="mx-auto max-w-[1500px] px-6 md:px-16 grid gap-10 md:grid-cols-2 md:gap-14">
          {occasions.map((o, i) => (
            <Reveal key={o.label} delay={i * 60}>
              <div className="group relative overflow-hidden bg-obsidian">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img src={o.img} alt={o.label} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                  <div className="absolute inset-0 border border-white/5 group-hover:border-gold/30 transition-colors duration-700" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                  <span className="text-[13px] tracking-[0.4em] uppercase text-gold">{o.n}</span>
                  <h2 className="mt-4 font-serif text-4xl md:text-5xl italic text-ivory">{o.label}</h2>
                  <p className="mt-4 max-w-md text-[14px] leading-[1.8] text-ivory/85">{o.blurb}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link
                      to="/collections/$category"
                      params={{ category: o.cta }}
                      className="inline-flex items-center gap-2 border-b border-gold/50 pb-1 text-[11px] tracking-[0.4em] uppercase text-gold hover:text-ivory hover:border-ivory transition"
                    >
                      View pieces <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.4} />
                    </Link>
                    <a
                      href={buildWhatsAppLink(`Hello Oriva, I'm looking for a ${o.msg}.`)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 border-b border-ivory/30 pb-1 text-[11px] tracking-[0.4em] uppercase text-ivory/85 hover:text-gold hover:border-gold transition"
                    >
                      Enquire
                    </a>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
