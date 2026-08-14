import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Gift } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CustomPageWrapper } from "@/components/site/CustomPageWrapper";

type GiftRow = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  price_from: number | null;
  currency: string | null;
  occasion: string | null;
  audience: string | null;
  product_slug: string | null;
  cta_label: string | null;
  sort_order: number;
};

export const Route = createFileRoute("/gifts")({
  head: () => ({
    meta: [
      { title: "Gift Ideas - Oriva Jewels" },
      { name: "description", content: "Curated diamond jewellery gift ideas for anniversaries, birthdays, engagements and every occasion in between." },
      { property: "og:title", content: "Gift Ideas - Oriva Jewels" },
      { property: "og:description", content: "Diamond gifts for every occasion, hand-picked by the maison." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GiftsPage,
});

function GiftsPage() {
  const [gifts, setGifts] = useState<GiftRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("gifts")
        .select("*")
        .eq("is_active", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      setGifts((data as unknown as GiftRow[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const occasions = Array.from(new Set(gifts.map((g) => g.occasion).filter(Boolean))) as string[];
  const shown = filter === "all" ? gifts : gifts.filter((g) => g.occasion === filter);

  return (
    <CustomPageWrapper slug="gifts">
      <div className="bg-ink pt-24 md:pt-32">
      <section className="mx-auto max-w-[1600px] px-6 md:px-16">
        <div className="max-w-3xl">
          <p className="eyebrow">The Gift Edit</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl text-ivory leading-[1.05]">
            Diamond gifts, <em className="italic text-gold">meaningfully chosen</em>.
          </h1>
          <p className="mt-6 text-base md:text-lg text-ivory/75 leading-relaxed">
            From first anniversaries to milestone celebrations, our maison has curated a considered selection of
            fine diamond pieces to mark every occasion.
          </p>
        </div>

        {occasions.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 text-[12px] tracking-[0.3em] uppercase transition ${
                filter === "all" ? "bg-gold text-obsidian" : "border border-white/15 text-ivory/80 hover:border-gold hover:text-gold"
              }`}
            >
              All Occasions
            </button>
            {occasions.map((o) => (
              <button
                key={o}
                onClick={() => setFilter(o)}
                className={`px-4 py-2 text-[12px] tracking-[0.3em] uppercase transition ${
                  filter === o ? "bg-gold text-obsidian" : "border border-white/15 text-ivory/80 hover:border-gold hover:text-gold"
                }`}
              >
                {o}
              </button>
            ))}
          </div>
        )}

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3 pb-32">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-charcoal/50 animate-pulse" />
            ))
          ) : shown.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <Gift className="h-8 w-8 mx-auto text-ivory/40" strokeWidth={1.2} />
              <p className="mt-4 text-ivory/60 text-sm">No gift ideas here just yet.</p>
            </div>
          ) : (
            shown.map((g) => {
              const CardInner = (
                <>
                  <div className="relative aspect-[4/5] overflow-hidden bg-charcoal">
                    {g.image_url ? (
                      <img
                        src={g.image_url}
                        alt={g.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-ivory/30">
                        <Gift className="h-10 w-10" strokeWidth={1} />
                      </div>
                    )}
                    {g.audience && (
                      <span className="absolute top-4 left-4 text-[10px] tracking-[0.35em] uppercase text-ivory bg-obsidian/70 backdrop-blur px-3 py-1 border border-white/10">
                        {g.audience}
                      </span>
                    )}
                    {g.occasion && (
                      <span className="absolute top-4 right-4 text-[10px] tracking-[0.35em] uppercase text-gold bg-obsidian/70 backdrop-blur px-3 py-1 border border-gold/30">
                        {g.occasion}
                      </span>
                    )}
                  </div>
                  <div className="mt-5">
                    {g.subtitle && <p className="eyebrow">{g.subtitle}</p>}
                    <h3 className="mt-2 font-serif text-2xl text-ivory group-hover:text-gold transition">{g.title}</h3>
                    {g.description && (
                      <p className="mt-2 text-sm text-ivory/70 leading-relaxed line-clamp-2">{g.description}</p>
                    )}
                    <div className="mt-4 flex items-center justify-between">
                      {g.price_from != null ? (
                        <p className="text-[12px] tracking-widest uppercase text-ivory/60">
                          From {g.currency ?? "USD"} {Number(g.price_from).toLocaleString()}
                        </p>
                      ) : <span />}
                      <span className="inline-flex items-center gap-2 text-[12px] tracking-[0.35em] uppercase text-gold border-b border-gold/40 pb-0.5">
                        {g.cta_label ?? "Explore"} <ArrowRight className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </>
              );

              return g.product_slug ? (
                <Link key={g.id} to="/product/$slug" params={{ slug: g.product_slug }} className="group block">
                  {CardInner}
                </Link>
              ) : (
                <div key={g.id} className="group">{CardInner}</div>
              );
            })
          )}
        </div>
      </section>
      </div>
    </CustomPageWrapper>
  );
}
