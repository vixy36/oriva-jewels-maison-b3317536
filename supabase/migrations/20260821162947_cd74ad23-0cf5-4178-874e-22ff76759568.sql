GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO anon, authenticated;
GRANT SELECT ON public.user_roles TO anon, authenticated;