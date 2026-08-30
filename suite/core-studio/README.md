# LAMOU CORE Studio — Registro Oficial da Base

## Estado atual da derivada
- Arquitetura/governança: `2.3.0-draft`.
- Promoção: bloqueada até runtime/evidência suficientes.
- 55 códigos governados.
- Truth Guard executável no GitHub Actions.
- Validador de DAG/registro e testes de fast-path/benefícios concluídos com sucesso.

## Princípios
O CORE é a biblioteca transversal dos aplicativos LAMOU. Módulo é capability; plugin/provider é implementação. Proposta não vira produção por documentação.

## Cada código CORE deve informar
- quando atua;
- entradas/saídas;
- dados/proteção;
- `hardDepends` (bootstrap) e `relatedDepends` (relações);
- Plan X/Y/Z/Safe;
- contrato;
- estado/evidência;
- `contractLock`;
- `fastPath`;
- métricas de benefício.

## Travamento
`LOCKED_CRITICAL_CONTRACT` trava compatibilidade do contrato, não impede melhoria interna. Breaking change exige nova major, migração, testes, reverse path e aprovação. `STABLE_VERSIONED_CONTRACT` admite evolução compatível. `EVOLVING_RESEARCH` não promove automaticamente.

## Dependências
`CORE-DAG` valida `hardDepends` como DAG. Relações arquiteturais não devem virar dependências rígidas sem necessidade. Ciclos bloqueiam promoção.

## Fast Path
`CORE-ATTEST` define o conceito de Execution Passport. `CORE-FPATH` possui policy guard nesta branch. O atalho pode reutilizar trabalho estável já validado, mas nunca pula autorização em trust boundary, hard rules, integridade ou auditoria crítica. Contexto/TTL/policy/identidade alterados invalidam o atalho.

## Benefícios
`CORE-BEN` calcula ganho somente com baseline real. Sem baseline: `NÃO MENSURÁVEL`.

## Dados/performance
Princípio: não mover o todo quando só uma parte mudou. Fluxo proposto: `DELTA → BUF → PROJ → ALLOC → STOR → COMMIT → VER → BDR`.

## Versões explícitas
Ver `suite/core-version-policy.json`:
- manifesto 2.1.1;
- catálogo 2.1.0;
- runtime 2.0.0;
- arquitetura 2.3.0-draft.

Dimensões podem ser diferentes, mas precisam corresponder às fontes e à política registrada.

## Arquivos
- `suite/core-studio/index.html`
- `suite/core-studio/modules.js`
- `suite/core-studio/core-code-registry.js`
- `suite/core-studio/core-governance.js`
- `suite/core-studio/innovation-registry.js`
- `suite/core-studio/architecture-center.html`
- `suite/core-version-policy.json`
- `scripts/validate-core-registry.mjs`
- `scripts/test-core-governance.mjs`
- `.github/workflows/core-truth-guard.yml`
- `docs/core/LAMOU_CORE_MANUAL_MESTRE_V2_3_2026-08-30.md`
- `docs/core/CODEX_PROMPT_MESTRE_LAMOU_CORE_V2_3_2026-08-30.md`
- `docs/core/LAMOU_CORE_AUDITORIA_CODIGOS_FASTPATH_V2_3_2026-08-30.md`
