import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PageBlockRenderer } from "@/components/site/PageBlockRenderer";
import { parseBlocks, type PageBlock } from "@/lib/page-blocks";

type PageRow = {
  slug: string;
  title: string;
  subtitle: string | null;
  seo_title: string | null;
  seo_description: string | null;
  hero_image_url: string | null;
  blocks: unknown;
};

export const Route = createFileRoute("/pages/$slug")({
  head: () => ({
    meta: [
      { title: "Oriva Jewels - Diamond & Jewellery Manufacturers" },
      { name: "description", content: "Explore editorial pages from Oriva Jewels, end to end manufacturers of diamonds and fine jewellery." },
      { property: "og:title", content: "Oriva Jewels" },
      { property: "og:description", content: "End to end manufacturers of diamonds and fine jewellery." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: CustomPage,
});

function CustomPage() {
  const { slug } = Route.useParams();
  const [page, setPage] = useState<PageRow | null>(null);
  const [blocks, setBlocks] = useState<PageBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from("pages")
        .select("slug, title, subtitle, seo_title, seo_description, hero_image_url, blocks, is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      if (cancelled) return;
      const row = (data as PageRow | null) ?? null;
      setPage(row);
      setBlocks(parseBlocks(row?.blocks));
      setLoading(false);
      if (row) {
        document.title = row.seo_title || `${row.title} - Oriva Jewels`;
        const meta = document.querySelector('meta[name="description"]');
        if (meta && row.seo_description) meta.setAttribute("content", row.seo_description);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-28 md:pt-36 pb-24 px-5 md:px-10 max-w-5xl mx-auto space-y-4">
        <div className="h-4 w-32 bg-muted animate-pulse" />
        <div className="h-10 w-2/3 bg-muted animate-pulse" />
        <div className="h-64 w-full bg-muted/60 animate-pulse" />
      </div>
    );
  }

  // Check if this is a built-in page slug
  const BUILT_IN_SLUGS = ["home", "about", "assurance", "diamonds", "bespoke", "custom-order", "gifts", "occasions", "offers", "education", "ring-size-guide", "contact", "wishlist"];
  if (!page || BUILT_IN_SLUGS.includes(slug)) {
    return (
      <div className="pt-32 md:pt-40 pb-28 px-5 text-center">
        <p className="eyebrow">Not found</p>
        <h1 className="mt-3 font-serif text-3xl font-bold">This page is unavailable</h1>
        <Link to="/" className="mt-8 inline-block border border-foreground px-8 py-3 text-[11px] tracking-[0.3em] uppercase">
          Return home
        </Link>
      </div>
    );
  }

  return (
    <article className="pb-24">
      <header className="pt-28 md:pt-36 px-5 md:px-10 max-w-5xl mx-auto">
        <p className="eyebrow">Oriva Jewels</p>
        <h1 className="mt-3 font-serif text-3xl md:text-5xl font-bold">{page.title}</h1>
        {page.subtitle ? <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">{page.subtitle}</p> : null}
      </header>
      {page.hero_image_url ? (
        <div className="mt-10 px-5 md:px-10 max-w-6xl mx-auto">
          <img src={page.hero_image_url} alt={page.title} className="w-full aspect-[16/9] object-cover" />
        </div>
      ) : null}
      <PageBlockRenderer blocks={blocks} />
    </article>
  );
}
