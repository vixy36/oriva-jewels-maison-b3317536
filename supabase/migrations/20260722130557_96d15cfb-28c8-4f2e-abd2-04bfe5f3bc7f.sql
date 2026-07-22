
ALTER TABLE public.products
  ALTER COLUMN currency SET DEFAULT 'USD',
  ADD COLUMN IF NOT EXISTS mrp numeric,
  ADD COLUMN IF NOT EXISTS show_price boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS offer_id uuid REFERENCES public.offers(id) ON DELETE SET NULL;

UPDATE public.products SET currency = 'USD' WHERE currency IS NULL OR currency = '' OR currency = 'INR';
