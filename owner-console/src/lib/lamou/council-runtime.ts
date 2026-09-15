import {
  COUNCIL_RUNS_SEED,
  PROFESSIONAL_ROLES,
  ROUTER_MODES,
  type CouncilRun,
  type ProfessionalRole,
  type RouterMode,
  type TaskType,
  type TruthState,
} from "@/lib/lamou/council-data";

export const COUNCIL_PIPELINE = [
  { id: "intake", label: "Council Intake", execution: "local" },
  { id: "evidence", label: "Context / Evidence Retriever", execution: "local" },
  { id: "router", label: "Professional Router", execution: "local" },
  { id: "permissions", label: "Permission / Tool Resolver", execution: "local" },
  { id: "specialists", label: "Specialist Runs", execution: "provider" },
  { id: "red-team", label: "Contraditor / Red Team", execution: "provider" },
  { id: "synthesis", label: "Synthesis", execution: "provider" },
  { id: "validation", label: "Validation / Evidence Gate", execution: "local" },
  { id: "human", label: "Human Approval", execution: "human" },
  { id: "action", label: "Action", execution: "governed" },
] as const;

export type CouncilRisk = "baixo" | "medio" | "alto";
export type CouncilEvidence = "suficiente" | "parcial" | "ausente";
export type CouncilPrivacy = "normal" | "sensivel";

export interface CouncilPlanInput {
  taskType: TaskType;
  mode: RouterMode;
  risk: CouncilRisk;
  evidence: CouncilEvidence;
  providerConnected: boolean;
  toolsConnected: boolean;
  privacy: CouncilPrivacy;
  costKnown: boolean;
}

export interface CouncilPlan {
  roles: ProfessionalRole[];
  pipeline: typeof COUNCIL_PIPELINE;
  providerState: "CONNECTED" | "NOT_CONNECTED";
  toolState: "CONNECTED" | "NOT_CONNECTED";
  executionMode: "LOCAL_CHECKLISTS_ONLY" | "PROVIDER_WITHOUT_TOOLS" | "GOVERNED_PROVIDER";
  blockedStages: string[];
  humanApprovalRequired: true;
  truth: TruthState;
  reasons: string[];
}

const HIGH_RISK_ROLES = new Set([
  "security-architect",
  "qa-test-architect",
  "systems-engineer",
  "software-architect",
]);
const EVIDENCE_ROLES = new Set([
  "research-scientist",
  "statistician",
  "data-scientist",
  "qa-test-architect",
]);
const TOOL_ROLES = new Set(["backend-engineer", "software-architect", "security-architect"]);
const PRIVACY_ROLES = new Set(["security-architect", "data-architect", "backend-engineer"]);

function scoreRole(role: ProfessionalRole, input: CouncilPlanInput): number {
  let score = role.fit[input.taskType] ?? 0;

  if (input.risk === "alto" && HIGH_RISK_ROLES.has(role.id)) score += 35;
  if (input.risk === "medio" && HIGH_RISK_ROLES.has(role.id)) score += 15;
  if (input.evidence !== "suficiente" && EVIDENCE_ROLES.has(role.id)) score += 25;
  if (!input.toolsConnected && TOOL_ROLES.has(role.id)) score += 20;
  if (input.privacy === "sensivel" && PRIVACY_ROLES.has(role.id)) score += 30;
  if (!input.costKnown && role.id === "financial-roi-analyst") score += 15;

  return score;
}

function ensureRole(roles: ProfessionalRole[], id: string, target: number): ProfessionalRole[] {
  if (roles.some((role) => role.id === id)) return roles;
  const required = PROFESSIONAL_ROLES.find((role) => role.id === id);
  if (!required) return roles;
  return [...roles.slice(0, Math.max(0, target - 1)), required];
}

export function planCouncilRun(input: CouncilPlanInput): CouncilPlan {
  const target = ROUTER_MODES.find((mode) => mode.mode === input.mode)?.minRoles ?? 3;
  let roles = [...PROFESSIONAL_ROLES]
    .map((role) => ({ role, score: scoreRole(role, input) }))
    .sort((a, b) => b.score - a.score || a.role.name.localeCompare(b.role.name))
    .slice(0, target)
    .map(({ role }) => role);

  if (input.risk === "alto") {
    roles = ensureRole(roles, "security-architect", target);
    roles = ensureRole(roles, "qa-test-architect", target);
  }
  if (input.mode === "PROFUNDO") {
    roles = ensureRole(roles, "research-scientist", target);
  }

  const blockedStages: string[] = [];
  if (!input.providerConnected) {
    blockedStages.push("Specialist Runs", "Contraditor / Red Team", "Synthesis");
  }
  if (!input.toolsConnected) {
    blockedStages.push("Permission / Tool Resolver: execução externa");
  }
  blockedStages.push("Action até aprovação humana e Validation / Evidence Gate");

  const executionMode = !input.providerConnected
    ? "LOCAL_CHECKLISTS_ONLY"
    : !input.toolsConnected
      ? "PROVIDER_WITHOUT_TOOLS"
      : "GOVERNED_PROVIDER";

  const reasons = [
    `Router considera aderência + risco ${input.risk} + evidência ${input.evidence}.`,
    `Privacidade: ${input.privacy}; ferramentas: ${input.toolsConnected ? "conectadas" : "não conectadas"}.`,
    input.providerConnected
      ? "Provider disponível: especialistas podem ser executados somente dentro de contratos e scopes permitidos."
      : "Provider NÃO CONECTADO: somente ranking determinístico e checklists locais; nenhuma síntese externa é simulada.",
    "Aprovação humana é obrigatória antes de qualquer ação.",
  ];

  return {
    roles,
    pipeline: COUNCIL_PIPELINE,
    providerState: input.providerConnected ? "CONNECTED" : "NOT_CONNECTED",
    toolState: input.toolsConnected ? "CONNECTED" : "NOT_CONNECTED",
    executionMode,
    blockedStages,
    humanApprovalRequired: true,
    truth: input.providerConnected ? (input.toolsConnected ? "PARTIAL" : "PARTIAL") : "NOT_CONNECTED",
    reasons,
  };
}

/**
 * Seeds históricos nunca podem aparecer como FACT/EVIDENCED sem persistência e custo/proveniência.
 * A origem é preservada; a leitura efetiva corrige o truth-state sem apagar o registro legado.
 */
export function effectiveCouncilRunTruth(run: CouncilRun): TruthState {
  if (!run.persisted) return "SYNTHETIC_DEMO";
  if (run.cost.source === "NÃO CONECTADO") return "NOT_VERIFIED";
  return run.truth;
}

export const EFFECTIVE_COUNCIL_RUNS = COUNCIL_RUNS_SEED.map((run) => ({
  ...run,
  truth: effectiveCouncilRunTruth(run),
}));
