# PROMPT MESTRE — FINALIZAÇÃO LAMOU OWNER
Data: 2026-09-15
Branch: candidate/lamou-owner-platform-2026-09-15
Status: CANDIDATA — SALVAR != PROMOVER

## MISSÃO
Finalizar a candidata LAMOU Owner tornando o sistema EXECUTÁVEL, LINKADO, VISUAL, DIDÁTICO, RASTREÁVEL e INTEGRADO, preservando o que já existe e sem reconstruir do zero.

Regra principal: PRIMEIRO, O QUE NÓS JÁ TEMOS?
Antes de criar qualquer coisa, reconciliar Lovable, GitHub, Supabase, Registry, Version/MuDoc, Visual Locks, documentos, desenhos, planilhas, ícones e rotas atuais. Não remover nem reescrever funcionalidade aprovada sem Decision & Provenance Gate.

Nunca alegar integração, PASS, venda, receita, envio, backup, autenticação, IA, evidência ou publicação sem execução real. Usar truth-states FACT/EVIDENCED, EXTERNAL_EVIDENCE, HYPOTHESIS, SYNTHETIC_DEMO, NOT_VERIFIED, BLOCKED, IMPLEMENTED_VERIFIED, IMPLEMENTED_NOT_VERIFIED, PARTIAL, SIMULATED, DOCUMENTED_ONLY, NOT_CONNECTED, NOT_APPLICABLE.

## OBJETIVO DE ACEITE
Ao final desta candidata:
- nenhuma rota de menu aponta para tela inexistente;
- nenhum botão clicável é placebo;
- todo item abre uma ação, detalhe, fluxo real ou explica claramente NOT_CONNECTED;
- toda informação relevante consegue voltar para sua fonte/evidência;
- toda tela principal é compreensível em poucos segundos por alguém que não conhece o sistema;
- visual LAMOU consistente, com ícones, estados, gráficos/tabelas quando úteis, hover/foco/seleção e Sheets laterais;
- desktop 1440x900, tablet 768x1024 e mobile 360x800 sem quebra funcional;
- Supabase/Auth/RLS, quando tecnicamente disponível, substitui fixtures/localStorage para funções operacionais reais;
- SALVAR != PROMOVER permanece obrigatório.

# ORDEM DE EXECUÇÃO — PRIORIDADE MESTRE

## P0-01 — RECONCILIAÇÃO TOTAL
1. Inventariar todas as rotas, menus, componentes, apps, tabelas Supabase, registries, CALLs, documentos e Visual Locks.
2. Comparar estado atual com versões anteriores para localizar superfícies que existiam e sumiram, incluindo Conselho & Skills e LABTEST.
3. Corrigir divergências de Registry, nomes, slugs e rotas antigas.
4. Não reconstruir recurso já existente: migrar/restaurar.

## P0-02 — DESIGN SYSTEM, ÍCONES E ESTADOS
1. Recuperar biblioteca oficial de ícones LAMOU, logo, ícones CORE e CORE Cubo, Mapa Vivo e Visual Locks.
2. Criar padrão visual reutilizável para botão, tag, badge, card, KPI, tabela, gráfico, timeline, formulário, Sheet, toast, banner e tooltip.
3. Tags não podem parecer botões; botões devem ter tamanhos/hierarquia consistentes.
4. Card clicável: hover com elevação 2–4px, sombra, halo/borda discreta, pressed, selected e keyboard focus; respeitar reduced-motion.
5. Seleção normal = azul/ciano. Vermelho somente para erro, bloqueio, risco crítico ou ação destrutiva.
6. Reduzir parede de texto: priorizar ícone, dado, gráfico, status, tabela, timeline e progressive disclosure.
7. Garantir contraste em LIGHT: evitar branco sobre branco; usar fundo gelo, cartões diferenciados, bordas e sombras sutis.

## P0-03 — INSTALAÇÃO DO PROPRIETÁRIO
1. Jornada separada de Central e CORE.
2. Tela inicial deve conter login/identidade do proprietário, pacote pronto para instalar, resumo da instalação no primeiro viewport, requisitos, documentação, acessibilidade e suporte.
3. Manter 7 etapas: Verificação; Identidade; Segurança; Consentimentos/APIs; Configurações; CORE/conexões; Testes/ativação.
4. Remover redundância visual: após iniciar, usar UMA linha de etapas no topo; remover barra horizontal extra de progresso; donut só na etapa final como PRONTIDÃO TÉCNICA.
5. Layout compacto e didático: onde estou, o que faço, o que é obrigatório e próximo botão devem ficar óbvios.
6. Login/Auth real via Supabase quando disponível; MFA, recuperação e sessão não podem ser fake.
7. Readiness Gate: bloqueadores têm ID, origem, severidade, responsável, evidência, ação e status. Bloqueador crítico impede ativação normal; modo degradado só se política permitir.
8. Mensagens globais: toast verde sucesso, azul info, amarelo atenção, vermelho erro; bloqueador usa banner persistente. Sino mostra contagem aberta e abre lateral de notificações.

## P0-04 — INSTALAÇÃO DO CLIENTE
1. Fluxo separado da instalação do proprietário.
2. Inicia em Central > Clientes > Novo/Provisionar cliente.
3. Tenant, identidade, contrato/pacote, entitlements, segurança, APIs permitidas, CORE Cliente, apps, testes e ativação.
4. Cliente nunca acessa profundidade do CORE Proprietário.

## P0-05 — CENTRAL / COGNITIVE
Menu canônico da Central: Cognitive/Cockpit; Mapa Vivo; Clientes; Produtos; Comercial & Contratos; Oportunidades; Configurações.

Cognitive deve responder: como estamos, o que está ruim, qual é a meta, quanto falta e o que fazer agora.
- KPIs com ícones;
- atual x meta x tendência x gap;
- filtro Somente críticos realmente altera conteúdo;
- pendências, clientes afetados, produtos, contratos, oportunidades e versões em resumo;
- clique abre Sheet lateral com fonte, impacto, responsável, data, evidência, IA e ações.

## P0-06 — MAPA VIVO
1. Recuperar Visual Lock tecnológico do Mapa Vivo.
2. Não usar grade abstrata vazia.
3. Mostrar áreas/nós, saúde, cor/severidade, quantidade aberta, resolvida, tendência e ranking das áreas com mais problema.
4. Legenda quantitativa: verde/azul/amarelo/vermelho etc.
5. Drill-down em Sheet lateral com problema, origem, fonte, benchmark, impacto, responsável, data, hipótese, evidência, IA e ações.
6. Ações: investigar, atribuir, abrir fonte, abrir IA, criar plano, abrir projeto, registrar evidência.
7. Central usa Mapa Vivo gerencial; profundidade técnica pertence ao CORE.

## P0-07 — CLIENTE 360
1. Logo/monograma da empresa, status, saúde, pacote, contrato, cobrança, versão, atualização, backup, apps, problemas, comunicação, suporte e timeline na mesma ficha.
2. Apps licenciados já visíveis na visão geral, sem exigir outra tela para descobrir o que o cliente possui.
3. CRUD governado: Novo, Editar, Arquivar/Excluir conforme permissão, Histórico.
4. Alterar pacote: atual x novo, delta de apps/entitlements/limites, impacto financeiro/contratual, aceite, data imediata/agendada e preview de mensagem.
5. Mensagens padronizadas: boas-vindas, novo app, alteração de plano, atualização programada/concluída/falha, cobrança, renovação e entitlement.
6. Mensagem deve ter link para app/tela quando aplicável.
7. Sem canal real de e-mail/WhatsApp/SMS, manter preview e NOT_CONNECTED; não alegar envio.
8. Atualizações e backups agendados devem gerar timeline/evidência.

## P0-08 — PRODUTOS / PORTFÓLIO
Corrigir qualquer rota quebrada /owner/products versus /owner/apps e adotar Produtos como visão gerencial única.

### Classificação de aplicativos
Separar claramente:
A. APLICATIVOS INCUBADOS DO PROPRIETÁRIO — usados internamente pela LAMOU, em pesquisa, operação ou amadurecimento; podem não estar à venda.
B. PRODUTOS COMERCIAIS — prontos/autorizados para catálogo, Showroom, proposta, licenciamento e cliente.

Um app mantém a mesma identidade canônica e pode evoluir pelos estágios:
Ideia -> Incubado -> Protótipo -> Em Teste -> Piloto -> Homologação -> Produto Comercial -> Produção -> Evolução -> Descontinuado.

### Dashboard obrigatório de Produtos
A tela deve mostrar, com filtros por período, estágio, família, cliente e segmento:
- total de produtos;
- total incubados x comerciais;
- produtos por estágio;
- número de clientes por produto;
- instalações/licenças/entitlements ativos;
- produto com maior número de vendas/contratações;
- produto com maior receita real quando houver fonte;
- MRR/ARR/receita acumulada quando houver dados reais;
- ticket médio por produto/pacote;
- conversão Showroom/diagnóstico/proposta -> contrato;
- churn/cancelamento/renovação por produto;
- uso/adopção: usuários ativos, frequência, utilização das capacidades;
- produto com maior saída/adoção;
- produto com maior crescimento;
- produto com menor uso apesar de contratado;
- produto que mais gera chamados/incidentes;
- produto com maior taxa de falha por cliente/versão/componente;
- motivos de problemas: UX, dados, integração, segurança, performance, versão, treinamento, configuração, provider etc.;
- impacto dos problemas: clientes afetados, horas, custo, SLA, receita/risco quando calculável;
- satisfação/SAC/NPS somente com fonte real;
- qualidade/testes/evidência;
- saúde, versão e atualização disponível;
- CORE/capabilities/plugins/providers usados;
- custo operacional estimado/real;
- histórico de versões, incidentes, vendas e mudanças de pacote.

### Ficha de Produto
Cada produto deve ter: ID, nome, ícone, família, estágio, estado, versão, owner, propósito, diferenciais, clientes, receita/contratos, uso, qualidade, satisfação, incidentes, roadmap, documentos, evidências, CORE usado, bindings, CALLs, dados/fontes, integrações, custos, riscos, IP/inovação e histórico.

### Valor do produto
Mostrar VALOR/VALUATION apenas de forma explicável:
- comparáveis de mercado;
- capacidade funcional;
- diferenciação/IP;
- maturidade técnica;
- adoção/uso;
- receita real/potencial;
- economia/impacto comprovado;
- estágio do produto;
- risco/gaps/custo de manutenção.
Toda estimativa deve mostrar método, data, fonte e confiança. Sem benchmark confiável: ESTIMATIVA / NOT_VERIFIED. Nunca inventar valuation comprovado.

### Showroom
Showroom só deve expor produtos comerciais ou candidatos explicitamente autorizados para demonstração. Incubados do Owner podem permanecer funcionais sem aparecer ao cliente.

## P0-09 — COMERCIAL & CONTRATOS
1. Deixar de ser tela estática.
2. Leads, oportunidades, propostas, contratos, empresas, pacotes, planos, valor, responsável, renovação, metas, conversão e pipeline.
3. CRUD: Novo Lead, Nova Proposta, Novo Contrato/Plano, Editar, Arquivar.
4. Abrir contrato real/documento quando disponível.
5. Comparação visual dos pacotes e empresas ligadas a cada pacote.
6. Promoções/descontos governados e historizados.
7. Contrato COMERCIAL pertence aqui.

## P0-10 — CORE: MENU CANÔNICO APENAS 9 ITENS
1. Visão Geral
2. Indicadores de Saúde
3. Arquitetura Técnica
4. Aplicativos, Plugins & Demais Bindings
5. Planos de Ação & Melhorias
6. Testes & Qualidade
7. Versões & Atualizações
8. Observabilidade
9. Configurações

Não criar menu separado para Segurança, Dados & Fontes, CALLs & Contratos, IA/Prompts/Agentes, Treinamentos ou SOL/LUA.

### CORE > Visão Geral
Visual forte e didático: estado, saúde, riscos, problemas, planos, testes, versões e prioridade. Pode oferecer gateway Intelligence 360 -> benchmark -> Mapa Vivo relacionado.

### CORE > Indicadores de Saúde
Indicadores por família técnica com contribuição positiva/negativa, meta/faixa, tendência, impacto, fonte, evidência e responsável. Clicar abre Sheet.

### CORE > Arquitetura Técnica
COREs/capabilities divididos em famílias:
- IA & Orquestração
- Dados & Conhecimento
- Segurança & Identidade
- Qualidade & Validação
- Integrações & APIs
- Operação & Observabilidade
- Plataforma & Runtime
- Governança/Licenciamento
- UX & Documentação
Cada item: ID, versão, estado, dependências, consumidores, documentos, integrações/CALLs e evidência.

PROMPTS pertencem à família IA & Orquestração dentro da Arquitetura, não a menu próprio.

CALL é contrato técnico de comunicação entre componentes, não contrato comercial. Exibir como detalhe técnico: origem, destino, função/endpoint, input/output, auth/scope, tenant, timeout, retry, fallback, custo/limite, log, teste e evidência.

### Dados & Fontes
Não manter como menu raiz do CORE. Integrar principalmente em Testes & Qualidade e Arquitetura como biblioteca/registry de fontes/evidências.
Cada dado relevante deve ter símbolo/ícone, fonte, link, owner, atualização, truth-state e consumidores. Clicar numa métrica deve levar à informação/fonte correspondente.

### CORE > Aplicativos, Plugins & Bindings
Clique abre Sheet amplo com capabilities, providers, dados, permissões, CALLs, testes, versões e consumidores. Link para aplicativo real quando existir.

### CORE > Planos de Ação & Melhorias
Fluxo obrigatório:
Problema -> hipótese -> evidência -> teste -> IA/análise -> decisão -> plano -> projeto/execução -> resultado -> eficácia/aprendizado.
CRUD completo, responsável, prazo, prioridade, impacto, métricas, fontes e evidências.
Recuperar Visual Lock/Kanban já fornecido.

INTELLIGENCE 360 NÃO É FUNÇÃO INTERNA DO CORE. É APP independente integrado a este fluxo. Botão contextual: “Analisar no Intelligence 360”. O app aprofunda métricas, benchmark, diagnóstico, fatores internos/externos, impacto, cenário e recomendação; resultado retorna ao caso/plano/projeto no CORE com proveniência e evidência.

### CORE > Testes & Qualidade
Concentrar Teste³ IA, Persona Lab, Quest 360/experimentos relacionados, Validation Gate, evidências e comparativos. Dados/fontes usados em teste entram aqui com proveniência. Experimentos/candidatas profundas ficam no LABTEST.

### CORE > Versões & Atualizações
Versão atual/candidata, ambientes, update, rollback, backup/restore, release notes, evidências, gates e promoção. SALVAR != PROMOVER.

### CORE > Observabilidade
Logs, sinais, métricas, incidentes, performance, custo/latência, segurança operacional, integrações e oportunidades derivadas. Toda métrica deve apontar para fonte/evidência.

### CORE > Configurações
Ambientes, runtime, providers/modelos, prompts/skills, APIs/scopes, integrações, segurança, tenants, observabilidade, backup, limites, custos, feature flags e comportamento de falha.

## P0-11 — LABTEST
1. Restaurar/migrar LABTEST e Conselho & Skills existentes; não reconstruir do zero.
2. SOL = operacional corrente; LUA = candidatas/experimentos.
3. Recuperar Visual Lock do Laboratório: Teste³, Personas, Validation Gate, baselines, comparativos, evidências, modelos/providers.
4. Roadmap CORE Padrão -> Cubo -> Cubo Mágico -> Prisma -> Fantasma -> Caleidoscópio permanece experimental até promoção explícita.

## P0-12 — CONFIGURAÇÕES DA CENTRAL
Transformar Configurações em painel real, pesquisável:
- Organização/Workspace
- Proprietário/perfil
- Usuários, papéis e permissões
- MFA/sessões
- Clientes/tenants
- IA/modelos
- APIs, plugins, integrações e scopes
- Dados/fontes
- Notificações
- Inicialização, bloqueadores e Readiness
- Segurança
- Privacidade/LGPD/retenção
- Backup/restore
- Ambientes
- Aparência/acessibilidade
- Licenças/cobrança
- Custos/quota
- Auditoria/logs
- Feature flags
- LAB/experimentos

Política de bloqueadores: definir quais severidades impedem inicialização; modo estrito/degradado; revalidação automática/manual; destinatários e mensagens.

## P0-13 — DOCUMENTAÇÃO INTEGRADA
Conectar Documento Vivo/LAMOU Version, desenhos, planilhas, diagramas e assets usando IDs canônicos, versão, proveniência, bindings, CURRENT e PINNED.
Todo CORE/app deve conseguir navegar para documentação/evidência e documentos devem apontar de volta para consumidor/versão.

## P0-14 — INTEGRAÇÃO REAL
1. Usar Supabase para Auth, dados e RLS onde disponível.
2. Reconciliar tabelas, tipos, tenant isolation e políticas.
3. Nenhum segredo no frontend.
4. Integrações externas por adaptador/contrato com timeout, retry, fallback, observabilidade, custo e teste.
5. Reconciliar GitHub/Registry/Version para linhagem.

## P0-15 — TESTE FINAL
Executar e registrar:
- login/logout/recuperação/MFA quando disponíveis;
- instalação Owner e Cliente;
- todas as rotas/menu;
- todo CRUD;
- todo botão/link/filtro;
- Sheets e mensagens;
- CALLs conectadas;
- sucesso, acesso negado, schema inválido, timeout, indisponibilidade e recuperação;
- tenant isolation/RLS;
- backup/restore quando disponível;
- desktop/tablet/mobile;
- foco/teclado/contraste/reduced-motion;
- truth-states e evidências.

## P0-16 — DEPLOY
Publicar somente CANDIDATA após os gates e testes. Não promover automaticamente para baseline oficial.

# REGRAS DE ENTREGA
Ao final de cada bloco informar:
1. o que já existia e foi preservado;
2. o que foi corrigido;
3. arquivos/rotas/tabelas afetados;
4. dados/integrações realmente conectados;
5. testes executados e evidências;
6. bloqueios/NOT_CONNECTED/NOT_VERIFIED;
7. próximos passos.

Nenhuma conclusão do tipo “pronto”, “integrado”, “enviado”, “vendido”, “aprovado” ou “produção” sem evidência executada.