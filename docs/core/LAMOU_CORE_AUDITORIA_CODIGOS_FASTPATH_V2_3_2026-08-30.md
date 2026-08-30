# LAMOU CORE — Auditoria de todos os códigos e execução rápida
**Versão de arquitetura:** 2.3.0-draft  
**Escopo:** branch derivada `core/innovation-center-security-v2`  
**Regra:** não altera a baseline `main`; não promove proposta a runtime sem evidência.

## 1. Resultado da primeira passada
- Códigos existentes auditados: **51**.
- Novos códigos de governança/execução adicionados: **4** (`CORE-DAG`, `CORE-ATTEST`, `CORE-FPATH`, `CORE-BEN`).
- Total governado após enriquecimento: **55**.
- Grupos de dependência circular encontrados na modelagem anterior: **6**.
- Causa: o campo `depends` misturava dependência rígida de bootstrap com relação lógica/consulta entre engines.
- Correção: `hardDepends` passa a ser DAG de inicialização; `relatedDepends` preserva relações arquiteturais sem bloquear bootstrap.

### Ciclos encontrados antes da correção
- CORE-AUD ↔ CORE-RBAC ↔ CORE-ID
- CORE-TRUTH ↔ CORE-VER
- CORE-LUP ↔ CORE-KNW
- CORE-STOR ↔ CORE-DLOC ↔ CORE-BDR ↔ CORE-RPATH ↔ CORE-XY ↔ CORE-DTRUST ↔ CORE-THRESH ↔ CORE-PURPOSE ↔ CORE-ROT ↔ CORE-SID ↔ CORE-KMS ↔ CORE-CRYPT ↔ CORE-SEC-ORCH ↔ CORE-FIN ↔ CORE-EVAL ↔ CORE-RES
- CORE-ROUTEVAULT ↔ CORE-MROUTE
- CORE-SENSORY ↔ CORE-SIG

## 2. Regra de travamento por código
**Travamos o contrato, não congelamos a implementação.** Código crítico não pode mudar interface/comportamento incompatível silenciosamente. Mudança breaking exige nova major, migração, testes, reverse path e aprovação. Código experimental permanece fora de produção até homologação.

## 3. Fast Path — rota rápida sem furar segurança
O `CORE-FPATH` aceita somente operação de baixo risco com `Execution Passport` válido, curto, escopado e ligado a código, usuário, tenant e versão de política. Ele pode reutilizar provider resolution, schema/metadata imutável, policy compilada e evitar full fetch quando delta/chunk basta. **Nunca pula hard rules, autorização em trust boundary, integridade, pagamento, consentimento, uso de segredo, assinatura, mudança de privilégio ou auditoria obrigatória.**

## 4. Benefícios mensuráveis
O `CORE-BEN` exige baseline real. Fórmulas principais:
- menor é melhor: `(baseline - atual) / baseline × 100`;
- maior é melhor: `(atual - baseline) / baseline × 100`;
- tempo economizado: `(espera_baseline - espera_atual) × volume`;
- bytes economizados: `(bytes_baseline - bytes_atual) × volume`.
Sem baseline ou telemetria, o estado é `NÃO MENSURÁVEL`.

## 5. O que torna app/código rápido de executar
1. contrato estável/versionado; 2. dependências rígidas sem ciclos; 3. lazy loading; 4. delta/chunk em vez do objeto inteiro; 5. cache apenas de estado seguro/imutável; 6. fila/worker para trabalho pesado; 7. timeout/cancelamento; 8. idempotência/retry; 9. circuit breaker/fallback seguro; 10. conexão/adapter reutilizável; 11. fast-path apenas com contexto pré-validado; 12. observabilidade para detectar degradação.

## 6. Matriz de todos os códigos

| Código | Nome | Estado | Contrato | Fast Path | Ganho recomendado |
|---|---|---|---|---|---|
| CORE-ID | Identity, Authentication & Session | CATALOGADO / PARCIAL | LOCKED_CRITICAL | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-RBAC | RBAC + Scope + ABAC | CATALOGADO / PARCIAL | LOCKED_CRITICAL | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-DEC | Decision Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, erro |
| CORE-APR | Authority & Approval Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-VER | Verification & Efficacy Gate | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | disponibilidade, failover, RTO/RPO, erro |
| CORE-AUD | Audit & Evidence Trail | CATALOGADO / RUNTIME FRACO | LOCKED_CRITICAL | CONDITIONAL | latência, erro |
| CORE-KNW | Knowledge & Learning Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, custo, erro, lock-in |
| CORE-EXT | External Source Framework | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, custo, erro, lock-in |
| CORE-GIT | Versioned Artifact Publisher | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, erro |
| CORE-DOC | Document & Source Grounding | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, custo, erro, lock-in |
| CORE-AI | AI Gateway | CATALOGADO / PARCIAL | STABLE_VERSIONED | CONDITIONAL | latência, custo, erro, lock-in |
| CORE-TASK | Activity & Capability Classifier | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | latência, custo, erro, lock-in |
| CORE-EVAL | Model & Provider Evaluation Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | latência, custo, erro, lock-in |
| CORE-RES | Capability & Provider Resolver | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, custo, erro, lock-in |
| CORE-LUP | Learning & Update Policy Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, custo, erro, lock-in |
| CORE-XY | Multi-Plan Continuity Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | disponibilidade, failover, RTO/RPO, erro |
| CORE-DTRUST | Distributed Trust & Independence Engine | PROPOSTO / CANDIDATO A PESQUISA/IP | EVOLVING_RESEARCH | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-RPATH | Reverse Path & Safe Recovery | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | disponibilidade, failover, RTO/RPO, erro |
| CORE-FIN | Cost & Lock-in Radar | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | latência, erro |
| CORE-SEC-ORCH | Security Decision & Enforcement Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-CRYPT | Cryptographic Policy Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-KMS | Key & Secret Management Router | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-THRESH | Threshold Trust Engine | PROPOSTO / CANDIDATO A PESQUISA/IP | EVOLVING_RESEARCH | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-SID | Secret Identity Registry | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-ROT | Secret Rotation Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-PURPOSE | Purpose-Bound Secret Policy | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-EPH | Ephemeral Access Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-MROUTE | Moving Route Security | PROPOSTO / CANDIDATO A PESQUISA/IP | EVOLVING_RESEARCH | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-EID | Ephemeral Identity Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-ROUTEVAULT | Protected Route Resolver | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | cobertura, auditoria, exposição, erro |
| CORE-FORENSIC | Minimal Immutable Security Audit | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-STOR | Storage Resolver | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | latência, espera, bytes, roundtrips, custo, sync |
| CORE-DLOC | Data Location Registry | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | CONDITIONAL | latência, erro |
| CORE-SAVE | Autosave & Sync Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | latência, espera, bytes, roundtrips, custo, sync |
| CORE-BUF | Ephemeral Data Buffer | PROPOSTO / DIFERENCIAL LAMOU | STABLE_VERSIONED | CONDITIONAL | latência, espera, bytes, roundtrips, custo, sync |
| CORE-PROJ | Realtime Projection Layer | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | latência, espera, bytes, roundtrips, custo, sync |
| CORE-COMMIT | Durable Commit Engine | PROPOSTO / ARQUITETURA | LOCKED_CRITICAL | NEVER_BYPASS | latência, espera, bytes, roundtrips, custo, sync |
| CORE-INDEX | Fragment & Structure Index | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | latência, espera, bytes, roundtrips, custo, sync |
| CORE-DELTA | Incremental Change Engine | PROPOSTO / DIFERENCIAL LAMOU | STABLE_VERSIONED | ELIGIBLE | latência, espera, bytes, roundtrips, custo, sync |
| CORE-ALLOC | Data Allocation & Placement Engine | PROPOSTO / DIFERENCIAL LAMOU | STABLE_VERSIONED | ELIGIBLE | latência, espera, bytes, roundtrips, custo, sync |
| CORE-BDR | Backup & Disaster Recovery | CATALOGADO / PRECISA EVOLUIR | LOCKED_CRITICAL | CONDITIONAL | disponibilidade, failover, RTO/RPO, erro |
| CORE-LOC | Location & Point Interaction Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | ACK, latência, erro |
| CORE-SIG | Signal Router | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | ACK, latência, erro |
| CORE-ACK | Acknowledgement Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | ACK, latência, erro |
| CORE-ESC | Escalation Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | ACK, latência, erro |
| CORE-A11Y | Accessibility Foundation | CATALOGADO / PRECISA EVOLUIR | STABLE_VERSIONED | ELIGIBLE | cobertura acessível, erro |
| CORE-AT | Assistive Technology Registry | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | cobertura acessível, erro |
| CORE-SENSORY | Multimodal Alert Engine | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | ELIGIBLE | cobertura acessível, erro |
| CORE-TRUTH | Truth Guard | PROPOSTO / PRIORIDADE ALTA | LOCKED_CRITICAL | NEVER_BYPASS | disponibilidade, failover, RTO/RPO, erro |
| CORE-VTR | Version Truth Engine | PROPOSTO / PRIORIDADE ALTA | LOCKED_CRITICAL | NEVER_BYPASS | disponibilidade, failover, RTO/RPO, erro |
| CORE-BRG | Blast Radius Graph | PROPOSTO / ARQUITETURA | STABLE_VERSIONED | CONDITIONAL | disponibilidade, failover, RTO/RPO, erro |
| CORE-DAG | Dependency Graph & Bootstrap Validator | IMPLEMENTADO / DEV TOOL | STABLE_VERSIONED | ELIGIBLE | latência, erro |
| CORE-ATTEST | Code Attestation & Execution Passport | PROPOSTO / PRIORIDADE ALTA | LOCKED_CRITICAL | NEVER_BYPASS | cobertura, auditoria, exposição, erro |
| CORE-FPATH | Verified Fast Path Engine | IMPLEMENTADO / POLICY GUARD | STABLE_VERSIONED | CONDITIONAL | latência, espera, bytes, roundtrips, custo, sync |
| CORE-BEN | Benefits & Gains Measurement Engine | IMPLEMENTADO / CALCULATOR | STABLE_VERSIONED | ELIGIBLE | latência, erro |

## 7. Implementação desta rodada
- `core-governance.js`: hard dependencies, lock policy, fast-path policy e benefit calculator.
- `CORE-DAG`: validador de DAG e campos obrigatórios.
- `CORE-FPATH`: guard determinístico para rota rápida.
- `CORE-BEN`: cálculo de ganhos sem inventar ROI.
- `core-version-policy.json`: versões do manifesto, catálogo, runtime e arquitetura explicitadas separadamente.
- `validate-core-registry.mjs`: valida registro, dependências e version policy.
- `test-core-governance.mjs`: testes do fast-path e fórmulas de ganho.
- workflow `CORE Truth Guard`: executa validação/testes em PR/push da branch CORE.
