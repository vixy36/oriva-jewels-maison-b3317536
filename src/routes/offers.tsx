import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Tag, Clock, Copy, Sparkles } from "lucide-react";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Promotions - Oriva Jewels" },
      { name: "description", content: "Limited-time offers, seasonal promotions and exclusive promo codes on natural and lab grown diamond jewellery from Oriva Jewels." },
      { property: "og:title", content: "Offers & Promotions - Oriva Jewels" },
      { property: "og:description", content: "Discover limited-time offers and exclusive promo codes on fine diamond jewellery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: OffersPage,
});

type Offer = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  promo_code: string | null;
  discount_type: "percentage" | "fixed" | "free_shipping" | "gift" | "custom";
  discount_value: number | null;
  image_url: string | null;
  cta_label: string | null;
  cta_url: string | null;
  category: string | null;
  badge: string | null;
  starts_at: string | null;
  ends_at: string | null;
  terms: string | null;
};

function useCountdown(ends_at: string | null) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!ends_at) return;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [ends_at]);
  if (!ends_at) return null;
  const diff = new Date(ends_at).getTime() - now;
  if (diff <= 0) return "Expired";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

function valueLabel(o: Offer) {
  if (o.discount_type === "percentage" && o.discount_value) return `${o.discount_value}% Off`;
  if (o.discount_type === "fixed" && o.discount_value) return `$${o.discount_value} Off`;
  if (o.discount_type === "free_shipping") return "Complimentary Shipping";
  if (o.discount_type === "gift") return "Complimentary Gift";
  return "Exclusive Offer";
}

function OfferCard({ o, featured }: { o: Offer; featured?: boolean }) {
  const countdown = useCountdown(o.ends_at);
  function copyCode() {
    if (!o.promo_code) return;
    navigator.clipboard.writeText(o.promo_code);
    toast.success(`Copied ${o.promo_code}`);
  }
  return (
    <article className={`group relative overflow-hidden border border-border/60 bg-card ${featured ? "md:col-span-2 md:row-span-2" : ""}`}>
      <div className={`relative ${featured ? "aspect-[16/10]" : "aspect-[4/3]"} bg-muted overflow-hidden`}>
        {o.image_url ? (
          <img src={o.image_url} alt={o.title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" loading="lazy" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#071c37] to-[#0a2547]">
            <Sparkles className="h-12 w-12 text-[#d6b98c]/60" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        {o.badge && (
          <span className="absolute top-4 left-4 text-[10px] tracking-[0.28em] uppercase bg-white/90 text-[#071c37] px-3 py-1.5 font-medium">
            {o.badge}
          </span>
        )}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-[10px] tracking-[0.32em] uppercase opacity-85">{o.category ?? "Offer"}</p>
          <p className={`font-serif ${featured ? "text-3xl md:text-5xl" : "text-2xl"} leading-tight mt-1`}>{valueLabel(o)}</p>
        </div>
      </div>

      <div className="p-5 md:p-6">
        <h3 className={`font-serif ${featured ? "text-2xl" : "text-lg"}`}>{o.title}</h3>
        {o.subtitle && <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">{o.subtitle}</p>}
        {o.description && <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{o.description}</p>}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {o.promo_code && (
            <button onClick={copyCode} className="flex items-center gap-2 border border-dashed border-foreground/40 px-3 py-1.5 text-xs font-mono tracking-widest hover:bg-foreground hover:text-background transition">
              <Tag className="h-3.5 w-3.5" /> {o.promo_code} <Copy className="h-3 w-3 opacity-60" />
            </button>
          )}
          {countdown && (
            <span className={`inline-flex items-center gap-1.5 text-xs ${countdown === "Expired" ? "text-red-600" : "text-foreground/70"}`}>
              <Clock className="h-3.5 w-3.5" /> {countdown === "Expired" ? "Expired" : `Ends in ${countdown}`}
            </span>
          )}
        </div>

        {o.terms && <p className="mt-3 text-[11px] text-muted-foreground/80 italic">{o.terms}</p>}

        {o.cta_url && (
          <Button asChild className="mt-5" variant={featured ? "default" : "outline"}>
            <Link to={o.cta_url}>{o.cta_label || "Shop the Offer"}</Link>
          </Button>
        )}
      </div>
    </article>
  );
}

function OffersPage() {
  const [items, setItems] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("offers").select("*")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false });
      if (error) toast.error(error.message);
      setItems((data as unknown as Offer[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const categories = useMemo(() => {
    const s = new Set<string>();
    items.forEach((o) => o.category && s.add(o.category));
    return ["all", ...Array.from(s)];
  }, [items]);

  const visible = filter === "all" ? items : items.filter((o) => o.category === filter);

  return (
    <div className="bg-background text-foreground pt-24 md:pt-32">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#071c37] text-[#fefefe]">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_20%_20%,#d6b98c33,transparent_50%),radial-gradient(circle_at_80%_60%,#d6b98c22,transparent_50%)]" />
        <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24 text-center">
          <p className="eyebrow text-[#d6b98c]">The Maison Offers</p>
          <h1 className="mt-4 font-serif text-4xl md:text-6xl leading-tight text-[#fefefe]">Curated Promotions,<br />Timeless Value.</h1>
          <p className="mt-5 max-w-2xl mx-auto text-sm md:text-base text-white/70 leading-relaxed">
            Limited-time discounts, seasonal codes and complimentary services on our natural & lab grown diamond jewellery.
          </p>
        </div>
      </section>

      {/* Filters */}
      {categories.length > 1 && (
        <div className="border-b border-border/60 sticky top-0 z-10 bg-background/90 backdrop-blur">
          <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-4 flex gap-2 overflow-x-auto">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-4 py-1.5 text-xs tracking-[0.24em] uppercase whitespace-nowrap transition ${
                  filter === c ? "bg-foreground text-background" : "border border-border/60 hover:border-foreground/40"
                }`}
              >
                {c === "all" ? "All Offers" : c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-16 md:py-24">
        {loading ? (
          <div className="text-center text-sm text-muted-foreground py-24">Loading offers…</div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <Sparkles className="h-10 w-10 mx-auto text-[#d6b98c]" />
            <p className="mt-6 font-serif text-2xl">No live offers right now</p>
            <p className="mt-2 text-sm text-muted-foreground">Please check back soon - new promotions arrive with each season.</p>
            <Button asChild className="mt-6" variant="outline"><Link to="/collections/$category" params={{ category: "rings" }}>Explore the Collection</Link></Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 md:auto-rows-fr">
            {visible.map((o, i) => <OfferCard key={o.id} o={o} featured={i === 0 && visible.length > 2} />)}
          </div>
        )}
      </section>
    </div>
  );
}
