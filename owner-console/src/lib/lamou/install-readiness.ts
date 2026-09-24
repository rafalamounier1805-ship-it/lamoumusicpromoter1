import { HEALTH_INDICATORS, type HealthStatus } from "@/lib/lamou/health-model";

export type InstallTruth =
  | "FACT/EVIDENCED"
  | "IMPLEMENTED_VERIFIED"
  | "IMPLEMENTED_NOT_VERIFIED"
  | "PARTIAL"
  | "NOT_VERIFIED"
  | "NOT_CONNECTED"
  | "BLOCKED"
  | "DOCUMENTED_ONLY";

export const HEALTH_STATUS_TO_INSTALL_TRUTH: Record<HealthStatus, InstallTruth> = {
  verificado: "IMPLEMENTED_VERIFIED",
  parcial: "PARTIAL",
  "nao-verificado": "NOT_VERIFIED",
  "nao-conectado": "NOT_CONNECTED",
};

export function truthFromHealth(indicatorId: string): InstallTruth {
  const indicator = HEALTH_INDICATORS.find((item) => item.id === indicatorId);
  if (!indicator) return "NOT_VERIFIED";
  return HEALTH_STATUS_TO_INSTALL_TRUTH[indicator.status];
}

export const OWNER_INSTALL_CURRENT = {
  database: {
    truth: truthFromHealth("HS-DADOS"),
    source: "HS-DADOS · migrações e tabelas reais da candidata",
    evidence: "migrações aplicadas; cobertura total ainda não medida",
  },
  auth: {
    truth: "IMPLEMENTED_NOT_VERIFIED" as InstallTruth,
    source: "HS-AUTH · conta/sessão/perfil reais",
    evidence: "conta, sessão e perfil verificados; MFA ainda não validado",
  },
  aiProvider: {
    truth: "PARTIAL" as InstallTruth,
    source: "HS-AGENTES / HS-OBS · checagem real de provider",
    evidence: "provider medido; nenhum agente/conselho externo executado ponta a ponta",
  },
  observability: {
    truth: truthFromHealth("HS-OBS"),
    source: "HS-OBS · registros reais disponíveis",
    evidence: "há evidências reais pontuais; agregação/telemetria completa segue incompleta",
  },
  evidenceStorage: {
    truth: "NOT_CONNECTED" as InstallTruth,
    source: "TST-STO-01 · storage geral de evidências",
    evidence: "storage privado de avatar não comprova repositório geral de evidências",
  },
  security: {
    truth: truthFromHealth("HS-SEGURANCA"),
    source: "HS-SEGURANCA",
    evidence: "isolamento negativo e auditoria ainda não comprovados",
  },
} as const;

export const OWNER_POST_INSTALL = [
  {
    id: "owner-ui",
    label: "Jornada e superfícies de interface",
    class: "pendente-verificacao",
    truth: "IMPLEMENTED_NOT_VERIFIED" as InstallTruth,
  },
  {
    id: "owner-auth",
    label: "Conta, sessão e perfil",
    class: "concluido-parcial",
    truth: "PARTIAL" as InstallTruth,
  },
  {
    id: "owner-mfa",
    label: "MFA",
    class: "pendente-verificacao",
    truth: "IMPLEMENTED_NOT_VERIFIED" as InstallTruth,
  },
  {
    id: "owner-optional",
    label: "Integrações opcionais",
    class: "opcional",
    truth: "NOT_CONNECTED" as InstallTruth,
  },
  {
    id: "owner-activation",
    label: "Ativação técnica completa",
    class: "bloqueado",
    truth: "BLOCKED" as InstallTruth,
  },
] as const;

export const CLIENT_POST_INSTALL = [
  {
    id: "client-ui",
    label: "Jornada de provisionamento",
    class: "concluido-parcial",
    truth: "IMPLEMENTED_NOT_VERIFIED" as InstallTruth,
  },
  {
    id: "client-backend",
    label: "Tenant / usuários / entitlements",
    class: "bloqueado",
    truth: "NOT_CONNECTED" as InstallTruth,
  },
  {
    id: "client-isolation",
    label: "RLS e teste negativo entre tenants",
    class: "pendente-verificacao",
    truth: "NOT_VERIFIED" as InstallTruth,
  },
  {
    id: "client-portal",
    label: "Portal LAMOU IA Cliente",
    class: "bloqueado",
    truth: "NOT_CONNECTED" as InstallTruth,
  },
] as const;
