ALTER SEQUENCE product_code_seq RESTART WITH 1;
ALTER TABLE public.products ALTER COLUMN product_code SET DEFAULT ('ORV-' || nextval('product_code_seq'::regclass)::text);