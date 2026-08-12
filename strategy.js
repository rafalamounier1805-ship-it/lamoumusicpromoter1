/* LAMOU Strategic Hub + PWA */
(() => {
  const PROFILE_KEY = 'lamou_artist_profile_v3';
  const TECH_KEY = 'lamou_tech_rank_v2';
  const REMEMBER_KEY = 'lamou_access_remember';
  const GLOBAL_REFERENCE = [
    ['Let Me Be','The Second Voice'],
    ['RUBBERZ','Fenix Flexin'],
    ['GG EZ','M.Sasuke'],
    ["DON'T PLAY WITH ME",'Thompsxn Therapy'],
    ['You Problem','Dust & Harmony'],
    ['I Speak Blessings','Delana Hope'],
    ['Another Day Old','Eddie Dalton'],
    ['Girl, I Am Anointed','Nyqki Nicole'],
    ['Love Notes','Olivia B Moore'],
    ['Let Go, Let God','Xania Monet']
  ];

  let deferredInstallPrompt = null;
  let profileState = loadJSON(PROFILE_KEY, {artistName:'LAMOU', spotifyUrl:'', amuseUrl:'', datasets:{spotify:null, amuse:null}});
  let techState = loadJSON(TECH_KEY, {style:'Livre', items:[]});

  function loadJSON(k, fallback){ try{return JSON.parse(localStorage.getItem(k)||'')||fallback}catch(e){return fallback} }
  function saveProfile(){ localStorage.setItem(PROFILE_KEY, JSON.stringify(profileState)); }
  function saveTech(){ localStorage.setItem(TECH_KEY, JSON.stringify(techState)); }
  function esc(s){return String(s??'').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
  function norm(s){return String(s??'').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'')}
  function clamp(x,a=0,b=100){return Math.max(a,Math.min(b,x))}
  function num(v){const n=Number(String(v??'').replace(/\./g,'').replace(',','.').replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:0}
  function fmtN(n){return Math.round(n||0).toLocaleString('pt-BR')}

  window.unlockApp = async function(){
    const input=document.getElementById('accessPassword');
    const error=document.getElementById('accessError');
    if(!input)return;
    const hh=await sha256Text(input.value);
    if(hh===ACCESS_HASH){
      sessionStorage.setItem('lamou_access','ok');
      if(document.getElementById('rememberAccess')?.checked)localStorage.setItem(REMEMBER_KEY,'ok');
      else localStorage.removeItem(REMEMBER_KEY);
      document.getElementById('accessGate')?.classList.add('hidden');
      if(error)error.textContent='';
    } else {
      if(error)error.textContent='Senha incorreta.';
      input.select();
    }
  };
  window.initAccess = function(){
    if(sessionStorage.getItem('lamou_access')==='ok'||localStorage.getItem(REMEMBER_KEY)==='ok')document.getElementById('accessGate')?.classList.add('hidden');
  };
  window.logoutLamou = function(){
    sessionStorage.removeItem('lamou_access'); localStorage.removeItem(REMEMBER_KEY); location.reload();
  };

  window.addEventListener('beforeinstallprompt', e=>{
    e.preventDefault(); deferredInstallPrompt=e;
    const b=document.getElementById('installAppBtn'); if(b){b.style.display='inline-flex';b.disabled=false;}
  });
  window.addEventListener('appinstalled', ()=>{deferredInstallPrompt=null;const b=document.getElementById('installAppBtn');if(b)b.textContent='✓ App instalado';});

  window.installLamouApp = async function(){
    if(deferredInstallPrompt){deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;return}
    if(window.toast)toast('No Android/Chrome: menu ⋮ → Adicionar à tela inicial / Instalar app.');
  };

  function injectRemember(){
    const card=document.querySelector('#accessGate .access-card'); if(!card||document.getElementById('rememberAccess'))return;
    const btn=card.querySelector('.btn.p');
    const row=document.createElement('label'); row.className='remember-access';
    row.innerHTML='<input id="rememberAccess" type="checkbox"> <span>Lembrar acesso neste aparelho</span>';
    btn.parentNode.insertBefore(row,btn);
  }

  function injectHeaderButtons(){
    const row=document.querySelector('.top .row'); if(!row)return;
    if(!document.getElementById('installAppBtn')){
      const b=document.createElement('button'); b.id='installAppBtn'; b.innerHTML='📲 Instalar app'; b.onclick=installLamouApp; row.prepend(b);
    }
    if(!document.getElementById('logoutBtn')){
      const b=document.createElement('button'); b.id='logoutBtn'; b.textContent='Sair'; b.onclick=logoutLamou; row.appendChild(b);
    }
  }

  function injectStrategyHub(){
    const main=document.querySelector('main.grid'); if(!main||document.getElementById('strategyHub'))return;
    const first=main.querySelector('.card');
    const hub=document.createElement('section');hub.id='strategyHub';hub.className='card strategy-hub';
    hub.innerHTML=`
      <div class="strategy-head"><div><small>ANTES DO ITEM 1</small><h2>Central estratégica do artista</h2><p class="sub">Abra somente o módulo que quiser usar.</p></div><span class="status ai-rank">LAMOU Intelligence</span></div>
      <div class="strategy-buttons">
        <button class="strategy-btn" data-target="artistProfilePanel" onclick="toggleStrategyPanel('artistProfilePanel',this)">👤 <b>Perfil do artista</b><small>Spotify + Amuse + catálogo</small></button>
        <button class="strategy-btn" data-target="promotePanel" onclick="toggleStrategyPanel('promotePanel',this)">🎯 <b>Qual música divulgar?</b><small>Recomendação baseada nos seus dados</small></button>
        <button class="strategy-btn" data-target="worldTopPanel" onclick="toggleStrategyPanel('worldTopPanel',this)">🏆 <b>Top 10 IA Mundial</b><small>Ranking técnico, não por reviews</small></button>
      </div>
      <div id="artistProfilePanel" class="strategy-panel">
        <div class="strategy-title"><h3>👤 Perfil do artista / compositor</h3><span class="status green">Dados do seu catálogo</span></div>
        <div class="two">
          <div class="field"><label>Nome artístico</label><input id="artistNameInput" value="${esc(profileState.artistName||'LAMOU')}" oninput="saveArtistIdentity()"></div>
          <div class="field"><label>Spotify — perfil do artista</label><input id="artistSpotifyUrl" value="${esc(profileState.spotifyUrl||'')}" placeholder="https://open.spotify.com/artist/..." oninput="saveArtistIdentity()"></div>
          <div class="field"><label>Amuse — referência/perfil</label><input id="artistAmuseUrl" value="${esc(profileState.amuseUrl||'')}" placeholder="Cole o link ou identificação" oninput="saveArtistIdentity()"></div>
          <div class="field"><label>Fonte para ranking das faixas</label><select id="profileRankSource" onchange="renderArtistProfile()"><option value="best">Melhor dado disponível</option><option value="spotify">Spotify for Artists</option><option value="amuse">Amuse</option></select></div>
        </div>
        <div class="profile-imports">
          <label class="upload-box"><b>Spotify for Artists CSV</b><small>Streams, ouvintes, saves, faixas e álbuns.</small><input type="file" accept=".csv,text/csv" onchange="importArtistCSV(event,'spotify')"></label>
          <label class="upload-box"><b>Amuse CSV</b><small>Relatório do distribuidor / catálogo.</small><input type="file" accept=".csv,text/csv" onchange="importArtistCSV(event,'amuse')"></label>
        </div>
        <div id="artistProfileStats" class="profile-stats"></div>
        <div id="artistTopTracks"></div>
        <div class="notice">Os números privados de streams não são obtidos do Spotify/Amuse sem autorização da conta. Aqui o app consolida os CSVs que você exportar; depois podemos ligar OAuth/API onde a plataforma permitir.</div>
      </div>

      <div id="promotePanel" class="strategy-panel">
        <div class="strategy-title"><h3>🎯 Qual música devo divulgar agora?</h3><span class="status green">Recomendação local</span></div>
        <div class="two">
          <div class="field"><label>Objetivo</label><select id="promotionGoal"><option value="reach">Ganhar alcance</option><option value="saves">Aumentar saves</option><option value="release">Empurrar lançamento recente</option><option value="revive">Reviver música do catálogo</option><option value="ai">Competir em ranking de IA</option></select></div>
          <div class="field"><label>Fonte principal</label><select id="promotionSource"><option value="best">Melhor dado disponível</option><option value="spotify">Spotify</option><option value="amuse">Amuse</option></select></div>
        </div>
        <div class="row" style="margin-top:12px"><button class="btn p" onclick="recommendPromotion()">✨ Analisar meu catálogo</button></div>
        <div id="promotionAdvice" class="promotion-advice"><div class="notice">Importe seus dados no Perfil do artista para receber uma recomendação.</div></div>
      </div>

      <div id="worldTopPanel" class="strategy-panel">
        <div class="strategy-title"><div><h3>🏆 Top 10 IA Mundial — avaliação técnica</h3><p class="sub">A posição de charts, quantidade de reviews, likes ou popularidade NÃO entra na nota técnica.</p></div><span class="status ai-rank">Audio intelligence</span></div>
        <div class="two">
          <div class="field"><label>Estilo da música</label><select id="techStyle" onchange="reRankTechnical()"><option>Livre</option><option>Pop</option><option>Gospel</option><option>Funk BH</option><option>Pagode / Samba</option><option>Rock</option><option>Forró / Sertanejo</option><option>Eletrônica</option><option>Rap / Hip Hop</option><option>R&B / Soul</option><option>Latino</option></select></div>
          <div class="field"><label>Áudios candidatos</label><input id="techFiles" type="file" accept="audio/*" multiple onchange="analyseTechnicalCandidates(event)"></div>
        </div>
        <div class="technical-method"><b>Nota técnica LAMOU</b><span>Produção / master</span><span>Som / textura</span><span>Estrutura / composição (proxy)</span><span>Hook</span><span>Dinâmica</span></div>
        <div id="technicalRanking"><div class="notice">Envie músicas candidatas. O navegador analisa o áudio e monta o Top 10 técnico conforme o estilo escolhido.</div></div>
        <details class="global-reference"><summary>🌍 Referências globais atuais para descobrir candidatas</summary><p>Lista de referência do chart global de IA verificado em 11/08/2026. <b>A posição abaixo não é usada na nota técnica do LAMOU.</b></p><div class="reference-grid">${GLOBAL_REFERENCE.map(([t,a])=>`<div><b>${esc(t)}</b><small>${esc(a)}</small></div>`).join('')}</div></details>
        <div class="notice warn">“Mundial” significa uma base internacional de candidatas. Para uma classificação técnica séria, o áudio precisa estar disponível para análise. O app não finge analisar faixas só pela posição em outro ranking.</div>
      </div>`;
    main.insertBefore(hub,first);
    renderArtistProfile(); renderTechnicalRanking();
  }

  window.toggleStrategyPanel=function(id,btn){
    const p=document.getElementById(id); if(!p)return;
    const was=p.classList.contains('on');
    document.querySelectorAll('.strategy-panel').forEach(x=>x.classList.remove('on'));
    document.querySelectorAll('.strategy-btn').forEach(x=>x.classList.remove('on'));
    if(!was){p.classList.add('on');btn?.classList.add('on');setTimeout(()=>p.scrollIntoView({behavior:'smooth',block:'nearest'}),80)}
  };

  window.saveArtistIdentity=function(){
    profileState.artistName=document.getElementById('artistNameInput')?.value||'LAMOU';
    profileState.spotifyUrl=document.getElementById('artistSpotifyUrl')?.value||'';
    profileState.amuseUrl=document.getElementById('artistAmuseUrl')?.value||'';
    saveProfile();
  };

  function parseCSV(text){
    const rows=[]; let row=[],cell='',q=false;
    for(let i=0;i<text.length;i++){
      const c=text[i],n=text[i+1];
      if(c==='"'){ if(q&&n==='"'){cell+='"';i++}else q=!q; }
      else if((c===','||c===';'||c==='\t')&&!q){row.push(cell);cell='';}
      else if((c==='\n'||c==='\r')&&!q){ if(c==='\r'&&n==='\n')i++; row.push(cell);cell=''; if(row.some(x=>String(x).trim()))rows.push(row); row=[]; }
      else cell+=c;
    }
    if(cell||row.length){row.push(cell);if(row.some(x=>String(x).trim()))rows.push(row)}
    if(rows.length<2)return {headers:[],rows:[]};
    const first=text.split(/\r?\n/)[0]||'';
    const del=[',',';','\t'].sort((a,b)=>(first.split(b).length-first.split(a).length))[0];
    const simple=[];
    const lines=text.split(/\r?\n/).filter(Boolean);
    function splitLine(line){let out=[],v='',qq=false;for(let i=0;i<line.length;i++){let c=line[i];if(c==='"'){if(qq&&line[i+1]==='"'){v+='"';i++}else qq=!qq}else if(c===del&&!qq){out.push(v);v=''}else v+=c}out.push(v);return out}
    const headers=splitLine(lines[0]).map(x=>x.trim());
    for(let i=1;i<lines.length;i++){const vals=splitLine(lines[i]);const o={};headers.forEach((h,j)=>o[h]=vals[j]??'');simple.push(o)}
    return {headers,rows:simple};
  }

  function findHeader(headers, words){return headers.find(h=>words.some(w=>norm(h).includes(w)))||''}
  function parseDataset(text,source){
    const {headers,rows}=parseCSV(text);
    const h={
      track:findHeader(headers,['track','song','faixa','musica','title','titulo']),
      album:findHeader(headers,['album','release','lancamento']),
      streams:findHeader(headers,['stream','reproduc','plays']),
      listeners:findHeader(headers,['listener','ouvin']),
      saves:findHeader(headers,['save','salv']),
      date:findHeader(headers,['release date','data de lancamento','date','data']),
      artist:findHeader(headers,['artist','artista'])
    };
    const tracks=rows.map((r,i)=>({
      title:(h.track&&r[h.track])||`Faixa ${i+1}`,
      album:(h.album&&r[h.album])||'',
      streams:num(h.streams&&r[h.streams]), listeners:num(h.listeners&&r[h.listeners]), saves:num(h.saves&&r[h.saves]),
      date:(h.date&&r[h.date])||'', artist:(h.artist&&r[h.artist])||'', source
    })).filter(x=>x.title);
    return {source,headers,h,tracks,importedAt:new Date().toISOString()};
  }

  window.importArtistCSV=function(e,source){
    const file=e.target.files?.[0];if(!file)return;
    const r=new FileReader();r.onload=()=>{
      try{profileState.datasets[source]=parseDataset(String(r.result||''),source);saveProfile();renderArtistProfile();if(window.log)log('Perfil importado',`${source}: ${file.name}`);toast(`${source==='spotify'?'Spotify':'Amuse'} importado.`)}catch(err){toast('Não consegui interpretar este CSV.')}
    };r.readAsText(file);
  };

  function mergedTracks(source='best'){
    const sp=profileState.datasets?.spotify?.tracks||[], am=profileState.datasets?.amuse?.tracks||[];
    const map=new Map();
    function add(x,s){const k=norm(x.title);if(!k)return;let z=map.get(k)||{title:x.title,album:x.album,date:x.date,spotify:null,amuse:null};z[s]=x;if(!z.album&&x.album)z.album=x.album;if(!z.date&&x.date)z.date=x.date;map.set(k,z)}
    sp.forEach(x=>add(x,'spotify'));am.forEach(x=>add(x,'amuse'));
    return [...map.values()].map(z=>{
      let d=source==='spotify'?z.spotify:source==='amuse'?z.amuse:(z.spotify&&z.amuse?(z.spotify.streams>=z.amuse.streams?z.spotify:z.amuse):(z.spotify||z.amuse));
      return {...z,metric:d||{streams:0,listeners:0,saves:0},streams:d?.streams||0,listeners:d?.listeners||0,saves:d?.saves||0};
    });
  }

  window.renderArtistProfile=function(){
    const stats=document.getElementById('artistProfileStats'),top=document.getElementById('artistTopTracks');if(!stats||!top)return;
    const source=document.getElementById('profileRankSource')?.value||'best';
    const tracks=mergedTracks(source),albums=new Set(tracks.map(x=>x.album).filter(Boolean));
    const sp=profileState.datasets?.spotify?.tracks||[],am=profileState.datasets?.amuse?.tracks||[];
    const sum=(arr,k)=>arr.reduce((s,x)=>s+(x[k]||0),0);
    stats.innerHTML=`<div><b>${albums.size}</b><small>Álbuns / releases</small></div><div><b>${tracks.length}</b><small>Músicas</small></div><div><b>${fmtN(sum(sp,'streams'))}</b><small>Streams Spotify</small></div><div><b>${fmtN(sum(am,'streams'))}</b><small>Streams Amuse</small></div><div><b>${fmtN(sum(sp,'listeners'))}</b><small>Ouvintes Spotify</small></div><div><b>${fmtN(sum(sp,'saves'))}</b><small>Saves Spotify</small></div>`;
    const ranked=[...tracks].sort((a,b)=>b.streams-a.streams).slice(0,10);
    top.innerHTML=ranked.length?`<h3 style="margin:16px 0 7px">Mais ouvidas dos seus trabalhos</h3><table><tr><th>#</th><th>Faixa</th><th>Álbum</th><th>Streams</th><th>Ouvintes</th><th>Saves</th></tr>${ranked.map((x,i)=>`<tr><td>${i+1}</td><td><b>${esc(x.title)}</b></td><td>${esc(x.album||'—')}</td><td>${fmtN(x.streams)}</td><td>${fmtN(x.listeners)}</td><td>${fmtN(x.saves)}</td></tr>`).join('')}</table>`:'<div class="notice" style="margin-top:12px">Importe Spotify for Artists e/ou Amuse para montar seu perfil quantitativo.</div>';
  };

  function normalizeField(arr,k){const max=Math.max(...arr.map(x=>x[k]||0),1);return x=>(x[k]||0)/max}
  function parseDateScore(v){if(!v)return 0;const d=new Date(v);if(!Number.isFinite(d.getTime()))return 0;const days=(Date.now()-d.getTime())/86400000;return clamp(1-days/365,0,1)}
  window.recommendPromotion=function(){
    const out=document.getElementById('promotionAdvice');if(!out)return;
    const source=document.getElementById('promotionSource')?.value||'best',goal=document.getElementById('promotionGoal')?.value||'reach',arr=mergedTracks(source);
    if(!arr.length){out.innerHTML='<div class="notice warn">Primeiro importe Spotify for Artists ou Amuse em “Perfil do artista”.</div>';return}
    const ns=normalizeField(arr,'streams'),nl=normalizeField(arr,'listeners'),nv=normalizeField(arr,'saves');
    arr.forEach(x=>{
      const tech=technicalScoreForTitle(x.title)/100, recent=parseDateScore(x.date);
      if(goal==='reach')x.promo=.55*ns(x)+.25*nl(x)+.20*nv(x);
      else if(goal==='saves')x.promo=.48*nv(x)+.30*ns(x)+.15*nl(x)+.07*tech;
      else if(goal==='release')x.promo=.55*recent+.25*ns(x)+.12*nv(x)+.08*tech;
      else if(goal==='revive')x.promo=.45*(1-ns(x))+.25*nv(x)+.30*tech;
      else x.promo=.70*tech+.15*nv(x)+.15*nl(x);
    });
    arr.sort((a,b)=>b.promo-a.promo);const top=arr.slice(0,3);
    out.innerHTML=`<div class="recommend-hero"><small>MINHA ESCOLHA Nº 1</small><b>${esc(top[0].title)}</b><span>Índice de divulgação: ${Math.round(top[0].promo*100)}/100</span></div><div class="recommend-list">${top.map((x,i)=>`<div><b>${i+1}. ${esc(x.title)}</b><small>${goalReason(goal,x,technicalScoreForTitle(x.title))}</small></div>`).join('')}</div><div class="notice">A recomendação usa somente os dados importados e, quando houver, a análise técnica feita no próprio app. Ela não confunde clique de campanha com stream individual.</div>`;
  };
  function goalReason(g,x,tech){
    if(g==='reach')return `${fmtN(x.streams)} streams • ${fmtN(x.listeners)} ouvintes • boa base para ampliar alcance.`;
    if(g==='saves')return `${fmtN(x.saves)} saves • prioridade para conversão e recorrência.`;
    if(g==='release')return `peso maior para recência + desempenho atual.`;
    if(g==='revive')return `oportunidade de reativação do catálogo${tech?` • nota técnica ${tech}/100`:''}.`;
    return tech?`nota técnica ${tech}/100 • adequada para campanha orientada a rankings de IA.`:'faça a análise técnica do áudio para aumentar a precisão.';
  }

  const WEIGHTS={
    'Livre':{production:.24,sound:.20,structure:.20,hook:.20,dynamics:.16},
    'Pop':{production:.25,sound:.20,structure:.15,hook:.25,dynamics:.15},
    'Gospel':{production:.20,sound:.20,structure:.25,hook:.12,dynamics:.23},
    'Funk BH':{production:.24,sound:.22,structure:.10,hook:.30,dynamics:.14},
    'Pagode / Samba':{production:.20,sound:.23,structure:.22,hook:.15,dynamics:.20},
    'Rock':{production:.22,sound:.23,structure:.20,hook:.15,dynamics:.20},
    'Forró / Sertanejo':{production:.22,sound:.22,structure:.20,hook:.20,dynamics:.16},
    'Eletrônica':{production:.28,sound:.24,structure:.14,hook:.22,dynamics:.12},
    'Rap / Hip Hop':{production:.26,sound:.23,structure:.12,hook:.25,dynamics:.14},
    'R&B / Soul':{production:.23,sound:.24,structure:.20,hook:.15,dynamics:.18},
    'Latino':{production:.23,sound:.21,structure:.16,hook:.25,dynamics:.15}
  };

  async function audioFeatures(file){
    const ac=new (window.AudioContext||window.webkitAudioContext)();
    const buf=await ac.decodeAudioData(await file.arrayBuffer());const d=buf.getChannelData(0),sr=buf.sampleRate;
    let sum=0,peak=0,clip=0,z=0,n=0;
    const stride=Math.max(1,Math.floor(d.length/250000));
    for(let i=stride;i<d.length;i+=stride){const v=d[i],p=d[i-stride];sum+=v*v;peak=Math.max(peak,Math.abs(v));if(Math.abs(v)>.985)clip++;if((v>=0)!==(p>=0))z++;n++}
    const rms=Math.sqrt(sum/Math.max(1,n)),zcr=z/Math.max(1,n),clipRatio=clip/Math.max(1,n),crest=peak/Math.max(.0001,rms);
    const frame=Math.max(1,Math.floor(sr*.5)),en=[];
    for(let i=0;i<d.length;i+=frame){let s=0,c=0;for(let j=i;j<Math.min(i+frame,d.length);j+=16){s+=d[j]*d[j];c++}en.push(Math.sqrt(s/Math.max(1,c)))}
    const mean=en.reduce((a,b)=>a+b,0)/Math.max(1,en.length),sd=Math.sqrt(en.reduce((a,b)=>a+(b-mean)**2,0)/Math.max(1,en.length)),dyn=sd/Math.max(.0001,mean);
    const dif=en.slice(1).map((x,i)=>Math.abs(x-en[i])),change=(dif.reduce((a,b)=>a+b,0)/Math.max(1,dif.length))/Math.max(.0001,mean);
    let hook=0;for(let i=2;i<en.length-8;i++){const seg=en.slice(i,i+8),m=seg.reduce((a,b)=>a+b,0)/seg.length,p=Math.max(...seg),rise=Math.max(0,seg[1]-en[i-2]);hook=Math.max(hook,(m/Math.max(.0001,mean))*.45+(p/Math.max(.0001,mean))*.25+(rise/Math.max(.0001,mean))*.30)}
    await ac.close();return {duration:buf.duration,rms,peak,clipRatio,crest,zcr,dyn,change,hook};
  }
  function componentScores(f){
    const production=clamp(100-(f.clipRatio*18000)-Math.abs(f.crest-3.8)*6);
    const sound=clamp(62+Math.min(28,f.zcr*1900)-Math.abs(f.zcr-.08)*85);
    const dynamics=clamp(52+Math.min(38,f.dyn*65)-Math.max(0,f.dyn-.9)*25);
    const structure=clamp(48+Math.min(42,f.change*70));
    const hook=clamp(45+Math.min(50,f.hook*12));
    return {production,sound,structure,hook,dynamics};
  }
  function overallFor(item,style){const w=WEIGHTS[style]||WEIGHTS.Livre,s=item.scores;return Math.round(Object.keys(w).reduce((a,k)=>a+(s[k]||0)*w[k],0))}

  window.analyseTechnicalCandidates=async function(e){
    const files=[...(e.target.files||[])];if(!files.length)return;
    const box=document.getElementById('technicalRanking');box.innerHTML='<div class="notice">Analisando '+files.length+' arquivo(s)…</div>';
    for(const file of files){
      try{const f=await audioFeatures(file),scores=componentScores(f),baseName=file.name.replace(/\.[^.]+$/,'');const existing=techState.items.find(x=>norm(x.name)===norm(baseName));const item={name:baseName,fileName:file.name,features:f,scores,updatedAt:new Date().toISOString()};if(existing)Object.assign(existing,item);else techState.items.push(item)}catch(err){console.warn('Falha ao analisar',file.name,err)}
    }
    saveTech();renderTechnicalRanking();if(window.log)log('Ranking técnico IA',`${files.length} áudio(s) analisado(s)`);toast('Análise técnica concluída.');
  };
  window.reRankTechnical=function(){techState.style=document.getElementById('techStyle')?.value||'Livre';saveTech();renderTechnicalRanking()};
  function technicalScoreForTitle(title){const item=techState.items.find(x=>norm(x.name)===norm(title)||norm(x.name).includes(norm(title))||norm(title).includes(norm(x.name)));return item?overallFor(item,techState.style||'Livre'):0}
  window.renderTechnicalRanking=function(){
    const box=document.getElementById('technicalRanking');if(!box)return;const style=document.getElementById('techStyle')?.value||techState.style||'Livre';techState.style=style;
    const arr=[...techState.items].map(x=>({...x,overall:overallFor(x,style)})).sort((a,b)=>b.overall-a.overall).slice(0,10);
    box.innerHTML=arr.length?`<table class="tech-table"><tr><th>#</th><th>Música</th><th>Nota</th><th>Produção</th><th>Som</th><th>Estrutura</th><th>Hook</th><th>Dinâmica</th></tr>${arr.map((x,i)=>`<tr><td>${i+1}</td><td><b>${esc(x.name)}</b><small>${techComment(x)}</small></td><td><strong>${x.overall}</strong></td><td>${Math.round(x.scores.production)}</td><td>${Math.round(x.scores.sound)}</td><td>${Math.round(x.scores.structure)}</td><td>${Math.round(x.scores.hook)}</td><td>${Math.round(x.scores.dynamics)}</td></tr>`).join('')}</table>`:'<div class="notice">Envie músicas candidatas para gerar o Top 10 técnico.</div>';
  };
  function techComment(x){const s=x.scores,parts=Object.entries(s).sort((a,b)=>b[1]-a[1]);return `<br><small>ponto forte: ${labelScore(parts[0][0])} • atenção: ${labelScore(parts.at(-1)[0])}</small>`}
  function labelScore(k){return({production:'produção/master',sound:'som/textura',structure:'estrutura/composição',hook:'hook',dynamics:'dinâmica'})[k]||k}

  function injectPWA(){
    if(!document.querySelector('link[rel="manifest"]')){const l=document.createElement('link');l.rel='manifest';l.href='manifest.webmanifest';document.head.appendChild(l)}
    if(!document.querySelector('link[rel="icon"]')){const l=document.createElement('link');l.rel='icon';l.href='icon-192.svg';l.type='image/svg+xml';document.head.appendChild(l)}
    if('serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
  }

  function injectStyles(){
    if(document.getElementById('strategyStyles'))return;const s=document.createElement('style');s.id='strategyStyles';s.textContent=`
      .remember-access{display:flex;gap:9px;align-items:center;color:#d7dbe6;font-size:.86rem;margin:2px 0 12px}.remember-access input{width:auto;margin:0}
      .strategy-hub{background:linear-gradient(145deg,#eef5ff,#f7f2ff)!important;border-color:#cdd8f5!important;box-shadow:0 16px 42px #263d7a10!important}.strategy-head,.strategy-title{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;flex-wrap:wrap}.strategy-head>div>small{font-weight:850;letter-spacing:.12em;color:#5c5ff2}.strategy-buttons{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.strategy-btn{border:1px solid #d9deed;background:#fff;border-radius:16px;padding:15px;text-align:left;cursor:pointer}.strategy-btn.on{border-color:#7477f5;background:#f5f4ff;box-shadow:0 0 0 3px #6568ee14}.strategy-btn b,.strategy-btn small{display:block}.strategy-btn b{margin:6px 0 3px}.strategy-btn small{color:#6f7480}.strategy-panel{display:none;margin-top:14px;padding:16px;border:1px solid #dce1ef;border-radius:18px;background:#ffffffcf}.strategy-panel.on{display:block}.profile-imports{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:12px 0}.upload-box{display:flex;flex-direction:column;gap:5px;border:1px dashed #bdc7dc;background:#fbfcff;border-radius:14px;padding:13px}.upload-box small{color:#6f7480}.profile-stats{display:grid;grid-template-columns:repeat(6,1fr);gap:8px;margin:12px 0}.profile-stats>div{background:#fff;border:1px solid #e2e6ef;border-radius:13px;padding:12px}.profile-stats b{display:block;font-size:1.35rem}.profile-stats small{color:#747985}.promotion-advice{margin-top:12px}.recommend-hero{padding:18px;border-radius:16px;background:linear-gradient(135deg,#171922,#313651);color:#fff}.recommend-hero small,.recommend-hero b,.recommend-hero span{display:block}.recommend-hero b{font-size:1.5rem;margin:4px 0}.recommend-list{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin:9px 0}.recommend-list>div{border:1px solid #e3e6ee;border-radius:13px;padding:12px;background:#fff}.recommend-list small{display:block;color:#6f7480;margin-top:4px}.technical-method{display:flex;gap:7px;flex-wrap:wrap;margin:12px 0}.technical-method>*{border:1px solid #dedff2;border-radius:999px;padding:7px 10px;background:#f8f7ff;font-size:.78rem}.tech-table td strong{font-size:1.15rem;color:#4e50d6}.tech-table td small{display:block;color:#6f7480}.global-reference{margin-top:12px;border:1px solid #e2e4ec;border-radius:14px;padding:12px;background:#fff}.global-reference summary{cursor:pointer;font-weight:800}.reference-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px;margin-top:9px}.reference-grid>div{border:1px solid #ebedf2;border-radius:11px;padding:9px}.reference-grid small{display:block;color:#6f7480}
      @media(max-width:900px){.strategy-buttons,.profile-stats{grid-template-columns:repeat(2,1fr)}.recommend-list{grid-template-columns:1fr}.tech-table{display:block;overflow-x:auto;white-space:nowrap}}
      @media(max-width:600px){.strategy-buttons,.profile-imports,.profile-stats,.reference-grid{grid-template-columns:1fr}.strategy-panel{padding:12px}}
    `;document.head.appendChild(s)
  }

  injectPWA();
  document.addEventListener('DOMContentLoaded',()=>{injectStyles();injectRemember();injectHeaderButtons();injectStrategyHub();});
})();
