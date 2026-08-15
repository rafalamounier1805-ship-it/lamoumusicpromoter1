(() => {
  'use strict';

  const STORE='lamou_v10_db';
  const PENDING='lamou_v11_pending_oauth';
  const NAMES={
    spotify:'Spotify',instagram:'Instagram',tiktok:'TikTok',youtube:'YouTube',
    facebook:'Facebook',threads:'Threads',amuse:'Amuse / distribuidora'
  };
  const SUPPORTED=new Set(['spotify']);

  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
  const write=data=>localStorage.setItem(STORE,JSON.stringify(data));
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const toast=message=>{
    const el=document.getElementById('toast');
    if(!el)return;
    el.textContent=message;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t=setTimeout(()=>el.classList.remove('show'),3200);
  };
  const modal=html=>{
    const root=document.getElementById('modalRoot');
    if(root)root.innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)Lamou.closeModal()"><section class="modal">${html}</section></div>`;
  };

  async function api(path,options={}){
    try{
      const response=await fetch(path,{
        credentials:'include',cache:'no-store',...options,
        headers:{'Content-Type':'application/json',...(options.headers||{})}
      });
      let data={};
      try{data=await response.json()}catch(_){}
      return {ok:response.ok,status:response.status,data};
    }catch(_){return {ok:false,status:0,data:{error:'Sem resposta do servidor.'}}}
  }

  function persistRemote(remote){
    const data=read();
    data.profile=data.profile||{};
    data.connections=data.connections||{};
    if(remote?.artist){
      data.profile.artistName=remote.artist.name||data.profile.artistName||'';
      data.profile.artistImage=remote.artist.image||data.profile.artistImage||'';
      data.profile.artistUrl=remote.artist.url||data.profile.artistUrl||'';
      data.profile.artistStats=remote.artist.stats||data.profile.artistStats||null;
    }
    if(remote?.connections)data.connections={...data.connections,...remote.connections};
    const user=remote?.user;
    if(user&&data.current&&data.accounts?.[data.current]){
      const account=data.accounts[data.current];
      account.backend=true;
      account.backendId=user.id||account.backendId||'';
      account.username=user.username||account.username||'';
      account.email=user.email||account.email||'';
      account.name=user.display_name||user.displayName||account.name||user.username||'LAMOU';
      data.profile.displayName=account.name;
      data.profile.email=account.email;
      if(account.workspace){
        account.workspace.profile={...(account.workspace.profile||{}),...data.profile};
        account.workspace.connections={...(account.workspace.connections||{}),...data.connections};
      }
    }
    write(data);
  }

  async function remoteProfile(){
    const result=await api('/api/profile/summary',{method:'GET',headers:{}});
    if(result.ok)persistRemote(result.data);
    return result;
  }

  function showUnifiedLogin(provider='spotify'){
    sessionStorage.setItem(PENDING,provider);
    document.getElementById('modalRoot').innerHTML='';
    document.getElementById('appShell')?.classList.add('hidden');
    document.getElementById('bottomNav')?.classList.add('hidden');
    document.getElementById('loginShell')?.classList.remove('hidden');
    window.Lamou?.auth?.('login');
    const data=read(),account=data.accounts?.[data.current]||{};
    const input=document.getElementById('loginUser');
    if(input&&!input.value)input.value=account.username||account.email||data.profile?.email||'';
    const sub=document.querySelector('#authView .auth-sub');
    if(sub)sub.textContent='Confirme o acesso do LAMOU uma única vez. Depois, esta mesma sessão será usada nas integrações.';
  }

  async function connect(provider='spotify'){
    provider=String(provider||'').toLowerCase();
    if(!SUPPORTED.has(provider)){
      toast(`${NAMES[provider]||provider}: a API oficial ainda não está configurada. O LAMOU não vai fingir conexão.`);
      return false;
    }
    const result=await api(`/api/oauth/${encodeURIComponent(provider)}/start`,{method:'GET',headers:{}});
    if(result.ok&&result.data?.url){
      location.href=result.data.url;
      return true;
    }
    if(result.status===401||result.status===403){
      showUnifiedLogin(provider);
      return false;
    }
    if(result.status===503){
      const diagnostic=await api('/api/oauth/diagnostic',{method:'GET',headers:{}});
      const d=diagnostic.data||{};
      modal(`<div class="modal-head"><div><div class="eyebrow">SPOTIFY</div><h2>Conexão indisponível</h2></div><button class="icon-button" onclick="Lamou.closeModal()">×</button></div>
        <div class="notice bad">${esc(result.data?.error||'A autorização não pôde iniciar.')}</div>
        <div class="test-list" style="margin-top:12px">
          <div class="test-item"><b>Spotify Client ID</b><span class="status ${d.spotify_client_id?'green':'red'}">${d.spotify_client_id?'OK':'Ausente'}</span></div>
          <div class="test-item"><b>Criptografia de tokens</b><span class="status ${d.token_encryption_key?'green':'red'}">${d.token_encryption_key?'OK':'Ausente'}</span></div>
          <div class="test-item"><b>Banco D1</b><span class="status ${d.db?'green':'red'}">${d.db?'OK':'Ausente'}</span></div>
        </div>`);
      return false;
    }
    toast(result.data?.error||`${NAMES[provider]}: não foi possível iniciar a conexão.`);
    return false;
  }

  async function sync(reload=false){
    const result=await remoteProfile();
    if(!result.ok)return result;
    if(reload)location.reload();
    else if(window.Lamou?.go)window.Lamou.go('home');
    return result;
  }

  if(window.Lamou){
    window.Lamou.connect=connect;
    window.Lamou.connectAll=()=>connect('spotify');
  }
  window.LamouIntegration={api,connect,remoteProfile,sync,supported:[...SUPPORTED]};

  const query=new URLSearchParams(location.search);
  if(query.get('oauth')==='spotify'){
    const status=query.get('status');
    const reason=query.get('reason')||'';
    history.replaceState({},document.title,location.pathname+location.hash);
    if(status==='success'||status==='connected'){
      remoteProfile().then(result=>{
        if(result.ok){
          toast('Spotify conectado com sucesso.');
          setTimeout(()=>location.reload(),350);
        }else toast('Spotify autorizou, mas o perfil não pôde ser atualizado.');
      });
    }else{
      toast(`Spotify não conectou${reason?': '+reason:'.'}`);
    }
  }else{
    remoteProfile().catch(()=>{});
  }
})();
