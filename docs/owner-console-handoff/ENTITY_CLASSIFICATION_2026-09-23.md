# LAMOU — Entity Classification
## Candidate 2026-09-23

**State:** CANDIDATE_NOT_PROMOTED

## Rule

Finding a ZIP, HTML, route, screen, executable or package does **not** automatically make something an application.

Only entities explicitly classified as **APP** or **EXTERNAL_APP_REFERENCE** may appear in the Apps catalog.

## Classes

| Class | Meaning | Goes into Apps catalog? |
|---|---|---|
| APP | Independent application/product with its own scope and identity | YES |
| EXTERNAL_APP_REFERENCE | Independent app whose source is outside this Owner bundle | YES |
| MODULE | Functional module inside a larger system/domain | NO |
| SYSTEM_SURFACE | Governance/runtime/test surface | NO |
| TOOL | Technical utility/tool | NO |
| CLASSIFICATION_HOLD | Artifact found but identity/class not proven | NO |

## Current non-App classifications

| Entity | Class | Reason |
|---|---|---|
| Plano de Ação | MODULE | User requested it as a module; do not promote it to an app by inference. |
| LAMOU Lab | SYSTEM_SURFACE | Laboratory/test surface; physical route may remain for compatibility. |
| Validation Gate | SYSTEM_SURFACE | Validation/governance gate; not counted as an application in this candidate. |
| APP Observer 360 V2 | TOOL | Technical observer/diagnostic utility; excluded from Apps unless explicitly reclassified. |
| LAMOU Shield Local | CLASSIFICATION_HOLD | Package found; insufficient evidence to call it an app. |
| LAMOU Computer Scan | CLASSIFICATION_HOLD | Scanner/utility artifact; excluded from Apps. |
| Confidential Guardian | CLASSIFICATION_HOLD | Security candidate artifact; excluded from Apps. |

## Confirmed/new app references kept in Apps

- PROJECT PRIME MASTER V1
- LAMU IA — Meu Desenvolvimento v1 COMPLETO
- VECTRA Intelligence 360 V4 — Mapa Vivo
- LAMOU App Processo V0.3 candidate
- existing confirmed application lineage from the prior catalog

## Compatibility rule

A non-App may still have a route such as `/apps/lab` from an older implementation. Route location is not classification. Compatibility routes can remain while the catalog/menu reflects the correct entity class.

## Reclassification

Any future move from MODULE/TOOL/SYSTEM_SURFACE/HOLD to APP requires explicit product identity evidence or owner decision. It must not happen silently from filename similarity or because an executable exists.
