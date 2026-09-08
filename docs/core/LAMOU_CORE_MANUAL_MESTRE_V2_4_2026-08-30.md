# LAMOU IA CORE — MANUAL MESTRE V2.4

**Data:** 30/08/2026  
**Status:** DERIVADA / EM DESENVOLVIMENTO / NÃO PUBLICADA  
**Arquitetura:** `2.4.0-draft`  
**Promoção:** BLOQUEADA até evidência adicional de runtime/homologação.

## 1. Verdade de versão
A V2.4 é uma evolução arquitetural/governança, não uma falsa atualização do runtime. Dimensões atuais permanecem explícitas:
- manifesto: `2.1.1`;
- catálogo: `2.1.0`;
- runtime: `2.0.0`;
- arquitetura/governança: `2.4.0-draft`.

## 2. Catálogo governado
O CORE Studio V2.4 governa **61 códigos**. Os 55 códigos anteriores permanecem e entram 6 novos contratos:
- `CORE-UPD` — App & Fleet Update Orchestrator;
- `CORE-BKP` — Managed Fleet Backup & Recovery Orchestrator;
- `CORE-SIGN` — Digital Signature & Legal Evidence Orchestrator;
- `CORE-OBS` — Intelligent Observability & Efficiency Diagnosis;
- `CORE-MEDIA` — Media & Plugin Capability Manager;
- `CORE-FEED` — Intelligent Personal Feedback Engine.

Login/primeiro acesso/e-mail/avatar/recuperação continuam dentro de `CORE-ID`; não criar capability duplicada.

## 3. Ficha clicável por código
Cada código deve expor no CORE Studio: status real; quando atua; entradas/saídas; dados e segurança; hardDepends/relatedDepends; Plan X/Y/Z/Safe; política de Fast Path; métricas/benefícios; contrato técnico; fonte/evidência; e histórico.

Contratos são classificados em:
- `LOCKED_CRITICAL_CONTRACT`;
- `STABLE_VERSIONED_CONTRACT`;
- `EVOLVING_RESEARCH`.

Travamos o contrato público onde necessário, não congelamos a implementação interna.

## 4. Execução rápida e segura
`CORE-ATTEST` + `CORE-FPATH` representam o Execution Passport/Fast Path. O objetivo é evitar trabalho repetitivo já verificado: rediscovery, reload de schema estável, leitura integral quando delta basta e reavaliações imutáveis.

Fast Path nunca pula: hard rules, autorização ao cruzar trust boundary, integridade, consentimento, pagamento, mudança de privilégio, segredo/rotação, assinatura crítica ou auditoria obrigatória.

`CORE-UPD`, `CORE-BKP` e `CORE-SIGN` estão marcados `NEVER_BYPASS`. `CORE-OBS` pode reutilizar baseline somente com passport válido, risco baixo e contexto estável.

## 5. Dependências sem travamento
`hardDepends` representa dependência obrigatória de execução/bootstrap. `relatedDepends` representa relação/consulta não bloqueante. `CORE-DAG` valida que hard dependencies formem DAG e bloqueia ciclos antes da promoção.

Funções pesadas devem usar timeout, cancelamento, fila/worker, retry idempotente, circuit breaker, bulkhead, backpressure e DLQ quando aplicável. UI não deve congelar por processamento pesado.

## 6. Dados incrementais
Princípio: **não mover o todo quando só uma parte mudou**.

Fluxo preferencial:
`CORE-INDEX → CORE-DELTA → CORE-BUF → CORE-PROJ → CORE-ALLOC → CORE-STOR → CORE-COMMIT → CORE-VER → CORE-BDR`.

`CORE-BUF` é buffer transitório durável, criptografado, com TTL e idempotência; não é source of truth. Operação crítica só mostra concluído após commit definitivo e verificação.

Arquivos/planilhas grandes carregam metadados, abas, ranges e chunks sob demanda. Alteração parcial gera delta; não retransferir/regravar arquivo inteiro sem necessidade.

## 7. Segurança adaptativa e distribuída
`CORE-SEC-ORCH` combina hard rules + contexto + risco + evidência. IA pode elevar proteção, nunca reduzir regra crítica obrigatória.

Segredos usam `CORE-KMS`, `CORE-SID`, `CORE-ROT`, `CORE-PURPOSE`, e threshold/rota efêmera apenas quando justificadas. Segurança não pode depender de esconder a rota. Auditoria forense preserva evidência mínima sem senha, token, chave, share ou rota completa.

Continuidade usa `CORE-XY`: X preferred; Y hot standby; Z safe alternative/degraded; S Safe Mode. `CORE-DTRUST` deve identificar dependências comuns e falsa redundância. `CORE-RPATH` define recuperação/reconciliação antes de mudanças críticas.

## 8. CORE-UPD
Atualização chega somente aos apps/clientes impactados. Antes de rollout: blast radius, DAG, build, testes, security gate, compatibilidade, staging/twin, verificação e aprovação. Mesmo com poucos apps, não atualizar tudo indiscriminadamente.

Estados: `AVAILABLE → ANALYZING → BUILDING → TESTING → STAGING → APPROVED → ROLLING_OUT → VERIFIED → COMPLETE`, com `BLOCKED` e `ROLLED_BACK`.

## 9. CORE-BKP
Complementa `CORE-BDR` e governa backup do CORE, Central/MUIA e produtos vendidos sob gestão autorizada. Cada produto/dataset possui política, RPO/RTO, retenção, criptografia, região, owner e restore test. Backup não testado por restauração não é considerado protegido.

## 10. CORE-SIGN
Distingue assinatura eletrônica simples/avançada/qualificada, assinatura documental e code signing. A decisão depende do ato, jurisdição e nível exigido. Evidência inclui hash, identidade, força de autenticação, timestamp quando aplicável e trilha verificável. No Brasil, avaliar ICP-Brasil quando o caso exigir. Não declarar valor jurídico garantido sem requisitos corretos.

## 11. CORE-OBS
Detecta bugs/falhas/quedas de eficiência e correlaciona versão, release, provider, banco, fila, storage, volume, região e dispositivo. O diagnóstico deve rotular separadamente `FATO`, `CORRELAÇÃO`, `HIPÓTESE` e `CAUSA CONFIRMADA`.

## 12. CORE-MEDIA
O app pede capability — voz, transcrição, vídeo, legenda, conversão etc. — e o CORE seleciona provider/plugin autorizado conforme qualidade, custo, privacidade, performance, licença e compatibilidade. Saída pode ser arquivo, storage ref, link autorizado ou stream.

## 13. CORE-FEED
Feedback periódico/contextual, sem interrupção excessiva. Mascote: coelho 3D tecnológico azul/rosa, barriga branca e coração, com aparência séria, inteligente e simpática — não infantil. Perguntas podem medir segurança percebida, facilidade, confiança, rapidez, clareza, acessibilidade e utilidade.

Escala solicitada: `1 Demais · 2 Nem sempre · 3 Mais ou menos · 4 Às vezes · 5 Sempre`. Antes de pesquisa formal, revisar a direção semântica, pois “Demais” pode soar positivo e conflitar com a progressão até “Sempre”.

## 14. Benefícios e ganhos
`CORE-BEN` só declara ganho quando existe baseline e telemetria. Sem baseline: `NÃO MENSURÁVEL`.

Métricas incluem latência, espera percebida, bytes, round trips, custo/operação, erro, disponibilidade, failover, RTO/RPO, cobertura de controles/auditoria, sync, lead time de atualização, sucesso de rollout/restore/assinatura, tempo de detecção, qualidade/custo de mídia, satisfação e segurança percebida.

## 15. Diferenciais
Classificação visual:
- `✦ DIFERENCIAL LAMOU` — combinação/arquitetura diferenciada;
- `◈ CANDIDATO A PESQUISA/IP` — exige pesquisa/anterioridade/validação;
- `• BASE CONHECIDA` — tecnologia conhecida integrada ao CORE.

Não usar selo de inovação como afirmação de patenteabilidade.

## 16. Evidência e CI
O workflow `CORE Truth Guard` valida catálogo/DAG, versões e políticas de Fast Path/benefícios. V2.4 deve exigir 61 códigos integrados. Falha no guard bloqueia promoção.

## 17. Regra final
A V2.4 melhora a arquitetura e a governança. Os 6 códigos novos permanecem **PROPOSTOS** até haver runtime, testes específicos e evidência de homologação/produção. `main` e baselines congeladas permanecem preservados.