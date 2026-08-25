# LAMOU IA — Central Oficial

Central oficial única da empresa. Não criar uma nova Central para cada release.

## Endereço oficial
- Produção: https://lamou-central-oficial.vercel.app
- Projeto Vercel: `lamou-central-oficial`
- Fonte oficial: este diretório `suite/` no branch `main`.

## Regras oficiais
- Uma versão oficial por aplicativo; versões anteriores ficam no histórico interno do produto.
- Cada aplicativo possui um **Dossiê do Produto** próprio e independente da área Comercial.
- O dossiê contém versão atual, versões anteriores, documentação, propriedade intelectual, evidências, arquitetura/estrutura, marketing, arquivos/links e histórico de compartilhamento.
- Leads, clientes, propostas, contratos, MRR e pipeline permanecem nas áreas Comercial/Clientes e não entram no dossiê técnico do aplicativo.
- APP CORE CUSTOM é base transversal, não produto comercial.
- A publicação oficial é PWA e deve continuar no mesmo endereço.
- Releases futuras atualizam o mesmo projeto/domínio; não criar `v2`, `v3`, `final`, `teste` como novas Centrais.
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
A Central possui autenticação local de teste com senha, persistência local, auditoria, import/export, gestão de cards oficiais, dossiê técnico/documental por aplicativo, histórico de versões, leads, clientes/MRR/entitlements, projetos, smoke checks, manifest PWA, service worker e instalação no celular.

Autenticação/RBAC de produção, banco multi-tenant, billing, segredos e políticas server-side ainda exigem backend real antes de uso com dados sensíveis.

## Atualização no celular
A instalação PWA verifica atualização do service worker e recebe a próxima versão quando uma nova publicação é feita neste mesmo projeto Vercel. A integração GitHub → Vercel totalmente automática ainda deve ser conectada; até isso, publicar cada release no projeto `lamou-central-oficial`, sem criar outro domínio.

## GitHub Pages
O workflow `lamou-suite-pages.yml` continua como rota alternativa, mas a ativação do Pages está bloqueada pela permissão da integração da conta. A produção oficial atual é o Vercel acima.
