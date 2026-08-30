# LAMOU CORE Studio — Registro Oficial da Base

## O que este aplicativo é
O LAMOU CORE Studio é a interface navegável do APP CORE CUSTOM. Ele **não cria aplicativos** e não possui catálogo de produtos finais.

Sua função é manter a biblioteca mestre de capacidades reutilizáveis da LAMOU IA para construção de sites, aplicativos e sistemas.

## Relação com a Central
- **Aba CORE da Central:** mostra a cobertura/aplicação da base transversal na própria Central e nos produtos.
- **LAMOU CORE Studio:** aplicativo separado que documenta e governa a biblioteca completa da base.
- **Projetos/aplicativos:** consomem os módulos do CORE; não são criados dentro do CORE Studio.

## Unidade principal: Módulo
Cada módulo deve possuir nome, identificador, categoria, classificação, descrição, dependências, plugins/provedores, substituições, continuidade, política de versão, histórico e evidência.

## Unidade técnica: Código CORE
Cada código deve possuir:
- código e nome;
- quando atua;
- entradas e saídas;
- dados/proteções;
- `hardDepends` para bootstrap e `relatedDepends` para relações arquiteturais;
- Plan X/Y/Z/Safe quando aplicável;
- contrato técnico;
- nível de travamento do contrato;
- política de fast-path;
- métricas de benefício/ganho;
- estado de evidência.

## Contrato travado ≠ código congelado
Códigos críticos usam `LOCKED_CRITICAL_CONTRACT`: o contrato público não pode sofrer quebra silenciosa. A implementação pode ser otimizada ou substituída atrás do contrato. Breaking change exige nova major, migração, testes, reverse path e aprovação.

Códigos estáveis usam `STABLE_VERSIONED_CONTRACT`. Candidatos a pesquisa/IP usam `EVOLVING_RESEARCH` e não recebem promoção automática.

## CORE-DAG — dependências sem trava
O campo legado `depends` misturava relações lógicas com dependências rígidas e criava ciclos conceituais. A V2.3 separa:
- `hardDepends`: ordem de bootstrap, obrigatoriamente acíclica;
- `relatedDepends`: integração/consulta/relação, sem bloquear inicialização.

O validador `scripts/validate-core-registry.mjs` bloqueia promoção se houver código duplicado, campo obrigatório ausente, hard dependency inexistente ou ciclo de bootstrap.

## CORE-FPATH — rota rápida verificada
Fast-path **não é bypass de segurança**. Ele reutiliza trabalho já validado quando existe Execution Passport válido, contexto estável, baixo risco e TTL vigente.

Pode reutilizar, conforme código/contexto:
- resolução de provider estável;
- schema/metadata já verificados;
- policy compilada;
- leitura parcial/delta no lugar de full fetch.

Nunca pula:
- hard rules;
- autorização em fronteira de confiança;
- integridade;
- pagamento/consentimento;
- mudança de privilégio;
- uso/rotação de segredo e assinatura crítica;
- auditoria obrigatória.

Mudança de usuário, tenant, role, policy version, risco, data class, code version ou TTL invalida o fast-path.

## CORE-BEN — benefícios e ganhos
Toda proposta pode declarar benefício esperado, mas ganho só é confirmado com baseline + telemetria.

Fórmulas padrão:
- menor é melhor: `(baseline - atual) / baseline × 100`;
- maior é melhor: `(atual - baseline) / baseline × 100`;
- tempo economizado: diferença de espera × volume;
- bytes economizados: diferença de transferência × volume.

Sem baseline real, o estado é `NÃO MENSURÁVEL`.

## Regra plugin != módulo
Um módulo representa uma capacidade. Um plugin é uma implementação possível. O módulo continua existindo quando o provider muda.

## Continuidade
Serviço gratuito, limite de quota ou provider indisponível não pode parar o aplicativo silenciosamente. Fallback só é automático quando contrato e segurança permitem. Dados, autenticação, cobrança e segurança crítica exigem migração/continuidade controlada.

## Verdade de versão
As dimensões de versão são explícitas em `suite/core-version-policy.json`: manifesto, catálogo, runtime e arquitetura podem evoluir em ritmos diferentes, mas os valores precisam corresponder às fontes reais. Promoção permanece bloqueada nesta derivada até existir evidência suficiente de runtime/teste/release.

## Truth Guard executável nesta derivada
Workflow: `.github/workflows/core-truth-guard.yml`.

Valida:
- registro/DAG;
- version policy;
- regras de fast-path;
- fórmulas de benefício.

## Fonte
- Interface: `suite/core-studio/index.html`
- Catálogo de módulos/plugins: `suite/core-studio/modules.js`
- Catálogo de códigos: `suite/core-studio/core-code-registry.js`
- Governança V2.3: `suite/core-studio/core-governance.js`
- Centro visual: `suite/core-studio/architecture-center.html`
- Manifesto: `suite/app-core-manifest.json`
- Política de versões: `suite/core-version-policy.json`
- Auditoria completa: `docs/core/LAMOU_CORE_AUDITORIA_CODIGOS_FASTPATH_V2_3_2026-08-30.md`
