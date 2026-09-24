# Candidate Vault — LOCKED candidates

Date: 2026-09-23  
State: CANDIDATE_NOT_PROMOTED  
Rule: **SALVAR != PROMOVER**

## Purpose

Preserve the selected recovered candidates inside the Owner application as immutable recovery references.

A locked candidate is identified by:

- fixed app identity;
- fixed candidate version;
- fixed source pointer;
- fixed SHA-256;
- edit forbidden;
- overwrite forbidden;
- derive-only change policy.

## Pull flow

1. Owner > Aplicativos & Produtos.
2. Open **Candidate Vault — últimos candidatos travados**.
3. Select the application.
4. Click **Puxar candidato**.
5. The current UI exports an immutable pull manifest containing source, version and SHA-256.
6. A binary/storage bridge must resolve the Library source and copy the exact bytes.
7. Verify SHA-256 before opening or using the artifact.
8. Hash mismatch = BLOCK.
9. Any modification creates a new derived candidate. Never edit the locked source.

Current binary storage bridge state: **NOT_CONNECTED**.

## Selection corrections

This vault intentionally excludes:

- VECTRA Intelligence 360 as a separate entry — BELGO Intelligence 360 V2 is the prior lineage candidate used here;
- Validation Gate;
- APP Observer 360.

App Reader / Lens remains SOURCE_NOT_FOUND until its previous physical executable is recovered.

## Locked selection

01 PROJECT PRIME MASTER V1  
02 LAMU IA — Meu Desenvolvimento  
03 BELGO Intelligence 360 V2  
04 Certificações / Assurance 360 V0.3  
05 LAMOU Version V0.6  
06 LAMOU Orbite V5.9  
07 A-MuDoc V0.4  
08 LAMOU Showroom / Nexus  
09 LAMOU App Processo V0.2  
10 Teste³ IA V0.2  
11 LAMOU Digital Improvement V0.2  
12 Benchmarker historical reference  
13 LAMOU App Clone V0.5  
14 LAMOU Research Scout V0.1  
15 Opportunity Intelligence / Value V0.4  
16 Perfil & Avaliação  
17 App Reader / Lens — SOURCE_NOT_FOUND  
18 LAMOU PUSH 360 / PULSE 360 V0.6
