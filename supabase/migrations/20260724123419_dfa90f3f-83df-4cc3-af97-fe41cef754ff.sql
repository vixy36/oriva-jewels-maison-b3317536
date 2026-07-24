
-- Categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  blurb TEXT,
  banner_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.categories TO authenticated;
GRANT ALL ON public.categories TO service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active categories"
  ON public.categories FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage categories"
  ON public.categories FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Menu items table
CREATE TABLE public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_key TEXT NOT NULL CHECK (menu_key IN ('main', 'sub')),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  parent_id UUID REFERENCES public.menu_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.menu_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.menu_items TO authenticated;
GRANT ALL ON public.menu_items TO service_role;

ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active menu items"
  ON public.menu_items FOR SELECT
  USING (is_active = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins manage menu items"
  ON public.menu_items FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed categories
INSERT INTO public.categories (slug, name, blurb, sort_order) VALUES
  ('rings', 'Rings', 'Solitaires, halos and sculpted bands set with certified diamonds.', 10),
  ('earrings', 'Earrings', 'Studs, drops and hoops in radiant natural and lab-grown diamonds.', 20),
  ('necklaces', 'Necklaces', 'Riviera lines, tennis necklaces and delicate everyday pendants.', 30),
  ('bracelets', 'Bracelets', 'Tennis bracelets and cuffs engineered for effortless drape.', 40),
  ('pendants', 'Pendants', 'Signature silhouettes suspended on hand-finished chains.', 50),
  ('engagement-rings', 'Engagement Rings', 'Bespoke engagement rings crafted around your chosen diamond.', 60),
  ('hip-hop-jewelry', 'Hip Hop Jewelry', 'Iced-out chains, pendants and statement pieces with bold diamond presence.', 70);

-- Seed main menu
INSERT INTO public.menu_items (menu_key, label, href, sort_order) VALUES
  ('main', 'FINE JEWELRY', '/collections/rings', 10),
  ('main', 'ENGAGEMENT RINGS', '/collections/engagement-rings', 20),
  ('main', 'BESPOKE', '/custom-order', 30),
  ('main', 'HIP HOP JEWELRY', '/collections/hip-hop-jewelry', 40),
  ('main', 'DIAMONDS', '/diamonds', 50);

-- Seed sub menu
INSERT INTO public.menu_items (menu_key, label, href, sort_order) VALUES
  ('sub', 'Home', '/', 10),
  ('sub', 'About Us', '/about', 20),
  ('sub', 'Contact', '/contact', 30);
