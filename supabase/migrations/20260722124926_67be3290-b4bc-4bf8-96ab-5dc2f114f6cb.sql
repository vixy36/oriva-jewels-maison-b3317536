
-- 1. Product code sequence + column with auto-generated default
CREATE SEQUENCE IF NOT EXISTS public.product_code_seq START 1000;

ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS product_code TEXT UNIQUE
    DEFAULT ('ORV-' || to_char(nextval('public.product_code_seq'), 'FM000000'));

-- Backfill existing rows
UPDATE public.products
SET product_code = 'ORV-' || to_char(nextval('public.product_code_seq'), 'FM000000')
WHERE product_code IS NULL;

-- 2. Public read access for product images (bucket also flipped to public via tool)
CREATE POLICY "Public read product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');
