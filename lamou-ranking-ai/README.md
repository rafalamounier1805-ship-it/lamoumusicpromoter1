# LAMOU Ranking AI

Aplicativo publicado diretamente a partir da pasta `app/`, sem compactação intermediária.

Cloudflare Builds:
- Root directory: `/lamou-ranking-ai`
- Build: `npm run prepare-app`
- Deploy: `cd app && npx wrangler deploy`
- Non-production: `cd app && npx wrangler versions upload`

A aplicação mede áudio localmente, preserva histórico local e separa dados medidos, verificados e interpretados. Banco D1 será vinculado na etapa seguinte.
