import type { Severity } from "./types";

export type CognitiveFilterMode = "all" | "critical" | "probability";

export const HARD_CRITICAL_SEVERITIES = ["critico", "falha"] as const satisfies readonly Severity[];

export function matchesCognitiveFilter(severity: Severity, mode: CognitiveFilterMode) {
  if (mode === "critical") return severity === "critico" || severity === "falha";
  if (mode === "probability") return severity === "probabilidade";
  return true;
}

export function filterCognitiveModules<T extends { severity: Severity }>(
  modules: readonly T[],
  mode: CognitiveFilterMode,
): T[] {
  return modules.filter((module) => matchesCognitiveFilter(module.severity, mode));
}
