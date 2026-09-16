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

**Status: PARTIAL_IMPLEMENTED_VERIFIED**

Verified implementation:

- global shell depth layer with subtle grid + cyan/violet depth treatment;
- skip link and keyboard main-content target;
- `aria-current`, `aria-expanded`, `aria-controls`, navigation labels and non-informative icon hiding;
- `prefers-reduced-motion` handling;
- `prefers-contrast: more` handling;
- global SOL / LUA / DEMO context in header;
- compact truth-state glyphs with text labels (not color-only);
- `NOT_CONNECTED` is no longer red; destructive red remains reserved for `BLOCKED`/real blocking semantics;
- automated item-9 assertions added to `tests/item9-ux-a11y.test.ts`;
- TypeScript + lint + build/test gate: PASS at run `35044841533`.

### Official icon visual lock

The official visual-lock asset is preserved and identified:

- asset id: `4bb418e9-92d2-41ba-8aa2-2945087ca585`;
- metadata: `owner-console/src/assets/visual-lock/icon-library.asset.json`;
- original filename: `icon-library.webp`;
- governance: `owner-console/src/lib/lamou/icon-governance.ts`.

However, **per-feature icon binding remains NOT_VERIFIED**. The available source is a visual-lock/contact-sheet asset reference, not a verified mapping of individual icon crops to feature codes. The interface therefore keeps `lucide-react` as an explicit technical fallback (`data-icon-source="lucide-fallback"`) rather than pretending the official icon mapping is complete.

### Remaining P0 gate

Before declaring all P0 closed, produce or recover a canonical mapping:

`feature/module code -> official icon/crop/asset -> light/dark validation -> accessible label/semantics`

Do not fabricate mappings from the contact sheet. Once this mapping exists, replace the marked fallbacks, rerun responsive/contrast/accessibility QA, and rerun the full CI gate.

## Promotion rule

Professional 15/15 review remains queued and **must not be treated as final Promotion Gate while the official per-feature icon mapping is NOT_VERIFIED**.

SALVAR ≠ PROMOVER. `main` / FROZEN unchanged.
