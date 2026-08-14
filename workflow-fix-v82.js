/* LAMOU v8.2 — workflow correctness hotfix
   - Drafts never enter History until explicitly saved/completed/published.
   - Campaign UI stays hidden until user chooses Create campaign.
   - Campaign can be deleted/reset independently.
   - AI generates impact phrase, caption, hashtags and CTA from the current track.
*/
(() => {
'use strict';
const USERS='lamou_users_v6', ACTIVE='lamou_active_user_v6', AP='lamou_active_project_v6', PREFIX='lamou_project_v6_';
const load=(k,f)=>{try{const v=localStorage.getItem(k);return v?JSON.parse(v):f}catch(_){return f}};
const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(_){}};
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const key=(uid,pid)=>`${PREFIX}${uid}_${pid}`;
function users(){return load(USERS,[])}
function user(){const us=users(),id=localStorage.getItem(ACTIVE)||'';return us.find(x=>x.id===id)||us[0]||null}
function activeProject(){const u=user(),pid=localStorage.getItem(AP)||'';return u?.projects?.find(p=>p.id===pid)||null}
function state(){const u=user(),p=activeProject();return u&&p?load(key(u.id,p.id),{}):null}
function toast(m){if(typeof window.toast==='function')window.toast(m);else alert(m)}
function projectName(d,p){return d?.title||p?.name||'Nova música'}

function markDraftOnOpen(){const u=user(),p=activeProject();if(!u||!p)return;if(!p.status){const us=users(),ui=us.findIndex(x=>x.id===u.id),pi=us[ui]?.projects?.findIndex(x=>x.id===p.id);if(ui>=0&&pi>=0){us[ui].projects[pi].status='draft';save(USERS,us)}}}
function finalize(reason='saved'){
 const u=user(),p=activeProject(),d=state();if(!u||!p)return false;
 if(!d?.url && !d?.title){toast('Carregue uma música antes de salvar o trabalho.');return false}
 const us=users(),ui=us.findIndex(x=>x.id===u.id),pi=us[ui]?.projects?.findIndex(x=>x.id===p.id);if(ui<0||pi<0)return false;
 us[ui].projects[pi]={...us[ui].projects[pi],name:projectName(d,p),status:'completed',completedAt:new Date().toISOString(),updatedAt:new Date().toISOString(),completionReason:reason};save(USERS,us);
 d.completed=true;d.completedAt=new Date().toISOString();d.completionReason=reason;save(key(u.id,p.id),d);save('lamou',d);toast('Trabalho salvo no Histórico.');return true
}
window.lamouFinalizeCurrent=finalize;

function addWorkspaceActions(){
 const first=[...document.querySelectorAll('main.grid > section')].find(s=>/1\. Sua música|Sua música/i.test(s.textContent));if(!first||document.getElementById('v82WorkActions'))return;
 const row=document.createElement('div');row.id='v82WorkActions';row.className='v82-work-actions';row.innerHTML=`<span class="v82-draft">RASCUNHO</span><button class="btn p" id="v82SaveWork">💾 Salvar trabalho</button><button class="btn" id="v82DiscardWork">Descartar rascunho</button>`;first.prepend(row);
 row.querySelector('#v82SaveWork').onclick=()=>{if(finalize('saved'))row.querySelector('.v82-draft').textContent='SALVO'};
 row.querySelector('#v82DiscardWork').onclick=discardDraft;
}
function discardDraft(){const u=user(),p=activeProject();if(!u||!p)return;if(p.status==='completed'&&!confirm('Este trabalho já foi salvo. Remover mesmo assim?'))return;if(!confirm('Descartar este rascunho?'))return;const us=users(),ui=us.findIndex(x=>x.id===u.id);if(ui>=0)us[ui].projects=(us[ui].projects||[]).filter(x=>x.id!==p.id);save(USERS,us);localStorage.removeItem(key(u.id,p.id));localStorage.removeItem(AP);localStorage.removeItem('lamou');sessionStorage.removeItem('lamou_v8_workspace');location.reload()}

function patchHistory(){
 const v8=window.LAMOU_V8;if(!v8)return;
 const old=v8.history;
 v8.history=function(){
   const u=user();if(!u)return old?.();
   const original=u.projects||[];const complete=original.filter(p=>p.status==='completed');
   const us=users(),ui=us.findIndex(x=>x.id===u.id);if(ui<0)return old?.();
   us[ui].projects=complete;const snapshot=load(USERS,[]); // temp view only
   save(USERS,us);try{return old?.()}finally{save(USERS,snapshot)}
 };
 const resultBtn=document.getElementById('v8Results');if(resultBtn)resultBtn.onclick=()=>v8.history();
 const homeHist=document.getElementById('v8History');if(homeHist)homeHist.onclick=()=>v8.history();
}

function campaignGate(){
 const campaign=document.getElementById('campaignPanel'),quick=document.getElementById('quickPanel'),external=document.getElementById('externalPanel');if(!campaign)return;
 campaign.style.display='none';if(external)external.style.display='none';if(quick)quick.style.display='';
 const buttons=[...document.querySelectorAll('[data-mode]')];buttons.forEach(b=>{const mode=b.dataset.mode;b.onclick=()=>{
   buttons.forEach(x=>x.classList.toggle('on',x===b));
   if(quick)quick.style.display=mode==='quick'?'':'none';
   if(campaign)campaign.style.display=mode==='campaign'?'':'none';
   if(external)external.style.display=mode==='external'?'':'none';
   if(mode==='campaign')ensureCampaignDelete();
 }});
 ensureCampaignDelete();
}
function ensureCampaignDelete(){const panel=document.getElementById('campaignPanel');if(!panel||document.getElementById('v82DeleteCampaign'))return;const row=panel.querySelector('.row')||panel;const b=document.createElement('button');b.id='v82DeleteCampaign';b.className='btn';b.textContent='🗑️ Excluir campanha';b.onclick=deleteCampaign;row.appendChild(b)}
function deleteCampaign(){if(!confirm('Excluir os dados desta campanha? A música continuará salva.'))return;const d=state(),u=user(),p=activeProject();if(!d||!u||!p)return;d.camp=[];d.campaign=[];d.calendar=[];d.history=(d.history||[]).filter(x=>!/campanha/i.test(String(x.action||'')));save(key(u.id,p.id),d);save('lamou',d);const cal=document.getElementById('calendar');if(cal)cal.innerHTML='';document.getElementById('campaignPanel').style.display='none';document.getElementById('quickPanel')?.style.setProperty('display','');toast('Campanha excluída. A música foi mantida.')}

function songContext(){const d=state()||window.S||{};return {title:d.title||window.S?.title||document.getElementById('title')?.textContent||'Nova música',genre:document.getElementById('genre')?.value||d.genre||'',subgenre:document.getElementById('subgenre')?.value||d.subgenre||'',mood:document.getElementById('mood')?.value||d.mood||'',production:document.getElementById('production')?.value||d.production||'',url:d.url||window.S?.url||document.getElementById('spotify')?.value||''}}
function localCopy(c){const style=c.subgenre||c.genre||'som autoral';const mood=c.mood?` com clima ${c.mood.toLowerCase()}`:'';const title=c.title||'Nova música';const impact=`${title}: ${style}${mood} que chega sem pedir licença.`;const caption=`🎧 ${title} já está no ar. Uma faixa de ${style}${mood}, feita para quem gosta de descobrir som antes de todo mundo. Dá o play, salva e me conta qual trecho ficou na cabeça.`;const base=[style,c.genre,c.subgenre,'musicanova','artistindependente','newmusic','spotify','lamou'].filter(Boolean).map(x=>'#'+String(x).normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-zA-Z0-9]/g,'').toLowerCase());return {impact,caption,hashtags:[...new Set(base)].slice(0,10).join(' '),cta:'Ouça agora • salve • compartilhe'}}
async function generateAIContent(){
 const out=document.getElementById('v82AIContent'),c=songContext();if(!out)return;if(!c.title||c.title==='Faixa Spotify'){out.innerHTML='<div class="v8-empty">Carregue ou selecione uma música primeiro.</div>';return}out.innerHTML='<div class="v8-empty">Criando conteúdo para esta música…</div>';
 let result=null;try{const r=await fetch('/api/ai',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({task:'social_content',payload:{...c,instruction:'Generate in Brazilian Portuguese: one short impact phrase, one social caption, 8-12 relevant hashtags and one CTA. Return JSON fields impact, caption, hashtags, cta.'}})});if(r.ok){const d=await r.json();result=d.result||d;if(typeof result==='string'){try{result=JSON.parse(result)}catch(_){result={caption:result}}}}}catch(_){}
 const x={...localCopy(c),...(result||{})};if(Array.isArray(x.hashtags))x.hashtags=x.hashtags.join(' ');
 out.innerHTML=`<div class="v82-ai-card"><small>FRASE DE IMPACTO</small><b>${esc(x.impact||'')}</b></div><div class="v82-ai-card"><small>LEGENDA</small><p>${esc(x.caption||'')}</p></div><div class="v82-ai-card"><small>HASHTAGS</small><p>${esc(x.hashtags||'')}</p></div><div class="v82-ai-card"><small>CTA</small><b>${esc(x.cta||'')}</b></div><div class="v8-modal-actions"><button class="btn" id="v82CopyAll">Copiar tudo</button><button class="btn p" id="v82UseCopy">Usar como mensagem de impacto</button></div>`;
 const text=`${x.impact}\n\n${x.caption}\n\n${x.hashtags}\n\n${x.cta}`;out.querySelector('#v82CopyAll').onclick=()=>navigator.clipboard?.writeText(text).then(()=>toast('Conteúdo copiado.'));out.querySelector('#v82UseCopy').onclick=()=>{const el=document.getElementById('copy');if(el)el.textContent=`${x.caption}\n\n${x.hashtags}`;toast('Conteúdo aplicado à campanha.')};
}
function upgradeAI(){
 const btn=document.getElementById('v8AI');if(!btn)return;btn.onclick=()=>{
   let m=document.getElementById('v82AIModal');if(!m){m=document.createElement('div');m.id='v82AIModal';m.className='v8-modal';m.innerHTML=`<div class="v8-sheet"><div class="v8-modal-head"><div><h2>✨ IA da música atual</h2><p>Frase de impacto, legenda, hashtags e CTA baseados na faixa selecionada.</p></div><button>×</button></div><div class="v8-modal-actions"><button class="btn p" id="v82GenerateAI">✨ Gerar conteúdo</button></div><div id="v82AIContent" class="v8-empty">A IA vai usar a música atual, gênero, subgênero e clima.</div></div>`;document.body.appendChild(m);m.querySelector('.v8-modal-head button').onclick=()=>m.classList.remove('on');m.querySelector('#v82GenerateAI').onclick=generateAIContent;m.onclick=e=>{if(e.target===m)m.classList.remove('on')}}m.classList.add('on');generateAIContent();
 };
 const quick=document.getElementById('quickPanel');if(quick&&!document.getElementById('v82QuickAI')){const row=quick.querySelector('.row')||quick;const b=document.createElement('button');b.id='v82QuickAI';b.className='btn';b.textContent='✨ Gerar frase + hashtags';b.onclick=()=>btn.click();row.appendChild(b)}
}

function wrapCompletion(){
 if(typeof window.shareNow==='function'&&!window.shareNow.__v82){const old=window.shareNow;const fn=async function(...args){const r=await old.apply(this,args);finalize('shared');return r};fn.__v82=true;window.shareNow=fn}
}
function styles(){if(document.getElementById('v82Styles'))return;const s=document.createElement('style');s.id='v82Styles';s.textContent=`.v82-work-actions{display:flex;gap:8px;align-items:center;justify-content:flex-end;flex-wrap:wrap;margin-bottom:12px}.v82-draft{font-size:.72rem;font-weight:900;letter-spacing:.08em;padding:6px 9px;border-radius:999px;background:#fff3d6;color:#946700}.v82-ai-card{padding:13px;border:1px solid #e4e7ef;border-radius:13px;margin:8px 0;background:#fafbff}.v82-ai-card small{display:block;font-weight:900;color:#6669eb;letter-spacing:.08em;margin-bottom:5px}.v82-ai-card p{white-space:pre-wrap;margin:0}.v82-ai-card b{display:block}`;document.head.appendChild(s)}
function init(){styles();markDraftOnOpen();addWorkspaceActions();campaignGate();upgradeAI();wrapCompletion();setTimeout(patchHistory,250)}
window.addEventListener('load',()=>setTimeout(init,2400));
})();