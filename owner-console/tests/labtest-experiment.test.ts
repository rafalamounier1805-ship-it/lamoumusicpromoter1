import { describe, expect, test } from "bun:test";

import {
  LABTEST_CURRENT_EXECUTION,
  validateOneChangeExperiment,
  type OneChangeExperiment,
} from "../src/lib/lamou/labtest-experiment";

const base: OneChangeExperiment = {
  id: "EXP-TEST",
  baselineId: "SOL-V1-PINNED",
  baselinePinned: true,
  candidateId: "LUA-V2-CANDIDATE",
  changes: [{ variable: "provider", baselineValue: "A", candidateValue: "B" }],
  runnerConnected: true,
  environment: "TEST",
  build: "build-123",
  result: "PASS",
  evidenceIds: ["EV-123"],
  truth: "IMPLEMENTED_VERIFIED",
};

describe("LABTEST one-change-at-a-time", () => {
  test("aceita exatamente uma mudança com runner e evidência", () => {
    const result = validateOneChangeExperiment(base);
    expect(result.errors).toEqual([]);
    expect(result.canCompare).toBe(true);
    expect(result.canSendToGate).toBe(true);
  });

  test("bloqueia ensaio com duas mudanças simultâneas", () => {
    const result = validateOneChangeExperiment({
      ...base,
      changes: [
        ...base.changes,
        { variable: "timeout", baselineValue: "30s", candidateValue: "45s" },
      ],
    });
    expect(result.errors).toContain("ONE_CHANGE_REQUIRED");
    expect(result.canSendToGate).toBe(false);
  });

  test("baseline precisa estar PINNED/FROZEN", () => {
    const result = validateOneChangeExperiment({ ...base, baselinePinned: false });
    expect(result.errors).toContain("BASELINE_NOT_PINNED");
  });

  test("sem runner, ensaio continua NOT_RUN/NOT_CONNECTED e nunca PASS", () => {
    const result = validateOneChangeExperiment({
      ...base,
      runnerConnected: false,
      result: "PASS",
      evidenceIds: [],
    });
    expect(result.errors).toContain("PASS_WITHOUT_RUNNER");
    expect(result.effectiveResult).toBe("NOT_RUN");
    expect(result.effectiveTruth).toBe("NOT_CONNECTED");
    expect(result.canCompare).toBe(false);
    expect(result.canSendToGate).toBe(false);
  });

  test("PASS exige evidência", () => {
    const result = validateOneChangeExperiment({ ...base, evidenceIds: [] });
    expect(result.errors).toContain("PASS_WITHOUT_EVIDENCE");
    expect(result.effectiveResult).toBe("INCONCLUSIVE");
    expect(result.canSendToGate).toBe(false);
  });

  test("estado atual do LABTEST não finge runtime conectado", () => {
    const result = validateOneChangeExperiment(LABTEST_CURRENT_EXECUTION);
    expect(result.effectiveResult).toBe("NOT_RUN");
    expect(result.effectiveTruth).toBe("NOT_CONNECTED");
    expect(result.canSendToGate).toBe(false);
  });
});
