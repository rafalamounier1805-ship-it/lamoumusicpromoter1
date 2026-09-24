import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  FEATURE_ICON_POLICY,
  ICON_LIBRARY_VISUAL_LOCK,
  OWNER_ICON_INVENTORY,
  OWNER_OFFICIAL_ICON_BY_LABEL,
} from "../src/lib/lamou/icon-governance";

const ROOT = resolve(import.meta.dir, "..");
const shellSource = readFileSync(resolve(ROOT, "src/components/lamou/app-shell.tsx"), "utf8");
const truthSource = readFileSync(resolve(ROOT, "src/components/lamou/shell.tsx"), "utf8");
const polishCss = readFileSync(resolve(ROOT, "src/lamou-shell-polish.css"), "utf8");
const stylesCss = readFileSync(resolve(ROOT, "src/styles.css"), "utf8");

describe("P0 item 9 — visual governance and accessibility", () => {
  test("shell exposes keyboard bypass and current-page semantics", () => {
    expect(shellSource).toContain('href="#main-content"');
    expect(shellSource).toContain('id="main-content"');
    expect(shellSource).toContain('aria-current={isActive ? "page" : undefined}');
    expect(shellSource).toContain('aria-controls="lamou-primary-nav"');
  });

  test("motion and contrast preferences have explicit handling", () => {
    expect(polishCss).toContain("prefers-reduced-motion: reduce");
    expect(polishCss).toContain("prefers-contrast: more");
    expect(stylesCss).toContain('@import "./lamou-shell-polish.css";');
  });

  test("red remains reserved for blocking truth state", () => {
    expect(truthSource).toContain(
      'NOT_CONNECTED: "border-muted-foreground/40 text-muted-foreground"',
    );
    expect(truthSource).toContain('BLOCKED: "border-destructive/50 text-destructive"');
  });

  test("recovered official icon inventory is bound only where an asset exists", () => {
    expect(ICON_LIBRARY_VISUAL_LOCK.assetId).toBe("4bb418e9-92d2-41ba-8aa2-2945087ca585");
    expect(ICON_LIBRARY_VISUAL_LOCK.perFeatureBinding).toBe("PARTIAL");
    expect(OWNER_ICON_INVENTORY.generatedCount).toBe(10);
    expect(OWNER_ICON_INVENTORY.plannedRemainingCount).toBe(16);
    expect(OWNER_OFFICIAL_ICON_BY_LABEL["Configurações"]).toBe("OWNER-ICO-007");
    expect(OWNER_OFFICIAL_ICON_BY_LABEL["Aplicativos"]).toBe("OWNER-ICO-004");
    expect(FEATURE_ICON_POLICY.fallbackSource).toBe("lucide-react");
    expect(shellSource).toContain("OWNER_OFFICIAL_ICON_BY_LABEL[label]");
    expect(shellSource).toContain('data-icon-source="lucide-fallback"');
  });

  test("global context makes SOL/LUA/demo scope explicit", () => {
    expect(shellSource).toContain("SOL · CURRENT");
    expect(shellSource).toContain("LUA · LAB");
    expect(shellSource).toContain("DEMO · QUANDO MARCADO");
  });
});
