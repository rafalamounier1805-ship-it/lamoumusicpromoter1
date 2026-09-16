import { describe, expect, test } from "bun:test";

import {
  CORE_CUBE_ARCHITECTURES,
  buildMultiMagicManifest,
  createCoreCubeDataset,
  createCoreCubeSnapshot,
  runCoreCubeBenchmark,
} from "../src/lib/lamou/core-cube-experiment";

describe("CORE Cubo full experimental plan", () => {
  test("executes all registered architectures against the same governed dataset", () => {
    const report = runCoreCubeBenchmark(5);
    expect(report.truthState).toBe("SYNTHETIC_DEMO");
    expect(report.executionScope).toBe("LOCAL_RULESET_ONLY");
    expect(report.results.map((result) => result.architecture)).toEqual(CORE_CUBE_ARCHITECTURES);
    expect(report.results).toHaveLength(10);
  });

  test("preserves retrieval success, lineage and tenant isolation in the synthetic corpus", () => {
    const report = runCoreCubeBenchmark(5);
    for (const result of report.results) {
      expect(result.retrievalAccuracy).toBe(1);
      expect(result.taskSuccessRate).toBe(1);
      expect(result.lineagePreserved).toBe(true);
      expect(result.tenantIsolation).toBe(true);
      expect(result.promotionAllowed).toBe(false);
    }
  });

  test("executes all five specialist local rulesets for every architecture", () => {
    const report = runCoreCubeBenchmark(3);
    for (const result of report.results) {
      expect(result.specialistReviews.map((review) => review.personaId)).toEqual([
        "data-architect",
        "data-engineer",
        "software-architect",
        "systems-engineer",
        "research-scientist",
      ]);
      expect(result.specialistReviews.every((review) => review.state === "LOCAL_CHECK_PASS")).toBe(
        true,
      );
    }
  });

  test("multi-magic manifests reference heavy media without duplicating raw payloads", () => {
    const mediaRecord = createCoreCubeDataset().find((record) => record.id === "A-MOTOR-AUDIO");
    expect(mediaRecord).toBeDefined();
    const manifest = buildMultiMagicManifest(mediaRecord!);
    expect(manifest.objectRef).toContain("core://objects/");
    expect("text" in manifest).toBe(false);
  });

  test("snapshot is immutable and ghost-style benchmarking does not mutate canonical records", () => {
    const records = createCoreCubeDataset();
    const before = JSON.stringify(records);
    const snapshot = createCoreCubeSnapshot(records);
    expect(Object.isFrozen(snapshot)).toBe(true);
    expect(Object.isFrozen(snapshot[0])).toBe(true);
    runCoreCubeBenchmark(3);
    expect(JSON.stringify(records)).toBe(before);
  });

  test("collects measurable evidence without inferring production superiority", () => {
    const report = runCoreCubeBenchmark(5);
    for (const result of report.results) {
      expect(Number.isFinite(result.latencyMs)).toBe(true);
      expect(result.indexBytes).toBeGreaterThanOrEqual(0);
      expect(result.contextBytes).toBeGreaterThan(0);
      expect(result.truthState).toBe("SYNTHETIC_DEMO");
      expect(result.executionScope).toBe("LOCAL_RULESET_ONLY");
    }
  });
});
