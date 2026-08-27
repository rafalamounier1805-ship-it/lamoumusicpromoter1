# PHARMÉDICE OPS 360 — PLANO OFICIAL DE DESENVOLVIMENTO ETAPA POR ETAPA

Data de consolidação: 26/08/2026
Status: PLANO OFICIAL DE EXECUÇÃO
Projeto: PHARMÉDICE OPS 360

## Regra fixa de desenvolvimento

ESTRUTURAR → COMPARAR → CRITICAR → CONSTRUIR → TESTAR → CRITICAR → REFAZER → APROVAR → CONGELAR → PRÓXIMO MÓDULO

Nada de construir muitas telas e descobrir no final que a base estava errada.

---

## ETAPA 0 — Arrumar a casa

Antes de mexer em tela nova.

### O que fazer
- Definir uma única versão oficial de desenvolvimento.
- Comparar Biblioteca × GitHub × especificação.
- Recuperar da V1 tudo que existe e ainda faz sentido.
- Marcar V1/V2 como referência técnica, não visual.
- Identificar funcionalidades que existem só no documento.
- Identificar funcionalidades que existem no código.
- Identificar funcionalidades parcialmente implementadas.
- Eliminar versões conflitantes.
- Criar backlog mestre único.

### Entrega
Matriz: REQUISITO | PLANEJADO | EXISTE? | QUALIDADE | FALTA | DECISÃO.

### Gate
Só seguir quando estiver claro qual é a base real do programa.

---

## ETAPA 1 — Estrutura geral do produto

Primeira etapa de desenvolvimento propriamente dita.

### 1A — Arquitetura de navegação
Definir:
- Menu principal.
- Submenus.
- Hierarquia das áreas.
- O que pertence ao CORE.
- O que pertence ao Pharmédice.
- O que aparece por perfil.
- Desktop.
- Mobile.
- Busca.
- Notificações.
- Perfil.
- IA contextual.
- Meu Trabalho.
- Configurações.

### Crítica obrigatória
Para cada item responder:
- Nós planejamos isso?
- Já existe?
- Está no lugar correto?
- Está duplicado?
- Está faltando alguma coisa?
- Serve para alguma decisão real?
- É configuração ou operação?

Corrigir antes de desenhar.

---

## ETAPA 2 — Design System

Construir a linguagem visual definitiva.

### Definir
- Logo e aplicação.
- Paleta.
- Tipografia.
- Espaçamentos.
- Grid.
- Cards.
- Botões.
- Inputs.
- Tabelas.
- Gráficos.
- Badges/status.
- Alertas.
- Modais.
- Drawers.
- Tooltips.
- Ícones.
- Fotografias.
- Mascote/IA.
- Estados vazios.
- Loading.
- Erros.
- Claro/escuro, se permanecer.
- Responsividade.
- Acessibilidade.

### Crítica obrigatória
Avaliar:
- Parece software farmacêutico enterprise ou dashboard genérico?
- Tem excesso de informação?
- Existe hierarquia visual?
- Está bonito mas inútil?
- Uma pessoa consegue descobrir o que precisa fazer sem treinamento?

Só congelar o Design System após crítica e correção.

---

## ETAPA 3 — Tela-mãe 1: Cockpit Desktop

### Estrutura planejada
1. Estratégia & Benchmark.
2. Minha Missão Hoje / IA.
3. Operação Hoje.
4. Desempenho das Áreas.
5. Processos.
6. Pessoas.
7. Melhoria.
8. Diagnóstico 360.
9. Mercado & Inteligência.

### Ciclo
A. Mostrar estrutura.
B. Comparar PLANEJADO × EXISTENTE × FALTANTE.
C. Criticar o que deve sair, entrar, mudar de posição ou ganhar prioridade.
D. Construir a tela.
E. Rodar Product Critic: para que serve, quem usa, qual decisão suporta, qual dado alimenta, qual ação nasce daqui, está duplicado, é decoração?
F. Usuário avalia.
G. Refazer quantas vezes forem necessárias.

### Gate
COCKPIT DESKTOP APROVADO.

---

## ETAPA 4 — Tela-mãe 2: Cockpit Mobile

Não é desktop encolhido.

### Definir
- Informação prioritária.
- Navegação.
- Menu/drawer.
- Ações rápidas.
- Alertas.
- IA.
- Minha Missão Hoje.
- Meu Trabalho.
- Visualização de indicadores.
- Gestos/touch.
- Acessibilidade.

Mesmo ciclo: estrutura → comparação → crítica → construção → crítica → teste → refação → aprovação.

---

## ETAPA 5 — Tela-mãe 3: Produção

Tela que comprova se o Pharmédice é sistema industrial ou painel bonito.

### Arquitetura funcional
Família → Produto → OP/Lote → Rota → Etapa → Controle → Quality Gate → Evidência → Liberação.

### Precisa mostrar
- Planejamento.
- OPs/lotes.
- Andamento.
- Etapas.
- Pessoas.
- Equipamentos.
- Material.
- Capacidade.
- CQ.
- QA.
- Desvios.
- OOS/OOT.
- Documentos.
- Riscos.
- Alertas.
- Dependências.
- Previsão de conclusão.
- Problemas.
- Ações.
- Rastreabilidade.

### Pergunta de gate
“Se eu fosse coordenador de produção, essa tela me ajuda a comandar a operação hoje?”

Se não, refazer.

---

## ETAPA 6 — Derivação dos módulos operacionais

Com as três telas-mãe aprovadas, evoluir módulo por módulo.

### 6.1 PCP
Demanda → capacidade → material → sequenciamento → OP → forecast.

### 6.2 Controle de Qualidade
Amostra → análise → fila → TAT → OOS/OOT → resultado → liberação analítica.

### 6.3 Garantia da Qualidade
Desvio → investigação → CAPA → mudança → aprovação → eficácia.

### 6.4 Assuntos Regulatórios
Licenças → compromissos → mudanças → impacto → prazo → evidência.

### 6.5 Suprimentos / Estoque
Material → fornecedor → estoque → criticidade → OPs impactadas.

### 6.6 Manutenção / Engenharia / Metrologia
Equipamento → criticidade → manutenção → calibração → disponibilidade → impacto.

Cada módulo segue: estrutura → planejado × existente → crítica → construção → teste → refação → aprovação.

---

## ETAPA 7 — Meu Trabalho + Calendário Mestre

Meu Trabalho Hoje agrega automaticamente:
- Calendário.
- Riscos.
- Diagnósticos.
- Projetos.
- Ações.
- Documentos.
- Treinamentos.
- Obrigações.
- Pendências.
- Recorrências.

Mostrar: o que fazer → quando → por quê → prioridade → dependência → evidência necessária.

---

## ETAPA 8 — Action Engine

Implementar:
- 5W2H.
- PDCA.
- A3.
- MASP.
- DMAIC.
- 8D.
- CAPA.
- Kaizen.
- FMEA/QRM.

Não criar nove sistemas. IA sugere método adequado; humano decide.

---

## ETAPA 9 — Project Engine

Implementar:
- Objetivo.
- Escopo.
- Responsáveis.
- RACI.
- Cronograma.
- Gantt.
- Kanban.
- Riscos.
- Orçamento.
- Documentos.
- Reuniões.
- Dependências.
- Indicadores.
- Eficácia.

---

## ETAPA 10 — Diagnóstico 360

Fluxo completo:
Preparação → Escopo → Baseline → Métricas → Avaliação → Gaps → Causa → Intervenção → Projeto → Execução → Eficácia.

Modelos:
- Daily.
- Pulse.
- Full 360.
- Extraordinário.
- Reavaliação.

---

## ETAPA 11 — Document & Records Engine

Motor documental único.

Implementar:
- Documentos.
- Registros.
- Versões.
- Revisão.
- Aprovação.
- Histórico.
- Evidências.
- Assinatura.
- Publicação.
- Treinamento relacionado.
- Impacto.
- Source Graph.

Não duplicar POP/documento em módulos diferentes.

---

## ETAPA 12 — PROJETE / Treinamento

Conectar:
POP alterado → pessoas impactadas → treinamento → avaliação → eficácia → recorrência.

Reutilizar PROJETE, sem duplicar.

---

## ETAPA 13 — Goal & Contribution Engine

Empresa → Área → Processo → Equipe → Individual.

Implementar:
- Baseline.
- Meta.
- Resultado.
- Forecast.
- Gap.
- Contribuição.
- Fatores ofensores.
- Histórico.
- Pesos explicáveis.

IA analisa, mas não inventa pesos nem decide desempenho individual.

---

## ETAPA 14 — IA Pharmédice

Um único assistente visual, com especialistas por trás:
- Dados.
- Produção.
- Processos.
- Qualidade.
- NC/Desvios.
- Regulatório.
- Diagnóstico.
- Documentos.
- Metas.
- T&D.
- Reuniões.
- Simulação.
- Mercado.
- Publicações.

Cada resposta deve saber: de onde tirou → que dado usou → confiabilidade → sugestão.

---

## ETAPA 15 — CORE real

Depois do produto estabilizado funcionalmente.

Migrar SIMULAÇÃO para infraestrutura homologável:
- Banco.
- Autenticação.
- SSO.
- MFA.
- RBAC/ABAC.
- Audit trail.
- Storage.
- Backup.
- Observabilidade.
- Logs.
- Assinatura eletrônica.
- Privacy AI Gate.
- Legal Gate.

---

## ETAPA 16 — Integrações

Conectar, conforme realidade da empresa:
- Protheus.
- RH/ponto.
- LIMS.
- QMS.
- GED.
- Manutenção.
- BMS.
- CRM/SAC.
- E-mail.
- Calendário.
- APIs.
- Arquivos.
- Outras fontes existentes.

---

## ETAPA 17 — Manual do Usuário

Somente após as telas/jornadas finais.

Incluir:
- Screenshots reais.
- Jornadas.
- Passos.
- Permissões.
- Erros comuns.
- Ajuda.
- FAQ.
- Glossário.

---

## ETAPA 18 — Teste³ IA

### Funcional
- Jornadas.
- Ações.
- Permissões.
- Persistência.

### UX
- Desktop.
- Celular.
- Tablet.
- Compreensão.
- Quantidade de cliques.
- Retrabalho.

### Técnico
- E2E.
- Performance.
- Erros.
- Segurança.
- Logs.
- Backup.
- Restore.

### Pessoas sintéticas
Testar diferentes cargos e níveis de familiaridade.

---

## ETAPA 19 — Homologação

Separação obrigatória:
SIMULAÇÃO → HOMOLOGAÇÃO → REAL.

Nada pula etapa.

---

## ETAPA 20 — Release

Somente vira versão oficial após:
- Product Critic.
- Teste³ IA.
- Segurança.
- LGPD.
- Integridade de dados.
- Validação aplicável.
- Aprovação humana.

---

# REGRA OPERACIONAL PARA CADA MÓDULO

## 1 — Estrutura
Apresentar a estrutura do módulo.

## 2 — Confronto
Mostrar:
O QUE PLANEJAMOS | O QUE EXISTE | O QUE ESTÁ ERRADO | O QUE FALTA.

## 3 — Crítica independente
Procurar problemas, redundâncias, riscos e oportunidades.

## 4 — Crítica do usuário
O usuário aponta o que gostou e, principalmente, o que não gostou.

## 5 — Construção
Só então alterar código/interface.

## 6 — Teste
Funcional + visual + lógico.

## 7 — Nova crítica
Revisar o que foi construído como se não tivesse sido feito pelo próprio autor.

## 8 — Refatoração
Corrigir.

## 9 — Aprovação do usuário
Só então marcar como APROVADO.

## 10 — Congelamento
Não mexer novamente sem motivo registrado.

---

# PRIMEIRO TRABALHO OFICIAL A PARTIR DE AGORA

ETAPA 1 — ESTRUTURA GERAL DO PHARMÉDICE.

Antes de programar, montar o mapa completo:
menu → módulos → submódulos → telas → funções → CORE utilizado → dados → ações → integrações → permissões.

Classificar cada item:
- ✅ já existe
- 🟡 existe parcialmente
- 🔴 não existe
- ❌ existe mas está errado
- ♻️ duplicado / deve reutilizar CORE

Depois:
1. crítica da estrutura;
2. crítica do usuário;
3. correção;
4. aprovação;
5. somente então iniciar o Cockpit.

## Decisão permanente
Não adicionar novos módulos até fechar estrutura, design system, três telas-mãe e ciclo crítico de validação do que já foi definido.
