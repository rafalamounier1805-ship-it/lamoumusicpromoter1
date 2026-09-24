# LAMOU — Duplication & Lineage Reconciliation
## Candidate 2026-09-23

**State:** CANDIDATE_NOT_PROMOTED

This registry prevents two opposite errors:

1. counting the same lineage twice;
2. merging two distinct applications only because they look related.

## Decisions

| ID | Items | Decision | Rule |
|---|---|---|---|
| DUP-001 | LifeOS / Agenda-LifeOS / Orbit | SAME_LINEAGE_RECONCILE | Preserve aliases and reconcile canonical identity/version. |
| DUP-002 | Metraction 360 / LAMOU PUSH 360 | SAME_LINEAGE_RECONCILE | Treat PUSH as lineage evolution/alias until formal identity decision. |
| DUP-003 | BELGO Intelligence 360 / VECTRA Intelligence 360 V4 | SAME_LINEAGE_RECONCILE | Preserve provenance/rebrand; do not double-count automatically. |
| DUP-004 | A-MuDoc / MuDoc | SAME_LINEAGE_RECONCILE | Resolve one canonical APP-ID and document aliases. |
| DUP-005 | Diagnóstico 360 / Meeting Architect | DISTINCT_KEEP_SEPARATE | Investigation vs meeting/decision/follow-up. |
| DUP-006 | Teste³ / Lab / Validation Gate | DISTINCT_KEEP_SEPARATE | Execute vs consolidate/experiment vs gate. |
| DUP-007 | Plano de Ação / PROJECT PRIME | DISTINCT_KEEP_SEPARATE | Action/effectiveness vs complex project governance. |
| DUP-008 | Meu Desenvolvimento / RH-T&D | DISTINCT_KEEP_SEPARATE | Employee app vs administrative domain. |
| DUP-009 | App Processo / Digital Improvement | DISTINCT_KEEP_SEPARATE | Process engineering vs improvement management. |
| DUP-010 | Version / Documentos | DISTINCT_KEEP_SEPARATE | Build/version lineage vs content/source/living docs. |
| DUP-011 | Showroom / Comercial & Contratos | DISTINCT_KEEP_SEPARATE | Solution demonstration vs pipeline/negotiation/contract. |
| DUP-012 | APP Observer 360 / CORE Observabilidade | DISTINCT_KEEP_SEPARATE | Observer 360 is a locked APP; CORE Observability is a technical system surface. They may share telemetry by contract, but neither absorbs the other. |

## Reconciliation protocol

A potential duplicate must never be deleted or merged from similarity alone. Before canonicalization:

1. compare stable IDs and manifests;
2. compare source/build lineage;
3. compare business purpose and complete scope;
4. compare owners/clients/environments;
5. compare history/change logs;
6. record aliases and predecessor/successor relation;
7. preserve old references;
8. obtain explicit product/owner decision when identity changes.

The code mirror is `src/lib/lamou/app-architecture.ts`.
