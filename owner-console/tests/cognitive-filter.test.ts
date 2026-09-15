import { describe, expect, test } from "bun:test";

import { filterCognitiveModules, matchesCognitiveFilter } from "../src/lib/lamou/cognitive";

const modules = [
  { id: "normal-with-pending", severity: "normal" as const, openPendings: ["P-1"] },
  { id: "probability", severity: "probabilidade" as const, openPendings: [] },
  { id: "critical", severity: "critico" as const, openPendings: [] },
  { id: "failure", severity: "falha" as const, openPendings: [] },
];

describe("Cognitive severity filters", () => {
  test("Somente críticos inclui exclusivamente crítico e falha", () => {
    expect(filterCognitiveModules(modules, "critical").map((item) => item.id)).toEqual([
      "critical",
      "failure",
    ]);
  });

  test("pendência aberta sozinha não torna módulo crítico", () => {
    expect(
      filterCognitiveModules(modules, "critical").some((item) => item.id === "normal-with-pending"),
    ).toBe(false);
  });

  test("probabilidade possui filtro próprio", () => {
    expect(filterCognitiveModules(modules, "probability").map((item) => item.id)).toEqual([
      "probability",
    ]);
    expect(matchesCognitiveFilter("probabilidade", "critical")).toBe(false);
  });
});
