# LAMOU IA — Padrão de Dossiê por Aplicativo

## 1. Objetivo
Todo aplicativo LAMOU IA deve possuir um dossiê técnico e documental próprio, acessível a partir do card oficial do produto na Central.

O dossiê existe para preservar versão, documentação, estrutura, direitos, evidências, ativos, arquivos e histórico de compartilhamento sem misturar informações da operação comercial.

## 2. Separação obrigatória
### Pertence ao dossiê do aplicativo
- versão oficial atual;
- versões anteriores;
- links executáveis e pacotes de download;
- documentação funcional e técnica;
- arquitetura e estrutura de software;
- componentes, plugins, APIs e licenças;
- segurança, LGPD e dados;
- testes e evidências;
- autoria, titularidade e propriedade intelectual;
- evidências de criação;
- registros, protocolos e referências;
- manual técnico e operacional;
- marketing do produto;
- posicionamento e proposta de valor;
- continuidade, backup e recuperação;
- licenciamento e distribuição;
- histórico de documentos/versões preparados para envio.

### Não pertence ao dossiê
- leads;
- pipeline;
- propostas comerciais;
- clientes;
- MRR/ARR;
- cobrança;
- contratos comerciais em andamento;
- negociação e forecast.

Esses dados permanecem nas áreas Comercial e Clientes.

## 3. Regra de versão única
A Central mostra um único card por aplicativo.

O card representa sempre a versão oficial vigente. Versões antigas nunca viram novos produtos no catálogo; elas permanecem no histórico do dossiê com seus próprios links, arquivos, datas e notas.

Cada versão pode guardar:
- identificador/versão;
- data;
- URL executável;
- link para arquivo/pacote;
- changelog/notas;
- ficha para download;
- registro de compartilhamento.

## 4. Documentos-base obrigatórios
Todo aplicativo nasce com os seguintes documentos:
1. Resumo executivo do produto.
2. Requisitos, escopo e funcionalidades.
3. Arquitetura e estrutura de software.
4. Inventário de componentes, APIs e licenças.
5. Segurança, LGPD e tratamento de dados.
6. Plano de testes, validação e evidências.
7. Histórico de versões e changelog.
8. Dossiê de autoria e propriedade intelectual.
9. Registro de evidências de criação e titularidade.
10. Manual técnico e operacional.
11. Plano de marketing.
12. Posicionamento, público e proposta de valor.
13. Plano de continuidade, backup e recuperação.
14. Licenciamento, termos de uso e distribuição.

Status documental padrão:
- Base;
- Em revisão;
- Finalizado.

Cada documento deve permitir conteúdo interno, link externo/arquivo, edição, download e preparação de envio.

## 5. Direitos, autoria e prova
O dossiê deve permitir registrar:
- autor/titular principal;
- data/marco inicial de criação;
- repositório principal;
- backup/arquivo-fonte imutável;
- commits, hashes e releases relevantes;
- domínios;
- contratos e cessões;
- registros/protocolos;
- referências de marca/nome;
- licenças de terceiros;
- evidências adicionais com data e link.

### Regra jurídica de integridade
A Central organiza e preserva evidências. Ela não deve afirmar que o simples cadastro dessas informações equivale a registro jurídico formal de software, marca, patente, desenho, obra ou direito autoral.

Quando existir registro formal, o protocolo/certificado deve ser anexado ou referenciado no dossiê.

## 6. Arquitetura e dependências
O dossiê técnico deve documentar, conforme aplicável:
- frontend;
- backend;
- banco de dados;
- autenticação e autorização;
- workspaces/tenancy;
- armazenamento;
- cache;
- filas;
- APIs;
- modelos de IA;
- plugins e integrações;
- observabilidade;
- CI/CD;
- ambientes;
- deploy;
- fluxos de dados;
- dependências críticas;
- licenças e fornecedor alternativo quando necessário.

## 7. Segurança e LGPD
O documento de segurança deve registrar, conforme aplicável:
- dados tratados;
- finalidade;
- base legal quando necessária;
- papéis de controlador/operador;
- compartilhamentos;
- retenção;
- exclusão;
- autenticação;
- RBAC/ABAC;
- criptografia;
- segredos;
- logs;
- auditoria;
- backup;
- recuperação;
- resposta a incidente.

## 8. Marketing do produto
Marketing pertence ao dossiê porque é documentação estratégica do próprio produto, não pipeline comercial.

Deve incluir:
- posicionamento;
- público;
- problema;
- proposta de valor;
- diferenciais;
- concorrentes/alternativas;
- mensagens;
- canais;
- ativos de divulgação;
- calendário;
- métricas;
- experimentos e aprendizados.

## 9. Compartilhamento e rastreabilidade
A Central pode preparar envio por e-mail de documento, versão ou resumo do dossiê.

O log deve registrar:
- data/hora;
- tipo do item;
- nome do item;
- destinatário;
- e-mail;
- status da ação.

Na implementação local atual, o status correto é `Preparado no cliente de e-mail`, pois a Central não recebe confirmação de entrega do provedor. Confirmação real de entrega exigirá integração de e-mail server-side/webhook.

## 10. Download e portabilidade
O dossiê deve manter exportação de documentos e fichas em formato aberto sempre que possível. O backup geral da Central deve incluir todo o objeto `dossier` de cada aplicativo.

## 11. Regra para novos aplicativos
Todo novo aplicativo criado na Central deve receber automaticamente este padrão. Campos podem permanecer incompletos no início, mas a estrutura não pode ser removida sem decisão explícita de governança.

## 12. Evolução futura
Próximas camadas previstas:
- armazenamento server-side de documentos;
- anexos reais;
- hash e assinatura de evidências;
- integração GitHub para commits/releases;
- integração Vercel/Cloudflare para deploys;
- integração de e-mail com confirmação real;
- geração automática de PDF do dossiê;
- assinatura eletrônica quando aplicável;
- políticas de retenção e trilha de auditoria server-side;
- permissões por papel para visualizar/editar/compartilhar documentos.
