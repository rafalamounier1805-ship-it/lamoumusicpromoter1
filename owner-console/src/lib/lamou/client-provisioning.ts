import type { Session } from "@supabase/supabase-js";

import { supabase } from "@/integrations/supabase/client";

/**
 * Adapter único para o provisionamento real de cliente (Incremento 1).
 * A UI nunca chama o backend diretamente: passa por aqui.
 * Não expõe segredos, tokens ou detalhes internos de erro.
 */

export interface ProvisionResult {
  ok: boolean;
  customerId: string | null;
  customerCode: string | null;
  tenantId: string | null;
  tenantSlug: string | null;
  coreInstanceCode: string | null;
  sourceCoreProfile: string | null;
  sourceVersionCode: string | null;
  onboardingInitialized: boolean;
  onboardingCounts: { label: string; value: number }[];
}

export type ProvisionOutcome =
  | { kind: "success"; result: ProvisionResult }
  | { kind: "no-session"; message: string }
  | { kind: "error"; message: string };

function text(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v : null;
}

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Normaliza o payload da RPC sem vazar detalhes sensíveis. */
function normalizePayload(raw: unknown): ProvisionResult {
  const p = (raw ?? {}) as Record<string, unknown>;
  const countsRaw = p["onboarding_counts"];
  const counts: { label: string; value: number }[] = [];
  if (countsRaw && typeof countsRaw === "object") {
    for (const [label, value] of Object.entries(countsRaw as Record<string, unknown>)) {
      const n = num(value);
      if (n !== null) counts.push({ label, value: n });
    }
  }
  return {
    ok: p["ok"] === true,
    customerId: text(p["customer_id"]),
    customerCode: text(p["customer_code"]),
    tenantId: text(p["tenant_id"]),
    tenantSlug: text(p["tenant_slug"]),
    coreInstanceCode: text(p["core_instance_code"]),
    sourceCoreProfile: text(p["source_core_profile"]),
    sourceVersionCode: text(p["source_version_code"]),
    onboardingInitialized: p["onboarding_initialized"] === true || counts.length > 0,
    onboardingCounts: counts,
  };
}

/** Erro curto e sanitizado — nunca mensagem crua do backend. */
function sanitizeError(err: unknown): string {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  const low = msg.toLowerCase();
  if (low.includes("owner") || low.includes("not_authenticated") || low.includes("permission"))
    return "Owner autenticado necessário para provisionar um cliente real.";
  if (low.includes("duplicate") || low.includes("unique") || low.includes("already"))
    return "Já existe um cliente/tenant com este nome. Revise antes de tentar novamente.";
  return "Não foi possível provisionar o cliente agora. Tente novamente ou verifique a sessão do Owner.";
}

export async function ensureOwnerSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  if (!data.session) return null;
  const { data: userData, error } = await supabase.auth.getUser();
  if (error || !userData.user) return null;
  return data.session;
}

export async function provisionClientStandard(input: {
  displayName: string;
  legalName?: string;
}): Promise<ProvisionOutcome> {
  const session = await ensureOwnerSession();
  if (!session) {
    return { kind: "no-session", message: "Owner autenticado necessário para provisionar." };
  }
  try {
    type RpcResponse = { data: unknown; error: unknown };
    const callRpc = supabase.rpc as unknown as (
      fn: string,
      args: Record<string, unknown>,
    ) => PromiseLike<RpcResponse>;
    const { data, error } = await callRpc("provision_lamou_customer_standard_v1", {
      p_display_name: input.displayName,
      p_legal_name: input.legalName?.trim() ? input.legalName.trim() : input.displayName,
    });
    if (error) return { kind: "error", message: sanitizeError(error) };
    const result = normalizePayload(data);
    if (!result.ok || !result.tenantSlug) {
      return { kind: "error", message: "O backend não confirmou o provisionamento. Nada foi assumido." };
    }
    return { kind: "success", result };
  } catch (err) {
    return { kind: "error", message: sanitizeError(err) };
  }
}

/**
 * Estado de sessão (não sensível) do provisionamento durante o wizard.
 * Apenas IDs/slugs retornados pela RPC; nunca token nem segredo.
 * Fica em memória (session state), não em localStorage.
 */
let lastProvisioned: ProvisionResult | null = null;
export function setLastProvisioned(r: ProvisionResult | null) {
  lastProvisioned = r;
}
export function getLastProvisioned(): ProvisionResult | null {
  return lastProvisioned;
}