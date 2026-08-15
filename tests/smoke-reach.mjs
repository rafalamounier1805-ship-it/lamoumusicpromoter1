import fs from 'node:fs';
import assert from 'node:assert/strict';

const index=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const integrations=fs.readFileSync('integrations-v10.js','utf8');
const worker=fs.readFileSync('backend/worker-entry-reach.js','utf8');
const wrangler=fs.readFileSync('wrangler.jsonc','utf8');

assert.match(index,/app\.js/);
assert.doesNotMatch(index,/bootstrap-v11|migration-v11|stability-v12|ui-polish-v12|lamou-v10\.js/);
assert.match(app,/Spotify for Artists/);
assert.match(app,/Groover/);
assert.match(app,/DailyPlaylists/);
assert.match(app,/Soundplate/);
assert.match(app,/MusoSoup/);
assert.match(app,/ReverbNation Opportunities/);
assert.match(app,/status:'sent'/);
assert.doesNotMatch(app,/Instagram|TikTok|YouTube Shorts|Facebook|Threads/);
assert.match(integrations,/supported:\['spotify'\]/);
assert.doesNotMatch(integrations,/instagram|tiktok|youtube|facebook|threads/i);
assert.match(worker,/Publicação em redes sociais foi removida/);
assert.match(worker,/Somente Spotify é suportado/);
assert.match(wrangler,/worker-entry-reach\.js/);
console.log('LAMOU Spotify-only outreach smoke test: OK');
