# Deploy LAMOU v10 — Cloudflare

## Front-end
A `main` publica `index.html`, `styles.css`, `lamou-v10.js`, manifest, ícones e `sw.js`. O front-end não carrega scripts legados.

## Backend seguro
Para ativar autenticação centralizada, OAuth, IA online e tracking:

1. Criar/usar D1 `lamou-music-promoter`.
2. Executar `backend/schema-v10.sql` no D1.
3. Criar/usar o índice Vectorize compatível com o modelo de embedding escolhido antes de fixar dimensões.
4. Configurar bindings no Worker existente:
   - `DB` → D1
   - `AI` → Workers AI
   - `MUSIC_VECTOR` → Vectorize
   - `ASSETS` → Static Assets
5. Copiar `backend/wrangler.example.jsonc` para a configuração real somente depois de preencher IDs reais.
6. Configurar segredos OAuth no Cloudflare, nunca no GitHub/front-end.
7. Configurar um serviço de e-mail de recuperação aprovado (`RECOVERY_API_URL` + `RECOVERY_API_TOKEN`) ou integração equivalente.
8. Configurar Client IDs/Secrets de Spotify, Meta, TikTok e Google/YouTube no backend.
9. Publicar o Worker e executar `Rodar teste` no aplicativo.

## Regra de publicação
`/api/publish` deve permanecer recusando conclusão enquanto os publicadores oficiais não estiverem configurados. O app não pode inserir ação no Histórico como publicada sem confirmação real.

## IA e custo
Workers AI é a primeira camada quando disponível. Em limite/cota, o backend retorna erro de quota e uma previsão de reset; se o usuário autorizou, o front-end tenta IA do aparelho. Se também não existir, usa heurística local claramente identificada. Nunca iniciar cobrança silenciosa.

## Web
A base de divulgação deve ser revalidada a cada 10 dias. Canais vermelhos não devem ser enviados automaticamente. Login/CAPTCHA/submissões manuais permanecem manuais.
