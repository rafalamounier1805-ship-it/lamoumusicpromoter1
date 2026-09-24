import type { TruthState } from "@/lib/lamou/council-data";

export const CALL_TEST_SCENARIOS = [
  "success",
  "invalid input",
  "unauthenticated",
  "unauthorized",
  "wrong tenant",
  "timeout",
  "provider offline",
  "unexpected schema",
  "retry/idempotency",
  "fallback/SAFE",
  "recovery",
  "audit/tracing",
] as const;

export type CallTestScenario = (typeof CALL_TEST_SCENARIOS)[number];
export type CallTestResult = "PASS" | "FAIL" | "NOT_RUN";

export interface CallTestState {
  name: CallTestScenario;
  result: CallTestResult;
  evidenceId: string | null;
  build: string | null;
  environment: string | null;
}

export interface CallContract {
  id: string;
  version: string;
  owner: string;
  consumer: string;
  app: string;
  fn: string;
  source: string;
  target: string;
  purpose: string;
  auth: string;
  scopes: string[];
  tenant: string;
  input: string;
  output: string;
  schema: string;
  dataSources: string[];
  timeoutMs: number;
  retry: string;
  idempotency: string;
  fallback: string;
  safeMode: string;
  costLimits: string;
  logsTracing: string;
  risks: string[];
  dependencies: string[];
  lastTest: {
    at: string | null;
    build: string | null;
    environment: string | null;
  };
  evidence: string[];
  history: string[];
  dataClass: "interno" | "confidencial" | "público";
  status: TruthState;
  tests: CallTestState[];
}

const notRun = (): CallTestState[] =>
  CALL_TEST_SCENARIOS.map((name) => ({
    name,
    result: "NOT_RUN",
    evidenceId: null,
    build: null,
    environment: null,
  }));

const common = {
  version: "1.0.0",
  owner: "LAMOU CORE — Proprietário",
  lastTest: { at: null, build: null, environment: null },
  evidence: [] as string[],
  history: ["Contrato reconciliado no P0 da issue #19."],
  tests: notRun(),
};

export const CALL_REGISTRY: CallContract[] = [
  {
    ...common,
    tests: notRun(),
    id: "CALL-0001",
    consumer: "Owner Console / autenticação",
    app: "Owner Console",
    fn: "auth.signInWithPassword",
    source: "UI /auth",
    target: "Auth do backend LAMOU",
    purpose: "Criar sessão autenticada do proprietário sem expor segredo no cliente.",
    auth: "credencial do Owner",
    scopes: ["session:create:self"],
    tenant: "owner autenticado",
    input: "{ email: string, password: string }",
    output: "{ session | error }",
    schema: "auth.signin.v1",
    dataSources: ["Identity Provider"],
    timeoutMs: 15000,
    retry: "sem retry automático",
    idempotency: "não aplicável",
    fallback: "erro explícito; nenhuma sessão sintética",
    safeMode: "bloquear acesso autenticado",
    costLimits: "sem custo variável medido",
    logsTracing: "registrar resultado sem senha/token; agregação externa NOT_CONNECTED",
    risks: ["credential stuffing", "vazamento de sessão"],
    dependencies: ["Identity Provider", "política de sessão"],
    dataClass: "confidencial",
    status: "IMPLEMENTED_NOT_VERIFIED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0002",
    consumer: "Owner Console / recuperação",
    app: "Owner Console",
    fn: "auth.resetPasswordForEmail",
    source: "UI /auth",
    target: "Auth do backend LAMOU",
    purpose: "Solicitar recuperação de senha sem revelar existência de conta.",
    auth: "público com e-mail informado",
    scopes: ["password-reset:request"],
    tenant: "não aplicável antes da sessão",
    input: "{ email: string, redirectTo: string }",
    output: "{ accepted | error }",
    schema: "auth.reset.v1",
    dataSources: ["Identity Provider"],
    timeoutMs: 15000,
    retry: "sem retry automático",
    idempotency: "por e-mail + janela do provider",
    fallback: "mensagem neutra e instrução manual",
    safeMode: "não alterar credencial localmente",
    costLimits: "sem custo variável medido",
    logsTracing: "não logar endereço completo nem token; telemetria externa NOT_CONNECTED",
    risks: ["enumeração de conta", "abuso de reset"],
    dependencies: ["Identity Provider", "canal de e-mail"],
    dataClass: "confidencial",
    status: "IMPLEMENTED_NOT_VERIFIED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0003",
    consumer: "CORE / Conselho",
    app: "Conselho & Skills",
    fn: "council.orchestrate",
    source: "UI /core/ai",
    target: "Council runtime planner local",
    purpose: "Orquestrar etapas do Conselho sem executar especialistas externos diretamente.",
    auth: "sessão Owner",
    scopes: ["council:plan"],
    tenant: "owner autenticado",
    input: "{ taskType, mode, risk, evidence, privacy, costKnown }",
    output: "{ roles, pipeline, blockedStages, truth }",
    schema: "council.plan.v1",
    dataSources: ["Professional Role Registry", "truth-state local"],
    timeoutMs: 2000,
    retry: "não necessário; determinístico",
    idempotency: "mesma entrada gera mesmo plano",
    fallback: "checklist mínimo local",
    safeMode: "LOCAL_CHECKLISTS_ONLY",
    costLimits: "0 para planejamento local",
    logsTracing: "registrar taskType, modo e seleção; sem conteúdo sensível bruto",
    risks: ["seleção inadequada", "confundir planejamento com execução"],
    dependencies: ["Professional Role Registry"],
    dataClass: "interno",
    status: "IMPLEMENTED_NOT_VERIFIED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0003A",
    consumer: "Conselho / Context Retriever",
    app: "Conselho & Skills",
    fn: "council.retrieveEvidence",
    source: "Council runtime",
    target: "Evidence / RAG provider",
    purpose: "Recuperar contexto permitido com proveniência e freshness antes dos especialistas.",
    auth: "service secret server-side",
    scopes: ["evidence:read:allowed"],
    tenant: "owner atual; isolamento obrigatório",
    input: "{ query, allowedSources, tenant }",
    output: "{ evidenceItems[], provenance, freshness }",
    schema: "council.evidence.v1",
    dataSources: ["Mudoc/Registry quando conectado", "fontes autorizadas"],
    timeoutMs: 20000,
    retry: "1 retry com backoff",
    idempotency: "query hash + source snapshot",
    fallback: "retornar evidência ausente; nunca inventar contexto",
    safeMode: "sem RAG externo",
    costLimits: "limite ainda não definido / NOT_VERIFIED",
    logsTracing: "trace por source_id; backend ainda NOT_CONNECTED",
    risks: ["cross-tenant", "fonte stale", "contexto sem proveniência"],
    dependencies: ["Evidence Store", "RLS", "source allowlist"],
    dataClass: "confidencial",
    status: "NOT_CONNECTED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0003B",
    consumer: "Conselho / Permission Resolver",
    app: "Conselho & Skills",
    fn: "council.resolveTools",
    source: "Council runtime",
    target: "Tool / Permission Registry",
    purpose: "Resolver ferramentas, dados e scopes permitidos para cada profissional.",
    auth: "sessão Owner + política server-side",
    scopes: ["tools:resolve"],
    tenant: "owner atual",
    input: "{ roleIds[], taskType, tenant }",
    output: "{ allowedTools[], deniedTools[], reasons[] }",
    schema: "council.permissions.v1",
    dataSources: ["Tool Registry", "RBAC/ABAC"],
    timeoutMs: 5000,
    retry: "sem retry automático",
    idempotency: "por snapshot de política",
    fallback: "negar ferramenta não resolvida",
    safeMode: "deny-by-default",
    costLimits: "0 para resolução local",
    logsTracing: "decisão de permissão deve ser auditável",
    risks: ["over-permission", "scope incorreto"],
    dependencies: ["RBAC/ABAC", "Tool Registry"],
    dataClass: "interno",
    status: "DOCUMENTED_ONLY",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0003C",
    consumer: "Conselho / Specialist Runs",
    app: "Conselho & Skills",
    fn: "ai.specialistRun",
    source: "Council runtime server-side",
    target: "Provider de IA por contrato",
    purpose: "Executar um especialista isolado com contexto, ferramentas e limites permitidos.",
    auth: "secret server-side",
    scopes: ["model:invoke", "tools:subset"],
    tenant: "contexto segregado por owner",
    input: "{ role, task, evidence, allowedTools, budget }",
    output: "{ analysis, evidenceRefs, openQuestions, usage }",
    schema: "council.specialist.v1",
    dataSources: ["evidência resolvida", "Professional Role Registry"],
    timeoutMs: 60000,
    retry: "1 retry com backoff somente em erro transitório",
    idempotency: "run-id + specialist-id",
    fallback: "não executar; manter checklist local",
    safeMode: "LOCAL_CHECKLISTS_ONLY",
    costLimits: "budget obrigatório antes da execução; valor ainda NOT_VERIFIED",
    logsTracing: "run-id, provider, modelo, latência, uso e erro; sem segredo",
    risks: ["hallucination", "tool misuse", "custo", "vazamento de contexto"],
    dependencies: ["AI Provider", "Permission Resolver", "Evidence Retriever"],
    dataClass: "confidencial",
    status: "NOT_CONNECTED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0003D",
    consumer: "Conselho / Red Team",
    app: "Conselho & Skills",
    fn: "ai.redTeamRun",
    source: "Council runtime server-side",
    target: "Provider de IA por contrato",
    purpose: "Produzir revisão adversarial independente sem ver a conclusão final aprovada.",
    auth: "secret server-side",
    scopes: ["model:invoke:red-team"],
    tenant: "contexto segregado por owner",
    input: "{ task, evidence, candidateFindings }",
    output: "{ challenges, failureModes, falsifiers }",
    schema: "council.redteam.v1",
    dataSources: ["evidência resolvida", "findings de especialistas"],
    timeoutMs: 60000,
    retry: "sem retry sem registro de falha",
    idempotency: "run-id + red-team-version",
    fallback: "checklist adversarial local",
    safeMode: "sem alegar Red Team executado",
    costLimits: "budget obrigatório; não medido",
    logsTracing: "run-id e divergências; provider NOT_CONNECTED",
    risks: ["falsa independência", "custo", "context leakage"],
    dependencies: ["AI Provider", "Specialist Runs"],
    dataClass: "confidencial",
    status: "NOT_CONNECTED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0003E",
    consumer: "Conselho / Synthesis",
    app: "Conselho & Skills",
    fn: "ai.synthesizeCouncil",
    source: "Council runtime server-side",
    target: "Provider de IA por contrato",
    purpose: "Sintetizar convergências, divergências e pendências sem promover decisão humana.",
    auth: "secret server-side",
    scopes: ["model:invoke:synthesis"],
    tenant: "contexto segregado por owner",
    input: "{ specialistRuns, redTeam, evidenceRefs }",
    output: "{ synthesis, divergences, truth, pending }",
    schema: "council.synthesis.v1",
    dataSources: ["Specialist Runs", "Red Team", "Evidence References"],
    timeoutMs: 60000,
    retry: "1 retry em erro transitório",
    idempotency: "run-id + synthesis-version",
    fallback: "não sintetizar externamente; exibir resultados separados",
    safeMode: "human review only",
    costLimits: "budget obrigatório; não medido",
    logsTracing: "run-id, provider, modelo, uso e evidence refs",
    risks: ["apagar divergência", "overclaim", "custo"],
    dependencies: ["AI Provider", "Red Team", "Evidence Gate"],
    dataClass: "confidencial",
    status: "NOT_CONNECTED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0004",
    consumer: "LAMOU Version",
    app: "LAMOU Version",
    fn: "fs.localBridge",
    source: "UI / apps/version",
    target: "Bridge nativo Windows",
    purpose: "Executar operação local autorizada sobre arquivos/builds sem acesso implícito.",
    auth: "agente local autorizado",
    scopes: ["filesystem:explicit-path"],
    tenant: "dispositivo do proprietário",
    input: "{ operation, path }",
    output: "{ result | error }",
    schema: "version.localbridge.v1",
    dataSources: ["filesystem local autorizado"],
    timeoutMs: 30000,
    retry: "sem retry automático",
    idempotency: "por operation-id",
    fallback: "NOT_CONNECTED com instrução manual",
    safeMode: "read-only / no-op",
    costLimits: "0 de API; custo local não medido",
    logsTracing: "log local por operação quando bridge existir",
    risks: ["deleção indevida", "path traversal", "acesso fora do allowlist"],
    dependencies: ["native bridge", "path allowlist"],
    dataClass: "interno",
    status: "NOT_CONNECTED",
  },
  {
    ...common,
    tests: notRun(),
    id: "CALL-0005",
    consumer: "Research Scout",
    app: "Research Scout",
    fn: "http.fetchSource",
    source: "Server function",
    target: "Fonte externa autorizada",
    purpose: "Ler fonte permitida com freshness/proveniência sem expor segredo no frontend.",
    auth: "secret por provider server-side",
    scopes: ["source:read:allowlist"],
    tenant: "owner atual",
    input: "{ url | query, sourceId }",
    output: "{ normalizedDocument, provenance, fetchedAt }",
    schema: "research.fetch.v1",
    dataSources: ["fontes públicas autorizadas"],
    timeoutMs: 20000,
    retry: "2 retries com backoff",
    idempotency: "source-id + content hash",
    fallback: "marcar fonte indisponível/stale",
    safeMode: "não preencher dado ausente",
    costLimits: "quota por provider ainda NOT_VERIFIED",
    logsTracing: "source-id, status, latência e freshness",
    risks: ["fonte não confiável", "stale data", "SSRF"],
    dependencies: ["source allowlist", "normalizer"],
    dataClass: "público",
    status: "NOT_CONNECTED",
  },
];

export function validateCallContract(call: CallContract): string[] {
  const errors: string[] = [];
  const names = call.tests.map((test) => test.name);

  if (names.length !== CALL_TEST_SCENARIOS.length) {
    errors.push("TEST_SCENARIO_COUNT");
  }
  for (const scenario of CALL_TEST_SCENARIOS) {
    if (!names.includes(scenario)) errors.push(`MISSING_TEST:${scenario}`);
  }

  for (const test of call.tests) {
    if (test.result !== "PASS") continue;
    if (!test.evidenceId || !test.build || !test.environment) {
      errors.push(`PASS_WITHOUT_EVIDENCE:${test.name}`);
      continue;
    }
    if (call.lastTest.build !== test.build || call.lastTest.environment !== test.environment) {
      errors.push(`PASS_EVIDENCE_BUILD_MISMATCH:${test.name}`);
    }
  }

  const requiredStrings = [
    call.id,
    call.version,
    call.owner,
    call.consumer,
    call.fn,
    call.purpose,
    call.schema,
    call.tenant,
    call.fallback,
    call.safeMode,
    call.logsTracing,
  ];
  if (requiredStrings.some((value) => value.trim() === "")) errors.push("REQUIRED_FIELD_EMPTY");
  if (call.scopes.length === 0) errors.push("SCOPES_EMPTY");
  if (call.dependencies.length === 0) errors.push("DEPENDENCIES_EMPTY");

  return errors;
}
