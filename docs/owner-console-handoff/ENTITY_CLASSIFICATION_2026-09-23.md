# LAMOU — Entity Classification + App Lock
## Candidate 2026-09-23

**State:** CANDIDATE_NOT_PROMOTED

## Rule

Finding a ZIP, HTML, route, screen or executable does **not** automatically make something an application.

An item enters **Aplicativos** only after its product identity is confirmed. Once confirmed, it receives **APP LOCK**:

- classification locked as APP;
- identity/name/aliases controlled;
- complete functional scope preserved;
- source-of-truth recorded;
- lineage/predecessor/successor preserved;
- silent merge forbidden;
- silent fragmentation forbidden.

**APP LOCK ≠ version promotion.** Candidate/version truth remains separate.

## Classes

| Class | Meaning | Apps catalog? |
|---|---|---|
| LOCKED_APP | Confirmed application with identity/scope locked | YES |
| SAME_APP_LINEAGE_ALIAS | Another name/version lineage of the same app | NO duplicate |
| HOLD_CLASSIFICATION | Not enough evidence to decide app/module/portal/etc. | NO |
| NOT_APP | Module, library, tool, CORE layer or system surface | NO |

## Explicit corrections

These are applications and are locked as such:

- **Validation Gate / Validação — APP**
- **LAMOU App Processo / Processo — APP**
- **APP Observer 360 — APP**
- **Certificações — APP**
- **PROJECT PRIME MASTER V1 — APP**
- **LAMU IA — Meu Desenvolvimento v1 COMPLETO — APP**
- the confirmed apps inherited from the previous catalog after lineage reconciliation

## Explicit non-App examples

- **Plano de Ação — MODULE**
- **LAMOU Lab — SYSTEM/LAB SURFACE**
- **LAMOU Design Library — LIBRARY / DESIGN SYSTEM**
- **LAMOU Pulse CORE — CORE LAYER**
- **LAMOU Shield Local — UTILITY**
- **LAMOU Computer Scan — UTILITY**
- **Confidential Guardian — SECURITY UTILITY**

## Held instead of guessed

- **Toca Minha Música** — previous catalog already says app vs module unresolved.
- **Portal / Wormhole Pitch** — previous catalog already says portal vs module unresolved.
- **PLGO Mineiro** — source/identity insufficient.
- **LAMOU LifeOS** — treated as lineage/identity overlap with Orbit/Agenda, not a second independent app.

## Master source

Code source for the closed classification:

`owner-console/src/lib/lamou/master-app-lock.ts`

Architecture/handoff subset:

`owner-console/src/lib/lamou/app-architecture.ts`

A physical compatibility route such as `/apps/lab` does not override entity classification.


## APP LOCK

Para todo item classificado como APP, ficam travados no catálogo:

- identidade canônica;
- escopo funcional completo;
- source-of-truth;
- linhagem/aliases;
- ownership do processamento e métricas;
- regra de não absorção por Central/CORE/LAB.

O APP LOCK impede reclassificação/fragmentação silenciosa. **APP LOCK não promove versão. SALVAR ≠ PROMOVER.**
