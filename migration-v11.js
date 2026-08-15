(() => {
  'use strict';

  const STORE='lamou_v10_db';
  const PENDING='lamou_v11_pending_oauth';
  const originalConnect=window.Lamou?.connect;

  const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
  const closeModal=()=>{const root=document.getElementById('modalRoot');if(root)root.innerHTML=''};

  async function hasBackendSession(){
    try{
      const r=await fetch('/api/profile/summary',{credentials:'include',cache:'no-store'});
      return r.ok;
    }catch(_){return false}
  }

  function showMainLogin(provider='spotify'){
    sessionStorage.setItem(PENDING,provider);
    closeModal();
    document.getElementById('appShell')?.classList.add('hidden');
    document.getElementById('bottomNav')?.classList.add('hidden');
    document.getElementById('loginShell')?.classList.remove('hidden');
    window.Lamou?.auth?.('login');

    const data=read();
    const account=data.accounts?.[data.current]||{};
    const identity=account.username||account.email||data.profile?.email||'';
    const input=document.getElementById('loginUser');
    if(input&&!input.value)input.value=identity;
    const sub=document.querySelector('#authView .auth-sub');
    if(sub)sub.textContent='Confirme seu acesso uma única vez para migrar a sessão antiga. Depois, as conexões usam o mesmo login do LAMOU.';
    const note=document.querySelector('#authView .auth-note');
    if(note)note.textContent='Seus dados atuais foram preservados. Após entrar, o LAMOU continua automaticamente a conexão que você estava fazendo.';
  }

  async function connect(provider='spotify'){
    if(typeof originalConnect!=='function')return;
    if(await hasBackendSession())return originalConnect(provider);
    showMainLogin(provider);
  }

  async function resumePending(){
    const provider=sessionStorage.getItem(PENDING);
    if(!provider||typeof originalConnect!=='function')return;
    if(!(await hasBackendSession()))return;
    sessionStorage.removeItem(PENDING);
    setTimeout(()=>originalConnect(provider),350);
  }

  if(window.Lamou){
    window.Lamou.connect=connect;
    const oldConnectAll=window.Lamou.connectAll;
    window.Lamou.connectAll=async()=>{
      if(await hasBackendSession())return typeof oldConnectAll==='function'?oldConnectAll():originalConnect?.('spotify');
      showMainLogin('spotify');
    };
  }

  resumePending().catch(()=>{});
})();
