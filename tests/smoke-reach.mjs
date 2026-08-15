import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app-core.js','utf8');
const integrations=fs.readFileSync('integrations-v10.js','utf8');
const runtime=fs.readFileSync('runtime-v13.js','utf8');
const worker=fs.readFileSync('backend/worker-entry-app.js','utf8');
const reach=fs.readFileSync('backend/worker-entry-reach.js','utf8');
const v13=fs.readFileSync('backend/worker-entry-v13.js','utf8');
const wrangler=fs.readFileSync('wrangler.jsonc','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const ignore=fs.readFileSync('.assetsignore','utf8');

assert.match(index,/Nova música/);
assert.match(index,/Histórico/);
assert.match(index,/Resultados/);
assert.match(index,/app-core\.js\?v=13/);
assert.match(index,/runtime-v13\.js\?v=13/);
assert.doesNotMatch(index,/shell-v10\.js|app\.js|bootstrap-v11|migration-v11|stability-v12|ui-polish-v12|lamou-v10\.js/);
assert.match(index,/nav-icon/);

assert.match(app,/DASHBOARD · SPOTIFY/);
assert.match(app,/DASHBOARD · LAMOU/);
assert.match(app,/Divulgação rápida/);
assert.match(app,/Criar campanha/);
assert.match(app,/APROVAÇÃO FINAL/);
assert.match(app,/APROVAR E CONCLUIR/);
assert.match(app,/Gerar outra versão/);
assert.match(app,/Não quer receber mais/);
assert.match(app,/recipient_opt_out/);
assert.match(app,/suppressed/);
assert.match(app,/RANKING TÉCNICO IA/);
assert.match(app,/Global e por estilo — sem plays, views ou crítica/);
assert.match(app,/technicalScore/);
assert.match(app,/fingerprintFile/);
assert.match(app,/A posição global só é publicada com amostra mínima/);
assert.match(app,/artistImage/);
assert.match(app,/releases/);
assert.match(app,/CD \/ álbum \/ projeto de origem/);
assert.match(app,/\['1:1','Capa'\]/);
assert.match(app,/\['9:16','Stories \/ vertical'\]/);
assert.doesNotMatch(app,/Instagram|TikTok|YouTube Shorts|Facebook|Threads/);

assert.match(integrations,/supported:\['spotify'\]/);
assert.doesNotMatch(integrations,/instagram|tiktok|youtube|facebook|threads/i);
assert.match(worker,/\/artists\/\$\{artistId\}/);
assert.match(worker,/\/artists\/\$\{artistId\}\/albums/);
assert.match(worker,/ai_rank_reference/);
assert.match(worker,/criteria:'technical-only'/);
assert.match(worker,/popularity:false/);
assert.match(reach,/Publicação em redes sociais foi removida/);

assert.match(v13,/Never replace a valid account cookie/);
assert.match(v13,/\/api\/auth\/me/);
assert.match(v13,/\/api\/spotify\/track/);
assert.match(v13,/\/api\/diagnostics/);
assert.match(v13,/CREATE TABLE IF NOT EXISTS app_state/);
assert.match(runtime,/Entrar \/ criar conta/);
assert.match(runtime,/Diagnóstico real/);
assert.match(runtime,/computeRealHooks/);
assert.match(runtime,/Metadados carregados/);
assert.match(runtime,/maybeAutoAI/);
assert.match(runtime,/persistState/);
assert.match(runtime,/beforeinstallprompt/);

assert.match(wrangler,/worker-entry-v13\.js/);
assert.match(wrangler,/2026-08-15/);
assert.match(wrangler,/nodejs_compat/);
assert.match(sw,/lamou-runtime-v13/);
assert.match(ignore,/^backend$/m);
assert.match(ignore,/^wrangler\.jsonc$/m);
assert.match(ignore,/^tests$/m);

console.log('LAMOU runtime v13: auth + Spotify + D1 sync + AI + PWA + real hook checks OK');
