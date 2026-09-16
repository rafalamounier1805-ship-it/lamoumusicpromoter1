import { supabase } from "@/integrations/supabase/client";

export type LamouSurfaceType =
  | "DOCUMENT"
  | "AI"
  | "HYPOTHESIS_PROBLEM"
  | "INDICATOR_METRIC"
  | "METRIC_OBSERVABILITY"
  | "CORE"
  | "APP"
  | "MAPA_VIVO"
  | "PRODUCT_APP_CATALOG"
  | "CLIENT_360"
  | "INSTALL_OWNER"
  | "INSTALL_CLIENT"
  | "LABTEST"
  | "OWNER_MODULE"
  | "OTHER";

export interface LamouSurfaceDescriptor {
  surfaceType: LamouSurfaceType;
  surfaceId: string;
}

export interface LamouUsageInput extends LamouSurfaceDescriptor {
  eventType: "LAMOU_SURFACE_VIEW" | "LAMOU_INTERACTION" | "LAMOU_RUNTIME_ERROR" | string;
  route?: string;
  action?: string;
  truthState?: string;
  context?: Record<string, unknown>;
}

type SafeScalar = string | number | boolean | null;
type SafeContext = Record<string, SafeScalar>;

type QueuedUsageEvent = {
  eventType: string;
  surfaceType: LamouSurfaceType;
  surfaceId: string;
  route: string | null;
  action: string | null;
  truthState: string | null;
  context: SafeContext;
  clientRecordedAt: string;
};

type MembershipRow = {
  tenant_id: string;
  role: string;
  status: string;
};

type SessionShape = {
  access_token: string;
  user: { id: string };
};

const QUEUE_KEY = "lamou-usage-telemetry-v1";
const MAX_QUEUE = 100;
const MAX_TEXT = 160;
let flushing = false;

function clip(value: string, max = MAX_TEXT): string {
  return value.replace(/\s+/g, " ").trim().slice(0, max);
}

function sanitizeContext(input?: Record<string, unknown>): SafeContext {
  if (!input) return {};
  const output: SafeContext = {};

  for (const [rawKey, rawValue] of Object.entries(input).slice(0, 24)) {
    const key = clip(rawKey, 64);
    if (!key) continue;

    if (rawValue === null) {
      output[key] = null;
    } else if (typeof rawValue === "string") {
      output[key] = clip(rawValue);
    } else if (typeof rawValue === "number" && Number.isFinite(rawValue)) {
      output[key] = rawValue;
    } else if (typeof rawValue === "boolean") {
      output[key] = rawValue;
    }
  }

  return output;
}

function normalizeRoute(route?: string): string | null {
  if (!route) return null;
  const path = route.split("?")[0]?.split("#")[0] ?? route;
  return clip(path, 240);
}

function normalizeEvent(input: LamouUsageInput): QueuedUsageEvent {
  return {
    eventType: clip(input.eventType, 80) || "LAMOU_INTERACTION",
    surfaceType: input.surfaceType,
    surfaceId: clip(input.surfaceId, 120) || "unknown",
    route: normalizeRoute(input.route),
    action: input.action ? clip(input.action, 120) : null,
    truthState: input.truthState ? clip(input.truthState, 80) : null,
    context: sanitizeContext(input.context),
    clientRecordedAt: new Date().toISOString(),
  };
}

function readQueue(): QueuedUsageEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.sessionStorage.getItem(QUEUE_KEY) ?? "[]") as unknown;
    return Array.isArray(parsed) ? (parsed as QueuedUsageEvent[]).slice(-MAX_QUEUE) : [];
  } catch {
    return [];
  }
}

function writeQueue(events: QueuedUsageEvent[]): void {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(QUEUE_KEY, JSON.stringify(events.slice(-MAX_QUEUE)));
  } catch {
    // Telemetry must never break the application when browser storage is unavailable.
  }
}

function enqueue(event: QueuedUsageEvent): void {
  writeQueue([...readQueue(), event]);
}

function publicConfig(): { url: string; key: string } | null {
  const viteEnv = import.meta.env as Record<string, string | undefined>;
  const url = viteEnv["VITE_SUPABASE_URL"] ?? process.env["SUPABASE_URL"];
  const key = viteEnv["VITE_SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_PUBLISHABLE_KEY"];
  return url && key ? { url, key } : null;
}

async function currentSession(): Promise<SessionShape | null> {
  try {
    const { data } = await supabase.auth.getSession();
    const session = data.session;
    if (!session?.access_token || !session.user?.id) return null;
    return { access_token: session.access_token, user: { id: session.user.id } };
  } catch {
    return null;
  }
}

async function resolveMembership(
  config: { url: string; key: string },
  session: SessionShape,
): Promise<MembershipRow | null> {
  try {
    const endpoint = new URL("/rest/v1/lamou_memberships", config.url);
    endpoint.searchParams.set("select", "tenant_id,role,status");
    endpoint.searchParams.set("user_id", `eq.${session.user.id}`);
    endpoint.searchParams.set("status", "eq.ACTIVE");
    endpoint.searchParams.set("limit", "20");

    const response = await fetch(endpoint, {
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${session.access_token}`,
        Accept: "application/json",
      },
    });
    if (!response.ok) return null;

    const rows = (await response.json()) as MembershipRow[];
    if (!rows.length) return null;
    return (
      rows.find((row) => row.role === "OWNER") ??
      rows.find((row) => row.role === "ADMIN") ??
      rows[0]!
    );
  } catch {
    return null;
  }
}

async function sendEvent(
  config: { url: string; key: string },
  session: SessionShape,
  membership: MembershipRow,
  event: QueuedUsageEvent,
): Promise<boolean> {
  try {
    const endpoint = new URL("/rest/v1/lamou_audit_events", config.url);
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: config.key,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        tenant_id: membership.tenant_id,
        actor_id: session.user.id,
        event_type: event.eventType,
        detail: {
          schema_version: "usage.v1",
          source: "owner-console",
          surface_type: event.surfaceType,
          surface_id: event.surfaceId,
          route: event.route,
          action: event.action,
          truth_state: event.truthState,
          client_recorded_at: event.clientRecordedAt,
          context: event.context,
        },
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function flushLamouUsage(): Promise<number> {
  if (flushing || typeof window === "undefined" || !navigator.onLine) return 0;
  const pending = readQueue();
  if (!pending.length) return 0;

  const config = publicConfig();
  if (!config) return 0;
  const session = await currentSession();
  if (!session) return 0;
  const membership = await resolveMembership(config, session);
  if (!membership) return 0;

  flushing = true;
  let sent = 0;
  const remaining: QueuedUsageEvent[] = [];
  try {
    for (const event of pending) {
      if (await sendEvent(config, session, membership, event)) sent += 1;
      else remaining.push(event);
    }
    writeQueue(remaining);
    return sent;
  } finally {
    flushing = false;
  }
}

/**
 * Canonical browser-side usage sink for LAMOU CORE.
 * It captures operational metadata only. Raw form values, document contents,
 * AI prompts/responses, passwords and free-text user content are deliberately excluded.
 */
export async function recordLamouUsage(input: LamouUsageInput): Promise<boolean> {
  if (typeof window === "undefined") return false;
  const event = normalizeEvent(input);
  const config = publicConfig();
  const session = config ? await currentSession() : null;
  const membership = config && session ? await resolveMembership(config, session) : null;

  if (!config || !session || !membership || !navigator.onLine) {
    enqueue(event);
    return false;
  }

  const ok = await sendEvent(config, session, membership, event);
  if (!ok) enqueue(event);
  else void flushLamouUsage();
  return ok;
}

export function classifyLamouRoute(route: string): LamouSurfaceDescriptor {
  const path = normalizeRoute(route) ?? "/";

  if (path === "/owner/documents" || path.startsWith("/owner/documents/")) {
    return { surfaceType: "DOCUMENT", surfaceId: "owner-documents" };
  }
  if (path === "/core/ai" || path.startsWith("/core/ai/")) {
    return { surfaceType: "AI", surfaceId: "core-ai" };
  }
  if (path === "/core/problems" || path.startsWith("/core/problems/")) {
    return { surfaceType: "HYPOTHESIS_PROBLEM", surfaceId: "core-problems" };
  }
  if (path === "/core/health" || path.startsWith("/core/health/")) {
    return { surfaceType: "INDICATOR_METRIC", surfaceId: "core-health" };
  }
  if (path === "/core/observability" || path.startsWith("/core/observability/")) {
    return { surfaceType: "METRIC_OBSERVABILITY", surfaceId: "core-observability" };
  }
  if (path === "/owner/mapa-vivo" || path.startsWith("/owner/mapa-vivo/")) {
    return { surfaceType: "MAPA_VIVO", surfaceId: "mapa-vivo" };
  }
  if (
    path === "/owner/products" ||
    path.startsWith("/owner/products/") ||
    path === "/owner/apps" ||
    path.startsWith("/owner/apps/")
  ) {
    return { surfaceType: "PRODUCT_APP_CATALOG", surfaceId: "products-apps" };
  }
  if (path === "/owner/clients" || path.startsWith("/owner/clients/")) {
    return { surfaceType: "CLIENT_360", surfaceId: "client-360" };
  }
  if (path === "/install/owner" || path.startsWith("/install/owner/")) {
    return { surfaceType: "INSTALL_OWNER", surfaceId: "install-owner" };
  }
  if (path === "/install/client" || path.startsWith("/install/client/")) {
    return { surfaceType: "INSTALL_CLIENT", surfaceId: "install-client" };
  }
  if (path === "/labtest" || path.startsWith("/labtest/") || path === "/apps/lab") {
    return { surfaceType: "LABTEST", surfaceId: "labtest" };
  }
  if (path.startsWith("/apps/")) {
    return { surfaceType: "APP", surfaceId: path.slice("/apps/".length) || "unknown-app" };
  }
  if (path === "/core" || path.startsWith("/core/")) {
    return { surfaceType: "CORE", surfaceId: path === "/core" ? "core-overview" : path.slice(1) };
  }
  if (path === "/owner" || path.startsWith("/owner/")) {
    return {
      surfaceType: "OWNER_MODULE",
      surfaceId: path === "/owner" ? "cognitive-cockpit" : path.slice(1),
    };
  }

  return { surfaceType: "OTHER", surfaceId: path || "/" };
}
