# LAMOU IA — Central Oficial

Central oficial única da empresa. Não criar uma nova Central para cada release.

## Endereço oficial
- Produção: https://lamou-central-oficial.vercel.app
- Projeto Vercel: `lamou-central-oficial`
- Fonte oficial: este diretório `suite/` no branch `main`.

## Regras oficiais
- Uma versão oficial por aplicativo; versões anteriores ficam no histórico interno do produto.
- APP CORE CUSTOM é base transversal, não produto comercial.
- A publicação oficial é PWA e deve continuar no mesmo endereço.
- Releases futuras atualizam o mesmo projeto/domínio; não criar `v2`, `v3`, `final`, `teste` como novas Centrais.
- Nenhum app marcado como publicado deve ficar sem URL oficial validada.
- Segurança, LGPD, autenticação, backup e auditoria mínima pertencem à base.
- Botões visíveis devem executar uma ação real.
- A logo canônica da LAMOU IA fica versionada dentro de `suite/`.

## Áreas
Aplicativos, Gestão, Comercial, Clientes, Projetos, CORE, Testes & Health e Configurações.

## Estado desta versão
A Central possui autenticação local de teste com senha, persistência local, auditoria, import/export, gestão de cards oficiais, histórico de versões, leads, clientes/MRR/entitlements, projetos, smoke checks, manifest PWA, service worker e instalação no celular.

Autenticação/RBAC de produção, banco multi-tenant, billing, segredos e políticas server-side ainda exigem backend real antes de uso com dados sensíveis.

## Atualização no celular
A instalação PWA verifica atualização do service worker e recebe a próxima versão quando uma nova publicação é feita neste mesmo projeto Vercel. A integração GitHub → Vercel totalmente automática ainda deve ser conectada; até isso, publicar cada release no projeto `lamou-central-oficial`, sem criar outro domínio.

## GitHub Pages
O workflow `lamou-suite-pages.yml` continua como rota alternativa, mas a ativação do Pages está bloqueada pela permissão da integração da conta. A produção oficial atual é o Vercel acima.
