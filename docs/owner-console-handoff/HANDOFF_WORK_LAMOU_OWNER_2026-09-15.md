# LAMOU Owner Console — HANDOFF PARA CHATGPT WORK

## Objetivo

Assumir o projeto **LAMOU Owner Console** sem gastar novos créditos de construção do Lovable e sem refazer o que já existe. O Work deve atuar primeiro como **operador de migração/auditoria**, não como agente de redesign.

## Snapshot congelado

- Lovable project: `bee5a2f8-878d-4954-a168-029ef7399b36`
- Workspace: `8w6y7aaHd7K7TQ34FDRh`
- Nome: `LAMOU Owner Console`
- Estado: `ready`
- Publicado: **não**
- Último commit interno Lovable: `532025926ff73e837c5f38be08fd76665ff457e5`
- Última edição observada: `2026-09-15T19:26:13.635Z`
- Preview: `https://id-preview--bee5a2f8-878d-4954-a168-029ef7399b36.lovable.app`
- GitHub canônico: `rafalamounier1805-ship-it/lamoumusicpromoter1`
- Branch de handoff criada: `candidate/lamou-owner-console-codex-2026-09-15`
- Baseline anterior com Prompt Mestre: `candidate/lamou-owner-platform-2026-09-15` @ `6fa57202dee989c7de04d08aff9e93e7f75cbcc9`

## Regra principal

**NÃO enviar novas mensagens de construção ao agente do Lovable.** Leitura, navegação, exportação e QA são permitidos; qualquer ação que consuma crédito de build deve ser evitada.

## Missão do Work

1. Abrir o projeto Lovable e confirmar o snapshot acima.
2. Exportar/sincronizar o **código-fonte completo do commit Lovable `532025...`** para o GitHub, sem sobrescrever `main` e sem mexer em baselines FROZEN.
3. Preferir a branch `candidate/lamou-owner-console-codex-2026-09-15`.
4. Se o Lovable oferecer integração GitHub/export ZIP, usar a opção que preserve todo o source tree, migrations, configs e assets. Se não houver exportação direta, baixar o projeto e subir o source completo para a branch candidata.
5. Depois do sync, comparar o conteúdo GitHub com o manifesto deste handoff: `package.json`, `drizzle/`, `src/`, `supabase/`, configs e assets devem existir.
6. Não publicar, não promover, não fazer deploy de produção.
7. Fazer QA visual do preview atual e registrar screenshots/achados, sem pedir ao Lovable para corrigir.
8. Entregar ao Codex a branch com o código sincronizado e o arquivo `HANDOFF_CODEX_LAMOU_OWNER_2026-09-15.md`.

## Critérios de aceite da migração

- Branch candidata contém código completo e buildável do Owner Console.
- Commit de origem Lovable registrado no README/handoff.
- Nenhum segredo copiado para o repositório.
- `main` intocado.
- Nenhuma promoção/deploy.
- Divergências entre Lovable e GitHub documentadas.
- Se algum asset binário não puder ser exportado, registrar exatamente qual e manter referência/proveniência.

## QA do Work após o sync

Validar pelo navegador, sem alterar código: Cognitive/Cockpit, filtro de críticos, Mapa Vivo, Produtos/Aplicativos, Cliente 360, CORE 9 itens, LABTEST, Instalação do Proprietário, Instalação do Cliente, Configurações e rotas de app. Registrar cliques mortos, modal/sheet onde deveria haver terceira coluna, estados stale, erros responsivos e qualquer diferença entre a UI e o contrato descrito no handoff do Codex.

## Governança

PRIMEIRO: O QUE NÓS JÁ TEMOS? → SOURCE AVAILABILITY GATE → SALVAR ≠ PROMOVER → FROZEN CHANGE PROTOCOL → GOLD SCOPE LOCK → ARTIFACT COMPLETENESS GATE → EVIDENCE-BASED STATUS.
