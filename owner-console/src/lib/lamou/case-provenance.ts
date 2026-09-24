import type { CaseExtra } from "./types";

/**
 * Proveniência, problema, benchmark e estado de IA por caso.
 * Todos os valores são fixtures locais: SYNTHETIC_DEMO.
 * Nenhuma URL externa, nenhum benchmark real e nenhum provider de IA conectado.
 */
const AI_OFFLINE = {
  providerStatus: "NOT_CONNECTED" as const,
  evidenceIds: [] as string[],
  confidence: null,
  method: null,
  limitations: [
    "Provider de IA não configurado no CORE Owner.",
    "Sem provider não há inferência: nenhuma resposta é simulada.",
  ],
};

export const CASE_EXTRAS: Record<string, CaseExtra> = {
  "CASO-0001": {
    source: {
      sourceId: "SRC-CORE-TELEMETRY-001",
      sourceSystem: "LAMOU CORE Owner — Observabilidade",
      sourceType: "telemetria",
      module: "CORE Padrão / Gateway de IA",
      collectedAt: "2026-09-05 08:12",
      updatedAt: "2026-09-07 19:40",
      freshness: "amostra sintética, sem coleta contínua",
      truthState: "SYNTHETIC_DEMO",
      evidenceIds: ["EV-e1", "EV-e2"],
    },
    problem: {
      statement:
        "Latência do caminho de inferência sobe de forma sustentada em janelas consecutivas.",
      entity: "CORE Padrão — Gateway de IA",
      knownImpact: "Resposta mais lenta em telas que dependem de inferência (DEMO).",
      unverifiedImpact: "Impacto em clientes e em custo por chamada ainda não verificado.",
      owner: null,
    },
    benchmarks: [
      {
        label: "Latência p95 (gerencial)",
        baseline: "1,2 s (DEMO)",
        current: "2,9 s (DEMO)",
        reference: null,
        target: "≤ 1,5 s (meta interna DEMO)",
        delta: "+1,7 s",
        truthState: "SYNTHETIC_DEMO",
      },
      {
        label: "Custo por chamada",
        baseline: null,
        current: null,
        reference: null,
        target: null,
        delta: null,
        truthState: "NOT_VERIFIED",
      },
      {
        label: "Disponibilidade do provider",
        baseline: null,
        current: null,
        reference: null,
        target: null,
        delta: null,
        truthState: "NOT_CONNECTED",
      },
    ],
    ai: {
      ...AI_OFFLINE,
      hypotheses: ["Fila do provider", "Payload maior que o previsto", "Retry mal calibrado"],
    },
  },
  "CASO-0002": {
    source: {
      sourceId: "SRC-SNAPSHOT-DIFF-014",
      sourceSystem: "CORE Cubo — Cubo Fantasma",
      sourceType: "comparação de snapshot",
      module: "Versões / Gate de promoção",
      collectedAt: "2026-09-08 06:30",
      updatedAt: "2026-09-08 06:30",
      freshness: "comparação única, sem rotina agendada",
      truthState: "SYNTHETIC_DEMO",
      evidenceIds: ["EV-e3"],
    },
    problem: {
      statement: "Hash divergente em artefato que deveria estar congelado na baseline FROZEN.",
      entity: "Baseline FROZEN × candidata",
      knownImpact: "Promoção bloqueada até evidência conclusiva.",
      unverifiedImpact: "Origem da escrita fora do fluxo ainda não verificada.",
      owner: null,
    },
    benchmarks: [
      {
        label: "Artefatos divergentes",
        baseline: "0",
        current: "2 (DEMO)",
        reference: "0 divergências em baseline congelada",
        target: "0",
        delta: "+2",
        truthState: "SYNTHETIC_DEMO",
      },
      {
        label: "Determinismo de build",
        baseline: null,
        current: null,
        reference: null,
        target: null,
        delta: null,
        truthState: "NOT_VERIFIED",
      },
    ],
    ai: { ...AI_OFFLINE, hypotheses: ["Escrita fora do fluxo", "Build não determinístico"] },
  },
  "CASO-0003": {
    source: {
      sourceId: "SRC-DEPLOY-CHECK-MERIDIANO",
      sourceSystem: "Central Owner — Clientes",
      sourceType: "checklist",
      module: "Clientes / Implantação",
      collectedAt: "2026-09-06 14:05",
      updatedAt: "2026-09-06 14:05",
      freshness: "marcação manual, sem integração de storage",
      truthState: "SYNTHETIC_DEMO",
      evidenceIds: ["EV-e4"],
    },
    problem: {
      statement: "Etapa de storage isolado sem confirmação há 3 ciclos.",
      entity: "Cliente Meridiano (DEMO)",
      knownImpact: "Implantação parada; cliente não avança para ativação.",
      unverifiedImpact: "Efeito contratual e de prazo ainda não verificado.",
      owner: "Equipe de implantação (DEMO)",
    },
    benchmarks: [
      {
        label: "Ciclos parados",
        baseline: "0",
        current: "3 (DEMO)",
        reference: null,
        target: "≤ 1",
        delta: "+3",
        truthState: "SYNTHETIC_DEMO",
      },
      {
        label: "Clientes impactados",
        baseline: null,
        current: "1 (DEMO)",
        reference: null,
        target: "0",
        delta: null,
        truthState: "SYNTHETIC_DEMO",
      },
    ],
    ai: { ...AI_OFFLINE, hypotheses: ["Falta de política de bucket", "Pendência contratual"] },
  },
  "CASO-0004": {
    source: {
      sourceId: "SRC-ASSET-REVIEW-2026-09",
      sourceSystem: "Central Owner — Biblioteca Visual",
      sourceType: "revisão",
      module: "Biblioteca Visual",
      collectedAt: "2026-09-02 10:20",
      updatedAt: "2026-09-02 10:20",
      freshness: "revisão pontual",
      truthState: "SYNTHETIC_DEMO",
      evidenceIds: ["EV-e5"],
    },
    problem: {
      statement: "Ícones antigos com identificação dentro da área de recorte.",
      entity: "Família de ícones de módulo",
      knownImpact: "Inconsistência visual entre telas.",
      unverifiedImpact: "Quantidade real de telas afetadas não verificada.",
      owner: null,
    },
    benchmarks: [
      {
        label: "Ícones fora do padrão",
        baseline: "0",
        current: "5 (DEMO)",
        reference: "guia de recorte versionado",
        target: "0",
        delta: "+5",
        truthState: "SYNTHETIC_DEMO",
      },
    ],
    ai: { ...AI_OFFLINE, hypotheses: ["Falta de guia de recorte versionado"] },
  },
  "CASO-0005": {
    source: {
      sourceId: "SRC-TESTE3-RUN-0442",
      sourceSystem: "Teste³ IA (runner não conectado)",
      sourceType: "execução de teste",
      module: "Testes & Qualidade",
      collectedAt: "2026-09-04 22:11",
      updatedAt: "2026-09-04 22:11",
      freshness: "execução simulada",
      truthState: "SIMULATED",
      evidenceIds: ["EV-e6"],
    },
    problem: {
      statement: "Reprovação de teste sem reprodução manual — suspeita de falso positivo.",
      entity: "Suite de integração (DEMO)",
      knownImpact: "Confiabilidade do resultado de teste em dúvida.",
      unverifiedImpact: "Se há defeito real no alvo, permanece não verificado.",
      owner: null,
    },
    benchmarks: [
      {
        label: "Reproduções",
        baseline: "3/3 esperado",
        current: "0/3 (DEMO)",
        reference: null,
        target: "3/3",
        delta: "-3",
        truthState: "SIMULATED",
      },
    ],
    ai: { ...AI_OFFLINE, hypotheses: ["Ambiente sujo", "Timeout curto"] },
  },
  "CASO-0006": {
    source: {
      sourceId: "SRC-DRILL-SCHEDULE-CAL",
      sourceSystem: "CORE Cubo — Caleidoscópio",
      sourceType: "rotina",
      module: "Resiliência / Cenários",
      collectedAt: "2026-09-01 09:00",
      updatedAt: "2026-09-01 09:00",
      freshness: "sem drill dentro da janela definida",
      truthState: "SYNTHETIC_DEMO",
      evidenceIds: [],
    },
    problem: {
      statement: "Cenário de resiliência adormecido sem revalidação.",
      entity: "Cenário Caleidoscópio (LUA)",
      knownImpact: "Cenário não pode ser considerado confiável.",
      unverifiedImpact: "Comportamento em falha real permanece não verificado.",
      owner: null,
    },
    benchmarks: [
      {
        label: "Dias sem drill",
        baseline: "≤ 30",
        current: "62 (DEMO)",
        reference: null,
        target: "≤ 30",
        delta: "+32",
        truthState: "SYNTHETIC_DEMO",
      },
    ],
    ai: { ...AI_OFFLINE, hypotheses: ["Janela de drill não agendada"] },
  },
};

const FALLBACK: CaseExtra = {
  source: {
    sourceId: "SRC-NÃO-REGISTRADA",
    sourceSystem: "fonte não registrada",
    sourceType: "relato",
    module: "não informado",
    collectedAt: "—",
    updatedAt: "—",
    freshness: "sem coleta registrada",
    truthState: "NOT_VERIFIED",
    evidenceIds: [],
  },
  problem: {
    statement: "Problema ainda não estruturado.",
    entity: "não informado",
    knownImpact: "nenhum impacto confirmado",
    unverifiedImpact: "impacto ainda não verificado",
    owner: null,
  },
  benchmarks: [],
  ai: { ...AI_OFFLINE, hypotheses: [] },
};

export function caseExtra(caseId: string): CaseExtra {
  return CASE_EXTRAS[caseId] ?? FALLBACK;
}
