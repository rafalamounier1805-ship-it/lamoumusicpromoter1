/* LAMOU IA — release channels
   TESTE/DEMO is permanent and isolated from OFICIAL/PRODUÇÃO.
   CORE transversal != CORE Studio application.
*/
const RELEASE_CORE_APP={
  id:'corestudio',name:'LAMOU CORE Studio',mark:'CORE',category:'Plataforma interna & Arquitetura',status:'live',version:'Oficial',
  color:'linear-gradient(135deg,#213a7a,#6a45b8)',
  desc:'Aplicativo do APP CORE CUSTOM para organizar, visualizar e evoluir a base transversal usada pelos produtos LAMOU IA.',
  url:'https://app-core-custom.vercel.app',core:100,history:[],tags:['CORE','Arquitetura','Governança']
};
function releaseEnsureApp(a){
  const d=dEnsure(a);
  if(!d.channels)d.channels={
    test:{enabled:true,version:'Teste/Demo',url:'',artifact:'',dataMode:'simulated',status:'working',notes:'Ambiente permanente de teste, homologação e demonstração. Pode conter dados simulados.'},
    official:{version:a.version||'Oficial',url:a.url||'',artifact:d.currentArtifact||'',dataMode:'clean',status:a.status==='live'?'published':'draft',sourceTestVersion:'',notes:'Ambiente limpo para entrega e uso real. Não deve carregar dados demonstrativos.'}
  };
  d.channels.test=d.channels.test||{enabled:true,version:'Teste/Demo',url:'',artifact:'',dataMode:'simulated',status:'working',notes:''};
  d.channels.official=d.channels.official||{version:a.version||'Oficial',url:a.url||'',artifact:d.currentArtifact||'',dataMode:'clean',status:'draft',sourceTestVersion:'',notes:''};
  if(!d.channels.official.url&&a.url)d.channels.official.url=a.url;
  if(!d.channels.official.version)d.channels.official.version=a.version||'Oficial';
  return d.channels;
}
function releaseMigrate(){
  if(!state.apps.some(a=>a.id==='corestudio'))state.apps.unshift(structuredClone(RELEASE_CORE_APP));
  state.apps.forEach(a=>releaseEnsureApp(a));
  const coreApp=state.apps.find(a=>a.id==='corestudio');
  if(coreApp){coreApp.url='https://app-core-custom.vercel.app';coreApp.version=coreApp.version||'Oficial';releaseEnsureApp(coreApp).official.url=coreApp.url;}
  saveState();
}
function openTest(id){const a=dApp(id);if(!a)return;const t=releaseEnsureApp(a).test;if(t.url){audit('Ambiente TESTE aberto',a.name);open(t.url,'_blank','noopener')}else{manageApp(id);setTimeout(()=>dRender(id,'channels'),0)}}
const releaseOriginalRenderApps=renderApps;
appCard=function(a){
  const d=dEnsure(a),ch=releaseEnsureApp(a),hasTest=!!ch.test.url,hasOfficial=!!ch.official.url;
  return `<article class="app-card"><div class="app-cover" style="background:${a.color}"><span class="badge-official">OFICIAL</span><div class="app-mark">${dEsc(a.mark)}</div><div class="app-title"><h3>${dEsc(a.name)}</h3><small>${dEsc(a.category)}</small></div></div><div class="card-body"><p>${dEsc(a.desc)}</p><div class="tags">${a.tags.map(t=>`<span class="tag">${dEsc(t)}</span>`).join('')}<span class="tag">TESTE ${hasTest?'ATIVO':'PENDENTE'}</span></div><div class="card-meta"><span class="status">${statusDot(a.status)}</span><span>${dEsc(ch.official.version||a.version)}</span></div><div class="card-meta"><span>${d.docs.length} documentos</span><span>${d.versions.length} histórica(s)</span></div><div class="card-actions release-actions"><button class="btn primary small" data-manage="${a.id}">Dossiê</button><button class="btn small" data-test="${a.id}">${hasTest?'Abrir teste':'Configurar teste'}</button><button class="btn small" data-open="${a.id}">${hasOfficial?'Abrir oficial':'Configurar oficial'}</button></div></div></article>`;
};
renderApps=function(){
  const f=appFilter?.value||'all',q=(globalSearch?.value||'').toLowerCase(),apps=state.apps.filter(a=>(f==='all'||a.status===f)&&(!q||[a.name,a.category,a.desc,...a.tags].join(' ').toLowerCase().includes(q))),live=state.apps.filter(a=>a.status==='live').length,avg=Math.round(state.apps.reduce((s,a)=>s+a.core,0)/Math.max(1,state.apps.length));
  appStats.innerHTML=[[state.apps.length,'Produtos','Um card por produto'],[live,'Oficiais publicados','Produção'],[state.apps.filter(a=>releaseEnsureApp(a).test.url).length,'Ambientes teste','Demo/homologação'],[avg+'%','CORE médio','Cobertura estimada']].map(x=>`<div class="stat"><small>${x[1]}</small><b>${x[0]}</b><em>${x[2]}</em></div>`).join('');
  appCards.innerHTML=apps.map(appCard).join('')||'<div class="empty">Nenhum aplicativo encontrado.</div>';
  $$('[data-open]').forEach(b=>b.onclick=()=>openOfficial(b.dataset.open));$$('[data-test]').forEach(b=>b.onclick=()=>openTest(b.dataset.test));$$('[data-manage]').forEach(b=>b.onclick=()=>manageApp(b.dataset.manage));
};
const releaseOldOpenOfficial=openOfficial;
openOfficial=function(id){const a=dApp(id);if(!a)return;const o=releaseEnsureApp(a).official;const url=o.url||a.url;if(url){audit('Ambiente OFICIAL aberto',a.name);open(url,'_blank','noopener')}else{manageApp(id);setTimeout(()=>dRender(id,'channels'),0)}};
dShell=function(a,tab){
  const ch=releaseEnsureApp(a),tabs=[['overview','Visão geral'],['channels','TESTE x OFICIAL'],['versions','Versões'],['docs','Documentos'],['rights','Direitos & provas'],['structure','Estrutura'],['marketing','Marketing'],['shares','Envios']];
  modalTitle.textContent=a.name+' — Dossiê';
  modalBody.innerHTML=`<div class="dossier-head"><div><span class="official-badge">DOSSIÊ DO PRODUTO</span><h3>${dEsc(a.name)}</h3><p>TESTE/DEMO e OFICIAL/PRODUÇÃO são ambientes separados. Comercial continua fora.</p></div><div class="dossier-quick"><button class="btn small" id="dDownAll">Baixar resumo</button><button class="btn small" id="dSendAll">Enviar resumo</button>${ch.test.url?'<button class="btn small" id="dOpenTest">TESTE</button>':''}${(ch.official.url||a.url)?'<button class="btn primary small" id="dOpenCurrent">OFICIAL</button>':''}</div></div><div class="dossier-tabs">${tabs.map(([k,n])=>`<button class="dossier-tab ${k===tab?'active':''}" data-dtab="${k}">${n}</button>`).join('')}</div><div id="dossierPanel"></div>`;
  showModal();$$('[data-dtab]').forEach(b=>b.onclick=()=>dRender(a.id,b.dataset.dtab));dDownAll.onclick=()=>dDownload(dSlug(a.name)+'-dossie.md',dSummary(a));dSendAll.onclick=()=>dMail(a,'Dossiê','Resumo do dossiê',a.name+' — dossiê',dSummary(a));if($('#dOpenCurrent'))dOpenCurrent.onclick=()=>openOfficial(a.id);if($('#dOpenTest'))dOpenTest.onclick=()=>openTest(a.id);
};
dRender=function(id,tab='overview'){const a=dApp(id);if(!a)return;dEnsure(a);releaseEnsureApp(a);dShell(a,tab);if(tab==='overview')dOverview(a);if(tab==='channels')releaseChannelsPanel(a);if(tab==='versions')dVersions(a);if(tab==='docs')dDocs(a);if(tab==='rights')dRights(a);if(tab==='structure')dGroup(a,'Estrutura');if(tab==='marketing')dGroup(a,'Marketing');if(tab==='shares')dShares(a)};
function releaseChannelsPanel(a){
  const d=dEnsure(a),ch=releaseEnsureApp(a),t=ch.test,o=ch.official;
  dossierPanel.innerHTML=`<div class="grid2"><div class="box release-box test-box"><h3>🧪 TESTE / DEMO</h3><p>Ambiente permanente para desenvolvimento, homologação e demonstração. Pode usar dados fictícios e simulações.</p><div class="field"><label>Versão teste</label><input id="rtVersion" value="${dEsc(t.version||'Teste/Demo')}"></div><div class="field" style="margin-top:8px"><label>URL TESTE</label><input id="rtUrl" value="${dEsc(t.url||'')}"></div><div class="field" style="margin-top:8px"><label>Pacote TESTE</label><input id="rtArtifact" value="${dEsc(t.artifact||'')}"></div><div class="field" style="margin-top:8px"><label>Notas</label><textarea id="rtNotes">${dEsc(t.notes||'')}</textarea></div><div class="metric"><span>Dados</span><b>SIMULADOS / DEMO</b></div><div class="row-actions" style="margin-top:10px"><button class="btn primary" id="rtSave">Salvar teste</button>${t.url?'<button class="btn" id="rtOpen">Abrir teste</button>':''}</div></div><div class="box release-box official-box"><h3>✅ OFICIAL / PRODUÇÃO</h3><p>Versão limpa para entrega e uso real. Sem clientes fictícios, exemplos, mocks, seed demo ou simulações.</p><div class="field"><label>Versão oficial</label><input id="roVersion" value="${dEsc(o.version||a.version)}"></div><div class="field" style="margin-top:8px"><label>URL OFICIAL</label><input id="roUrl" value="${dEsc(o.url||a.url||'')}"></div><div class="field" style="margin-top:8px"><label>Pacote OFICIAL</label><input id="roArtifact" value="${dEsc(o.artifact||d.currentArtifact||'')}"></div><div class="field" style="margin-top:8px"><label>Notas</label><textarea id="roNotes">${dEsc(o.notes||'')}</textarea></div><div class="metric"><span>Dados</span><b>LIMPOS / REAIS</b></div><div class="row-actions" style="margin-top:10px"><button class="btn primary" id="roSave">Salvar oficial</button>${(o.url||a.url)?'<button class="btn" id="roOpen">Abrir oficial</button>':''}</div></div></div><div class="panel dossier-subpanel"><div class="panel-head"><div><h2>Promoção TESTE → OFICIAL</h2><p>Promove a versão aprovada, nunca os dados simulados.</p></div><button class="btn good" id="promoteRelease">Preparar promoção</button></div><div class="grid3"><div class="box"><h3>1. Validar</h3><p>Smoke/E2E, segurança, acessibilidade, documentos e critérios de aceite.</p></div><div class="box"><h3>2. Limpar</h3><p>Excluir seed, mocks, contas fictícias, tokens de teste, logs sensíveis e dados demonstrativos.</p></div><div class="box"><h3>3. Publicar</h3><p>Gerar artefato oficial, registrar release/changelog e apontar a URL de produção.</p></div></div></div>`;
  rtSave.onclick=()=>{t.version=rtVersion.value.trim()||'Teste/Demo';t.url=rtUrl.value.trim();t.artifact=rtArtifact.value.trim();t.notes=rtNotes.value;t.dataMode='simulated';saveState();audit('Canal TESTE atualizado',a.name);toast('Ambiente de teste salvo.');dRender(a.id,'channels')};
  roSave.onclick=()=>{o.version=roVersion.value.trim()||a.version;o.url=roUrl.value.trim();o.artifact=roArtifact.value.trim();o.notes=roNotes.value;o.dataMode='clean';a.version=o.version;a.url=o.url;d.currentArtifact=o.artifact;saveState();audit('Canal OFICIAL atualizado',a.name);toast('Ambiente oficial salvo.');dRender(a.id,'channels')};
  if($('#rtOpen'))rtOpen.onclick=()=>openTest(a.id);if($('#roOpen'))roOpen.onclick=()=>openOfficial(a.id);
  promoteRelease.onclick=()=>{o.sourceTestVersion=t.version||'Teste/Demo';o.version=(t.version||a.version).replace(/\b(teste|demo|homologa[cç][aã]o)\b/gi,'').replace(/\s{2,}/g,' ').trim()||a.version;o.status='candidate';o.notes='Candidato promovido a partir de '+(t.version||'TESTE')+'. Revisar limpeza de dados e publicar artefato oficial.';saveState();audit('Promoção preparada',a.name+' • '+o.sourceTestVersion+' → candidato oficial');toast('Candidato oficial preparado. Dados de teste NÃO foram copiados.');dRender(a.id,'channels')};
}
releaseMigrate();
if(sessionStorage.getItem(SESSION)==='1')renderAll();
