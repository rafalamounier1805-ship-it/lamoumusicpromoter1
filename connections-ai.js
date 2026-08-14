/* LAMOU v7 — AI Copilot + Connected Accounts + OAuth orchestration */
(() => {
'use strict';
const SPOTIFY_CLIENT_ID='8a9c328f33b14bad9b48473d238925fc';
const SPOTIFY_TOKEN='lamou_spotify_pkce_v2';
const OAUTH_RETURN='/';
const providers=[
 {id:'spotify',name:'Spotify',icon:'🎵'},
 {id:'instagram',name:'Instagram',icon:'📸'},
 {id:'facebook',name:'Facebook',icon:'f'},
 {id:'tiktok',name:'TikTok',icon:'♪'},
 {id:'youtube',name:'YouTube',icon:'▶'},
 {id:'threads',name:'Threads',icon:'@'}
];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=m=>typeof window.toast==='function'?window.toast(m):alert(m);
function json(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(_){return f}}
function spotifyConnected(){const t=json(SPOTIFY_TOKEN,null);return !!(t?.access_token||t?.refresh_token)}
async function backendStatus(){try{const r=await fetch('/api/oauth/status',{cache:'no-store'});if(!r.ok)throw 0;return await r.json()}catch(_){return {}}}
async function spotifyPKCE(){
 const verifier=crypto.getRandomValues(new Uint8Array(64));
 const ver=Array.from(verifier,b=>(b%36).toString(36)).join('');
 const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(ver));
 const challenge=btoa(String.fromCharCode(...new Uint8Array(digest))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
 const state=Array.from(crypto.getRandomValues(new Uint8Array(24)),b=>(b%36).toString(36)).join('');
 sessionStorage.setItem('lamou_spotify_verifier',ver);sessionStorage.setItem('lamou_spotify_state',state);
 const input=document.getElementById('artistSpotifyUrl');
 const id=(input?.value||'').match(/open\.spotify\.com\/artist\/([A-Za-z0-9]+)/)?.[1]||'';
 if(id)sessionStorage.setItem('lamou_pending_artist',id);
 const redirect=location.origin+'/callback';
 const q=new URLSearchParams({client_id:SPOTIFY_CLIENT_ID,response_type:'code',redirect_uri:redirect,scope:'user-read-email user-read-private',code_challenge_method:'S256',code_challenge:challenge,state});
 location.href='https://accounts.spotify.com/authorize?'+q;
}
window.startSpotifyAuth=spotifyPKCE;
async function connect(id){
 if(id==='spotify')return spotifyPKCE();
 try{
  const r=await fetch(`/api/oauth/${encodeURIComponent(id)}/start?return=${encodeURIComponent(OAUTH_RETURN)}`,{cache:'no-store'});
  if(!r.ok)throw new Error('not-configured');
  const d=await r.json();if(d.url)location.href=d.url;else throw new Error('no-url');
 }catch(_){toast(`${providers.find(x=>x.id===id)?.name||id}: integração preparada, mas ainda falta configurar as credenciais no Cloudflare.`)}
}
async function disconnect(id){
 if(id==='spotify'){localStorage.removeItem(SPOTIFY_TOKEN);renderConnections();return}
 try{await fetch(`/api/oauth/${encodeURIComponent(id)}/disconnect`,{method:'POST'});}catch(_){}renderConnections();
}
function modal(){let m=document.getElementById('connectionsModal');if(m)return m;m=document.createElement('div');m.id='connectionsModal';m.className='lamou-connect-modal';m.innerHTML=`<div class="lamou-connect-sheet"><div class="lamou-connect-head"><div><h2>🔗 Contas conectadas</h2><p>Autorize uma vez. O LAMOU usa as conexões para publicar sem pedir sua senha das redes.</p></div><button id="connClose">×</button></div><div id="connectionsList"></div><div class="lamou-connect-foot">Tokens e segredos devem ficar no backend/Cloudflare. O navegador guarda apenas estado não sensível e, no Spotify PKCE, os tokens da sessão.</div></div>`;document.body.appendChild(m);m.querySelector('#connClose').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};return m}
async function renderConnections(){const m=modal(),list=m.querySelector('#connectionsList'),status=await backendStatus();list.innerHTML=providers.map(p=>{const on=p.id==='spotify'?spotifyConnected():!!status[p.id]?.connected;const who=status[p.id]?.name||status[p.id]?.handle||'';return `<div class="conn-row"><div class="conn-icon">${p.icon}</div><div class="conn-main"><b>${p.name}</b><small>${on?'Conectado'+(who?' • '+esc(who):''):'Não conectado'}</small></div><span class="conn-status ${on?'on':'off'}">${on?'✓ Conectado':'Desconectado'}</span><button class="btn ${on?'':'p'}" data-provider="${p.id}" data-action="${on?'disconnect':'connect'}">${on?'Desconectar':'Conectar'}</button></div>`}).join('');list.querySelectorAll('button[data-provider]').forEach(b=>b.onclick=()=>b.dataset.action==='connect'?connect(b.dataset.provider):disconnect(b.dataset.provider))}
async function openConnections(){modal().classList.add('on');await renderConnections()}
function injectConnectionButton(){
 const home=document.getElementById('lamouHomeV64');if(!home||document.getElementById('manageConnections'))return;
 const welcome=home.querySelector('.lamou-welcome>div');if(!welcome)return;const b=document.createElement('button');b.id='manageConnections';b.className='btn lamou-mini-connect';b.textContent='🔗 Gerenciar conexões';b.onclick=openConnections;welcome.appendChild(b);
}
function aiModal(){let m=document.getElementById('aiCopilotModal');if(m)return m;m=document.createElement('div');m.id='aiCopilotModal';m.className='lamou-connect-modal';m.innerHTML=`<div class="lamou-connect-sheet"><div class="lamou-connect-head"><div><h2>✨ LAMOU AI Copilot</h2><p>Transforma a música em plano de divulgação, copy e publicação por canal.</p></div><button id="aiClose">×</button></div><div class="two"><div class="field"><label>Objetivo</label><select id="aiGoal"><option>Ganhar alcance</option><option>Gerar streams</option><option>Conquistar saves</option><option>Entrar em rankings de IA</option><option>Apresentar a curadores</option></select></div><div class="field"><label>Mercado</label><select id="aiMarket"><option>Brasil</option><option>Global</option><option>Latino</option><option>EUA</option><option>Europa</option></select></div></div><div class="lamou-ai-actions"><button class="btn p" id="aiGenerate">✨ Criar estratégia</button></div><div id="aiOut" class="notice">A IA usa os dados da música atual e do perfil. Se Workers AI estiver online, usa o backend; se não, cai para uma estratégia local segura.</div></div>`;document.body.appendChild(m);m.querySelector('#aiClose').onclick=()=>m.classList.remove('on');m.onclick=e=>{if(e.target===m)m.classList.remove('on')};m.querySelector('#aiGenerate').onclick=runAI;return m}
async function runAI(){const out=document.getElementById('aiOut'),goal=document.getElementById('aiGoal').value,market=document.getElementById('aiMarket').value;const payload={title:window.S?.title||'',genre:document.getElementById('genre')?.value||'',subgenre:document.getElementById('subgenre')?.value||'',mood:document.getElementById('mood')?.value||'',production:document.getElementById('production')?.value||'',goal,market,hook:window.S?.hook||null};out.innerHTML='Pensando…';try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:'promotion_strategy',payload})});if(!r.ok)throw 0;const d=await r.json();out.innerHTML=`<b>Estratégia IA</b><br>${esc(d.text||d.result||JSON.stringify(d))}`;}catch(_){const title=payload.title||'esta música',g=payload.subgenre||payload.genre||'seu estilo';out.innerHTML=`<b>Plano local para ${esc(title)}</b><br>1. Priorizar o hook selecionado em Reels/TikTok/Shorts.<br>2. Adaptar a mensagem para ${esc(g)} e objetivo “${esc(goal)}”.<br>3. Trabalhar primeiro os canais conectados e depois curadores compatíveis.<br>4. Medir saves, cliques e respostas por campanha.<br><small>Workers AI ainda não respondeu; usei o motor local.</small>`}}
function openAI(){aiModal().classList.add('on')}
function injectAIButton(){const row=document.querySelector('.top .row');if(!row||document.getElementById('lamouAIButton'))return;const b=document.createElement('button');b.id='lamouAIButton';b.textContent='✨ IA';b.onclick=openAI;const test=[...row.children].find(x=>/Teste/.test(x.textContent));test?row.insertBefore(b,test):row.appendChild(b)}
async function publishSelected(){
 if(!window.S?.url)return toast('Carregue uma música primeiro.');
 const selected=window.S?.quick||[];if(!selected.length)return toast('Selecione ao menos uma rede.');
 const status=await backendStatus();const map={Instagram:'instagram',Facebook:'facebook',TikTok:'tiktok','YouTube Shorts':'youtube',Threads:'threads'};const ready=selected.filter(x=>status[map[x]]?.connected);const missing=selected.filter(x=>!status[map[x]]?.connected);
 if(missing.length){toast('Conecte antes: '+missing.join(', '));openConnections();return}
 const text=typeof window.makeCopy==='function'?window.makeCopy():'';
 try{const r=await fetch('/api/publish',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({platforms:ready.map(x=>map[x]),title:window.S.title,url:window.S.url,text,creative:{mode:window.S.creativeMode,format:window.S.creativeFormat},hook:window.S.hook})});if(!r.ok)throw 0;toast('Publicação enviada às redes conectadas.');if(typeof window.log==='function')window.log('Publicação direta',ready.join(', '));}catch(_){toast('Backend de publicação ainda não está ativo no Cloudflare.')}
}
function upgradeQuickPanel(){const p=document.getElementById('quickPanel');if(!p||document.getElementById('directPublishBtn'))return;const row=p.querySelector('.row');if(!row)return;const ai=document.createElement('button');ai.className='btn';ai.textContent='✨ Preparar com IA';ai.onclick=openAI;const pub=document.createElement('button');pub.id='directPublishBtn';pub.className='btn p';pub.textContent='🚀 Publicar nas conectadas';pub.onclick=publishSelected;row.append(ai,pub)}
function styles(){if(document.getElementById('connAIStyles'))return;const s=document.createElement('style');s.id='connAIStyles';s.textContent=`.lamou-mini-connect{margin-top:12px}.lamou-connect-modal{position:fixed;inset:0;z-index:26000;background:#0b1020aa;display:none;place-items:center;padding:16px;backdrop-filter:blur(5px)}.lamou-connect-modal.on{display:grid}.lamou-connect-sheet{width:min(760px,100%);max-height:90vh;overflow:auto;background:white;border-radius:22px;padding:20px;box-shadow:0 30px 90px #0006}.lamou-connect-head{display:flex;justify-content:space-between;gap:12px;border-bottom:1px solid #e5e7ee;padding-bottom:12px}.lamou-connect-head h2{margin:0}.lamou-connect-head p{margin:4px 0 0;color:#697080}.lamou-connect-head>button{border:0;border-radius:50%;width:38px;height:38px;font-size:22px}.conn-row{display:grid;grid-template-columns:42px 1fr auto auto;gap:10px;align-items:center;padding:12px 0;border-bottom:1px solid #eceef3}.conn-icon{width:38px;height:38px;border-radius:12px;background:#f3f4fb;display:grid;place-items:center;font-weight:900}.conn-main small{display:block;color:#687080}.conn-status{font-size:.78rem;font-weight:800}.conn-status.on{color:#167049}.conn-status.off{color:#888}.lamou-connect-foot{margin-top:14px;padding:12px;border-radius:12px;background:#f7f8fb;color:#687080;font-size:.8rem}.lamou-ai-actions{margin:12px 0}@media(max-width:650px){.conn-row{grid-template-columns:38px 1fr auto}.conn-status{display:none}.conn-row button{grid-column:2/-1}}`;document.head.appendChild(s)}
window.addEventListener('load',()=>setTimeout(()=>{styles();injectConnectionButton();injectAIButton();upgradeQuickPanel()},650));
})();