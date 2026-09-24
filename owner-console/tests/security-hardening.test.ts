import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const migration = readFileSync(
  resolve(import.meta.dir, "../drizzle/migrations/0003_supabase_security_hardening.sql"),
  "utf8",
);

describe("Supabase security hardening candidate", () => {
  test("sensitive token and recovery tables are explicitly RPC-only", () => {
    for (const table of [
      "lamou_client_invites",
      "lamou_client_portal_access_links",
      "lamou_owner_api_tokens",
      "lamou_owner_recovery_anchors",
      "lamou_owner_recovery_codes",
      "lamou_owner_recovery_events",
    ]) {
      expect(migration).toContain(`ON public.${table}`);
      expect(migration).toContain(
        `REVOKE ALL PRIVILEGES ON TABLE public.${table} FROM anon, authenticated;`,
      );
    }
    expect(migration).toContain("AS RESTRICTIVE");
    expect(migration).toContain("USING (false)");
    expect(migration).toContain("WITH CHECK (false)");
  });

  test("client systems is tenant scoped with least privilege", () => {
    expect(migration).toContain("CREATE POLICY client_systems_select_member");
    expect(migration).toContain("lamou_private.is_member(tenant_id)");
    expect(migration).toContain("CREATE POLICY client_systems_insert_admin");
    expect(migration).toContain("CREATE POLICY client_systems_update_admin");
    expect(migration).toContain("CREATE POLICY client_systems_delete_owner");
    expect(migration).toContain(
      "GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.lamou_client_systems TO authenticated;",
    );
  });

  test("security definer functions receive fixed search paths and no anon execution", () => {
    for (const fn of [
      "claim_lamou_client_invite",
      "claim_lamou_platform_owner",
      "create_lamou_contract",
      "issue_lamou_client_portal_link",
      "issue_owner_recovery_pack",
      "lamou_is_platform_owner",
      "owner_recovery_status",
      "provision_lamou_customer",
      "recover_lamou_platform_owner",
    ]) {
      expect(migration).toContain(`ALTER FUNCTION public.${fn}`);
    }
    expect(migration).toContain("FROM PUBLIC, anon");
    expect(migration).toContain("TO authenticated, service_role");
  });
});
