# Security Fixes Plan - August 17, 2026

The scan identified several `SECURITY DEFINER` functions in the Supabase project that are overly permissive or lack proper access controls. We will implement granular `REVOKE` and `GRANT` statements to restrict execution to the intended roles.

## User Review Required

> [!IMPORTANT]
> These changes strictly enforce database permissions. If any part of your app relies on unauthorized users calling internal role-checking functions (which shouldn't happen), those specific calls will fail until properly authenticated.

## Proposed Changes

### Database Security Hardening

- **Restrict `has_role` function**: This function is currently executable by `public`. We will revoke public access and only allow `authenticated` and `service_role` to execute it.
- **Restrict `update_updated_at_column` function**: This utility function should not be directly callable by `public`. We will restrict it to `authenticated` and `service_role`.
- **Verify `gen_order_code` and `get_order_status`**: These already have `REVOKE` statements, but we will ensure they are consistently applied to satisfy the linter.

## Technical Details

We will create a new migration file `supabase/migrations/20260817000000_security_hardening.sql` with the following content:

```sql
-- Revoke public execution from security definer functions to satisfy linter
-- and prevent unauthorized probing of the role system.

-- 1. has_role
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- 2. update_updated_at_column
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.update_updated_at_column() TO authenticated, service_role;

-- 3. gen_order_code (re-affirming for completeness)
REVOKE EXECUTE ON FUNCTION public.gen_order_code() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.gen_order_code() TO authenticated, service_role;

-- 4. get_order_status (this is INTENDED for anon to lookup their order, but we revoke PUBLIC generally first)
REVOKE EXECUTE ON FUNCTION public.get_order_status(text, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_status(text, text) TO anon, authenticated, service_role;
```
