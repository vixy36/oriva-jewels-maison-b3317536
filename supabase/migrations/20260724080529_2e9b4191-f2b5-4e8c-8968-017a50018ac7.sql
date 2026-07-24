
-- Gifts table
CREATE TABLE public.gifts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT,
  price_from NUMERIC(12,2),
  currency TEXT DEFAULT 'USD',
  occasion TEXT,
  audience TEXT,
  product_slug TEXT,
  cta_label TEXT DEFAULT 'Explore',
  sort_order INT NOT NULL DEFAULT 100,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.gifts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gifts TO authenticated;
GRANT ALL ON public.gifts TO service_role;

ALTER TABLE public.gifts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active gifts" ON public.gifts
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins manage gifts" ON public.gifts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_gifts_updated_at BEFORE UPDATE ON public.gifts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Marketing automations
CREATE TABLE public.marketing_automations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('order_status', 'enquiry_status')),
  trigger_status TEXT NOT NULL,
  template_name TEXT NOT NULL,
  subject_override TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_run_at TIMESTAMPTZ,
  run_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.marketing_automations TO authenticated;
GRANT ALL ON public.marketing_automations TO service_role;

ALTER TABLE public.marketing_automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage automations" ON public.marketing_automations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON public.marketing_automations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed a few default automation rules (inactive by default so admin can review)
INSERT INTO public.marketing_automations (name, description, trigger_type, trigger_status, template_name, is_active) VALUES
  ('Order Confirmed', 'Email customer when order is confirmed', 'order_status', 'confirmed', 'order-confirmed', true),
  ('Order Shipped', 'Email customer when order ships with tracking', 'order_status', 'shipped', 'order-shipped', true),
  ('Order Delivered', 'Thank customer on delivery', 'order_status', 'delivered', 'order-delivered', true),
  ('Enquiry Received', 'Auto-reply when a new enquiry arrives', 'enquiry_status', 'new', 'enquiry-received', false);
