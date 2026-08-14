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
  title?: string;
  children: ReactNode;
}


export function CustomPageWrapper({ slug, title: defaultTitle, children }: CustomPageWrapperProps) {
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

  // Only use custom page content if it's not the "home" slug OR if it has meaningful blocks
  // This ensures the hardcoded home page remains the default unless explicitly overridden with blocks.
  const hasBlocks = page && page.blocks && Array.isArray(page.blocks) && (page.blocks as any[]).length > 0;
  
  // RENDER BLOCKS + CHILDREN
  // We wrap the children (hardcoded content) and prepend/append blocks if desired.
  // For simplicity, if there are blocks, we render the editorial layout.
  // BUT we need to make sure the user can still see the hardcoded content if they want.
  
  if (page && hasBlocks) {
    const blocks = parseBlocks(page.blocks);
    return (
      <article className="bg-background min-h-screen">
        {/* If there's a custom hero/title in the DB, show it */}
        {page.title !== "home" && page.title !== "Home" && (
          <header className="pt-28 md:pt-36 px-5 md:px-10 max-w-5xl mx-auto">
            <p className="eyebrow">Oriva Jewels</p>
            <h1 className="mt-3 font-serif text-3xl md:text-5xl font-bold">{page.title || defaultTitle}</h1>
            {page.subtitle ? <p className="mt-4 max-w-2xl text-sm md:text-base text-muted-foreground">{page.subtitle}</p> : null}
          </header>
        )}

        
        {page.hero_image_url ? (
          <div className="mt-10 px-5 md:px-10 max-w-6xl mx-auto">
            <img src={page.hero_image_url} alt={page.title} className="w-full aspect-[16/9] object-cover" />
          </div>
        ) : null}

        <PageBlockRenderer blocks={blocks} />
        
        {/* We still render children but hidden or as a fallback? 
            Actually, the user said "changes are not updating on home page".
            If they added blocks to 'home', they want to see them.
        */}
      </article>
    );
  }

  return <>{children}</>;
}

