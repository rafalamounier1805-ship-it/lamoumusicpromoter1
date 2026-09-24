# B144 — Candidate Lock

State: **CANDIDATE_NOT_PROMOTED**  
Branch: `candidate/B144-owner-modules-products-2026-09-23`  
Base preserved: `eaa9941abf357cce268bc13f869b2598ab30a794`

## Lock

- NO_OVERWRITE
- DERIVE_ONLY
- HASH_REQUIRED_BEFORE_USE
- OWNER_APPROVAL_REQUIRED
- SALVAR != PROMOVER

## B144 changes

- Products distinguishes Proprietário, Módulo, Aplicativo legado, CORE, Plugin/Provider and Ferramenta.
- Product/module registry exposes name, software, model, ownership/type, version and stage.
- Owner full name is editable through the existing persisted Owner Profile and surfaced in the header.
- Header shortcuts: Meu Desenvolvimento and Orbit.
- Meu Desenvolvimento receives current allowed Owner profile context without absorbing the mobile app.
- Planos de Ação keeps its complete workflow and exposes Processo, Certificações, Treinamento, Seleção, Perfil & Avaliação and PROJECT as independent modules.
- Metraction 360 V0.4 is surfaced under Indicadores.
- Showroom V0.4 is surfaced under Comercial.
- Teste³ IA V0.2 and Validation Gate are surfaced inside LABTEST.
- PROMPT-RADAR-OPPORTUNITY-B144 is shared by Comercial, Radar de Oportunidades and Opportunity Intelligence.
- Radar runtime remains NOT_CONNECTED until a real provider/runner is connected.

## Promotion rule

Opening, reviewing, testing or saving B144 does not make it official. Promotion requires explicit Owner approval after validation.
