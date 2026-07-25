import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, ArrowRight, X } from "lucide-react";
import { products as staticProducts, type Product, type ProductCategory } from "@/lib/products";
import { useWishlist } from "@/lib/wishlist";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — Oriva Jewels" },
      { name: "description", content: "Your saved pieces from Oriva Jewels — reserve or enquire when you are ready." },
      { property: "og:title", content: "Wishlist — Oriva Jewels" },
      { property: "og:description", content: "Your curated pieces from the Oriva atelier." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: WishlistPage,
});

async function fetchDbProductsBySlugs(slugs: string[]): Promise<Product[]> {
  if (slugs.length === 0) return [];
  const { data } = await supabase
    .from("products")
    .select("slug,name,category,subcategory,short_description,description,images,video_url,diamond_type")
    .in("slug", slugs)
    .eq("is_active", true);
  return ((data ?? []) as Array<{
    slug: string; name: string; category: string; subcategory: string | null;
    short_description: string | null; description: string | null;
    images: string[] | null; video_url: string | null; diamond_type: string | null;
  }>).map((p) => {
    const dt = (p.diamond_type || "Both").toLowerCase();
    const diamondTypes: ("Natural" | "Lab Grown")[] =
      dt === "natural" ? ["Natural"] : dt === "lab grown" ? ["Lab Grown"] : ["Natural", "Lab Grown"];
    const imgs = (p.images ?? []) as string[];
    return {
      slug: p.slug,
      name: p.name,
      category: p.category as ProductCategory,
      collection: p.subcategory || "Oriva",
      short: p.short_description || "",
      description: p.description || "",
      image: imgs[0] || "",
      images: imgs,
      videoUrl: p.video_url ?? undefined,
      shape: "—",
      metal: "18K",
      diamondTypes,
      customizable: true,
    } satisfies Product;
  });
}

function WishlistPage() {
  const { slugs, remove } = useWishlist();

  const { data: dbItems = [] } = useQuery({
    queryKey: ["wishlist-db", slugs.sort().join(",")],
    queryFn: () => fetchDbProductsBySlugs(slugs),
    enabled: slugs.length > 0,
    staleTime: 60_000,
  });

  const staticItems = staticProducts.filter((p) => slugs.includes(p.slug));
  const dbSlugSet = new Set(dbItems.map((p) => p.slug));
  const items: Product[] = [...dbItems, ...staticItems.filter((p) => !dbSlugSet.has(p.slug))];

  return (
    <div className="bg-ink text-ivory pt-24 md:pt-28 pb-24 min-h-[70svh]">
      <div className="mx-auto max-w-[1500px] px-6 md:px-16">
        <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="eyebrow">Your saved pieces</p>
            <h1 className="mt-4 font-serif text-4xl md:text-5xl leading-[1]">Wishlist</h1>
          </div>
          <p className="text-[12px] md:text-[13px] tracking-[0.3em] uppercase text-ivory/60">
            {items.length} piece{items.length !== 1 ? "s" : ""}
          </p>
        </div>

        {items.length === 0 ? (
          <div className="mt-16 border border-white/10 py-24 text-center">
            <Heart className="mx-auto h-8 w-8 text-gold" strokeWidth={1.4} />
            <p className="mt-6 font-serif text-2xl md:text-3xl text-ivory">Your wishlist is empty.</p>
            <p className="mt-3 text-sm text-ivory/60 max-w-md mx-auto px-6">
              Tap the heart on any piece to save it here for later.
            </p>
            <Link
              to="/collections/$category"
              params={{ category: "engagement-rings" }}
              className="mt-10 inline-flex items-center gap-3 border border-gold px-8 py-3 text-[11px] tracking-[0.4em] uppercase text-gold hover:bg-gold hover:text-obsidian transition"
            >
              Explore Engagement Rings <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-12 md:grid-cols-3 md:gap-x-8 md:gap-y-16 lg:grid-cols-4">
            {items.map((p) => (
              <div key={p.slug} className="group relative">
                <button
                  type="button"
                  onClick={() => remove(p.slug)}
                  aria-label="Remove from wishlist"
                  className="absolute top-3 right-3 z-10 grid h-9 w-9 place-items-center bg-obsidian/85 border border-gold/50 text-gold hover:bg-gold hover:text-obsidian transition"
                >
                  <X className="h-4 w-4" strokeWidth={1.6} />
                </button>
                <Link to="/product/$slug" params={{ slug: p.slug }} className="block">
                  <div className="relative overflow-hidden bg-charcoal aspect-[4/5]">
                    {p.image ? (
                      <img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-ivory/40 text-xs uppercase tracking-[0.3em]">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-[10px] md:text-[11px] tracking-[0.32em] uppercase text-gold">{p.collection}</p>
                    <h3 className="mt-2 font-serif text-[17px] md:text-[20px] leading-tight text-ivory group-hover:text-gold transition line-clamp-2">
                      {p.name}
                    </h3>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
