# START HERE — LAMOU Owner Console

Status: **CODEX_READY / CANDIDATE_NOT_PROMOTED**

## Work/source stage — completed

The Work/source-sync prerequisite is complete enough for code execution and no longer blocks Codex.

- Lovable snapshot: `532025926ff73e837c5f38be08fd76665ff457e5`
- Source location in this branch: `owner-console/`
- Verified code baseline: `2921711ee1de1e209be28f47e1b41805f7781556`
- GitHub Actions run `35023150728`: install PASS, TypeScript PASS, lint PASS, build PASS.
- `.env`/secrets excluded by design.
- `public/favicon.ico` remains a documented non-build-critical binary provenance exception.

## Codex — start now

1. Work only on branch `candidate/lamou-owner-console-codex-2026-09-15` and inside `owner-console/` unless a handoff/evidence file must be updated.
2. Read `HANDOFF_CODEX_LAMOU_OWNER_2026-09-15.md`.
3. Read `AUDITORIA_FECHAMENTO_LAMOU_OWNER_2026-09-15.md`, `SOURCE_AVAILABILITY_GATE.md`, `BASELINE_VALIDATION_2026-09-15.md` and `../PROMPT_MESTRE_FINALIZACAO_OWNER_2026-09-15.md`.
4. Use GitHub issue #19 as the execution queue and Definition of Done.
5. Execute the P0 order without rebuilding approved work from scratch.
6. Re-run install/typecheck/lint/build and add tests/evidence for every implemented change.
7. Preserve truth states. No fake connection, PASS, metric, probability, evidence or integration.
8. Do not publish, deploy, promote or touch `main`/FROZEN.

`AUDITORIA_FECHAMENTO_LAMOU_OWNER_2026-09-15.md` remains the critical reference for the product gaps.

**SALVAR ≠ PROMOVER.**


## Architecture reconciliation — 2026-09-23

A new candidate branch was derived from the preserved previous candidate head without touching `main` or FROZEN:

- branch: `candidate/lamou-owner-architecture-reconcile-2026-09-23`
- parent candidate head: `a5d2e9beef6cfe36dd0765568afd4f4cf3faa6cc`
- state: `CANDIDATE_NOT_PROMOTED`

Read these documents before changing portfolio/flow/module relationships:

1. `ARCHITECTURE_RECONCILIATION_2026-09-23.md`
2. `DUPLICATION_RECONCILIATION_2026-09-23.md`
3. `METRICS_REGISTRY_2026-09-23.md`
4. `../lamou-lovable-build-pack-v1/ARCHITECTURE_AND_FLOWS.md`
5. `../lamou-lovable-build-pack-v1/APPLICATION_CONTRACT_STANDARD.md`

Key rule: apps remain complete independent products. Central/CORE/LABTEST may organize, validate and link them but must not absorb or fragment their functionality.

Metric definitions can be registered before runtime sources exist, but numeric values must remain `— / NOT_CONNECTED / NOT_VERIFIED` until measured.

**Do not merge/promote this branch without explicit approval.**
