# LAMOU Ranking AI — Etapa 3
## Ranking, Benchmark de Mercado e Proveniência

Versão: 1.3.0
Data de fechamento: 23/08/2026

## Objetivo
Adicionar a camada mercadológica sem contaminar a avaliação técnica construída nas Etapas 1 e 2.

## Princípios preservados
- TQS não recebe pontos por fama, chart ou streams.
- Ausência de dado público não é tratada como baixo desempenho.
- MPI e IRS numéricos não são calculados quando faltam dados verificáveis.
- Origem Suno/Udio/IA nunca é inferida pelo som.
- Comparadores externos têm justificativa, fonte, posição, período, território, peso e evidência.

## O que foi implementado
### Ranking
Cinco visões dentro da área Ranking:
1. Qualidade técnica
2. Sinais públicos de mercado
3. Investment Radar
4. Benchmark 50
5. Origem / IA

### Pool externo de mercado
50 referências externas únicas:
- 40 do Billboard Brasil Hot 100 — semana de 17/08/2026
- 10 do Billboard Global Excl. U.S. — semana de 22/08/2026

A duplicata SWIM/BTS foi removida do recorte global e substituída pela posição 11 global, preservando 50 referências únicas.

Fontes públicas:
- https://billboard.com.br/billboard-brasil-hot-100/
- https://ca.billboard.com/charts/billboard-global-excl-us
- Recorte Sertanejo: https://billboard.com.br/sertanejo-15-mais-ouvidas-hot-100-agosto-2026/
- Recorte Funk: https://billboard.com.br/funk-15-mais-ouvidas-hot-100-semana-agosto-2026/

## Distribuição do benchmark principal
Meta:
- 15 mesmo gênero/subgênero
- 10 mesmo idioma
- 10 mesmo mercado/região
- 5 globais
- 5 emergentes/movimento recente
- 5 históricas/consolidadas

Duplicatas são proibidas. No exemplo CARTAS RASGADAS, o pool atual fecha 50/50 com 100% da distribuição. Para outros gêneros, o tamanho pode ser menor; o sistema mostra a falta em vez de completar com referências não pertinentes.

## Sinais públicos do catálogo LAMOU
A fotografia inicial preserva apenas sinais públicos já auditados em Apple Music e Amazon Music. Não são contagens de streams. Esses sinais nunca alteram TQS.

## Investment Radar
- 🔥 Acelerar — candidato
- 💎 Hidden Gem — candidato
- 🛠 Otimizar / testar
- 🧪 Testar

A palavra “candidato” é obrigatória enquanto MPI/CPS completos não existirem.

## MPI e IRS
Permanecem sem nota numérica quando não existem streams, alcance e conversão verificáveis suficientes.

## Proveniência / IA
Registro local possível: Não confirmada, Suno, Udio, outra plataforma generativa, produção tradicional ou híbrida. A fonte do registro também é salva. Declaração do usuário não é apresentada como verificação externa.

## Importar/exportar benchmark
Pacote JSON com references[]; mínimo 25 para benchmark rápido, 50+ para principal, exigindo título, artista, fonte, território e data de coleta.

## Testes
- Sintaxe JS verificada por Node.
- Pool externo: 50 registros; duplicatas: 0.
- CARTAS RASGADAS: 50/50, distribuição 15/10/10/5/5/5.
- Investment Radar: regras determinísticas testadas.

## O que NÃO foi inventado
- streams individuais do Spotify/Apple/Amazon
- MPI, IRS, AIS ou CPS completo
- origem Suno/Udio de faixas externas
- percentual de IA sem documentação

## Próxima etapa
Etapa 4 — Inteligência de carreira / Artist 360 profundo, DNA Musical, gargalo, Release Readiness, Artist Readiness, Career Momentum, Discovery Gap, Content Leverage e Coaching AI.