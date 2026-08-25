# LAMOU CORE — Promotion & Growth Policy

## Princípio
Promoção é uma capacidade transversal opcional do CORE, nunca uma obrigação visual do produto. Cada aplicativo declara um perfil promocional e somente recebe recursos compatíveis com sua finalidade, público, privacidade e contexto de uso.

## Perfis oficiais
- `commercial`: produto comercial; pode usar campanhas, CTA, referral, compartilhamento, landing pages, cupons/ofertas quando aplicável e experimentos.
- `growth`: produto em crescimento/comunidade; pode usar campanhas, referral, compartilhamento e convite, sem linguagem agressiva de venda.
- `informational`: pode divulgar conteúdo, novidades e compartilhamento, mas não promoção comercial automática.
- `internal-disabled`: produto interno/corporativo; marketing, cupom, referral e tracking promocional ficam desligados por padrão.

## Capacidades
1. Campaign Registry — id, nome, objetivo, início/fim, público, canais e status.
2. CTA Registry — CTA por tela/contexto, prioridade, destino e regra de exibição.
3. Share Engine — links compartilháveis com parâmetros de origem e preview compatível quando a aplicação suportar.
4. Referral Engine — código/link de indicação, apenas em produtos habilitados.
5. Offer/Coupon Engine — opcional; só em produto comercial e nunca inventa desconto.
6. Attribution — first-touch/last-touch, UTM/referral/source, preservando consentimento e LGPD.
7. Experiment Hooks — A/B ou feature flag por provedor substituível; sem depender de um vendor.
8. Conversion Events — visualização, clique, cadastro, ativação, compartilhamento, referral, conversão e retenção.
9. Promotion Health — verifica campanha vencida, CTA quebrado, destino inválido, quota de analytics e conflito de regras.
10. Audit — toda criação/edição/ativação/desativação registra quem fez, quando, antes/depois e motivo.

## Regras de segurança e UX
- Promoção nunca pode bloquear uso principal do app.
- Sem dark patterns, contagem regressiva falsa, escassez falsa ou desconto inventado.
- Push/e-mail/WhatsApp dependem de consentimento e canal habilitado.
- Links externos devem ser validados e auditáveis.
- Tracking promocional respeita consentimento e modo sem analytics.
- Se analytics atingir limite, o app continua funcionando e grava eventos essenciais em fallback local/queue.
- O usuário administrador pode desligar toda a camada promocional por aplicativo.
- Produtos `internal-disabled` não exibem publicidade, referral, cupom ou CTA comercial por herança do CORE.

## Métricas mínimas
- campanha -> visualizações, cliques, conversões, taxa de conversão;
- compartilhamento -> shares, aberturas atribuídas, conversões;
- referral -> convites, ativações e conversões;
- CTA -> exposição, clique, destino e sucesso;
- custo -> custo de ferramenta e TCO operacional quando conhecido.

## Free-first
A camada deve funcionar sem serviço pago. Ordem preferida:
- analytics: PostHog Free -> Umami self-hosted -> local queue/audit;
- feature flags/experimentos: PostHog Free -> flags internas do CORE;
- link attribution: parâmetros próprios do CORE + armazenamento interno;
- QR code: geração local/open source;
- compartilhamento: Web Share API -> copiar link;
- e-mail/push/WhatsApp: somente quando houver provedor gratuito/configurado; falha do canal nunca derruba o app.

## APIs conceituais
- `promotion.createCampaign()`
- `promotion.activateCampaign()`
- `promotion.buildShareLink()`
- `promotion.track()`
- `promotion.registerCTA()`
- `promotion.resolveCTA()`
- `promotion.referral()`
- `promotion.health()`

## Regra de produto
Nenhum recurso promocional é ativado automaticamente apenas porque existe no CORE. O manifesto do aplicativo define o perfil e as capacidades permitidas. A Central LAMOU deve conseguir visualizar e alterar essas permissões com auditoria.