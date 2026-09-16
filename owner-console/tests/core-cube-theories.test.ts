import { describe, expect, test } from "bun:test";

import {
  CORE_CUBE_THEORIES,
  getCoreCubeTheory,
  planCoreCubeExperiment,
  productionArchitectures,
} from "../src/lib/lamou/core-cube-theories";

describe("CORE Cubo and theory governance", () => {
  test("keeps Planilhão as the only production baseline", () => {
    expect(productionArchitectures().map((theory) => theory.key)).toEqual(["grid"]);
    expect(getCoreCubeTheory("grid").state).toBe("BASELINE_REFERENCE");
  });

  test("keeps experimental architectures out of production by default", () => {
    const experimental = CORE_CUBE_THEORIES.filter((theory) => theory.key !== "grid");
    expect(experimental.every((theory) => theory.productionEligible === false)).toBe(true);
    expect(experimental.every((theory) => theory.state !== "BASELINE_REFERENCE")).toBe(true);
  });

  test("preserves Cubo Mágico as ranked working-set retrieval", () => {
    const magicCube = getCoreCubeTheory("magic-cube");
    expect(magicCube.technicalTranslation).toContain("working set");
    expect(magicCube.technicalTranslation).toContain("recuperação priorizada");
  });

  test("keeps heavy multimodal media as referenced objects instead of duplicated payload", () => {
    const multiMagicCube = getCoreCubeTheory("multi-magic-cube");
    expect(multiMagicCube.technicalTranslation).toContain("hash");
    expect(multiMagicCube.technicalTranslation).toContain("ponteiros");
    expect(multiMagicCube.technicalTranslation).toContain("mídia bruta não precisa ser duplicada");
  });

  test("requires one-change-at-a-time experiment against Planilhão baseline", () => {
    const plan = planCoreCubeExperiment("cube");
    expect(plan.baseline).toBe("grid");
    expect(plan.target).toBe("cube");
    expect(plan.state).toBe("NOT_RUN");
    expect(plan.oneVariableOnly).toBe(true);
    expect(plan.promotionAllowed).toBe(false);
    expect(plan.requiredEvidence.length).toBeGreaterThanOrEqual(6);
  });

  test("marks Pirâmide as proposed and not verified", () => {
    expect(getCoreCubeTheory("pyramid").state).toBe("PROPOSED_NOT_VERIFIED");
  });

  test("every architecture has personas, capabilities, evidence and a hypothesis", () => {
    for (const theory of CORE_CUBE_THEORIES) {
      expect(theory.personas.length).toBeGreaterThanOrEqual(5);
      expect(theory.capabilities).toContain("data-router");
      expect(theory.capabilities).toContain("validation-gate");
      expect(theory.evidenceRequired.length).toBeGreaterThanOrEqual(6);
      expect(theory.hypothesis.trim().length).toBeGreaterThan(0);
    }
  });
});
