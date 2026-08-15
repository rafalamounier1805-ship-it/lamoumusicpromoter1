import fs from 'node:fs';
import assert from 'node:assert/strict';

const read = path => fs.readFileSync(path,'utf8');
const index = read('index.html');
const sw = read('sw.js');
const integrations = read('integrations-v10.js');
const migration = read('migration-v11.js');
const stability = read('stability-v12.js');
const uiPolish = read('ui-polish-v12.js');
const workerEntry = read('backend/worker-entry-v10.js');

const order = ['integrations-v10.js','bootstrap-v11.js','migration-v11.js','stability-v12.js','ui-polish-v12.js'].map(x=>index.indexOf(x));
assert(order.every(x=>x>=0),'v12 scripts must be loaded');
assert(order.every((x,i)=>i===0||x>order[i-1]),'script order must preserve OAuth -> bootstrap -> migration -> stability -> UI polish');

assert.match(sw,/pathname\.startsWith\('\/api\/'\)/,'service worker must bypass API routes');
assert.match(sw,/request\.mode==='navigate'/,'SPA fallback must apply only to navigation');
assert(!/cache\.put\(event\.request/.test(sw),'service worker must not blindly cache every GET');
assert.match(sw,/ui-polish-v12\.js/,'latest PWA cache must include UI polish');

assert(!integrations.includes('Ativar integrações'),'integration module must not render a second login modal');
assert(!integrations.includes('intLoginPass'),'integration module must not own a second password field');
assert.match(integrations,/status==='success'\|\|status==='connected'/,'Spotify callback must accept both legacy and normalized success statuses');
assert.match(migration,/showMainLogin/,'legacy local sessions must migrate through the main login');

assert.match(stability,/FINAL=new Set\(\['published','completed','concluded','sent'\]\)/,'history must allow only finalized actions');
assert.match(stability,/window\.dispatchEvent\(new Event\('beforeunload'\)\)/,'wizard must sync visible identity fields before navigation');
assert.match(stability,/Voltar ao hook →/,'dead campaign navigation button must be removed at runtime');
assert.match(stability,/data-v12-switch-account/,'account switching must use the unified session path');
assert.match(uiPolish,/Meu perfil/,'legacy Users card must be relabeled as the unified profile');
assert.match(uiPolish,/regEmail/,'first-access migration form should be prefilled');
assert.match(uiPolish,/getRegistration\(\).*update/,'installed PWA should proactively check for updates');
assert.match(uiPolish,/function setTextIfChanged/,'UI polish must use idempotent text updates');
assert.match(uiPolish,/el&&el\.textContent!==value/,'MutationObserver must not write identical text repeatedly');
assert(!uiPolish.includes("if(strong)strong.textContent='Meu perfil'"),'settings menu must not contain the old recursive observer write');

assert.match(workerEntry,/BUILD='12\.0\.0-stability'/,'worker must expose the v12 build');
assert.match(workerEntry,/path==='\/api\/version'/,'worker must expose a live version endpoint');
assert.match(workerEntry,/String\(x\.kind\|\|''\)==='strategy'/,'strategy AI must have a structured compatibility route');
assert.match(workerEntry,/text:strategies/,'strategy AI must return an array compatible with the current frontend');
assert.match(workerEntry,/startsWith\('blob:'\)/,'cloud sync must strip transient blob URLs');
assert.match(workerEntry,/filter\(isFinalHistory\)/,'cloud history must strip unfinished records');

console.log('LAMOU v12 smoke checks passed.');
