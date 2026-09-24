# LAMOU Application Contract Standard V2 — Candidate

Todo aplicativo entra no ecossistema com passaporte completo. Documentação, código, segurança, handoffs, métricas, testes e evidências nascem juntos.

## 1. Regra fundamental — aplicativo inteiro

Um aplicativo é uma unidade de produto independente.

Ele **não pode ser quebrado, fragmentado, absorvido ou recriado** dentro de Central, CORE, LABTEST, RH, Qualidade, Comercial ou outro aplicativo.

Central organiza e navega. CORE oferece capacidades/bindings técnicos explícitos. LABTEST valida candidatas. Nenhuma dessas superfícies muda o ownership funcional do app.

## 1.1 APP LOCK

Todo aplicativo confirmado recebe lock arquitetural obrigatório:

`APP -> classification + identity + full_scope + source_of_truth + lineage_aliases = LOCKED`

Consequências:

- área nova não pode quebrar o app em pedaços;
- módulo homônimo não pode substituir o app;
- CORE pode fornecer capability/binding, mas não tomar ownership funcional;
- alias/rebrand não cria um segundo aplicativo;
- candidato continua candidato mesmo com o escopo travado;
- mudança de classificação ou identidade exige decisão explícita.

Registro mestre desta candidata: `src/lib/lamou/master-app-lock.ts`.

## 2. Documento Mestre

Cada app deve explicar:

- identidade, ID estável e nome canônico;
- aliases, predecessor/sucessor e linhagem;
- fonte de verdade;
- problema que resolve;
- público e perfis;
- escopo completo e não-escopo;
- benchmark/referências;
- fluxos e telas internas;
- arquitetura;
- capacidades CORE usadas **somente quando explicitamente vinculadas**;
- dados/fontes;
- handoffs de entrada e saída;
- calls/APIs/tools/events/webhooks;
- métricas obrigatórias;
- IA/modelos/prompts/skills/VAs quando aplicável;
- segurança/LGPD;
- erro, indisponibilidade e fallback;
- testes/evidências;
- eficácia quando aplicável;
- continuidade/backup/restore;
- versões/linhagem;
- IP/licenças;
- ambientes;
- links CURRENT/PINNED.

## 3. Arquivos mínimos por app

- `MASTER_DOCUMENT.md`
- `PRODUCT_MANIFEST.json`
- `SOURCE_OF_TRUTH.md`
- `LINEAGE_ALIASES.json`
- `ARCHITECTURE.md`
- `ROUTES.json`
- `HANDOFF_CONTRACTS.json`
- `DATA_CONTRACT.json`
- `METRICS_REGISTRY.json`
- `CALL_REGISTRY.json`
- `SECURITY_SPEC.md`
- `TEST_MASTER_PLAN.md`
- `VALIDATION_CONTRACT.json`
- `AI_MODEL_CONTRACT.json` quando aplicável
- `VISUAL_BINDING.json`
- `OBSERVABILITY.md`
- `BACKUP_RESTORE.md`
- `DUPLICATION_CHECK.md`
- `CHANGELOG.md`

## 4. Estrutura sugerida

```text
/apps/APP-xxx/
  00_MASTER/
  01_PRODUCT/
  02_ARCHITECTURE/
  03_HANDOFFS_CALLS/
  04_DATA_METRICS/
  05_SECURITY/
  06_TESTS/
  07_VALIDATION/
  08_AI/
  09_UI/
  10_OPERATIONS/
```

## 5. Source-of-truth e linhagem

Nome de arquivo não é identidade.

Cada app precisa de:

- app_id estável;
- version_id;
- aliases;
- predecessor/sucessor quando houver;
- source/build origin;
- CURRENT;
- PINNED;
- histórico de rename/rebrand.

Possível duplicidade não pode ser mesclada automaticamente por similaridade. Deve passar por reconciliação de IDs, source/build, escopo, histórico e decisão registrada.

## 6. Handoff contract

Nenhuma integração entre apps é presumida.

Cada handoff define:

- `handoff_id`
- `from_app`
- `to_app`
- evento;
- correlation/entity id;
- payload mínimo;
- evidence ids;
- permissão/scope;
- authority/approval quando aplicável;
- timeout/retry/idempotency quando houver call;
- acknowledgement;
- failure/fallback;
- audit/trace.

Estado mínimo: `DOCUMENTED_ONLY | IMPLEMENTED_NOT_VERIFIED | CONNECTED_VERIFIED`.

## 7. Metrics contract

Cada métrica define:

- metric_id;
- nome;
- unidade;
- fórmula;
- fonte;
- escopo de app/versão/ambiente;
- frequência;
- baseline/target/limites quando aplicável;
- owner;
- freshness;
- evidence/provenance;
- truth-state.

Registrar métrica **não** autoriza preencher número.

Sem fonte: `— / NOT_CONNECTED / NOT_VERIFIED`.

Cross-cutting recomendado:

- invocações;
- sessões;
- conclusão de fluxo;
- erros/crashes;
- error rate;
- p50/p95;
- build/deploy failures;
- rollback;
- rede/timeout/sync;
- eventos de segurança;
- falhas de autenticação;
- negativas de autorização;
- evidence coverage/freshness;
- handoff success e queue age.

## 8. Tela Owner: Arquitetura & Saúde

Todo app expõe ao Owner, por link/ficha técnica:

- versão, commit e build;
- ambiente;
- source-of-truth;
- aliases/linhagem;
- auth;
- banco;
- bindings técnicos comprovados;
- handoffs in/out;
- calls conectadas/não conectadas;
- métricas registradas e métricas realmente medidas;
- PASS/FAIL/BLOCKED/NOT_RUN;
- security gate;
- evidence freshness;
- observabilidade;
- custo/latência quando medidos;
- backup/restore;
- último deploy;
- rollback.

## 9. Todo botão tem contrato

Nenhum botão visível pode ser decorativo sem identificação.

`ACTION-ID -> permission -> route/call/handoff -> success -> failure -> audit -> evidence`

Link de navegação não deve ser mostrado como se fosse integração de dados.

## 10. Testes mínimos de cada CALL/ação

1. sucesso;
2. entrada inválida;
3. não autenticado;
4. não autorizado;
5. tenant incorreto;
6. timeout;
7. provider indisponível;
8. schema inesperado;
9. retry/idempotência;
10. fallback/SAFE;
11. recuperação;
12. audit/trace.

`PASS` só existe com evidência vinculada ao mesmo commit/build/ambiente.

## 11. Eficácia

Para ações, projetos, processos, treinamentos e melhorias:

**concluir execução não equivale a comprovar eficácia.**

O contrato deve separar:

- baseline;
- objetivo/meta;
- execução;
- resultado observado;
- critério de eficácia;
- janela de monitoramento;
- recorrência;
- reteste;
- aprendizagem.

## 12. Truth rules

- CATALOGADO ≠ IMPLEMENTADO
- IMPLEMENTADO ≠ CONECTADO
- CONECTADO ≠ VERIFICADO
- TESTADO ≠ APROVADO
- SALVAR ≠ PROMOVER
- SIMILARIDADE ≠ DUPLICIDADE
- AÇÃO CONCLUÍDA ≠ EFICÁCIA
