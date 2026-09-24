import { describe, expect, test } from "bun:test";

import { STATUS_TONE } from "../src/components/lamou/health-widgets";
import { HEALTH_INDICATORS, NEXT_ACTIONS, healthCoverage } from "../src/lib/lamou/health-model";

describe("Health truth and color semantics", () => {
  test("NOT_CONNECTED e NOT_VERIFIED não usam vermelho", () => {
    expect(STATUS_TONE["nao-conectado"]).toBe("neutral");
    expect(STATUS_TONE["nao-verificado"]).toBe("neutral");
  });

  test("parcial usa atenção e comprovado usa verde", () => {
    expect(STATUS_TONE.parcial).toBe("attention");
    expect(STATUS_TONE.verificado).toBe("ok");
  });

  test("Saúde Geral permanece não calculável sem pesos verificáveis", () => {
    const coverage = healthCoverage();
    expect(coverage.computable).toBe(false);
    expect(HEALTH_INDICATORS.some((indicator) => indicator.weight === null)).toBe(true);
  });

  test("Melhorar hoje mantém entre 3 e 5 ações com CTA real declarado", () => {
    expect(NEXT_ACTIONS.length).toBeGreaterThanOrEqual(3);
    expect(NEXT_ACTIONS.length).toBeLessThanOrEqual(5);
    expect(NEXT_ACTIONS.every((action) => action.to.startsWith("/"))).toBe(true);
    expect(NEXT_ACTIONS.every((action) => action.owner && action.due && action.impact)).toBe(true);
  });
});
