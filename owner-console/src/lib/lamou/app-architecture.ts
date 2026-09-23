/**
 * Reconciliation registry for the 2026-09-23 Owner candidate.
 *
 * Governing rule: an application is never broken apart, absorbed or recreated by
 * Central/CORE/LABTEST. Central organizes and links. CORE may provide technical
 * capabilities only when a binding is explicit. LABTEST validates candidates.
 * The application's own source remains its source of truth.
 */

export type ArchitectureState =
  | "BUNDLED_CANDIDATE"
  | "APPROVED_REFERENCE"
  | "OFFICIAL_APPROVED"
  | "CANDIDATE_NOT_PROMOTED"
  | "DOCUMENTED_ONLY"
  | "RECONCILIATION_REQUIRED"
  | "SOURCE_NOT_FOUND";

export type Availability = "BUNDLED_ROUTE" | "EXTERNAL_SOURCE_REFERENCE" | "CATALOG_ONLY";

export type ArchitectureEntityKind =
  | "app"
  | "module"
  | "system-surface"
  | "tool";

export interface AppArchitectureNode {
  key: string;
  kind: ArchitectureEntityKind;
  canonicalId: string | null;
  name: string;
  aliases: string[];
  domain:
    | "research"
    | "commercial"
    | "diagnostic"
    | "operations"
    | "projects"
    | "process"
    | "people"
    | "quality"
    | "validation"
    | "documents"
    | "observability";
  role: string;
  state: ArchitectureState;
  availability: Availability;
  route: string | null;
  sourceOfTruth: string;
  newSinceV75: boolean;
  preservesFullScope: true;
}

export const APP_ARCHITECTURE_NODES: AppArchitectureNode[] = [
  {
    key: "research-scout",
    kind: "app",
    canonicalId: "APP-034",
    name: "LAMOU Research Scout",
    aliases: ["Research Scout"],
    domain: "research",
    role: "Capturar sinais/fontes e produzir evidência pesquisável.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/research-scout",
    sourceOfTruth: "Owner Console candidate route + APP-034 lineage",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "benchmarker",
    kind: "app",
    canonicalId: null,
    name: "Benchmarker",
    aliases: [],
    domain: "research",
    role: "Comparar alternativas, baseline e deltas sem tomar a decisão pelo usuário.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/benchmarker",
    sourceOfTruth: "Owner Console candidate route; canonical APP-ID pending reconciliation",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "opportunity-intelligence",
    kind: "app",
    canonicalId: null,
    name: "Opportunity Intelligence",
    aliases: ["Radar de Oportunidades"],
    domain: "commercial",
    role: "Transformar sinais qualificados em oportunidade com origem, hipótese, evidência, fit e risco.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/opportunity-intelligence",
    sourceOfTruth: "Owner Console candidate route; canonical APP-ID pending reconciliation",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "diagnostico-360",
    kind: "app",
    canonicalId: "APP-011",
    name: "LAMOU IA — Diagnóstico 360",
    aliases: ["Diagnóstico 360"],
    domain: "diagnostic",
    role: "Entender problema, contexto, causa candidata, evidência e recomendação.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/diagnostico-360",
    sourceOfTruth: "APP-011 + Owner Console candidate route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "showroom",
    kind: "app",
    canonicalId: "APP-029",
    name: "LAMOU Showroom",
    aliases: ["Showroom"],
    domain: "commercial",
    role: "Apresentar solução/produto, prova, comparação, proposta e roadmap ao prospect.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/showroom",
    sourceOfTruth: "APP-029 + Owner Console candidate route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "digital-improvement",
    kind: "app",
    canonicalId: "APP-012",
    name: "LAMOU Digital Improvement",
    aliases: [],
    domain: "operations",
    role: "Converter diagnóstico em melhoria rastreável: baseline → gap → causa → ação → eficácia.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/digital-improvement",
    sourceOfTruth: "APP-012 + Owner Console candidate route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "meeting-architect",
    kind: "app",
    canonicalId: "APP-030",
    name: "LAMOU Diagnostic / Meeting Architect",
    aliases: ["Meeting Architect"],
    domain: "operations",
    role: "Preparar pauta, registrar evidência, decisão, autoridade, aprovações, compromissos e follow-up.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/meeting-architect",
    sourceOfTruth: "APP-030 + Owner Console candidate route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "orbit",
    kind: "app",
    canonicalId: "APP-007",
    name: "Orbit / Agenda / LifeOS",
    aliases: ["Orbite", "LAMOU Agenda", "LAMOU LifeOS"],
    domain: "operations",
    role: "Agenda, rotina, reuniões, compromissos e diário operacional; camada de acompanhamento transversal.",
    state: "RECONCILIATION_REQUIRED",
    availability: "BUNDLED_ROUTE",
    route: "/apps/orbit",
    sourceOfTruth: "APP-007 lineage; APP-001/LifeOS overlap must remain explicit until reconciled",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "plano-acao",
    kind: "module",
    canonicalId: null,
    name: "Plano de Ação",
    aliases: ["Plano de Ação & Melhorias"],
    domain: "operations",
    role: "Módulo de ação/eficácia. Não contar como aplicativo independente sem decisão explícita.",
    state: "DOCUMENTED_ONLY",
    availability: "CATALOG_ONLY",
    route: null,
    sourceOfTruth: "Architecture decision 2026-09-23 + DOC-MOD-006 V1.1; standalone source not materialized in this repo",
    newSinceV75: true,
    preservesFullScope: true,
  },
  {
    key: "project-prime",
    kind: "app",
    canonicalId: null,
    name: "PROJECT PRIME MASTER V1",
    aliases: ["PROJECT", "Project Prime"],
    domain: "projects",
    role: "Sistema operacional e de conhecimento de projetos; recebe conjuntos complexos de ações e implantações.",
    state: "APPROVED_REFERENCE",
    availability: "EXTERNAL_SOURCE_REFERENCE",
    route: null,
    sourceOfTruth: "Approved external package PROJECT PRIME MASTER V1 (2026-09-20)",
    newSinceV75: true,
    preservesFullScope: true,
  },
  {
    key: "processo",
    kind: "app",
    canonicalId: null,
    name: "LAMOU App Processo",
    aliases: ["Processo"],
    domain: "process",
    role: "Aplicativo completo de engenharia de processos ponta a ponta: processo → atividade → A→B → pessoas/cargos → equipamentos → competências → medição → evidência.",
    state: "CANDIDATE_NOT_PROMOTED",
    availability: "EXTERNAL_SOURCE_REFERENCE",
    route: null,
    sourceOfTruth: "APP_PROCESSO V0.3 candidate + master spec V0.1",
    newSinceV75: true,
    preservesFullScope: true,
  },
  {
    key: "meu-desenvolvimento",
    kind: "app",
    canonicalId: null,
    name: "LAMU IA — Meu Desenvolvimento v1 COMPLETO",
    aliases: ["Meu Desenvolvimento"],
    domain: "people",
    role: "Aplicativo do colaborador para desenvolvimento, ações, evolução, competências, PDI, aprendizagem e evidências.",
    state: "APPROVED_REFERENCE",
    availability: "EXTERNAL_SOURCE_REFERENCE",
    route: null,
    sourceOfTruth: "Approved external app baseline (2026-09-20)",
    newSinceV75: true,
    preservesFullScope: true,
  },
  {
    key: "app-observer-360",
    kind: "app",
    canonicalId: null,
    name: "APP Observer 360 V2",
    aliases: ["Observer 360", "Aplicativo de Observação"],
    domain: "observability",
    role: "Aplicativo transversal de observação de aplicativos: estrutura, uso, erros/crashes, disponibilidade, rede/APIs, segurança, tracing, versão, backup e atualização. Não confundir com CORE Observabilidade.",
    state: "CANDIDATE_NOT_PROMOTED",
    availability: "EXTERNAL_SOURCE_REFERENCE",
    route: null,
    sourceOfTruth: "APP_OBSERVER_360_EXECUTAVEL.html + COMECO_123_v1.3.1_APP_OBSERVER_360_CANDIDATE.zip (2026-09-23)",
    newSinceV75: true,
    preservesFullScope: true,
  },
  {
    key: "certificacoes",
    kind: "app",
    canonicalId: null,
    name: "Certificações",
    aliases: [],
    domain: "people",
    role: "Aplicativo completo de certificações: requisitos, elegibilidade, avaliação, emissão/registro, validade/renovação, evidências e histórico.",
    state: "RECONCILIATION_REQUIRED",
    availability: "EXTERNAL_SOURCE_REFERENCE",
    route: null,
    sourceOfTruth: "Identidade/escopo confirmados em arquitetura; APP-ID/source/version a reconciliar",
    newSinceV75: true,
    preservesFullScope: true,
  },
  {
    key: "teste3",
    kind: "app",
    canonicalId: "APP-010",
    name: "Teste³ IA",
    aliases: [],
    domain: "quality",
    role: "Executor de testes/casos/cenários, scoring, evidências, reteste e avaliação técnica.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/teste3",
    sourceOfTruth: "APP-010 + Owner Console candidate route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "lab",
    kind: "system-surface",
    canonicalId: null,
    name: "LAMOU Lab",
    aliases: ["LABTEST"],
    domain: "quality",
    role: "Laboratório de experimentos, comparação, métricas, cenários e consolidação de evidências.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/lab",
    sourceOfTruth: "LAMOU Lab candidate lineage + Owner Console route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "validation-gate",
    kind: "app",
    canonicalId: null,
    name: "Validation Gate",
    aliases: ["Validação"],
    domain: "validation",
    role: "Aplicativo de validação: recebe evidence pack, aplica gates/contratos e registra decisão de validação sem executar silenciosamente o teste nem promover automaticamente.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/validation-gate",
    sourceOfTruth: "Owner Console candidate route + validation contract lineage",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "version",
    kind: "app",
    canonicalId: "APP-LAMOU-VERSION",
    name: "LAMOU Version",
    aliases: ["Version"],
    domain: "documents",
    role: "Versionamento, builds, CURRENT/PINNED, histórico, deduplicação, rollback e lineage.",
    state: "BUNDLED_CANDIDATE",
    availability: "BUNDLED_ROUTE",
    route: "/apps/version",
    sourceOfTruth: "LAMOU Version V0.6 lineage + Owner Console candidate route",
    newSinceV75: false,
    preservesFullScope: true,
  },
  {
    key: "vectra-v4",
    kind: "app",
    canonicalId: null,
    name: "VECTRA Intelligence 360 V4 — Mapa Vivo",
    aliases: ["VECTRA V4", "BELGO/VECTRA lineage"],
    domain: "observability",
    role: "Mapa Vivo por área/equipamento com indicadores e estados; referência operacional aprovada.",
    state: "OFFICIAL_APPROVED",
    availability: "EXTERNAL_SOURCE_REFERENCE",
    route: null,
    sourceOfTruth: "VECTRA Intelligence 360 V4 official manifest",
    newSinceV75: true,
    preservesFullScope: true,
  },
];

export interface FlowEdge {
  id: string;
  lane: "commercial" | "operations" | "people" | "quality" | "governance";
  from: string;
  to: string;
  event: string;
  payload: string[];
  condition: string;
  truth: "CONTRACT" | "IMPLEMENTED_NOT_VERIFIED" | "REFERENCE";
}

export const APP_FLOW_EDGES: FlowEdge[] = [
  {
    id: "FLOW-COM-01",
    lane: "commercial",
    from: "research-scout",
    to: "benchmarker",
    event: "signal_collected",
    payload: ["source_id", "signal_id", "evidence_ids", "freshness"],
    condition: "sinal possui fonte/proveniência",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-COM-02",
    lane: "commercial",
    from: "benchmarker",
    to: "opportunity-intelligence",
    event: "comparison_completed",
    payload: ["baseline", "alternatives", "delta", "evidence_ids"],
    condition: "comparação tem critério e referência",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-COM-03",
    lane: "commercial",
    from: "opportunity-intelligence",
    to: "diagnostico-360",
    event: "opportunity_qualified",
    payload: ["opportunity_id", "problem", "hypothesis", "fit", "risk", "evidence_ids"],
    condition: "oportunidade exige entendimento do problema/contexto antes de propor solução",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-COM-04",
    lane: "commercial",
    from: "diagnostico-360",
    to: "showroom",
    event: "diagnosis_ready_for_solution",
    payload: ["diagnosis_id", "needs", "constraints", "evidence_ids", "recommended_scope"],
    condition: "diagnóstico possui evidência suficiente para demonstrar solução relevante",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-COM-05",
    lane: "commercial",
    from: "showroom",
    to: "CENTRAL:commercial",
    event: "proposal_ready",
    payload: ["solution_scope", "proposal_inputs", "roadmap", "evidence_ids"],
    condition: "prospect solicita proposta/negociação",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-COM-06",
    lane: "commercial",
    from: "CENTRAL:commercial",
    to: "CENTRAL:clients",
    event: "contract_approved",
    payload: ["contract_id", "entitlements", "consents", "client_identity"],
    condition: "contrato e autorizações válidos",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-COM-07",
    lane: "commercial",
    from: "CENTRAL:clients",
    to: "project-prime",
    event: "implementation_requested",
    payload: ["client_id", "contract_id", "scope", "milestones", "acceptance_criteria"],
    condition: "implantação requer projeto",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-01",
    lane: "operations",
    from: "diagnostico-360",
    to: "digital-improvement",
    event: "improvement_candidate",
    payload: ["diagnosis_id", "baseline", "gap", "candidate_causes", "evidence_ids"],
    condition: "problema pede melhoria estruturada",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-02",
    lane: "operations",
    from: "digital-improvement",
    to: "meeting-architect",
    event: "decision_required",
    payload: ["case_id", "options", "risks", "evidence_ids", "authority_required"],
    condition: "ação depende de decisão, autoridade ou múltiplos OKs",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-03",
    lane: "operations",
    from: "meeting-architect",
    to: "plano-acao",
    event: "decision_approved",
    payload: ["decision_id", "approvers", "authority_level", "action_scope", "evidence_ids"],
    condition: "decisão tem autoridade/approvals exigidos",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-04",
    lane: "operations",
    from: "meeting-architect",
    to: "orbit",
    event: "follow_up_created",
    payload: ["meeting_id", "commitments", "owners", "dates", "decision_ids"],
    condition: "há compromissos/rituais/follow-up",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-05",
    lane: "operations",
    from: "plano-acao",
    to: "project-prime",
    event: "escalate_to_project",
    payload: ["action_plan_id", "workstreams", "dependencies", "owners", "evidence_ids"],
    condition: "conjunto de ações exige cronograma, dependências, orçamento ou múltiplas frentes",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-06",
    lane: "operations",
    from: "project-prime",
    to: "processo",
    event: "process_change_required",
    payload: ["project_id", "scope", "process_ids", "acceptance_criteria"],
    condition: "projeto altera processo/operação",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OPS-07",
    lane: "operations",
    from: "processo",
    to: "plano-acao",
    event: "process_gap_or_nonconformity",
    payload: ["process_id", "activity_id", "gap", "risk", "metric_ids", "evidence_ids"],
    condition: "gap exige ação corretiva/preventiva/melhoria",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-PPL-01",
    lane: "people",
    from: "processo",
    to: "meu-desenvolvimento",
    event: "competency_gap_identified",
    payload: ["person_id", "role_id", "competency_id", "gap", "required_evidence", "process_id"],
    condition: "fator humano é hipótese/evidência de competência, nunca culpa automática",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-PPL-02",
    lane: "people",
    from: "meu-desenvolvimento",
    to: "processo",
    event: "competency_evidence_ready",
    payload: ["person_id", "competency_id", "training_id", "evidence_ids", "effectiveness"],
    condition: "desenvolvimento concluído com evidência de aplicação",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-PPL-03",
    lane: "people",
    from: "processo",
    to: "certificacoes",
    event: "certification_requirement_identified",
    payload: ["process_id", "activity_id", "role_id", "certification_requirement", "person_id", "evidence_ids"],
    condition: "atividade/processo exige certificação formal ou vigente",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-PPL-04",
    lane: "people",
    from: "meu-desenvolvimento",
    to: "certificacoes",
    event: "certification_path_requested",
    payload: ["person_id", "role_id", "competency_id", "certification_requirement", "evidence_ids"],
    condition: "PDI/trilha identifica certificação como requisito de desenvolvimento",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-PPL-05",
    lane: "people",
    from: "certificacoes",
    to: "meu-desenvolvimento",
    event: "certification_status_changed",
    payload: ["person_id", "certification_id", "status", "issued_at", "expires_at", "evidence_ids"],
    condition: "certificação emitida, renovada, vencida, suspensa ou atualizada",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-PPL-06",
    lane: "people",
    from: "certificacoes",
    to: "processo",
    event: "certification_evidence_ready",
    payload: ["person_id", "process_id", "activity_id", "certification_id", "status", "evidence_ids"],
    condition: "processo precisa comprovar habilitação/certificação vigente",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-QLT-01",
    lane: "quality",
    from: "plano-acao",
    to: "teste3",
    event: "effectiveness_test_requested",
    payload: ["action_plan_id", "expected_result", "baseline", "acceptance_criteria", "evidence_ids"],
    condition: "ação executada; eficácia ainda não comprovada",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-QLT-02",
    lane: "quality",
    from: "project-prime",
    to: "teste3",
    event: "acceptance_test_requested",
    payload: ["project_id", "deliverable_id", "acceptance_criteria", "evidence_ids"],
    condition: "entrega está pronta para aceitação",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-QLT-03",
    lane: "quality",
    from: "processo",
    to: "teste3",
    event: "process_validation_requested",
    payload: ["process_id", "metric_ids", "baseline", "target", "method"],
    condition: "mudança de processo precisa ser validada",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-QLT-04",
    lane: "quality",
    from: "teste3",
    to: "lab",
    event: "test_run_completed",
    payload: ["test_run_id", "result", "metrics", "evidence_ids", "retest_required"],
    condition: "execução registrada com evidência",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-QLT-05",
    lane: "quality",
    from: "lab",
    to: "validation-gate",
    event: "evidence_pack_ready",
    payload: ["target_id", "baseline", "results", "evidence_ids", "limitations", "open_risks"],
    condition: "evidence pack possui cobertura mínima definida",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-GOV-01",
    lane: "governance",
    from: "validation-gate",
    to: "version",
    event: "promotion_decision_recorded",
    payload: ["candidate_id", "gate_result", "evidence_ids", "approver", "decision"],
    condition: "gate e aprovação humana permitem avanço; SALVAR ≠ PROMOVER",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-GOV-02",
    lane: "governance",
    from: "version",
    to: "CENTRAL:documents",
    event: "version_documented",
    payload: ["version_id", "commit", "build", "hash", "current_or_pinned", "evidence_ids"],
    condition: "nova versão/rollback altera documentação viva",
    truth: "CONTRACT",
  },
  {
    id: "FLOW-OBS-02",
    lane: "operations",
    from: "app-observer-360",
    to: "diagnostico-360",
    event: "application_anomaly_detected",
    payload: [
      "observed_app_id",
      "version_id",
      "metric_ids",
      "error_or_signal",
      "affected_scope",
      "trace_ids",
      "evidence_ids",
    ],
    condition: "anomalia possui observação/proveniência suficiente; Observer sinaliza e correlaciona, Diagnóstico investiga causa",
    truth: "REFERENCE",
  },
  {
    id: "FLOW-OBS-01",
    lane: "operations",
    from: "vectra-v4",
    to: "diagnostico-360",
    event: "operational_signal_detected",
    payload: ["area_id", "equipment_id", "metric_id", "signal", "timestamp", "evidence_ids"],
    condition: "sinal exige diagnóstico; mapa não inventa causa",
    truth: "REFERENCE",
  },
];

export const OWNER_MODULE_ORDER = [
  "Cognitive / Cockpit",
  "Mapa Vivo",
  "Aplicativos & Produtos",
  "Clientes",
  "Comercial & Contratos",
  "Oportunidades",
  "Projetos & Ações",
  "Testes & Qualidade",
  "Documentos",
  "Segurança & Acessos",
  "Versões",
  "Integrações",
  "Configurações",
] as const;

export interface DuplicationDecision {
  id: string;
  items: string[];
  decision: "SAME_LINEAGE_RECONCILE" | "DISTINCT_KEEP_SEPARATE" | "POTENTIAL_OVERLAP_REVIEW";
  rule: string;
}

export const DUPLICATION_RECONCILIATION: DuplicationDecision[] = [
  {
    id: "DUP-001",
    items: ["APP-001 LAMOU LifeOS", "APP-007 LAMOU Agenda / LifeOS", "Orbit / Agenda / LifeOS"],
    decision: "SAME_LINEAGE_RECONCILE",
    rule: "Não apagar nem duplicar. Preservar aliases e reconciliar identidade/versionamento canônico.",
  },
  {
    id: "DUP-002",
    items: ["APP-025 Metraction 360", "LAMOU PUSH 360"],
    decision: "SAME_LINEAGE_RECONCILE",
    rule: "Tratar PUSH como evolução/alias de linhagem até decisão formal de identidade.",
  },
  {
    id: "DUP-003",
    items: ["BELGO Intelligence 360", "VECTRA Intelligence 360 V4"],
    decision: "SAME_LINEAGE_RECONCILE",
    rule: "Preservar proveniência e mudança de identidade; não contar como dois produtos independentes sem evidência.",
  },
  {
    id: "DUP-004",
    items: ["A-MuDoc", "MuDoc"],
    decision: "SAME_LINEAGE_RECONCILE",
    rule: "Reconciliar APP-ID/nome e manter uma única fonte de verdade documental.",
  },
  {
    id: "DUP-005",
    items: ["Diagnóstico 360", "Diagnostic / Meeting Architect"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Diagnóstico investiga problema; Meeting Architect governa pauta/decisão/follow-up.",
  },
  {
    id: "DUP-006",
    items: ["Teste³ IA", "LAMOU Lab", "Validation Gate"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Teste³ executa; Lab consolida/experimenta; Validation Gate decide passagem por evidência.",
  },
  {
    id: "DUP-007",
    items: ["Plano de Ação", "PROJECT PRIME MASTER V1"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Plano executa ação/eficácia; PROJECT governa empreendimento complexo. Plano pode escalar para Projeto.",
  },
  {
    id: "DUP-008",
    items: ["LAMU IA — Meu Desenvolvimento", "Gestão de Pessoas/RH/T&D"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Meu Desenvolvimento é app do colaborador; RH/T&D é camada administrativa. Compartilham a ficha única da pessoa, não a interface.",
  },
  {
    id: "DUP-009",
    items: ["LAMOU App Processo", "LAMOU Digital Improvement"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Processo é engenharia/medição do processo; Digital Improvement gerencia diagnóstico→melhoria→eficácia.",
  },
  {
    id: "DUP-010",
    items: ["LAMOU Version", "Documento Central / Documentos Vivos"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Version governa versão/linhagem/build; Documentos governa conteúdo, fonte, CURRENT/PINNED e acesso.",
  },
  {
    id: "DUP-012",
    items: ["APP Observer 360", "CORE > Observabilidade"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Observer 360 é aplicativo transversal de observação/diagnóstico; CORE Observabilidade é superfície técnica do runtime CORE. Podem compartilhar telemetria por contrato, mas um não absorve o outro.",
  },
  {
    id: "DUP-011",
    items: ["LAMOU Showroom", "Central > Comercial & Contratos"],
    decision: "DISTINCT_KEEP_SEPARATE",
    rule: "Showroom demonstra solução; Comercial administra pipeline, proposta, negociação, contrato e entitlement.",
  },
];

export const NEW_SINCE_V75 = APP_ARCHITECTURE_NODES.filter((app) => app.newSinceV75);


/** Somente entidades explicitamente classificadas como aplicativo entram no catálogo de Apps. */
export const CONFIRMED_APP_ENTITIES = APP_ARCHITECTURE_NODES.filter(
  (item) => item.kind === "app",
);

export const NON_APP_ARCHITECTURE_ENTITIES = APP_ARCHITECTURE_NODES.filter(
  (item) => item.kind !== "app",
);


export interface ClassificationHoldItem {
  name: string;
  observedArtifact: string;
  provisionalKind: "tool-or-utility" | "security-utility" | "unknown";
  reason: string;
  includeInAppsCatalog: false;
}

export const CLASSIFICATION_HOLD: ClassificationHoldItem[] = [
  {
    name: "LAMOU Shield Local",
    observedArtifact: "LAMOU_SHIELD_LOCAL_V1_2_1.zip",
    provisionalKind: "security-utility",
    reason: "Executável/pacote localizado, mas não há decisão suficiente nesta reconciliação para tratá-lo como aplicativo do portfólio.",
    includeInAppsCatalog: false,
  },
  {
    name: "LAMOU Computer Scan",
    observedArtifact: "LAMOU_COMPUTER_SCAN_V1_2.zip",
    provisionalKind: "tool-or-utility",
    reason: "Scanner/utilitário localizado; excluir do catálogo de Apps até classificação explícita.",
    includeInAppsCatalog: false,
  },
  {
    name: "Confidential Guardian",
    observedArtifact: "CONFIDENTIAL_GUARDIAN_V0_1_CANDIDATE.zip",
    provisionalKind: "security-utility",
    reason: "Candidata de segurança localizada; não classificar automaticamente como aplicativo.",
    includeInAppsCatalog: false,
  },
];


export type AppLockState = "LOCKED_APP_IDENTITY_SCOPE";

export interface AppLockRecord {
  appKey: string;
  appName: string;
  lockState: AppLockState;
  lockedDimensions: readonly [
    "classification",
    "identity",
    "full_scope",
    "source_of_truth",
    "lineage_aliases",
  ];
  rule: string;
}

/**
 * APP LOCK:
 * locks application identity/scope inside the LAMOU architecture.
 * It does NOT promote a candidate version and does NOT turn catalog presence into a real binding.
 */
export const APP_LOCK_REGISTRY: AppLockRecord[] = CONFIRMED_APP_ENTITIES.map((app) => ({
  appKey: app.key,
  appName: app.name,
  lockState: "LOCKED_APP_IDENTITY_SCOPE",
  lockedDimensions: [
    "classification",
    "identity",
    "full_scope",
    "source_of_truth",
    "lineage_aliases",
  ] as const,
  rule:
    "Aplicativo permanece inteiro dentro do LAMOU; não fragmentar, absorver, recriar como módulo ou fundir por similaridade. Mudança de classificação/identidade exige decisão explícita. SALVAR ≠ PROMOVER.",
}));
