# LAMOU Owner Console — P0 Items 8–9 status

Date: 2026-09-16
Branch: `candidate/lamou-owner-console-codex-2026-09-15`
Promotion: **NOT PROMOTED**

## Item 8 — Install Owner/Client + Client360 + LABTEST

**Status: IMPLEMENTED_VERIFIED (technical gate)**

Final evidence after route-contract and formatting corrections:

- canonical `/core/settings` destination is accepted by `StatusActionLink`;
- TypeScript: PASS;
- lint: PASS;
- build: PASS;
- build runs the application test suite before Vite build;
- no fake `Reverificar` flow is reintroduced;
- unresolved runtime integrations remain truthfully `NOT_CONNECTED`, `NOT_VERIFIED`, `PARTIAL`, or `IMPLEMENTED_NOT_VERIFIED` as applicable.

Evidence CI: GitHub Actions run `35044307052`.

## Item 9 — icons / depth / accessibility

**Status: IMPLEMENTED_VERIFIED / ASSET_COVERAGE_PARTIAL**

Verified implementation:

- global shell depth layer with subtle grid + cyan/violet depth treatment;
- skip link and keyboard main-content target;
- `aria-current`, `aria-expanded`, `aria-controls`, navigation labels and non-informative icon hiding;
- `prefers-reduced-motion` handling;
- `prefers-contrast: more` handling;
- global SOL / LUA / DEMO context in header;
- compact truth-state glyphs with text labels (not color-only);
- `NOT_CONNECTED` is no longer red; destructive red remains reserved for `BLOCKED`/real blocking semantics;
- automated item-9 assertions in `tests/item9-ux-a11y.test.ts`;
- recovered canonical owner icon inventory is now bound where an inventoried asset actually exists;
- remaining icon positions use an explicit Lucide fallback rather than fabricated LAMOU art;
- TypeScript + lint + build/test gate: PASS at run `35045484407`.

### Recovered canonical owner icon inventory

The Library source `INVENTARIO_OWNER_ICONS_V0_1_CR.json` was recovered and reconciled with the candidate. It identifies:

- library: `LAMOU-OWNER-ICONS`;
- version: `V0.1-CR`;
- state: `CANDIDATE_NOT_PROMOTED`;
- 10 generated/inventoried individual PNG assets (`OWNER-ICO-001` through `OWNER-ICO-010`);
- 16 additional owner icons still explicitly planned as `PENDENTE_GERAR`.

The 10 generated source assets were recovered from the Library and an optimized web sprite derived from those exact sources was added at:

`owner-console/src/assets/owner-icons/owner-icons-sprite.webp`

Binding/governance lives in:

`owner-console/src/lib/lamou/icon-governance.ts`

Current exact bindings include the LAMOU Central mark and inventoried matches such as CORE/Visão Geral, Aplicativos, Configurações and Testes & Evidências. Fallbacks remain marked with `data-icon-source="lucide-fallback"` when there is no generated canonical asset for that feature.

### Declared asset gap — not a hidden code failure

The owner icon inventory itself says 16 assets remain to be generated. Therefore full icon coverage cannot truthfully be labeled complete. The code path is complete and verified; **asset coverage is partial by canonical inventory**.

No missing icon is silently invented. This declared gap moves into the professional 15/15 review as a visual-design P1/P0-polish decision, without being misrepresented as a runtime/build failure.

## P0 technical baseline

Items 1–9 have reached their executable technical baseline with CI evidence. Item 9 carries the explicit `ASSET_COVERAGE_PARTIAL` qualifier above.

The next gate is `PRE_PROMOTION_PROFESSIONAL_REVIEW` (15/15 rubric), followed by correction of its findings and a final full regression gate.

SALVAR ≠ PROMOVER. `main` / FROZEN unchanged.
