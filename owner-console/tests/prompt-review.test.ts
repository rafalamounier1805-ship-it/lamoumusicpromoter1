import { describe, expect, test } from "bun:test";

import { PROFESSIONAL_ROLES } from "../src/lib/lamou/council-data";
import { pageExecutionProfile } from "../src/lib/lamou/page-execution-profile";
import { validatedPromptReview } from "../src/lib/lamou/prompt-review";

describe("LAMOU prompt reviewed execution contract", () => {
  test("possui as lentes obrigatórias de produto, software, tela, pedagogia, QA e acessibilidade", () => {
    const ids = new Set(PROFESSIONAL_ROLES.map((role) => role.id));
    for (const id of [
      "product-manager",
      "product-designer",
      "ui-designer",
      "software-architect",
      "frontend-engineer",
      "qa-test-architect",
      "accessibility-specialist",
      "learning-experience-designer",
    ]) {
      expect(ids.has(id)).toBe(true);
    }
  });

  test("revisão local é válida sem fingir provider conectado", () => {
    const review = validatedPromptReview();
    expect(review.valid).toBe(true);
    expect(review.providerState).toBe("NOT_CONNECTED");
    expect(review.executionMode).toBe("LOCAL_CHECKLISTS_ONLY");
    expect(review.humanApprovalRequired).toBe(true);
  });

  test("perfil do Cognitive exige criticidade, gráfico, dark/light, cards informativos e truth-state", () => {
    const profile = pageExecutionProfile("PAGE-OWNER-COGNITIVE");
    expect(profile.criticality.enabled).toBe(true);
    expect(profile.requiredBlocks).toContain("gráfico do CORE");
    expect(profile.visual.themes).toEqual(["Dark Owner", "Light executivo"]);
    expect(profile.visual.accents).toEqual(["cyan", "violet"]);
    expect(profile.visual.cardRule).toContain("Todo card");
    expect(profile.truth.required).toBe(true);
    expect(profile.responsive.breakpoints).toEqual([360, 768, 1440, 1672]);
  });

  test("instalação não é parte do contrato de páginas revisado", () => {
    const ids = ["PAGE-OWNER-COGNITIVE", "PAGE-CORE-OWNER", "PAGE-LABTEST", "PAGE-CLIENT"];
    for (const id of ids) {
      const profile = pageExecutionProfile(id);
      expect(profile.title.toLowerCase()).not.toContain("instala");
    }
  });
});
