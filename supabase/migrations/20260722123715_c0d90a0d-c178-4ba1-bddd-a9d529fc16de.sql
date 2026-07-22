
-- Restrict has_role EXECUTE to authenticated only (used by RLS policies for authenticated users)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Restrict product-images bucket reads to admins only (bucket is private; public site does not read DB images)
DROP POLICY IF EXISTS "Public read product images" ON storage.objects;
CREATE POLICY "Admins read product images"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'product-images' AND public.has_role(auth.uid(), 'admin'));
