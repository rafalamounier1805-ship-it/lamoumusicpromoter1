# LAMOU Application Contract Standard V1

Todo aplicativo deve entrar no Lovable com um passaporte completo. Documentacao, codigo, seguranca, calls, testes e evidencias nascem juntos.

## Documento Mestre

Cada app deve explicar de maneira didatica e tecnica:

- identidade, codigo e nome canonico;
- problema que resolve;
- origem, pergunta e decisao;
- publico e perfis de usuario;
- escopo e nao-escopo;
- benchmark/referencias;
- diferencial LAMOU;
- fluxos e telas;
- arquitetura;
- CORE utilizado e bindings;
- dados/fontes;
- calls/APIs/tools/events/webhooks;
- IA/modelos/prompts/skills/VAs;
- seguranca/LGPD;
- comportamento normal, erro, indisponibilidade e fallback;
- testes/evidencias;
- continuidade/backup/restore;
- versoes/linhagem;
- IP/licencas;
- ambientes;
- links vivos CURRENT/PINNED.

## Arquivos minimos por app

- `MASTER_DOCUMENT.md`
- `PRODUCT_MANIFEST.json`
- `ARCHITECTURE.md`
- `ROUTES.json`
- `DATA_CONTRACT.json`
- `CALL_REGISTRY.json`
- `SECURITY_SPEC.md`
- `TEST_MASTER_PLAN.md`
- `VALIDATION_CONTRACT.json`
- `AI_MODEL_CONTRACT.json`
- `VISUAL_BINDING.json`
- `OBSERVABILITY.md`
- `BACKUP_RESTORE.md`
- `CHANGELOG.md`

## Estrutura sugerida

```text
/apps/APP-xxx/
  00_MASTER/
  01_PRODUCT/
  02_ARCHITECTURE/
  03_CALLS/
  04_DATA/
  05_SECURITY/
  06_TESTS/
  07_VALIDATION/
  08_AI/
  09_UI/
  10_OPERATIONS/
```

## Tela Owner: Arquitetura & Saude

Todo app deve expor ao Owner uma tela tecnica com:

- versao, commit e build;
- ambiente;
- auth;
- banco;
- CORE bindings;
- calls conectadas/nao conectadas;
- PASS/FAIL/BLOCKED/NOT_RUN;
- security gate;
- evidence freshness;
- observabilidade;
- custo/latencia quando medidos;
- backup/restore;
- ultimo deploy;
- rollback.

## Todo botao tem contrato

Nenhum botao visivel pode ser decorativo sem identificacao.

`ACTION-ID -> permission -> route/call -> success -> failure -> audit -> evidence`

## Documentos vivos

ID e identidade sao estaveis; nome de arquivo nao e identidade.

- `CURRENT`: resolve a versao corrente autorizada.
- `PINNED`: snapshot exato para auditoria/historico.

## Testes minimos de cada CALL/acao

1. sucesso;
2. entrada invalida;
3. nao autenticado;
4. nao autorizado;
5. tenant incorreto;
6. timeout;
7. provider indisponivel;
8. schema inesperado;
9. retry/idempotencia;
10. fallback/SAFE;
11. recuperacao;
12. audit/trace.

`PASS` so existe com evidencia vinculada ao mesmo commit/build/ambiente. Caso contrario: `FAIL`, `BLOCKED`, `NOT_RUN` ou `NOT_VERIFIED`.
