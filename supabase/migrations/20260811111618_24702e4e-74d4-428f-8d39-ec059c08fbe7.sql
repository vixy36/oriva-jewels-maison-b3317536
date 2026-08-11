CREATE TABLE public.pages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  subtitle text,
  seo_title text,
  seo_description text,
  hero_image_url text,
  blocks jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.pages TO authenticated;
GRANT SELECT ON public.pages TO anon;
GRANT ALL ON public.pages TO service_role;

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage pages" ON public.pages FOR ALL TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role)) WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Public reads published pages" ON public.pages FOR SELECT TO anon, authenticated
  USING (is_published = true OR has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();