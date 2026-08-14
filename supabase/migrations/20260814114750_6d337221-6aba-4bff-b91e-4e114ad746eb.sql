-- Initial seed for the 'home' page content using the new homepage_section blocks
INSERT INTO public.pages (slug, title, subtitle, blocks, is_published, sort_order)
VALUES (
  'home',
  'Fine Jewellery Maison',
  'We design your dreams with diamonds.',
  '[
    {
      "id": "hero_1",
      "type": "heading",
      "title": "Natural Brilliance. Expertly Curated.",
      "eyebrow": "A Fine Jewellery Maison"
    },
    {
      "id": "idx_1",
      "type": "homepage_section",
      "title": "THE INDEX",
      "text": "Six chapters. One maison.",
      "sectionType": "index",
      "items": [
        {"id": "c1", "title": "Engagement", "subtitle": "Chapter 01", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-engagement.jpg", "link": "/collections/engagement-rings"},
        {"id": "c2", "title": "Earrings", "subtitle": "Chapter 02", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-earrings.jpg", "link": "/collections/earrings"},
        {"id": "c3", "title": "Bracelets", "subtitle": "Chapter 03", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/product-tennis.jpg", "link": "/collections/bracelets"},
        {"id": "c4", "title": "Pendants", "subtitle": "Chapter 04", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-pendants.jpg", "link": "/collections/pendants"},
        {"id": "c5", "title": "HipHop", "subtitle": "Chapter 05", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/product-tennis.jpg", "link": "/collections/hiphop"},
        {"id": "c6", "title": "Lab Grown", "subtitle": "Chapter 06", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-labgrown.jpg", "link": "/collections/lab-grown"}
      ]
    },
    {
      "id": "atl_1",
      "type": "homepage_section",
      "title": "THE ATELIER",
      "text": "Every stone chosen. Every piece signed by hand.",
      "sectionType": "atelier",
      "items": [
        {"id": "a1", "title": "Craftsmanship", "subtitle": "Our Workshop", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/about-atelier.jpg", "link": "/about"}
      ]
    },
    {
      "id": "occ_1",
      "type": "homepage_section",
      "title": "THE OCCASIONS",
      "text": "For every moment worth marking.",
      "sectionType": "occasions",
      "items": [
        {"id": "o1", "title": "Engagement", "subtitle": "Bridal", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-engagement.jpg", "link": "/occasions"},
        {"id": "o2", "title": "Anniversary", "subtitle": "Milestone", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/insta-6.jpg", "link": "/occasions"},
        {"id": "o3", "title": "Wedding", "subtitle": "Bridal", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-bridal.jpg", "link": "/occasions"},
        {"id": "o4", "title": "Gift", "subtitle": "Occasion", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/insta-1.jpg", "link": "/occasions"},
        {"id": "o5", "title": "Everyday", "subtitle": "Daily", "image": "https://ychjqslpvmqtqndxflft.supabase.co/storage/v1/object/public/assets/collection-earrings.jpg", "link": "/occasions"}
      ]
    }
  ]'::jsonb,
  true,
  0
)
ON CONFLICT (slug) DO UPDATE SET
  blocks = EXCLUDED.blocks,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle;
