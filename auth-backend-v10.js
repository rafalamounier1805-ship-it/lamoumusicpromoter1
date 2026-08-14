(() => {
'use strict';

const STORE='lamou_v10_db';
const SESSION='lamou_v10_session';

function readStore(){try{return JSON.parse(localStorage.getItem(STORE)||'{}')}catch(_){return {}}}
function writeStore(s){localStorage.setItem(STORE,JSON.stringify(s))}
function authError(msg){const e=document.getElementById('authError');if(e)e.textContent=msg||''}
async function api(path,options={}){
  const r=await fetch(path,{credentials:'include',cache:'no-store',...options,headers:{'Content-Type':'application/json',...(options.headers||{})}});
  let x={};try{x=await r.json()}catch(_){}
  if(!r.ok)throw new Error(x.error||x.detail||`Erro ${r.status}`);
  return x;
}
function mirrorUser(user,remember){
  const s=readStore();s.accounts=s.accounts||{};s.profile=s.profile||{};
  const key=user.username||user.email;
  s.accounts[key]={...(s.accounts[key]||{}),name:user.displayName||user.username||'LAMOU',email:user.email||'',backend:true,createdAt:s.accounts[key]?.createdAt||new Date().toISOString()};
  s.current=key;
  s.profile.displayName=user.displayName||s.profile.displayName||user.username||'LAMOU';
  s.profile.email=user.email||s.profile.email||'';
  writeStore(s);
  sessionStorage.setItem(SESSION,key);
  if(remember)localStorage.setItem(SESSION,key);else localStorage.removeItem(SESSION);
}

async function login(){
  const identity=document.getElementById('loginUser')?.value.trim()||'';
  const password=document.getElementById('loginPass')?.value||'';
  const remember=!!document.getElementById('rememberDevice')?.checked;
  if(!identity||!password){authError('Informe usuário/e-mail e senha.');return}
  authError('Entrando…');
  try{
    const x=await api('/api/auth/login',{method:'POST',body:JSON.stringify({identity,password})});
    mirrorUser(x.user||{},remember);location.reload();
  }catch(err){authError(err.message||'Não foi possível entrar.')}
}

async function register(){
  const displayName=document.getElementById('regName')?.value.trim()||'';
  const email=document.getElementById('regEmail')?.value.trim().toLowerCase()||'';
  const username=document.getElementById('regUser')?.value.trim()||'';
  const password=document.getElementById('regPass')?.value||'';
  const p2=document.getElementById('regPass2')?.value||'';
  if(!displayName||!email||!username||password.length<8){authError('Preencha todos os campos e use senha com pelo menos 8 caracteres.');return}
  if(password!==p2){authError('As senhas não conferem.');return}
  authError('Criando acesso seguro…');
  try{
    const x=await api('/api/auth/register',{method:'POST',body:JSON.stringify({displayName,email,username,password})});
    mirrorUser(x.user||{displayName,email,username},true);location.reload();
  }catch(err){authError(err.message||'Não foi possível criar o acesso.')}
}

async function forgot(){
  const email=document.getElementById('forgotEmail')?.value.trim().toLowerCase()||'';
  if(!email){authError('Informe o e-mail.');return}
  authError('Solicitando recuperação…');
  try{
    const x=await api('/api/auth/forgot',{method:'POST',body:JSON.stringify({email})});
    authError(x.message||'Se o e-mail estiver cadastrado, a recuperação será enviada.');
  }catch(err){authError(err.message||'Não foi possível solicitar a recuperação.')}
}

async function logout(){
  try{await api('/api/auth/logout',{method:'POST',body:'{}'})}catch(_){}
  sessionStorage.removeItem(SESSION);localStorage.removeItem(SESSION);
  const s=readStore();s.current=null;writeStore(s);location.reload();
}

async function changePassword(){
  const currentPassword=document.getElementById('oldPass')?.value||'';
  const newPassword=document.getElementById('newPass')?.value||'';
  const n2=document.getElementById('newPass2')?.value||'';
  const msg=document.getElementById('passMsg');
  if(newPassword.length<8||newPassword!==n2){if(msg)msg.textContent='Nova senha inválida ou confirmação diferente.';return}
  if(msg)msg.textContent='Alterando…';
  try{
    await api('/api/auth/change-password',{method:'POST',body:JSON.stringify({currentPassword,newPassword})});
    if(msg)msg.textContent='Senha alterada com segurança no servidor.';
  }catch(err){if(msg)msg.textContent=err.message||'Não foi possível alterar a senha.'}
}

if(window.Lamou){
  window.Lamou.login=login;
  window.Lamou.register=register;
  window.Lamou.forgot=forgot;
  window.Lamou.logout=logout;
  window.Lamou.changePassword=changePassword;
}
})();