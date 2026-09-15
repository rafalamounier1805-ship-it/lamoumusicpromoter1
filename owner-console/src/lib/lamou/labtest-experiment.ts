import type { TruthState } from "@/lib/lamou/council-data";

export type ExperimentResult = "PASS" | "FAIL" | "INCONCLUSIVE" | "NOT_RUN";

export interface ExperimentChange {
  variable: string;
  baselineValue: string;
  candidateValue: string;
}

export interface OneChangeExperiment {
  id: string;
  baselineId: string;
  baselinePinned: boolean;
  candidateId: string;
  changes: ExperimentChange[];
  runnerConnected: boolean;
  environment: string;
  build: string;
  result: ExperimentResult;
  evidenceIds: string[];
  truth: TruthState;
}

export interface ExperimentValidation {
  valid: boolean;
  errors: string[];
  effectiveResult: ExperimentResult;
  effectiveTruth: TruthState;
  canCompare: boolean;
  canSendToGate: boolean;
}

export function validateOneChangeExperiment(experiment: OneChangeExperiment): ExperimentValidation {
  const errors: string[] = [];

  if (!experiment.baselinePinned) errors.push("BASELINE_NOT_PINNED");
  if (!experiment.baselineId.trim()) errors.push("BASELINE_MISSING");
  if (!experiment.candidateId.trim()) errors.push("CANDIDATE_MISSING");
  if (experiment.changes.length !== 1) errors.push("ONE_CHANGE_REQUIRED");

  const change = experiment.changes[0];
  if (change && change.baselineValue === change.candidateValue) {
    errors.push("CHANGE_HAS_NO_DELTA");
  }

  if (!experiment.runnerConnected) {
    if (experiment.result === "PASS") errors.push("PASS_WITHOUT_RUNNER");
    return {
      valid: errors.length === 0,
      errors,
      effectiveResult: "NOT_RUN",
      effectiveTruth: "NOT_CONNECTED",
      canCompare: false,
      canSendToGate: false,
    };
  }

  if (experiment.result === "PASS" && experiment.evidenceIds.length === 0) {
    errors.push("PASS_WITHOUT_EVIDENCE");
  }

  const resultIsExecuted = experiment.result !== "NOT_RUN";
  const hasEvidence = experiment.evidenceIds.length > 0;
  const canCompare = resultIsExecuted && hasEvidence && errors.length === 0;
  const canSendToGate = canCompare && experiment.result === "PASS";

  return {
    valid: errors.length === 0,
    errors,
    effectiveResult: errors.includes("PASS_WITHOUT_EVIDENCE") ? "INCONCLUSIVE" : experiment.result,
    effectiveTruth: canCompare ? experiment.truth : "NOT_VERIFIED",
    canCompare,
    canSendToGate,
  };
}

export const LABTEST_ONE_CHANGE_CONTRACT = {
  baseline: "Clonar uma baseline PINNED/FROZEN sem alterá-la.",
  change: "Modificar exatamente uma variável por ensaio.",
  execute: "Executar somente quando houver runner real conectado.",
  evidence: "Registrar resultado e evidência vinculados ao build e ambiente do ensaio.",
  compare: "Comparar candidata × baseline apenas após execução com evidência.",
  gate: "Somente resultado real com evidência pode seguir ao Validation Gate.",
  promotion: "Salvar, testar ou entrar na fila nunca promove. SALVAR ≠ PROMOVER.",
} as const;

export const LABTEST_CURRENT_EXECUTION: OneChangeExperiment = {
  id: "EXP-CURRENT-NOT-RUN",
  baselineId: "SOL-CURRENT-PINNED",
  baselinePinned: true,
  candidateId: "LUA-CANDIDATE",
  changes: [
    {
      variable: "variável ainda não selecionada",
      baselineValue: "baseline",
      candidateValue: "candidata",
    },
  ],
  runnerConnected: false,
  environment: "LABTEST local",
  build: "candidate/lamou-owner-console-codex-2026-09-15",
  result: "NOT_RUN",
  evidenceIds: [],
  truth: "NOT_CONNECTED",
};
