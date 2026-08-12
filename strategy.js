/* LAMOU Strategy Hub v4 — authorization-first, no CSV */
(() => {
  const PROFILE_KEY='lamou_artist_profile_v4';
  const TOKEN_KEY='lamou_spotify_pkce_v1';
  const CLIENT_KEY='lamou_spotify_client_id';
  const REMEMBER_KEY='lamou_access_remember';
  const TECH_KEY='lamou_tech_rank_v3';
  const profile=load(PROFILE_KEY,{spotifyUrl:'',amuseUrl:'',verifiedArtistId:'',spotify:{status:'disconnected',email:'',displayName:'',lastSync:'',catalog:null},amuse:{status:'unavailable'}});
  const tech=load(TECH_KEY,{style:'Livre',items:[]});
  let deferredInstallPrompt=null;

  function load(k,f){try{return JSON.parse(localStorage.getItem(k)||'')||f}catch(e){return f}}
  function saveProfile(){localStorage.setItem(PROFILE_KEY,JSON.stringify(profile))}
  function saveTech(){localStorage.setItem(TECH_KEY,JSON.stringify(tech))}
  function esc(s){return String(s??'').replace(/[&<>'\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','\"':'&quot;'}[c]))}
  function artistId(url){const m=String(url||'').match(/open\.spotify\.com\/artist\/([A-Za-z0-9]+)/);return m?.[1]||''}
  function fmtDate(x){if(!x)return'—';try{return new Date(x).toLocaleString('pt-BR')}catch(e){return x}}
  function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

  /* ---------- ACCESS ---------- */
  window.unlockApp=async function(){
    const input=document.getElementById('accessPassword'),error=document.getElementById('accessError');if(!input)return;
    const hh=await sha256Text(input.value);
    if(hh===ACCESS_HASH){sessionStorage.setItem('lamou_access','ok');if(document.getElementById('rememberAccess')?.checked)localStorage.setItem(REMEMBER_KEY,'ok');else localStorage.removeItem(REMEMBER_KEY);document.getElementById('accessGate')?.classList.add('hidden');if(error)error.textContent=''}
    else{if(error)error.textContent='Senha incorreta.';input.select()}
  };
  window.initAccess=function(){if(sessionStorage.getItem('lamou_access')==='ok'||localStorage.getItem(REMEMBER_KEY)==='ok')document.getElementById('accessGate')?.classList.add('hidden')};
  window.logoutLamou=function(){sessionStorage.removeItem('lamou_access');localStorage.removeItem(REMEMBER_KEY);location.reload()};

  /* ---------- PWA ---------- */
  window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstallPrompt=e;const b=document.getElementById('installAppBtn');if(b){b.disabled=false;b.textContent='📲 Instalar app'}});
  window.addEventListener('appinstalled',()=>{deferredInstallPrompt=null;const b=document.getElementById('installAppBtn');if(b)b.textContent='✓ App instalado'});
  window.installLamouApp=async function(){
    if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;return}
    showInstallGuide();
  };
  function registerPWA(){if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});}
  function showInstallGuide(){
    let m=document.getElementById('installGuide');if(!m){m=document.createElement('div');m.id='installGuide';m.className='install-guide';m.innerHTML=`<div class="install-sheet"><button class="install-x" onclick="document.getElementById('installGuide').classList.remove('on')">×</button><h3>📲 Colocar LAMOU na tela inicial</h3><p>No Android, abra esta página no <b>Chrome</b> e use:</p><div class="install-steps"><b>1.</b><span>Toque em ⋮ no canto superior direito.</span><b>2.</b><span>Escolha <b>Instalar app</b> ou <b>Adicionar à tela inicial</b>.</span><b>3.</b><span>Confirme <b>Instalar</b>.</span></div><p class="sub">Se a opção não aparecer, recarregue a página depois do novo deploy e tente novamente no Chrome.</p></div>`;document.body.appendChild(m)}m.classList.add('on')
  }

  /* ---------- SPOTIFY PKCE ---------- */
  function randomString(n=64){const a=new Uint8Array(n);crypto.getRandomValues(a);return Array.from(a,b=>(b%36).toString(36)).join('')}
  async function sha256Base64url(s){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));return btoa(String.fromCharCode(...new Uint8Array(d))).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}
  function token(){return load(TOKEN_KEY,null)}
  function saveToken(t){localStorage.setItem(TOKEN_KEY,JSON.stringify(t))}
  async function startSpotifyAuth(){
    const url=document.getElementById('artistSpotifyUrl')?.value.trim()||profile.spotifyUrl;const id=artistId(url);if(!id)return toast('Cole primeiro o link do perfil do artista no Spotify.');
    profile.spotifyUrl=url;saveProfile();
    let clientId=localStorage.getItem(CLIENT_KEY)||'';
    if(!clientId){document.getElementById('spotifyConfig')?.classList.add('on');document.getElementById('spotifyClientId')?.focus();return toast('Informe uma vez o Client ID do seu app Spotify para ativar a autorização.')}
    const verifier=randomString(72),challenge=await sha256Base64url(verifier),state=randomString(24),redirect=location.origin+location.pathname;
    sessionStorage.setItem('lamou_spotify_verifier',verifier);sessionStorage.setItem('lamou_spotify_state',state);sessionStorage.setItem('lamou_pending_artist',id);
    const q=new URLSearchParams({client_id:clientId,response_type:'code',redirect_uri:redirect,scope:'user-read-email user-read-private',code_challenge_method:'S256',code_challenge:challenge,state});
    location.href='https://accounts.spotify.com/authorize?'+q.toString();
  }
  async function handleSpotifyCallback(){
    const u=new URL(location.href),code=u.searchParams.get('code'),state=u.searchParams.get('state');if(!code)return;
    const expected=sessionStorage.getItem('lamou_spotify_state'),verifier=sessionStorage.getItem('lamou_spotify_verifier'),clientId=localStorage.getItem(CLIENT_KEY)||'';
    if(!state||state!==expected||!verifier||!clientId){toast('Não foi possível validar o retorno do Spotify.');return}
    try{
      const redirect=location.origin+location.pathname;
      const body=new URLSearchParams({grant_type:'authorization_code',code,redirect_uri:redirect,client_id:clientId,code_verifier:verifier});
      const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!r.ok)throw new Error('token');
      const t=await r.json();saveToken({...t,expiresAt:Date.now()+(t.expires_in||3600)*1000});
      const me=await spotifyFetch('/me');profile.spotify.status='authorized';profile.spotify.email=me.email||'';profile.spotify.displayName=me.display_name||'';
      const pending=sessionStorage.getItem('lamou_pending_artist')||artistId(profile.spotifyUrl);profile.verifiedArtistId=pending;saveProfile();
      history.replaceState({},'',location.pathname+location.hash);await syncSpotifyProfile(true);toast('Spotify autorizado e perfil sincronizado.');
    }catch(e){profile.spotify.status='error';saveProfile();renderConnectionStatus();toast('Falha na autorização do Spotify.')}
  }
  async function getAccessToken(){
    let t=token();if(!t)return'';if(Date.now()<(t.expiresAt||0)-60000)return t.access_token||'';
    if(!t.refresh_token)return'';const clientId=localStorage.getItem(CLIENT_KEY)||'';if(!clientId)return'';
    const body=new URLSearchParams({grant_type:'refresh_token',refresh_token:t.refresh_token,client_id:clientId});const r=await fetch('https://accounts.spotify.com/api/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});if(!r.ok)return'';
    const n=await r.json();t={...t,...n,refresh_token:n.refresh_token||t.refresh_token,expiresAt:Date.now()+(n.expires_in||3600)*1000};saveToken(t);return t.access_token||'';
  }
  async function spotifyFetch(path){const a=await getAccessToken();if(!a)throw new Error('auth');const r=await fetch('https://api.spotify.com/v1'+path,{headers:{Authorization:'Bearer '+a}});if(r.status===401)throw new Error('auth');if(!r.ok)throw new Error('spotify '+r.status);return r.json()}

  window.saveSpotifyClientId=function(){const v=document.getElementById('spotifyClientId')?.value.trim();if(!v)return toast('Informe o Client ID.');localStorage.setItem(CLIENT_KEY,v);document.getElementById('spotifyConfig')?.classList.remove('on');toast('Configuração salva. Agora toque em Autorizar Spotify.')};
  window.startSpotifyAuth=startSpotifyAuth;
  window.confirmArtistProfile=async function(){
    const id=artistId(document.getElementById('artistSpotifyUrl')?.value||'');if(!id)return toast('Link de artista inválido.');
    if(!token())return startSpotifyAuth();
    profile.verifiedArtistId=id;profile.spotifyUrl=document.getElementById('artistSpotifyUrl').value.trim();saveProfile();renderConnectionStatus();await syncSpotifyProfile(true);
  };
  window.artistLinkChanged=function(){
    const v=document.getElementById('artistSpotifyUrl')?.value.trim()||'';profile.spotifyUrl=v;const id=artistId(v);if(id!==profile.verifiedArtistId)profile.spotify.status=token()?'needs-confirmation':'disconnected';saveProfile();renderConnectionStatus();previewSpotifyArtist(v);
  };
  window.amuseLinkChanged=function(){profile.amuseUrl=document.getElementById('artistAmuseUrl')?.value.trim()||'';profile.amuse.status=profile.amuseUrl?'link-saved':'unavailable';saveProfile();renderConnectionStatus()};
  async function previewSpotifyArtist(url){if(!url)return;try{const r=await fetch('https://open.spotify.com/oembed?url='+encodeURIComponent(url));if(r.ok){const d=await r.json();const e=document.getElementById('artistPreview');if(e)e.innerHTML=`${d.thumbnail_url?`<img src="${esc(d.thumbnail_url)}" alt="">`:''}<div><b>${esc(d.title||'Perfil Spotify')}</b><small>Link reconhecido</small></div>`}}catch(e){}}
  window.syncSpotifyProfile=async function(manual=false){
    const id=artistId(profile.spotifyUrl);if(!id)return manual&&toast('Cole um perfil válido do Spotify.');if(profile.verifiedArtistId!==id)return manual&&toast('Confirme este perfil antes de sincronizar.');
    if(!token())return manual&&startSpotifyAuth();
    setSyncState('Sincronizando…','yellow');
    try{
      const artist=await spotifyFetch('/artists/'+id);let url='/artists/'+id+'/albums?limit=50',albums=[];
      for(let i=0;i<8&&url;i++){const p=url.startsWith('http')?url.replace('https://api.spotify.com/v1',''):url;const d=await spotifyFetch(p);albums.push(...(d.items||[]));url=d.next||'';await sleep(50)}
      const uniq=[...new Map(albums.map(a=>[a.id,a])).values()];
      const catalog={artist:{id,name:artist.name||'Artista',url:profile.spotifyUrl,images:artist.images||[],genres:artist.genres||[]},albums:uniq,albumsCount:uniq.filter(x=>x.album_type==='album').length,singlesCount:uniq.filter(x=>x.album_type==='single').length,compilationsCount:uniq.filter(x=>x.album_type==='compilation').length,totalTracks:uniq.reduce((s,x)=>s+(Number(x.total_tracks)||0),0),recent:[...uniq].sort((a,b)=>String(b.release_date||'').localeCompare(String(a.release_date||''))).slice(0,12)};
      profile.spotify.catalog=catalog;profile.spotify.status='verified';profile.spotify.lastSync=new Date().toISOString();saveProfile();renderConnectionStatus();renderCatalog();setSyncState('Sincronizado','green');
    }catch(e){profile.spotify.status=e.message==='auth'?'disconnected':'error';saveProfile();renderConnectionStatus();setSyncState('Não sincronizado','red');if(manual)toast('Não foi possível sincronizar. Confira a autorização do Spotify.')}
  };
  function setSyncState(text,color){const e=document.getElementById('spotifySyncState');if(e){e.className='status '+color;e.textContent=text}}

  /* ---------- UI ---------- */
  function injectRemember(){const card=document.querySelector('#accessGate .access-card');if(!card||document.getElementById('rememberAccess'))return;const btn=card.querySelector('.btn.p'),row=document.createElement('label');row.className='remember-access';row.innerHTML='<input id="rememberAccess" type="checkbox"> <span>Lembrar acesso neste aparelho</span>';btn.parentNode.insertBefore(row,btn)}
  function injectHeader(){const row=document.querySelector('.top .row');if(!row)return;if(!document.getElementById('installAppBtn')){const b=document.createElement('button');b.id='installAppBtn';b.innerHTML='📲 Instalar app';b.onclick=installLamouApp;row.prepend(b)}if(!document.getElementById('logoutBtn')){const b=document.createElement('button');b.id='logoutBtn';b.textContent='Sair';b.onclick=logoutLamou;row.appendChild(b)}}
  function injectHub(){
    const main=document.querySelector('main.grid');if(!main)return;document.getElementById('strategyHub')?.remove();const first=main.querySelector('.card');const hub=document.createElement('section');hub.id='strategyHub';hub.className='card strategy-hub';hub.innerHTML=`
      <div class="strategy-head"><div><small>ANTES DO ITEM 1</small><h2>Central estratégica do artista</h2><p class="sub">Seu perfil fica salvo neste aparelho. Quando o perfil do artista mudar, a conexão volta para vermelho até você confirmar novamente.</p></div><span class="status ai-rank">LAMOU Intelligence</span></div>
      <div class="strategy-buttons"><button class="strategy-btn" data-target="artistProfilePanel" onclick="toggleStrategyPanel('artistProfilePanel',this)">👤 <b>Perfil do artista</b><small>Link + autorização</small></button><button class="strategy-btn" data-target="promotePanel" onclick="toggleStrategyPanel('promotePanel',this)">🎯 <b>Qual música divulgar?</b><small>Catálogo + análise técnica</small></button><button class="strategy-btn" data-target="worldTopPanel" onclick="toggleStrategyPanel('worldTopPanel',this)">🏆 <b>Top 10 IA Mundial</b><small>Avaliação técnica</small></button></div>
      <div id="artistProfilePanel" class="strategy-panel"><div class="strategy-title"><h3>👤 Perfil do artista / compositor</h3><span id="spotifySyncState" class="status gray">Aguardando</span></div>
        <div class="connection-grid">
          <div class="connection-card"><div class="provider-line"><b>Spotify</b><span id="spotifyConnectionBadge" class="status red">Não autorizado</span></div><div id="artistPreview" class="artist-preview"></div><div class="field"><label>Perfil do artista</label><input id="artistSpotifyUrl" value="${esc(profile.spotifyUrl)}" placeholder="https://open.spotify.com/artist/..." oninput="artistLinkChanged()"></div><div id="spotifyIdentity" class="identity-line"></div><div class="row"><button class="btn p" onclick="startSpotifyAuth()">Autorizar Spotify</button><button id="confirmArtistBtn" class="btn" onclick="confirmArtistProfile()">Confirmar este perfil</button><button class="btn" onclick="syncSpotifyProfile(true)">↻ Sincronizar</button></div><div id="spotifyConfig" class="spotify-config"><div class="field"><label>Spotify Client ID — salvo apenas neste aparelho</label><input id="spotifyClientId" value="${esc(localStorage.getItem(CLIENT_KEY)||'')}" placeholder="Client ID do Spotify Developer"></div><button class="btn" onclick="saveSpotifyClientId()">Salvar configuração</button></div></div>
          <div class="connection-card"><div class="provider-line"><b>Amuse</b><span id="amuseConnectionBadge" class="status yellow">Integração oficial pendente</span></div><div class="field"><label>Link do perfil / projeto Amuse</label><input id="artistAmuseUrl" value="${esc(profile.amuseUrl)}" placeholder="Cole o link do seu projeto" oninput="amuseLinkChanged()"></div><p class="sub">O link fica salvo. O LAMOU só puxará dados privados quando houver uma integração oficial autorizada; não usamos scraping da sua conta.</p><div class="row"><button class="btn" onclick="if(artistAmuseUrl.value)window.open(artistAmuseUrl.value,'_blank','noopener')">Abrir Amuse</button></div></div>
        </div>
        <div id="artistCatalog" class="catalog-box"></div>
        <div class="notice"><b>Sem CSV.</b> O fluxo agora é por link + autorização. O Spotify Web API permite catálogo e metadados autorizados; números privados de streams do Spotify for Artists não são expostos pela Web API pública. O Amuse mostra streams no Insights, mas não há uma API OAuth pública documentada para puxarmos esses números automaticamente.</div>
      </div>
      <div id="promotePanel" class="strategy-panel"><div class="strategy-title"><h3>🎯 Qual música devo divulgar?</h3><span class="status green">Recomendação por dados disponíveis</span></div><div class="field"><label>Objetivo</label><select id="promotionGoal"><option value="new">Impulsionar lançamento recente</option><option value="catalog">Trabalhar catálogo</option><option value="ai">Competir em ranking de IA</option></select></div><div class="row" style="margin-top:12px"><button class="btn p" onclick="recommendPromotionV4()">✨ Analisar agora</button></div><div id="promotionAdvice" class="promotion-advice"><div class="notice">Autorize e sincronize o Spotify para começar.</div></div></div>
      <div id="worldTopPanel" class="strategy-panel"><div class="strategy-title"><div><h3>🏆 Top 10 IA Mundial — avaliação técnica</h3><p class="sub">Sem reviews, likes ou quantidade de votos na nota.</p></div><span class="status ai-rank">Audio intelligence</span></div><div class="two"><div class="field"><label>Estilo</label><select id="techStyle" onchange="rerankTech()"><option>Livre</option><option>Pop</option><option>Gospel</option><option>Funk BH</option><option>Pagode / Samba</option><option>Rock</option><option>Forró / Sertanejo</option><option>Eletrônica</option><option>Rap / Hip Hop</option><option>R&B / Soul</option><option>Latino</option></select></div><div class="field"><label>Áudios candidatos</label><input type="file" accept="audio/*" multiple onchange="analyseTechFiles(event)"></div></div><div class="technical-method"><b>Nota técnica</b><span>Produção/master</span><span>Som/textura</span><span>Estrutura</span><span>Hook</span><span>Dinâmica</span></div><div id="technicalRanking"><div class="notice">Envie os áudios que você quer comparar.</div></div></div>`;
    main.insertBefore(hub,first);renderConnectionStatus();renderCatalog();previewSpotifyArtist(profile.spotifyUrl);renderTech();
  }
  window.toggleStrategyPanel=function(id,btn){const p=document.getElementById(id);if(!p)return;const open=p.classList.contains('on');document.querySelectorAll('.strategy-panel').forEach(x=>x.classList.remove('on'));document.querySelectorAll('.strategy-btn').forEach(x=>x.classList.remove('on'));if(!open){p.classList.add('on');btn?.classList.add('on')}};
  function renderConnectionStatus(){
    const id=artistId(profile.spotifyUrl),same=id&&id===profile.verifiedArtistId,st=profile.spotify.status;let cls='red',txt='Não autorizado';if(st==='verified'&&same){cls='green';txt='✓ Verificado'}else if(token()&&same){cls='green';txt='✓ Conta autorizada'}else if(st==='needs-confirmation'||(token()&&id&&!same)){cls='red';txt='Perfil novo — confirmar'}else if(st==='authorized'){cls='yellow';txt='Autorizado — sincronizar'}
    const b=document.getElementById('spotifyConnectionBadge');if(b){b.className='status '+cls;b.textContent=txt}
    const ident=document.getElementById('spotifyIdentity');if(ident)ident.innerHTML=profile.spotify.email?`<span class="verify-dot green-dot"></span><b>${esc(profile.spotify.email)}</b><small> conta Spotify autorizada</small>`:'<span class="verify-dot red-dot"></span><span>Nenhum e-mail autorizado ainda</span>';
    const c=document.getElementById('confirmArtistBtn');if(c)c.style.display=(token()&&id&&!same)?'inline-flex':'none';
    const ab=document.getElementById('amuseConnectionBadge');if(ab){ab.className='status yellow';ab.textContent=profile.amuseUrl?'Link salvo • API pendente':'Integração oficial pendente'}
  }
  function renderCatalog(){const box=document.getElementById('artistCatalog');if(!box)return;const c=profile.spotify.catalog;if(!c){box.innerHTML='<div class="notice">Depois da autorização, o catálogo reconhecido aparece aqui automaticamente.</div>';return}box.innerHTML=`<div class="catalog-head">${c.artist.images?.[0]?.url?`<img src="${esc(c.artist.images[0].url)}" alt="">`:''}<div><h3>${esc(c.artist.name)}</h3><small>Última sincronização: ${fmtDate(profile.spotify.lastSync)}</small></div></div><div class="profile-stats"><div><b>${c.albumsCount}</b><small>Álbuns</small></div><div><b>${c.singlesCount}</b><small>Singles</small></div><div><b>${c.compilationsCount}</b><small>Compilações</small></div><div><b>${c.totalTracks}</b><small>Faixas no catálogo</small></div><div><b>—</b><small>Streams privados*</small></div></div><h3 style="margin-top:15px">Lançamentos recentes</h3><div class="release-list">${(c.recent||[]).map((r,i)=>`<div><b>${i+1}. ${esc(r.name)}</b><small>${esc(r.album_type||'release')} • ${esc(r.release_date||'')}</small></div>`).join('')}</div><div class="notice" style="margin-top:10px">*O Spotify Web API atual não fornece os streams privados do Spotify for Artists nem um ranking “mais ouvidas” por contagem de streams.</div>`}

  /* ---------- PROMOTION ---------- */
  window.recommendPromotionV4=function(){const c=profile.spotify.catalog,box=document.getElementById('promotionAdvice');if(!box)return;if(!c?.recent?.length){box.innerHTML='<div class="notice warn">Sincronize o perfil do Spotify primeiro.</div>';return}const goal=document.getElementById('promotionGoal')?.value||'new',list=[...c.recent];let picks=goal==='catalog'?[...list].reverse().slice(0,3):list.slice(0,3);box.innerHTML=`<div class="recommend-grid">${picks.map((r,i)=>`<div class="recommend-card"><b>${['🥇','🥈','🥉'][i]} ${esc(r.name)}</b><small>${goal==='new'?'Prioridade por recência do catálogo autorizado.':goal==='catalog'?'Opção para reativar catálogo menos recente.':'Candidata do catálogo; complete com análise técnica de áudio no Top 10 IA.'}</small><button class="btn" onclick="document.getElementById('spotify').value='${esc(r.external_urls?.spotify||'')}';if(document.getElementById('spotify').value)loadSpotify()">Usar na divulgação</button></div>`).join('')}</div><div class="notice">A recomendação não inventa streams. Quando uma fonte autorizada fornecer desempenho real, esse peso poderá entrar automaticamente.</div>`};

  /* ---------- TECH RANK ---------- */
  const weights={Livre:[.24,.20,.18,.22,.16],Pop:[.24,.19,.17,.25,.15],Gospel:[.23,.19,.24,.18,.16],'Funk BH':[.23,.24,.12,.25,.16],'Pagode / Samba':[.22,.22,.23,.17,.16],Rock:[.25,.22,.20,.17,.16],'Forró / Sertanejo':[.23,.21,.22,.18,.16],Eletrônica:[.27,.24,.12,.22,.15],'Rap / Hip Hop':[.23,.24,.16,.22,.15],'R&B / Soul':[.25,.23,.20,.17,.15],Latino:[.23,.22,.17,.23,.15]};
  async function analyseOne(file){const ac=new (window.AudioContext||window.webkitAudioContext)(),buf=await ac.decodeAudioData(await file.arrayBuffer()),d=buf.getChannelData(0),step=Math.max(256,Math.floor(buf.sampleRate*.12)),e=[];for(let i=0;i<d.length;i+=step){let ss=0,pk=0,n=0;for(let j=i;j<Math.min(i+step,d.length);j+=8){const v=Math.abs(d[j]);ss+=v*v;pk=Math.max(pk,v);n++}e.push({r:Math.sqrt(ss/Math.max(1,n)),p:pk})}await ac.close();const rms=e.map(x=>x.r),mx=Math.max(...rms,1e-6),norm=rms.map(x=>x/mx),mean=norm.reduce((a,b)=>a+b,0)/norm.length,variance=norm.reduce((s,x)=>s+(x-mean)**2,0)/norm.length,dyn=Math.sqrt(variance),crest=Math.min(2,(Math.max(...e.map(x=>x.p),.01)/(rms.reduce((a,b)=>a+b,0)/rms.length+.001)))/8);let jumps=0;for(let i=1;i<norm.length;i++)jumps+=Math.abs(norm[i]-norm[i-1]);jumps/=Math.max(1,norm.length-1);const prod=Math.max(0,100-Math.abs(.66-mean)*90-Math.abs(.28-crest)*45),sound=Math.max(0,100-Math.abs(.15-dyn)*170),structure=Math.min(100,52+jumps*150),hook=Math.min(100,48+Math.max(...norm)*32+jumps*95),dynamic=Math.min(100,42+dyn*240);return{name:file.name.replace(/\.[^.]+$/,''),metrics:[prod,sound,structure,hook,dynamic]}}
  window.analyseTechFiles=async function(e){const fs=[...(e.target.files||[])];if(!fs.length)return;const box=document.getElementById('technicalRanking');box.innerHTML='<div class="notice">Analisando áudio…</div>';for(const f of fs.slice(0,20)){try{const x=await analyseOne(f);tech.items.push(x)}catch(err){}}tech.items=[...new Map(tech.items.map(x=>[x.name,x])).values()];saveTech();rerankTech()};
  window.rerankTech=function(){tech.style=document.getElementById('techStyle')?.value||tech.style||'Livre';saveTech();renderTech()};
  function renderTech(){const box=document.getElementById('technicalRanking');if(!box)return;const w=weights[tech.style]||weights.Livre,arr=(tech.items||[]).map(x=>({...x,score:x.metrics.reduce((s,v,i)=>s+v*w[i],0)})).sort((a,b)=>b.score-a.score).slice(0,10);box.innerHTML=arr.length?`<div class="tech-table">${arr.map((x,i)=>`<div class="tech-row"><b>${i+1}</b><div><strong>${esc(x.name)}</strong><small>Produção ${x.metrics[0].toFixed(0)} • Som ${x.metrics[1].toFixed(0)} • Estrutura ${x.metrics[2].toFixed(0)} • Hook ${x.metrics[3].toFixed(0)} • Dinâmica ${x.metrics[4].toFixed(0)}</small></div><span>${x.score.toFixed(1)}</span></div>`).join('')}</div>`:'<div class="notice">Envie os áudios que você quer comparar.</div>'}

  /* ---------- CLEAN OLD CSV UI + LIGHT FINAL ---------- */
  function cleanupLegacy(){
    const a=document.getElementById('analytics');if(a){const sub=a.querySelector('.sub');if(sub)sub.textContent='Histórico, resultados de publicação e status das conexões autorizadas.';const two=a.querySelector('.two');if(two&&two.children[1])two.children[1].innerHTML='<h3>Conexões</h3><div id="analyticsConnections" class="notice" style="margin-top:8px">Spotify e Amuse aparecem na Central estratégica do artista. Sem importação CSV.</div>'}
    document.querySelectorAll('table tr').forEach(tr=>{if(tr.textContent.includes('Perfil por CSV'))tr.innerHTML='<td>Perfil por link + autorização</td><td><span class="status yellow">Spotify OAuth / Amuse quando disponível</span></td>'});
  }
  function injectStyles(){const st=document.createElement('style');st.textContent=`
    .remember-access{display:flex;gap:8px;align-items:center;color:#cfd3dc;font-size:.84rem;margin:2px 0 12px}.remember-access input{width:auto;margin:0}
    .strategy-hub{background:linear-gradient(145deg,#f8fbff,#eef6ff)!important;border-color:#cfe2f7!important}.strategy-head,.strategy-title,.provider-line{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.strategy-head small{font-weight:850;color:#4b66c7;letter-spacing:.1em}.strategy-buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.strategy-btn{border:1px solid #d9e1ef;background:#fff;border-radius:16px;padding:15px;text-align:left}.strategy-btn.on{border-color:#7d8af3;background:#f5f6ff}.strategy-btn b,.strategy-btn small{display:block}.strategy-btn small{color:#717887;margin-top:4px}.strategy-panel{display:none;margin-top:15px;border-top:1px solid #dce5f2;padding-top:16px}.strategy-panel.on{display:block}
    .connection-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.connection-card{background:#fff;border:1px solid #dce5f2;border-radius:16px;padding:15px}.identity-line{display:flex;gap:7px;align-items:center;margin:9px 0 12px;color:#58606e}.verify-dot{width:10px;height:10px;border-radius:50%;display:inline-block}.green-dot{background:#20a76b}.red-dot{background:#da5360}.artist-preview{display:flex;gap:10px;align-items:center;margin:10px 0}.artist-preview img{width:54px;height:54px;border-radius:12px;object-fit:cover}.artist-preview small{display:block;color:#777}.spotify-config{display:none;margin-top:12px;padding:12px;border-radius:13px;background:#fff8e9;border:1px solid #f0ddb0}.spotify-config.on{display:block}.catalog-box{margin-top:15px}.catalog-head{display:flex;gap:12px;align-items:center}.catalog-head img{width:72px;height:72px;border-radius:14px;object-fit:cover}.profile-stats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-top:12px}.profile-stats>div{background:#fff;border:1px solid #dce5f2;border-radius:14px;padding:12px}.profile-stats b{display:block;font-size:1.35rem}.profile-stats small{color:#777}.release-list{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:8px}.release-list>div{background:#fff;border:1px solid #e5e9f0;border-radius:12px;padding:10px}.release-list small{display:block;color:#777}.recommend-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:9px;margin:12px 0}.recommend-card{background:#fff;border:1px solid #e2e6ee;border-radius:14px;padding:12px}.recommend-card small{display:block;color:#6e7480;margin:6px 0 10px}.technical-method{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.technical-method>*{background:#fff;border:1px solid #e0e4ec;border-radius:999px;padding:7px 9px;font-size:.78rem}.tech-table{display:grid;gap:7px}.tech-row{display:grid;grid-template-columns:34px 1fr auto;gap:10px;align-items:center;background:#fff;border:1px solid #e2e6ed;border-radius:13px;padding:10px}.tech-row>span{font-size:1.15rem;font-weight:850}.tech-row small{display:block;color:#747a85}
    .finalize-card{background:linear-gradient(145deg,#f7fbff,#eef7ff)!important;color:#172033!important;border-color:#cfe3f3!important;box-shadow:0 10px 30px #2030400a!important}.finalize-card .sub{color:#687385!important}.finalize-card .final-check{background:#fff!important;color:#3f4959!important;border-color:#dbe5ee!important}.finalize-card .final-check.ok{background:#eaf8f0!important;color:#16734a!important}.finalize-card .final-stamp{background:#fff!important;color:#465166!important;border:1px solid #dbe5ee!important}.finalize-card .notice.warn{background:#fffaf0!important;color:#735c22!important}.finalize-card .btn.publish-final{box-shadow:none!important}
    .install-guide{display:none;position:fixed;inset:0;z-index:10000;background:#10152299;place-items:end center;padding:16px}.install-guide.on{display:grid}.install-sheet{width:min(520px,100%);background:#fff;border-radius:22px;padding:22px;position:relative}.install-x{position:absolute;right:12px;top:10px;border:0;background:#eef0f4;border-radius:50%;width:34px;height:34px;font-size:1.3rem}.install-steps{display:grid;grid-template-columns:28px 1fr;gap:9px;margin:14px 0}
    @media(max-width:800px){.strategy-buttons,.connection-grid,.recommend-grid,.profile-stats,.release-list{grid-template-columns:1fr}.strategy-head,.strategy-title{align-items:flex-start}.tech-row{grid-template-columns:28px 1fr auto}}
  `;document.head.appendChild(st)}

  async function boot(){injectStyles();injectRemember();injectHeader();registerPWA();injectHub();cleanupLegacy();await handleSpotifyCallback();renderConnectionStatus();renderCatalog();if(token()&&artistId(profile.spotifyUrl)&&profile.verifiedArtistId===artistId(profile.spotifyUrl))syncSpotifyProfile(false)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();