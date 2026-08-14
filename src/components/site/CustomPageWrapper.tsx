import { useEffect, useState, type ReactNode } from "react";
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
  is_published: boolean;
};

interface CustomPageWrapperProps {
  slug: string;
  children: ReactNode;
}

export function CustomPageWrapper({ slug, children }: CustomPageWrapperProps) {
  const [page, setPage] = useState<PageRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("pages")
        .select("slug, title, subtitle, seo_title, seo_description, hero_image_url, blocks, is_published")
        .eq("slug", slug)
        .eq("is_published", true)
        .maybeSingle();
      
      if (cancelled) return;
      
      if (data) {
        setPage(data as unknown as PageRow);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen bg-obsidian" />;
  }

  if (page && page.blocks && Array.isArray(page.blocks) && (page.blocks as any[]).length > 0) {
    const blocks = parseBlocks(page.blocks);
    return (
      <article className="pb-24 bg-background min-h-screen">
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

  return <>{children}</>;
}
