import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const integrations=fs.readFileSync('integrations-v10.js','utf8');
const worker=fs.readFileSync('backend/worker-entry-reach.js','utf8');
const wrangler=fs.readFileSync('wrangler.jsonc','utf8');
const sw=fs.readFileSync('sw.js','utf8');

assert.match(index,/Nova música/);
assert.match(index,/Histórico/);
assert.match(index,/Resultados/);
assert.match(index,/workflow\.css/);
assert.doesNotMatch(index,/bootstrap-v11|migration-v11|stability-v12|ui-polish-v12|lamou-v10\.js/);

assert.match(app,/DASHBOARD · SPOTIFY/);
assert.match(app,/DASHBOARD · LAMOU/);
assert.match(app,/Divulgação rápida/);
assert.match(app,/Criar campanha/);
assert.match(app,/APROVAÇÃO FINAL/);
assert.match(app,/APROVAR E CONCLUIR/);
assert.match(app,/Gerar outra versão/);
assert.match(app,/Descrição — editável/);
assert.match(app,/Hashtags — editáveis/);
assert.match(app,/CD \/ álbum \/ projeto de origem/);
assert.match(app,/analyseAudio/);
assert.match(app,/useManualHook/);
assert.match(app,/\['1:1','Capa'\]/);
assert.match(app,/\['4:5','Feed vertical'\]/);
assert.match(app,/\['9:16','Stories \/ vertical'\]/);
assert.match(app,/\['16:9','Horizontal'\]/);
assert.match(app,/Spotify for Artists/);
assert.match(app,/Groover/);
assert.match(app,/DailyPlaylists/);
assert.match(app,/Soundplate/);
assert.match(app,/MusoSoup/);
assert.match(app,/ReverbNation Opportunities/);
assert.match(app,/status:'approved'/);
assert.match(app,/h\.status='sent'/);
assert.doesNotMatch(app,/Instagram|TikTok|YouTube Shorts|Facebook|Threads/);

assert.match(integrations,/supported:\['spotify'\]/);
assert.doesNotMatch(integrations,/instagram|tiktok|youtube|facebook|threads/i);
assert.match(worker,/Publicação em redes sociais foi removida/);
assert.match(worker,/Somente Spotify é suportado/);
assert.match(wrangler,/worker-entry-reach\.js/);
assert.match(sw,/lamou-spotify-workflow-v2/);
console.log('LAMOU Spotify + approval workflow smoke test: OK');
