# LAMU IA HUB v4 — Especificação consolidada

Versão executável gerada em 2026-08-24 e salva na Biblioteca do ChatGPT em `/LAMU IA/Lamu Hub/v4/`.

## Separação obrigatória
- **Produtos/aplicativos**: catálogo comercial da Lamu IA.
- **APP CORE CUSTOM**: base universal transversal, maior que qualquer produto específico; não deve aparecer como se fosse mais um app comercial.
- Cada produto escolhe somente os módulos do CORE que precisa.

## Comercial v4
- cadastro de clientes por produto;
- mensalidade/MRR;
- plano e status contratual;
- módulos contratados/entitlements;
- renovação;
- status operacional manual com data do último check;
- leads separados de clientes;
- catálogo de produto-base + add-ons;
- Condomínio Reclame incluído como produto SaaS.

## SaaS
- um código por produto;
- tenant por cliente comprador;
- database-per-tenant quando risco, LGPD, contrato ou necessidade de backup/restauração justificarem;
- usuários internos protegidos por RBAC/ABAC;
- grupo/bloco/setor não é fronteira automática de segurança;
- portabilidade e no vendor lock-in.

## Condomínio Reclame — packaging
Produto-base Essencial + add-ons: Áreas do Condomínio, Entenda seu Condomínio, Condomínio IA, Analytics Pro, Comunicação Comprovada, Administração Integrada, Comunicados, Sugestões & Melhorias, Pesquisas & Enquetes, Reservas, Stories do Condomínio e White-label Plus.

## Segurança
Segurança, LGPD, autenticação, isolamento de dados, backups e auditoria mínima fazem parte do produto-base e não são extras pagos.

## Artefato
`LAMU_IA_HUB_EXECUTAVEL_v4.html`
SHA-256: `4a61f25fbd4fc3e0881cac24cd3664e3cf8f26b7f689d4e24c8748e08498c86a`
