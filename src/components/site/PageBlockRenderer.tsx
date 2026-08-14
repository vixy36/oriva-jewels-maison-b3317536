import { Link } from "@tanstack/react-router";
import type { PageBlock } from "@/lib/page-blocks";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";

export function PageBlockRenderer({ blocks }: { blocks: PageBlock[] }) {
  return (
    <div>
      {blocks.map((b) => (
        <BlockView key={b.id} block={b} />
      ))}
    </div>
  );
}

function BlockView({ block: b }: { block: PageBlock }) {
  switch (b.type) {
    case "heading":
      return (
        <section className="px-5 md:px-10 pt-14 pb-6 max-w-5xl mx-auto">
          {b.eyebrow ? <p className="eyebrow">{b.eyebrow}</p> : null}
          {b.title ? <h2 className="mt-3 font-serif text-2xl md:text-4xl font-bold">{b.title}</h2> : null}
        </section>
      );
    case "paragraph":
      return (
        <section className="px-5 md:px-10 py-4 max-w-3xl mx-auto">
          <p className="text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-line">{b.text}</p>
        </section>
      );
    case "image":
      return (
        <section className="px-5 md:px-10 py-8 max-w-6xl mx-auto">
          {b.image ? (
            <figure>
              <img src={b.image} alt={b.caption || "Page image"} loading="lazy" className="w-full object-cover" />
              {b.caption ? <figcaption className="mt-3 text-xs tracking-[0.2em] uppercase text-muted-foreground">{b.caption}</figcaption> : null}
            </figure>
          ) : null}
        </section>
      );
    case "image_text":
      return (
        <section className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          <div className={`grid gap-8 md:grid-cols-2 items-center ${b.reverse ? "md:[&>*:first-child]:order-2" : ""}`}>
            <div>
              {b.image ? (
                <img src={b.image} alt={b.title || "Section image"} loading="lazy" className="w-full aspect-[4/5] object-cover" />
              ) : (
                <div className="w-full aspect-[4/5] bg-muted" />
              )}
            </div>
            <div>
              {b.title ? <h3 className="font-serif text-xl md:text-3xl font-bold">{b.title}</h3> : null}
              {b.text ? <p className="mt-4 text-sm md:text-base leading-relaxed text-muted-foreground whitespace-pre-line">{b.text}</p> : null}
            </div>
          </div>
        </section>
      );
    case "gallery": {
      const imgs = (b.images ?? []).filter(Boolean);
      if (imgs.length === 0) return null;
      return (
        <section className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {imgs.map((src, i) => (
              <img key={i} src={src} alt={`Gallery ${i + 1}`} loading="lazy" className="w-full aspect-square object-cover" />
            ))}
          </div>
        </section>
      );
    }
    case "quote":
      return (
        <section className="px-5 md:px-10 py-14 max-w-4xl mx-auto text-center">
          <p className="font-serif text-xl md:text-3xl leading-snug">"{b.text}"</p>
          {b.caption ? <p className="mt-5 eyebrow">{b.caption}</p> : null}
        </section>
      );
    case "cta":
      return (
        <section className="px-5 md:px-10 py-14">
          <div className="max-w-4xl mx-auto border border-border/60 bg-card p-8 md:p-12 text-center">
            {b.title ? <h3 className="font-serif text-xl md:text-3xl font-bold">{b.title}</h3> : null}
            {b.text ? <p className="mt-3 text-sm text-muted-foreground">{b.text}</p> : null}
            {b.ctaLabel && b.ctaHref ? (
              b.ctaHref.startsWith("http") ? (
                <a
                  href={b.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-7 inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition"
                >
                  {b.ctaLabel}
                </a>
              ) : (
                <Link
                  to={b.ctaHref}
                  className="mt-7 inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.3em] uppercase hover:bg-foreground hover:text-background transition"
                >
                  {b.ctaLabel}
                </Link>
              )
            ) : null}
          </div>
        </section>
      );
    case "divider":
      return <div className="max-w-6xl mx-auto px-5 md:px-10"><hr className="border-border/60" /></div>;
    case "homepage_section":
      return (
        <section className={`py-12 md:py-20 ${b.sectionType === "instagram" ? "bg-obsidian text-ivory" : "bg-background"}`}>
          <div className="mx-auto max-w-[1400px] px-6 md:px-12">
            <Reveal className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
              <div className="max-w-xl">
                <span className="eyebrow block mb-4 tracking-[0.4em] text-gold">{b.title?.toUpperCase()}</span>
                <h2 className={`text-4xl md:text-5xl font-serif leading-tight ${b.sectionType === "instagram" ? "text-ivory" : "text-obsidian"}`}>
                  {b.text || "Curated selection."}
                </h2>
              </div>
            </Reveal>

            {b.sectionType === "instagram" ? (
              <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar gap-4 md:gap-6">
                {(b.items ?? []).map((item) => (
                  <a
                    key={item.id}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-none w-[200px] md:w-[260px] snap-center group relative aspect-[4/5] overflow-hidden bg-obsidian border border-white/5 block rounded-sm"
                  >
                    <img src={item.image} alt={item.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]" />
                    <span className="absolute inset-0 bg-gradient-to-t from-obsidian/75 via-obsidian/10 to-transparent" />
                    <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-gold/70 bg-obsidian/75 text-gold backdrop-blur-sm transition group-hover:scale-105 group-hover:bg-gold group-hover:text-obsidian">▶</span>
                    <span className="absolute inset-x-0 bottom-0 p-4 text-[10px] tracking-[0.32em] uppercase text-ivory/90">{item.title}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className={`grid gap-6 md:gap-8 ${b.sectionType === "index" ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
                {(b.items ?? []).map((item, i) => (
                  <Reveal key={item.id} delay={i * 100}>
                    <Link to={item.link as any} className="group block relative w-full">
                      <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm">
                        <img src={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute inset-0 bg-obsidian/10 group-hover:bg-obsidian/0 transition-colors duration-500" />
                      </div>
                      <div className="mt-4 flex items-start justify-between">
                        <div>
                          {item.subtitle && <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-medium mb-1 block">{item.subtitle}</span>}
                          <h3 className="text-[13px] sm:text-[15px] font-serif text-obsidian uppercase tracking-wide font-bold">{item.title}</h3>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-obsidian transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 shrink-0" />
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>
        </section>
      );
    default:
      return null;
  }
}
