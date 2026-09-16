# LAMOU CORE — Cubo e Teorias

Data: 2026-09-16  
Branch: `candidate/lamou-owner-console-codex-2026-09-15`  
Estado: `CANDIDATE_NOT_PROMOTED`

## Objetivo

Transformar as ideias de organização de dados do LAMOU em contratos técnicos testáveis, preservando a regra de que metáfora visual não pode virar alegação de mecanismo comprovado sem benchmark e evidência.

## Regra central

O **Planilhão / linha e coluna** permanece o baseline de referência. Cubo, Cubo Mágico, Cubo Mágico Múltiplo, Prisma, Snapshot, Fantasma, Relação e Caleidoscópio são experimentais. Pirâmide permanece `PROPOSED_NOT_VERIFIED`.

Nenhuma arquitetura experimental é promovida automaticamente para produção. Cada experimento deve comparar uma única mudança contra o baseline e produzir evidência reproduzível.

## Arquiteturas registradas

| Arquitetura | Estado | Tradução técnica | Hipótese principal |
|---|---|---|---|
| Planilhão / Linha e Coluna | BASELINE_REFERENCE | Relacional/tabular | Melhor baseline para auditoria, exportação e comparação |
| CORE Cubo | EXPERIMENTAL_NOT_PROMOTED | Índices hierárquicos/relacionais por contexto | Reduzir custo de localização e montagem do contexto |
| Cubo Mágico | EXPERIMENTAL_NOT_PROMOTED | Ranking + índice + cache formam working set frontal | Entregar somente células relevantes ao orquestrador |
| Cubo Mágico Múltiplo | EXPERIMENTAL_NOT_PROMOTED | Manifestos multimodais com hash, metadados e ponteiros | Aproximar som, imagem, sinal, bit e documento sem duplicar mídia pesada |
| Prisma | EXPERIMENTAL_NOT_PROMOTED | Views/projeções derivadas | Adaptar perspectiva sem criar verdade paralela |
| Snapshot | EXPERIMENTAL_NOT_PROMOTED | Manifesto temporal imutável | Melhorar reprodução, rollback e auditoria |
| Fantasma | EXPERIMENTAL_NOT_PROMOTED | Overlay temporário/descartável | Simular sem contaminar CURRENT/FROZEN |
| Relação | EXPERIMENTAL_NOT_PROMOTED | Índice de grafo/arestas | Reduzir saltos em investigações multientidade |
| Caleidoscópio | EXPERIMENTAL_NOT_PROMOTED | Composição governada de perspectivas | Reduzir ruído conforme papel/objetivo mantendo a mesma verdade |
| Pirâmide | PROPOSED_NOT_VERIFIED | Proposta de níveis de síntese/detalhe | Ganho ainda não demonstrado |

## Personas e capacidades

Todas as arquiteturas usam como conselho mínimo:

- Data Architect
- Data Engineer
- Software Architect
- Systems Engineer
- Research Scientist

Capacidades associadas:

- `data-router`
- `object-storage`
- `usage-telemetry`
- `validation-gate`

A seleção das personas é um contrato local governado. Não equivale a alegar execução de provider externo.

## Evidência obrigatória para comparar com o Planilhão

Cada teoria precisa, no mínimo, de:

1. benchmark de latência;
2. acurácia de recuperação ou sucesso da tarefa;
3. overhead de armazenamento e indexação;
4. preservação de lineage/proveniência;
5. evidência de isolamento tenant/permissão;
6. build e ambiente reproduzíveis.

## Interpretação correta das metáforas

### Cubo

“Corredores → salas → armários → objetos” representa caminhos de contexto e índices. O dado canônico não precisa ser fisicamente movido para existir dentro de uma sala visual.

### Cubo Mágico

“O quadrado vir para a frente” representa ranking e recuperação priorizada. A face frontal é o **working set** que o orquestrador recebe naquele momento.

### Cubo Mágico Múltiplo

Uma célula pode representar texto, número, som, imagem, sinal, bit ou documento, mas mídia pesada deve preferencialmente ficar em object storage. A célula guarda manifesto, hash, proveniência, metadados e ponteiros.

### Caleidoscópio

Muda a perspectiva, não a verdade. Cliente, qualidade, produtividade, risco ou financeiro podem ver composições diferentes dos mesmos IDs e fontes.

## Estado de execução deste lote

Materializado em código:

- registry canônico `core-cube-theories.ts`;
- 10 arquiteturas registradas;
- truth-state explícito por arquitetura;
- baseline Planilhão preservado;
- função de plano experimental one-change-at-a-time;
- promoção experimental bloqueada por padrão;
- testes para working set do Cubo Mágico, mídia multimodal por referência, Pirâmide não verificada e cobertura mínima de personas/capacidades/evidência.

## O que NÃO foi alegado

Este lote não afirma benchmark de desempenho, redução real de latência, melhor acurácia, object storage conectado ou Data Router de produção. Esses resultados precisam ser medidos no LABTEST com dados, runner e evidência.

## Próximo gate

1. materializar um dataset de teste comum;
2. rodar o mesmo conjunto de tarefas no Planilhão baseline e em uma arquitetura experimental por vez;
3. medir latência, precisão, custo, memória, leitura de objetos, lineage e segurança;
4. registrar evidência no Validation Gate;
5. manter experimental se não houver ganho claro ou se houver regressão relevante.

**SALVAR ≠ PROMOVER.** `main/FROZEN` permanece fora desta execução.
