import { describe, expect, test } from "bun:test";

import {
  ACTIVITY_PERSONA_PROFILES,
  activityContextForRoute,
  activityForRoute,
  personasForActivity,
} from "../src/lib/lamou/activity-persona-router";

describe("LAMOU activity persona/plugin router", () => {
  test("every activity has resolvable personas and plugin capabilities", () => {
    for (const profile of ACTIVITY_PERSONA_PROFILES) {
      expect(profile.personaIds.length).toBeGreaterThanOrEqual(3);
      expect(profile.plugins.length).toBeGreaterThanOrEqual(2);
      expect(personasForActivity(profile.key).map((role) => role.id)).toEqual(profile.personaIds);
      expect(new Set(profile.personaIds).size).toBe(profile.personaIds.length);
      expect(new Set(profile.plugins).size).toBe(profile.plugins.length);
    }
  });

  test("routes owner, core, install, lab and apps to specific activities", () => {
    expect(activityForRoute("/owner/mapa-vivo")).toBe("mapa-vivo-detection");
    expect(activityForRoute("/owner/clients/CLIENTE-001")).toBe("client-360");
    expect(activityForRoute("/core/health")).toBe("core-health-observability");
    expect(activityForRoute("/core/problems/CASE-001")).toBe("core-problems-hypotheses");
    expect(activityForRoute("/core/ai")).toBe("ai-council");
    expect(activityForRoute("/install/owner")).toBe("install-owner-security");
    expect(activityForRoute("/install/client")).toBe("install-client-provisioning");
    expect(activityForRoute("/labtest/next")).toBe("labtest-experiment");
    expect(activityForRoute("/apps/version")).toBe("app-runtime");
  });

  test("activity context exposes governed persona and plugin ids without provider claims", () => {
    const context = activityContextForRoute("/core/architecture");
    expect(context.activityKey).toBe("core-architecture-data");
    expect(context.personaIds).toContain("software-architect");
    expect(context.personaIds).toContain("data-architect");
    expect(context.plugins).toContain("data-router");
    expect(context.plugins).toContain("data-auth");
  });
});
