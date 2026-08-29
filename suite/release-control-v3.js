/* LAMOU IA — Release Control v3
   Projeto -> Teste -> Aprovado -> Candidato -> Publicado
   Nenhuma URL existente vira oficial automaticamente.
*/
(function(){
  const CHECK_KEYS=['smoke','e2e','a11y','security','demoClean','docs'];
  const CHECK_LABELS={smoke:'Smoke',e2e:'E2E / fluxos críticos',a11y:'Acessibilidade',security:'Segurança / privacidade',demoClean:'Dados DEMO limpos',docs:'Documentação / changelog'};
  const STAGE_LABELS={draft:'Rascunho',ready:'Pronto para teste',testing:'Em teste',approved:'Aprovado',candidate:'Candidato',published:'Publicado',archived:'Arquivado',unverified:'Deploy não validado'};

  function id(){return crypto.randomUUID?crypto.randomUUID():'v'+Date.now()+Math.random().toString(16).slice(2)}
  function esc(v=''){return typeof dEsc==='function'?dEsc(v):String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
  function app(appId){return typeof dApp==='function'?dApp(appId):state.apps.find(a=>a.id===appId)}
  function dossier(a){return typeof dEnsure==='function'?dEnsure(a):(a.dossier||(a.dossier={versions:[]}))}
  function save(){if(typeof saveState==='function')saveState()}
  function log(action,detail){if(typeof audit==='function')audit(action,detail)}
  function msg(text){if(typeof toast==='function')toast(text);else alert(text)}

  function blankChecks(){return Object.fromEntries(CHECK_KEYS.map(k=>[k,false]))}
  function normalizeVersion(v){
    v.id=v.id||id();
    v.label=v.label||v.version||'Versão sem nome';
    v.channel=v.channel||'test';
    v.stage=v.stage||'draft';
    v.url=v.url||'';v.artifact=v.artifact||'';v.notes=v.notes||'';
    v.checks={...blankChecks(),...(v.checks||{})};
    v.evidence=v.evidence||'';
    v.createdAt=v.createdAt||new Date().toISOString();
    return v;
  }
  function ensure(a){
    const d=dossier(a);
    if(!d.releaseControl){
      const imported=(d.versions||[]).map(v=>normalizeVersion({
        id:v.id,label:v.label,date:v.date,url:v.url,artifact:v.artifact,notes:v.notes,
        channel:'test',stage:v.url?'unverified':'archived'
      }));
      const currentUrl=a.url||'';
      if(currentUrl && !imported.some(v=>v.url===currentUrl)) imported.unshift(normalizeVersion({
        label:a.version||'Versão importada',channel:'official',stage:'unverified',url:currentUrl,
        artifact:d.currentArtifact||'',notes:'URL existente importada. Não foi considerada publicação aprovada.'
      }));
      d.releaseControl={schema:3,versions:imported,selectedTestId:null,productionId:null,deployment:{provider:'vercel',connected:false,projectId:'',protection:'unknown'}};
    }
    const rc=d.releaseControl;
    rc.versions=(rc.versions||[]).map(normalizeVersion);
    rc.deployment=rc.deployment||{provider:'vercel',connected:false,projectId:'',protection:'unknown'};
    return rc;
  }
  function passCount(v){return CHECK_KEYS.filter(k=>v.checks?.[k]).length}
  function gateOK(v){return CHECK_KEYS.every(k=>v.checks?.[k])}
  function selected(a){const rc=ensure(a);return rc.versions.find(v=>v.id===rc.selectedTestId)||null}
  function official(a){const rc=ensure(a);return rc.versions.find(v=>v.id===rc.productionId)||null}
  function stageBadge(v){return `<span class="tag">${esc(STAGE_LABELS[v.stage]||v.stage)}</span>`}

  window.releaseControlEnsure=ensure;

  window.dVersions=function(a){
    const rc=ensure(a),sel=selected(a),prod=official(a);
    const rows=rc.versions.map(v=>`<div class="dossier-row"><div style="min-width:0"><b>${esc(v.label)}</b><small>${v.channel==='official'?'OFICIAL/PRODUÇÃO':'TESTE/DEMO'} • ${STAGE_LABELS[v.stage]||v.stage} • gates ${passCount(v)}/${CHECK_KEYS.length}${v.id===rc.selectedTestId?' • SELECIONADA PARA TESTE':''}${v.id===rc.productionId?' • OFICIAL ATUAL':''}</small>${v.notes?`<small>${esc(v.notes)}</small>`:''}</div><div class="row-actions"><button class="btn small" data-vsel="${v.id}">Selecionar</button><button class="btn small" data-vcheck="${v.id}">Checks</button>${v.url?`<button class="btn small" data-vrun="${v.id}">Rodar</button>`:''}${v.stage!=='approved'&&v.stage!=='candidate'&&v.stage!=='published'?`<button class="btn small" data-vapprove="${v.id}">Aprovar</button>`:''}${v.stage==='approved'?`<button class="btn small" data-vcandidate="${v.id}">Candidata</button>`:''}${v.stage==='candidate'?`<button class="btn good" data-vpublish="${v.id}" ${rc.deployment.connected?'':'disabled title="Conecte um deploy real antes de publicar"'}>PUBLICAR NO AR</button>`:''}<button class="btn danger small" data-varchive="${v.id}">Arquivar</button></div></div>`).join('');
    dossierPanel.innerHTML=`
      <div class="grid3">
        <div class="box"><h3>Versão em teste</h3><p>${sel?esc(sel.label)+' • '+esc(STAGE_LABELS[sel.stage]||sel.stage):'Nenhuma selecionada'}</p>${sel?.url?'<button class="btn primary" id="vcRunSelected">Rodar selecionada</button>':''}</div>
        <div class="box"><h3>Versão oficial</h3><p>${prod?esc(prod.label)+' • PUBLICADA':'Nenhuma versão confirmada como oficial'}</p>${prod?.url?'<button class="btn" id="vcOpenOfficial">Abrir oficial</button>':''}</div>
        <div class="box"><h3>Publicação</h3><p>${rc.deployment.connected?'Deploy conectado':'BLOQUEADA — deploy real não conectado'}</p><small>Uma URL existente não conta como aprovação.</small></div>
      </div>
      <div class="panel dossier-subpanel"><div class="panel-head"><div><h2>Controle de versões</h2><p>Escolha qual versão rodar, registre os testes e só publique depois de aprovação.</p></div><button class="btn primary small" id="vcAddVersion">+ Nova versão</button></div><div class="dossier-list">${rows||'<div class="empty">Nenhuma versão cadastrada.</div>'}</div></div>`;
    if(document.getElementById('vcRunSelected'))vcRunSelected.onclick=()=>runVersion(a.id,sel.id);
    if(document.getElementById('vcOpenOfficial'))vcOpenOfficial.onclick=()=>runVersion(a.id,prod.id);
    vcAddVersion.onclick=()=>editVersion(a.id,null);
    document.querySelectorAll('[data-vsel]').forEach(b=>b.onclick=()=>selectVersion(a.id,b.dataset.vsel));
    document.querySelectorAll('[data-vcheck]').forEach(b=>b.onclick=()=>checksPanel(a.id,b.dataset.vcheck));
    document.querySelectorAll('[data-vrun]').forEach(b=>b.onclick=()=>runVersion(a.id,b.dataset.vrun));
    document.querySelectorAll('[data-vapprove]').forEach(b=>b.onclick=()=>approveVersion(a.id,b.dataset.vapprove));
    document.querySelectorAll('[data-vcandidate]').forEach(b=>b.onclick=()=>candidateVersion(a.id,b.dataset.vcandidate));
    document.querySelectorAll('[data-vpublish]').forEach(b=>b.onclick=()=>publishVersion(a.id,b.dataset.vpublish));
    document.querySelectorAll('[data-varchive]').forEach(b=>b.onclick=()=>archiveVersion(a.id,b.dataset.varchive));
  };

  function editVersion(appId,versionId){
    const a=app(appId),rc=ensure(a),old=versionId?rc.versions.find(v=>v.id===versionId):null,v=old||normalizeVersion({});
    modalTitle.textContent=a.name+' — Versão';
    modalBody.innerHTML=`<button class="btn small" id="vcBack">← Voltar</button><div class="form-grid" style="margin-top:12px"><div class="field"><label>Versão</label><input id="vcLabel" value="${esc(v.label==='Versão sem nome'?'':v.label)}" placeholder="Ex.: v0.8.0"></div><div class="field"><label>Canal</label><select id="vcChannel"><option value="test">TESTE / DEMO</option><option value="official">OFICIAL / PRODUÇÃO</option></select></div><div class="field"><label>URL executável</label><input id="vcUrl" value="${esc(v.url)}"></div><div class="field"><label>Artefato/pacote</label><input id="vcArtifact" value="${esc(v.artifact)}"></div></div><div class="field" style="margin-top:8px"><label>Notas</label><textarea id="vcNotes">${esc(v.notes)}</textarea></div><button class="btn primary" id="vcSave" style="margin-top:10px">Salvar como projeto/teste</button>`;
    vcChannel.value=v.channel;
    vcBack.onclick=()=>dRender(appId,'versions');
    vcSave.onclick=()=>{const label=vcLabel.value.trim();if(!label)return msg('Informe a versão.');v.label=label;v.channel=vcChannel.value;v.url=vcUrl.value.trim();v.artifact=vcArtifact.value.trim();v.notes=vcNotes.value.trim();if(!old){v.stage='draft';rc.versions.unshift(v)}save();log('Versão salva',a.name+' • '+v.label);dRender(appId,'versions')};
  }

  function selectVersion(appId,versionId){const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v)return;rc.selectedTestId=v.id;if(v.stage==='draft'||v.stage==='ready'||v.stage==='unverified')v.stage='testing';save();log('Versão selecionada para teste',a.name+' • '+v.label);dRender(appId,'versions')}
  function runVersion(appId,versionId){const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v?.url)return msg('Esta versão ainda não tem executável/URL de teste.');log('Versão executada',a.name+' • '+v.label);open(v.url,'_blank','noopener')}
  function approveVersion(appId,versionId){const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v)return;if(!gateOK(v))return msg('Aprovação bloqueada: complete todos os gates de teste.');v.stage='approved';save();log('Versão aprovada',a.name+' • '+v.label);dRender(appId,'versions')}
  function candidateVersion(appId,versionId){const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v||v.stage!=='approved')return msg('A versão precisa estar aprovada.');v.stage='candidate';v.channel='official';save();log('Versão candidata',a.name+' • '+v.label);dRender(appId,'versions')}
  function publishVersion(appId,versionId){const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v)return;if(!rc.deployment.connected)return msg('Publicação bloqueada: conecte um deploy real e protegido.');if(v.stage!=='candidate'||!gateOK(v))return msg('Publicação bloqueada: versão não está candidata e aprovada.');if(!v.url)return msg('Publicação bloqueada: não há URL/artefato de produção.');rc.versions.forEach(x=>{if(x.id!==v.id&&x.stage==='published')x.stage='archived'});v.stage='published';v.channel='official';rc.productionId=v.id;a.version=v.label;a.url=v.url;a.status='live';save();log('PUBLICADO NO AR',a.name+' • '+v.label);dRender(appId,'versions');if(typeof renderApps==='function')renderApps()}
  function archiveVersion(appId,versionId){const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v)return;if(rc.productionId===v.id)return msg('Não arquive a versão oficial sem antes publicar outra.');v.stage='archived';if(rc.selectedTestId===v.id)rc.selectedTestId=null;save();log('Versão arquivada',a.name+' • '+v.label);dRender(appId,'versions')}

  function checksPanel(appId,versionId){
    const a=app(appId),rc=ensure(a),v=rc.versions.find(x=>x.id===versionId);if(!v)return;
    modalTitle.textContent=a.name+' — Gates de '+v.label;
    modalBody.innerHTML=`<button class="btn small" id="vcChecksBack">← Versões</button><div class="panel dossier-subpanel"><div class="panel-head"><div><h2>Qualidade da versão</h2><p>Marque somente o que foi realmente testado e registre evidências.</p></div></div>${CHECK_KEYS.map(k=>`<label class="setting-row"><div><b>${CHECK_LABELS[k]}</b></div><input type="checkbox" data-vgate="${k}" ${v.checks[k]?'checked':''}></label>`).join('')}<div class="field" style="margin-top:12px"><label>Evidências / links / observações</label><textarea id="vcEvidence">${esc(v.evidence||'')}</textarea></div><button class="btn primary" id="vcSaveChecks" style="margin-top:10px">Salvar checks</button></div>`;
    vcChecksBack.onclick=()=>dRender(appId,'versions');
    vcSaveChecks.onclick=()=>{document.querySelectorAll('[data-vgate]').forEach(x=>v.checks[x.dataset.vgate]=x.checked);v.evidence=vcEvidence.value.trim();if(v.stage==='draft')v.stage='testing';save();log('Gates atualizados',a.name+' • '+v.label+' • '+passCount(v)+'/'+CHECK_KEYS.length);dRender(appId,'versions')};
  }

  // Card: projeto não é automaticamente "oficial" só porque possui URL.
  if(typeof appCard==='function'){
    window.appCard=function(a){const d=dossier(a),rc=ensure(a),prod=official(a),sel=selected(a);return `<article class="app-card"><div class="app-cover" style="background:${a.color}"><span class="badge-official">${prod?'NO AR':'PROJETO'}</span><div class="app-mark">${esc(a.mark)}</div><div class="app-title"><h3>${esc(a.name)}</h3><small>${esc(a.category)}</small></div></div><div class="card-body"><p>${esc(a.desc)}</p><div class="tags">${(a.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}<span class="tag">${rc.versions.length} versão(ões)</span></div><div class="card-meta"><span>${prod?'Oficial: '+esc(prod.label):'Sem versão oficial publicada'}</span><span>${sel?'Teste: '+esc(sel.label):'Sem teste selecionado'}</span></div><div class="card-actions release-actions"><button class="btn primary small" data-manage="${a.id}">Controle</button>${sel?.url?`<button class="btn small" data-vquicktest="${a.id}">Rodar teste</button>`:''}${prod?.url?`<button class="btn good small" data-vquickprod="${a.id}">Abrir oficial</button>`:''}</div></div></article>`};
    if(typeof renderApps==='function'){
      const oldRender=renderApps;
      window.renderApps=function(){oldRender();document.querySelectorAll('[data-vquicktest]').forEach(b=>b.onclick=()=>{const a=app(b.dataset.vquicktest),v=selected(a);if(v)runVersion(a.id,v.id)});document.querySelectorAll('[data-vquickprod]').forEach(b=>b.onclick=()=>{const a=app(b.dataset.vquickprod),v=official(a);if(v)runVersion(a.id,v.id)})};
    }
  }

  state.apps.forEach(ensure);save();
  if(sessionStorage.getItem(SESSION)==='1'&&typeof renderAll==='function')renderAll();
})();
