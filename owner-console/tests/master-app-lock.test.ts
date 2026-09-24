import { describe, expect, test } from "bun:test";

import {
  APP_CLASSIFICATION_HOLDS,
  APP_LINEAGE_ALIASES,
  LOCKED_MASTER_APPS,
  MASTER_APP_LOCK_CATALOG,
  MASTER_APP_LOCK_POLICY,
  MASTER_NON_APPS,
} from "../src/lib/lamou/master-app-lock";

describe("LAMOU master App Lock", () => {
  test("ids are unique", () => {
    const ids = MASTER_APP_LOCK_CATALOG.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("every locked app has scope locked and is not silently bound/promoted", () => {
    expect(LOCKED_MASTER_APPS.length).toBeGreaterThan(0);
    for (const app of LOCKED_MASTER_APPS) {
      expect(app.scopeLock).toBe("LOCKED");
      expect(app.classification).toBe("LOCKED_APP");
      expect(["NOT_VERIFIED", "NOT_CONNECTED", "PARTIAL", "VERIFIED"]).toContain(app.bindingTruth);
    }
    expect(MASTER_APP_LOCK_POLICY.lockDoesNotEqualPromotion).toBe(true);
    expect(MASTER_APP_LOCK_POLICY.catalogDoesNotEqualBinding).toBe(true);
  });

  test("Validation, Processo, Observer and Certificações are locked applications", () => {
    const names = new Set(LOCKED_MASTER_APPS.map((item) => item.name));
    expect(names.has("Validation Gate / Validação")).toBe(true);
    expect(names.has("LAMOU App Processo")).toBe(true);
    expect(names.has("APP Observer 360")).toBe(true);
    expect(names.has("Certificações")).toBe(true);
  });

  test("Lab, Plano de Ação, Design Library and local security utilities stay outside Apps", () => {
    const names = new Set(MASTER_NON_APPS.map((item) => item.name));
    expect(names.has("LAMOU Lab")).toBe(true);
    expect(names.has("Plano de Ação")).toBe(true);
    expect(names.has("LAMOU Design Library")).toBe(true);
    expect(names.has("LAMOU Shield Local")).toBe(true);
    expect(names.has("LAMOU Computer Scan")).toBe(true);
    expect(names.has("Confidential Guardian")).toBe(true);
  });

  test("unresolved items are held instead of guessed", () => {
    const names = new Set(APP_CLASSIFICATION_HOLDS.map((item) => item.name));
    expect(names.has("Toca Minha Música")).toBe(true);
    expect(names.has("Portal / Wormhole Pitch")).toBe(true);
    expect(names.has("PLGO Mineiro")).toBe(true);
  });

  test("lineage aliases do not count as independent locked apps", () => {
    expect(APP_LINEAGE_ALIASES.some((item) => item.name === "LAMOU LifeOS")).toBe(true);
  });
});
