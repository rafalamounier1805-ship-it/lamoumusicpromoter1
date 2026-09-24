import { describe, expect, test } from "bun:test";

import { mapCaseToCoreFacts } from "../src/lib/lamou/core-case-facts";
import type { CaseExtra, CaseNode } from "../src/lib/lamou/types";

const caseNode: CaseNode = {
  id: "CASO-T",
  title: "Teste",
  district: "CORE",
  layer: "padrao",
  x: 10,
  y: 20,
  severity: "critico",
  occurrence: true,
  stage: "sinal",
  classification: "teste",
  origin: "Observabilidade",
  signal: "latência alta",
  description: "Sinal factual",
  evidences: [],
  metrics: [{ label: "p95", value: "2.9s", demo: true }],
  actors: [],
  hypotheses: ["não deve atravessar"],
  probability: null,
  history: [],
  destination: null,
  owner: "Rafa",
};

const extra: CaseExtra = {
  source: {
    sourceId: "SRC-T",
    sourceSystem: "Telemetry",
    sourceType: "telemetria",
    module: "Gateway",
    collectedAt: "2026-09-15 18:00",
    updatedAt: "2026-09-15 18:00",
    freshness: "demo",
    truthState: "SYNTHETIC_DEMO",
    evidenceIds: [],
  },
  problem: {
    statement: "problema técnico não deve ser inferido no transporte",
    entity: "Gateway",
    knownImpact: "demo",
    unverifiedImpact: "não verificado",
    owner: null,
  },
  benchmarks: [],
  ai: {
    providerStatus: "NOT_CONNECTED",
    hypotheses: ["hipótese externa"],
    evidenceIds: [],
    confidence: null,
    method: null,
    limitations: [],
  },
};

describe("Mapa Vivo → CORE fact contract", () => {
  test("transporta somente fatos permitidos e proveniência", () => {
    expect(mapCaseToCoreFacts(caseNode, extra)).toEqual({
      case_id: "CASO-T",
      timestamp: "2026-09-15 18:00",
      metrics: [{ label: "p95", value: "2.9s", demo: true }],
      severity: "critico",
      origin: "Observabilidade",
      responsible: "Rafa",
      affected_entity: "Gateway",
      source_id: "SRC-T",
      source_system: "Telemetry",
      truth_state: "SYNTHETIC_DEMO",
    });
  });

  test("não transfere hipótese ou análise de IA", () => {
    const facts = mapCaseToCoreFacts(caseNode, extra) as Record<string, unknown>;
    expect("hypothesis" in facts).toBe(false);
    expect("hypotheses" in facts).toBe(false);
    expect("ai" in facts).toBe(false);
  });
});
