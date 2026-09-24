# Reconciliação e entrega — 17/09/2026

Estado: CANDIDATE_NOT_PROMOTED. Produção: BLOCKED.

O projeto Lovable bee5a2f8-878d-4954-a168-029ef7399b36 continua no snapshot
532025926ff73e837c5f38be08fd76665ff457e5. Esse snapshot já foi importado
em owner-console/ pelo commit 9fbb026cab1c8d06921e499d45e8509d4ac851ae.
A base revisada nesta entrega é eb9db42, com mudanças posteriores em 95 arquivos.
Não foi necessário reimportar ou sobrescrever a evolução posterior.

Correção de distribuição: o workflow anterior empacotava fontes, não um runtime
compilado. Esta entrega inclui .output para Node, inicializador Windows e fontes.
Node.js 22+ continua sendo requisito; não é um .exe autossuficiente.
Recompilar: bun install --frozen-lockfile; bun scripts/build-portable.mjs.
Executar: INICIAR_WINDOWS.cmd ou node .output/server/index.mjs.
Para servidor, configurar HOST/PORT e os serviços reais antes da publicação.

## Evidência desta execução

- bun install --frozen-lockfile: exit 0.
- 71 testes: 0 falhas; build Node: exit 0.
- TypeScript: exit 0. Lint: 0 erros, 18 warnings Fast Refresh existentes.
- Smoke HTTP local: 200 em /, /install/owner, /install/client, /owner,
  /owner/products, /owner/mapa-vivo, /core, /core/ai, /core/tests, /labtest.
- Smoke HTTP não comprova hidratação, interação, acessibilidade ou autenticação.
- Windows não executado nesta sessão. Build validado em Linux x64.

## Pendências preservadas

Não foi concluída nesta entrega a integração do Planilhão V0.7 (246 linhas),
a vinculação da arte da cidade no Mapa Vivo ou os 16 ícones pendentes.
MFA, provisionamento Cliente, billing, providers, storage, recuperação e testes
E2E requerem validação real própria. Nenhuma conexão foi fabricada.
O benchmark do Cubo permanece SYNTHETIC_DEMO, sem promoção.

Destino confirmado: branch candidate/lamou-owner-console-codex-2026-09-15.
Nenhuma publicação web nesta execução; main/FROZEN preservadas.
