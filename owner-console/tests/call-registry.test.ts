import { describe, expect, test } from "bun:test";

import {
  CALL_REGISTRY,
  CALL_TEST_SCENARIOS,
  validateCallContract,
} from "../src/lib/lamou/call-registry";

describe("canonical CALL Registry", () => {
  test("exige exatamente os doze cenários mínimos em cada CALL", () => {
    expect(CALL_TEST_SCENARIOS).toHaveLength(12);

    for (const call of CALL_REGISTRY) {
      expect(call.tests.map((item) => item.name)).toEqual([...CALL_TEST_SCENARIOS]);
    }
  });

  test("todos os contratos possuem os campos mínimos completos", () => {
    for (const call of CALL_REGISTRY) {
      expect(validateCallContract(call)).toEqual([]);
      expect(call.version.length).toBeGreaterThan(0);
      expect(call.owner.length).toBeGreaterThan(0);
      expect(call.consumer.length).toBeGreaterThan(0);
      expect(call.purpose.length).toBeGreaterThan(0);
      expect(call.schema.length).toBeGreaterThan(0);
      expect(call.scopes.length).toBeGreaterThan(0);
      expect(call.risks.length).toBeGreaterThan(0);
      expect(call.dependencies.length).toBeGreaterThan(0);
    }
  });

  test("nenhum PASS existe sem evidência vinculada ao mesmo build e ambiente", () => {
    for (const call of CALL_REGISTRY) {
      for (const item of call.tests.filter((testItem) => testItem.result === "PASS")) {
        expect(item.evidenceId).toBeTruthy();
        expect(item.build).toBe(call.lastTest.build);
        expect(item.environment).toBe(call.lastTest.environment);
      }
    }
  });

  test("Conselho está separado em contratos pequenos em vez de uma chamada monolítica", () => {
    const council = CALL_REGISTRY.filter((call) => call.id.startsWith("CALL-0003"));
    const functions = council.map((call) => call.fn);

    expect(functions).toContain("council.orchestrate");
    expect(functions).toContain("council.retrieveEvidence");
    expect(functions).toContain("council.resolveTools");
    expect(functions).toContain("ai.specialistRun");
    expect(functions).toContain("ai.redTeamRun");
    expect(functions).toContain("ai.synthesizeCouncil");
    expect(council.length).toBeGreaterThanOrEqual(6);
  });

  test("provider externo do Conselho permanece NOT_CONNECTED sem evidência", () => {
    for (const id of ["CALL-0003C", "CALL-0003D", "CALL-0003E"]) {
      expect(CALL_REGISTRY.find((call) => call.id === id)?.status).toBe("NOT_CONNECTED");
    }
  });
});
