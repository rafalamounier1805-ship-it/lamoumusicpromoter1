/**
 * LAMOU Registry — Wave 1 de aplicativos, CALL Registry, VA Registry,
 * indicadores de Arquitetura & Saúde e estrutura de Documentação Viva.
 * Nada aqui declara integração conectada sem evidência executada.
 */
import type { TruthState } from "./council-data";

export type Surface =
  | "central-owner"
  | "core-owner"
  | "core-cliente"
  | "ia-cliente"
  | "instalacao-owner"
  | "instalacao-cliente";

export const SURFACE_LABEL: Record<Surface, string> = {
  "central-owner": "LAMOU IA Central — Proprietário",
  "core-owner": "LAMOU CORE — Proprietário",
  "core-cliente": "LAMOU CORE — Cliente",
  "ia-cliente": "LAMOU IA — Cliente",
  "instalacao-owner": "Instalação do Proprietário",
  "instalacao-cliente": "Instalação / Provisionamento do Cliente",
};

export interface WaveApp {
  id: string;
  name: string;
  purpose: string;
  chainStep: number | null;
  route: string | null;
  shell: "rota real" | "ficha somente" | "não conectado";
  capabilities: string[];
  truth: TruthState;
  note?: string;
}

/** Catálogo histórico Wave 1. A ordem linear antiga foi substituída por fluxos
 *  direcionados em app-architecture.ts. chainStep é mantido apenas para compatibilidade
 *  visual/histórica e NÃO significa que todo caso percorre todos os aplicativos. */
export const WAVE1_APPS: WaveApp[] = [
  {
    id: "APP-034",
    name: "Research Scout",
    purpose: "Varredura de fontes e sinais externos para alimentar a cadeia.",
    chainStep: 1,
    route: "/apps/research-scout",
    shell: "rota real",
    capabilities: ["coleta de sinal", "classificação de fonte", "freshness"],
    truth: "NOT_CONNECTED" as TruthState,
    note: "APP-ID candidato. Nenhuma fonte externa conectada neste build.",
  },
  {
    id: "APP-BENCH",
    name: "Benchmarker",
    purpose: "Comparação estruturada entre soluções, versões e alternativas.",
    chainStep: 2,
    route: "/apps/benchmarker",
    shell: "rota real",
    capabilities: ["comparação multicritério", "delta de desempenho/custo"],
    truth: "NOT_VERIFIED",
    note: "ID canônico não reconciliado — não inventado.",
  },
  {
    id: "APP-OPP",
    name: "Opportunity Intelligence",
    purpose: "Transformar sinal comparado em oportunidade com ficha e validação.",
    chainStep: 3,
    route: "/apps/opportunity-intelligence",
    shell: "rota real",
    capabilities: ["ficha de oportunidade", "roteamento para projeto/versão/experimento"],
    truth: "PARTIAL" as TruthState,
    note: "Capability atendida hoje pelo módulo Planos & Melhorias.",
  },
  {
    id: "APP-029",
    name: "LAMOU Showroom",
    purpose: "Apresentação de produtos, canais e provas.",
    chainStep: 4,
    route: "/apps/showroom",
    shell: "rota real",
    capabilities: ["catálogo", "canais OFICIAL/DEMO/TESTE"],
    truth: "PARTIAL" as TruthState,
  },
  {
    id: "APP-011",
    name: "LAMOU IA — Diagnóstico 360",
    purpose: "Diagnóstico de cliente/produto com evidência e severidade.",
    chainStep: 5,
    route: "/apps/diagnostico-360",
    shell: "rota real",
    capabilities: ["diagnóstico por cliente", "severidade e pendências"],
    truth: "PARTIAL" as TruthState,
  },
  {
    id: "APP-012",
    name: "LAMOU Digital Improvement",
    purpose: "Converter diagnóstico em melhoria roteada.",
    chainStep: 6,
    route: "/apps/digital-improvement",
    shell: "rota real",
    capabilities: ["plano de ação", "rota de melhoria"],
    truth: "PARTIAL" as TruthState,
  },
  {
    id: "APP-030",
    name: "Diagnostic / Meeting Architect",
    purpose: "Estruturar reuniões e decisões a partir de casos.",
    chainStep: null,
    route: "/apps/meeting-architect",
    shell: "rota real",
    capabilities: ["pauta orientada a caso", "registro de decisão"],
    truth: "NOT_VERIFIED",
  },
  {
    id: "APP-010",
    name: "Teste³ IA",
    purpose: "Executor transversal de testes com evidência.",
    chainStep: 7,
    route: "/apps/teste3",
    shell: "rota real",
    capabilities: ["execução de teste", "reteste", "eficácia"],
    truth: "PARTIAL" as TruthState,
  },
  {
    id: "APP-VG",
    name: "Validation Gate",
    purpose: "Gate G0–G11: sem evidência não passa.",
    chainStep: 8,
    route: "/apps/validation-gate",
    shell: "rota real",
    capabilities: ["gates", "bloqueio de promoção", "evidência obrigatória"],
    truth: "PARTIAL" as TruthState,
  },
  {
    id: "APP-LAB",
    name: "LAMOU Lab",
    purpose: "Teoria, conceitos LUA e Matriz de Verdade Científica.",
    chainStep: 9,
    route: "/apps/lab",
    shell: "rota real",
    capabilities: ["conceitos", "estudos", "matriz de verdade"],
    truth: "PARTIAL" as TruthState,
  },
  {
    id: "APP-VER",
    name: "LAMOU Version",
    purpose: "Builds, baseline, candidata, rollback e linhagem documental.",
    chainStep: 10,
    route: "/apps/version",
    shell: "rota real",
    capabilities: ["versionamento", "gate de promoção", "linhagem"],
    truth: "PARTIAL" as TruthState,
    note: "Operações locais Windows exigem bridge nativo: NOT_CONNECTED.",
  },
  {
    id: "APP-007",
    name: "Orbit / Agenda / LifeOS",
    purpose: "Agenda e produtividade do Owner. Não é versionamento nem Intelligence 360.",
    chainStep: null,
    route: "/apps/orbit",
    shell: "rota real",
    capabilities: ["agenda", "rotina", "foco"],
    truth: "NOT_VERIFIED",
  },
];

export interface CallContract {
  id: string;
  app: string;
  fn: string;
  source: string;
  target: string;
  auth: string;
  scope: string;
  input: string;
  output: string;
  timeoutMs: number;
  retry: string;
  idempotency: string;
  fallback: string;
  dataClass: "interno" | "confidencial" | "público";
  status: TruthState;
  tests: { name: string; result: "PASS" | "NOT_RUN" | "FAIL" }[];
}

const CALL_TESTS = [
  "success",
  "unauthorized",
  "forbidden / wrong role",
  "bad schema",
  "timeout",
  "provider offline",
  "wrong tenant",
  "empty response",
  "fallback / recovery",
];

const notRun = CALL_TESTS.map((name) => ({ name, result: "NOT_RUN" as const }));

export const CALL_REGISTRY: CallContract[] = [
  {
    id: "CALL-0001",
    app: "Owner Console",
    fn: "auth.signInWithPassword",
    source: "UI /auth",
    target: "Auth do backend LAMOU",
    auth: "credencial do Owner",
    scope: "sessão própria",
    input: "{ email: string, password: string }",
    output: "{ session | error }",
    timeoutMs: 15000,
    retry: "sem retry automático",
    idempotency: "não aplicável",
    fallback: "mensagem de erro explícita ao Owner",
    dataClass: "confidencial",
    status: "IMPLEMENTED_NOT_VERIFIED" as TruthState,
    tests: notRun,
  },
  {
    id: "CALL-0002",
    app: "Owner Console",
    fn: "auth.resetPasswordForEmail",
    source: "UI /auth",
    target: "Auth do backend LAMOU",
    auth: "público com e-mail informado",
    scope: "recuperação de senha",
    input: "{ email: string, redirectTo: string }",
    output: "{ ok | error }",
    timeoutMs: 15000,
    retry: "sem retry automático",
    idempotency: "idempotente por e-mail",
    fallback: "instrução manual ao Owner",
    dataClass: "confidencial",
    status: "IMPLEMENTED_NOT_VERIFIED" as TruthState,
    tests: notRun,
  },
  {
    id: "CALL-0003",
    app: "Conselho & Skills",
    fn: "ai.councilRun",
    source: "UI /owner/conselho",
    target: "Provedor de IA por contrato",
    auth: "secret server-side",
    scope: "execução de conselho",
    input: "{ taskType, mode, context }",
    output: "{ roles, synthesis, divergences, cost }",
    timeoutMs: 60000,
    retry: "1 retry com backoff",
    idempotency: "run-id",
    fallback: "modo determinístico local (ranking de perfis) sem chamada externa",
    dataClass: "confidencial",
    status: "NOT_CONNECTED" as TruthState,
    tests: notRun,
  },
  {
    id: "CALL-0004",
    app: "LAMOU Version",
    fn: "fs.localBridge",
    source: "UI /owner/versoes",
    target: "Bridge nativo Windows",
    auth: "agente local autorizado",
    scope: "arquivos/builds locais",
    input: "{ operation, path }",
    output: "{ result | error }",
    timeoutMs: 30000,
    retry: "sem retry",
    idempotency: "por operação",
    fallback: "estado NOT_CONNECTED e próximo passo exibido",
    dataClass: "interno",
    status: "NOT_CONNECTED" as TruthState,
    tests: notRun,
  },
  {
    id: "CALL-0005",
    app: "Research Scout",
    fn: "http.fetchSource",
    source: "Server function",
    target: "Fonte externa",
    auth: "secret por provider",
    scope: "leitura de fonte pública",
    input: "{ url | query }",
    output: "{ documento normalizado }",
    timeoutMs: 20000,
    retry: "2 retries com backoff",
    idempotency: "hash de conteúdo",
    fallback: "marcar fonte como indisponível",
    dataClass: "público",
    status: "NOT_CONNECTED" as TruthState,
    tests: notRun,
  },
];

export interface VaRegistryItem {
  id: string;
  name: string;
  purpose: string;
  consumers: string[];
  skill: string;
  models: string;
  allowedCalls: string[];
  allowedData: string;
  forbidden: string[];
  humanApproval: boolean;
  autonomy: "sugerir" | "executar com aprovação" | "executar";
  timeoutMs: number;
  fallback: string;
  evals: string;
  cost: string;
  version: string;
  status: TruthState;
}

export const VA_REGISTRY: VaRegistryItem[] = [
  {
    id: "VA-001",
    name: "Router do Conselho",
    purpose: "Selecionar perfis pertinentes e montar o conselho por tipo de tarefa.",
    consumers: ["Conselho & Skills", "Planos & Melhorias"],
    skill: "Roteamento por aderência (determinístico)",
    models: "nenhum modelo externo autorizado ainda",
    allowedCalls: [],
    allowedData: "definições internas de perfis",
    forbidden: ["decidir remoção", "promover versão"],
    humanApproval: true,
    autonomy: "sugerir",
    timeoutMs: 0,
    fallback: "ranking determinístico local",
    evals: "não executados",
    cost: "0 (sem chamada externa)",
    version: "0.2",
    status: "IMPLEMENTED_NOT_VERIFIED" as TruthState,
  },
  {
    id: "VA-002",
    name: "Contraditor / Red Team",
    purpose: "Tentar derrubar a proposta no modo PROFUNDO.",
    consumers: ["Conselho & Skills"],
    skill: "Revisão adversarial",
    models: "pendente de contrato de IA",
    allowedCalls: ["CALL-0003"],
    allowedData: "contexto do caso, sem segredos",
    forbidden: ["alterar dados", "aprovar gate"],
    humanApproval: true,
    autonomy: "sugerir",
    timeoutMs: 60000,
    fallback: "checklist de red flags por perfil",
    evals: "não executados",
    cost: "não medido",
    version: "0.1",
    status: "NOT_CONNECTED" as TruthState,
  },
  {
    id: "VA-003",
    name: "Teste³ Executor",
    purpose: "Executar suítes e registrar evidência.",
    consumers: ["Testes & Qualidade", "Validation Gate"],
    skill: "QA / Test Architect",
    models: "não aplicável nesta versão",
    allowedCalls: [],
    allowedData: "resultados de teste do próprio ambiente",
    forbidden: ["marcar PASS sem evidência"],
    humanApproval: false,
    autonomy: "sugerir",
    timeoutMs: 0,
    fallback: "registro manual de execução",
    evals: "não executados",
    cost: "0",
    status: "SIMULATED" as TruthState,
    version: "0.1",
  },
];

export interface HealthIndicator {
  label: string;
  value: string;
  status: "ok" | "parcial" | "nao-verificado" | "nao-conectado";
  detail: string;
}

export const DOC_STRUCTURE: { folder: string; files: string[] }[] = [
  {
    folder: "00_MASTER",
    files: ["MASTER_DOCUMENT.md", "PRODUCT_MANIFEST.md", "VERSION_MANIFEST.md", "CHANGELOG.md"],
  },
  {
    folder: "10_PRODUCT",
    files: ["PRODUCT_SPEC.md", "BUSINESS_RULES.md", "USER_ROLES.md", "ACCEPTANCE.md"],
  },
  {
    folder: "20_ARCHITECTURE",
    files: [
      "ARCHITECTURE.md",
      "APP_CATALOG.md",
      "APP_CORE_BINDINGS.md",
      "DEPENDENCIES.md",
      "DATA_FLOW.md",
      "FLOW_HANDOFFS.md",
      "SOURCE_OF_TRUTH.md",
      "LINEAGE_ALIASES.md",
      "DUPLICATION_RECONCILIATION.md",
    ],
  },
  {
    folder: "30_CONTRACTS",
    files: [
      "CALL_REGISTRY.md",
      "API_CONTRACTS.md",
      "TOOL_CONTRACTS.md",
      "AI_CONTRACTS.md",
      "WEBHOOK_CONTRACTS.md",
      "EVENT_CONTRACTS.md",
    ],
  },
  {
    folder: "40_DATA",
    files: ["DATA_CONTRACT.md", "SCHEMAS.md", "RLS.md", "RETENTION.md", "METRICS_REGISTRY.md"],
  },
  {
    folder: "50_SECURITY",
    files: ["SECURITY_SPEC.md", "RBAC_ABAC.md", "THREAT_MODEL.md", "SECRET_REQUIREMENTS.md"],
  },
  {
    folder: "60_TESTS",
    files: [
      "TEST_MASTER_PLAN.md",
      "TEST_CASES.md",
      "API_CALL_TESTS.md",
      "NEGATIVE_TESTS.md",
      "SECURITY_TESTS.md",
      "E2E_TESTS.md",
    ],
  },
  {
    folder: "70_VALIDATION",
    files: [
      "VALIDATION_CONTRACT.md",
      "GATES.md",
      "EVIDENCE_REQUIREMENTS.md",
      "EFFECTIVENESS_CONTRACT.md",
      "TRUTH_STATE.md",
    ],
  },
  {
    folder: "80_AI",
    files: ["AI_MODEL_CONTRACT.md", "PROMPTS.md", "SKILLS.md", "AGENTS.md", "EVALS.md"],
  },
  {
    folder: "90_UI",
    files: ["VISUAL_BINDING.md", "ROUTES.md", "SCREEN_SPEC.md", "ASSET_BINDINGS.md"],
  },
  {
    folder: "95_OPERATIONS",
    files: [
      "OBSERVABILITY.md",
      "METRICS_REGISTRY.md",
      "HANDOFF_MONITORING.md",
      "BACKUP_RESTORE.md",
      "DEPLOYMENT.md",
      "RUNBOOK.md",
    ],
  },
];

export const VISUAL_LOCKS: { file: string; surface: string; read: boolean }[] = [
  {
    file: "LAMOU_VISUAL_LOCK_OWNER_INSTALL.png",
    surface: "Instalação do Proprietário",
    read: false,
  },
  {
    file: "LAMOU_VISUAL_LOCK_OWNER_ONBOARDING_STORYBOARD.png",
    surface: "Onboarding Owner",
    read: false,
  },
  { file: "LAMOU_VISUAL_LOCK_CLIENT_INSTALL.png", surface: "Instalação do Cliente", read: false },
  { file: "LAMOU_VISUAL_LOCK_MAPA_VIVO_OWNER.png", surface: "Mapa Vivo Owner", read: false },
  { file: "LAMOU_VISUAL_LOCK_ICON_LIBRARY.png", surface: "Biblioteca Visual", read: false },
  { file: "LAMOU_VISUAL_LOCK_SHOWROOM.png", surface: "Showroom", read: false },
  { file: "LAMOU_VISUAL_LOCK_CORE_ARCHITECTURE.png", surface: "Arquitetura CORE", read: false },
  { file: "LAMOU_VISUAL_LOCK_QUALITY_TESTS.png", surface: "Testes & Qualidade", read: false },
  { file: "LAMOU_VISUAL_LOCK_ORBIT_LIFEOS.png", surface: "Orbit / LifeOS", read: false },
  {
    file: "LAMOU_VISUAL_LOCK_OPPORTUNITY_FICHA.png",
    surface: "Ficha de Oportunidade",
    read: false,
  },
  {
    file: "LAMOU_VISUAL_LOCK_OPPORTUNITY_VALIDATION.png",
    surface: "Validação de Oportunidade",
    read: false,
  },
];
