# LAMOU CORE — MANUAL MESTRE V2.3

> Derivado da V2.2. A baseline `main` permanece preservada. Este manual separa explicitamente proposta, implementação, teste e produção.

## 1. Princípio central
O CORE é a base transversal dos aplicativos LAMOU. Cada capability deve possuir contrato estável, identidade, dependências, dados, segurança, continuidade, reverse path, observabilidade, evidência e benefício mensurável.

## 2. Cada código CORE
Todo código deve expor na interface:
- código, nome e área;
- quando atua;
- entradas e saídas;
- dados envolvidos e proteção;
- hard dependencies e relações;
- Plan X/Y/Z/Safe;
- contrato técnico;
- estado real de implementação/evidência;
- travamento do contrato;
- política de fast-path;
- benefícios e métricas para comprovação.

## 3. Travamento
### LOCKED_CRITICAL_CONTRACT
Contrato crítico não sofre quebra silenciosa. Implementação pode melhorar por trás do contrato. Breaking change exige nova major, migração, testes, reverse path e aprovação.

### STABLE_VERSIONED_CONTRACT
Mudanças compatíveis são permitidas e versionadas.

### EVOLVING_RESEARCH
Candidato a pesquisa/experimento. Não promove automaticamente.

## 4. Dependências sem travar
A modelagem anterior usava `depends` tanto para dependência rígida quanto para relação lógica, gerando ciclos conceituais.

A V2.3 separa:
- `hardDepends`: requisito de bootstrap; deve formar DAG;
- `relatedDepends`: relação/consulta/integração; não bloqueia bootstrap.

`CORE-DAG` valida ciclos, dependências ausentes, códigos duplicados e campos obrigatórios. O pipeline bloqueia promoção se o DAG for inválido.

## 5. Execução rápida — CORE-ATTEST + CORE-FPATH
Um código pode receber uma rota de execução mais curta **somente para reutilizar trabalho já validado**.

Execution Passport precisa estar ligado a:
- código/versão;
- policy version;
- subject;
- tenant;
- escopo;
- TTL;
- evidência de validação.

Fast-path nunca pula:
- autorização na fronteira de confiança;
- hard rules;
- integridade;
- mudança de privilégio;
- pagamento e consentimento;
- uso/rotação de segredo;
- assinatura/release crítica;
- auditoria obrigatória.

Mudança de usuário, tenant, role, policy, risco, classe do dado, versão do código ou TTL invalida o passport.

## 6. O que torna código/app rápido
1. Contrato estável e pequeno.
2. DAG de dependências sem ciclos.
3. Lazy loading e code splitting.
4. Delta/chunk/range no lugar de full fetch.
5. Índices e metadata antes do payload pesado.
6. Buffer durável para ACK rápido quando seguro.
7. Queue/worker para processamento pesado.
8. Timeout e cancelamento em toda chamada externa.
9. Retry somente idempotente/compensável.
10. Circuit breaker e fallback seguro.
11. Cache apenas de informação segura e invalidável.
12. Fast-path pré-validado para operação elegível.
13. Observabilidade e SLO para encontrar regressão.

## 7. Arquitetura incremental de dados
Fluxo:
`CORE-DELTA → CORE-BUF → CORE-PROJ → CORE-ALLOC → CORE-STOR → CORE-COMMIT → CORE-VER → CORE-BDR`.

Regra: **não mover o todo quando apenas uma parte mudou**.

Arquivo grande:
- `CORE-INDEX` lê estrutura/abas/chunks;
- UI carrega apenas range necessário;
- `CORE-DELTA` calcula alteração;
- `CORE-ALLOC` determina destino;
- `CORE-BUF` recebe rapidamente com TTL e criptografia;
- `CORE-COMMIT` persiste de forma idempotente;
- `CORE-VER` confirma integridade;
- `CORE-BDR` protege/recovery.

O buffer não é source of truth. ACK “recebido” só existe após gravação durável. Operação crítica só recebe “concluído” após commit/verificação.

## 8. Segurança
`CORE-SEC-ORCH` combina política determinística + análise contextual. IA pode elevar segurança, nunca reduzir hard rule.

Camadas propostas incluem:
- CORE-CRYPT;
- CORE-KMS;
- CORE-THRESH;
- CORE-SID;
- CORE-ROT;
- CORE-PURPOSE;
- CORE-EPH;
- CORE-EID;
- CORE-MROUTE;
- CORE-ROUTEVAULT;
- CORE-FORENSIC;
- CORE-DTRUST.

Criptografia própria é proibida; usar primitivas/bibliotecas auditadas.

## 9. Continuidade
`CORE-XY`: X preferido, Y hot standby, Z alternativa segura/degradada, S Safe Mode. `CORE-DTRUST` mede dependência comum. `CORE-RPATH` exige caminho de volta para mudança crítica.

## 10. Benefícios e ganhos — CORE-BEN
Toda melhoria deve declarar benefício esperado e método de medição. Ganho real exige baseline + telemetria.

Fórmulas:
- menor é melhor: `(baseline - atual) / baseline × 100`;
- maior é melhor: `(atual - baseline) / baseline × 100`;
- tempo economizado: diferença de espera × volume;
- bytes economizados: diferença de bytes × volume.

Métricas: p95 latency, user wait, bytes moved, DB roundtrips, compute, cost/op, error rate, sync success, availability, failover, RTO/RPO, audit/control coverage, exposure window, independence score, accessibility pass, ACK time e provider switch/lock-in.

Sem baseline: `NÃO MENSURÁVEL`.

## 11. Verdade e versões
Versões ficam explicitadas separadamente em `suite/core-version-policy.json`:
- manifesto: 2.1.1;
- catálogo: 2.1.0;
- runtime: 2.0.0;
- arquitetura/governança: 2.3.0-draft.

Isso não declara igualdade falsa. A branch permanece `DERIVED_PROPOSAL` e `promotionAllowed=false` até runtime/test/release justificarem promoção.

## 12. Implementação com evidência nesta derivada
Implementado como ferramenta/policy nesta rodada:
- `CORE-DAG` — validação de registro e DAG;
- `CORE-FPATH` — guard determinístico de fast-path;
- `CORE-BEN` — calculadora de benefício;
- `core-version-policy.json`;
- `scripts/validate-core-registry.mjs`;
- `scripts/test-core-governance.mjs`;
- `.github/workflows/core-truth-guard.yml`.

O workflow já foi executado com sucesso para validação do DAG/registro e testes do fast-path/cálculo de ganhos.

## 13. Estado dos demais códigos
Os demais códigos mantêm o status declarado na ficha. Documentação/contrato não constitui implementação. Segurança distribuída, threshold, moving route, resolver universal, buffer/commit real, storage resolver e demais engines precisam de runtime dedicado e testes antes de qualquer promoção.

## 14. Fontes da derivada
- `suite/core-studio/index.html`
- `suite/core-studio/core-code-registry.js`
- `suite/core-studio/core-governance.js`
- `suite/core-studio/innovation-registry.js`
- `suite/core-studio/architecture-center.html`
- `suite/core-version-policy.json`
- `docs/core/LAMOU_CORE_AUDITORIA_CODIGOS_FASTPATH_V2_3_2026-08-30.md`
- `docs/core/CODEX_PROMPT_MESTRE_LAMOU_CORE_V2_3_2026-08-30.md`
