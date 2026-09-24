import { describe, expect, test } from "bun:test";

import {
  B144_ACTION_PLAN_MODULES,
  B144_CANDIDATE,
  B144_HEADER_MODULES,
  B144_LABTEST_MODULES,
  B144_MODULE_CATALOG,
  RADAR_OPPORTUNITY_PROMPT,
} from "../src/lib/lamou/b144-candidate";

describe("B144 candidate governance", () => {
  test("is locked and not promoted", () => {
    expect(B144_CANDIDATE.version).toBe("B144");
    expect(B144_CANDIDATE.state).toBe("CANDIDATE_NOT_PROMOTED");
    expect(B144_CANDIDATE.locked).toBe(true);
    expect(B144_CANDIDATE.rules).toContain("NO_OVERWRITE");
    expect(B144_CANDIDATE.rules).toContain("DERIVE_ONLY");
  });

  test("keeps requested header modules", () => {
    expect(B144_HEADER_MODULES.map((item) => item.name)).toEqual([
      "LAMU IA — Meu Desenvolvimento",
      "LAMOU Orbit",
    ]);
  });

  test("keeps action-plan modules as independent modules", () => {
    expect(B144_ACTION_PLAN_MODULES.map((item) => item.name)).toEqual([
      "LAMOU App Processo",
      "Certificações / Assurance 360",
      "Treinamento",
      "Seleção",
      "Perfil & Avaliação",
      "PROJECT PRIME MASTER",
    ]);
  });

  test("keeps Teste3 and Validation inside LABTEST", () => {
    expect(B144_LABTEST_MODULES.map((item) => item.name)).toEqual(["Teste³ IA", "Validation Gate"]);
  });

  test("places Metraction and Showroom correctly", () => {
    const metraction = B144_MODULE_CATALOG.find((item) => item.name === "Metraction 360");
    const showroom = B144_MODULE_CATALOG.find((item) => item.name === "LAMOU Showroom");
    expect(metraction?.placement).toContain("INDICADORES");
    expect(showroom?.placement).toContain("COMERCIAL");
  });

  test("shares one radar prompt contract across Commercial and Opportunities", () => {
    expect(RADAR_OPPORTUNITY_PROMPT.consumers).toContain("CENTRAL:commercial");
    expect(RADAR_OPPORTUNITY_PROMPT.consumers).toContain("CENTRAL:opportunities");
    expect(RADAR_OPPORTUNITY_PROMPT.runtime).toBe("NOT_CONNECTED");
  });
});
