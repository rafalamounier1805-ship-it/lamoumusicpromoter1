(() => {
  'use strict';
  const STORE='lamou_v10_db';
  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};

  function currentIdentity(){
    const data=read(),account=data.accounts?.[data.current]||{};
    const email=account.email||data.profile?.email||'';
    const name=account.name||data.profile?.displayName||'LAMOU';
    const username=account.username||'';
    return {name,email,username};
  }

  function polish(){
    const card=document.querySelector('[data-action="users"]');
    if(card){
      const strong=card.querySelector('strong');
      const small=card.querySelector('small');
      if(strong)strong.textContent='Meu perfil';
      if(small)small.textContent='Dados, conta e conexões.';
    }

    const {name,email,username}=currentIdentity();
    const regName=document.getElementById('regName');
    const regEmail=document.getElementById('regEmail');
    const regUser=document.getElementById('regUser');
    if(regName&&!regName.value)regName.value=name;
    if(regEmail&&!regEmail.value)regEmail.value=email;
    if(regUser&&!regUser.value)regUser.value=username||String(email).split('@')[0]||'';

    const login=document.getElementById('loginUser');
    if(login&&!login.value)login.value=username||email;
  }

  polish();
  new MutationObserver(polish).observe(document.documentElement,{subtree:true,childList:true});

  if('serviceWorker' in navigator){
    navigator.serviceWorker.getRegistration().then(reg=>reg?.update()).catch(()=>{});
  }
})();
