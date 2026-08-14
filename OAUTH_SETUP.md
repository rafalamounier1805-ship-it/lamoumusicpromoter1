# LAMOU Music Promoter — OAuth / publicação

## Regra de segurança
Nunca salvar senha de Instagram, Facebook, TikTok, YouTube ou Threads no LAMOU. O usuário autoriza a própria plataforma por OAuth. Client secrets, access tokens e refresh tokens ficam somente no backend Cloudflare/D1. Tokens OAuth persistentes são criptografados pelo Worker antes de serem gravados no D1.

## URL base
`https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev`

## Spotify — v10
- Client ID público do app: `8a9c328f33b14bad9b48473d238925fc`
- Fluxo: Authorization Code com PKCE, iniciado e concluído pelo Worker.
- Scopes: `user-read-email user-read-private`.
- Redirect URI obrigatório no Spotify Developer Dashboard:
  `https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/spotify/callback`
- A Redirect URI precisa ser HTTPS e coincidir exatamente com a cadastrada no Spotify.
- O Worker gera `state`, `code_verifier` e `code_challenge` por tentativa, valida o callback e invalida o estado após uso.
- Access token e refresh token são criptografados com AES-GCM antes de serem gravados no D1.
- O refresh do access token é automático quando a conexão expira ou está próxima de expirar.

### Configuração Cloudflare necessária
Variável pública já versionada no `wrangler.jsonc`:
- `SPOTIFY_CLIENT_ID`

Secret que deve ser criado manualmente em Workers & Pages > lamoumusicpromoteroficial > Configurações > Variáveis e segredos:
- `TOKEN_ENCRYPTION_KEY`

Use um valor aleatório forte com pelo menos 32 caracteres e salve como **Secret**, nunca como texto público no GitHub.

Não é necessário colocar o Spotify Client Secret no repositório para este fluxo PKCE.

### Endpoints Spotify v10
- `GET /api/oauth/spotify/start`
- `GET /api/oauth/spotify/callback`
- `GET /api/oauth/status`
- `POST /api/oauth/spotify/disconnect`

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

Antes do Direct Post, o backend deve consultar as capacidades reais da conta e respeitar as opções de privacidade retornadas pela plataforma.

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

## Meta: Instagram / Facebook / Threads
Criar um app Meta adequado às contas profissionais/páginas usadas e habilitar os produtos/APIs correspondentes.

Secrets Cloudflare:
- `META_APP_ID`
- `META_APP_SECRET`

Redirects sugeridos:
- Instagram/Facebook: `https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/meta/callback`
- Threads: `https://lamoumusicpromoteroficial.rafalamounier1805.workers.dev/api/oauth/threads/callback`

As permissões devem ser definidas conforme o tipo real de conta e revisadas no Meta App Dashboard antes de ativar publicação. Não colocar tokens de usuário no front-end.

## Regra de publicação
Uma ação externa só entra como publicada/concluída no Histórico quando a API oficial confirmar a operação. Falha de OAuth, token expirado sem refresh, permissão insuficiente ou erro de publicação não pode ser contabilizado como sucesso.
