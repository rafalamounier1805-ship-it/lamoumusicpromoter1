# LAMOU Music Promoter — OAuth / publicação

## Regra de segurança
Nunca salvar senha de Instagram, Facebook, TikTok, YouTube ou Threads no LAMOU. O usuário autoriza a própria plataforma por OAuth. Client secrets, access tokens e refresh tokens devem ficar no backend Cloudflare (Secrets/KV/D1), nunca no HTML ou em repositório público.

## URL base
`https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev`

## Spotify
- Client ID público já configurado no front-end: `8a9c328f33b14bad9b48473d238925fc`
- Redirect URI obrigatório no Spotify Developer Dashboard:
  `https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/callback`
- Fluxo: Authorization Code + PKCE.
- Scopes atuais do LAMOU: `user-read-email user-read-private`.
- O redirect URI precisa ser idêntico ao cadastrado no Spotify.

## TikTok
Criar/usar um app no TikTok for Developers e habilitar Login Kit + Content Posting API.

Credenciais a guardar no Cloudflare:
- `TIKTOK_CLIENT_KEY`
- `TIKTOK_CLIENT_SECRET`

Redirect URI sugerido:
`https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/tiktok/callback`

Scopes previstos:
- `user.info.basic`
- `video.publish` para Direct Post
- `video.upload` quando o fluxo for upload para edição/conclusão no TikTok

Antes do Direct Post, o backend deve consultar `creator_info/query` e respeitar as opções de privacidade retornadas pela conta.

## YouTube
Criar OAuth Client no Google Cloud, habilitar YouTube Data API v3 e configurar tela de consentimento.

Secrets Cloudflare:
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

Redirect URI sugerido:
`https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/youtube/callback`

Scopes previstos:
- `https://www.googleapis.com/auth/youtube.upload`
- adicionar `youtube.readonly` somente quando necessário para leitura do canal.

Apps públicos que usam scopes sensíveis podem exigir verificação do Google.

## Meta: Instagram / Facebook / Threads
Criar um app Meta adequado às contas profissionais/páginas que serão usadas e habilitar os produtos/APIs de publicação correspondentes.

Secrets Cloudflare:
- `META_APP_ID`
- `META_APP_SECRET`

Redirects sugeridos:
- Instagram/Facebook: `https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/meta/callback`
- Threads: `https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/threads/callback`

As permissões devem ser definidas conforme o tipo real de conta (Página/Instagram profissional/Threads) e revisadas no Meta App Dashboard antes de ativar publicação. Não colocar tokens de usuário no front-end.

## Endpoints esperados pelo front-end v7
- `GET /api/oauth/status`
- `GET /api/oauth/{provider}/start`
- `POST /api/oauth/{provider}/disconnect`
- callbacks por provider conforme acima
- `POST /api/publish`
- `GET /api/ai/health`
- `POST /api/ai`

## Status da implementação
O front-end já possui a Central de Contas, o LAMOU AI Copilot, verificação de conexão e fluxo de publicação que somente tenta publicar quando a conta está autorizada. Spotify usa PKCE no navegador e `/callback`. As demais redes dependem das credenciais acima e de backend Cloudflare para troca/renovação segura de tokens.
