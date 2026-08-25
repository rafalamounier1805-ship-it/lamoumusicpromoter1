# LAMOU IA — Central Oficial

Central oficial única da empresa. Não criar uma nova Central para cada release.

## Endereço oficial
- Produção: https://lamou-central-oficial.vercel.app
- Projeto Vercel: `lamou-central-oficial`
- Fonte oficial: este diretório `suite/` no branch `main`.

## CORE: duas coisas diferentes
### 1. CORE transversal / base macro
É a arquitetura comum aplicada aos produtos LAMOU IA: autenticação, usuários, workspaces, RBAC/ABAC, persistência, auditoria, AI Gateway, billing/quotas, segurança/LGPD, observabilidade, backup/DR, PWA, acessibilidade, testes, CI/CD e demais módulos compartilhados.

Ele aparece na aba **CORE** da Central e não deve ser confundido com um aplicativo.

### 2. LAMOU CORE Studio / aplicativo
É o aplicativo que permite organizar, visualizar e evoluir o APP CORE CUSTOM. Ele deve aparecer como card próprio na aba **Aplicativos**.

Projeto existente no Vercel: `app-core-custom`.
URL oficial atual: https://app-core-custom.vercel.app

Portanto: **CORE transversal != CORE Studio**.

## Regra de ambientes por aplicativo
Cada aplicativo possui dois canais permanentes e separados:

### TESTE / DEMO
- ambiente de desenvolvimento, homologação e demonstração;
- pode conter dados fictícios, seed, mocks, contas de exemplo e simulações;
- pode ser mostrado a alguém para visualizar como o produto funciona;
- alterações são validadas aqui antes de virar release oficial;
- nunca é tratado como uma versão histórica comum.

### OFICIAL / PRODUÇÃO
- ambiente limpo para entrega e uso real;
- é a versão que pode ser enviada ao comprador/cliente;
- não deve conter dados demonstrativos, contas fictícias, seed, mocks ou simulações;
- usa configuração, segredos, banco e permissões de produção;
- é a única versão marcada como oficial no catálogo principal.

### Promoção TESTE → OFICIAL
A promoção leva o código/configuração aprovada, changelog e versão candidata. **Dados simulados não são copiados para produção.** Antes da publicação oficial devem ser executados smoke/E2E, revisão de segurança/LGPD, limpeza de dados demo, validação documental e geração do artefato oficial.

## Regras oficiais
- Um card por aplicativo.
- Um ambiente TESTE/DEMO e um ambiente OFICIAL/PRODUÇÃO por aplicativo.
- Versões anteriores ficam no histórico interno do produto; não viram novos cards.
- Cada aplicativo possui um **Dossiê do Produto** próprio e independente da área Comercial.
- O dossiê contém ambientes, versão atual, versões anteriores, documentação, propriedade intelectual, evidências, arquitetura/estrutura, marketing, arquivos/links e histórico de compartilhamento.
- Leads, clientes, propostas, contratos, MRR e pipeline permanecem nas áreas Comercial/Clientes e não entram no dossiê técnico do aplicativo.
- A publicação oficial é PWA e deve continuar no mesmo endereço.
- Releases futuras atualizam o mesmo produto/domínio; não criar `v2`, `v3`, `final` ou `teste` como produtos separados.
- Nenhum app marcado como publicado deve ficar sem URL oficial validada.
- Segurança, LGPD, autenticação, backup e auditoria mínima pertencem à base.
- Botões visíveis devem executar uma ação real.
- A logo canônica da LAMOU IA fica versionada dentro de `suite/`.

## Dossiê padrão por aplicativo
A estrutura inicial possui 14 documentos-base: resumo executivo; requisitos/escopo; arquitetura; inventário de componentes/APIs/licenças; segurança/LGPD; testes e evidências; changelog; autoria/propriedade intelectual; cadeia de evidências de titularidade; manual técnico/operacional; plano de marketing; posicionamento/proposta de valor; continuidade/backup; licenciamento/termos/distribuição.

Cada documento pode guardar conteúdo, status, link externo, download local e preparação de envio por e-mail. A Central registra destinatário, item e data quando o envio é preparado no cliente de e-mail. Como o frontend local não recebe confirmação do provedor, esse registro não deve ser interpretado como comprovação de entrega.

O módulo de direitos organiza provas e referências (commits, releases, contratos, domínios, registros e protocolos), mas não afirma que essa organização, sozinha, equivale a registro jurídico formal.

## Áreas
Aplicativos, Gestão, Comercial, Clientes, Projetos, CORE, Testes & Health e Configurações.

## Estado desta versão
A Central possui autenticação local de teste com senha, persistência local, auditoria, import/export, gestão de cards, dossiê técnico/documental por aplicativo, canais TESTE/OFICIAL, histórico de versões, leads, clientes/MRR/entitlements, projetos, smoke checks, manifest PWA, service worker e instalação no celular.

Autenticação/RBAC de produção, banco multi-tenant, billing, segredos e políticas server-side ainda exigem backend real antes de uso com dados sensíveis.

## Atualização no celular
A instalação PWA verifica atualização do service worker e recebe a próxima versão quando uma nova publicação é feita neste mesmo projeto Vercel. A integração GitHub → Vercel totalmente automática ainda deve ser conectada; até isso, publicar cada release no projeto `lamou-central-oficial`, sem criar outro domínio.

## GitHub Pages
O workflow `lamou-suite-pages.yml` continua como rota alternativa, mas a ativação do Pages está bloqueada pela permissão da integração da conta. A produção oficial atual é o Vercel acima.
