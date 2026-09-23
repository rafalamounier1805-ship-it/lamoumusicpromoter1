import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

/**
 * Autorização de Proprietário da plataforma.
 *
 * Estar autenticado NÃO equivale a ser Owner. A liberação exige membership
 * comprovada no backend (ACTIVE + OWNER + tenant LAMOU). user_metadata nunca é
 * usado como fonte de autorização. Negar é o padrão.
 */
export const OWNER_TENANT_SLUG = "lamou";

const MEMBERSHIP_RPCS = ["is_platform_owner", "lamou_is_platform_owner"] as const;
const MEMBERSHIP_TABLES = ["lamou_memberships", "lamou_tenant_members", "memberships"] as const;

export type OwnerAuthz =
  | { kind: "authorized"; session: Session; evidence: string }
  | { kind: "no-session"; message: string }
  | { kind: "forbidden"; message: string }
  | { kind: "unverified"; message: string };

type Json = Record<string, unknown>;

function str(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function pick(row: Json, keys: string[]): string | null {
  for (const k of keys) {
    const v = str(row[k]);
    if (v) return v;
  }
  return null;
}

function isMissing(message: string): boolean {
  const low = message.toLowerCase();
  return (
    low.includes("does not exist") ||
    low.includes("could not find") ||
    low.includes("schema cache") ||
    low.includes("permission denied") ||
    low.includes("not found")
  );
}

export async function ensureCanonicalSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) return null;
  return data.session;
}

async function checkViaRpc(): Promise<boolean | null> {
  for (const fn of MEMBERSHIP_RPCS) {
    const res = await supabase.rpc(fn as never);
    if (!res.error) return res.data === true;
    if (!isMissing(res.error.message)) return null;
  }
  return null;
}

async function checkViaTable(): Promise<{ ok: boolean; evidence: string } | null> {
  for (const table of MEMBERSHIP_TABLES) {
    const res = await supabase.from(table as never).select("*").limit(50);
    if (res.error) {
      if (isMissing(res.error.message)) continue;
      return null;
    }
    const rows = Array.isArray(res.data) ? (res.data as unknown as Json[]) : [];
    const match = rows.find((r) => {
      const role = (pick(r, ["role", "member_role"]) ?? "").toUpperCase();
      const state = (pick(r, ["state", "status"]) ?? "").toUpperCase();
      const tenant = (pick(r, ["tenant_slug", "tenant", "slug"]) ?? "").toLowerCase();
      return role === "OWNER" && state === "ACTIVE" && tenant === OWNER_TENANT_SLUG;
    });
    if (match) return { ok: true, evidence: `${table} · ACTIVE + OWNER + ${OWNER_TENANT_SLUG}` };
    return { ok: false, evidence: `${table} · nenhuma membership ACTIVE/OWNER para esta conta` };
  }
  return null;
}

export async function ensurePlatformOwnerSession(): Promise<OwnerAuthz> {
  const session = await ensureCanonicalSession();
  if (!session) {
    return {
      kind: "no-session",
      message: "Sem sessão no backend canônico. Entre com a conta do Proprietário para continuar.",
    };
  }

  try {
    const viaRpc = await checkViaRpc();
    if (viaRpc === true) {
      return { kind: "authorized", session, evidence: "função de autorização do backend canônico" };
    }
    if (viaRpc === false) {
      return {
        kind: "forbidden",
        message: "Conta autenticada, mas sem papel de Proprietário nesta plataforma (403). Nada foi liberado.",
      };
    }

    const viaTable = await checkViaTable();
    if (viaTable?.ok) return { kind: "authorized", session, evidence: viaTable.evidence };
    if (viaTable) {
      return {
        kind: "forbidden",
        message: `Conta autenticada, mas sem membership ACTIVE + OWNER no tenant ${OWNER_TENANT_SLUG.toUpperCase()} (403).`,
      };
    }

    return {
      kind: "unverified",
      message: "Autorização de Proprietário não comprovável neste ambiente. Acesso negado por padrão.",
    };
  } catch {
    return {
      kind: "unverified",
      message: "Não foi possível verificar a autorização de Proprietário agora. Acesso negado.",
    };
  }
}
