# CODEX PROMPT MESTRE — LAMOU CORE V2.3

## CONTEXTO
Você está evoluindo uma branch derivada do LAMOU CORE. A baseline `main` não pode ser sobrescrita silenciosamente. Arquitetura proposta não pode ser rotulada como runtime/produção sem código, teste e evidência.

## OBJETIVO
Transformar o CORE em uma base rápida, segura, modular, reversível, mensurável e fácil de integrar/remover, preservando contratos estáveis e evitando travas por dependências.

## REGRAS-MÃE
1. Proposta ≠ implementação ≠ teste ≠ produção.
2. Módulo ≠ plugin/provider.
3. Travar contrato crítico, não congelar implementação.
4. `hardDepends` deve formar DAG; relações lógicas ficam em `relatedDepends`.
5. Nenhuma dependência externa pode esperar indefinidamente: timeout, cancelamento e estado observável.
6. Retry exige idempotência ou compensação segura.
7. Operação crítica precisa de reverse path antes de promoção.
8. Dado desconhecido/classificação ausente falha fechado; nunca ganha privilégio por omissão.
9. Fast-path nunca significa furar segurança.
10. Benefício/ROI só pode ser declarado com baseline + telemetria real.

## CADA CÓDIGO CORE DEVE TER
- `code`, nome, área e estado;
- `when` (quando atua);
- entradas e saídas;
- dados/proteções;
- `hardDepends` e `relatedDepends`;
- Plan X/Y/Z/Safe quando aplicável;
- contrato técnico versionado;
- `contractLock`;
- `fastPath`;
- métricas `measurableBy`;
- fonte/evidência.

## TRAVAMENTO
### LOCKED_CRITICAL_CONTRACT
Auth, autorização, auditoria, segurança, crypto/KMS, commit durável, verdade/versionamento e outros códigos críticos. Breaking change: nova major + migração + testes + approval + reverse path.

### STABLE_VERSIONED_CONTRACT
Contrato estável; implementação pode ser otimizada/substituída mantendo compatibilidade.

### EVOLVING_RESEARCH
Somente teste/pesquisa. Não promover automaticamente nem conceder fast-path de produção.

## FAST PATH
Usar `CORE-ATTEST` + `CORE-FPATH` somente quando:
- passport válido;
- código/versão/policy/subject/tenant vinculados;
- TTL vigente;
- contexto não mudou;
- risco não é HIGH/CRITICAL;
- dado não é CRITICAL/REGULATED/SECRET/IMMUTABLE;
- operação não é pagamento, consentimento, mudança de privilégio, assinatura/release, segredo/rotação ou política crítica.

Mesmo em fast-path, manter:
- autorização na fronteira de confiança;
- hard rules;
- integridade;
- auditoria obrigatória.

Pode reutilizar apenas trabalho estável, como provider resolution, schema/metadata verificados, policy compilada e leitura integral evitável por delta/chunk.

## DADOS / PERFORMANCE
Fluxo preferido:
`CORE-DELTA → CORE-BUF → CORE-PROJ → CORE-ALLOC → CORE-STOR → CORE-COMMIT → CORE-VER → CORE-BDR`.

Princípio: **não mova o todo se só uma parte mudou**. Arquivo grande deve usar índice, chunk/range, lazy loading e delta. O buffer transitório nunca é source of truth. ACK “recebido” só após gravação durável. “Concluído” crítico só após commit/verificação.

## SEGURANÇA
Policy determinística define piso obrigatório. IA pode elevar proteção, nunca reduzir hard rule. Threshold, KMS/HSM, purpose binding, rotação, ephemeral identity/route e multi-plan são aplicados proporcionalmente ao risco. Não implementar criptografia própria.

## BENEFÍCIOS
Usar `CORE-BEN`.
- menor é melhor: `(baseline - atual) / baseline × 100`;
- maior é melhor: `(atual - baseline) / baseline × 100`;
- tempo economizado = diferença de espera × volume;
- bytes economizados = diferença de bytes × volume.
Sem baseline: `NÃO MENSURÁVEL`.

Métricas possíveis: p95 latency, user wait, bytes moved, DB roundtrips, cost/op, error rate, sync success, availability, failover, RTO/RPO, audit/control coverage, exposure window, accessibility pass, ACK time e lock-in/switch cost.

## VALIDAÇÃO OBRIGATÓRIA
Antes de entregar qualquer mudança:
1. `node scripts/validate-core-registry.mjs`
2. `node scripts/test-core-governance.mjs`
3. confirmar que `suite/core-version-policy.json` corresponde às fontes reais;
4. não promover se o Truth Guard falhar.

## ESTADO ATUAL DA DERIVADA
- 51 códigos originais catalogados.
- 4 códigos adicionados: `CORE-DAG`, `CORE-ATTEST`, `CORE-FPATH`, `CORE-BEN`.
- Total governado: 55.
- Dependências rígidas foram separadas das relações arquiteturais para eliminar ciclos de bootstrap.
- `CORE-DAG`, guard de `CORE-FPATH` e calculadora `CORE-BEN` possuem implementação/teste nesta branch como ferramentas/policies; os demais estados devem permanecer conforme evidência real.

## NÃO FAZER
- Não tratar badge/marca como passe universal.
- Não criar bypass de RBAC/ABAC/Policy/crypto/audit.
- Não cachear autorização indefinidamente.
- Não marcar “implementado” porque existe documentação.
- Não inventar percentuais de ganho.
- Não remover logs forenses necessários para esconder rota.
- Não transformar relação lógica em hard dependency sem necessidade.
- Não reconstruir arquivo inteiro quando API/estrutura permitir operação parcial.
