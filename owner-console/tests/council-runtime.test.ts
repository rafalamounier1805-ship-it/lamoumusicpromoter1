import { describe, expect, test } from "bun:test";

import { COUNCIL_RUNS_SEED, PROFESSIONAL_ROLES } from "../src/lib/lamou/council-data";
import {
  COUNCIL_PIPELINE,
  effectiveCouncilRunTruth,
  planCouncilRun,
} from "../src/lib/lamou/council-runtime";

describe("Council runtime governance", () => {
  test("mantém a pipeline canônica auditável", () => {
    expect(COUNCIL_PIPELINE.map((stage) => stage.label)).toEqual([
      "Council Intake",
      "Context / Evidence Retriever",
      "Professional Router",
      "Permission / Tool Resolver",
      "Specialist Runs",
      "Contraditor / Red Team",
      "Synthesis",
      "Validation / Evidence Gate",
      "Human Approval",
      "Action",
    ]);
  });

  test("provider desconectado permite apenas ranking e checklists locais", () => {
    const plan = planCouncilRun({
      taskType: "arquitetura",
      mode: "PROFUNDO",
      risk: "alto",
      evidence: "parcial",
      providerConnected: false,
      toolsConnected: false,
      privacy: "sensivel",
      costKnown: false,
    });

    expect(plan.providerState).toBe("NOT_CONNECTED");
    expect(plan.executionMode).toBe("LOCAL_CHECKLISTS_ONLY");
    expect(plan.truth).toBe("NOT_CONNECTED");
    expect(plan.blockedStages).toContain("Specialist Runs");
    expect(plan.blockedStages).toContain("Contraditor / Red Team");
    expect(plan.blockedStages).toContain("Synthesis");
    expect(plan.humanApprovalRequired).toBe(true);
  });

  test("risco alto força lentes independentes de segurança e qualidade", () => {
    const plan = planCouncilRun({
      taskType: "implementacao",
      mode: "CONSELHO",
      risk: "alto",
      evidence: "ausente",
      providerConnected: false,
      toolsConnected: false,
      privacy: "sensivel",
      costKnown: false,
    });
    const ids = plan.roles.map((role) => role.id);

    expect(ids).toContain("security-architect");
    expect(ids).toContain("qa-test-architect");
  });

  test("seed não persistido nunca é FACT/EVIDENCED na leitura efetiva", () => {
    for (const run of COUNCIL_RUNS_SEED) {
      if (!run.persisted) {
        expect(effectiveCouncilRunTruth(run)).toBe("SYNTHETIC_DEMO");
        expect(effectiveCouncilRunTruth(run)).not.toBe("FACT/EVIDENCED");
      }
    }
  });

  test("contagem de profissionais permanece dinâmica", () => {
    const plan = planCouncilRun({
      taskType: "produto",
      mode: "AUTO",
      risk: "baixo",
      evidence: "suficiente",
      providerConnected: false,
      toolsConnected: false,
      privacy: "normal",
      costKnown: true,
    });

    expect(PROFESSIONAL_ROLES.length).toBeGreaterThan(0);
    expect(plan.roles.length).toBeLessThanOrEqual(PROFESSIONAL_ROLES.length);
  });
});
