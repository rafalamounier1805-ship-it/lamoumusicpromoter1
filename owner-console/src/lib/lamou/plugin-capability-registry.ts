import type { LamouPluginCapability } from "@/lib/lamou/activity-persona-router";

export type PluginCapabilityState =
  | "IMPLEMENTED_VERIFIED"
  | "IMPLEMENTED_NOT_VERIFIED"
  | "PARTIAL"
  | "DOCUMENTED_ONLY"
  | "NOT_CONNECTED";

export interface PluginCapabilityRecord {
  id: LamouPluginCapability;
  label: string;
  state: PluginCapabilityState;
  execution: "local" | "external" | "hybrid";
  note: string;
}

export const PLUGIN_CAPABILITY_REGISTRY: PluginCapabilityRecord[] = [
  {
    id: "data-auth",
    label: "Dados, Auth e RLS",
    state: "PARTIAL",
    execution: "hybrid",
    note: "Supabase e RLS existem; MFA e outros gates de produção ainda não estão totalmente verificados.",
  },
  {
    id: "usage-telemetry",
    label: "Telemetria de uso",
    state: "IMPLEMENTED_VERIFIED",
    execution: "local",
    note: "Contrato usage.v1 integrado ao Owner Console e persistência auditável no CORE.",
  },
  {
    id: "error-monitoring",
    label: "Monitoramento de erros",
    state: "NOT_CONNECTED",
    execution: "external",
    note: "Não há provider externo de erro/observabilidade comprovado neste gate.",
  },
  {
    id: "ai-provider",
    label: "Provider de IA",
    state: "NOT_CONNECTED",
    execution: "external",
    note: "Conselho pode selecionar personas localmente, mas não simula execução externa.",
  },
  {
    id: "validation-gate",
    label: "Validation Gate",
    state: "IMPLEMENTED_VERIFIED",
    execution: "local",
    note: "Contratos locais e testes impedem PASS sintético sem evidência.",
  },
  {
    id: "version-registry",
    label: "Version / Registry",
    state: "PARTIAL",
    execution: "hybrid",
    note: "Há governança de versão e estado; integrações completas entre todos os apps ainda precisam de fechamento.",
  },
  {
    id: "document-registry",
    label: "Documentos / MuDoc",
    state: "PARTIAL",
    execution: "hybrid",
    note: "Estrutura documental existe; adoção universal por todo o ecossistema ainda não está comprovada.",
  },
  {
    id: "visual-library",
    label: "Design Library",
    state: "PARTIAL",
    execution: "local",
    note: "Assets oficiais já existem, mas a cobertura visual completa das superfícies ainda é um gate.",
  },
  {
    id: "map-routing",
    label: "Mapa Vivo → CORE",
    state: "IMPLEMENTED_VERIFIED",
    execution: "local",
    note: "Mapa Vivo detecta e encaminha; investigação e resolução permanecem no CORE.",
  },
  {
    id: "billing-contracts",
    label: "Faturamento e contratos",
    state: "PARTIAL",
    execution: "hybrid",
    note: "Contratos e fontes existem, mas gateway de cobrança real não está comprovado como produção.",
  },
  {
    id: "object-storage",
    label: "Object Storage",
    state: "NOT_CONNECTED",
    execution: "external",
    note: "Storage geral de evidências/mídia ainda não está conectado como contrato universal do CORE.",
  },
  {
    id: "data-router",
    label: "Data Router",
    state: "PARTIAL",
    execution: "local",
    note: "Runner experimental local compara Planilhão/Cubo/Cubo Mágico e demais teorias com dataset comum; roteamento de produção continua não promovido.",
  },
];

const BY_ID = new Map(PLUGIN_CAPABILITY_REGISTRY.map((plugin) => [plugin.id, plugin]));

export function getPluginCapability(id: LamouPluginCapability): PluginCapabilityRecord {
  const plugin = BY_ID.get(id);
  if (!plugin) throw new Error(`PLUGIN_CAPABILITY_NOT_FOUND:${id}`);
  return plugin;
}
