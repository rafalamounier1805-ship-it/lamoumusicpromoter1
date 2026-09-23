# LAMOU — Metrics Registry
## Candidate 2026-09-23

**State:** DEFINITIONS_REGISTERED / VALUES_REQUIRE_SOURCE  
**Rule:** a registered metric is not a measured metric.

## 1. Contract for every metric

Every metric must define:

- metric_id;
- name;
- category;
- unit;
- exact source;
- cadence;
- formula;
- app/module scope;
- version/environment scope;
- owner;
- baseline when applicable;
- target/limits when applicable;
- freshness policy;
- evidence/provenance;
- truth-state.

A dashboard must render **— / NOT_CONNECTED / NOT_VERIFIED** instead of fabricating a number.

## 2. Cross-cutting application telemetry

Required for every app where technically applicable:

- application invocations;
- sessions started;
- main-flow completion;
- programming errors/exceptions;
- crash/abnormal termination;
- action error rate;
- latency p50 and p95;
- build/deploy failures;
- rollbacks;
- network/communication failures;
- timeout;
- synchronization failures;
- security events;
- authentication failures;
- authorization denials;
- evidence coverage;
- evidence freshness.

## 3. Architecture / handoff metrics

- handoff success rate;
- orphan records;
- unresolved duplicate candidates;
- p95 handoff queue age;
- signal → decision lead time;
- decision → action lead time;
- action completion → effectiveness verification lead time.

A handoff only counts as successful after receiver acknowledgement.

## 4. Plano de Ação

- open action plans;
- overdue plans;
- decisions awaiting required authority/OK;
- effective actions / evaluated actions;
- recurrence after action.

Do not use task completion as a proxy for effectiveness.

## 5. PROJECT PRIME

- milestones on time;
- blocker age;
- tested deliverables accepted.

Schedule baselines and acceptance criteria must be versioned.

## 6. App Processo

- process cycle time;
- waiting time;
- First Pass Yield where definition is valid;
- process-linked competence gaps.

Process measurements need method, source, baseline, limits, frequency and evidence.

## 7. Meu Desenvolvimento

- competence-gap closure;
- training completion;
- completed development actions with application evidence.

Course completion does not prove application/effectiveness.

## 8. Teste³ IA / Lab / Validation

- test pass rate;
- retest success;
- confirmed false-positive rate;
- confirmed false-negative rate;
- required-case coverage.

PASS requires evidence from the same run/build/environment.

## 9. Documents / Version

- stale documents;
- broken/unresolvable references;
- CURRENT/PINNED resolution divergence.

Identity is by stable ID/version, not filename.

## 10. Implementation source

Canonical definitions for this candidate:

`owner-console/src/lib/lamou/metrics-registry.ts`

No migration for measured values was added in this reconciliation; runtime sources must be connected and verified separately.
