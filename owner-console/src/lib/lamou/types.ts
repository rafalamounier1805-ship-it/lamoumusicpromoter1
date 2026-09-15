export type Severity = "normal" | "tendencia" | "probabilidade" | "critico" | "falha";

export const SEVERITY_LABEL: Record<Severity, string> = {
  normal: "Normal",
  tendencia: "Sinal de Tendência",
  probabilidade: "Alerta de Probabilidade",
  critico: "Crítico",
  falha: "Falha",
};

export type CoreLayer = "padrao" | "cubo";

export type Channel = "OFICIAL" | "DEMO" | "TESTE";

export type Provenance = "interno" | "gerado" | "fornecido";

export interface ModuleCard {
  id: string;
  name: string;
  route: string;
  summary: string;
  severity: Severity;
  pendings: Pending[];
  metrics: { label: string; value: string; demo: boolean }[];
}

export interface Pending {
  id: string;
  label: string;
  severity: Severity;
  resolved: boolean;
}

export interface Evidence {
  id: string;
  kind: "log" | "print" | "documento" | "métrica" | "relato";
  label: string;
  demo: boolean;
}

export type CaseStage =
  "origem" | "sinal" | "evidencia" | "teste" | "decisao" | "acao" | "resultado";

export const CASE_STAGES: CaseStage[] = [
  "origem",
  "sinal",
  "evidencia",
  "teste",
  "decisao",
  "acao",
  "resultado",
];

export type CaseDestination =
  | "investigar"
  | "ia"
  | "plano"
  | "reuniao"
  | "projeto"
  | "oportunidade"
  | "teste"
  | "falso-positivo"
  | "arquivado";

export interface CaseNode {
  id: string;
  title: string;
  district: string;
  layer: CoreLayer;
  x: number;
  y: number;
  severity: Severity;
  occurrence: boolean;
  stage: CaseStage;
  classification: string;
  origin: string;
  signal: string;
  description: string;
  evidences: Evidence[];
  metrics: { label: string; value: string; demo: boolean }[];
  actors: string[];
  hypotheses: string[];
  probability: string | null;
  history: { at: string; text: string }[];
  destination: CaseDestination | null;
  archivedReason?: string | undefined;
  owner?: string | null;
  relatedIds?: string[];
}

/** Proveniência da informação do caso. Fixtures permanecem SYNTHETIC_DEMO. */
export interface SourceRef {
  sourceId: string;
  sourceSystem: string;
  sourceType:
    | "telemetria"
    | "checklist"
    | "revisão"
    | "execução de teste"
    | "rotina"
    | "relato"
    | "comparação de snapshot";
  module: string;
  collectedAt: string;
  updatedAt: string;
  freshness: string;
  truthState: string;
  evidenceIds: string[];
}

export interface ProblemRef {
  statement: string;
  entity: string;
  knownImpact: string;
  unverifiedImpact: string;
  owner: string | null;
}

export interface BenchmarkMetric {
  label: string;
  baseline: string | null;
  current: string | null;
  reference: string | null;
  target: string | null;
  delta: string | null;
  truthState: string;
}

export interface AiAnalysis {
  providerStatus: "CONNECTED" | "NOT_CONNECTED";
  hypotheses: string[];
  evidenceIds: string[];
  confidence: string | null;
  method: string | null;
  limitations: string[];
}

export interface CaseExtra {
  source: SourceRef;
  problem: ProblemRef;
  benchmarks: BenchmarkMetric[];
  ai: AiAnalysis;
}

export interface Project {
  id: string;
  title: string;
  originCaseId: string | null;
  problem: string;
  status: "RASCUNHO" | "AGUARDANDO DEFINIÇÃO" | "EM EXECUÇÃO" | "CONCLUÍDO";
  createdAt: string;
}

export interface TestRequest {
  id: string;
  caseId: string;
  title: string;
  target: string;
  runnerStatus: "NOT_CONNECTED";
  createdAt: string;
}

export interface Referral {
  id: string;
  caseId: string;
  destination: string;
  app: string;
  note: string;
  createdAt: string;
}

export interface AppProduct {
  id: string;
  name: string;
  summary: string;
  status: "produção" | "homologação" | "desenvolvimento" | "descontinuado";
  version: string;
  health: Severity;
  coreUsed: CoreLayer[];
  tech: string[];
  channels: { channel: Channel; route: string | null }[];
  clients: string[];
  tests: { passed: number; failed: number; demo: boolean };
  docs: string[];
  history: { at: string; text: string }[];
}

export interface ClientAccount {
  id: string;
  name: string;
  segment: string;
  environment: "TESTE" | "OFICIAL";
  plan: PlanKey;
  deployment: { step: string; done: boolean }[];
  apps: string[];
  core: CoreLayer[];
  contractId: string;
  billing: { label: string; status: "em dia" | "pendente" | "em análise"; demo: boolean }[];
  updates: { at: string; text: string }[];
  tests: string[];
  docs: string[];
  support: { at: string; text: string; open: boolean }[];
  history: { at: string; text: string }[];
}

export type PlanKey = "essencial" | "profissional" | "premium" | "privado";

export const PLAN_LABEL: Record<PlanKey, string> = {
  essencial: "Essencial",
  profissional: "Profissional",
  premium: "Premium",
  privado: "Privado / Enterprise",
};

export interface Contract {
  id: string;
  company: string;
  plan: PlanKey;
  entitlements: string[];
  licenses: { users: number; devices: number; demo: boolean };
  payments: { label: string; status: string; demo: boolean }[];
  usage: { label: string; value: string; demo: boolean }[];
  status: "ativo" | "em negociação" | "suspenso";
  value: {
    current: string;
    potential: string;
    method: string;
    evidence: string;
  };
}

export type TestSubject =
  | "app"
  | "core-padrao"
  | "core-cubo"
  | "produto-cliente"
  | "tecnologia-cliente"
  | "plugin-provider"
  | "integracao"
  | "algoritmo-ia"
  | "processo"
  | "nova-ideia"
  | "solucao-terceiro";

export const TEST_SUBJECT_LABEL: Record<TestSubject, string> = {
  app: "Aplicativo",
  "core-padrao": "CORE Padrão",
  "core-cubo": "CORE Cubo",
  "produto-cliente": "Produto de cliente",
  "tecnologia-cliente": "Tecnologia usada em cliente",
  "plugin-provider": "Plugin / Provider",
  integracao: "Integração",
  "algoritmo-ia": "Algoritmo / IA",
  processo: "Processo",
  "nova-ideia": "Nova ideia",
  "solucao-terceiro": "Solução de terceiro",
};

export interface TestRun {
  id: string;
  subject: TestSubject;
  target: string;
  executor: "Teste³ IA" | "Manual" | "Híbrido";
  result: "aprovado" | "reprovado" | "inconclusivo" | "falso positivo" | "falso negativo";
  effectiveness: string;
  retest: boolean;
  evidences: Evidence[];
  at: string;
  notes: string;
}

export type ActionPlanStatus =
  "AGUARDANDO DEFINIÇÃO" | "DEFINIDO" | "EM EXECUÇÃO" | "CONCLUÍDO" | "CANCELADO";

export interface ActionPlan {
  id: string;
  title: string;
  originCaseId: string | null;
  origin: string;
  problem: string;
  evidences: Evidence[];
  status: ActionPlanStatus;
  owner: string;
  dueDate: string;
  priority: "baixa" | "média" | "alta" | "crítica" | "";
  objective: string;
  expectedEvidence: string;
  completionCriteria: string;
  closure: {
    result: string;
    effectiveness: string;
    recurrence: string;
    learning: string;
    candidateRule: string;
  } | null;
  createdAt: string;
}

export type ImprovementRoute =
  | "projeto"
  | "nova-versao"
  | "experimento-cubo"
  | "melhoria-app"
  | "backlog"
  | "estudo"
  | "plano-acao";

export const IMPROVEMENT_ROUTE_LABEL: Record<ImprovementRoute, string> = {
  projeto: "Projeto",
  "nova-versao": "Nova Versão",
  "experimento-cubo": "Experimento / Cubo",
  "melhoria-app": "Melhoria de app",
  backlog: "Backlog",
  estudo: "Estudo",
  "plano-acao": "Plano de Ação",
};

export interface Improvement {
  id: string;
  title: string;
  description: string;
  route: ImprovementRoute | null;
  origin: string;
  createdAt: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  severity: Severity;
  area: "integridade" | "permissões" | "isolamento" | "incidente" | "snapshot";
  evidence: string;
  status: "aberto" | "contido" | "encerrado";
  at: string;
}

export interface VersionEntry {
  id: string;
  build: string;
  label: string;
  state: "BASELINE FROZEN" | "CANDIDATA" | "PROMOVIDA" | "ROLLBACK" | "RASCUNHO";
  at: string;
  evidences: Evidence[];
  gate: { label: string; ok: boolean }[];
  notes: string;
}

export interface AssetItem {
  code: string;
  name: string;
  family:
    | "modulos"
    | "status"
    | "acoes"
    | "mapa"
    | "core-padrao"
    | "core-cubo"
    | "seguranca"
    | "testes"
    | "clientes"
    | "comercial"
    | "versoes"
    | "configuracoes"
    | "marca";
  version: string;
  status: "ATIVO" | "CONGELADO" | "EM REVISÃO";
  provenance: Provenance;
  usage: string;
  screens: string[];
  icon: string;
  changeRequestRequired: boolean;
  cropSafe: boolean;
}

export interface Scenario {
  id: string;
  name: string;
  track: "A" | "B" | "C" | "D" | "SAFE";
  state: "ativo" | "adormecido" | "revalidar" | "pós-falha";
  description: string;
  lastDrill: string;
}
