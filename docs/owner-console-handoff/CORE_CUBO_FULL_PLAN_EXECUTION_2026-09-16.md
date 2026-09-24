# LAMOU CORE — Execução integral do plano Cubo e Teorias

Data: 2026-09-16  
Branch: `candidate/lamou-owner-console-codex-2026-09-15`  
Estado esperado deste lote: `CANDIDATE_NOT_PROMOTED`

## O que este lote executa

Este lote transforma o plano anterior em um runner experimental reproduzível. O mesmo dataset sintético e o mesmo conjunto de tarefas são executados em:

- Planilhão / Grid;
- CORE Cubo;
- Cubo Mágico;
- Cubo Mágico Múltiplo;
- Prisma;
- Snapshot;
- Fantasma;
- Relação;
- Caleidoscópio;
- Pirâmide.

Nenhuma dessas medições autoriza promoção automática. O truth-state obrigatório é `SYNTHETIC_DEMO` e a execução dos grupos profissionais é identificada como `LOCAL_RULESET_ONLY`.

## Dataset comum

`LAMOU_CORE_CUBE_DEMO_V1` contém dois tenants e registros de telemetria industrial, áudio, imagem, OEE, cobrança, contratos, runtime de app, hipótese e evidência. Os objetos pesados são representados por referências `core://objects/...`, sem duplicar mídia bruta.

O segundo tenant existe deliberadamente para tornar vazamento entre tenants um teste negativo obrigatório.

## Métricas executadas

Para cada arquitetura o runner mede:

1. latência média local por recuperação;
2. acurácia de recuperação no corpus sintético;
3. taxa de sucesso por tarefa;
4. bytes de índice/estrutura derivada;
5. bytes médios de contexto entregue;
6. leituras de referências de objeto;
7. preservação de lineage/proveniência;
8. isolamento de tenant;
9. revisão dos cinco grupos técnicos;
10. bloqueio de promoção automática.

Latência de CI é evidência daquele runner/build/ambiente, não benchmark de produção.

## Execução dos grupos

Cada arquitetura recebe cinco regras profissionais independentes:

| Grupo | Gate executado |
|---|---|
| Data Architect | lineage + isolamento de tenant |
| Data Engineer | overhead de índice + leituras de objeto |
| Software Architect | contrato de recuperação e acurácia |
| Systems Engineer | latência + tamanho de contexto |
| Research Scientist | baseline Grid + one-change-at-a-time + truth-state + sem promoção automática |

`LOCAL_CHECK_PASS` significa que a regra determinística local passou. Não significa que um humano externo ou um provider de IA executou a avaliação.

## Persistência no CORE

A migration `0005_core_cube_experiment_runs.sql` cria um ledger append-only por tenant para guardar:

- build SHA e CI run;
- dataset/hash;
- baseline e target;
- métricas;
- revisões dos grupos;
- evidência;
- truth-state e escopo de execução.

RLS preserva leitura/escrita por membership. Não existem políticas UPDATE/DELETE para o fluxo normal, evitando reescrita silenciosa da evidência.

## Base científica usada como referência, não como prova do LAMOU

A hipótese de que estruturas hierárquicas, grafos e recuperação multimodal podem melhorar certas tarefas é compatível com literatura recente, mas os resultados desses trabalhos não podem ser transferidos automaticamente ao LAMOU:

- Huang et al. (2025), *Retrieval-Augmented Generation with Hierarchical Knowledge*, ArXiv.
- Chen et al. (2024), *KG-Retriever: Efficient Knowledge Indexing for Retrieval-Augmented Large Language Models*, IEEE ICKG.
- Shin et al. (2026), *HiKEY: Hierarchical Multimodal Retrieval for Open-Domain Document Question Answering*.

O Validation Gate do LAMOU exige benchmark próprio contra o Planilhão.

## Limites que permanecem

- `object-storage`: continua `NOT_CONNECTED` como storage universal; o benchmark testa manifestos/referências, não upload real.
- `ai-provider`: continua `NOT_CONNECTED`; nenhuma persona externa é simulada.
- `error-monitoring`: continua `NOT_CONNECTED` até provider real.
- `data-router`: passa a possuir implementação experimental local e benchmark, mas não vira router de produção.
- Pirâmide continua `PROPOSED_NOT_VERIFIED`, mesmo participando como protótipo comparativo.
- Nenhuma arquitetura experimental substitui o Planilhão automaticamente.

## Critério de fechamento deste lote

O lote só pode ser marcado como executado quando o CI do HEAD candidato comprovar:

`TypeScript → Tests → CORE Cubo Benchmark → Lint → Build`

e o resultado medido for persistido no ledger de experimentos com `SYNTHETIC_DEMO`.

**SALVAR ≠ PROMOVER.** `main/FROZEN` permanece inalterado.
