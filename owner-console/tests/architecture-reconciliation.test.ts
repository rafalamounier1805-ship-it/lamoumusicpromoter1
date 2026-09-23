import { describe, expect, test } from "bun:test";

import {
  APP_ARCHITECTURE_NODES,
  APP_FLOW_EDGES,
  CLASSIFICATION_HOLD,
  CONFIRMED_APP_ENTITIES,
  DUPLICATION_RECONCILIATION,
  NEW_SINCE_V75,
  NON_APP_ARCHITECTURE_ENTITIES,
  OWNER_MODULE_ORDER,
} from "../src/lib/lamou/app-architecture";
import { METRIC_PROFILES, METRICS_REGISTRY } from "../src/lib/lamou/metrics-registry";

describe("architecture reconciliation", () => {
  test("app keys are unique and every app preserves full scope", () => {
    const keys = APP_ARCHITECTURE_NODES.map((app) => app.key);
    expect(new Set(keys).size).toBe(keys.length);
    expect(APP_ARCHITECTURE_NODES.every((app) => app.preservesFullScope)).toBe(true);
  });

  test("every handoff resolves to a registered app or explicit Central surface", () => {
    const keys = new Set(APP_ARCHITECTURE_NODES.map((app) => app.key));
    for (const edge of APP_FLOW_EDGES) {
      expect(keys.has(edge.from) || edge.from.startsWith("CENTRAL:")).toBe(true);
      expect(keys.has(edge.to) || edge.to.startsWith("CENTRAL:")).toBe(true);
      expect(edge.payload.length).toBeGreaterThan(0);
      expect(edge.condition.length).toBeGreaterThan(0);
    }
  });

  test("flow edge ids, duplicate-decision ids and Owner module entries are unique", () => {
    const flowIds = APP_FLOW_EDGES.map((edge) => edge.id);
    const duplicateIds = DUPLICATION_RECONCILIATION.map((item) => item.id);
    expect(new Set(flowIds).size).toBe(flowIds.length);
    expect(new Set(duplicateIds).size).toBe(duplicateIds.length);
    expect(new Set(OWNER_MODULE_ORDER).size).toBe(OWNER_MODULE_ORDER.length);
  });

  test("confirmed app catalog excludes modules, tools and system surfaces", () => {
    expect(CONFIRMED_APP_ENTITIES.length).toBeGreaterThan(0);
    expect(
      CONFIRMED_APP_ENTITIES.every(
        (item) => item.kind === "app" || item.kind === "external-app-reference",
      ),
    ).toBe(true);
    expect(NON_APP_ARCHITECTURE_ENTITIES.some((item) => item.key === "plano-acao")).toBe(true);
    expect(NON_APP_ARCHITECTURE_ENTITIES.some((item) => item.key === "lab")).toBe(true);
    expect(NON_APP_ARCHITECTURE_ENTITIES.some((item) => item.key === "validation-gate")).toBe(true);
    expect(NON_APP_ARCHITECTURE_ENTITIES.some((item) => item.key === "app-observer-360")).toBe(true);
    expect(CLASSIFICATION_HOLD.every((item) => item.includeInAppsCatalog === false)).toBe(true);
  });

  test("new since V7.5 never pretends an external reference has a bundled route", () => {
    expect(NEW_SINCE_V75.length).toBeGreaterThan(0);
    for (const app of NEW_SINCE_V75) {
      if (app.availability === "EXTERNAL_SOURCE_REFERENCE" || app.availability === "CATALOG_ONLY") {
        expect(app.route).toBeNull();
      }
    }
  });
});

describe("metric registry", () => {
  test("metric ids are unique and contracts are complete", () => {
    const ids = METRICS_REGISTRY.map((metric) => metric.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const metric of METRICS_REGISTRY) {
      expect(metric.name.length).toBeGreaterThan(0);
      expect(metric.source.length).toBeGreaterThan(0);
      expect(metric.formula.length).toBeGreaterThan(0);
      expect(metric.truthRule.length).toBeGreaterThan(0);
      expect(metric.appliesTo.length).toBeGreaterThan(0);
    }
  });

  test("every metric profile references only registered metric ids", () => {
    const ids = new Set(METRICS_REGISTRY.map((metric) => metric.id));
    for (const profile of Object.values(METRIC_PROFILES)) {
      for (const metricId of profile) {
        expect(ids.has(metricId)).toBe(true);
      }
    }
  });
});
