import { describe, expect, test } from "bun:test";

import {
  executeActivityContract,
  executeAllActivityContracts,
} from "../src/lib/lamou/activity-execution";
import { ACTIVITY_PERSONA_PROFILES } from "../src/lib/lamou/activity-persona-router";
import { PLUGIN_CAPABILITY_REGISTRY } from "../src/lib/lamou/plugin-capability-registry";

describe("LAMOU activity execution batch", () => {
  test("executes every registered activity as a governed local contract", () => {
    const executions = executeAllActivityContracts();

    expect(executions.length).toBe(ACTIVITY_PERSONA_PROFILES.length);
    expect(executions.length).toBe(17);

    for (const execution of executions) {
      expect(execution.status).toBe("PASS");
      expect(execution.scope).toBe("LOCAL_CONTRACT_ONLY");
      expect(execution.personaIds.length).toBeGreaterThanOrEqual(3);
      expect(execution.pluginIds.length).toBeGreaterThanOrEqual(2);
      expect(execution.mandatoryQuestions.length).toBeGreaterThan(0);
      expect(execution.evidenceRequired.length).toBeGreaterThan(0);
      expect(execution.doneCriteria.length).toBeGreaterThan(0);
      expect(execution.businessOutcome).toBe("NOT_VERIFIED");
      expect(execution.failures).toEqual([]);
    }
  });

  test("provider-backed council stays explicitly not connected", () => {
    const council = executeActivityContract("ai-council");
    expect(council.externalProviderExecution).toBe("NOT_CONNECTED");
  });

  test("all plugin capabilities have explicit truth state", () => {
    expect(PLUGIN_CAPABILITY_REGISTRY.length).toBe(12);
    for (const plugin of PLUGIN_CAPABILITY_REGISTRY) {
      expect(plugin.state.length).toBeGreaterThan(0);
      expect(plugin.note.length).toBeGreaterThan(0);
    }
  });
});
