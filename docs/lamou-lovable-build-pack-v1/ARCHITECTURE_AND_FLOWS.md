# LAMOU - Arquitetura e Fluxos

## 1. Anti-lock-in e independência dos aplicativos

O Lovable/IDE é oficina, não cofre. Nenhuma função essencial do LAMOU depende da assinatura da ferramenta usada para desenvolvê-la.

Fluxo de desenvolvimento:

`Especificação -> GitHub -> IDE -> Commit -> CI -> Testes -> Validation Gate -> Deploy -> Evidência -> Registry/Version`

Regra estrutural adicional:

> **Aplicativo não se quebra.**

Cada aplicativo mantém integralmente identidade, código, escopo, módulos internos, fluxo, versões e fonte de verdade. Central, CORE e LABTEST podem organizar, observar, validar e ligar o aplicativo, mas não o absorvem nem recriam suas funções.

Segredos nunca ficam no frontend ou no GitHub. Providers externos são acessados por contracts/adapters com auth, scope, timeout, retry seguro, fallback, audit, observabilidade, testes e evidência.

## 2. Instalação do Proprietário

Jornada pré-Central:

1. Boas-vindas / Launcher.
2. Modo e tema.
3. Visão geral.
4. Verificação do ambiente: integridade, compatibilidade, conectividade, assinatura, permissões e segurança.
5. Identidade do proprietário.
6. Segurança e acessos: senha, MFA, recuperação, sessões/dispositivos e dupla autorização quando exigida.
7. Consentimentos e permissões: termos, privacidade, dados, APIs e integrações autorizadas.
8. Configurações iniciais: idioma, fuso, tema, acessibilidade e notificações.
9. CORE principal.
10. Testes de prontidão.
11. Conclusão com build/hash, evidência e acesso ao painel.

Visual Lock registrado: `ASSET-005`.

## 3. Instalação / Provisionamento do Cliente

Disparada por Central > Clientes; é um wizard pré-acesso separado do Portal Cliente.

1. Boas-vindas.
2. Verificação inicial.
3. Identidade do cliente/tenant.
4. Segurança e acessos.
5. Contrato, licença, entitlements, consentimentos e APIs.
6. Configurações do ambiente.
7. Capacidades técnicas autorizadas + aplicativos contratados.
8. Testes de prontidão/ativação.
9. Conclusão e acesso ao ambiente autorizado.

Cliente nunca acessa CORE Proprietário. Dados/artefatos devem ser isolados por tenant.

## 4. LAMOU IA Central — Proprietário

Central é gestão, não o lugar onde o app é desmontado.

Ordem canônica desta candidata:

1. Cognitive / Cockpit
2. Mapa Vivo
3. Aplicativos & Produtos
4. Clientes
5. Comercial & Contratos
6. Oportunidades
7. Projetos & Ações
8. Testes & Qualidade
9. Documentos
10. Segurança & Acessos
11. Versões
12. Integrações
13. Configurações

Mapa Vivo representa fatos e rotas de caso:

`origem -> sinal -> problema -> hipótese -> evidência -> decisão/ação -> teste -> resultado -> eficácia -> aprendizado`

Nem todo caso percorre todos os nós.

## 5. CORE — Proprietário

CORE é camada técnica: arquitetura, capacidades, dados, IA, integrações, segurança, runtime, versões, testes técnicos e resiliência.

CORE pode expor:

- Visão Geral / Saúde
- Observabilidade
- Arquitetura Técnica
- Aplicativos, Plugins & Bindings
- Problemas & Encaminhamentos
- Testes técnicos
- Versões & Atualizações
- Configurações
- superfícies de detalhe para dados, segurança, calls, IA e treinamento

**CORE não é proprietário funcional de Plano de Ação, PROJECT, Processo, Meu Desenvolvimento ou qualquer outro aplicativo independente.**

Mapa técnico do CORE:

`app -> capability -> adapter/provider -> dado/fonte -> policy -> teste -> evidência -> runtime/deploy`

Binding real exige contrato e evidência.

## 6. LABTEST

LABTEST governa o que ainda está em criação, desenvolvimento, teste, homologação ou pré-promoção.

Ele não vira “o aplicativo”. O aplicativo continua sendo a unidade do produto.

Estados permanecem explícitos: candidato, testado, bloqueado, não verificado, aprovado etc.

## 7. Fluxos dirigidos entre aplicativos

A antiga cadeia única da Wave 1 deixa de ser regra universal. A arquitetura usa lanes e handoffs tipados.

### Comercial

`Research Scout -> Benchmarker -> Opportunity Intelligence -> Diagnóstico 360 -> Showroom -> Comercial & Contratos -> Clientes -> PROJECT`

Diagnóstico vem antes do Showroom quando é necessário entender problema/contexto antes de demonstrar solução.

### Melhoria operacional

`Diagnóstico 360 -> Digital Improvement -> Meeting Architect -> Plano de Ação`

Ramificações:

- `Meeting Architect -> Orbit`: agenda, compromissos, diário e follow-up.
- `Plano de Ação -> PROJECT`: quando o conjunto vira projeto.
- `PROJECT -> Processo`: quando a implantação altera processo.
- `Processo -> Plano de Ação`: quando processo identifica gap, risco ou não conformidade.

### Pessoas

`Processo -> Meu Desenvolvimento -> Processo`

Competência/gap é contexto de desenvolvimento, não culpa automática.

### Qualidade e eficácia

`Plano de Ação | PROJECT | Processo -> Teste³ IA -> LAMOU Lab -> Validation Gate -> LAMOU Version -> Documentos`

- Teste³ executa.
- Lab compara/experimenta/consolida.
- Validation Gate avalia o evidence pack.
- Version governa versão/build/rollback.
- Documentos governa conteúdo, fonte e referências vivas.

### Sinais operacionais

`VECTRA Intelligence 360 V4 / Mapa Vivo -> Diagnóstico 360`

Mapa sinaliza; Diagnóstico investiga. Sinal não é causa.

A definição executável dos handoffs está em `src/lib/lamou/app-architecture.ts`.

## 8. Apps reconciliados nesta candidata

Além da Wave anterior, entram como referências explícitas sem falsa incorporação:

- PROJECT PRIME MASTER V1 — APPROVED_REFERENCE
- LAMU IA — Meu Desenvolvimento v1 COMPLETO — APPROVED_REFERENCE
- VECTRA Intelligence 360 V4 — OFFICIAL_APPROVED
- LAMOU App Processo V0.3 — CANDIDATE_NOT_PROMOTED
- Plano de Ação — DOCUMENTED_ONLY; fonte standalone ainda não materializada no repo

LAMOU Lab também foi recolocado na navegação de aplicativos porque sua rota já existia no source candidato.

## 9. Duplicidades e linhagens

Reconciliar como mesma linhagem/alias, sem apagar histórico:

- LifeOS / Agenda-LifeOS / Orbit
- Metraction 360 / PUSH 360
- BELGO Intelligence 360 / VECTRA V4
- A-MuDoc / MuDoc

Manter distintos:

- Diagnóstico 360 / Meeting Architect
- Teste³ / Lab / Validation Gate
- Plano de Ação / PROJECT
- Meu Desenvolvimento / RH-T&D
- Processo / Digital Improvement
- Version / Documentos
- Showroom / Comercial & Contratos

Detalhes: `docs/owner-console-handoff/DUPLICATION_RECONCILIATION_2026-09-23.md`.

## 10. Métricas

Métrica nasce como contrato, não como número inventado.

Registro da candidata: `src/lib/lamou/metrics-registry.ts`.

Perfis mínimos incluem:

- acionamentos, sessões e conclusão de fluxo;
- erros, crashes, taxa de erro, p50/p95;
- build/deploy failures e rollback;
- rede, timeout e sincronização;
- segurança/autenticação/autorização;
- sucesso de handoff, órfãos, duplicidades, idade de fila;
- lead time sinal→decisão→ação→eficácia;
- cobertura/freshness de evidência;
- métricas específicas de Ação, Projeto, Processo, Pessoas, Testes e Documentos.

Sem fonte medida: `— / NOT_CONNECTED / NOT_VERIFIED`.

## 11. Handoff contract

Toda passagem entre apps registra, quando aplicável:

`handoff_id -> from -> to -> event -> correlation/entity id -> payload -> evidence -> permission/authority -> emitted_at -> acknowledgement -> status/error/fallback`

Botão/link visual não prova integração.

## 12. Design System

Perfis visuais continuam reutilizáveis, mas compartilhar Design System não significa compartilhar escopo funcional.

Cada app mantém coerência interna sem virar submódulo de outro produto.

## 13. Truth rules

- CATALOGADO ≠ CONECTADO
- ROTA EXISTE ≠ BINDING REAL
- IMPLEMENTADO ≠ TESTADO
- TESTADO ≠ APROVADO
- SALVAR ≠ PROMOVER
- SIMILAR ≠ DUPLICADO
- AÇÃO CONCLUÍDA ≠ EFICAZ
- SINAL ≠ CAUSA
