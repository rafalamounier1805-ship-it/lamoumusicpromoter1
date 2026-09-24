import {
  ACTIVITY_PERSONA_PROFILES,
  personasForActivity,
  type LamouActivityKey,
} from "@/lib/lamou/activity-persona-router";
import { getPluginCapability } from "@/lib/lamou/plugin-capability-registry";

export type ActivityContractStatus = "PASS" | "FAIL";

export interface ActivityContractExecution {
  activityKey: LamouActivityKey;
  label: string;
  status: ActivityContractStatus;
  scope: "LOCAL_CONTRACT_ONLY";
  personaIds: string[];
  pluginIds: string[];
  mandatoryQuestions: string[];
  evidenceRequired: string[];
  doneCriteria: string[];
  externalProviderExecution: "NOT_CONNECTED" | "NOT_APPLICABLE";
  businessOutcome: "NOT_VERIFIED";
  failures: string[];
}

function unique(values: string[]): string[] {
  return [...new Set(values)];
}

export function executeActivityContract(key: LamouActivityKey): ActivityContractExecution {
  const profile = ACTIVITY_PERSONA_PROFILES.find((candidate) => candidate.key === key);
  if (!profile) throw new Error(`ACTIVITY_PROFILE_NOT_FOUND:${key}`);

  const personas = personasForActivity(key);
  const plugins = profile.plugins.map((id) => getPluginCapability(id));
  const failures: string[] = [];

  if (personas.length < 3) failures.push("PERSONA_COVERAGE_LT_3");
  if (plugins.length < 2) failures.push("PLUGIN_COVERAGE_LT_2");
  if (new Set(profile.personaIds).size !== profile.personaIds.length) {
    failures.push("DUPLICATE_PERSONA");
  }
  if (new Set(profile.plugins).size !== profile.plugins.length) {
    failures.push("DUPLICATE_PLUGIN");
  }
  if (!profile.objective.trim()) failures.push("OBJECTIVE_EMPTY");

  for (const persona of personas) {
    if (persona.mandatoryQuestions.length === 0) {
      failures.push(`PERSONA_WITHOUT_QUESTIONS:${persona.id}`);
    }
    if (persona.evidenceNeeded.length === 0) {
      failures.push(`PERSONA_WITHOUT_EVIDENCE:${persona.id}`);
    }
    if (persona.dod.length === 0) {
      failures.push(`PERSONA_WITHOUT_DOD:${persona.id}`);
    }
  }

  const mandatoryQuestions = unique(personas.flatMap((persona) => persona.mandatoryQuestions));
  const evidenceRequired = unique(personas.flatMap((persona) => persona.evidenceNeeded));
  const doneCriteria = unique(personas.flatMap((persona) => persona.dod));
  const requiresProvider = profile.plugins.includes("ai-provider");

  return {
    activityKey: key,
    label: profile.label,
    status: failures.length === 0 ? "PASS" : "FAIL",
    scope: "LOCAL_CONTRACT_ONLY",
    personaIds: profile.personaIds,
    pluginIds: plugins.map((plugin) => plugin.id),
    mandatoryQuestions,
    evidenceRequired,
    doneCriteria,
    externalProviderExecution: requiresProvider ? "NOT_CONNECTED" : "NOT_APPLICABLE",
    businessOutcome: "NOT_VERIFIED",
    failures,
  };
}

export function executeAllActivityContracts(): ActivityContractExecution[] {
  return ACTIVITY_PERSONA_PROFILES.map((profile) => executeActivityContract(profile.key));
}
