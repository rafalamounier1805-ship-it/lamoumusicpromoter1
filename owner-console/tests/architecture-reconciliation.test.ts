import { describe, expect, test } from "bun:test";

import {
  APP_ARCHITECTURE_NODES,
  APP_FLOW_EDGES,
  APP_LOCK_REGISTRY,
  CLASSIFICATION_HOLD,
  CONFIRMED_APP_ENTITIES,
  DUPLICATION_RECONCILIATION,
  NEW_SINCE_V75,
  NON_APP_ARCHITECTURE_ENTITIES,
  OWNER_MODULE_ORDER,
} from "../src/lib/lamou/app-architecture";
import {
  CANDIDATE_VAULT,
  CANDIDATE_VAULT_EXCLUSIONS,
  CANDIDATE_VAULT_POLICY,
} from "../src/lib/lamou/candidate-vault";
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
    expect(CONFIRMED_APP_ENTITIES.every((item) => item.kind === "app")).toBe(true);
    expect(NON_APP_ARCHITECTURE_ENTITIES.some((item) => item.key === "plano-acao")).toBe(true);
    expect(NON_APP_ARCHITECTURE_ENTITIES.some((item) => item.key === "lab")).toBe(true);
    expect(CONFIRMED_APP_ENTITIES.some((item) => item.key === "validation-gate")).toBe(true);
    expect(CONFIRMED_APP_ENTITIES.some((item) => item.key === "processo")).toBe(true);
    expect(CONFIRMED_APP_ENTITIES.some((item) => item.key === "app-observer-360")).toBe(true);
    expect(CONFIRMED_APP_ENTITIES.some((item) => item.key === "certificacoes")).toBe(true);
    expect(CLASSIFICATION_HOLD.every((item) => item.includeInAppsCatalog === false)).toBe(true);
  });

  test("every confirmed app is covered by App Lock", () => {
    const confirmed = new Set(CONFIRMED_APP_ENTITIES.map((item) => item.key));
    const locked = new Set(APP_LOCK_REGISTRY.map((item) => item.appKey));
    expect(locked.size).toBe(confirmed.size);
    for (const appKey of confirmed) {
      expect(locked.has(appKey)).toBe(true);
    }
    expect(APP_LOCK_REGISTRY.every((item) => item.lockState === "LOCKED_APP_IDENTITY_SCOPE")).toBe(
      true,
    );
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

describe("candidate vault lock", () => {
  test("candidate slots and app keys are unique and immutable", () => {
    expect(CANDIDATE_VAULT).toHaveLength(18);
    expect(new Set(CANDIDATE_VAULT.map((item) => item.slot)).size).toBe(CANDIDATE_VAULT.length);
    expect(new Set(CANDIDATE_VAULT.map((item) => item.appKey)).size).toBe(CANDIDATE_VAULT.length);
    expect(CANDIDATE_VAULT.every((item) => item.immutable)).toBe(true);
    expect(CANDIDATE_VAULT_POLICY.editForbidden).toBe(true);
    expect(CANDIDATE_VAULT_POLICY.overwriteForbidden).toBe(true);
    expect(CANDIDATE_VAULT_POLICY.deriveOnly).toBe(true);
  });

  test("excluded candidates never enter the locked pull vault", () => {
    const names = CANDIDATE_VAULT.map((item) => item.name.toLowerCase());
    expect(names.some((name) => name.includes("vectra"))).toBe(false);
    expect(names.some((name) => name.includes("validation gate"))).toBe(false);
    expect(names.some((name) => name.includes("observer 360"))).toBe(false);
    expect(CANDIDATE_VAULT_EXCLUSIONS).toHaveLength(3);
    expect(CANDIDATE_VAULT.some((item) => item.name === "BELGO Intelligence 360")).toBe(true);
  });

  test("every located artifact has a sha256 integrity lock", () => {
    for (const item of CANDIDATE_VAULT) {
      if (item.sourceMode === "SOURCE_NOT_FOUND") {
        expect(item.sha256).toBeNull();
      } else {
        expect(item.sha256).toMatch(/^[a-f0-9]{64}$/);
      }
    }
  });
});
