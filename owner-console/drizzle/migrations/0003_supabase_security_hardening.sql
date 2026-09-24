-- LAMOU Owner Console — security hardening candidate
-- 2026-09-16
-- SALVAR != PROMOVER
-- This migration is intentionally idempotent and preserves current RPC contracts.

-- 1) Explicitly classify sensitive tables as RPC/service-role only.
-- RLS was already enabled and effectively deny-by-default; these policies make that intent auditable.

DROP POLICY IF EXISTS rpc_only_deny_direct_access ON public.lamou_client_invites;
CREATE POLICY rpc_only_deny_direct_access
ON public.lamou_client_invites
AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS rpc_only_deny_direct_access ON public.lamou_client_portal_access_links;
CREATE POLICY rpc_only_deny_direct_access
ON public.lamou_client_portal_access_links
AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS rpc_only_deny_direct_access ON public.lamou_owner_api_tokens;
CREATE POLICY rpc_only_deny_direct_access
ON public.lamou_owner_api_tokens
AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS rpc_only_deny_direct_access ON public.lamou_owner_recovery_anchors;
CREATE POLICY rpc_only_deny_direct_access
ON public.lamou_owner_recovery_anchors
AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS rpc_only_deny_direct_access ON public.lamou_owner_recovery_codes;
CREATE POLICY rpc_only_deny_direct_access
ON public.lamou_owner_recovery_codes
AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false)
WITH CHECK (false);

DROP POLICY IF EXISTS rpc_only_deny_direct_access ON public.lamou_owner_recovery_events;
CREATE POLICY rpc_only_deny_direct_access
ON public.lamou_owner_recovery_events
AS RESTRICTIVE
FOR ALL TO anon, authenticated
USING (false)
WITH CHECK (false);

-- Least privilege for RPC-only tables. SECURITY DEFINER functions continue to run as their owner.
REVOKE ALL PRIVILEGES ON TABLE public.lamou_client_invites FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.lamou_client_portal_access_links FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.lamou_owner_api_tokens FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.lamou_owner_recovery_anchors FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.lamou_owner_recovery_codes FROM anon, authenticated;
REVOKE ALL PRIVILEGES ON TABLE public.lamou_owner_recovery_events FROM anon, authenticated;

-- 2) Client systems is a tenant-scoped operational registry, not a secret/token table.
DROP POLICY IF EXISTS client_systems_select_member ON public.lamou_client_systems;
DROP POLICY IF EXISTS client_systems_insert_admin ON public.lamou_client_systems;
DROP POLICY IF EXISTS client_systems_update_admin ON public.lamou_client_systems;
DROP POLICY IF EXISTS client_systems_delete_owner ON public.lamou_client_systems;

CREATE POLICY client_systems_select_member
ON public.lamou_client_systems
FOR SELECT TO authenticated
USING (lamou_private.is_member(tenant_id));

CREATE POLICY client_systems_insert_admin
ON public.lamou_client_systems
FOR INSERT TO authenticated
WITH CHECK (lamou_private.has_role(tenant_id, ARRAY['OWNER','ADMIN']::text[]));

CREATE POLICY client_systems_update_admin
ON public.lamou_client_systems
FOR UPDATE TO authenticated
USING (lamou_private.has_role(tenant_id, ARRAY['OWNER','ADMIN']::text[]))
WITH CHECK (lamou_private.has_role(tenant_id, ARRAY['OWNER','ADMIN']::text[]));

CREATE POLICY client_systems_delete_owner
ON public.lamou_client_systems
FOR DELETE TO authenticated
USING (lamou_private.has_role(tenant_id, ARRAY['OWNER']::text[]));

REVOKE ALL PRIVILEGES ON TABLE public.lamou_client_systems FROM anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.lamou_client_systems TO authenticated;

-- 3) Harden SECURITY DEFINER search_path values. Object references are schema-qualified.
ALTER FUNCTION public.claim_lamou_client_invite(text)
  SET search_path = pg_catalog, extensions;
ALTER FUNCTION public.claim_lamou_platform_owner(text)
  SET search_path = pg_catalog, extensions;
ALTER FUNCTION public.create_lamou_contract(text, text, text, timestamptz, timestamptz, text)
  SET search_path = pg_catalog, extensions;
ALTER FUNCTION public.issue_lamou_client_portal_link(text, text, integer)
  SET search_path = pg_catalog, extensions;
ALTER FUNCTION public.issue_owner_recovery_pack()
  SET search_path = pg_catalog, extensions;
ALTER FUNCTION public.lamou_bind_invited_user()
  SET search_path = pg_catalog;
ALTER FUNCTION public.lamou_is_platform_owner()
  SET search_path = pg_catalog;
ALTER FUNCTION public.owner_recovery_status()
  SET search_path = pg_catalog;
ALTER FUNCTION public.provision_lamou_customer(text, text)
  SET search_path = pg_catalog, extensions;
ALTER FUNCTION public.recover_lamou_platform_owner(text)
  SET search_path = pg_catalog, extensions;

ALTER FUNCTION lamou_private.has_role(uuid, text[])
  SET search_path = pg_catalog;
ALTER FUNCTION lamou_private.is_member(uuid)
  SET search_path = pg_catalog;
ALTER FUNCTION lamou_private.is_platform_owner()
  SET search_path = pg_catalog;
ALTER FUNCTION lamou_private.issue_owner_token(text)
  SET search_path = pg_catalog, extensions;

-- 4) Make function execution grants explicit. Public/anon execution is not allowed.
REVOKE EXECUTE ON FUNCTION public.claim_lamou_client_invite(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.claim_lamou_platform_owner(text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.create_lamou_contract(text, text, text, timestamptz, timestamptz, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.issue_lamou_client_portal_link(text, text, integer) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.issue_owner_recovery_pack() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.lamou_is_platform_owner() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.owner_recovery_status() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.provision_lamou_customer(text, text) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.recover_lamou_platform_owner(text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.claim_lamou_client_invite(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.claim_lamou_platform_owner(text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.create_lamou_contract(text, text, text, timestamptz, timestamptz, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.issue_lamou_client_portal_link(text, text, integer) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.issue_owner_recovery_pack() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.lamou_is_platform_owner() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.owner_recovery_status() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.provision_lamou_customer(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.recover_lamou_platform_owner(text) TO authenticated, service_role;

-- Trigger helper remains service-role/backend only.
REVOKE EXECUTE ON FUNCTION public.lamou_bind_invited_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lamou_bind_invited_user() TO service_role;

-- Private RLS helpers are explicit rather than relying on PUBLIC defaults.
REVOKE EXECUTE ON FUNCTION lamou_private.is_platform_owner() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION lamou_private.is_platform_owner() TO authenticated;

COMMENT ON TABLE public.lamou_client_invites IS 'RPC/service-role only; direct browser access intentionally denied.';
COMMENT ON TABLE public.lamou_client_portal_access_links IS 'RPC/service-role only; token hashes must never be browser-readable.';
COMMENT ON TABLE public.lamou_owner_api_tokens IS 'Owner bootstrap token hashes; RPC/service-role only.';
COMMENT ON TABLE public.lamou_owner_recovery_anchors IS 'Owner recovery secret metadata; RPC/service-role only.';
COMMENT ON TABLE public.lamou_owner_recovery_codes IS 'Owner recovery code hashes; RPC/service-role only.';
COMMENT ON TABLE public.lamou_owner_recovery_events IS 'Owner recovery audit trail; RPC/service-role only.';
