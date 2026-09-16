# LAMOU Owner Console — Supabase Security Audit

Date: 2026-09-16
Project: `LAMOU-IA-CORE` (`afzdqrryqsuwpkaiinez`)
Branch: `candidate/lamou-owner-console-codex-2026-09-15`
Promotion: **NOT PROMOTED**

## Executive state

**Security hardening migration: APPLIED + VERIFIED (partial production-security gate).**

Migration applied to the active Supabase project:

- version: `20260916021821`;
- name: `owner_console_security_hardening_20260916`;
- repository source: `owner-console/drizzle/migrations/0003_supabase_security_hardening.sql`.

This closes the previously observed zero-policy RLS gap and hardens direct access/search paths. It does **not** make the whole product production-ready: MFA, leaked-password protection, two-client isolation evidence and the intentional exposed SECURITY DEFINER RPC surface remain open gates.

## Verified after migration

### RLS coverage

- Public tables inspected: **50**.
- RLS enabled: **50/50**.
- RLS-enabled tables with zero policies: **0** (previously 7).

Previously policyless surfaces are now classified explicitly:

- `lamou_client_invites` — RPC/service-role only; direct anon/authenticated access denied.
- `lamou_client_portal_access_links` — RPC/service-role only; direct anon/authenticated access denied.
- `lamou_owner_api_tokens` — RPC/service-role only; direct anon/authenticated access denied.
- `lamou_owner_recovery_anchors` — RPC/service-role only; direct anon/authenticated access denied.
- `lamou_owner_recovery_codes` — RPC/service-role only; direct anon/authenticated access denied.
- `lamou_owner_recovery_events` — RPC/service-role only; direct anon/authenticated access denied.
- `lamou_client_systems` — tenant-scoped authenticated CRUD with member/admin/owner RLS rules.

Policy counts after migration:

- six sensitive RPC-only tables: **1 explicit restrictive deny policy each**;
- `lamou_client_systems`: **4 tenant-scoped policies**.

Privilege readback confirms anon/authenticated have no direct CRUD privilege on the six secret/token/recovery tables. `lamou_client_systems` exposes only SELECT/INSERT/UPDATE/DELETE to `authenticated`; RLS remains the row-level authorization boundary.

### Tenant isolation evidence

A transaction-scoped authenticated client identity was simulated against the live database after hardening.

Observed visibility:

- tenants: 1;
- memberships: 1;
- contracts: 1;
- client profiles: 1;
- client devices: 1;
- app grants: 10;
- tenant settings: 6;
- client systems: 0 current rows;
- **owner settings: 0**;
- **owner documents: 0**.

This is evidence that the tested client identity cannot read the tested Owner-only surfaces and sees only its tenant on the tested tenant-scoped resources.

Limitation: the environment currently contains only one active client tenant, so **Client A × Client B negative isolation remains NOT_VERIFIED**. It must be tested when a second controlled client tenant exists; no synthetic second-client PASS is claimed.

### SECURITY DEFINER surface

Public SECURITY DEFINER functions reviewed: **10**.

The migration:

- removes anon/PUBLIC execution from the browser-facing RPCs;
- keeps `authenticated` execution only where the current product flow intentionally requires a signed-in caller;
- keeps `lamou_bind_invited_user()` service-role/backend-only;
- fixes `search_path` to `pg_catalog` and, where cryptographic extension functions are required, `extensions`;
- leaves object references schema-qualified;
- makes relevant grants explicit rather than relying on default PUBLIC execution.

Supabase Security Advisor still reports **9 WARN findings** for authenticated SECURITY DEFINER functions. This is expected under the present RPC architecture: the functions are intentionally callable by signed-in users and perform their own owner/token/tenant checks.

This warning is **reviewed but not eliminated**. Stronger future architecture is to move high-privilege operations behind private/server/Edge Function boundaries, keeping only narrowly scoped public interfaces.

### Authentication security

Verified live state:

- active platform owners: **1**;
- owner email confirmed: **1**;
- owner with verified MFA factor: **0**;
- verified MFA factors for Owner: **0**.

Therefore Owner MFA remains **NOT_VERIFIED / BLOCKING FOR PROMOTION**. It must not be enforced at database level before the Owner enrolls a factor, because that could lock out the only active Owner.

Supabase Security Advisor also reports **Leaked Password Protection Disabled**. This setting remains a platform/Auth configuration blocker; it was not changed through SQL because it is not a database-policy toggle.

### Owner bootstrap/recovery tokens

The token/recovery tables are no longer browser-readable. Existing owner bootstrap-token inventory was inspected only in aggregate; no token hash or secret was exported into this document or repository.

The current bootstrap-token design still lacks a first-class expiry column. One enabled owner bootstrap token remains in the data plane. Token lifecycle/expiry/rotation is therefore a follow-up security item even though direct table access is hardened.

### Invite binding design note

`trg_lamou_bind_invited_user` remains an AFTER INSERT trigger on `auth.users` and can bind a still-valid invite by matching email. It is service-role/backend-only as a function, but its behavior means account creation can consume an invite without presenting the explicit invite token to `claim_lamou_client_invite`.

This is preserved for compatibility because Client installation/provisioning is not yet fully wired to the explicit claim flow. Before a production Client onboarding release, choose one canonical invite-claim model and remove the parallel path rather than running both indefinitely.

## CI / repository gate

Candidate repository additions:

- `owner-console/drizzle/migrations/0003_supabase_security_hardening.sql`;
- `owner-console/tests/security-hardening.test.ts`.

GitHub Actions run `35047388859` on commit `cf7ac892d6c527d0267cd5ea9c5fec802c7cc58b`:

- dependency install — PASS;
- TypeScript — PASS;
- lint — PASS;
- application tests + build — PASS.

## Security Advisor after migration

Closed:

- `rls_enabled_no_policy`: **0 findings** (was 7).

Remaining:

1. `authenticated_security_definer_function_executable`: **9 WARN** — intentional current RPC architecture; reviewed, not yet architecturally eliminated.
2. `auth_leaked_password_protection`: **1 WARN** — disabled; requires Auth/platform configuration.
3. Owner MFA: **0 verified factors** — promotion blocker.
4. Client A × Client B negative isolation: **NOT_VERIFIED** because only one client tenant currently exists.
5. Browser/E2E security journeys and recovery drill remain separate pre-promotion evidence gates.

## Gate conclusion

**DATABASE RLS HARDENING: IMPLEMENTED_VERIFIED**  
**OWNER/CLIENT ISOLATION ON TESTED SURFACES: IMPLEMENTED_VERIFIED / PARTIAL COVERAGE**  
**OVERALL SECURITY PROMOTION GATE: BLOCKED**

Reason for BLOCKED is not a failed migration. The remaining blockers require real authentication/platform configuration and additional environment evidence rather than more cosmetic UI work.

No application publication/promotion was performed. `main` / FROZEN remain unchanged. SALVAR ≠ PROMOVER.
