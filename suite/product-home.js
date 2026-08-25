/* LAMOU IA — Product Home
   Clicking any app card opens the complete product hub.
*/
const KNOWN_PRODUCT_LINKS={
  composer:{test:'https://composer-os-mvp.vercel.app'},
  chargeme:{test:'https://charge-me-premium.vercel.app'},
  corestudio:{official:'https://app-core-custom.vercel.app'}
};
function productApplyKnownLinks(a){
  const k=KNOWN_PRODUCT_LINKS[a.id];if(!k)return;
  const ch=releaseEnsureApp(a);
  if(k.test&&!ch.test.url)ch.test.url=k.test;
  if(k.official&&!ch.official.url){ch.official.url=k.official;a.url=k.official;}
}
state.apps.forEach(productApplyKnownLinks);saveState();
function productEnsureMedia(a){
  const d=dEnsure(a);
  d.media=d.media||{cover:'',logo:'',screenshots:[]};
  d.media.screenshots=Array.isArray(d.media.screenshots)?d.media.screenshots:[];
  if(a.id==='corestudio'&&!d.media.cover)d.media.cover='https://app-core-custom.vercel.app/og.svg';
  return d.media;
}
function productPreview(a){
  const m=productEnsureMedia(a),src=m.cover||m.logo;
  if(src)return `<img class="product-preview-img" src="${dEsc(src)}" alt="Preview ${dEsc(a.name)}" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'">`+
    `<div class="product-preview-fallback" style="display:none;background:${a.color}"><b>${dEsc(a.mark)}</b><span>Imagem não carregou</span></div>`;
  return `<div class="product-preview-fallback" style="background:${a.color}"><b>${dEsc(a.mark)}</b><span>Imagem do aplicativo ainda não vinculada</span></div>`;
}
function productTile(title,meta,action,label,kind=''){
  return `<button class="product-tile ${kind}" data-product-go="${action}"><span>${title}</span><b>${meta}</b><small>${label}</small></button>`;
}
const productOldAppCard=appCard;
appCard=function(a){
  const d=dEnsure(a),ch=releaseEnsureApp(a),m=productEnsureMedia(a),hasTest=!!ch.test.url,hasOfficial=!!ch.official.url;
  return `<article class="app-card product-card" data-product="${a.id}" role="button" tabindex="0" aria-label="Abrir ${dEsc(a.name)}">
    <div class="app-cover product-card-cover" style="background:${a.color}">
      ${m.cover||m.logo?`<img src="${dEsc(m.cover||m.logo)}" alt="" class="product-card-image" onerror="this.remove()">`:''}
      <span class="badge-official">PRODUTO</span><div class="app-mark">${dEsc(a.mark)}</div>
      <div class="app-title"><h3>${dEsc(a.name)}</h3><small>${dEsc(a.category)}</small></div>
    </div>
    <div class="card-body"><p>${dEsc(a.desc)}</p>
      <div class="product-status-line"><span class="mini-env test">🧪 TESTE ${hasTest?'✓':'—'}</span><span class="mini-env official">✅ OFICIAL ${hasOfficial?'✓':'—'}</span></div>
      <div class="card-meta"><span>${d.docs.length} documentos</span><span>${d.versions.length} versões</span></div>
      <div class="card-actions"><button class="btn primary small" data-manage="${a.id}">Abrir tudo</button><button class="btn small" data-test="${a.id}">TESTE</button><button class="btn small" data-open="${a.id}">OFICIAL</button></div>
    </div></article>`;
};
renderApps=function(){
  const f=appFilter?.value||'all',q=(globalSearch?.value||'').toLowerCase(),apps=state.apps.filter(a=>(f==='all'||a.status===f)&&(!q||[a.name,a.category,a.desc,...a.tags].join(' ').toLowerCase().includes(q))),live=state.apps.filter(a=>a.status==='live').length,avg=Math.round(state.apps.reduce((s,a)=>s+a.core,0)/Math.max(1,state.apps.length));
  appStats.innerHTML=[[state.apps.length,'Produtos','Clique no card para abrir tudo'],[live,'Oficiais publicados','Produção/real'],[state.apps.filter(a=>releaseEnsureApp(a).test.url).length,'Ambientes TESTE','Demo/homologação'],[avg+'%','CORE médio','Cobertura estimada']].map(x=>`<div class="stat"><small>${x[1]}</small><b>${x[0]}</b><em>${x[2]}</em></div>`).join('');
  appCards.innerHTML=apps.map(appCard).join('')||'<div class="empty">Nenhum aplicativo encontrado.</div>';
  $$('[data-product]').forEach(card=>{
    const openHub=()=>manageApp(card.dataset.product);
    card.onclick=e=>{if(e.target.closest('button,a,input,select,textarea'))return;openHub()};
    card.onkeydown=e=>{if((e.key==='Enter'||e.key===' ')&&!e.target.closest('button,a,input,select,textarea')){e.preventDefault();openHub()}};
  });
  $$('[data-open]').forEach(b=>b.onclick=e=>{e.stopPropagation();openOfficial(b.dataset.open)});
  $$('[data-test]').forEach(b=>b.onclick=e=>{e.stopPropagation();openTest(b.dataset.test)});
  $$('[data-manage]').forEach(b=>b.onclick=e=>{e.stopPropagation();manageApp(b.dataset.manage)});
};
const productReleaseRender=dRender;
dRender=function(id,tab='overview'){
  const a=dApp(id);if(!a)return;
  dEnsure(a);releaseEnsureApp(a);productEnsureMedia(a);
  if(tab!=='overview')return productReleaseRender(id,tab);
  dShell(a,'overview');productHome(a);
};
manageApp=function(id){dRender(id,'overview')};
function productHome(a){
  const d=dEnsure(a),ch=releaseEnsureApp(a),m=productEnsureMedia(a),t=ch.test,o=ch.official;
  const officialUrl=o.url||a.url||'',testUrl=t.url||'',artifact=o.artifact||d.currentArtifact||'';
  dossierPanel.innerHTML=`
    <div class="product-home-top">
      <div class="product-preview">${productPreview(a)}</div>
      <div class="product-identity"><span class="official-badge">CENTRAL DO PRODUTO</span><h2>${dEsc(a.name)}</h2><p>${dEsc(a.desc)}</p>
        <div class="product-main-actions">
          <button class="btn ${testUrl?'':'warn'}" id="phTest">🧪 ${testUrl?'Abrir TESTE':'Configurar TESTE'}</button>
          <button class="btn primary" id="phOfficial">✅ ${officialUrl?'Abrir OFICIAL / REAL':'Configurar OFICIAL'}</button>
          ${artifact?'<button class="btn" id="phDownload">⬇ Arquivo oficial</button>':''}
        </div>
      </div>
    </div>
    <div class="product-tiles">
      ${productTile('🧪 TESTE / DEMO',dEsc(t.version||'Teste/Demo'),'channels',testUrl?'Abrir e configurar':'Adicionar link de teste','test')}
      ${productTile('✅ OFICIAL / REAL',dEsc(o.version||a.version),'channels',officialUrl?'Abrir e configurar':'Adicionar link oficial','official')}
      ${productTile('🕘 VERSÕES',String(d.versions.length),'versions','Ver todas as versões')}
      ${productTile('📄 DOCUMENTOS',String(d.docs.length),'docs','Abrir documentos do produto')}
      ${productTile('🖼 IMAGENS & LOGO',(m.cover||m.logo||m.screenshots.length)?'Configuradas':'Pendente','media','Ver/alterar imagem')}
      ${productTile('🏗 ESTRUTURA','Arquitetura','structure','Abrir estrutura técnica')}
      ${productTile('⚖ DIREITOS & PROVAS',String(d.evidence.length),'rights','Autoria, titularidade e evidências')}
      ${productTile('📣 MARKETING','Plano','marketing','Posicionamento e materiais')}
      ${productTile('✉ ENVIOS',String(d.shares.length),'shares','Histórico de compartilhamento')}
    </div>
    <div class="panel product-links-panel"><div class="panel-head"><div><h2>Links e arquivos principais</h2><p>Tudo que você precisa para abrir, enviar ou localizar o produto.</p></div></div>
      <div class="product-link-list">
        <div><span>TESTE</span><b>${testUrl?`<a href="${dEsc(testUrl)}" target="_blank" rel="noopener">${dEsc(testUrl)}</a>`:'Não configurado'}</b></div>
        <div><span>OFICIAL / REAL</span><b>${officialUrl?`<a href="${dEsc(officialUrl)}" target="_blank" rel="noopener">${dEsc(officialUrl)}</a>`:'Não configurado'}</b></div>
        <div><span>ARQUIVO / PACOTE</span><b>${artifact?`<a href="${dEsc(artifact)}" target="_blank" rel="noopener">${dEsc(artifact)}</a>`:'Não configurado'}</b></div>
        <div><span>REPOSITÓRIO</span><b>${d.rights?.repo?`<a href="${dEsc(d.rights.repo)}" target="_blank" rel="noopener">${dEsc(d.rights.repo)}</a>`:'Não configurado'}</b></div>
      </div>
    </div>`;
  phTest.onclick=()=>testUrl?openTest(a.id):dRender(a.id,'channels');
  phOfficial.onclick=()=>officialUrl?openOfficial(a.id):dRender(a.id,'channels');
  if($('#phDownload'))phDownload.onclick=()=>open(artifact,'_blank','noopener');
  $$('[data-product-go]').forEach(b=>b.onclick=()=>b.dataset.productGo==='media'?productMediaPanel(a):dRender(a.id,b.dataset.productGo));
}
function productMediaPanel(a){
  const d=dEnsure(a),m=productEnsureMedia(a);
  dShell(a,'overview');
  dossierPanel.innerHTML=`<div class="panel"><div class="panel-head"><div><h2>🖼 Imagens & identidade do aplicativo</h2><p>Essas imagens aparecem no card e na Central do Produto.</p></div><button class="btn" id="pmBack">← Voltar</button></div>
    <div class="grid2"><div class="box"><h3>Preview atual</h3><div class="product-preview">${productPreview(a)}</div></div><div class="box"><h3>Links das imagens</h3>
      <div class="field"><label>Imagem principal / screenshot</label><input id="pmCover" value="${dEsc(m.cover||'')}" placeholder="https://..."></div>
      <div class="field" style="margin-top:8px"><label>Logo do aplicativo</label><input id="pmLogo" value="${dEsc(m.logo||'')}" placeholder="https://..."></div>
      <div class="field" style="margin-top:8px"><label>Screenshots adicionais (um link por linha)</label><textarea id="pmShots">${dEsc(m.screenshots.join('\n'))}</textarea></div>
      <button class="btn primary" id="pmSave" style="margin-top:10px">Salvar imagens</button>
    </div></div></div>`;
  pmBack.onclick=()=>dRender(a.id,'overview');
  pmSave.onclick=()=>{m.cover=pmCover.value.trim();m.logo=pmLogo.value.trim();m.screenshots=pmShots.value.split('\n').map(x=>x.trim()).filter(Boolean);saveState();audit('Imagens do produto atualizadas',a.name);toast('Imagens salvas.');dRender(a.id,'overview')};
}
if(sessionStorage.getItem(SESSION)==='1')renderAll();

/* CORE 2.1.1 — password credential UX: browser/Google Password Manager + reveal controls */
(function enhancePasswordUX(){
  const style=document.createElement('style');
  style.textContent=`
    .pw-wrap{position:relative}.pw-wrap input{padding-right:48px!important}.pw-eye{position:absolute;right:7px;top:50%;transform:translateY(-50%);width:36px;height:34px;border:0;border-radius:9px;background:transparent;color:inherit;font-size:18px;cursor:pointer}.pw-eye:hover{background:rgba(127,127,127,.12)}
    .pw-pref{display:flex;align-items:center;gap:8px;margin-top:10px;font-size:12px;color:var(--muted);cursor:pointer}.pw-pref input{width:auto}.pw-help{display:block;margin-top:5px;font-size:10px;color:var(--muted)}
  `;
  document.head.appendChild(style);
  function addEye(input){
    if(!input||input.dataset.eyeReady)return;input.dataset.eyeReady='1';
    const wrap=document.createElement('div');wrap.className='pw-wrap';input.parentNode.insertBefore(wrap,input);wrap.appendChild(input);
    const b=document.createElement('button');b.type='button';b.className='pw-eye';b.setAttribute('aria-label','Mostrar senha');b.textContent='👁';
    b.onclick=()=>{const show=input.type==='password';input.type=show?'text':'password';b.textContent=show?'🙈':'👁';b.setAttribute('aria-label',show?'Ocultar senha':'Mostrar senha');};wrap.appendChild(b);
  }
  const setupName=$('#setupName'),p1=$('#setupPassword'),p2=$('#setupPassword2'),login=$('#loginPassword');
  if(setupName){setupName.name='username';setupName.autocomplete='username';}
  if(p1){p1.name='new-password';p1.autocomplete='new-password';addEye(p1);}
  if(p2){p2.name='new-password-confirmation';p2.autocomplete='new-password';addEye(p2);}
  if(login){login.name='password';login.autocomplete='current-password';addEye(login);}
  const setupBox=$('#setupAccess');
  if(setupBox&&!$('#savePasswordPref')){
    const anchor=$('#setupPassword2')?.closest('.field')||p2?.parentNode;
    const label=document.createElement('label');label.className='pw-pref';label.innerHTML='<input id="savePasswordPref" type="checkbox" checked> Salvar senha neste dispositivo';
    anchor?.insertAdjacentElement('afterend',label);
    const help=document.createElement('small');help.className='pw-help';help.textContent='O navegador/Google Password Manager pode oferecer para salvar com segurança.';label.insertAdjacentElement('afterend',help);
    label.querySelector('input').onchange=e=>{const on=e.target.checked;p1&&p1.setAttribute('autocomplete',on?'new-password':'off');p2&&p2.setAttribute('autocomplete',on?'new-password':'off');};
  }
  const loginBox=$('#loginAccess');
  if(loginBox&&!$('#useSavedPasswordPref')){
    const field=login?.closest('.field')||login?.parentNode;
    const label=document.createElement('label');label.className='pw-pref';label.innerHTML='<input id="useSavedPasswordPref" type="checkbox" checked> Usar senha salva anteriormente';
    field?.insertAdjacentElement('afterend',label);
    const help=document.createElement('small');help.className='pw-help';help.textContent='Se houver uma senha salva no Chrome/Google, toque no campo de senha para selecioná-la.';label.insertAdjacentElement('afterend',help);
    label.querySelector('input').onchange=e=>{login?.setAttribute('autocomplete',e.target.checked?'current-password':'off');if(e.target.checked)login?.focus();};
    try{const a=JSON.parse(localStorage.getItem(AUTH)||'null');if(a?.name){const user=document.createElement('input');user.type='text';user.name='username';user.autocomplete='username';user.value=a.name;user.readOnly=true;user.tabIndex=-1;user.style.position='absolute';user.style.opacity='0';user.style.pointerEvents='none';loginBox.prepend(user);}}catch(e){}
  }
})();
