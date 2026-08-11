import { Link } from "@tanstack/react-router";
import type { PageBlock } from "@/lib/page-blocks";

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
    default:
      return null;
  }
}
