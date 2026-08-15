(() => {
'use strict';

const VERSION='14.0.0';
const STORE='lamou_v10_db';
const POLICY={
  sun7:{name:'Sun7 Label',auto:true,source:'https://www.sun7label.com/contato'},
  progressive:{name:'Progressive Generation',auto:true,source:'https://progressivegeneration.com.br/label/demo/',requiresSoundCloud:true},
  paulinas:{name:'Paulinas-COMEP',auto:true,source:'https://universo.paulinas.com.br/conteudo/envie-seu-projeto-paulinas-comep/61'},
  boxradio:{name:'Box Radio',auto:false,source:'https://boxradio.net/pt/submitmusic',reason:'Exige confirmação de apoio antes do envio.'},
  yourjazz:{name:'Your Jazz Radio',auto:false,source:'https://yourjazzradio.com/submit-music/',reason:'Artista independente deve usar o formulário oficial.'},
  belem:{name:'Gravadora Belém',auto:false,source:'https://gravadorabelem.com.br/',reason:'O site usa um fluxo próprio em “Envie sua música”.'},
  dailyplaylists:{name:'DailyPlaylists',auto:false,source:'https://dailyplaylists.com/pt/',reason:'O e-mail público é de suporte; a música é submetida pela plataforma.'}
};
let legacyMarkSent=null;
let configCache=null;
let sending=false;

const read=()=>{try{return JSON.parse(localStorage.getItem(STORE)||'{}')||{}}catch(_){return {}}};
const write=d=>localStorage.setItem(STORE,JSON.stringify(d));
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const toast=m=>{const e=document.getElementById('toast');if(!e)return;e.textContent=m;e.classList.add('show');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('show'),4200)};
const modal=h=>{const root=document.getElementById('modalRoot');if(root)root.innerHTML=`<div class="modal-backdrop" onclick="if(event.target===this)LamouEmail.close()"><section class="modal">${h}</section></div>`};
function close(){const root=document.getElementById('modalRoot');if(root)root.innerHTML=''}
async function api(path,options={}){
  try{
    const r=await fetch(path,{credentials:'include',cache:'no-store',...options,headers:{...(options.body?{'content-type':'application/json'}:{}),...(options.headers||{})}});
    let data={};try{data=await r.json()}catch(_){}
    return {ok:r.ok,status:r.status,data};
  }catch(_){return {ok:false,status:0,data:{error:'Sem resposta do servidor.'}}}
}
async function ensureSynced(){
  if(window.LamouRuntime?.persistState)await window.LamouRuntime.persistState().catch(()=>{});
}
function findHistory(hid){return (read().history||[]).find(x=>String(x.id)===String(hid))||null}
function updateLocalDelivery(hid,cid,result){
  const state=read(),h=(state.history||[]).find(x=>String(x.id)===String(hid));if(!h)return;
  h.submitted=Array.isArray(h.submitted)?h.submitted:[];
  let item=h.submitted.find(x=>x.channelId===cid);
  if(!item){item={channelId:cid,date:new Date().toISOString()};h.submitted.push(item)}
  item.emailStatus=result.deliveryStatus||result.status||'accepted';
  item.providerId=result.providerId||item.providerId||'';
  item.recipient=result.recipient||item.recipient||'';
  item.emailCheckedAt=new Date().toISOString();
  h.status='sent';write(state);
}
async function emailConfig(force=false){
  if(configCache&&!force)return configCache;
  const r=await api('/api/outreach/email/config');
  configCache=r.ok?r.data:null;return configCache;
}
function showConfigProblem(cfg,serverMessage=''){
  modal(`<div class="modal-head"><div><div class="eyebrow">E-MAIL REAL · v${VERSION}</div><h2>Envio ainda não ativado no Worker</h2></div><button class="icon-button" onclick="LamouEmail.close()">×</button></div>
  <div class="notice warn"><b>${esc(serverMessage||'Falta configurar o provedor de e-mail.')}</b><br><span class="mini">Chave Resend: ${cfg?.apiKeyConfigured?'OK':'ausente'} · Remetente verificado: ${cfg?.fromConfigured?'OK':'ausente'}</span></div>
  <p class="sub" style="margin-top:12px">O LAMOU não vai marcar nada como enviado enquanto o provedor não aceitar a mensagem.</p>`);
}
function materialPrompt(hid,cid){
  const p=POLICY[cid],h=findHistory(hid);if(!p||!h)return;
  modal(`<div class="modal-head"><div><div class="eyebrow">${esc(p.name)}</div><h2>Link exigido pelo canal</h2></div><button class="icon-button" onclick="LamouEmail.close()">×</button></div>
  <p class="sub">A Progressive Generation exige link privado do SoundCloud com download habilitado. O Spotify sozinho não atende à regra oficial.</p>
  <div class="field"><label>Link privado do SoundCloud</label><input id="emailMaterialUrl" type="url" placeholder="https://soundcloud.com/..."></div>
  <div class="row"><button class="primary-button" onclick="LamouEmail.send('${esc(hid)}','${esc(cid)}',document.getElementById('emailMaterialUrl').value)">Enviar de verdade</button><a class="ghost-button" href="${esc(p.source)}" target="_blank" rel="noopener">Ver regra oficial</a></div>`)
}
async function send(hid,cid,materialUrl=''){
  const p=POLICY[cid];if(!p)return toast('Canal não reconhecido pela base verificada.');
  if(!p.auto){window.open(p.source,'_blank','noopener');return toast(p.reason||'Este canal usa submissão manual oficial.');}
  if(p.requiresSoundCloud&&!/^https:\/\/(?:www\.)?soundcloud\.com\//i.test(String(materialUrl||''))){materialPrompt(hid,cid);return;}
  if(sending)return toast('Já existe um envio em andamento.');
  sending=true;
  try{
    await ensureSynced();
    const cfg=await emailConfig(true);
    if(!cfg?.configured){showConfigProblem(cfg);return;}
    toast(`Enviando para ${p.name}…`);
    const r=await api('/api/outreach/email/send',{method:'POST',body:JSON.stringify({historyId:hid,channelId:cid,materialUrl:materialUrl||undefined})});
    if(!r.ok){
      if(r.status===503)showConfigProblem(cfg,r.data?.error);else if(r.data?.source){modal(`<div class="modal-head"><h2>Envio bloqueado corretamente</h2><button class="icon-button" onclick="LamouEmail.close()">×</button></div><div class="notice warn"><b>${esc(r.data.error||'Este envio não pode ser automatizado.')}</b></div><a class="primary-button" href="${esc(r.data.source)}" target="_blank" rel="noopener" style="display:inline-block;margin-top:12px">Abrir regra oficial</a>`)}else toast(r.data?.error||'Falha no envio.');
      return;
    }
    updateLocalDelivery(hid,cid,r.data);
    await ensureSynced();
    window.Lamou?.viewHistory?.(hid);
    toast(r.data?.duplicate?`Já havia envio registrado para ${p.name}.`:`✓ ${p.name}: aceito pelo provedor de e-mail.`);
    setTimeout(()=>refreshStatuses(hid),1200);
  }finally{sending=false}
}
async function batch(hid){
  if(sending)return toast('Já existe um envio em andamento.');
  const h=findHistory(hid);if(!h)return toast('Histórico não encontrado.');
  const eligible=(h.channels||[]).filter(cid=>POLICY[cid]?.auto&&!POLICY[cid]?.requiresSoundCloud);
  if(!eligible.length)return toast('Nenhum e-mail deste material pode ser enviado automaticamente sem requisito adicional.');
  sending=true;
  try{
    await ensureSynced();
    const cfg=await emailConfig(true);if(!cfg?.configured){showConfigProblem(cfg);return;}
    toast(`Enviando ${eligible.length} e-mail(s) verificado(s)…`);
    const r=await api('/api/outreach/email/send-batch',{method:'POST',body:JSON.stringify({historyId:hid,channelIds:eligible})});
    if(!r.ok)return toast(r.data?.error||'Falha no envio em lote.');
    for(const item of r.data?.results||[])if(item.ok)updateLocalDelivery(hid,item.channelId,item);
    await ensureSynced();window.Lamou?.viewHistory?.(hid);
    toast(`Envio real: ${r.data?.sent||0} aceito(s), ${r.data?.failed||0} falha(s).`);
    setTimeout(()=>refreshStatuses(hid),1500);
  }finally{sending=false}
}
async function refreshStatuses(hid){
  const h=findHistory(hid);if(!h)return;
  const entries=(h.submitted||[]).filter(x=>x.providerId);
  for(const e of entries){
    const r=await api('/api/outreach/email/status?providerId='+encodeURIComponent(e.providerId));
    if(r.ok)updateLocalDelivery(hid,e.channelId,{providerId:e.providerId,recipient:e.recipient,deliveryStatus:r.data.status});
  }
  await ensureSynced();decorate();
}
function statusLabel(s){return ({accepted:'Aceito pelo provedor',sent:'Enviado',delivered:'Entregue',opened:'Aberto',clicked:'Clicado',delivery_delayed:'Atrasado',failed:'Falhou',bounced:'Bounce',complained:'Spam'})[s]||s||''}
function parseIds(button){
  const raw=button.getAttribute('onclick')||'';
  const m=raw.match(/markSent\(['"]([^'"]+)['"],['"]([^'"]+)['"]\)/);return m?{hid:m[1],cid:m[2]}:null;
}
function decorate(){
  document.querySelectorAll('.outreach-row').forEach(row=>{
    const button=[...row.querySelectorAll('button')].find(b=>(b.getAttribute('onclick')||'').includes('markSent(')||b.dataset.lamouEmailCid);
    if(!button)return;
    let ids=button.dataset.lamouEmailCid?{hid:button.dataset.lamouEmailHid,cid:button.dataset.lamouEmailCid}:parseIds(button);if(!ids)return;
    const {hid,cid}=ids,p=POLICY[cid],h=findHistory(hid),sent=(h?.submitted||[]).find(x=>x.channelId===cid);
    button.dataset.lamouEmailHid=hid;button.dataset.lamouEmailCid=cid;button.removeAttribute('onclick');
    const mail=row.querySelector('a[href^="mailto:"]');
    if(mail){mail.href=p?.source||'#';mail.target='_blank';mail.rel='noopener';mail.textContent=p?.auto?'Regra oficial':'Abrir submissão';}
    if(!p){button.disabled=true;button.textContent='Não verificado';return}
    if(sent?.providerId){button.disabled=false;button.textContent=`↻ ${statusLabel(sent.emailStatus||'accepted')}`;button.onclick=()=>refreshStatuses(hid);button.className='ghost-button';}
    else if(p.auto){button.disabled=false;button.textContent='✉ Enviar agora';button.onclick=()=>send(hid,cid);button.className='primary-button';}
    else{button.disabled=false;button.textContent='Abrir canal oficial';button.onclick=()=>window.open(p.source,'_blank','noopener');button.className='ghost-button';}
  });
  const modalNode=document.querySelector('#modalRoot .modal');
  const firstRow=modalNode?.querySelector('.outreach-row');
  if(firstRow&&!modalNode.querySelector('[data-lamou-email-batch]')){
    const anyButton=[...modalNode.querySelectorAll('.outreach-row button')].find(b=>b.dataset.lamouEmailHid);
    if(anyButton){const hid=anyButton.dataset.lamouEmailHid;const box=document.createElement('div');box.className='row';box.dataset.lamouEmailBatch='1';box.style.marginBottom='12px';box.innerHTML=`<button class="publish-button" type="button">✉ Enviar e-mails verificados</button><button class="ghost-button" type="button">↻ Atualizar entregas</button>`;box.children[0].onclick=()=>batch(hid);box.children[1].onclick=()=>refreshStatuses(hid);firstRow.parentNode.insertBefore(box,firstRow);}
  }
}
function patch(){
  if(window.Lamou&&!legacyMarkSent&&typeof window.Lamou.markSent==='function'){
    legacyMarkSent=window.Lamou.markSent;
    window.Lamou.markSent=(hid,cid)=>send(hid,cid);
  }
  if(window.LamouRuntime?.diagnostics&&!window.LamouRuntime.diagnostics.__emailV14){
    const old=window.LamouRuntime.diagnostics;
    const wrapped=async()=>{await old();setTimeout(async()=>{const cfg=await emailConfig(true),list=document.querySelector('#modalRoot .test-list');if(list&&!list.querySelector('[data-email-check]')){const div=document.createElement('div');div.className='test-item';div.dataset.emailCheck='1';div.innerHTML=`<b>E-mail real</b><span class="status ${cfg?.configured?'green':'red'}">${cfg?.configured?'OK':'Atenção'}</span>`;list.appendChild(div)}},250)};
    wrapped.__emailV14=true;window.LamouRuntime.diagnostics=wrapped;
  }
}
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href^="mailto:"]');if(!a)return;
  const row=a.closest('.outreach-row'),button=row&&[...row.querySelectorAll('button')].find(b=>b.dataset.lamouEmailCid||(b.getAttribute('onclick')||'').includes('markSent('));if(!button)return;
  const ids=button.dataset.lamouEmailCid?{hid:button.dataset.lamouEmailHid,cid:button.dataset.lamouEmailCid}:parseIds(button);if(!ids)return;
  e.preventDefault();const p=POLICY[ids.cid];if(p?.auto)send(ids.hid,ids.cid);else if(p?.source)window.open(p.source,'_blank','noopener');
},true);
const observer=new MutationObserver(()=>{patch();decorate()});observer.observe(document.documentElement,{subtree:true,childList:true});
patch();setTimeout(decorate,300);
window.LamouEmail={close,send,batch,refreshStatuses,emailConfig,version:VERSION};
})();
