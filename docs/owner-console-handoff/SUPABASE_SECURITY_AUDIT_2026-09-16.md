# LAMOU Owner Console — Supabase Security Audit

Date: 2026-09-16
Project: `LAMOU-IA-CORE` (`afzdqrryqsuwpkaiinez`)
Branch: `candidate/lamou-owner-console-codex-2026-09-15`
Promotion: **NOT PROMOTED**

## Scope

Read-only audit of the active Supabase project before any production security mutation.

## Verified findings

### RLS coverage

- Public tables inspected: **50**.
- RLS enabled: **50/50**.
- Tables with RLS enabled but **zero policies**: **7**.

Affected tables:

1. `lamou_client_invites`
2. `lamou_client_portal_access_links`
3. `lamou_client_systems`
4. `lamou_owner_api_tokens`
5. `lamou_owner_recovery_anchors`
6. `lamou_owner_recovery_codes`
7. `lamou_owner_recovery_events`

Interpretation: RLS is active, but these surfaces are effectively deny-by-default for ordinary client access until explicit policies or controlled RPC/service-role paths are documented and tested. This is not automatically a data leak, but it is an unresolved runtime/access contract and blocks a production-readiness claim.

### SECURITY DEFINER functions

- Public `SECURITY DEFINER` functions: **10**.
- Executable by `authenticated`: **9**.
- The remaining function is service-role scoped.

Authenticated SECURITY DEFINER functions currently include:

- `claim_lamou_client_invite(text)`
- `claim_lamou_platform_owner(text)`
- `create_lamou_contract(...)`
- `issue_lamou_client_portal_link(...)`
- `issue_owner_recovery_pack()`
- `lamou_is_platform_owner()`
- `owner_recovery_status()`
- `provision_lamou_customer(...)`
- `recover_lamou_platform_owner(text)`

`lamou_bind_invited_user()` is currently restricted to service role.

These functions must be reviewed one by one for least privilege, fixed `search_path`, input validation, tenant/owner checks, replay/idempotency, audit logging, secret/token handling, and abuse/rate-limit exposure before production-readiness is asserted.

## Security gate

Current state: **PARTIAL / NOT READY FOR PROMOTION**.

Next controlled work package:

1. Review definitions and grants of all 10 SECURITY DEFINER functions.
2. Classify each zero-policy table as:
   - intentionally RPC/service-role only; or
   - requiring explicit authenticated owner/member policy.
3. Add negative tenant-isolation tests and owner/client cross-access tests.
4. Verify owner recovery/token tables never expose secrets to browser-readable SELECT paths.
5. Verify MFA/password-protection configuration separately at Auth configuration level.
6. Apply fixes first through a migration/candidate path, not ad-hoc production edits.
7. Re-run schema audit + automated tests + security advisors after corrections.

No production DDL was applied during this audit.

SALVAR ≠ PROMOVER. `main` / FROZEN unchanged.
