import { describe, expect, test } from "bun:test";

import {
  OFFICIAL_REVIEW_CANDIDATE_POLICY,
  OFFICIAL_REVIEW_CANDIDATE_SET,
} from "../src/lib/lamou/candidate-vault";

describe("official review candidate set", () => {
  test("locks exactly the four owner-selected modules", () => {
    expect(OFFICIAL_REVIEW_CANDIDATE_SET.map((item) => [item.name, item.version])).toEqual([
      ["Metraction 360", "V0.4 VISUAL BASELINE"],
      ["LAMOU Showroom", "V0.4 DESIGN C"],
      ["LAMOU Orbit", "V5.9 OWNER"],
      ["Teste³ IA", "V0.2"],
    ]);
    expect(OFFICIAL_REVIEW_CANDIDATE_SET).toHaveLength(4);
  });

  test("all four remain immutable and not promoted", () => {
    for (const item of OFFICIAL_REVIEW_CANDIDATE_SET) {
      expect(item.immutable).toBe(true);
      expect(item.promotion).toBe("CANDIDATE_NOT_PROMOTED");
      expect(item.sha256).toMatch(/^[a-f0-9]{64}$/);
    }
    expect(OFFICIAL_REVIEW_CANDIDATE_POLICY.locked).toBe(true);
    expect(OFFICIAL_REVIEW_CANDIDATE_POLICY.autoPromotionForbidden).toBe(true);
    expect(OFFICIAL_REVIEW_CANDIDATE_POLICY.overwriteForbidden).toBe(true);
    expect(OFFICIAL_REVIEW_CANDIDATE_POLICY.deriveOnly).toBe(true);
  });
});
