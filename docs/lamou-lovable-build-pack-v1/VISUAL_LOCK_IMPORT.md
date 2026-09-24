# Visual Lock Import - procedimento didatico

## Objetivo

Levar as imagens/modelos visuais do LAMOU para o projeto construido no Lovable **sem deixar o ativo preso ao Lovable**.

## Fonte

Os arquivos full-resolution estao no `LAMOU_BUILD_PACK_V1_CANDIDATA.zip` e sao identificados por `ASSET_REGISTRY.json`.

## Procedimento

1. Extraia o Build Pack em ambiente controlado.
2. Confira nome, `asset_id` e SHA256 no `ASSET_REGISTRY.json`.
3. Copie os ativos para `public/assets/visual-locks/` do repositorio do produto ou para storage proprio LAMOU.
4. Commit os ativos ou o manifesto de storage no GitHub.
5. O Lovable deve ler o repositorio/arquivos; nao deve manter a unica copia.
6. Construa a interface com componentes reais; nao transforme o screenshot em uma imagem clicavel.
7. Registre o binding `asset_id -> app -> tela/contexto -> versao`.
8. Rode verificacao de hash, responsividade, acessibilidade e regressao visual.
9. Somente apos evidencia marque o binding como `VERIFIED`.

## Visual Locks / referencias atuais

- `ASSET-001` - Biblioteca de icones LAMOU IA.
- `ASSET-002` - Showroom.
- `ASSET-003` / `ASSET-006` - Instalacao/Onboarding do Cliente.
- `ASSET-004` - LAMOU IA Owner / Mapa Vivo.
- `ASSET-005` - Instalacao do Proprietario.
- `ASSET-007` - Orbit / LifeOS, Neural Flow.
- `ASSET-008` - CORE Proprietario / arquitetura.
- `ASSET-009` - Testes, Qualidade, Validation Gate e Lab.
- `ASSET-010` - Opportunity Intelligence / ficha da oportunidade.
- `ASSET-011` - Opportunity Intelligence / validacao por gates.
- `ASSET-012` - Orbit / LifeOS, opcoes A/B/C de layout.

## Regra de independencia

Se Lovable parar de ser usado, os assets continuam no Build Pack/GitHub/storage LAMOU e os bindings continuam resolvidos pelo Registry. O editor nao e proprietario do ativo, do ID, do historico ou do contrato visual.
