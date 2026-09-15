# SOURCE AVAILABILITY GATE — LAMOU Owner Console

Date: 2026-09-15  
Status: **AVAILABLE_VERIFIED_FOR_CODEX / SOURCE_SYNC_PASS_WITH_BINARY_EXCEPTION**  
Truth state: **EVIDENCE-BASED**

## Verified source

- Lovable project: `bee5a2f8-878d-4954-a168-029ef7399b36`
- Lovable snapshot: `532025926ff73e837c5f38be08fd76665ff457e5`
- GitHub repository: `rafalamounier1805-ship-it/lamoumusicpromoter1`
- Candidate branch: `candidate/lamou-owner-console-codex-2026-09-15`
- Source target: `owner-console/`
- Initial text-source import commit: `9fbb026cab1c8d06921e499d45e8509d4ac851ae`
- Mechanical formatting baseline commit: `8c5ab8813be903e5bdab4ff948060a62a37c8012`
- Final baseline lint-fix commit: `2921711ee1de1e209be28f47e1b41805f7781556`

## Verified result

1. The Lovable snapshot inventory contains 180 entries.
2. 178 non-binary, non-secret files were transferred into `owner-console/`, including the executable source and configuration required for development.
3. `package.json`, `bun.lock`, `src/`, `drizzle/`, Drizzle migrations/meta, `supabase/config.toml`, visual-lock asset descriptors, route tree and project configs are present.
4. `.env` was intentionally excluded. No secret values were copied to GitHub.
5. `public/favicon.ico` remains the only documented binary provenance exception because the available Lovable connector did not expose transferable raw bytes. It is not required for compilation or the application build.
6. GitHub Actions run `35023150728` on commit `2921711ee1de1e209be28f47e1b41805f7781556` completed successfully: dependency install PASS, TypeScript PASS, lint PASS, production build PASS.
7. No automated application test suite is present in the migrated repository; this remains `NOT_AVAILABLE`, not PASS.
8. Real provider/Auth/business integrations were not exercised by this source gate; they remain `NOT_VERIFIED` unless separately evidenced.
9. No deployment, publication, promotion or change to `main` occurred.

## Gate decision

`CODEX_ENTRY_GATE = OPEN`.

The executable/configuration source is available and technically buildable from GitHub. The migration is sufficient and verified for Codex P0 work. For strict byte-identical archival completeness, the missing `public/favicon.ico` remains a documented binary exception and must not be silently replaced.

This gate does **not** mean production readiness, integration readiness, homologation or promotion.

See:

- `SOURCE_SYNC_REPORT_2026-09-15.md`
- `BASELINE_VALIDATION_2026-09-15.md`
- `HANDOFF_CODEX_LAMOU_OWNER_2026-09-15.md`
- GitHub issue #19

Preserve `main` and FROZEN baselines. **SALVAR ≠ PROMOVER.**
