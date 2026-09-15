import type { TruthState } from "@/lib/lamou/council-data";
import { LAB_CONCEPTS } from "@/lib/lamou/lab-data";

/**
 * LABTEST — superfície única de tudo que ainda não foi promovido.
 * Todo o conteúdo é fixture SYNTHETIC_DEMO: não existe runtime de teste conectado.
 */

export const LT_STAGES = [
  "IDEIA/CRIAÇÃO",
  "DESENVOLVIMENTO",
  "TESTE",
  "HOMOLOGAÇÃO",
  "READY_FOR_GATE",
  "PROMOVIDO",
  "BLOQUEADO",
  "NÃO_VERIFICADO",
] as const;
export type LtStage = (typeof LT_STAGES)[number];

export const LT_TYPES = [
  "aplicativo",
  "modulo",
  "build",
  "core",
  "arquitetura",
  "plugin",
  "provider",
  "call",
  "integracao",
  "dataset",
  "treinamento",
  "prompt",
] as const;
export type LtType = (typeof LT_TYPES)[number];

export const LT_TYPE_LABEL: Record<LtType, string> = {
  aplicativo: "Aplicativo",
  modulo: "Módulo",
  build: "Código / build / versão",
  core: "CORE / família",
  arquitetura: "Arquitetura experimental",
  plugin: "Plugin",
  provider: "Provider / modelo",
  call: "CALL / contrato",
  integracao: "Integração",
  dataset: "Dados / banco de teste",
  treinamento: "Treinamento",
  prompt: "Prompt / IA / agente",
};

/** Abas didáticas do LABTEST e os tipos que cada uma reúne. */
export const LT_TABS: { key: string; label: string; types?: LtType[] }[] = [
  { key: "overview", label: "Visão Geral" },
  { key: "improve", label: "Pode Melhorar" },
  { key: "opportunities", label: "Oportunidades" },
  { key: "ideas", label: "Candidatos & Ideias" },
  { key: "apps", label: "Aplicativos", types: ["aplicativo", "modulo"] },
  { key: "core", label: "CORE & Módulos", types: ["core", "arquitetura"] },
  { key: "plugins", label: "Plugins & Providers", types: ["plugin", "provider"] },
  { key: "calls", label: "CALLs & Integrações", types: ["call", "integracao"] },
  { key: "builds", label: "Código, Builds & Versões", types: ["build"] },
  { key: "data", label: "Dados & Bancos de Teste", types: ["dataset"] },
  { key: "trainings", label: "Treinamentos", types: ["treinamento"] },
  { key: "evals", label: "Cenários & Evals", types: ["prompt"] },
  { key: "evidence", label: "Evidências & Validation Gate" },
  { key: "next", label: "Próxima Versão / Fila" },
];

export interface LtItem {
  id: string;
  type: LtType;
  name: string;
  family: string;
  version: string | null;
  stage: LtStage;
  truth: TruthState;
  owner: string | null;
  updatedAt: string;
  testsDone: number;
  testsPending: number;
  evidences: string[];
  blockers: string[];
  target: string | null;
  source: string;
  dependencies: string[];
  consumers: string[];
  risks: string[];
  requiredTests: string[];
  history: { at: string; text: string }[];
  demoDatasets?: string[];
}

const ARCH_ITEMS: LtItem[] = LAB_CONCEPTS.map((c, i) => ({
  id: c.id,
  type: "arquitetura",
  name: c.name,
  family: "CORE / arquiteturas experimentais (LUA)",
  version: null,
  stage: i === 0 ? "TESTE" : "IDEIA/CRIAÇÃO",
  truth: c.truth,
  owner: "Rafael Lamounier",
  updatedAt: "2026-09-10",
  testsDone: 0,
  testsPending: c.requiredTests.length,
  evidences: [],
  blockers: ["Sem execução registrada", "Sem falsificador testado"],
  target: null,
  source: c.existingScience.join(" · "),
  dependencies: ["CORE Padrão / SOL como baseline"],
  consumers: ["nenhum consumidor em produção"],
  risks: c.risks,
  requiredTests: c.requiredTests,
  history: [{ at: "2026-09-10", text: "Conceito registrado no LABTEST" }],
}));

export const LT_ITEMS: LtItem[] = [
  {
    id: "LT-APP-0001",
    type: "aplicativo",
    name: "Condomínio Reclame — módulo Demonstração",
    family: "Aplicativos / Wave 1",
    version: "0.9.4-candidata",
    stage: "TESTE",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    owner: "Rafael Lamounier",
    updatedAt: "2026-09-14",
    testsDone: 2,
    testsPending: 5,
    evidences: ["EV-0011 (captura de tela DEMO)"],
    blockers: ["Runner de teste não conectado"],
    target: "v0.9.4",
    source: "Fixture do portfólio de aplicativos",
    dependencies: ["CALL-0002", "CORE Padrão"],
    consumers: ["Residencial Meridiano (TESTE)"],
    risks: ["Demo pode ser confundida com operação real"],
    requiredTests: ["Fluxo de cadastro", "Fluxo de reclamação", "Isolamento por tenant"],
    history: [{ at: "2026-09-14", text: "Candidata movida para TESTE" }],
    demoDatasets: ["Clientes sintéticos", "Compras sintéticas", "Operação sintética"],
  },
  {
    id: "LT-APP-0002",
    type: "aplicativo",
    name: "Showroom — jornada de prospect",
    family: "Aplicativos / comercial",
    version: "0.2-spec",
    stage: "IDEIA/CRIAÇÃO",
    truth: "DOCUMENTED_ONLY",
    owner: null,
    updatedAt: "2026-09-08",
    testsDone: 0,
    testsPending: 3,
    evidences: [],
    blockers: ["Apenas ficha técnica; sem implementação"],
    target: null,
    source: "Ficha de produto",
    dependencies: ["Diagnóstico 360"],
    consumers: ["prospects"],
    risks: ["Prometer demonstração inexistente"],
    requiredTests: ["Roteiro de demonstração", "Conteúdo client-safe"],
    history: [{ at: "2026-09-08", text: "Ficha registrada" }],
    demoDatasets: ["Prospect sintético"],
  },
  {
    id: "LT-MOD-0001",
    type: "modulo",
    name: "Cliente 360 — fluxos de pacote e atualização",
    family: "Central / Clientes",
    version: "candidata local",
    stage: "HOMOLOGAÇÃO",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    owner: "Rafael Lamounier",
    updatedAt: "2026-09-15",
    testsDone: 3,
    testsPending: 2,
    evidences: ["EV-0020 (percurso local)"],
    blockers: ["Canais de mensagem não conectados"],
    target: "v0.9.4",
    source: "Pedido do proprietário",
    dependencies: ["fixtures de clientes"],
    consumers: ["Central > Clientes"],
    risks: ["Confundir registro local com envio real"],
    requiredTests: ["Alterar pacote", "Programar atualização", "Backup"],
    history: [{ at: "2026-09-15", text: "Fluxos implementados como candidata" }],
  },
  {
    id: "LT-BUILD-0001",
    type: "build",
    name: "Build candidata do console do proprietário",
    family: "Código / builds",
    version: "0.9.4-candidata",
    stage: "READY_FOR_GATE",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    owner: "Rafael Lamounier",
    updatedAt: "2026-09-15",
    testsDone: 4,
    testsPending: 3,
    evidences: ["EV-0021 (typecheck + build local)"],
    blockers: ["Sem teste automatizado de regressão"],
    target: "v0.9.4",
    source: "Pipeline local",
    dependencies: ["LT-MOD-0001"],
    consumers: ["Central", "CORE", "LABTEST"],
    risks: ["Promover sem cobertura de teste"],
    requiredTests: ["Typecheck", "Build", "Smoke de rotas", "Responsividade"],
    history: [{ at: "2026-09-15", text: "Build local aprovada em typecheck e build" }],
  },
  {
    id: "LT-CALL-0001",
    type: "call",
    name: "CALL de análise de caso pela IA",
    family: "CALLs & contratos",
    version: "contrato v0.3",
    stage: "BLOQUEADO",
    truth: "NOT_CONNECTED",
    owner: "Rafael Lamounier",
    updatedAt: "2026-09-12",
    testsDone: 0,
    testsPending: 9,
    evidences: [],
    blockers: ["Provider de IA não conectado"],
    target: null,
    source: "CALL Registry",
    dependencies: ["Provider de IA"],
    consumers: ["Mapa Vivo", "Documentos"],
    risks: ["Resposta simulada ser lida como análise real"],
    requiredTests: ["9 cenários obrigatórios do CALL Registry"],
    history: [{ at: "2026-09-12", text: "Contrato registrado, execução bloqueada" }],
  },
  {
    id: "LT-PROV-0001",
    type: "provider",
    name: "Provider de IA — comparação de modelos",
    family: "Providers & plugins",
    version: null,
    stage: "BLOQUEADO",
    truth: "NOT_CONNECTED",
    owner: null,
    updatedAt: "2026-09-12",
    testsDone: 0,
    testsPending: 4,
    evidences: [],
    blockers: ["Nenhuma credencial configurada"],
    target: null,
    source: "Instalação do proprietário, etapa de APIs",
    dependencies: ["Configuração de segredo server-side"],
    consumers: ["LT-CALL-0001"],
    risks: ["Custo por token sem quota definida"],
    requiredTests: ["Conexão", "Latência", "Custo", "Qualidade comparada"],
    history: [{ at: "2026-09-12", text: "Provider previsto, não configurado" }],
  },
  {
    id: "LT-DATA-0001",
    type: "dataset",
    name: "Banco de teste — condomínio sintético",
    family: "Dados & bancos de teste",
    version: "v1",
    stage: "TESTE",
    truth: "SYNTHETIC_DEMO",
    owner: "Rafael Lamounier",
    updatedAt: "2026-09-11",
    testsDone: 1,
    testsPending: 1,
    evidences: ["EV-0012 (dataset gerado localmente)"],
    blockers: [],
    target: "v0.9.4",
    source: "Gerado a partir das fixtures do projeto",
    dependencies: [],
    consumers: ["LT-APP-0001"],
    risks: ["Ser confundido com dado de cliente real"],
    requiredTests: ["Volume mínimo", "Cobertura de casos de borda"],
    history: [{ at: "2026-09-11", text: "Dataset sintético criado" }],
    demoDatasets: ["Pessoas", "Documentos", "Compras", "Operações"],
  },
  {
    id: "LT-TRN-0001",
    type: "treinamento",
    name: "Treinamento — governança SALVAR ≠ PROMOVER",
    family: "Treinamentos",
    version: "rascunho",
    stage: "DESENVOLVIMENTO",
    truth: "DOCUMENTED_ONLY",
    owner: "Rafael Lamounier",
    updatedAt: "2026-09-09",
    testsDone: 0,
    testsPending: 2,
    evidences: [],
    blockers: ["Conteúdo sem revisão"],
    target: null,
    source: "Documentação viva",
    dependencies: ["Documento mestre de governança"],
    consumers: ["Proprietário", "futuros operadores"],
    risks: ["Ensinar regra desatualizada"],
    requiredTests: ["Revisão de conteúdo", "Avaliação de compreensão"],
    history: [{ at: "2026-09-09", text: "Roteiro iniciado" }],
  },
  {
    id: "LT-PROMPT-0001",
    type: "prompt",
    name: "Cenário de eval — análise de caso do Mapa Vivo",
    family: "Cenários & evals",
    version: "v0.1",
    stage: "IDEIA/CRIAÇÃO",
    truth: "NOT_VERIFIED",
    owner: null,
    updatedAt: "2026-09-13",
    testsDone: 0,
    testsPending: 3,
    evidences: [],
    blockers: ["Sem provider para executar o eval"],
    target: null,
    source: "Router V0.2 / Conselho",
    dependencies: ["LT-PROV-0001"],
    consumers: ["LT-CALL-0001"],
    risks: ["Eval sem baseline não mede nada"],
    requiredTests: ["Baseline", "Critério de aceite", "Repetibilidade"],
    history: [{ at: "2026-09-13", text: "Cenário esboçado" }],
  },
  {
    id: "LT-INT-0001",
    type: "integracao",
    name: "Integração de mensagens ao cliente",
    family: "Integrações",
    version: null,
    stage: "BLOQUEADO",
    truth: "NOT_CONNECTED",
    owner: null,
    updatedAt: "2026-09-15",
    testsDone: 0,
    testsPending: 5,
    evidences: [],
    blockers: ["Nenhum canal (e-mail/WhatsApp/SMS) contratado ou configurado"],
    target: null,
    source: "Cliente 360 > Comunicações",
    dependencies: ["Provedor de mensageria"],
    consumers: ["Central > Clientes"],
    risks: ["Mensagem enviada sem consentimento registrado"],
    requiredTests: ["Envio", "Rejeição", "Registro de evidência"],
    history: [{ at: "2026-09-15", text: "Necessidade registrada pelos fluxos de cliente" }],
  },
  ...ARCH_ITEMS,
];

export interface QueueEntry {
  itemId: string;
  origin: string;
  risk: "baixo" | "médio" | "alto";
}

export const NEXT_VERSION = {
  target: "v0.9.4-candidata",
  planned: "sem data definida",
  entries: [
    { itemId: "LT-BUILD-0001", origin: "Build local do console", risk: "médio" },
    { itemId: "LT-MOD-0001", origin: "Pedido do proprietário", risk: "médio" },
    { itemId: "LT-APP-0001", origin: "Roadmap Wave 1", risk: "alto" },
  ] as QueueEntry[],
};

/** Item está pronto para o gate quando não há blocker e não há teste pendente. */
export function isReady(i: LtItem) {
  return i.blockers.length === 0 && i.testsPending === 0;
}

export const LT_IMPROVE = [
  {
    id: "LT-IMP-0001",
    text: "Cobertura de teste automatizado da build candidata (hoje só typecheck e build).",
    itemId: "LT-BUILD-0001",
  },
  {
    id: "LT-IMP-0002",
    text: "Banco de teste precisa de casos de borda (inadimplência, multi-tenant, volume).",
    itemId: "LT-DATA-0001",
  },
  {
    id: "LT-IMP-0003",
    text: "Fluxos do Cliente 360 precisam de evidência de percurso salva, não só execução manual.",
    itemId: "LT-MOD-0001",
  },
];
