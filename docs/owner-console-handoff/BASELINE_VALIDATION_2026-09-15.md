# BASELINE VALIDATION — LAMOU Owner Console

Date: 2026-09-15  
Branch: `candidate/lamou-owner-console-codex-2026-09-15`  
Status: `BASELINE_RECORDED / CANDIDATE_NOT_PROMOTED`

## Scope

This records the first local validation after importing the Lovable snapshot `532025926ff73e837c5f38be08fd76665ff457e5` into `owner-console/`. It is baseline evidence, not a production approval.

## Environment

- Node: `v24.19.0`
- npm: `11.9.0`
- Bun: unavailable in this execution environment (`bun: command not found`)
- Dependency fallback used: `npm install --package-lock=false --ignore-scripts`
- Result: 440 packages installed; no source or lockfile change was created.

The project supplies `bun.lock`. Its exact Bun installation path remains **NOT_VERIFIED** here because Bun is not installed in the execution environment.

## Results

| Check | Command | Result | Evidence |
| --- | --- | --- | --- |
| Source text sync | Lovable file inventory and Git tree comparison | PARTIAL | 178 text files present under `owner-console/`; `.env` excluded; `public/favicon.ico` binary pending |
| Dependency install | `npm install --package-lock=false --ignore-scripts` | PASS | 440 packages installed |
| Production build | `npm run build` | PASS | Vite completed client and SSR build |
| Type check | `npx tsc --noEmit` | PASS | exit code 0 |
| Lint | `./node_modules/.bin/eslint . --format json` | FAIL | exit code 1; 487 errors and 18 warnings across 45 files |
| Automated tests | repository inventory | NOT_AVAILABLE | no test scripts and no `*.test.*` or `*.spec.*` files were found |
| Real integrations | no credentials or connected services used | NOT_VERIFIED | no backend/provider/auth claim is made |

## Build observations

- Vite reports a deprecated `createServerFn().inputValidator()` call in `src/lib/lamou/provider-check.functions.ts`.
- The largest client chunk is approximately 634 kB minified / 180 kB gzip, above Vite's 500 kB advisory threshold.
- The missing binary favicon did not prevent this baseline build; it remains a source-provenance gap, not a verified replacement.

## Lint decomposition

- 486 errors: `prettier/prettier`
- 1 error: `prefer-const`
- 18 warnings: `react-refresh/only-export-components`

Formatting has **not** been bulk-rewritten in this baseline commit. The handoff requires product correctness to be fixed first; any formatter-wide change must be isolated and reviewed separately.

## Gate decision

`BUILD_BASELINE = PARTIAL_PASS`.

Build and TypeScript parsing pass. Lint fails, no automated test suite exists, the binary source copy is incomplete, and real integrations have not been exercised. The candidate is safe to continue into evidence-backed P0 work, but it is not ready for promotion or production deployment.
