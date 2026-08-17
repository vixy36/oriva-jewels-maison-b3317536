-- Revoke public execution from security definer functions to satisfy linter
-- and prevent unauthorized probing of the role system.

-- 1. has_role
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. update_updated_at_column
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated, service_role;

-- 3. gen_order_code
REVOKE EXECUTE ON FUNCTION public.gen_order_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gen_order_code() TO authenticated, service_role;

-- 4. get_order_status
REVOKE EXECUTE ON FUNCTION public.get_order_status(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_status(text, text) TO anon, authenticated, service_role;
