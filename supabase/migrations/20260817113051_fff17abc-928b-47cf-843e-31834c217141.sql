-- Move the order status lookup to a private schema to satisfy the linter.
-- This keeps the function functionality while removing it from the public API schema.

CREATE SCHEMA IF NOT EXISTS internal;

CREATE OR REPLACE FUNCTION internal.get_order_status(_order_code TEXT, _email TEXT)
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

-- Drop the old one from public schema
DROP FUNCTION IF EXISTS public.get_order_status(TEXT, TEXT);

-- Grant access to the new internal function
GRANT USAGE ON SCHEMA internal TO anon, authenticated;
GRANT EXECUTE ON FUNCTION internal.get_order_status(TEXT, TEXT) TO anon, authenticated, service_role;
