# CODEX PROMPT-MESTRE — LAMOU IA CORE V2.4

Documento consolidado em 30/08/2026. Status: DERIVADA / EM DESENVOLVIMENTO / NÃO PUBLICADA.

## Escopo consolidado
Esta versão incorpora integralmente as decisões do CORE V2.3 e acrescenta: CORE-UPD (orquestração de atualizações por impacto e compatibilidade), CORE-BKP (backup gerenciado do CORE/Central/apps vendidos sob gestão), CORE-SIGN (assinatura digital e pacote de evidência), CORE-OBS (observabilidade e diagnóstico de eficiência), CORE-MEDIA (capability manager para vídeo/áudio/voz/transcrição e plugins), CORE-FEED (feedback pessoal/contextual com mascote tecnológico sério e inteligente).

## Regras-mãe
- preservar baselines congeladas;
- módulo != plugin != provider;
- contrato crítico travado, implementação interna evolutiva;
- hardDepends formam DAG, relatedDepends não bloqueiam bootstrap;
- segurança = hard rules + análise contextual + evidência + recovery;
- IA pode elevar proteção, nunca reduzir hard rule;
- Fast Path é pista expressa, nunca bypass;
- não mover o todo quando apenas um fragmento mudou;
- Cloud operacional != backup;
- toda mudança crítica nasce com Reverse Path;
- todo ganho precisa de baseline ou é NÃO MENSURÁVEL;
- nenhuma capability é chamada de implementada/testada/produção sem evidência.

## Ficha obrigatória por código
Cada código deve expor: código, nome, área, status real, maturidade, classificação de contrato, o que é, o que faz, quando atua, entradas, saídas, dados, segurança, hardDepends, relatedDepends, Plan X/Y/Z/Safe, Fast Path, invalidadores, Reverse Path, benefícios, métricas, mercado anterior, diferencial LAMOU, arquitetura visual, tela/design, contrato, fonte de código, evidências, histórico, política de aprendizado e atualização.

## Arquitetura macro
APPS → CORE CONTRACTS/SDK → GATEWAY → ID/TENANT/CONTEXTO → TASK → POLICY+SECURITY → RESOLVER → FAST PATH ou FULL PATH → PLAN X/Y/Z/SAFE → EXECUÇÃO → OBSERVABILIDADE → VERIFICAÇÃO → EVIDÊNCIA → APRENDIZADO GOVERNADO → UPDATE/RELEASE/REVERSE PATH.

## Códigos consolidados
Identidade/acesso: CORE-ID, CORE-RBAC, CORE-APR, CORE-EPH.
Governança/verdade: CORE-DEC, CORE-VER, CORE-AUD, CORE-FORENSIC, CORE-TRUTH, CORE-VTR, CORE-BRG, CORE-DAG, CORE-LUP, CORE-BEN.
IA/fontes: CORE-AI, CORE-TASK, CORE-EVAL, CORE-RES, CORE-KNW, CORE-EXT, CORE-DOC, CORE-FIN.
Continuidade: CORE-XY, CORE-DTRUST, CORE-RPATH, CORE-BDR, CORE-BKP.
Segurança: CORE-SEC-ORCH, CORE-CRYPT, CORE-KMS, CORE-THRESH, CORE-SID, CORE-ROT, CORE-PURPOSE, CORE-MROUTE, CORE-EID, CORE-ROUTEVAULT, CORE-ATTEST, CORE-FPATH.
Dados/performance: CORE-STOR, CORE-DLOC, CORE-SAVE, CORE-BUF, CORE-PROJ, CORE-COMMIT, CORE-INDEX, CORE-DELTA, CORE-ALLOC.
Localização/acessibilidade: CORE-LOC, CORE-SIG, CORE-ACK, CORE-ESC, CORE-A11Y, CORE-AT, CORE-SENSORY.
Entrega/operação/experiência: CORE-GIT, CORE-UPD, CORE-SIGN, CORE-OBS, CORE-MEDIA, CORE-FEED.

## CORE-UPD
Novo código/módulo só chega ao cliente quando dependências obrigatórias, build, testes, security gate, compatibilidade, staging/twin e verificação daquele release estiverem aprovados. Não atualizar todos os apps por padrão; atualizar apenas apps impactados. Mesmo com apenas quatro apps, usar blast radius e agrupamento inteligente de releases. Estados: AVAILABLE → ANALYZING → BUILDING → TESTING → STAGING → APPROVED → ROLLING_OUT → VERIFIED → COMPLETE; ou BLOCKED/ROLLED_BACK.

## CORE-BKP
Complementa CORE-BDR. Protege CORE, Central/MUIA e sistemas vendidos que seguem sob gestão autorizada. Cada produto/dataset possui backup policy, RPO, RTO, retention, encryption, região, restore test, owner, último backup e último teste de restauração. Backup nunca testado não é considerado protegido.

## CORE-SIGN
Distinguir assinatura eletrônica simples/avançada/qualificada, code signing e assinatura documental. Identificar documento/ato, jurisdição e nível exigido. Guardar hash, identidade, força de autenticação, timestamp quando aplicável, consentimento/intenção e pacote de evidência. No Brasil, avaliar ICP-Brasil quando o caso exigir; nunca prometer valor jurídico garantido sem requisitos corretos.

## CORE-ID
Inclui primeiro acesso, cadastro de e-mail, avatar, login/logout, sessão, recuperação e redefinição de senha, MFA/passkey e step-up quando aplicável. Senha nunca plaintext nem recuperável; recuperação por fluxo seguro de curta duração.

## CORE-OBS
Detecta bugs, falhas, quedas de eficiência e causas prováveis. Ex.: 45% → 13% = queda de 32 pontos percentuais. Correlacionar release, provider, banco, fila, storage, volume, região, dispositivo e horário. Separar FATO / CORRELAÇÃO / HIPÓTESE / CAUSA CONFIRMADA.

## CORE-MEDIA
O app solicita capability (voz, áudio, vídeo, transcrição, legenda, conversão, compressão etc.) e o CORE escolhe provider/plugin autorizado por qualidade, custo, privacidade, performance, licença e compatibilidade. Entrega arquivo, storage ref, link autorizado ou stream.

## CORE-FEED
Feedback periódico/contextual após jornadas relevantes, sem interrupção excessiva. Mascote: coelho 3D tecnológico azul/rosa, barriga branca, coração, visual sério/inteligente/simpático, não infantil. Pergunta exemplo: “Você se sente super protegido usando este programa?”; analogia opcional: “cofre suíço, guarda-costas invisível ou abraço blindado?”. Escala solicitada 1 Demais; 2 Nem sempre; 3 Mais ou menos; 4 Às vezes; 5 Sempre — revisar semântica antes de pesquisa formal porque 1 pode soar positivo. Pseudonimizar quando possível e separar identidade de conteúdo.

## Dados incrementais
CORE-INDEX → CORE-DELTA → CORE-BUF → CORE-PROJ → CORE-ALLOC → CORE-STOR → CORE-COMMIT → CORE-VER → CORE-BDR. Regra universal: não mover/reconstruir o todo quando apenas parte mudou. Planilha grande abre primeiro metadados/abas/ranges; mudanças geram delta. CORE-BUF é buffer transitório durável, criptografado, com TTL, idempotência e purge após commit/verify; não é source of truth.

## Segurança crítica
CORE-SEC-ORCH governa hard rules + contexto + risco + evidência. Segredos de sistema usam CORE-KMS/CORE-SID/CORE-ROT/CORE-PURPOSE; threshold quando criticidade justificar; Moving Route é camada adicional e nunca segurança por obscuridade. Runtime conhece apenas o necessário; auditoria preserva prova mínima sem senha/token/chave/share/rota completa.

## Plan X/Y/Z/Safe
X preferred; Y hot standby; Z alternativa segura/degradada; S Safe Mode. CORE-DTRUST mede dependência comum entre provider, região, conta, credencial, KMS, admin, pipeline, rede e identidade.

## Fast Path
CORE-ATTEST emite Execution Passport; CORE-FPATH reutiliza trabalho já validado. Pode evitar discovery, reload de schema estável, reavaliação sem mudança e leitura integral. Nunca pula autorização, hard rule, integridade, pagamento, consentimento, privilégio, segredo, assinatura crítica ou auditoria obrigatória. Invalidar com mudança de subject, tenant, role, risco, policy/code version, data class, purpose, provider health, TTL ou artifact hash.

## Benefícios
CORE-BEN mede performance, confiabilidade, segurança, dados, financeiro e experiência. Sem baseline: NÃO MENSURÁVEL. Fórmulas e telemetria devem ser registradas por código.

## Atualização e aprendizado
Todo código declara learning_mode e update_policy. Fluxo: OBSERVE → LEARN → HYPOTHESIS → COMPARE → EVIDENCE → TEST → APPROVE → PROMOTE. Modos: NONE, OBSERVE, ASSISTED, GENERATIVE_GATED. Cadência T0–T4.

## Design CORE Studio
Visual técnico, sério, inteligente, sofisticado e responsivo. Cada código clicável deve abrir tabs: O que é; Quando atua; Entradas/Saídas; Dados & Segurança; Dependências; Plan X/Y/Z; Fast Path; Benefícios; Arquitetura; Código/Contrato; Evidência; Histórico. Marcadores: ✦ Diferencial LAMOU; ◈ Candidato a pesquisa/IP; • Base conhecida.

## Checklist de implementação
1 verificar duplicidade; 2 estender capability existente quando possível; 3 definir contrato; 4 status real; 5 hard/related deps; 6 validar DAG; 7 security class; 8 fast-path; 9 benefícios; 10 X/Y/Z/S; 11 reverse path; 12 learning/update; 13 evidence; 14 branch derivada; 15 testes; 16 Truth Guard; 17 docs; 18 promoção somente com evidência.

## Ordem técnica
P0: TRUTH, VTR, DAG, ID, RBAC, AUD, SEC-ORCH, STOR, COMMIT, VER, BDR.
P1: INDEX, DELTA, BUF, ALLOC, SAVE, FPATH, ATTEST, UPD, BKP, OBS.
P2: RES, XY, DTRUST, RPATH, MEDIA, SIGN, FEED.
P3/pesquisa: THRESH avançado, MROUTE, EID, ROUTEVAULT e candidatos a IP.

## Resultado esperado
CORE universal, estável por contrato, trocável por adapter/provider, rápido por delta/fast-path, seguro por política, resiliente por X/Y/Z/S e reverse path, mensurável por CORE-BEN, observável por CORE-OBS, atualizável por impacto via CORE-UPD, recuperável via BKP/BDR, com assinatura/evidência apropriada via SIGN, mídia roteada por capability e feedback contextual inteligente via FEED.
