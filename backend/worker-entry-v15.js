import app from './worker-entry-v14.js';

const enc = new TextEncoder();
const now = () => new Date().toISOString();
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status,
  headers: {'content-type':'application/json; charset=utf-8','cache-control':'no-store', ...headers}
});

const PLATFORMS = Object.freeze({
  siqa: {
    id:'siqa', name:'SIQA AI Music Charts',
    registerUrl:'https://www.thesiqa.com/siqa-chart-submission',
    formUrl:'https://www.thesiqa.com/siqa-chart-submission',
    rankingUrl:'https://www.thesiqa.com/charts',
    checkUrls:['https://www.thesiqa.com/charts'],
    reviewLabel:'Aguardando revisão editorial / próxima atualização do chart'
  },
  nex: {
    id:'nex', name:'NEX',
    registerUrl:'https://nexmusic.ai/auth',
    formUrl:'https://nexmusic.ai/',
    rankingUrl:'https://nexmusic.ai/',
    checkUrls:['https://nexmusic.ai/','https://nexmusic.ai/music-video'],
    reviewLabel:'Aguardando Admin quality review / entrada no battle pool'
  },
  maddafakka: {
    id:'maddafakka', name:'Maddafakka AI Music Billboard',
    registerUrl:'https://maddafakka.org/charts/',
    formUrl:'https://maddafakka.org/charts/',
    rankingUrl:'https://maddafakka.org/charts/',
    checkUrls:['https://maddafakka.org/charts/'],
    noRegistration:true,
    reviewLabel:'Aguardando aparecer no board público'
  },
  auaima: {
    id:'auaima', name:'Australian AI Music Alliance',
    registerUrl:'https://auaimusic.com/en/ai-music-registration-system/',
    formUrl:'https://auaimusic.com/en/ai-music-chart/',
    rankingUrl:'https://auaimusic.com/en/ai-music-chart/',
    checkUrls:['https://auaimusic.com/en/ai-music-chart/','https://auaimusic.com/en/global-ai-music-hot-chart/'],
    reviewLabel:'Aguardando elegibilidade / atualização semanal'
  },
  aimx: {
    id:'aimx', name:'AIMXCHANGE / AIMX Chart',
    registerUrl:'https://aimxchange.com/signup',
    formUrl:'https://aimxchange.com/',
    rankingUrl:'https://aimxchange.com/charts',
    checkUrls:['https://aimxchange.com/charts','https://aimxchange.com/discover'],
    reviewLabel:'Aguardando publicação / consideração no chart'
  },
  nikagu: {
    id:'nikagu', name:'Nikagu',
    registerUrl:'https://nikagu.ai/',
    formUrl:'https://nikagu.ai/',
    rankingUrl:'https://nikagu.ai/',
    checkUrls:['https://nikagu.ai/'],
    reviewLabel:'Aguardando publicação / ranking público'
  }
});

function cookie(req, name) {
  const raw = req.headers.get('cookie') || '';
  const hit = raw.split(';').map(x => x.trim()).find(x => x.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : '';
}
function b64(bytes) { return btoa(String.fromCharCode(...bytes)); }
async function sha(value) {
  const d = await crypto.subtle.digest('SHA-256', enc.encode(String(value || '')));
  return b64(new Uint8Array(d));
}
async function currentUser(req, env) {
  if (!env.DB) return null;
  const token = cookie(req, 'lamou_session');
  if (!token) return null;
  const hash = await sha(token);
  return env.DB.prepare(`SELECT u.id,u.username,u.email,u.display_name,u.email_verified
    FROM sessions s JOIN users u ON u.id=s.user_id
    WHERE s.token_hash=? AND s.expires_at>? LIMIT 1`).bind(hash, now()).first();
}
async function body(req) { try { return await req.json(); } catch (_) { return {}; } }
function safe(v,max=500){return String(v??'').replace(/\u0000/g,'').trim().slice(0,max)}
function norm(v){return safe(v,1000).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

async function ensureTables(env) {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS submission_tracks(
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      artist TEXT NOT NULL DEFAULT 'LAMOU',
      spotify_url TEXT,
      spotify_id TEXT,
      album TEXT,
      cover TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id,spotify_url)
    )`),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS submission_states(
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      track_id TEXT NOT NULL,
      platform_id TEXT NOT NULL,
      registration_status TEXT NOT NULL DEFAULT 'red',
      form_status TEXT NOT NULL DEFAULT 'red',
      ranking_status TEXT NOT NULL DEFAULT 'red',
      result_status TEXT NOT NULL DEFAULT 'pending',
      rank_value TEXT,
      note TEXT,
      evidence_json TEXT,
      opened_at TEXT,
      last_checked_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      UNIQUE(user_id,track_id,platform_id)
    )`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_submission_tracks_user ON submission_tracks(user_id,created_at DESC)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_submission_states_user_track ON submission_states(user_id,track_id)'),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS submission_platform_accounts(
      user_id TEXT NOT NULL,
      platform_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'red',
      source TEXT,
      updated_at TEXT NOT NULL,
      PRIMARY KEY(user_id,platform_id)
    )`)
  ]);
}

async function ensureKnownMigration(env,user){
  const t=now();
  await env.DB.prepare(`INSERT INTO submission_platform_accounts(user_id,platform_id,status,source,updated_at)
    VALUES(?,?,?,?,?) ON CONFLICT(user_id,platform_id) DO NOTHING`)
    .bind(user.id,'siqa','green','known_account',t).run();
  await env.DB.prepare(`INSERT INTO submission_platform_accounts(user_id,platform_id,status,source,updated_at)
    VALUES(?,?,?,?,?) ON CONFLICT(user_id,platform_id) DO NOTHING`)
    .bind(user.id,'nex','green','known_account',t).run();

  let tr=await env.DB.prepare(`SELECT id FROM submission_tracks WHERE user_id=? AND lower(title)=lower(?) LIMIT 1`).bind(user.id,'SIM SIM SALABIM - Remix').first();
  if(!tr){
    const id=crypto.randomUUID();
    await env.DB.prepare(`INSERT INTO submission_tracks(id,user_id,title,artist,created_at,updated_at) VALUES(?,?,?,?,?,?)`)
      .bind(id,user.id,'SIM SIM SALABIM - Remix','LAMOU',t,t).run();
    tr={id};
  }
  const siqa=await env.DB.prepare(`SELECT id FROM submission_states WHERE user_id=? AND track_id=? AND platform_id='siqa' LIMIT 1`).bind(user.id,tr.id).first();
  if(!siqa){
    await env.DB.prepare(`INSERT INTO submission_states(id,user_id,track_id,platform_id,registration_status,form_status,ranking_status,result_status,note,evidence_json,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),user.id,tr.id,'siqa','green','green','blue','under_review','Formulário enviado; aguardando análise/ranking.','{"source":"known_submission"}',t,t).run();
  }
  const nex=await env.DB.prepare(`SELECT id FROM submission_states WHERE user_id=? AND track_id=? AND platform_id='nex' LIMIT 1`).bind(user.id,tr.id).first();
  if(!nex){
    await env.DB.prepare(`INSERT INTO submission_states(id,user_id,track_id,platform_id,registration_status,form_status,ranking_status,result_status,note,evidence_json,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?,?)`).bind(crypto.randomUUID(),user.id,tr.id,'nex','green','blue','red','under_review','Upload realizado; aguardando Admin quality review do NEX.','{"source":"user_confirmed_upload"}',t,t).run();
  }
}

async function accountMap(env,userId){
  const {results=[]}=await env.DB.prepare('SELECT platform_id,status FROM submission_platform_accounts WHERE user_id=?').bind(userId).all();
  return Object.fromEntries(results.map(r=>[r.platform_id,r.status]));
}
async function ensureStatesForTrack(env,userId,trackId){
  const accounts=await accountMap(env,userId); const t=now();
  for(const p of Object.values(PLATFORMS)){
    const reg=p.noRegistration?'green':(accounts[p.id]||'red');
    await env.DB.prepare(`INSERT INTO submission_states(id,user_id,track_id,platform_id,registration_status,form_status,ranking_status,result_status,note,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,track_id,platform_id) DO NOTHING`)
      .bind(crypto.randomUUID(),userId,trackId,p.id,reg,'red','red','pending','',t,t).run();
  }
}
async function listDashboard(env,user){
  await ensureTables(env); await ensureKnownMigration(env,user);
  const {results:tracks=[]}=await env.DB.prepare('SELECT * FROM submission_tracks WHERE user_id=? ORDER BY created_at DESC').bind(user.id).all();
  for(const tr of tracks) await ensureStatesForTrack(env,user.id,tr.id);
  const {results:states=[]}=await env.DB.prepare('SELECT * FROM submission_states WHERE user_id=? ORDER BY platform_id').bind(user.id).all();
  const byTrack={};
  for(const tr of tracks) byTrack[tr.id]={...tr,platforms:[]};
  for(const s of states){
    const p=PLATFORMS[s.platform_id]; if(!p||!byTrack[s.track_id])continue;
    byTrack[s.track_id].platforms.push({...s,platform:p});
  }
  return json({ok:true,tracks:Object.values(byTrack),platforms:Object.values(PLATFORMS)});
}

async function addTrack(req,env,user){
  await ensureTables(env); const x=await body(req); const t=now();
  const title=safe(x.title,220), artist=safe(x.artist||'LAMOU',180), spotifyUrl=safe(x.spotifyUrl,1000);
  if(!title) return json({error:'Título da faixa é obrigatório.'},400);
  let row=spotifyUrl?await env.DB.prepare('SELECT * FROM submission_tracks WHERE user_id=? AND spotify_url=? LIMIT 1').bind(user.id,spotifyUrl).first():null;
  if(!row){
    const id=crypto.randomUUID();
    await env.DB.prepare(`INSERT INTO submission_tracks(id,user_id,title,artist,spotify_url,spotify_id,album,cover,created_at,updated_at)
      VALUES(?,?,?,?,?,?,?,?,?,?)`).bind(id,user.id,title,artist,spotifyUrl||null,safe(x.spotifyId,80)||null,safe(x.album,220)||null,safe(x.cover,2000)||null,t,t).run();
    row=await env.DB.prepare('SELECT * FROM submission_tracks WHERE id=?').bind(id).first();
  }
  await ensureStatesForTrack(env,user.id,row.id);
  return json({ok:true,track:row});
}

async function markOpened(req,env,user){
  await ensureTables(env); const x=await body(req); const trackId=safe(x.trackId,120), pid=safe(x.platformId,80), stage=safe(x.stage,40); const p=PLATFORMS[pid];
  if(!trackId||!p)return json({error:'Faixa/plataforma inválida.'},400);
  await ensureStatesForTrack(env,user.id,trackId);
  const t=now();
  const s=await env.DB.prepare('SELECT * FROM submission_states WHERE user_id=? AND track_id=? AND platform_id=? LIMIT 1').bind(user.id,trackId,pid).first();
  if(!s)return json({error:'Estado não encontrado.'},404);
  let reg=s.registration_status, form=s.form_status, rank=s.ranking_status, note=s.note||'';
  if(stage==='registration'&&reg==='red') reg='blue';
  if(stage==='form'&&form==='red') form='blue';
  if(stage==='ranking'&&rank==='red'&&form!=='red') rank='blue';
  note = stage==='form' ? (p.reviewLabel||'Aguardando confirmação da plataforma') : note;
  await env.DB.prepare(`UPDATE submission_states SET registration_status=?,form_status=?,ranking_status=?,opened_at=?,note=?,updated_at=? WHERE id=?`)
    .bind(reg,form,rank,t,note,t,s.id).run();
  return json({ok:true});
}

async function fetchText(url){
  try{
    const r=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (compatible; LAMOU-SubmissionVerifier/1.0)'},redirect:'follow'});
    if(!r.ok)return {ok:false,status:r.status,text:''};
    const text=(await r.text()).slice(0,2_500_000);
    return {ok:true,status:r.status,text};
  }catch(e){return {ok:false,status:0,text:'',error:String(e?.message||e)}}
}
function containsTrack(text,title,artist){
  const n=norm(text), t=norm(title), a=norm(artist||'LAMOU');
  if(!t)return false;
  return n.includes(t)&&(!a||n.includes(a));
}
async function verifyState(env,user,track,state){
  const p=PLATFORMS[state.platform_id]; if(!p)return state;
  let found=false, checked=[], errors=[];
  for(const url of p.checkUrls||[]){
    const r=await fetchText(url); checked.push({url,status:r.status,ok:r.ok});
    if(!r.ok){errors.push(`${url}:${r.status||'fetch'}`);continue}
    if(containsTrack(r.text,track.title,track.artist)){found=true;break}
  }
  const t=now(); let reg=state.registration_status, form=state.form_status, rank=state.ranking_status, result=state.result_status, note=state.note||'';
  if(found){
    reg='green'; form='green'; rank='green'; result='ranked'; note='Faixa encontrada na área pública da plataforma.';
  }else if(form==='blue'||form==='green'){
    if(rank!=='green')rank='blue';
    result='under_review'; note=p.reviewLabel||'Aguardando revisão/publicação.';
  }
  await env.DB.prepare(`UPDATE submission_states SET registration_status=?,form_status=?,ranking_status=?,result_status=?,note=?,evidence_json=?,last_checked_at=?,updated_at=? WHERE id=?`)
    .bind(reg,form,rank,result,note,JSON.stringify({publicFound:found,checked,errors}),t,t,state.id).run();
  return {...state,registration_status:reg,form_status:form,ranking_status:rank,result_status:result,note,last_checked_at:t};
}
async function verify(req,env,user){
  await ensureTables(env); await ensureKnownMigration(env,user); const x=await body(req); const trackId=safe(x.trackId,120);
  const tracks=trackId?[await env.DB.prepare('SELECT * FROM submission_tracks WHERE user_id=? AND id=? LIMIT 1').bind(user.id,trackId).first()].filter(Boolean):(await env.DB.prepare('SELECT * FROM submission_tracks WHERE user_id=?').bind(user.id).all()).results||[];
  const output=[];
  for(const tr of tracks){
    await ensureStatesForTrack(env,user.id,tr.id);
    const {results:states=[]}=await env.DB.prepare('SELECT * FROM submission_states WHERE user_id=? AND track_id=?').bind(user.id,tr.id).all();
    for(const s of states) output.push({trackId:tr.id,platformId:s.platform_id,state:await verifyState(env,user,tr,s)});
  }
  return json({ok:true,checked:output.length,results:output,checkedAt:now()});
}

export default {
  async fetch(req,env,ctx){
    const url=new URL(req.url), path=url.pathname;
    if(path.startsWith('/api/submissions/')){
      const user=await currentUser(req,env);
      if(!user)return json({error:'Não autenticado.'},401);
      if(path==='/api/submissions/dashboard'&&req.method==='GET')return listDashboard(env,user);
      if(path==='/api/submissions/tracks'&&req.method==='POST')return addTrack(req,env,user);
      if(path==='/api/submissions/opened'&&req.method==='POST')return markOpened(req,env,user);
      if(path==='/api/submissions/verify'&&req.method==='POST')return verify(req,env,user);
      if(path==='/api/submissions/platforms'&&req.method==='GET')return json({ok:true,platforms:Object.values(PLATFORMS)});
      return json({error:'Rota de submissão não encontrada.'},404);
    }
    return app.fetch(req,env,ctx);
  }
};
