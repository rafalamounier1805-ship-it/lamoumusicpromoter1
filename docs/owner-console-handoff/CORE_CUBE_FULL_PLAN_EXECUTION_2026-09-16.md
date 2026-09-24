# LAMOU CORE — Execução Completa do Plano Cubo e Teorias

Data: 2026-09-16
Estado: `CANDIDATE_NOT_PROMOTED`
Branch: `candidate/lamou-owner-console-codex-2026-09-15`
Build verificado: `20e33ccebebc15d4bdcdd8667ea1b776dddeec03`
CI verificado: `35147607051`

## Resultado executivo

O plano experimental CORE Cubo foi executado de ponta a ponta no ambiente de candidata com dataset sintético controlado `LAMOU_CORE_CUBE_DEMO_V1`.

Foram executadas as 10 arquiteturas/teorias registradas:

1. Planilhão / Linha e Coluna (`grid`) — baseline.
2. CORE Cubo (`cube`).
3. Cubo Mágico (`magic-cube`).
4. Cubo Mágico Múltiplo (`multi-magic-cube`).
5. Prisma (`prism`).
6. Snapshot (`snapshot`).
7. Fantasma (`ghost`).
8. Relação (`relation`).
9. Caleidoscópio (`kaleidoscope`).
10. Pirâmide (`pyramid`).

## Escopo real da execução

Truth-state de todos os resultados: `SYNTHETIC_DEMO`.

Escopo: `CANDIDATE_CI` / `LOCAL_RULESET_ONLY`.

Isso significa que houve execução real do motor e dos testes sobre dados sintéticos, mas não autorização para declarar ganho em produção, superioridade universal, provider externo executado ou promoção automática.

## Evidência comum

- dataset: `LAMOU_CORE_CUBE_DEMO_V1`;
- registros: 12;
- tarefas de recuperação: 6;
- iterações por benchmark: 250;
- testes do gate registrado: 71;
- falhas registradas: 0;
- expect/assertions registrados: 766;
- isolamento de tenant: preservado nos resultados;
- linhagem/proveniência: preservada nos resultados;
- `promotion_allowed`: `false` para todos os resultados desta rodada.

## Resultados registrados no CORE

| Arquitetura | Latência observada (ms) | Index bytes | Object reads | Context bytes | Retrieval accuracy | Task success |
|---|---:|---:|---:|---:|---:|---:|
| grid | 0.036832 | 0 | 8 | 512 | 1.00 | 1.00 |
| cube | 0.009959 | 5255 | 7 | 353 | 1.00 | 1.00 |
| magic-cube | 0.031945 | 2523 | 8 | 512 | 1.00 | 1.00 |
| multi-magic-cube | 0.032000 | 3176 | 8 | 926 | 1.00 | 1.00 |
| prism | 0.033951 | 2056 | 8 | 512 | 1.00 | 1.00 |
| snapshot | 0.035454 | 758 | 8 | 512 | 1.00 | 1.00 |
| ghost | 0.033880 | 1588 | 8 | 512 | 1.00 | 1.00 |
| relation | 0.033010 | 371 | 8 | 512 | 1.00 | 1.00 |
| kaleidoscope | 0.035786 | 1817 | 8 | 512 | 1.00 | 1.00 |
| pyramid | 0.034406 | 1593 | 8 | 512 | 1.00 | 1.00 |

### Leitura correta

Neste microbenchmark sintético, `cube` apresentou a menor latência observada e reduziu object reads/context bytes em relação ao baseline. Isso é somente uma evidência experimental inicial. O conjunto é pequeno demais para sustentar promoção ou conclusão de superioridade geral.

O `multi-magic-cube` preservou a proposta multimodal, mas aumentou o tamanho de contexto nesta rodada. Isso deve ser tratado como custo a medir, não como falha automática.

Todas as arquiteturas obtiveram 100% de acerto nas seis tarefas sintéticas; portanto este dataset não diferencia qualidade de recuperação entre as arquiteturas e deve ser ampliado nas próximas rodadas.

## Grupos profissionais executados no gate local

Cada arquitetura passou pelas lentes locais governadas de:

- Data Architect;
- Data Engineer;
- Software Architect;
- Systems Engineer;
- Research Scientist.

Estado registrado por persona: `LOCAL_CHECK_PASS`.

Isso significa que os contratos/checklists locais foram satisfeitos. Não significa que cinco profissionais humanos ou cinco providers externos independentes executaram revisão.

## CI

O workflow `Owner Console Candidate CI` do build acima concluiu com sucesso:

- TypeScript — PASS;
- Tests — PASS;
- CORE Cubo Benchmark — PASS;
- Lint — PASS;
- Build — PASS.

O pacote completo da candidata também foi gerado com sucesso para o mesmo build.

## O que o plano já fechou

- teoria → contrato técnico;
- dataset sintético controlado;
- execução das dez arquiteturas;
- benchmark repetível;
- métricas comparáveis;
- lineage/proveniência;
- isolamento de tenant no escopo testado;
- grupos/personas vinculados;
- resultado persistido em `lamou_core_experiment_runs`;
- CI com etapa própria `CORE Cubo Benchmark`;
- geração de dados de experimento para o CORE.

## O que ainda precisa de segunda passagem antes de produção

1. Dataset maior, heterogêneo e com casos difíceis/ambíguos.
2. Dados reais autorizados de um caso piloto, sem contaminar o baseline.
3. Shadow/Dry Run para alternativas e Canary controlado antes de elegibilidade.
4. Medição de p95/p99, memória, CPU, custo de storage/indexação e concorrência.
5. Testes de falha, corrupção, perda de referência, rollback e recuperação.
6. Multimodal real para áudio, imagem, sinais/sensores e objetos grandes.
7. Cross-tenant negativo Cliente A × Cliente B em escala de experimento.
8. Orquestrador consumindo working-set real do Data Router e registrando evidence IDs.
9. Comparação em datasets onde accuracy/task-success possam divergir.
10. Gate humano de promoção após evidência suficiente.

## Decisão de governança

- Planilhão permanece `BASELINE_REFERENCE`.
- Cubo e demais teorias permanecem experimentais.
- Nenhuma arquitetura foi promovida automaticamente.
- Os resultados desta rodada podem orientar a próxima bateria, mas não substituem validação real.

**SALVAR ≠ PROMOVER.** `main/FROZEN` permanece fora desta execução.
