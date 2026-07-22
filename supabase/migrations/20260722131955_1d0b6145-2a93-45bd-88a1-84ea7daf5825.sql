ALTER TABLE public.products ADD COLUMN IF NOT EXISTS categories text[] NOT NULL DEFAULT '{}';
-- Backfill from single category
UPDATE public.products SET categories = ARRAY[category] WHERE (categories IS NULL OR array_length(categories,1) IS NULL) AND category IS NOT NULL;
CREATE INDEX IF NOT EXISTS products_categories_gin ON public.products USING GIN (categories);