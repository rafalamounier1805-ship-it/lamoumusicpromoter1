# COMPOSER OS — Auditoria de Produto v2

## Diagnóstico executivo

A primeira versão provou o fluxo, mas ainda parecia um protótipo de dashboard e não um sistema operacional de carreira musical. O principal problema era estrutural: muitos módulos existiam, porém a experiência não deixava claro **o que fazer agora, por que fazer e qual impacto isso destrava**.

### Nota da versão anterior

- Arquitetura funcional: **7/10**
- Clareza de workflow: **5/10**
- Profundidade de negócio musical: **5/10**
- Aparência SaaS profissional: **5/10**
- Assistente de IA: **3/10**
- Auditabilidade: **6/10**
- Prontidão para uso real: **4/10**

## Problemas encontrados

### P0 — Produto
1. **Dashboard orientado a KPI, não a ação.** O usuário via números antes de entender a próxima tarefa.
2. **Copiloto IA parecia um módulo de ranking.** Cards coloridos, “músicas mais prontas” e uma área separada reforçavam a sensação de outro produto reciclado.
3. **Faltava contexto contínuo.** A IA não acompanhava a música/tela atual.
4. **Dossiê ainda raso.** Faltavam distinções visuais mais fortes entre confirmado, declarado, extraído, inferido e pendente.
5. **Mercado era CRM simples.** Precisa evoluir para inteligência de oportunidade, histórico, fit, estágio, materiais enviados e próximo movimento.
6. **Divulgação era só campanha.** Falta calendário editorial, ativos, canais, peças, marcos de release e avaliação pós-lançamento.
7. **Produção era status.** Precisa de entregáveis, versões, aprovações, responsáveis e dependências.
8. **Relatórios eram impressão de tela.** Precisam virar documentos estruturados e rastreáveis.

### P0 — Tecnologia
1. Persistência local é insuficiente para produção.
2. Upload precisa de storage real e hash.
3. Não existe autenticação nem workspace multi-dispositivo.
4. Spotify ainda não está integrado à API real.
5. Não há sistema de permissões.
6. Não há fila de jobs/sincronizações.
7. Não há versionamento documental robusto.

## Mudanças aplicadas na v2

1. **Início virou “Hoje”** e agora prioriza foco, prazos, blockers e follow-ups.
2. **Composer Intelligence virou assistente contextual em drawer**, acessível de qualquer tela.
3. O assistente agora executa ações locais: auditoria de lacunas, criação de tarefas por blocker, pitch, follow-up, checklist sync e revisão documental.
4. Removido o visual roxo/neon da IA. A linguagem visual ficou neutra, operacional e editorial.
5. O assistente declara a base de suas recomendações e não inventa métricas, contatos ou situação jurídica.
6. O dossiê ganhou ação “CI · Analisar faixa”.
7. Direitos, Produção e Mercado ganharam pontos de entrada contextuais do Composer Intelligence.
8. O dashboard passou a mostrar saúde do catálogo e pipeline de mercado sem transformar tudo em ranking.

## Próximas melhorias priorizadas

### P0 — Fundação real
- Banco PostgreSQL/Supabase.
- Login e perfil do compositor.
- Storage de documentos/áudio.
- Upload com SHA-256 e trilha de auditoria.
- Spotify Web API real com OAuth/Artist ID.
- Dossiê persistente em nuvem.

### P0 — Direitos e documentos
- Tipos separados: obra, master, edição, licença, cessão, sync.
- Contribuidores com papéis e percentuais por território.
- Registro autoral com protocolo, órgão, status e certidão.
- Gestão coletiva com associação, obra, fonograma e ISWC.
- Verificador de soma de splits e conflitos.
- Evidence Pack com arquivos, hashes e datas.

### P1 — Mercado
- Diretório de organizações e contatos com fonte e “verificado em”.
- Pipeline completo até negociação/ganho/perdido.
- Histórico de materiais enviados por oportunidade.
- Motivo de perda e aprendizado.
- Deal room por música/oportunidade.
- Gerador de one-sheet e pitch por rota.

### P1 — Divulgação
- Calendário editorial.
- Campanha por release.
- Assets por canal.
- Conteúdo orgânico e mídia paga separados.
- Datas de pré-save, teaser, lançamento e pós-release.
- Métricas manuais/API futuras.

### P1 — Composer Intelligence
- Backend com LLM seguro.
- RAG sobre documentos do próprio catálogo.
- Resumo de contrato com citações ao documento.
- Pitch e follow-up usando contexto da oportunidade.
- Transformar análise em tarefas com aprovação.
- Explicar “por que” cada blocker existe.
- Nunca criar contatos ou métricas sem fonte.

### P2 — Financeiro
- Importação de statements CSV/PDF.
- Reconciliação por ISRC/UPC.
- Receita por faixa, território, DSP e período.
- Split financeiro entre titulares.
- Alertas de receita sem correspondência.

## Critério de produto profissional

O COMPOSER OS só deve chamar um recurso de “automático” quando ele realmente executa a ação ou busca uma fonte conectada. Simulação deve ser identificada como demonstração. Campo sem fonte não pode ser apresentado como fato.
