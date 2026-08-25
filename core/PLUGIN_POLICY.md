# APP CORE CUSTOM 2.1 — Free-First Resilient Plugin Policy

## Objetivo
Todo aplicativo LAMOU deve continuar funcional mesmo quando uma integração gratuita atingir cota, falhar, ficar indisponível ou deixar de estar configurada. Plugins são complementos substituíveis; não podem ser ponto único de falha do produto.

## Regras obrigatórias
1. Somente plano gratuito, open source, self-hosted ou execução local por padrão.
2. Nunca ativar cobrança, overage, upgrade pago ou cartão automaticamente.
3. 80% da cota conhecida: estado `quota-warning`.
4. 95% da cota conhecida: serviços sem estado entram em fallback automático.
5. Falha repetida: circuit breaker; após 3 falhas consecutivas, o provedor é temporariamente isolado e o próximo disponível é usado.
6. Toda capacidade crítica deve ter fallback local ou modo degradado que preserve o aplicativo.
7. Provedor não configurado nunca deve ser apresentado como ativo.
8. A troca manual é feita pelo LAMOU Plugin Center e fica registrada em auditoria.
9. Banco e autenticação são stateful: nunca trocar automaticamente entre fornecedores sem validação de esquema, usuários, sessões e dados.
10. Em indisponibilidade de banco, operações compatíveis podem ir para fila local/offline e sincronizar depois. Autenticação nova só pode ter failover real se um provedor secundário já tiver sido previamente provisionado e sincronizado; o CORE não cria login local inseguro para fingir disponibilidade.
11. Hospedagem/deploy só muda por failover controlado; nunca alterar DNS, domínio ou ambiente de produção sem validação.

## Auditoria de responsabilidade — quem fez o quê
Toda ação administrativa, mudança de plugin, alteração de configuração, mudança de permissão, publicação, migração, fallback, erro crítico e ação automática do CORE deve gerar evento de auditoria.

Cada evento deve conter, quando tecnicamente disponível:
- `id` único e sequência;
- `actor.id`, nome/identificador, papel e origem (`auth`, `profile`, `system` ou `unknown`);
- ação executada;
- aplicativo e versão do CORE;
- sessão/correlation id;
- data/hora ISO;
- origem da execução;
- objeto afetado;
- estado anterior e posterior quando houver mudança;
- motivo informado ou motivo automático;
- modo `manual` ou `automatic`;
- resultado (`success`, `blocked`, `failed`, `degraded`);
- evidência técnica associável (commit, workflow, request id, erro ou migração) quando existir.

Ações automáticas devem usar o ator `core/system`; ações humanas devem usar o usuário autenticado. Se o aplicativo ainda não conseguir resolver a identidade, deve registrar `unknown-user` e exibir essa lacuna como pendência de integração — nunca inventar um nome.

### Integridade do log
O log em `localStorage` é apenas trilha operacional local e deve ser marcado como `local-unverified`, pois pode ser apagado ou alterado no dispositivo. Para auditoria corporativa/compliance, o destino obrigatório futuro é um log remoto append-only com retenção, controle de acesso, exportação e mecanismo de integridade/tamper evidence. O CORE não deve chamar um log local de “imutável”.

### APIs do runtime
- Identificar usuário: `core.setActor(...)` / `APP_CORE.setActor(...)`
- Limpar identidade no logout: `core.clearActor()` / `APP_CORE.clearActor()`
- Consultar trilha recente: `core.auditTrail(limit)` / `APP_CORE.auditTrail(limit)`
- Eventos automáticos usam ator `core/system`.

## Registro padrão de provedores

| Capacidade | Preferido gratuito | Alternativa | Último fallback | Troca |
|---|---|---|---|---|
| Analytics | PostHog Free | Umami self-hosted | auditoria local | automática quando configurado |
| Erros/observabilidade | Sentry Free | GlitchTip self-hosted | auditoria local | automática quando configurado |
| Banco/autenticação | Supabase Free | Appwrite Free / PocketBase self-hosted | modo local/offline | migração controlada |
| IA auxiliar | Gemini Free | Transformers.js local | regras locais | automática quando configurado |
| Teste E2E | Playwright | Cypress OSS | — | pipeline |
| Acessibilidade | axe-core | Pa11y | — | pipeline |
| Performance | Lighthouse | Web Performance API | — | pipeline |
| Segurança | npm audit | Semgrep CE / Trivy | — | pipeline |
| Hosting | Cloudflare Pages | GitHub Pages / host atual | host atual | controlada |

## Estados oficiais
- `active`: configurado e em uso.
- `available-not-configured`: opção suportada, mas ainda sem credenciais/adaptador ativo.
- `existing-direct-not-routed-through-core`: integração já usada diretamente pelo app; ainda precisa ser migrada para o adapter do CORE para receber failover completo.
- `local-fallback`: implementação interna sem dependência externa.
- `degraded`: funcionalidade reduzida, mas o aplicativo continua aberto e preserva o que for seguro preservar.
- `requires-migration`: alteração de provedor stateful bloqueada até existir plano de migração seguro.

## LAMOU Plugin Center
O CORE deve expor, na área administrativa/configurações, uma central que mostre por capacidade:
- provedor efetivo;
- alternativas disponíveis;
- se cada alternativa está configurada;
- saúde/circuit breaker;
- percentual de cota quando conhecido;
- fallback definido;
- opção de troca;
- aviso de migração para banco/autenticação;
- trilha de auditoria recente, com ator e horário.

A central não deve poluir a tela principal dos produtos.

### Acesso técnico
- Apps JS: `window.APP_CORE.openPluginCenter()`
- Apps TypeScript/React: `core.openPluginCenter()`
- Saúde: `APP_CORE.health()` / `core.health()`
- Quota: `plugins.reportQuota(capability, provider, percent)`
- Execução resiliente: `plugins.execute(capability, operation, payload)`

## Política de continuidade
O CORE prioriza continuidade da função principal do produto sobre telemetria. Se analytics, monitoramento de erros ou IA auxiliar falharem, eles degradam silenciosamente para fallback local e nunca derrubam a aplicação. Para dados e autenticação, o CORE prioriza integridade e segurança: fila offline é permitida onde tecnicamente segura; troca de identidade/banco exige migração controlada.

## Aplicação nos repositórios atuais
A política CORE 2.1 e o `plugin-registry.json` devem existir em todos os repositórios oficiais acessíveis, com manifesto declarando status real. Apps que já carregam o runtime do CORE recebem o PluginManager em execução. Apps estáticos que ainda não carregam `core/runtime.js` ficam marcados como `bootstrap: partial` até a entrada HTML ser ligada ao runtime — o manifesto não deve fingir ativação.

## Governança
Esta política é a fonte humana oficial. O arquivo `plugin-registry.json` é a fonte legível por máquina. Alterações de fornecedor devem preservar os mesmos contratos de capacidade para evitar acoplamento do produto a uma marca específica.
