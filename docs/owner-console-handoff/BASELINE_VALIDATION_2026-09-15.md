# BASELINE VALIDATION — LAMOU Owner Console

Date: 2026-09-15  
Branch: `candidate/lamou-owner-console-codex-2026-09-15`  
Status: **BASELINE_CI_PASS / CANDIDATE_NOT_PROMOTED**

## Scope

This document records technical baseline evidence for the Owner Console imported from Lovable snapshot `532025926ff73e837c5f38be08fd76665ff457e5` into `owner-console/`. It is evidence that the candidate installs, type-checks, lints and builds; it is not production approval or integration verification.

## Historical first pass

The first local/container validation used npm because Bun was unavailable in that environment. Production build and TypeScript passed, while lint exposed 487 errors and 18 warnings. Decomposition showed 486 `prettier/prettier` formatting errors, one `prefer-const` error and 18 Fast Refresh warnings.

Formatting was subsequently isolated in commit `8c5ab8813be903e5bdab4ff948060a62a37c8012`, preserving the imported baseline in Git history. The remaining `prefer-const` blocker was fixed minimally in commit `2921711ee1de1e209be28f47e1b41805f7781556`.

## Final CI revalidation

GitHub Actions workflow: `Owner Console Candidate CI`  
Run: `35023150728`  
Verified code commit: `2921711ee1de1e209be28f47e1b41805f7781556`

| Check | Command / mechanism | Result |
| --- | --- | --- |
| Checkout candidate | GitHub Actions | PASS |
| Bun setup | `oven-sh/setup-bun@v2` | PASS |
| Dependency install | `bun install --frozen-lockfile` | PASS |
| TypeScript | `bunx tsc --noEmit` | PASS |
| Lint | `bun run lint` | PASS |
| Production build | `bun run build` | PASS |
| Automated application tests | repository inventory | NOT_AVAILABLE |
| Real integrations/providers | not exercised by this CI | NOT_VERIFIED |

The successful CI installation used Bun `1.4.2`. Lint still reports 18 `react-refresh/only-export-components` warnings, but no lint errors; the lint command exits successfully.

## Source completeness notes

- `.env` is intentionally excluded and must stay outside GitHub.
- `public/favicon.ico` remains a binary provenance exception. It did not block install, typecheck, lint or build and must not be recreated and called original without provenance.
- The executable source/configuration required for Codex work is present under `owner-console/`.

## Gate decision

`BUILD_BASELINE = PASS` for installation, static TypeScript validation, lint and production build.

`TEST_BASELINE = NOT_AVAILABLE` because an automated application test suite is not present yet.

`INTEGRATION_BASELINE = NOT_VERIFIED` because this CI did not exercise credentials, real providers, runtime Auth/RLS behavior, external services or business workflows.

`CODEX_ENTRY_GATE = OPEN`.

No publication or promotion was performed. **SALVAR ≠ PROMOVER.**
