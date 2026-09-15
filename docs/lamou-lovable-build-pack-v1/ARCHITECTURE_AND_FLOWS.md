# LAMOU - Arquitetura e Fluxos

## 1. Anti-lock-in

O Lovable e a oficina, nao o cofre. Nenhuma funcao essencial do LAMOU pode depender da assinatura da ferramenta usada para desenvolve-la.

Fluxo canonico:

`Especificacao -> GitHub -> Lovable/IDE -> Commit -> CI -> Testes -> Validation Gate -> Deploy -> Evidencia -> Registry/Version`

Segredos nunca ficam no frontend ou no GitHub. Providers externos sao acessados por contracts/adapters com auth, scope, timeout, retry seguro, fallback, audit, observabilidade, testes e evidencia.

## 2. Instalacao do Proprietario

Jornada pre-Central:

1. Boas-vindas / Launcher.
2. Modo e tema: Didatico, Executivo ou Tecnico; claro/escuro coerente.
3. Visao geral.
4. Verificacao do ambiente: integridade, compatibilidade, conectividade, assinatura, permissoes e seguranca.
5. Identidade do proprietario.
6. Seguranca e acessos: senha, MFA, recuperacao, sessoes/dispositivos e dupla autorizacao em acoes criticas.
7. Consentimentos e permissoes: termos, privacidade, dados, APIs e integracoes autorizadas.
8. Configuracoes iniciais: idioma, fuso, tema, acessibilidade, notificacoes e modo de uso.
9. CORE principal: SOL como operacional/padrao; LUA como espaco de teste/experiencias.
10. Testes de prontidao.
11. Conclusao com resumo, build/hash, evidencia e acesso ao painel.

Visual Lock: `visual-locks/owner-install.jpg`.

## 3. Instalacao / Provisionamento do Cliente

Disparada por Central > Clientes; e um wizard pre-acesso, separado do Portal Cliente.

1. Boas-vindas.
2. Verificacao inicial.
3. Identidade do cliente/tenant.
4. Seguranca e acessos.
5. Contrato, licenca, entitlements, consentimentos e APIs.
6. Configuracoes do ambiente.
7. CORE Cliente derivado do CORE PADRAO + apps contratados.
8. Testes de prontidao/ativacao.
9. Conclusao e acesso ao Portal/CORE Cliente autorizado.

Cliente nunca acessa CORE Proprietario. Dados/artefatos devem ser isolados por tenant.

Visual Lock: `visual-locks/client-install.jpg`.

## 4. LAMOU IA - Proprietario

LAMOU IA Central e a camada de **gestao**. Menu Owner:

- Cognitive / Cockpit
- Mapa Vivo
- Aplicativos
- Clientes / Cliente 360
- Projetos / Planos & Melhorias
- Testes & Qualidade
- Comercial & Contratos
- Oportunidades
- Documentos
- Seguranca
- Versoes
- Integracoes
- Configuracoes

Mapa Vivo deve representar casos reais e rotas:

`origem -> sinal -> problema -> hipotese -> evidencia -> teste -> decisao -> acao -> resultado -> eficacia -> aprendizado`

Todo nodo abre ficha com status, fonte, app/cliente/CORE, evidencias e acoes autorizadas.

Visual Lock: `visual-locks/mapa-vivo-owner.jpg`.

## 5. CORE - Proprietario

CORE e a camada tecnica de arquitetura, capacidades, dados, IA, integracoes, seguranca, versoes, testes e resiliencia.

Areas:

- Visao Geral / Saude
- Arquitetura
- Catalogo CORE / Capabilities
- Apps & Bindings
- Clientes & Instancias CORE
- Providers / Plugins / Adapters
- Dados & Fontes
- IA / Models / Prompts / Skills / VAs
- Seguranca / Identidade / RBAC-ABAC
- Testes / Validation / Evidence
- Observabilidade / Logs / Incidentes
- Versoes / Builds / Releases / Rollback
- Backup / Restore / Continuidade
- Documentos vivos
- Configuracoes
- SOL / LUA / LAB

CORE tambem possui Mapa Vivo, mas tecnico: `app -> capability -> adapter/provider -> dado/fonte -> policy -> teste -> evidencia -> runtime/deploy`.

## 6. SOL / LUA

- SOL = referencia operacional corrente / CORE Padrao.
- LUA = candidatas, Cubo/Prisma/Snapshot/Fantasma/Relacao/Caleidoscopio e futuras experiencias.
- Trocar SOL/LUA nao muda CURRENT e nao promove nada.
- Comparacao mostra delta, risco, evidencia, custo, desempenho e gates.

## 7. Primeira onda de aplicativos

1. Orbit / Agenda / LifeOS
2. LAMOU Version
3. LAMOU Showroom
4. LAMOU IA - Diagnostico 360
5. LAMOU Digital Improvement
6. Diagnostic / Meeting Architect
7. Teste3 IA
8. LAMOU Lab
9. Validation Gate
10. Research Scout
11. Opportunity Intelligence
12. Benchmarker

Cadeia integrada:

`Research Scout -> Benchmarker -> Opportunity Intelligence -> Showroom -> Diagnostico -> Digital Improvement -> Teste3 -> Validation Gate -> Lab -> Version/Registry`

## 8. Design System

Tres perfis reutilizaveis:

- A - Operacional: execucao, dados, cadastros e controle.
- B - Visual: narrativa, onboarding, showroom e experiencias.
- C - Hibrido: gestao, diagnostico, qualidade, analytics e decisao.

Cada app mantem coerencia entre rotas; nao cria um design novo por pagina.
