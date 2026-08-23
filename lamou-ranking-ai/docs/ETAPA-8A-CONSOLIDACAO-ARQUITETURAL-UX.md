# ETAPA 8A — CONSOLIDAÇÃO ARQUITETURAL + UX

Status: concluída como fundação Core 2.0.

## O que foi corrigido
- Sai o modelo de overlays `stageX.js` controlando o mesmo DOM.
- Entra um único `consolidated-app.js` com router central.
- Entra um único store persistente `lamou-ranking-core-v2`.
- Catálogo, análises, scorecards, proveniência, plano e histórico compartilham a mesma fonte de verdade.
- Migração automática das chaves legadas de localStorage.
- Navegação final por intenção: Início, Músicas, Analisar, Mercado, Carreira, Plano, Histórico, Metodologia.
- Fluxo central por faixa: Faixa → Master → DSP → Evidências → Benchmark → Decisão → Histórico.
- SHA-256 do arquivo de áudio identifica o master e impede duplicidade técnica acidental.
- DSP deixa de ser apresentado como TQS. A UI usa Signal Health para o sinal e mantém TQS auditável nos 10 critérios oficiais.
- Scorecard TQS fica dentro do dossiê da faixa.
- Benchmark e Investment Radar usam a mesma faixa selecionada.
- Histórico passa a ser unificado.

## O que permanece legado, mas não é mais carregado na interface
`app.js`, `stage2.js`, `stage3.js`, `stage5-visible.js`, `stage6-visible.js`, `stage7-visible.js` e CSS auxiliares permanecem no Git apenas como histórico/rollback.

## Próximos blocos
8B — DSP de engenharia: LUFS/True Peak certificados, LRA, fingerprint/cache técnico, processamento em Web Worker/WASM.
8C — Metodologia v1.2: pesos e regras formais de AIS, CPS, MPI, IRS, Readiness e confiança.
9 — Dados reais + Benchmark 2.0.

## Limitações intencionais
- `dsp-engine.js` ainda é o motor aproximado da Etapa 2; a 8A corrige a arquitetura e a forma como seus resultados são rotulados, não certifica a metrologia.
- Artist baseline 22/08/2026 é exibido como interpretação, não como telemetria viva.
- MPI, IRS e Career Momentum continuam indisponíveis quando faltam dados/método.
