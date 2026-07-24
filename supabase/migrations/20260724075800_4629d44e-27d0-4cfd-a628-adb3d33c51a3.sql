
-- Phase 2: extend enquiries
ALTER TABLE public.enquiries
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'new'
    CHECK (status IN ('new','confirmed','in_production','shipped','delivered','cancelled')),
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS carrier TEXT,
  ADD COLUMN IF NOT EXISTS shipping_address JSONB,
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12,2),
  ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS configuration JSONB;

-- Phase 4: inventory on products
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS low_stock_threshold INTEGER NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS track_inventory BOOLEAN NOT NULL DEFAULT false;

-- Phase 3: orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(12,2) NOT NULL DEFAULT 0,
  shipping_cost NUMERIC(12,2) NOT NULL DEFAULT 0,
  discount NUMERIC(12,2) NOT NULL DEFAULT 0,
  total NUMERIC(12,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending','confirmed','in_production','shipped','delivered','cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','partial','paid','refunded')),
  shipping_address JSONB,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery DATE,
  enquiry_id UUID REFERENCES public.enquiries(id) ON DELETE SET NULL,
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.orders TO authenticated;
GRANT ALL ON public.orders TO service_role;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage orders" ON public.orders
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Sequence for order codes: ORV-YYYYMM-NNNN
CREATE SEQUENCE IF NOT EXISTS public.order_code_seq START 1000;

CREATE OR REPLACE FUNCTION public.gen_order_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  n BIGINT;
BEGIN
  n := nextval('public.order_code_seq');
  RETURN 'ORV-' || to_char(now(),'YYMM') || '-' || lpad(n::text, 4, '0');
END;
$$;

REVOKE ALL ON FUNCTION public.gen_order_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gen_order_code() TO authenticated, service_role;

-- Public order lookup by code + email (bypasses RLS via SECURITY DEFINER)
CREATE OR REPLACE FUNCTION public.get_order_status(_order_code TEXT, _email TEXT)
RETURNS TABLE (
  order_code TEXT,
  customer_name TEXT,
  status TEXT,
  payment_status TEXT,
  items JSONB,
  subtotal NUMERIC,
  shipping_cost NUMERIC,
  discount NUMERIC,
  total NUMERIC,
  currency TEXT,
  tracking_number TEXT,
  carrier TEXT,
  estimated_delivery DATE,
  shipping_address JSONB,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.order_code, o.customer_name, o.status, o.payment_status, o.items,
         o.subtotal, o.shipping_cost, o.discount, o.total, o.currency,
         o.tracking_number, o.carrier, o.estimated_delivery, o.shipping_address,
         o.created_at, o.updated_at
  FROM public.orders o
  WHERE lower(o.order_code) = lower(_order_code)
    AND lower(o.customer_email) = lower(_email)
  LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.get_order_status(TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_status(TEXT, TEXT) TO anon, authenticated;
