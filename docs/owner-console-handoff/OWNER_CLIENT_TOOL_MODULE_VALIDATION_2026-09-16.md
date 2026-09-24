# LAMOU IA — validação Proprietário × Cliente de ferramentas, módulos e navegação

Data: 2026-09-16  
Branch: `candidate/lamou-owner-console-codex-2026-09-15`  
Estado: `CANDIDATE_NOT_PROMOTED`  
Regra: **SALVAR ≠ PROMOVER**

## 1. Perguntas obrigatórias de validação

Toda tela, aba, página, link, botão, app, módulo e superfície deve responder, sob dois pontos de vista — Proprietário e Cliente:

1. Pra que serve?
2. O que faço aqui?
3. Tenho as informações necessárias para decidir/agIR?
4. Faz sentido estar aqui ou pertence a outro módulo?
5. É atual ou está obsoleto/duplicado?
6. É visual o suficiente para leitura rápida?
7. É didático para quem chega pela primeira vez?
8. O que falta aqui?
9. Qual pequena adição faria grande diferença?
10. Os apps LAMOU se encaixam aqui? Como, onde e com qual evidência?
11. Consigo concluir a tarefa de forma simples ou a navegação cria dúvida?
12. Ao clicar, sei o destino, a consequência, o estado de verdade e como voltar?

## 2. Resultado executivo

A arquitetura de navegação está coerente o bastante para **lapidar, não redesenhar**: Central gerencial, LABTEST de criação/homologação e CORE técnico. O CORE mantém exatamente 9 raízes canônicas.

A experiência, porém, ainda não é uma entrega final de produção para cliente. Há três níveis diferentes:

- **Estrutura/Navegação:** boa e coerente.
- **Demonstração/Homologação:** utilizável desde que DEMO / NOT_CONNECTED / NOT_VERIFIED permaneçam explícitos.
- **Produção cliente:** ainda bloqueada por evidências reais de MFA, E2E, recovery/rollback, integrações e isolamento Cliente A × Cliente B.

Também permanecem lacunas de acervo: o Planilhão V0.7 existe fora do Owner Console; a arte visual do Mapa Vivo está referenciada como visual lock, mas a página atual usa um mapa abstrato; e o catálogo de apps possui mais itens do que as rotas executáveis materializadas nesta candidata.

## 3. Regra nova — uso sempre gera dado no CORE

A candidata agora possui um contrato `usage.v1` para registrar uso no ledger canônico `lamou_audit_events`.

O que é capturado:

- visualização de superfície/página;
- interação com link/botão/controle;
- erro de runtime no boundary principal;
- tipo de superfície: documento, IA, hipótese/problema, indicador/métrica, observabilidade, CORE, app, Mapa Vivo, catálogo de produto/app, Cliente 360, instalações, LABTEST e módulo Owner;
- tenant, ator autenticado, rota sem query/hash, ação segura, timestamp e contexto operacional mínimo.

O que **não** é capturado por esse mecanismo:

- senha;
- valor digitado em formulário;
- prompt/resposta de IA;
- conteúdo bruto de documento;
- texto livre do usuário;
- segredo/token.

Quando offline ou sem sessão, eventos ficam em fila de sessão e tentam ser enviados quando houver conectividade/autenticação. O banco usa o RLS existente do tenant. A view `lamou_usage_daily` agrega uso por tenant/dia/superfície/evento.

**Limite atual:** isso cobre transversalmente o Owner Console. Apps LAMOU independentes só ficam centralizados automaticamente quando incorporarem o mesmo bridge/contrato de telemetria ou forem executados dentro de uma superfície que use esse sink. Não declarar os 46 registros de `lamou_apps` como instrumentados sem esse binding físico.

## 4. LAMOU IA Central — visão do Proprietário

| Superfície | Pra que serve / o que faço | Tenho informação? | Visual/didática | Faz sentido aqui? | O que falta / faria diferença |
|---|---|---|---|---|---|
| Cognitive / Cockpit | Priorizar o que exige atenção e abrir o destino correto | **Parcial**: origem/truth-state melhoraram; nem todo KPI possui série/denominador real | **Boa em evolução** | Sim, é a entrada gerencial | Um resumo “por que importa / ação recomendada / evidência mais recente” em todos os KPIs; histórico real onde houver série |
| Mapa Vivo | Detectar sinais, mostrar onde/quem/impacto e rotear para resolução | **Parcial** | **Conceito bom, visual incompleto** | Sim; investigação profunda deve continuar no CORE | Vincular a arte/cidade oficial do Mapa Vivo; manter caso, origem, severidade, métrica, owner e destino em primeiro plano |
| Clientes / Cliente 360 | Operar vida pós-venda, saúde do cliente, pacote, cobrança, versões, backup, suporte | **Boa estrutura, fontes mistas** | **Boa** | Sim | Proveniência/freshness em todo card; preview seguro do cliente; fluxos reais para pacote/update/backup |
| Produtos | Responder se produto está saudável, usado, atual, falhando e evoluindo | **Parcial** | **Boa base** | Sim | Mais evidência real de uso/qualidade/cliente; reconciliar catálogo inteiro; tendência só com histórico real |
| Comercial & Contratos | Venda, contrato, cobrança, entitlement e pendência comercial | **Parcial** | **Adequada** | Sim | Gateway/faturamento real, conciliação, estado financeiro e origem de cada cobrança |
| Oportunidades | Capturar melhoria/oportunidade e encaminhar para app/CORE/projeto | **Parcial** | **Adequada** | Sim | Score/impacto apenas com método; vínculo completo oportunidade → proposta → projeto → resultado |
| Configurações | Contexto, ambiente, segurança e opções do Owner | **Boa estrutura** | **Didática melhorada** | Sim | Mostrar consequência de cada mudança, dependências, último teste e rollback |

### Controles da Central

Todos os links e botões devem obedecer: **rótulo claro → destino previsível → consequência explícita → truth-state → caminho de volta**. A nova telemetria registra interação segura com esses controles. Onde um botão estiver sem executor real, deve permanecer desabilitado ou marcado DEMO/NOT_CONNECTED; não pode existir “Reverificar” falso.

## 5. Cliente 360 — visão do Proprietário e do Cliente

| Aba | Proprietário pergunta | Cliente pergunta | Situação | Falta principal |
|---|---|---|---|---|
| Visão geral | “Este cliente está saudável e o que exige ação?” | “Meu ambiente está funcionando?” | Boa estrutura | Indicadores reais + freshness + origem |
| Pacote & Entitlements | “O que vendi e está habilitado?” | “O que eu tenho direito de usar?” | Parcial | Executor real de pacote/entitlement e impacto da mudança |
| Cobrança & Contrato | “O que está pago/atrasado/vigente?” | “Quanto, por quê e quando?” | Fonte real em partes | Gateway real, conciliação e recibo/evidência |
| Versões & Atualizações | “Qual versão o cliente usa?” | “Há atualização e qual o risco?” | Parcial | Update executor + rollback + evidência |
| Backup & Restore | “Consigo recuperar?” | “Meus dados estão protegidos?” | Conceito presente | Restore drill real, RTO/RPO e última evidência |
| Comunicações | “O que foi enviado e recebido?” | “Que aviso recebi?” | Parcial | Canal real, entrega/leitura, template/versionamento |
| Apps & CORE | “O que está liberado e ligado ao CORE?” | “Quais apps posso usar?” | Binding parcial | Reconciliar todos os apps, CORE/capabilities e ambiente |
| Suporte & Timeline | “O que aconteceu e quem está responsável?” | “Qual é o andamento?” | Boa estrutura | SLA/owner/última ação/evidência em tempo real |

## 6. Instalação do Proprietário

**Pra que serve:** criar e validar o ambiente LAMOU IA do Owner antes do uso operacional.  
**O que faço:** identidade → segurança → banco/auth → providers/configuração → CORE → testes/readiness → ativação controlada.

### Avaliação

- Faz sentido: **sim**.
- Didática: **boa, mas precisa de resumo final de prontidão**.
- Visual: **boa base; visual-lock ainda exige QA de navegador**.
- Informação: **parcialmente real**; banco/auth têm evidências, MFA continua bloqueador.
- Grande diferença: na última etapa, mostrar somente quatro coisas: **PRONTO / BLOQUEADO / POR QUÊ / O QUE FAZER AGORA**.

## 7. Instalação do Cliente

**Pra que serve:** provisionar um cliente sem confundir instalação com o Portal Cliente pós-instalação.

### Avaliação

- Estrutura de 7 etapas: faz sentido.
- O falso “Reverificar” foi removido.
- Tenant, usuário, RLS, entitlement, portal e ativação devem continuar com truth-state real.
- Ainda não chamar de provisionamento de produção enquanto os executores e E2E não estiverem comprovados.
- Grande diferença: checklist final com dependência, owner, evidência, destino de correção e consequência da ativação.

## 8. CORE — exatamente 9 raízes

| Raiz | Para que serve | Simples/confuso? | Informação/visual | O que falta / diferença |
|---|---|---|---|---|
| Visão Geral | Encadear saúde → risco → problema → plano → teste → versão → prioridade | **Simples** | Boa | Dados reais de execução e “próxima ação” por bloco |
| Indicadores de Saúde | Ver saúde explicável, cobertura de evidência e ações | **Simples** | Boa | Metodologia de saúde agregada antes de score; histórico real |
| Arquitetura Técnica | Entender componentes, dados, segurança, IA/CALLs e dependências | **Mais técnico por natureza** | Parcial | Diagramas vivos, fluxo de dependência e impacto visual |
| Aplicativos, Plugins & Bindings | Ligar APP → CORE → CALL → provider → dado → permissão → evidência | **Faz sentido, ainda denso** | Parcial | Reconciliar catálogo inteiro e mostrar binding por ambiente/cliente |
| Planos de Ação & Melhorias | Investigar problema e conduzir hipótese → evidência → teste → decisão → ação → eficácia | **Conceito correto** | Parcial | Persistência real do ciclo e comparação antes/depois |
| Testes & Qualidade | Evidenciar PASS/FAIL real e impedir PASS sintético | **Simples** | Boa | Browser E2E, todos cenários CALL e execução externa real |
| Versões & Atualizações | CURRENT/PINNED/FROZEN, lineage, update e rollback | **Simples** | Boa base | Restore/rollback real e ligação de artefato/hashes em todos os produtos |
| Observabilidade | Mostrar uso, sinais, métricas, logs, falhas e destino | **Boa ideia; estava local/DEMO** | Evoluindo | `usage.v1` agora cria base central; ainda faltam APM/tracing/provider telemetry reais |
| Configurações | Resolver ambiente, provider, segurança e substituições | **Boa** | Boa | Estado real por provider, impacto/custo, último teste e rollback |

### Detalhes técnicos que não viram raiz

`/core/calls`, `/core/data`, `/core/security`, `/core/ai`, `/core/trainings` e estados SOL/LUA permanecem detalhes dentro das raízes. Isso reduz poluição do menu e faz sentido para Proprietário e Cliente.

## 9. IA, documentos, hipóteses, indicadores e métricas

### Documentos

- Catálogo documental existe e é útil.
- Banco possui registros de documentos do Owner.
- Uso da superfície passa a ser registrado como `DOCUMENT`.
- Falta: ações documentais reais (revisar/aprovar/publicar/obsoletar) conectadas ao backend e telemetry de evento de domínio, não só clique.

### IA / Conselho / Orquestração

- O pipeline do Conselho está separado em Intake → Evidence → Router → Permissions → Specialists → Red Team → Synthesis → Validation → Human Approval → Action.
- O uso da superfície IA passa a ser registrado como `AI`.
- Telemetria de **uso da tela** não é prova de execução de provider. Execução real deve continuar com evidence/provider/build/cost próprios.
- O orquestrador pode funcionar em outro runtime; esta validação não rebaixa esse estado sem evidência. O que foi confirmado aqui é que o banco ativo não possui as antigas tabelas tipadas `core_provider_slots/checks`; portanto tipos/contratos antigos devem ser reconciliados em vez de usados como prova de runtime.

### Hipóteses / problemas

- A superfície `/core/problems` é classificada como `HYPOTHESIS_PROBLEM` para uso.
- Mapa Vivo não deve criar diagnóstico; encaminha o caso ao CORE.
- Falta: persistir ciclo técnico completo e cada mudança de estado como evento de domínio/evidência.

### Indicadores / métricas

- `/core/health` é `INDICATOR_METRIC`.
- `/core/observability` é `METRIC_OBSERVABILITY`.
- O uso passa a gerar eventos no ledger.
- Ainda vale a regra: **não inventar série histórica, peso, benchmark ou score** quando não houver fonte/metodologia.

## 10. LABTEST

### Para que serve

Criar/testar/homologar sem contaminar CURRENT/FROZEN.

### O que faço

Seleciono baseline PINNED, altero exatamente uma variável quando o experimento for governado, executo runner real, guardo evidência, comparo e submeto ao gate.

### Avaliação

- Estrutura: correta.
- Didática: boa para usuário técnico; pode ganhar um “modo guiado”.
- Falta: runner/provedor real em todos os cenários, evidências de navegador e histórico de comparação.
- Grande diferença: mostrar em uma única faixa “baseline → única mudança → execução → evidência → delta → decisão”.

## 11. Apps LAMOU

Rotas materiais nesta candidata:

- Research Scout
- Benchmarker
- Opportunity Intelligence
- Showroom
- Diagnóstico 360
- Digital Improvement
- Meeting Architect
- Teste³ IA
- Validation Gate
- Orbit / Agenda / LifeOS
- LAMOU Version
- Lab legado/ficha

### Pergunta: “Meus apps LAMOU se encaixam aqui?”

**Sim, pelo modelo correto:**

- Central: produto/app como ativo do portfólio e resultado gerencial;
- CORE: binding técnico, capability, provider, dados, permissão, observabilidade e evidência;
- LABTEST: candidata/experimento/homologação;
- Cliente 360: entitlement, versão, uso e saúde por cliente.

### Lacuna objetiva

O banco ativo possui **46 registros em `lamou_apps`**, mas somente **10 registros em `lamou_app_core_bindings`** na verificação atual. A UI materializa apenas o conjunto de rotas acima. O Planilhão/inventários históricos também descrevem conjuntos diferentes. Portanto “todos os apps funcionando com banco de teste/demo/oficial” ainda não pode ser marcado PASS.

## 12. Planilhão

O Planilhão Visual V0.7 foi recuperado do acervo:

- 246 linhas;
- busca global;
- filtros por prioridade/tipo/decisão;
- apps, CORE, plugins e potencial;
- estado `CANDIDATE_NOT_PROMOTED`.

**Decisão de arquitetura:** integrar como superfície de verificação/detalhe, não como planilha isolada e não como 10ª raiz do CORE.

Faz falta porque responde “o que temos, o que está pendente, o que está conectado, o que falta reconciliar?” de forma transversal.

## 13. Mapa Vivo — imagens

A candidata contém descriptor/visual-lock de Mapa Vivo, mas a página operacional atual desenha uma malha abstrata de nós. A arte/cidade visual fornecida anteriormente **não está materializada como asset binário ligado à tela atual**.

Portanto:

- conceito/roteamento: preservado;
- imagem visual oficial: **gap real**;
- não declarar “Mapa Vivo visual final” até recuperar o asset original ou materializar uma nova arte aprovada e executar regressão responsiva.

## 14. Ícones 3D, logos, gráficos, tabelas e efeitos

- Ícones oficiais: parte do conjunto já foi recuperada/integrada; microações continuam corretamente com ícones funcionais leves.
- Inventário visual anterior ainda tinha ícones principais pendentes.
- Logo LAMOU: presente em superfícies, mas precisa de QA final por tema e resolução.
- Gráficos/tabelas: existem onde a informação pede comparação/estrutura; gráfico sem série real deve continuar ausente ou marcado DEMO.
- Efeitos/depth: melhorados; motion deve respeitar `prefers-reduced-motion`.
- Mapa: arte final ainda pendente de binding.

## 15. Validação de links e botões — regra universal

Cada link/botão deve cumprir estas sete respostas antes de produção:

1. **O que vai acontecer?** rótulo claro.
2. **Para onde vou?** destino previsível.
3. **Isso altera algo?** consequência explícita.
4. **É real ou DEMO?** truth-state visível.
5. **Se estiver desabilitado, por quê?** motivo e próximo passo.
6. **Consigo voltar?** retorno/contexto preservados.
7. **Gerou evidência/dado de uso?** interação operacional registrada, sem coletar conteúdo sensível.

A telemetria transversal cobre page view + interação. Eventos de negócio críticos ainda devem ter instrumentação explícita adicional para registrar **resultado**, não apenas o clique.

## 16. O que faria maior diferença agora

### Para o Proprietário

- Painel real “Uso do ecossistema”: app/módulo, usuários, frequência, erros, última utilização, evidência, cliente/tenant e tendência.
- Planilhão integrado como verificador vivo.
- Mapa Vivo com arte oficial + casos reais sobrepostos.
- Reconciliar 46 apps físicos × catálogo × bindings × rotas × clientes.
- Evidência E2E e recovery real.

### Para o Cliente

- Portal simples: “o que tenho / o que funciona / o que mudou / o que preciso fazer”.
- Apps autorizados com botão Abrir e estado real.
- Saúde/versão/suporte sem jargão CORE.
- Cobrança, contrato, backup e atualização com origem e consequência claras.

## 17. Gate atual

**NAVEGAÇÃO/ARQUITETURA DE INFORMAÇÃO:** BOA BASE / PRESERVAR E LAPIDAR  
**TELEMETRIA `usage.v1` DO OWNER CONSOLE:** IMPLEMENTADA NA CANDIDATA + LEDGER/VIEW NO SUPABASE; execução real de navegador precisa ser observada após rodar a candidata autenticada  
**PLANILHÃO NO OWNER CONSOLE:** PENDENTE DE INTEGRAÇÃO  
**MAPA VIVO — ARTE OFICIAL NA TELA:** PENDENTE  
**TODOS OS APPS INSTRUMENTADOS/CONECTADOS:** NÃO VERIFICADO / COBERTURA PARCIAL  
**CLIENT DEMO/HOMOLOGAÇÃO:** CANDIDATO, com truth-states explícitos  
**CLIENT PRODUÇÃO:** BLOQUEADO até os gates reais de segurança/E2E/recovery/integração

Nenhum destes estados autoriza promoção automática. `main/FROZEN` permanece intocado.
