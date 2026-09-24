# LAMOU — Árvore Explicável de Saúde, Desempenho e Decisão

**Data:** 2026-09-15  
**Estado:** `EXPERIMENT_PROPOSAL / NOT_PROMOTED`  
**Branch:** `candidate/lamou-owner-console-codex-2026-09-15`  
**Governança:** `SALVAR ≠ PROMOVER`

## 1. Decisão de arquitetura

A solução é dividida em duas camadas, sem criar um produto duplicado:

- **CORE** = fonte canônica de cálculo, evidência, causalidade, comparação e explicação do resultado.
- **LABTEST** = superfície experimental para montar, arrastar, combinar e visualizar a árvore antes de qualquer promoção.

Enquanto não houver Validation Gate aprovado, a árvore visual permanece no **LABTEST** como candidata. Quando validada, a capacidade de cálculo/explicação pode ser promovida para o CORE sem mover os experimentos para produção.

## 2. Nome de trabalho

**LAMOU Explainable Health Tree**  
Alternativas de UI: **Árvore de Dados**, **Árvore de Saúde**, **Mapa de Causa & Resultado**, **Health Tree**.

Não criar app independente neste momento. Classificar como:

`CORE capability + LABTEST experimental surface`

## 3. Interação principal

Na coluna esquerda existe uma lista pesquisável de:

- Apps
- COREs
- Plugins
- Providers
- CALLs
- Integrações
- Produtos

O usuário seleciona ou arrasta um item para o canvas principal. Ao soltar, o sistema monta uma árvore explicável a partir dos dados existentes.

O nó raiz mostra:

- nome e versão;
- ambiente;
- estado de verdade;
- saúde geral, **somente se calculável**;
- última evidência;
- responsável;
- data da última verificação.

Cada ramificação deve responder **por que o resultado ficou assim**.

Exemplo:

`Saúde 82 → Segurança 90 → Dados 88 → Criptografia 95 → evidência EV-SEC-014`

ou

`Saúde NÃO CALCULÁVEL → Uso sem denominador → faturamento NOT_CONNECTED → score geral bloqueado`

## 4. Dimensões canônicas

A primeira candidata deve suportar estas dimensões. Nenhuma dimensão recebe nota sem fonte e denominador verificáveis.

### 4.1 Desempenho técnico

- latência p50 / p95 / p99 — **menor é melhor**;
- throughput — maior é melhor;
- disponibilidade — maior é melhor;
- taxa de erro — menor é melhor;
- consumo de memória/CPU/storage — menor é melhor para a mesma carga;
- tamanho de build/bundle — menor é melhor quando não reduz capacidade necessária;
- tempo de inicialização e resposta.

### 4.2 Confiabilidade / execução

- sucesso de jobs/CALLs;
- retries;
- recovery;
- incidentes;
- MTTR;
- idempotência;
- observabilidade;
- estabilidade entre versões.

### 4.3 Segurança

- autenticação;
- MFA;
- autorização e escopos;
- tenant/RLS;
- segredos;
- criptografia;
- auditoria;
- backup/restore;
- vulnerabilidades e dependências;
- conformidade aplicável.

### 4.4 Uso e adoção

- usuários ativos;
- frequência;
- retenção;
- profundidade de uso;
- funcionalidades realmente usadas;
- abandono;
- tempo para completar tarefa;
- taxa de sucesso da tarefa.

### 4.5 Negócio / vendas

- clientes ativos;
- vendas atribuíveis;
- receita recorrente quando houver fonte real;
- conversão;
- expansão/upsell;
- churn;
- custo de servir;
- margem quando calculável;
- valor entregue / resultado comprovado.

### 4.6 Evolução

- frequência de release;
- lead time;
- cobertura de testes;
- bugs por versão;
- regressões;
- velocidade de correção;
- compatibilidade;
- dívida técnica;
- histórico de melhoria.

### 4.7 Adaptabilidade

- quantidade de contextos suportados sem fork;
- configuração vs customização de código;
- suporte responsivo;
- acessibilidade;
- adaptação a dispositivo/ambiente;
- fallback SAFE-RECOVERY;
- capacidade de trocar provider/adapter.

### 4.8 Portabilidade / pluralidade

Usar **pluralidade** como capacidade de operar com múltiplas opções sem lock-in indevido:

- múltiplos providers;
- múltiplos modelos;
- múltiplos bancos/adapters;
- web/desktop/mobile quando realmente suportado;
- import/export;
- padrões abertos;
- baixo acoplamento.

### 4.9 Eficiência

- custo por operação;
- custo por usuário;
- consumo de infraestrutura;
- custo por resultado;
- energia/compute quando medível;
- trabalho manual evitado;
- complexidade operacional.

## 5. Classificação matemática

### 5.1 Regra principal

**Não existe nota geral se a base não for verificável.**

Cada métrica deve registrar:

`valor atual + direção desejada + alvo/faixa + unidade + fonte + timestamp + evidência + confiança`

### 5.2 Normalização

Para métricas em que **maior é melhor**:

`score = clamp(100 × (valor - mínimo_aceitável) / (alvo - mínimo_aceitável), 0, 100)`

Para métricas em que **menor é melhor**:

`score = clamp(100 × (máximo_aceitável - valor) / (máximo_aceitável - alvo), 0, 100)`

Se não houver alvo, faixa ou denominador verificável:

`score = NÃO_CALCULÁVEL`

### 5.3 Saúde de dimensão

Usar média ponderada somente dos componentes elegíveis:

`H_dimensão = Σ(wᵢ × sᵢ) / Σ(wᵢ)`

Condições:

- peso deve ser explícito e versionado;
- componente sem evidência não entra silenciosamente no denominador;
- a UI deve mostrar cobertura da nota, por exemplo `82/100 · cobertura 7/10 métricas`;
- se a cobertura mínima definida não for atingida, mostrar `NÃO CALCULÁVEL / NOT_VERIFIED`.

### 5.4 Saúde geral

`H_total = Σ(Wd × H_dimensão) / Σ(Wd)`

Somente dimensões elegíveis participam. A tela deve sempre mostrar **composição, pesos, cobertura e motivo do resultado**.

## 6. Árvore de explicação

Cada nó pode abrir filhos em quatro níveis:

1. **Dimensão** — Segurança, Uso, Desempenho, Negócio etc.
2. **Métrica** — Latência, vendas, incidentes, MFA etc.
3. **Causa / componente** — processo, provider, modelo, versão, configuração, combinação de COREs/plugins.
4. **Evidência** — teste, log, documento, série, CALL, benchmark, commit/build.

A árvore também deve mostrar relações de composição:

- `Resultado → processo que produziu`
- `Resultado → COREs usados`
- `Resultado → plugins/providers/modelos usados`
- `Resultado → versão/build`
- `Resultado → dados/fontes`
- `Resultado → evidências`

Exemplo:

`Latência 320 ms`
→ `Processo: análise de caso`
→ `CALL: ai.councilRun`
→ `Provider: NOT_CONNECTED`
→ `Fallback: checklist local`
→ `Resultado: não comparar com execução de IA real`

## 7. Recomendações em 3 opções

Qualquer recomendação importante deve oferecer **até 3 alternativas comparáveis**, nunca um “melhor” inventado.

Formato:

- **Opção A — conservar / otimizar atual**
- **Opção B — substituir componente**
- **Opção C — arquitetura alternativa / fallback**

Para cada opção:

- motivo;
- ganho esperado **somente se houver evidência**;
- risco;
- dependências;
- custo;
- impacto nas demais dimensões;
- reversibilidade;
- evidências;
- teste necessário;
- truth-state.

Exemplo Segurança:

`Identidade`
- A: manter Auth atual + endurecer MFA;
- B: provider externo candidato;
- C: SAFE-RECOVERY local limitado.

A UI explica **por que cada opção pode ser adequada**. A decisão final permanece humana.

## 8. Visual Lock inicial

Estrutura aprovada para exploração:

- sidebar LAMOU existente;
- lista à esquerda com App / CORE / Plugin;
- canvas central com árvore;
- nó raiz com saúde/estado;
- ramos por dimensão;
- sub-ramos por métricas;
- terceiro nível com causas/componentes;
- nível final com evidências e 3 opções;
- painel inferior com métricas principais, saúde por dimensão e recomendações;
- third column / Context Detail Sheet para detalhe sem perder a árvore;
- dark navy/charcoal + cyan/violet controlados;
- vermelho apenas para falha/bloqueio real;
- cinza para não verificado;
- amarelo para atenção/parcial;
- verde somente com prova.

A imagem conceitual gerada nesta conversa é referência visual candidata, **não implementação e não Visual Lock promovido**.

## 9. Truth-state e evidência

Todo nó deve expor:

- `truth_state`;
- `source_id`;
- `evidence_ids[]`;
- `build`;
- `environment`;
- `last_verified_at`;
- `owner`;
- `confidence` quando aplicável e fundamentada.

Sem evidência:

- não mostrar `FACT`;
- não mostrar `PASS`;
- não inventar probabilidade;
- não inventar ganho percentual;
- não inventar benchmark.

## 10. Modelo de dados mínimo

```text
Entity
 ├── identity
 ├── version/build
 ├── bindings[]
 ├── dimensions[]
 │    ├── score | NOT_CALCULABLE
 │    ├── coverage
 │    └── metrics[]
 │         ├── value
 │         ├── target/range
 │         ├── direction: HIGHER_IS_BETTER | LOWER_IS_BETTER | RANGE
 │         ├── source/evidence
 │         └── contributors[]
 ├── causal_links[]
 ├── recommendations[]
 │    ├── option A
 │    ├── option B
 │    └── option C
 └── history[]
```

## 11. Fluxo LABTEST → CORE

1. Selecionar entidade no LABTEST.
2. Montar árvore apenas com dados existentes.
3. Marcar lacunas como NOT_VERIFIED / NOT_CONNECTED.
4. Testar cálculo e pesos contra baseline PINNED.
5. Alterar uma variável por vez quando estiver experimentando pesos/algoritmos.
6. Registrar evidência e comparação.
7. Passar Validation Gate.
8. Somente depois propor promoção da capability de cálculo/explicação para CORE.

**SALVAR ≠ PROMOVER.**

## 12. Classificação desta proposta

- Produto independente: **NÃO**
- Capability CORE: **SIM, candidata**
- Superfície LABTEST: **SIM**
- Implementação atual: **NÃO**
- Estado: `EXPERIMENT_PROPOSAL / NOT_VERIFIED`
- Promoção: **BLOQUEADA até Validation Gate**
