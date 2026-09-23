# LAMOU Owner Console — Reconciliation Architecture
## Candidate 2026-09-23

**State:** CANDIDATE_NOT_PROMOTED  
**Branch:** `candidate/lamou-owner-architecture-reconcile-2026-09-23`  
**Parent candidate head:** `a5d2e9beef6cfe36dd0765568afd4f4cf3faa6cc`  
**Governance:** SALVAR ≠ PROMOVER · CATALOGADO ≠ CONECTADO · NO_FAKE_BINDING · NO_FAKE_METRIC

## 1. Why this reconciliation exists

The previous Owner candidate contained valid pieces but mixed three different concerns:

1. the application as an independent product;
2. the Central/CORE/LABTEST surfaces that organize or validate that product;
3. the handoff between one product and another.

That made some routes look like ownership. Example: Digital Improvement pointed to an Owner “plans” screen, Teste³ to an Owner “tests” screen, and Version to an Owner “versions” screen even though each application already has its own route/product identity.

This candidate corrects that model.

## 2. Non-negotiable architecture rule

**An application is never broken, absorbed, fragmented or recreated inside another module.**

Each application keeps its complete scope, internal flow, identity, source, versions and evidence. Central, CORE and LABTEST are supervisory surfaces:

- **Central**: portfolio, business management, customers, commercial, documents and navigation.
- **CORE**: technical capabilities, explicit bindings, runtime health, security and infrastructure.
- **LABTEST**: candidate/test/homologation state and evidence before promotion.

A shared capability or linked entity does not transfer ownership of the application.

## 3. Owner module order

The candidate uses the following management order:

1. Cognitive / Cockpit
2. Mapa Vivo
3. Aplicativos & Produtos
4. Clientes
5. Comercial & Contratos
6. Oportunidades
7. Projetos & Ações
8. Testes & Qualidade
9. Documentos
10. Segurança & Acessos
11. Versões
12. Integrações
13. Configurações

This is a **management/navigation order**, not a claim that every business case follows every item.

## 4. Directed flows replace the old single chain

The old display chain:

`Research Scout → Benchmarker → Opportunity Intelligence → Showroom → Diagnóstico → Digital Improvement → Teste³ → Validation Gate → Lab → Version`

is deprecated as a universal process.

The new model uses lanes and typed handoffs.

### 4.1 Commercial lane

`Research Scout → Benchmarker → Opportunity Intelligence → Diagnóstico 360 → Showroom → Comercial & Contratos → Clientes → PROJECT`

Rationale:

- research produces a signal/source;
- benchmark compares alternatives;
- opportunity qualifies the signal;
- diagnosis understands the problem/context **before** solution demonstration;
- Showroom demonstrates an appropriate solution;
- Commercial manages proposal, negotiation, contract and entitlements;
- Client management provisions the customer;
- PROJECT receives implementation work when it requires project governance.

### 4.2 Operational improvement lane

`Diagnóstico 360 → Digital Improvement → Meeting Architect → Plano de Ação`

Optional branches:

- `Meeting Architect → Orbit` for agenda, commitments, diary and follow-up;
- `Plano de Ação → PROJECT` when complexity becomes a project;
- `PROJECT → Processo` when implementation changes a process;
- `Processo → Plano de Ação` when process engineering identifies a gap/nonconformity.

The decision handoff must include authority level, required approvals and evidence. A pending decision is not an approved action.

### 4.3 People / competence lane

`Processo → Meu Desenvolvimento → Processo`

Process may identify a competence requirement/gap linked to a person/role/activity/equipment. Meu Desenvolvimento handles the employee development journey. Evidence of application returns to the process context.

A competence gap is **not automatic blame or root cause**.

### 4.4 Quality / effectiveness lane

`Plano de Ação | PROJECT | Processo → Teste³ IA → LAMOU Lab → Validation Gate → LAMOU Version → Documentos`

Roles stay separate:

- **Teste³ IA** executes tests/cases/retests and creates evidence.
- **LAMOU Lab** compares, experiments and consolidates evidence/results.
- **Validation Gate** evaluates the evidence pack and blocks/permits the next governance step.
- **LAMOU Version** records version/build/lineage/rollback.
- **Documentos** resolves living documentation, CURRENT/PINNED references and provenance.

**Completing an action does not prove effectiveness.**

### 4.5 Operational signal lane

`VECTRA Intelligence 360 V4 / Mapa Vivo → Diagnóstico 360`

Mapa Vivo may detect and contextualize a signal. It does not invent the cause. Diagnosis receives the signal with metric/source/time/evidence context.

## 5. Classification before catalog inclusion

An executable, ZIP, HTML or physical route does not automatically mean "application".

### Confirmed/new application references

| Application | State in this reconciliation | Availability |
|---|---|---|
| PROJECT PRIME MASTER V1 | APPROVED_REFERENCE | external source/reference |
| LAMU IA — Meu Desenvolvimento v1 COMPLETO | APPROVED_REFERENCE | external source/reference |
| VECTRA Intelligence 360 V4 — Mapa Vivo | OFFICIAL_APPROVED | external source/reference |
| LAMOU App Processo V0.3 | CANDIDATE_NOT_PROMOTED | external source/reference |

### Explicitly not counted as applications in this candidate

| Entity | Class |
|---|---|
| Plano de Ação | MODULE |
| LAMOU Lab | SYSTEM_SURFACE |
| Validation Gate | SYSTEM_SURFACE |
| APP Observer 360 V2 | TOOL |
| LAMOU Shield Local | CLASSIFICATION_HOLD |
| LAMOU Computer Scan | CLASSIFICATION_HOLD |
| Confidential Guardian | CLASSIFICATION_HOLD |

Physical compatibility routes may remain without changing classification.

See `ENTITY_CLASSIFICATION_2026-09-23.md`.

## 6. Duplicates and lineage reconciliation

### Same lineage — reconcile, do not silently merge/delete

- LAMOU LifeOS / LAMOU Agenda-LifeOS / Orbit
- Metraction 360 / LAMOU PUSH 360
- BELGO Intelligence 360 / VECTRA Intelligence 360 V4
- A-MuDoc / MuDoc

The candidate preserves aliases and provenance until a canonical identity decision is recorded.

### Similar names/functions but distinct products — keep separate

- Diagnóstico 360 ≠ Meeting Architect
- Teste³ IA ≠ LAMOU Lab ≠ Validation Gate
- Plano de Ação ≠ PROJECT PRIME
- Meu Desenvolvimento ≠ RH/T&D administrative modules
- App Processo ≠ Digital Improvement
- LAMOU Version ≠ Documentos
- Showroom ≠ Comercial & Contratos

## 7. Handoff contract

Every cross-app transition must record:

- `handoff_id`
- `from_app`
- `to_app`
- `event`
- `entity_id` / correlation id
- input payload contract
- evidence ids
- origin/source
- timestamp
- permission/authority
- acknowledgement by receiver
- status: emitted / accepted / rejected / failed
- error/fallback when applicable

A visible button/link is not evidence of an integration.

## 8. Metrics contract

Metric definitions are registered in:

`owner-console/src/lib/lamou/metrics-registry.ts`

No numeric value may appear as measured unless the declared source produced it.

Minimum cross-cutting profiles include:

- invocations, sessions, workflow completion;
- errors, crashes, error rate, p50/p95 latency;
- build/deploy failures and rollback;
- network failures, timeout and sync failure;
- security events, auth failures and permission denials;
- handoff success, orphan records, unresolved duplicate candidates and queue age;
- signal→decision, decision→action and action→effectiveness lead time;
- evidence coverage and freshness.

Domain metrics are additionally registered for Action Plan, PROJECT, Processo, People/Development, Teste³ and Documents.

## 9. Truth-state rules

- Route exists ≠ integration connected.
- Registry item exists ≠ implementation exists.
- Implementation exists ≠ tested.
- Tested ≠ approved.
- Saved ≠ promoted.
- External approved app ≠ bundled into Owner Console.
- Similarity ≠ duplicate.
- Action complete ≠ effective.
- Signal ≠ cause.

## 10. Code references in this candidate

- `src/lib/lamou/app-architecture.ts`: classified entities, handoff graph, module order, duplicate/lineage decisions and classification holds.
- `src/lib/lamou/metrics-registry.ts`: metric definitions and profiles.
- `src/lib/lamou/nav.ts`: reconciled management order and real app routes.
- `src/lib/lamou/registry.ts`: Wave 1 route reconciliation and living document structure.

No production promotion is authorized by this document.
