(() => {
  'use strict';

  const STORE='lamou_v10_db';
  const REPAIR='lamou_v12_repair_done';
  const FINAL=new Set(['published','completed','concluded','sent']);

  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
  const write=data=>localStorage.setItem(STORE,JSON.stringify(data));
  const toast=message=>{
    const el=document.getElementById('toast');
    if(!el)return;
    el.textContent=message;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t=setTimeout(()=>el.classList.remove('show'),3200);
  };
  const esc=value=>String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));

  function repairStoredState(){
    const data=read();
    let changed=false;
    data.profile=data.profile||{};
    data.profile.socials=data.profile.socials||{};
    if(!data.profile.artistName){data.profile.artistName='LAMOU';changed=true}
    if(!data.profile.socials.tiktok){data.profile.socials.tiktok='@lamourafa';changed=true}

    const defaults={spotify:'red',instagram:'red',tiktok:'red',youtube:'red',facebook:'red',threads:'red',amuse:'yellow'};
    data.connections={...defaults,...(data.connections||{})};

    if(!Array.isArray(data.history)){data.history=[];changed=true}
    else{
      const filtered=data.history.filter(item=>FINAL.has(String(item?.status||'').toLowerCase()));
      if(filtered.length!==data.history.length){data.history=filtered;changed=true}
    }
    if(!Array.isArray(data.radar)){data.radar=[];changed=true}
    if(data.draft&&String(data.draft.creativePreview||'').startsWith('blob:')){
      data.draft.creativePreview='';
      data.draft.mediaNeedsReupload=true;
      changed=true;
    }
    if(changed)write(data);
    return changed;
  }

  const needsReload=repairStoredState();
  if(needsReload&&sessionStorage.getItem(REPAIR)!=='1'){
    sessionStorage.setItem(REPAIR,'1');
    location.reload();
    return;
  }
  sessionStorage.removeItem(REPAIR);

  function syncVisibleDraftFields(){
    try{window.dispatchEvent(new Event('beforeunload'))}catch(_){}
  }

  function validateNext(){
    const data=read(),d=data.draft;
    if(!d)return {ok:true};
    const step=Number(d.step||2);

    if(step===2){
      const typed=document.getElementById('songUrl')?.value.trim()||'';
      if(!d.url){
        return {ok:false,message:typed?'Toque em “Buscar” para validar e carregar essa música antes de continuar.':'Cole o link da música e toque em “Buscar”.'};
      }
    }
    if(step===3){
      const hasCreative=!!d.cover||!!d.creativePreview;
      if(d.mediaNeedsReupload&&!d.creativePreview)return {ok:false,message:'A mídia enviada anteriormente precisa ser selecionada novamente neste aparelho.'};
      if(!hasCreative&&['auto','spotify'].includes(d.creative))return {ok:false,message:'Não encontrei uma capa válida. Envie uma imagem ou vídeo para continuar.'};
      if(['image','video'].includes(d.creative)&&!d.creativePreview)return {ok:false,message:`Selecione ${d.creative==='image'?'uma imagem':'um vídeo'} antes de continuar.`};
    }
    if(step===4&&!d.hook)return {ok:false,message:'Escolha um dos hooks antes de continuar.'};
    if(d.mode==='quick'&&step===5&&!String(d.message||'').trim())return {ok:false,message:'Crie ou escreva a mensagem da divulgação antes de continuar.'};
    if(d.mode==='quick'&&step===6&&!(d.channels||[]).length)return {ok:false,message:'Selecione pelo menos um canal.'};
    if(d.mode==='campaign'&&step===5&&!d.strategy&&Array.isArray(d.strategies)&&d.strategies.length)return {ok:false,message:'Escolha uma das três estratégias.'};
    if(d.mode==='web'&&step===5&&!(d.webSelected||[]).length)return {ok:false,message:'Selecione pelo menos um destino Web.'};
    return {ok:true};
  }

  function installNavigationGuard(){
    if(!window.Lamou||window.Lamou.__v12NavigationGuard)return;
    window.Lamou.__v12NavigationGuard=true;
    const originalNext=window.Lamou.next;
    window.Lamou.next=function(step){
      syncVisibleDraftFields();
      const check=validateNext();
      if(!check.ok){toast(check.message);return}
      return originalNext(step);
    };

    const originalPublish=window.Lamou.publishCurrent;
    let publishing=false;
    window.Lamou.publishCurrent=async function(){
      if(publishing){toast('A publicação já está sendo processada.');return}
      syncVisibleDraftFields();
      const data=read(),d=data.draft;
      if(!d)return;
      if(d.mode==='quick'&&!(d.channels||[]).length){toast('Selecione pelo menos um canal antes de publicar.');return}
      if(d.mode==='campaign'&&!d.strategy){toast('Escolha uma estratégia antes de publicar.');return}
      if(d.mode==='web'&&!(d.webSelected||[]).length){toast('Selecione pelo menos um destino Web antes de enviar.');return}
      publishing=true;
      document.querySelectorAll('.publish-button').forEach(btn=>{btn.disabled=true;btn.dataset.oldText=btn.textContent;btn.textContent='Processando…'});
      try{return await originalPublish()}finally{
        publishing=false;
        document.querySelectorAll('.publish-button').forEach(btn=>{btn.disabled=false;btn.textContent=btn.dataset.oldText||'PUBLICAR E SALVAR'});
      }
    };
  }

  function hydrateVisibleControls(){
    const d=read().draft||{};
    const mood=document.getElementById('mood');
    if(mood&&d.mood&&[...mood.options].some(o=>o.value===d.mood))mood.value=d.mood;
    const production=document.getElementById('production');
    if(production&&d.production&&[...production.options].some(o=>o.value===d.production))production.value=d.production;
    const subgenre=document.getElementById('subgenre');
    if(subgenre&&d.subgenre&&[...subgenre.options].some(o=>o.value===d.subgenre))subgenre.value=d.subgenre;

    document.querySelectorAll('button').forEach(btn=>{
      if(btn.textContent.trim()==='Voltar ao hook →')btn.remove();
    });

    const note=document.querySelector('#authView .auth-note');
    if(note&&/PBKDF2 no modo local|backend Cloudflare|e-mail de verificação será ativado/i.test(note.textContent||'')){
      note.textContent='Seu acesso principal é validado pelo backend seguro do LAMOU. A mesma sessão é usada nas integrações; não existe segundo login.';
    }

    const modal=document.querySelector('#modalRoot .modal');
    if(modal&&/MEU LAMOU/i.test(modal.textContent||'')&&!modal.querySelector('[data-v12-switch-account]')){
      const row=modal.querySelector('.row');
      if(row){
        const button=document.createElement('button');
        button.className='ghost-button';
        button.dataset.v12SwitchAccount='1';
        button.textContent='Trocar conta';
        row.appendChild(button);
      }
    }
  }

  function installAccountGuard(){
    document.addEventListener('click',event=>{
      const action=event.target.closest('[data-action]')?.dataset.action;
      if(['users','create-user','edit-user','remove-user'].includes(action)){
        event.preventDefault();
        event.stopImmediatePropagation();
        document.getElementById('modalRoot').innerHTML='';
        setTimeout(()=>window.Lamou?.openUser?.(),0);
        return;
      }
      if(event.target.closest('[data-v12-switch-account]')){
        event.preventDefault();
        event.stopImmediatePropagation();
        if(confirm('Trocar de conta? Seus dados sincronizados serão preservados.'))window.Lamou?.logout?.();
      }
    },true);
  }

  async function fetchJson(path){
    try{
      const r=await fetch(path,{credentials:'include',cache:'no-store'});
      let data={};try{data=await r.json()}catch(_){}
      return {ok:r.ok,status:r.status,data};
    }catch(_){return {ok:false,status:0,data:{}}}
  }

  async function runDiagnostics(){
    const modalRoot=document.getElementById('modalRoot');
    if(!modalRoot)return;
    modalRoot.innerHTML=`<div class="modal-backdrop"><section class="modal"><div class="modal-head"><div><div class="eyebrow">DIAGNÓSTICO V12</div><h2>Verificando o LAMOU…</h2></div><button class="icon-button" onclick="Lamou.closeModal()">×</button></div><div id="v12Tests" class="test-list"></div></section></div>`;
    const out=document.getElementById('v12Tests');
    const add=(name,ok,detail='')=>{
      const el=document.createElement('div');el.className='test-item';
      el.innerHTML=`<b>${esc(name)}</b><span class="status ${ok?'green':'red'}">${ok?'OK':'Falhou'}</span><small>${esc(detail|| (ok?'Funcionando':'Precisa de correção/configuração'))}</small>`;
      out.appendChild(el);
    };

    const data=read();
    add('Interface',!!document.getElementById('appRoot'),'Tela principal carregada');
    add('Histórico sem rascunhos',(data.history||[]).every(x=>FINAL.has(String(x?.status||'').toLowerCase())),'Somente ações finalizadas');
    add('Mídia temporária não persistida',!String(data.draft?.creativePreview||'').startsWith('blob:'),'Sem blob inválido salvo');
    add('Service Worker','serviceWorker' in navigator,'PWA suportado pelo navegador');

    const version=await fetchJson('/api/version');
    add('Worker V12',version.ok&&String(version.data?.version||'').startsWith('12.'),version.ok?String(version.data?.version||'versão não informada'):`HTTP ${version.status||'sem resposta'}`);
    const health=await fetchJson('/api/health');
    add('Backend',health.ok,health.ok?'Worker respondendo':`HTTP ${health.status||'sem resposta'}`);
    add('D1',!!health.data?.db&&health.data?.db_ready!==false,health.data?.db?'Banco conectado':'Banco ausente');
    add('Workers AI',!!health.data?.ai,health.data?.ai?'Binding conectado':'Binding ausente');

    const profile=await fetchJson('/api/profile/summary');
    add('Sessão única',profile.ok,profile.ok?'Usuário reconhecido pelo backend':'Sessão do backend não ativa');
    const cloud=await fetchJson('/api/app-state');
    add('Sincronização D1',cloud.ok,cloud.ok?'Estado do usuário acessível':'Estado não acessível');
    const oauth=await fetchJson('/api/oauth/diagnostic');
    add('Spotify OAuth',!!oauth.data?.spotify_oauth,oauth.data?.spotify_oauth?'Client ID + criptografia prontos':'Configuração do Spotify incompleta');
  }

  function installDiagnostics(){
    if(window.Lamou)window.Lamou.runTests=runDiagnostics;
  }

  function wrapProfileSave(){
    if(!window.LamouV11||window.LamouV11.__v12Wrapped)return;
    window.LamouV11.__v12Wrapped=true;
    const original=window.LamouV11.saveProfile;
    if(typeof original==='function'){
      window.LamouV11.saveProfile=async function(){
        await original();
        setTimeout(()=>location.reload(),450);
      };
    }
  }

  installNavigationGuard();
  installAccountGuard();
  installDiagnostics();
  wrapProfileSave();
  hydrateVisibleControls();

  const observer=new MutationObserver(()=>{
    hydrateVisibleControls();
    installNavigationGuard();
    installDiagnostics();
    wrapProfileSave();
  });
  observer.observe(document.documentElement,{subtree:true,childList:true});
})();
