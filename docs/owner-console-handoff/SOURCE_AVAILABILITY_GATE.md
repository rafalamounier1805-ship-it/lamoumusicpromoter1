# SOURCE AVAILABILITY GATE — LAMOU Owner Console

Data: 2026-09-15
Status: **BLOCKED_FOR_CODEX_EDIT / HANDOFF_READY**
Truth-state: **EVIDENCE-BASED**

## Origem verificada
- Lovable project: `bee5a2f8-878d-4954-a168-029ef7399b36`
- Lovable snapshot/commit interno: `532025926ff73e837c5f38be08fd76665ff457e5`
- Estado Lovable: `ready`, `agentFinished=true`, `is_published=false`
- Branch de destino: `candidate/lamou-owner-console-codex-2026-09-15`
- Repo canônico: `rafalamounier1805-ship-it/lamoumusicpromoter1`

## Verificação executada
1. O snapshot `532025926ff73e837c5f38be08fd76665ff457e5` **não existe** no repositório canônico GitHub como commit.
2. A branch de handoff contém documentação e instruções, mas o diretório `owner-console/` ainda **não contém o source completo** do snapshot.
3. O conector Lovable disponível nesta sessão permite listar e ler arquivos individuais, mas não oferece uma ação de export/download em lote do repositório.
4. `.env` e qualquer segredo devem permanecer fora do GitHub. Somente `.env.example` sem valores pode ser versionado.

## Inventário esperado no sync
O source só pode ser declarado AVAILABLE_VERIFIED quando a branch contiver e reconciliar, no mínimo:
- `package.json`, lockfile e configs de build/lint/typescript;
- `src/components/lamou/*`;
- `src/components/ui/*` usados pelo projeto;
- `src/lib/lamou/*`;
- `src/routes/*` e `routeTree.gen.ts`;
- `src/integrations/supabase/*` sem segredos;
- `drizzle/schema.ts` e migrations;
- `src/styles.css`;
- assets/metadata de Visual Lock e biblioteca de ícones;
- `supabase/config.toml`;
- `public/*` necessário ao build.

## Regra de segurança
Não reconstruir silenciosamente arquivos ausentes e não declarar o GitHub como cópia exata enquanto a comparação arquivo-a-arquivo não tiver sido concluída.

## Gate para Codex
**NÃO iniciar refatoração de produto antes de SOURCE_SYNC = PASS.**
Após o sync:
1. instalar dependências no diretório `owner-console/`;
2. rodar typecheck/build/lint;
3. registrar baseline de falhas antes de editar;
4. executar o handoff P0;
5. manter `main` e qualquer baseline FROZEN intocadas;
6. SALVAR ≠ PROMOVER.

## Pendência operacional
A primeira tarefa de Work/Codex é completar a transferência fiel do source do snapshot Lovable para `owner-console/` e produzir um relatório de comparação: `arquivo esperado → arquivo encontrado → hash/estado → divergência`.
