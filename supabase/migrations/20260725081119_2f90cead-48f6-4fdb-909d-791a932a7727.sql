DELETE FROM public.menu_items WHERE menu_key = 'sub' AND lower(label) = 'gifts';
INSERT INTO public.menu_items (menu_key, label, href, sort_order, is_active)
VALUES ('main', 'GIFTS', '/gifts', 35, true);