# LAMOU Owner Console — HANDOFF PARA CODEX

## Missão

Finalizar tecnicamente o **LAMOU Owner Console** a partir do código sincronizado do Lovable, preservando o cockpit visual aprovado e corrigindo primeiro estrutura, navegação, estados de verdade, integração e testes. **Não redesenhar do zero.** Não publicar nem promover automaticamente.

## Fonte de verdade de entrada

- Repo: `rafalamounier1805-ship-it/lamoumusicpromoter1`
- Branch de trabalho: `candidate/lamou-owner-console-codex-2026-09-15`
- Snapshot Lovable que deve ter sido sincronizado pelo Work: `532025926ff73e837c5f38be08fd76665ff457e5`
- Project Lovable: `bee5a2f8-878d-4954-a168-029ef7399b36`
- Prompt Mestre anterior: `docs/PROMPT_MESTRE_FINALIZACAO_OWNER_2026-09-15.md`
- Este handoff complementa o Prompt Mestre e prevalece para as correções mais recentes.

## Regras invioláveis

1. PRIMEIRO: O QUE NÓS JÁ TEMOS? Inventariar antes de editar.
2. Não reconstruir telas aprovadas.
3. SALVAR ≠ PROMOVER. Nunca tocar em `main` ou baseline FROZEN.
4. Não inventar integração, dado, teste, evidência, probabilidade, meta ou porcentagem.
5. Estados aceitos: FACT/EVIDENCED, EXTERNAL_EVIDENCE, HYPOTHESIS, SYNTHETIC_DEMO, NOT_VERIFIED, BLOCKED, IMPLEMENTED_VERIFIED, IMPLEMENTED_NOT_VERIFIED, PARTIAL, SIMULATED, DOCUMENTED_ONLY, NOT_CONNECTED, NOT_APPLICABLE.
6. Antes de remover: KEEP / IMPROVE / RELOCATE / MERGE / DEPRECATE / REMOVE.
7. Sem botão placebo, link morto ou “teste” baseado em `setTimeout`.
8. Visual Locks são referência de composição, nunca screenshot embutido como UI.
9. Preservar Owner × Cliente e SOL × LUA.
10. Código primeiro; Lovable só volta no final se houver necessidade exclusivamente visual.

## P0 — Correções estruturais imediatas

### 1. Cognitive / Cockpit

Preservar o visual atual, que foi aprovado. Corrigir comportamento:

- `Somente críticos`: filtrar **apenas `critico` e `falha`**. `probabilidade` deve ter filtro/estado próprio; pendência aberta sozinha não torna módulo crítico.
- KPI “Módulos exibidos”: cada item da terceira coluna deve ser clicável e abrir o destino correto.
- KPI/Lista de ocorrências: deep-link para `/owner/mapa-vivo` com `case_id` selecionado.
- “Falhas & criticidade”: a lista deve conter exatamente os itens que compõem o número mostrado.
- “Versões/Candidatas”: se não houver histórico de promoção, declarar isso e oferecer destino real para Versões; não deixar texto morto.
- Retirar Oportunidades do protagonismo do bloco principal do Cognitive; manter na superfície própria e, se necessário, num resumo secundário.
- SOL/LUA/DEMO/ambiente/truth context devem ficar no **cabeçalho/contexto global**, não espalhados pelos cards.

### 2. Saúde & Evidências

Criar um modelo de saúde realmente útil:

- Saúde geral calculável somente quando houver denominadores/pesos verificáveis; caso contrário mostrar `NÃO CALCULÁVEL / NOT_VERIFIED`.
- Mostrar composição: quais dimensões puxam a saúde para cima/baixo.
- Mostrar atual × meta/faixa saudável × tendência × fonte × última verificação × responsável.
- Bloco **“Melhorar hoje”** com 3–5 ações priorizadas, cada uma com impacto esperado qualitativo ou quantitativo apenas se evidenciado, responsável, prazo e CTA real.
- `NOT_CONNECTED` não é automaticamente vermelho/crítico. Vermelho apenas para falha/bloqueio/erro real; amarelo para atenção/parcial; cinza para não verificado; verde só comprovado.
- Usar ícone semântico por domínio e um marcador compacto de truth-state, por exemplo `F` verde para FACT/EVIDENCED, sempre com legenda acessível.
- Incluir gráficos úteis: tendência temporal quando houver série, atual × meta, composição de saúde e sparklines. Se não houver série, dizer “sem série histórica”, não fabricar gráfico.

### 3. Mapa Vivo

O Mapa Vivo **detecta e encaminha**. Não é o lugar do raciocínio técnico completo.

Manter no Mapa:
- o que aconteceu;
- quando;
- onde / entidade afetada;
- quem/responsável;
- métricas afetadas;
- criticidade;
- origem/proveniência do sinal;
- destino/encaminhamento.

Remover do Mapa e realocar para `CORE > Planos de Ação & Melhorias`:
- cadeia Origem → Sinal → Problema → Benchmark → Hipótese → Evidência → Teste → Decisão → Ação → Resultado → Eficácia → Aprendizado;
- análise de IA;
- hipótese técnica;
- investigação profunda;
- criação/gestão do plano técnico.

No Mapa, o painel direito continua contextual. CTA “Analisar/Resolver” deve abrir/criar o caso técnico correspondente no CORE carregando apenas facts: `case_id`, timestamp, métricas, severidade, origem e responsável. Nunca inventar hipótese.

### 4. Produtos + Aplicativos

Hoje existem `/owner/products` e `/owner/apps` com modelos concorrentes. **Unificar a experiência gerencial sem perder dados**.

Modelo canônico em Central > Produtos:
- Incubados do Proprietário;
- Produtos Comerciais;
- CORE/Plataforma;
- Plugins/Providers;
- Qualidade & SAC.

Cada produto/app deve usar o modelo Cognitive aprovado: qualidade, saúde, uso/adoção, clientes, falhas/incidentes, versão, evidências, evolução, histórico, bindings, custos quando reais, benchmark quando disponível e gráficos. Família/classificação é metadado secundário.

Não esconder app existente. Reconciliar catálogo completo antes de excluir/mesclar qualquer rota.

Corrigir `appRoute()`: slug desconhecido **não pode cair silenciosamente em Research Scout**. Deve bloquear/retornar rota segura com estado explícito.

### 5. CORE

Menu raiz já está correto e deve permanecer exatamente com 9 itens:
1. Visão Geral
2. Indicadores de Saúde
3. Arquitetura Técnica
4. Aplicativos, Plugins & Demais Bindings
5. Planos de Ação & Melhorias
6. Testes & Qualidade
7. Versões & Atualizações
8. Observabilidade
9. Configurações

`/core/ai`, `/core/data`, `/core/security`, `/core/calls`, `/core/trainings`, `/core/sol-lua` podem existir por compatibilidade, mas são **superfícies de detalhe**, nunca menu raiz.

Substituir a Visão Geral genérica (`ModulePage`) por resumo visual conectado: saúde → riscos → problemas → planos → testes → versões → prioridade. Sem duplicar Central.

### 6. LABTEST

Preservar fila, estágios, blockers, risco e SALVAR ≠ PROMOVER. Corrigir:
- migrar Sheet/modal para terceira coluna/contexto quando fizer sentido;
- implementar contrato real para one-change-at-a-time: clonar baseline, alterar uma variável, executar/registrar resultado, comparar e guardar evidência;
- sem runner, permanecer NOT_CONNECTED; ensaio DEMO nunca vira PASS;
- SOL referência, LUA candidata/experimento.

### 7. Instalações

Owner:
- reconciliar estados stale de DB/Auth/GitHub com evidência atual;
- manter MFA como IMPLEMENTED_NOT_VERIFIED enquanto não validado;
- adicionar transição pós-instalação: concluído, bloqueado, opcional, pendente de verificação, próximos passos; CTAs reais.

Cliente:
- remover placebo de “Reverificar” baseado em timeout;
- manter a jornada como UI/provisionamento não conectado até existir backend real;
- implementar depois tenant, usuários, RLS, entitlements, CORE Cliente, apps licenciados e testes negativos;
- readiness final com blockers/evidências e pós-instalação.

### 8. Cliente 360

Preservar as 8 abas. Reconciliar fonte de verdade:
- hoje ficha/cliente vem de fixtures enquanto cobranças podem vir do banco;
- migrar progressivamente para domínio único real, mantendo fixtures claramente DEMO até migração;
- comunicação/backup/update não devem parecer reais se não há executor.

### 9. Visual

Preservar o cockpit atual. Evoluir sem “recomeçar”:
- base dark navy/charcoal;
- neon cyan/violet controlado;
- textura/depth/grid sutil;
- menos branco/baby blue;
- vermelho só para crítico/bloqueio;
- ícones oficiais/semânticos onde houver asset da biblioteca;
- tipografia e espaçamento consistentes;
- acessibilidade WCAG, foco, teclado, 360/768/1440.

A biblioteca de ícones já existe como asset no projeto Lovable; fazer binding real, não apenas Lucide genérico, sem quebrar acessibilidade.

## P0 — API + Conselho de Profissionais

O catálogo profissional é forte, mas a execução atual ainda é catálogo/ranking. Corrigir arquitetura sem fingir autonomia.

### Problemas atuais

- `rankRoles()` = score simples por `fit[taskType]` + top N.
- `CALL-0003 ai.councilRun` está NOT_CONNECTED e grande demais.
- rota apontada `/owner/conselho` não existe no projeto atual.
- Red Team, síntese, divergência, custo, RAG e execuções independentes não estão operacionais.
- `COUNCIL_RUNS_SEED` não pode ser FACT/EVIDENCED se `persisted=false`, custo ausente e provider não conectado.
- reconciliar contagem de perfis: texto declara 38; seeds atuais precisam ser contados e a UI deve usar contagem dinâmica.
- matriz de testes de CALL deve obedecer ao padrão oficial completo, não apenas 9 cenários parciais.

### Arquitetura alvo

Separar o conselho em contratos pequenos e auditáveis:

`Council Intake → Context/Evidence Retriever → Professional Router → Permission/Tool Resolver → Specialist Runs → Contraditor/Red Team → Synthesis → Validation/Evidence Gate → Human Approval → Action`

Cada Professional Role deve possuir:
- competências;
- perguntas necessárias;
- evidências;
- critérios;
- red flags;
- DoD;
- tools/CALLs permitidos;
- dados/scopes permitidos;
- custo/limite;
- evals e histórico de acerto/erro quando houver evidência.

Router deve considerar não só aderência, mas risco, evidência disponível, ferramentas/conexões, custo, privacidade, disponibilidade e necessidade de revisão independente. Se IA externa estiver indisponível, usar apenas ranking/checklists locais e rotular corretamente.

### CALL Contract obrigatório

Para cada CALL: ID, origem → destino, finalidade, versão, estado, responsável, consumidor, auth/scopes, tenant, input/output/schema, fontes/dados, timeout, retry, idempotência, fallback/SAFE, custo/limites, logs/tracing, riscos, dependências, último teste, evidência, histórico.

Testes mínimos por CALL:
1. success
2. invalid input
3. unauthenticated
4. unauthorized
5. wrong tenant
6. timeout
7. provider offline
8. unexpected schema
9. retry/idempotency
10. fallback/SAFE
11. recovery
12. audit/tracing

PASS somente com evidência vinculada ao mesmo commit/build/ambiente.

## Ordem de implementação do Codex

1. Inventário + build baseline + testes atuais.
2. Corrigir filtro crítico, deep-links e navegação quebrada.
3. Mapa Vivo → CORE e remoção da cadeia técnica do Mapa.
4. Unificar Produtos/Aplicativos e corrigir app routing.
5. Saúde geral + melhorar hoje + truth-state/cor.
6. CORE visão geral e reconciliação de detalhe.
7. API/Conselho + CALL Registry.
8. Instalações e Cliente 360.
9. LABTEST one-change-at-a-time.
10. Ícones, gráficos, textura e polimento visual.
11. Testes, acessibilidade, responsividade e documentação.
12. Gerar relatório final de evidências. **Não promover.**

## Testes obrigatórios

- `bun/npm install` reprodutível.
- typecheck, lint e build.
- navegação de todas as rotas reais.
- filtros críticos com casos unitários.
- deep-link `case_id` Cognitive → Mapa.
- Mapa → CORE preservando facts e sem hipótese inventada.
- route unknown slug não redireciona silenciosamente.
- estados truth/cor.
- responsive 360×800, 768×1024, 1440×900.
- teclado/foco/ARIA.
- auth sem segredo no frontend.
- RLS/tenant negativo onde houver banco real.
- CALL contract tests.
- nenhum `setTimeout` usado para simular verificação/teste.

## Definition of Done

- Nenhum link morto/placebo.
- Nenhuma rota aponta para conteúdo semanticamente errado.
- Nenhum estado CONNECTED/PASS/FACT sem evidência.
- Central gerencial; CORE técnico; LABTEST experimental; Cliente isolado.
- Cognitive preservado visualmente e agora operacional.
- Mapa detecta/encaminha; CORE investiga/resolve.
- Produtos têm leitura Cognitive por item.
- Saúde responde: “como está?”, “por quê?”, “o que faço hoje?”.
- API/Conselho é auditável e modular.
- Documentação e CALLs atualizados.
- Candidata buildável e testada.
- **SALVAR ≠ PROMOVER.**
