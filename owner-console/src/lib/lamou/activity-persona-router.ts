import { PROFESSIONAL_ROLES, type ProfessionalRole } from "@/lib/lamou/council-data";

export type LamouActivityKey =
  | "governance-cockpit"
  | "mapa-vivo-detection"
  | "client-360"
  | "products-apps"
  | "commercial-opportunities"
  | "core-health-observability"
  | "core-architecture-data"
  | "core-problems-hypotheses"
  | "core-tests-validation"
  | "core-versions-release"
  | "install-owner-security"
  | "install-client-provisioning"
  | "labtest-experiment"
  | "app-runtime"
  | "documents-governance"
  | "ai-council"
  | "data-cube-research";

export type LamouPluginCapability =
  | "data-auth"
  | "usage-telemetry"
  | "error-monitoring"
  | "ai-provider"
  | "validation-gate"
  | "version-registry"
  | "document-registry"
  | "visual-library"
  | "map-routing"
  | "billing-contracts"
  | "object-storage"
  | "data-router";

export interface ActivityPersonaProfile {
  key: LamouActivityKey;
  label: string;
  personaIds: string[];
  plugins: LamouPluginCapability[];
  objective: string;
}

export const ACTIVITY_PERSONA_PROFILES: ActivityPersonaProfile[] = [
  {
    key: "governance-cockpit",
    label: "Cognitive / Cockpit",
    personaIds: ["product-manager", "data-scientist", "systems-engineer"],
    plugins: ["usage-telemetry", "data-auth", "error-monitoring"],
    objective: "Priorizar sinais reais, impacto e próxima ação sem fabricar probabilidade.",
  },
  {
    key: "mapa-vivo-detection",
    label: "Mapa Vivo",
    personaIds: ["systems-engineer", "data-scientist", "product-designer"],
    plugins: ["map-routing", "usage-telemetry", "data-auth"],
    objective: "Detectar, contextualizar e encaminhar; investigação e solução ficam no CORE.",
  },
  {
    key: "client-360",
    label: "Cliente 360",
    personaIds: ["product-manager", "data-architect", "security-architect"],
    plugins: ["data-auth", "billing-contracts", "usage-telemetry"],
    objective: "Manter visão executiva do cliente com isolamento, origem e truth-state claros.",
  },
  {
    key: "products-apps",
    label: "Produtos & Aplicativos",
    personaIds: ["product-manager", "software-architect", "qa-test-architect"],
    plugins: ["version-registry", "validation-gate", "usage-telemetry"],
    objective: "Governar qualidade, versão, uso, evidência, falhas e evolução de cada app.",
  },
  {
    key: "commercial-opportunities",
    label: "Comercial, contratos e oportunidades",
    personaIds: ["product-manager", "financial-roi-analyst", "data-scientist"],
    plugins: ["billing-contracts", "usage-telemetry", "document-registry"],
    objective: "Separar valor observado, hipótese de valor, contrato e oportunidade.",
  },
  {
    key: "core-health-observability",
    label: "Saúde & Observabilidade",
    personaIds: ["systems-engineer", "data-engineer", "qa-test-architect"],
    plugins: ["usage-telemetry", "error-monitoring", "validation-gate"],
    objective: "Transformar sinais, métricas e falhas em evidência operacional acionável.",
  },
  {
    key: "core-architecture-data",
    label: "Arquitetura, dados e bindings",
    personaIds: [
      "software-architect",
      "data-architect",
      "backend-engineer",
      "security-architect",
    ],
    plugins: ["data-auth", "data-router", "object-storage", "version-registry"],
    objective: "Preservar contratos, isolamento, linhagem e escolha correta do armazenamento.",
  },
  {
    key: "core-problems-hypotheses",
    label: "Problemas, hipóteses e melhorias",
    personaIds: [
      "research-scientist",
      "data-scientist",
      "systems-engineer",
      "product-manager",
    ],
    plugins: ["validation-gate", "usage-telemetry", "document-registry"],
    objective: "Separar fato, hipótese, teste, decisão, ação e eficácia.",
  },
  {
    key: "core-tests-validation",
    label: "Testes & Validation Gate",
    personaIds: ["qa-test-architect", "security-architect", "software-engineer"],
    plugins: ["validation-gate", "error-monitoring", "version-registry"],
    objective: "Exigir evidência reproduzível antes de PASS ou promoção.",
  },
  {
    key: "core-versions-release",
    label: "Versões, release e recuperação",
    personaIds: ["software-architect", "qa-test-architect", "systems-engineer"],
    plugins: ["version-registry", "validation-gate", "document-registry"],
    objective: "Controlar CURRENT/PINNED/FROZEN, rollback, promoção e evidência de release.",
  },
  {
    key: "install-owner-security",
    label: "Instalação Proprietário",
    personaIds: [
      "security-architect",
      "backend-engineer",
      "qa-test-architect",
      "product-designer",
    ],
    plugins: ["data-auth", "validation-gate", "object-storage", "usage-telemetry"],
    objective: "Instalar Owner com autenticação, isolamento, recuperação, testes e clareza didática.",
  },
  {
    key: "install-client-provisioning",
    label: "Instalação Cliente",
    personaIds: [
      "backend-engineer",
      "security-architect",
      "product-designer",
      "qa-test-architect",
    ],
    plugins: ["data-auth", "validation-gate", "billing-contracts", "usage-telemetry"],
    objective: "Provisionar cliente sem botão fake, com tenant, entitlement, acesso e evidência.",
  },
  {
    key: "labtest-experiment",
    label: "LABTEST",
    personaIds: [
      "research-scientist",
      "qa-test-architect",
      "data-scientist",
      "software-architect",
    ],
    plugins: ["validation-gate", "data-router", "version-registry", "usage-telemetry"],
    objective: "Executar baseline PINNED, uma variável, evidência, comparação e gate.",
  },
  {
    key: "app-runtime",
    label: "Aplicativo LAMOU",
    personaIds: ["product-manager", "fullstack-engineer", "qa-test-architect"],
    plugins: ["data-auth", "usage-telemetry", "error-monitoring", "validation-gate"],
    objective: "Garantir função real ponta a ponta, banco correto, telemetria e qualidade.",
  },
  {
    key: "documents-governance",
    label: "Documentos / MuDoc",
    personaIds: ["data-architect", "product-manager", "qa-test-architect"],
    plugins: ["document-registry", "object-storage", "usage-telemetry"],
    objective: "Preservar versão, autoria, validade, origem, evidência e uso dos documentos.",
  },
  {
    key: "ai-council",
    label: "IA, Conselho e Orquestrador",
    personaIds: [
      "software-architect",
      "data-scientist",
      "security-architect",
      "research-scientist",
    ],
    plugins: ["ai-provider", "data-router", "validation-gate", "usage-telemetry"],
    objective: "Selecionar especialistas e ferramentas sem simular provider ou evidência inexistente.",
  },
  {
    key: "data-cube-research",
    label: "Planilhão, Cubo, Cubo Mágico e Caleidoscópio",
    personaIds: [
      "data-architect",
      "data-engineer",
      "software-architect",
      "systems-engineer",
      "research-scientist",
    ],
    plugins: ["data-router", "object-storage", "usage-telemetry", "validation-gate"],
    objective: "Experimentar múltiplas organizações de dados sob um contrato canônico e mensurar ganho real.",
  },
];

const BY_KEY = new Map(ACTIVITY_PERSONA_PROFILES.map((profile) => [profile.key, profile]));
const ROLE_BY_ID = new Map(PROFESSIONAL_ROLES.map((role) => [role.id, role]));

export function activityForRoute(route: string): LamouActivityKey {
  const path = route.split("?")[0]?.split("#")[0] ?? route;
  if (path.startsWith("/owner/mapa-vivo")) return "mapa-vivo-detection";
  if (path.startsWith("/owner/clients")) return "client-360";
  if (path.startsWith("/owner/products") || path.startsWith("/owner/apps")) {
    return "products-apps";
  }
  if (path.startsWith("/owner/commercial") || path.startsWith("/owner/opportunities")) {
    return "commercial-opportunities";
  }
  if (path.startsWith("/owner/documents")) return "documents-governance";
  if (path === "/owner" || path.startsWith("/owner/")) return "governance-cockpit";
  if (path.startsWith("/install/owner")) return "install-owner-security";
  if (path.startsWith("/install/client")) return "install-client-provisioning";
  if (path.startsWith("/labtest")) return "labtest-experiment";
  if (path.startsWith("/apps/")) return "app-runtime";
  if (path.startsWith("/core/health") || path.startsWith("/core/observability")) {
    return "core-health-observability";
  }
  if (path.startsWith("/core/problems")) return "core-problems-hypotheses";
  if (path.startsWith("/core/tests")) return "core-tests-validation";
  if (path.startsWith("/core/versions")) return "core-versions-release";
  if (path.startsWith("/core/ai")) return "ai-council";
  if (
    path.startsWith("/core/architecture") ||
    path.startsWith("/core/data") ||
    path.startsWith("/core/apps") ||
    path.startsWith("/core/security") ||
    path.startsWith("/core/settings") ||
    path.startsWith("/core/calls")
  ) {
    return "core-architecture-data";
  }
  return "governance-cockpit";
}

export function getActivityPersonaProfile(key: LamouActivityKey): ActivityPersonaProfile {
  const profile = BY_KEY.get(key);
  if (!profile) throw new Error(`ACTIVITY_PERSONA_PROFILE_NOT_FOUND:${key}`);
  return profile;
}

export function personasForActivity(key: LamouActivityKey): ProfessionalRole[] {
  return getActivityPersonaProfile(key).personaIds.map((id) => {
    const role = ROLE_BY_ID.get(id);
    if (!role) throw new Error(`ACTIVITY_PERSONA_ROLE_NOT_FOUND:${key}:${id}`);
    return role;
  });
}

export function activityContextForRoute(route: string) {
  const key = activityForRoute(route);
  const profile = getActivityPersonaProfile(key);
  return {
    activityKey: key,
    activityLabel: profile.label,
    personaIds: profile.personaIds,
    plugins: profile.plugins,
    objective: profile.objective,
  };
}
