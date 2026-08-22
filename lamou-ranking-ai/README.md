# LAMOU Ranking AI — bootstrap de deploy

Esta pasta contém o pacote executável do LAMOU Ranking AI para implantação via Cloudflare Workers Builds.

Configuração no Cloudflare:
- Root directory: `/lamou-ranking-ai`
- Build command: `npm run prepare-app`
- Deploy command: `cd app && npx wrangler deploy`
- Non-production deploy: `cd app && npx wrangler versions upload`

O primeiro deploy ativa site, PWA e Workers AI. O D1 será conectado no passo seguinte para habilitar histórico em nuvem.
