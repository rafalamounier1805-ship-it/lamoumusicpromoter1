# LAMOU IA — Central Oficial

Central oficial única da empresa. Não criar uma nova Central para cada release.

## Regras oficiais
- Uma versão oficial por aplicativo; versões anteriores ficam no histórico interno do produto.
- APP CORE CUSTOM é base transversal, não produto comercial.
- A publicação oficial é PWA e deve atualizar pelo mesmo endereço.
- Nenhum app marcado como publicado deve ficar sem URL oficial validada.
- Segurança, LGPD, autenticação, backup e auditoria mínima pertencem à base.
- Botões visíveis devem executar uma ação real.

## Áreas
Aplicativos, Gestão, Comercial, Clientes, Projetos, CORE, Testes & Health e Configurações.

## Estado desta versão
A Central possui autenticação local de teste, persistência local, auditoria, import/export, gestão de cards oficiais, histórico de versões, leads, clientes/MRR/entitlements, projetos, smoke checks e instalação PWA. Autenticação/RBAC, banco multi-tenant, billing e segredos de produção exigem backend real antes de uso com dados sensíveis.

## Publicação
O workflow `lamou-suite-pages.yml` publica somente `suite/` automaticamente. O antigo workflow de raiz foi tornado manual para impedir que uma versão sobrescreva a outra.
