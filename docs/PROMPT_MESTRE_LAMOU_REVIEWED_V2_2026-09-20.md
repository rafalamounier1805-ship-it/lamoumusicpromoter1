# LAMOU IA — PROMPT MESTRE REVIEWED V2
## Gestão + CORE Proprietário + LABTEST + Cliente
### Candidate de arquitetura e execução — 20/09/2026

## ESTADO
CANDIDATE_NOT_PROMOTED

## ESCOPO
Trabalhar exclusivamente nas superfícies pós-login da LAMOU IA, CORE, LABTEST e Cliente.
NÃO alterar instalação, wizard, boas-vindas, recovery ou fluxos de ativação já aprovados.

## REGRA ZERO
PRIMEIRO: O QUE NÓS JÁ TEMOS?

Antes de criar componente, rota, campo, tabela, gráfico, asset ou fluxo:
1. inventariar o que já existe;
2. reutilizar componente/asset/contrato aprovado;
3. preservar conteúdo aprovado;
4. derivar candidata sem sobrescrever FROZEN;
5. marcar verdade: REAL, VERIFIED, PARTIAL, NOT_VERIFIED, NOT_CONNECTED, SYNTHETIC_DEMO ou HYPOTHESIS.

## REVISÃO OBRIGATÓRIA PELO CONSELHO LOCAL
A candidata deve ser revisada por estas lentes:
- Product Manager — problema, decisão, valor e escopo.
- Product Designer — fluxo, hierarquia, estados e redução de carga cognitiva.
- UI Designer — acabamento, tokens, duas cores de acento, dark/light e ícones.
- Design System Architect — reuso, tokens e governança visual.
- Software Architect — fronteiras LAMOU IA × CORE × LABTEST × Cliente.
- Front-end Engineer — responsividade, estados de UI e performance.
- QA/Test Architect — botão real, teste, evidência e regressão.
- Accessibility Specialist — WCAG, teclado, foco e ARIA.
- Learning Experience / Instructional Designer — didática, microcopy, ordem de leitura e explicação contextual.

Se o provider do Conselho estiver NOT_CONNECTED, usar as definições/checklists locais e declarar LOCAL_CHECKLISTS_ONLY. Não simular execução externa.

# PRINCÍPIO DO PRODUTO

## LAMOU IA = GESTÃO
Responde:
- o que está acontecendo;
- com quem;
- quanto vale;
- o que exige atenção;
- qual cliente/produto/contrato está envolvido;
- qual decisão precisa ser tomada;
- qual resultado está sendo produzido;
- para onde encaminhar.

## CORE PROPRIETÁRIO = EXECUÇÃO TÉCNICA
Responde:
- como funciona;
- onde falhou;
- qual dependência;
- qual versão/build;
- qual CORE/capability/provider;
- qual evidência;
- como corrigir;
- como validar;
- como distribuir;
- como recuperar.

## LABTEST = EXPERIMENTAÇÃO + EVIDÊNCIA + GATE
Responde:
- qual hipótese;
- qual baseline;
- qual mudança;
- qual métrica;
- qual resultado;
- qual evidência;
- passou nos obrigatórios;
- precisa reteste;
- pode seguir ao Validation Gate.

## CLIENTE = SERVIÇO + RESULTADO + TRANSPARÊNCIA AUTORIZADA
Mostra somente o tenant, contrato, serviços, resultados, documentos, suporte e acessos do cliente.

# CONTRATO DE EXECUÇÃO DE PÁGINA

Toda página deve declarar:
- PAGE_ID;
- público;
- propósito;
- pergunta principal;
- decisões que a tela permite;
- dados obrigatórios;
- filtros;
- estados;
- ações;
- fonte;
- truth-state;
- evidência;
- responsável;
- histórico;
- responsividade;
- assets;
- componentes reutilizados;
- testes mínimos.

## ORDEM DIDÁTICA OBRIGATÓRIA
1. O que está acontecendo?
2. Por que isso importa?
3. Qual evidência sustenta?
4. O que posso fazer agora?

Detalhe técnico vem depois, sem esconder a nomenclatura correta.

## CARD
Nenhum card pode ser decorativo.
Todo card precisa, quando aplicável, conter:
- título;
- valor ou estado;
- contexto/meta/denominador;
- tendência ou período;
- origem;
- truth-state;
- ação/destino real.

Card clicável abre destino ou detalhe real.
Botão sem executor deve ficar desabilitado ou marcado NOT_CONNECTED com motivo.

## CRITICIDADE
Implementar controles:
- Todos os dados;
- Somente críticos;
- Somente probabilidade quando aplicável;
- Dados críticos × Todos os dados em módulos técnicos.

Crítico = crítico/falha.
Probabilidade = atenção separada.
Vermelho apenas para erro, bloqueio, crítico/falha.
Não depender apenas de cor.

## DUAS CORES / TEMAS
Temas:
- Dark Owner: navy/charcoal.
- Light executivo.

Cores de acento controladas:
- cyan;
- violet.

Não criar arco-íris de status.
Status usa tokens semânticos.

## RESPONSIVIDADE
Validar:
- 360;
- 768;
- 1440;
- 1672×941 Visual Lock desktop.

Sem overflow/pan horizontal indevido.
Mobile reorganiza prioridade; não é desktop encolhido.
Scroll vertical natural.

## ÍCONES E IMAGENS
Reusar:
- owner-icons-sprite.webp;
- Biblioteca Visual;
- Visual Locks existentes do CORE e Mapa Vivo;
- assets já inventariados.

Ícones finais de módulos usam assets 3D aprovados quando disponíveis.
Microações podem usar ícones funcionais leves.
Não inventar arte oficial.

## GRÁFICOS
Gráficos são consumidos pelo contrato Visual & Media CORE.
Todo gráfico mostra:
- título;
- métrica;
- unidade;
- período;
- baseline/meta;
- fonte;
- truth-state;
- legenda;
- tooltip;
- estado vazio;
- acessibilidade.

Nunca usar gráfico decorativo.
Dados sintéticos precisam de SYNTHETIC_DEMO visível.

# LAMOU IA — GESTÃO

## 1. VISÃO GERAL / COGNITIVE
Pergunta:
O que preciso saber, decidir ou fazer agora?

Campos/blocos:
- período;
- organização;
- cliente;
- produto;
- responsável;
- situação;
- ambiente;
- visão;
- clientes ativos;
- clientes em implantação;
- clientes em risco;
- produtos/apps ativos;
- contratos ativos;
- contratos a renovar;
- oportunidades;
- pipeline;
- propostas;
- valor potencial;
- valor realizado;
- utilização;
- adoção;
- resultados;
- mudanças recentes;
- o que exige atenção;
- próximas ações;
- fonte/evidência.

Obrigatório:
- criticidade funcional;
- cards com informação;
- gráfico do CORE;
- coluna contextual;
- explicação ⓘ;
- destinos reais.

## 2. MAPA VIVO GERENCIAL
Entidades:
Cliente → Produto → Aplicativo → Contrato → Oportunidade → Projeto/Ação → Caso → Resultado.

Caso Vivo:
Origem → Sinal → Problema → Hipótese → Evidência → Teste → Decisão → Ação → Resultado → Eficácia → Aprendizado.

Campos:
ID, entidade, nome, tipo, cliente, produto, app, relacionamento, status, severidade, origem, fonte, sinal, impacto, responsável, atualização, evidências, ações, histórico.

## 3. CLIENTE 360
Identificação:
ID, razão social, nome fantasia, CNPJ/identificação, setor, segmento, porte, país, estado, cidade, site, status, entrada, responsável LAMOU, origem.

Pessoas:
nome, cargo, área, papel, telefone, e-mail, contato principal, decisor, usuário, administrador, contrato, financeiro, técnico, permissões, histórico.

Comercial:
origem, lead, oportunidade, proposta, negociação, responsável, valor, produtos, histórico, motivo ganho/perdido.

Contrato:
número, proposta, status, início, fim, renovação, valor, periodicidade, cobrança, produtos, apps, serviços, licenças, SLA, obrigações, anexos, assinatura, aprovação, financeiro.

Tenant/ambiente:
Tenant ID, ambiente, pacote, entitlements, apps/serviços liberados, usuários, limite, storage, versão atual, última atualização.

Produtos/apps:
produto, app, plano, versão, status, usuários, adoção, frequência, último uso, resultado, problemas, tickets, atualização.

Saúde:
relacionamento, utilização, implantação, suporte, contrato, financeiro, resultado, satisfação, risco.
Sem score geral sem metodologia publicada.

Resultados:
objetivo, baseline, indicador, esperado, atual, evolução, economia, ganho, produtividade, redução de erro/tempo, evidência, período, validador.

Riscos:
categoria, probabilidade, impacto, criticidade, responsável, mitigação, prazo, evidência, situação.

Timeline:
comercial, implantação, acessos, produto, suporte, contrato, resultados, alterações, comunicações importantes.

## 4. PRODUTOS & APLICATIVOS
Produto:
Product ID, nome, categoria, descrição, problema, valor, público, segmento, owner, responsável, status, versão comercial, apps, serviços, pacote, modelo comercial, clientes, contratos, receita, uso, resultado, satisfação, roadmap, riscos, documentos, histórico.

Aplicativo:
App ID, nome, descrição, finalidade, produto, estado, versão, clientes, usuários, uso, rendimento, valor produzido, problemas, ocorrências, indicadores, resultados, histórico, owner, responsável, público, ambiente, adoção, frequência, último uso, docs, CORE relacionado, qualidade, última validação, atualização.

## 5. COMERCIAL & CONTRATOS
Lead → Qualificação → Oportunidade → Diagnóstico/Fit → Proposta → Negociação → Contrato → Cliente/Projeto → Renovação/Expansão.

Lead:
ID, empresa, pessoa, cargo, e-mail, telefone, origem, campanha, setor, região, necessidade, responsável, data, status, próxima ação, notas.

Qualificação:
dor, necessidade, problema, prioridade, urgência, maturidade, orçamento, decisor, influenciadores, prazo, solução atual, fit, restrições, evidências.

Oportunidade:
ID, cliente/lead, título, setor, dor, necessidade, origem, descoberta, fonte, evidência, score e metodologia, produto recomendado, apps, valor, receita potencial, recorrência, probabilidade, valor ponderado, estágio, responsável, concorrente, diferenciais, risco, previsão, próxima ação, histórico.

Proposta:
ID, oportunidade, cliente, solução, escopo, produtos, apps, serviços, quantidade, preço, desconto, recorrência, condições, validade, prazo, premissas, exclusões, SLA, anexos, status, versão, aprovação, responsável.

Contrato:
ID, proposta, cliente, escopo, produtos, apps, serviços, licenças, IP, entitlements, quantidade, valor, pagamento, início, fim, renovação, reajuste, SLA, obrigações, responsáveis, signatários, assinatura, anexos, status, alterações, histórico.

## 6. CONFIGURAÇÕES GERENCIAIS
Organização, usuários, papéis, permissões, estágios comerciais, status de cliente, pacotes, entitlements, notificações, tipos documentais, retenção, integrações gerenciais.

# CORE PROPRIETÁRIO
Menu:
1. Mapa Vivo
2. Execução & Indicadores
3. Produtos & Aplicativos
4. Casos & Soluções
5. Radar & Oportunidades
6. Documentos
7. Versões, Distribuição & Recuperação
8. Governança
9. Configurações

## MAPA VIVO TÉCNICO
Cliente → Produto → App → CORE → Capability → Provider → API/Integração → Dados → Ambiente → Versão → Build → Instalação.

Campos:
ID, tipo, nome, versão, status, ambiente, owner, dependências, dependentes, clientes afetados, apps, COREs, providers, integrações, métricas, alertas, evidências, alteração, histórico.

## EXECUÇÃO & INDICADORES
disponibilidade, saúde, latência, throughput, uso, erros, falhas, timeout, jobs, integrações, APIs, consumo, incidentes, custo, capacidade, performance.

Métrica:
Metric ID, objeto, nome, descrição, valor, unidade, baseline, meta, limite, período, tendência, fonte, confiança, atualização, alerta, evidência.

## PRODUTOS/APPS TÉCNICOS
ID, produto, app, versão, ambiente, repo, branch, commit, build, COREs, capabilities, providers, APIs, banco, storage, dados, auth, integrações, Visual & Media, dependências, requisitos, secret refs, clientes, entitlements, testes, segurança, observabilidade, documentação, status, histórico.

## CASOS & SOLUÇÕES
Problema → Sintoma → Impacto → Investigação → Hipótese → Causa → Solução → Teste → Evidência → Resultado → Eficácia → Conhecimento.

Campos:
Case ID, título, descrição, origem, cliente, produto, app, CORE, capability, provider, integração, versão, ambiente, severidade, impacto, sintomas, logs, eventos, hipótese, causa, workaround, solução, responsável, prazo, teste, esperado, real, evidência, reteste, eficácia, status, histórico.

## RADAR TÉCNICO
melhoria, CORE, capability, provider, API, integração, arquitetura, automação, performance, segurança, custo, novo recurso.

Pipeline:
Detectado → Analisando → Validando → Planejado → Em Teste → Aprovado → Implementado → Medindo Eficácia.

## VERSÕES / DISTRIBUIÇÃO / RECOVERY
SALVAR ≠ PROMOVER.
Development → Candidate → Testing → Validated → Frozen → Production → Superseded → Archived.

Version:
ID, produto, app, CORE, versão, parent, status, branch, commit, autor, data, changelog, risco, testes, evidências, aprovação.

Build:
ID, version, commit, ambiente, data, responsável, manifest, checksum, assinatura, dependências, resultado, artifact, evidências.

Distribuição:
ID, build, cliente, tenant, entitlement, versão atual/alvo, autorização, data, resultado, rollback.

Recovery:
ID, snapshot, backup, restore point, versão, ambiente, data, integridade, responsável, teste, resultado.

# LABTEST
Áreas:
Visão Geral, Testes, Meus Testes, Experimentos, Baselines, Ambientes, Métricas, Evidências, Resultados, Validation Gate, Retestes, Eficácia, Fila de candidates.

Teste:
Test ID, nome, tipo, objeto, Object ID, versão, objetivo, hipótese, pergunta, critério, cenário, ambiente, tenant teste, dataset, baseline, variação, persona/profissional, runner, pré-condições, passos, métrica, limiar, esperado, real, evidência, início, fim, responsável, revisor, resultado, falhas, severidade, reteste, eficácia, histórico.

Regras:
- baseline PINNED/FROZEN;
- uma mudança por ensaio;
- runner real ou NOT_CONNECTED;
- PASS exige evidência;
- score não substitui gate;
- TESTADO ≠ APROVADO.

# CLIENTE
LAMOU IA Cliente:
Início, Aplicativos, Resultados, Documentos, Suporte, Minha Conta.

CORE Cliente:
Painel, Problemas & Soluções, Meus Produtos & Serviços, Documentos & Suporte, Minha Conta & Acessos.

Nunca mostrar:
providers estratégicos, prompts, hipóteses internas, LAB interno, arquitetura proprietária, segredos, outros tenants, decisões internas.

# ESTADOS OBRIGATÓRIOS
loading, vazio, normal, atenção, crítico, sucesso, erro, offline, sem permissão, NOT_CONNECTED, NOT_VERIFIED, dados desatualizados.

# BOTÕES
Todo botão define:
- ação;
- executor;
- permissão;
- estado;
- loading;
- feedback;
- erro;
- confirmação;
- auditoria quando crítico.

# QUALIDADE
Antes de chamar candidata de executável:
- TypeScript verde;
- testes verdes;
- lint verde;
- build verde;
- navegação verificada;
- responsividade 360/768/1440/1672;
- sem botão placebo;
- sem dado real inventado;
- sem tocar na instalação.

# RESULTADO ESPERADO
Um único sistema conectado e rastreável:
Oportunidade → Cliente → Proposta → Contrato → Produto → Aplicativo → Resultado.

Indicador ruim → Cliente afetado → Caso → CORE → Causa → Solução → Candidate → LABTEST → Evidência → Gate → Versão → Resultado → Eficácia.

Produto → Clientes → Uso → Valor → Problemas → Melhorias → Evolução.

Não construir dashboards isolados.
Construir gestão, execução, validação e cliente como camadas conectadas.
