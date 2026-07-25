import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import labgrownImg from "@/assets/collection-labgrown.jpg";
import naturalImg from "@/assets/collection-engagement.jpg";
import editorialImg from "@/assets/editorial-emerald.jpg";

export const Route = createFileRoute("/diamonds")({
  head: () => ({
    meta: [
      { title: "Diamonds — Natural & Lab Grown | Oriva Jewels" },
      {
        name: "description",
        content:
          "Explore Oriva's natural and lab grown diamonds — certified, ethically sourced, cut for maximum brilliance.",
      },
      { property: "og:title", content: "Diamonds — Natural & Lab Grown | Oriva Jewels" },
      {
        property: "og:description",
        content: "Certified natural and lab grown diamonds, hand-selected by Oriva Jewels.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DiamondsPage,
});

function DiamondsPage() {
  return (
    <div className="pt-24 md:pt-28">
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pt-10 md:pt-16 pb-10 text-center">
        <Reveal>
          <p className="eyebrow">The Stone</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-[1.05] text-obsidian">
            Diamonds, considered.
          </h1>
          <p className="mt-5 mx-auto max-w-2xl text-[15px] md:text-base text-obsidian/70 leading-relaxed">
            Every Oriva diamond — whether earth-mined or laboratory-grown — is graded
            for cut, colour, clarity, and carat by independent laboratories. Choose the
            origin that speaks to you.
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pb-16 md:pb-24 grid gap-6 md:grid-cols-2">
        {[
          {
            to: "/collections/natural",
            title: "Natural Diamonds",
            blurb: "Formed over billions of years. Ethically sourced, conflict-free, certified.",
            image: naturalImg,
          },
          {
            to: "/collections/lab-grown",
            title: "Lab Grown Diamonds",
            blurb: "Chemically identical to natural — cultivated with a modern conscience.",
            image: labgrownImg,
          },
        ].map((c) => (
          <Reveal key={c.to}>
            <Link
              to={c.to}
              className="group block relative overflow-hidden bg-obsidian"
            >
              <div className="aspect-[4/5] md:aspect-[5/6] overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-obsidian/85" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 text-ivory">
                <h2 className="font-serif text-3xl md:text-4xl">{c.title}</h2>
                <p className="mt-3 text-[14px] md:text-[15px] text-ivory/80 max-w-md">
                  {c.blurb}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-[11px] tracking-[0.32em] uppercase text-gold">
                  Explore <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </section>

      <section className="bg-obsidian" data-surface="dark">
        <div className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24 grid gap-10 md:grid-cols-2 items-center">
          <Reveal>
            <img src={editorialImg} alt="The 4 Cs" className="w-full aspect-[4/5] object-cover" />
          </Reveal>
          <Reveal>
            <p className="eyebrow text-gold">The 4 Cs</p>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl text-ivory">
              A quiet science of light.
            </h2>
            <ul className="mt-6 space-y-4 text-ivory/80 text-[15px] leading-relaxed">
              <li>
                <strong className="text-ivory">Cut</strong> — the architecture of
                brilliance. We favour precise, ideal-cut proportions.
              </li>
              <li>
                <strong className="text-ivory">Colour</strong> — from icy D to warm
                K, chosen to suit metal and skin.
              </li>
              <li>
                <strong className="text-ivory">Clarity</strong> — inclusions are the
                fingerprint of a stone. Ours read eye-clean.
              </li>
              <li>
                <strong className="text-ivory">Carat</strong> — weight, not size.
                We help you choose the silhouette that flatters.
              </li>
            </ul>
            <Link
              to="/education"
              className="mt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.32em] uppercase text-gold hover:text-ivory transition"
            >
              Full education <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-6 md:px-10 py-16 md:py-24 text-center">
        <Reveal>
          <p className="eyebrow">Bespoke</p>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-obsidian">
            Can't find your stone?
          </h2>
          <p className="mt-4 mx-auto max-w-xl text-obsidian/70">
            Commission a custom cut and setting. Our atelier sources rare diamonds
            to your exact specification.
          </p>
          <Link
            to="/custom-order"
            className="mt-8 inline-flex items-center gap-2 border border-obsidian px-8 py-3 text-[11px] tracking-[0.32em] uppercase text-obsidian hover:bg-obsidian hover:text-ivory transition"
          >
            Begin a bespoke enquiry <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
