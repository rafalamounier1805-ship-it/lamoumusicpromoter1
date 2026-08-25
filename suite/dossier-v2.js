const DOSSIER_DOCS = [
  ['Resumo executivo do produto','Produto'],
  ['Requisitos, escopo e funcionalidades','Produto'],
  ['Arquitetura e estrutura de software','Estrutura'],
  ['Inventário de componentes, APIs e licenças','Estrutura'],
  ['Segurança, LGPD e tratamento de dados','Governança'],
  ['Plano de testes, validação e evidências','Qualidade'],
  ['Histórico de versões e changelog','Versionamento'],
  ['Dossiê de autoria e propriedade intelectual','Direitos'],
  ['Registro de evidências de criação e titularidade','Direitos'],
  ['Manual técnico e operacional','Operação'],
  ['Plano de marketing','Marketing'],
  ['Posicionamento, público e proposta de valor','Marketing'],
  ['Plano de continuidade, backup e recuperação','Governança'],
  ['Licenciamento, termos de uso e distribuição','Direitos']
];

function dEsc(v=''){return String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function dSlug(v='arquivo'){return String(v).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'arquivo'}
function dNow(){return new Date().toISOString()}
function dDate(v){return v?new Date(v).toLocaleString('pt-BR'):'—'}
function dApp(id){return state.apps.find(a=>a.id===id)}
function dDownload(name,text,type='text/markdown;charset=utf-8'){const b=new Blob([text],{type}),u=URL.createObjectURL(b),x=document.createElement('a');x.href=u;x.download=name;x.click();setTimeout(()=>URL.revokeObjectURL(u),500)}
function dCopy(text){navigator.clipboard?.writeText(text).then(()=>toast('Link copiado.')).catch(()=>toast('Não foi possível copiar.'))}

function dDocBody(a,title,category){
  const common=[
    '# '+a.name+' — '+title,
    '',
    '**Categoria:** '+category,
    '**Versão atual:** '+a.version,
    '**Status:** '+statusLabel(a.status),
    '**URL oficial:** '+(a.url||'A definir'),
    '**CORE:** '+a.core+'%',
    '',
    '## Objetivo',
    'Documentar este item para a versão oficial do produto, mantendo rastreabilidade, links, evidências e responsáveis.',
    ''
  ];
  const sections={
    'Resumo executivo do produto':['## Proposta','Problema resolvido, público, benefício central, módulos e resultado esperado.'],
    'Requisitos, escopo e funcionalidades':['## Escopo funcional','Módulos, funcionalidades, entradas, saídas, integrações, critérios de aceite e itens fora de escopo.','', '## Requisitos não funcionais','Segurança, desempenho, acessibilidade, compatibilidade, disponibilidade, backup e observabilidade.'],
    'Arquitetura e estrutura de software':['## Arquitetura','Frontend, backend, banco, autenticação, armazenamento, IA, APIs, filas, cache, integrações, ambientes e deploy.','', '## Fluxo de dados','Origem, processamento, persistência, compartilhamento, retenção e descarte.'],
    'Inventário de componentes, APIs e licenças':['## Inventário','Bibliotecas, frameworks, plugins, APIs, modelos de IA, serviços externos, versões, finalidade e licença.'],
    'Segurança, LGPD e tratamento de dados':['## Segurança','Autenticação, autorização, segredos, criptografia, auditoria, logs, backup e resposta a incidentes.','', '## LGPD','Dados pessoais, finalidade, base legal quando aplicável, compartilhamentos, retenção e direitos do titular.','', '**Nota:** este documento organiza evidências e decisões; não substitui parecer jurídico quando necessário.'],
    'Plano de testes, validação e evidências':['## Estratégia','Testes unitários, integração, E2E, regressão, acessibilidade, performance, segurança e smoke tests.','', '## Evidências','Screenshots, vídeos, logs, resultados e links de execução.'],
    'Histórico de versões e changelog':['## Regra de versionamento','Uma única versão oficial aparece no catálogo. Versões anteriores ficam preservadas no dossiê.'],
    'Dossiê de autoria e propriedade intelectual':['## Titularidade','Autores, titulares, colaboradores, datas, cessões e licenças relevantes.','', '## Provas','Commits, arquivos datados, contratos, domínios, registros, protocolos e demais evidências.','', '**Importante:** organizar provas não equivale, sozinho, a registro formal de software, marca ou obra.'],
    'Registro de evidências de criação e titularidade':['## Cadeia de evidências','Ideia inicial, arquivos, commits, branches, releases, deploys, domínios, contratos, e-mails, recibos e registros formais.','', 'Sempre que possível, manter data, origem, hash/commit e cópia de segurança.'],
    'Manual técnico e operacional':['## Operação','Instalação, configuração, acesso, administração, atualização, backup, restauração, suporte e encerramento.'],
    'Plano de marketing':['## Plano','Objetivo, público, canais, mensagens, conteúdo, calendário, métricas, orçamento, testes e aprendizados.','', '## Ativos','Site, landing page, demo, screenshots, vídeos, apresentação e materiais de divulgação.'],
    'Posicionamento, público e proposta de valor':['## Posicionamento','Problema, público, categoria, diferencial, benefícios, provas, objeções e alternativas.'],
    'Plano de continuidade, backup e recuperação':['## Continuidade','Backup, restauração, recuperação de desastre, dependências críticas, RPO/RTO quando aplicável e saída de fornecedores.'],
    'Licenciamento, termos de uso e distribuição':['## Licenciamento','Permissões, restrições, propriedade de customizações, componentes de terceiros, distribuição e termos aplicáveis.','', '## Entrega','Executável/link, código quando aplicável, documentação, changelog e evidências.']
  };
  return common.concat(sections[title]||['## Conteúdo','Completar este documento para o produto.']).join('\n');
}

function dDefault(a){
  return {
    currentArtifact:'',
    versions:(a.history||[]).map((h,i)=>({id:'legacy-'+i+'-'+Date.now(),label:typeof h==='string'?h:(h.label||h.version||('Versão '+(i+1))),date:'',url:'',artifact:'',notes:'Importado do histórico existente.'})),
    docs:DOSSIER_DOCS.map(([title,category],i)=>({id:'doc-'+i+'-'+Date.now(),title,category,status:'base',link:'',updatedAt:dNow(),content:dDocBody(a,title,category)})),
    rights:{owner:'LAMOU IA',creationDate:'',repo:'',sourceArchive:'',registrations:'',trademark:'',licenses:'',notes:''},
    evidence:[],
    shares:[]
  };
}
function dEnsure(a){
  if(!a.dossier)a.dossier=dDefault(a);
  const d=a.dossier;
  d.versions=Array.isArray(d.versions)?d.versions:[];
  d.docs=Array.isArray(d.docs)?d.docs:[];
  d.evidence=Array.isArray(d.evidence)?d.evidence:[];
  d.shares=Array.isArray(d.shares)?d.shares:[];
  d.rights=d.rights||dDefault(a).rights;
  return d;
}
function dSummary(a){
  const d=dEnsure(a),r=d.rights;
  return [
    '# Dossiê — '+a.name,'',
    'Versão atual: '+a.version,
    'Status: '+statusLabel(a.status),
    'URL oficial: '+(a.url||'A definir'),
    'Pacote/arquivo: '+(d.currentArtifact||'A definir'),
    'CORE: '+a.core+'%','',
    '## Direitos e titularidade',
    'Titular/autoria: '+(r.owner||'A definir'),
    'Repositório: '+(r.repo||'A definir'),
    'Registros/referências: '+(r.registrations||'A definir'),'',
    '## Documentos',
    ...d.docs.map(x=>'- '+x.title+' — '+x.status+(x.link?' — '+x.link:'')),'',
    '## Versões anteriores',
    ...(d.versions.length?d.versions.map(v=>'- '+v.label+(v.date?' ('+v.date+')':'')+(v.url?' — '+v.url:'')):['- Nenhuma'])
  ].join('\n');
}
function dMail(a,itemType,itemTitle,subject,body){
  const email=prompt('E-mail do destinatário:','');
  if(!email)return;
  if(!/^\S+@\S+\.\S+$/.test(email))return toast('Informe um e-mail válido.');
  const d=dEnsure(a);
  d.shares.unshift({id:crypto.randomUUID(),when:dNow(),email,itemType,itemTitle,status:'Preparado no cliente de e-mail'});
  saveState();
  audit('Compartilhamento preparado',a.name+' • '+itemTitle+' • '+email);
  location.href='mailto:'+encodeURIComponent(email)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body.slice(0,5000));
}

function appCard(a){
  const d=dEnsure(a);
  return `<article class="app-card"><div class="app-cover" style="background:${a.color}"><span class="badge-official">OFICIAL</span><div class="app-mark">${dEsc(a.mark)}</div><div class="app-title"><h3>${dEsc(a.name)}</h3><small>${dEsc(a.category)}</small></div></div><div class="card-body"><p>${dEsc(a.desc)}</p><div class="tags">${a.tags.map(t=>`<span class="tag">${dEsc(t)}</span>`).join('')}</div><div class="card-meta"><span class="status">${statusDot(a.status)}</span><span>${dEsc(a.version)}</span></div><div class="card-meta"><span>${d.docs.length} documentos</span><span>${d.versions.length} versão(ões) anterior(es)</span></div><div class="card-actions"><button class="btn primary small" data-manage="${a.id}">Abrir dossiê</button><button class="btn small" data-open="${a.id}">${a.url?'Abrir aplicativo':'Versão atual'}</button></div></div></article>`;
}
function manageApp(id){dRender(id,'overview')}

function dShell(a,tab){
  const tabs=[['overview','Visão geral'],['versions','Versões'],['docs','Documentos'],['rights','Direitos & provas'],['structure','Estrutura'],['marketing','Marketing'],['shares','Envios']];
  modalTitle.textContent=a.name+' — Dossiê';
  modalBody.innerHTML=`<div class="dossier-head"><div><span class="official-badge">DOSSIÊ DO PRODUTO</span><h3>${dEsc(a.name)}</h3><p>Informação técnica e documental. Área independente do Comercial.</p></div><div class="dossier-quick"><button class="btn small" id="dDownAll">Baixar resumo</button><button class="btn small" id="dSendAll">Enviar resumo</button>${a.url?'<button class="btn primary small" id="dOpenCurrent">Abrir atual</button>':''}</div></div><div class="dossier-tabs">${tabs.map(([k,n])=>`<button class="dossier-tab ${k===tab?'active':''}" data-dtab="${k}">${n}</button>`).join('')}</div><div id="dossierPanel"></div>`;
  showModal();
  $$('[data-dtab]').forEach(b=>b.onclick=()=>dRender(a.id,b.dataset.dtab));
  dDownAll.onclick=()=>dDownload(dSlug(a.name)+'-dossie.md',dSummary(a));
  dSendAll.onclick=()=>dMail(a,'Dossiê','Resumo do dossiê',a.name+' — dossiê',dSummary(a));
  if($('#dOpenCurrent'))dOpenCurrent.onclick=()=>openOfficial(a.id);
}
function dRender(id,tab='overview'){
  const a=dApp(id);if(!a)return;dEnsure(a);dShell(a,tab);
  if(tab==='overview')dOverview(a);
  if(tab==='versions')dVersions(a);
  if(tab==='docs')dDocs(a);
  if(tab==='rights')dRights(a);
  if(tab==='structure')dGroup(a,'Estrutura');
  if(tab==='marketing')dGroup(a,'Marketing');
  if(tab==='shares')dShares(a);
}
function dOverview(a){
  const d=dEnsure(a),final=d.docs.filter(x=>x.status==='final').length;
  dossierPanel.innerHTML=`<div class="dossier-stats"><div class="stat"><small>Versão atual</small><b>${dEsc(a.version)}</b><em>${statusLabel(a.status)}</em></div><div class="stat"><small>Versões preservadas</small><b>${d.versions.length}</b><em>Histórico interno</em></div><div class="stat"><small>Documentos</small><b>${d.docs.length}</b><em>${final} finalizado(s)</em></div><div class="stat"><small>Envios registrados</small><b>${d.shares.length}</b><em>Documento/versão/e-mail</em></div></div><div class="grid2"><div class="box"><h3>Versão oficial atual</h3><div class="field"><label>Versão</label><input id="dv" value="${dEsc(a.version)}"></div><div class="form-grid" style="margin-top:8px"><div class="field"><label>Status</label><select id="ds"><option value="live">Publicado</option><option value="dev">Em desenvolvimento</option><option value="plan">Planejado</option><option value="issue">Atenção</option></select></div><div class="field"><label>CORE (%)</label><input id="dc" type="number" min="0" max="100" value="${a.core}"></div></div><div class="field" style="margin-top:8px"><label>URL oficial / executável</label><input id="du" value="${dEsc(a.url||'')}"></div><div class="field" style="margin-top:8px"><label>Link do pacote/arquivo para download</label><input id="da" value="${dEsc(d.currentArtifact||'')}"></div><button class="btn primary" id="dSaveOverview" style="margin-top:10px">Salvar versão atual</button></div><div class="box"><h3>Conteúdo do dossiê</h3><p>Versões, documentos, arquitetura, propriedade intelectual, evidências, marketing, links, arquivos e histórico de compartilhamento. Sem lead, cliente, MRR ou proposta.</p><div class="metric"><span>Links de documentos</span><b>${d.docs.filter(x=>x.link).length}</b></div><div class="metric"><span>Evidências</span><b>${d.evidence.length}</b></div><div class="metric"><span>Titularidade</span><b>${d.rights.owner?'Configurada':'Pendente'}</b></div></div></div>`;
  ds.value=a.status;
  dSaveOverview.onclick=()=>{a.version=dv.value.trim()||a.version;a.status=ds.value;a.core=Math.max(0,Math.min(100,+dc.value||0));a.url=du.value.trim();d.currentArtifact=da.value.trim();saveState();audit('Dossiê atualizado',a.name+' • versão atual');toast('Versão atual salva.');dRender(a.id,'overview')};
}
function dVersions(a){
  const d=dEnsure(a);
  dossierPanel.innerHTML=`<div class="box dossier-current"><h3>Atual — ${dEsc(a.version)}</h3><p>${statusLabel(a.status)}${a.url?' • <a href="'+dEsc(a.url)+'" target="_blank" rel="noopener">Abrir executável</a>':''}${d.currentArtifact?' • <a href="'+dEsc(d.currentArtifact)+'" target="_blank" rel="noopener">Baixar pacote</a>':''}</p></div><div class="panel dossier-subpanel"><div class="panel-head"><div><h2>Versões anteriores</h2><p>Preservadas no histórico interno, sem duplicar produtos.</p></div><button class="btn primary small" id="dAddVersion">+ Arquivar versão</button></div><div class="dossier-list">${d.versions.length?d.versions.map(v=>`<div class="dossier-row"><div><b>${dEsc(v.label)}</b><small>${v.date?dEsc(v.date):'Data não informada'}${v.notes?' • '+dEsc(v.notes):''}</small></div><div class="row-actions">${v.url?`<button class="btn small" data-vopen="${v.id}">Abrir</button>`:''}${v.artifact?`<button class="btn small" data-vfile="${v.id}">Arquivo</button>`:''}<button class="btn small" data-vdown="${v.id}">Baixar ficha</button><button class="btn small" data-vsend="${v.id}">Enviar</button><button class="btn danger small" data-vdel="${v.id}">Excluir</button></div></div>`).join(''):'<div class="empty">Nenhuma versão anterior cadastrada.</div>'}</div></div>`;
  dAddVersion.onclick=()=>dVersionEdit(a.id);
  $$('[data-vopen]').forEach(b=>b.onclick=()=>{const v=d.versions.find(x=>x.id===b.dataset.vopen);if(v?.url)open(v.url,'_blank','noopener')});
  $$('[data-vfile]').forEach(b=>b.onclick=()=>{const v=d.versions.find(x=>x.id===b.dataset.vfile);if(v?.artifact)open(v.artifact,'_blank','noopener')});
  $$('[data-vdown]').forEach(b=>b.onclick=()=>{const v=d.versions.find(x=>x.id===b.dataset.vdown);if(v)dDownload(dSlug(a.name)+'-'+dSlug(v.label)+'.md',dVersionText(a,v))});
  $$('[data-vsend]').forEach(b=>b.onclick=()=>{const v=d.versions.find(x=>x.id===b.dataset.vsend);if(v)dMail(a,'Versão',v.label,a.name+' — '+v.label,dVersionText(a,v))});
  $$('[data-vdel]').forEach(b=>b.onclick=()=>{if(!confirm('Excluir esta versão do histórico?'))return;d.versions=d.versions.filter(x=>x.id!==b.dataset.vdel);saveState();dRender(a.id,'versions')});
}
function dVersionText(a,v){return ['# '+a.name+' — '+v.label,'','Data: '+(v.date||'Não informada'),'Executável: '+(v.url||'Não informado'),'Arquivo/pacote: '+(v.artifact||'Não informado'),'Notas: '+(v.notes||'—')].join('\n')}
function dVersionEdit(id){
  const a=dApp(id),d=dEnsure(a);modalTitle.textContent=a.name+' — Arquivar versão';modalBody.innerHTML=`<button class="btn small" id="vBack">← Voltar</button><div class="form-grid" style="margin-top:12px"><div class="field"><label>Nome/versão</label><input id="vl" placeholder="Ex.: v1.6.0"></div><div class="field"><label>Data</label><input id="vd" type="date"></div><div class="field"><label>Link executável</label><input id="vu"></div><div class="field"><label>Link do arquivo/pacote</label><input id="va"></div></div><div class="field" style="margin-top:8px"><label>Notas</label><textarea id="vn"></textarea></div><button class="btn primary" id="vSave" style="margin-top:10px">Salvar no histórico</button>`;
  vBack.onclick=()=>dRender(id,'versions');vSave.onclick=()=>{const label=vl.value.trim();if(!label)return toast('Informe a versão.');d.versions.unshift({id:crypto.randomUUID(),label,date:vd.value,url:vu.value.trim(),artifact:va.value.trim(),notes:vn.value.trim()});saveState();audit('Versão arquivada',a.name+' • '+label);dRender(id,'versions')};
}
function dDocs(a){
  const d=dEnsure(a);
  dossierPanel.innerHTML=`<div class="panel dossier-subpanel"><div class="panel-head"><div><h2>Documentação</h2><p>Todos os documentos e links pertencentes a este aplicativo.</p></div><button class="btn primary small" id="dAddDoc">+ Documento</button></div><div class="dossier-list">${d.docs.map(doc=>`<div class="dossier-row"><div><b>${dEsc(doc.title)}</b><small>${dEsc(doc.category)} • ${doc.status==='final'?'Finalizado':doc.status==='review'?'Em revisão':'Base'}${doc.link?' • Link anexado':''}</small></div><div class="row-actions">${doc.link?`<button class="btn small" data-dopen="${doc.id}">Abrir</button><button class="btn small" data-dcopy="${doc.id}">Copiar</button>`:''}<button class="btn small" data-dedit="${doc.id}">Editar</button><button class="btn small" data-ddown="${doc.id}">Baixar</button><button class="btn small" data-dsend="${doc.id}">Enviar</button></div></div>`).join('')}</div></div>`;
  dAddDoc.onclick=()=>dDocEdit(a.id,null);
  $$('[data-dedit]').forEach(b=>b.onclick=()=>dDocEdit(a.id,b.dataset.dedit));
  $$('[data-ddown]').forEach(b=>b.onclick=()=>dDocDownload(a,b.dataset.ddown));
  $$('[data-dsend]').forEach(b=>b.onclick=()=>dDocSend(a,b.dataset.dsend));
  $$('[data-dopen]').forEach(b=>b.onclick=()=>{const x=d.docs.find(y=>y.id===b.dataset.dopen);if(x?.link)open(x.link,'_blank','noopener')});
  $$('[data-dcopy]').forEach(b=>b.onclick=()=>{const x=d.docs.find(y=>y.id===b.dataset.dcopy);if(x?.link)dCopy(x.link)});
}
function dDocEdit(appId,docId){
  const a=dApp(appId),d=dEnsure(a),old=docId?d.docs.find(x=>x.id===docId):null,doc=old||{id:crypto.randomUUID(),title:'',category:'Outros',status:'base',link:'',content:'',updatedAt:dNow()};
  modalTitle.textContent=a.name+' — Documento';modalBody.innerHTML=`<button class="btn small" id="docBack">← Documentos</button><div class="form-grid" style="margin-top:12px"><div class="field"><label>Título</label><input id="dt" value="${dEsc(doc.title)}"></div><div class="field"><label>Categoria</label><input id="dg" value="${dEsc(doc.category)}"></div><div class="field"><label>Status</label><select id="dst"><option value="base">Base</option><option value="review">Em revisão</option><option value="final">Finalizado</option></select></div><div class="field"><label>Link do documento/arquivo</label><input id="dlk" value="${dEsc(doc.link||'')}"></div></div><div class="field" style="margin-top:8px"><label>Conteúdo / notas</label><textarea id="dct" class="doc-editor">${dEsc(doc.content||'')}</textarea></div><div class="row-actions" style="margin-top:10px"><button class="btn primary" id="docSave">Salvar</button>${old?'<button class="btn danger" id="docDelete">Excluir</button>':''}</div>`;
  dst.value=doc.status;docBack.onclick=()=>dRender(appId,'docs');docSave.onclick=()=>{doc.title=dt.value.trim();if(!doc.title)return toast('Informe o título.');doc.category=dg.value.trim()||'Outros';doc.status=dst.value;doc.link=dlk.value.trim();doc.content=dct.value;doc.updatedAt=dNow();if(!old)d.docs.push(doc);saveState();audit('Documento atualizado',a.name+' • '+doc.title);dRender(appId,'docs')};if(old)docDelete.onclick=()=>{if(!confirm('Excluir este documento?'))return;d.docs=d.docs.filter(x=>x.id!==doc.id);saveState();dRender(appId,'docs')};
}
function dDocDownload(a,id){const doc=dEnsure(a).docs.find(x=>x.id===id);if(doc)dDownload(dSlug(a.name)+'-'+dSlug(doc.title)+'.md',doc.content||('# '+doc.title+'\n\n'+(doc.link||'')))}
function dDocSend(a,id){const doc=dEnsure(a).docs.find(x=>x.id===id);if(doc)dMail(a,'Documento',doc.title,a.name+' — '+doc.title,(doc.content||'')+'\n\nLink: '+(doc.link||'Não informado'))}
function dRights(a){
  const d=dEnsure(a),r=d.rights;
  dossierPanel.innerHTML=`<div class="grid2"><div class="box"><h3>Direitos e titularidade</h3><div class="field"><label>Autor/titular principal</label><input id="ro" value="${dEsc(r.owner||'')}"></div><div class="field" style="margin-top:8px"><label>Data/marco inicial</label><input id="rc" value="${dEsc(r.creationDate||'')}"></div><div class="field" style="margin-top:8px"><label>Repositório principal</label><input id="rr" value="${dEsc(r.repo||'')}"></div><div class="field" style="margin-top:8px"><label>Arquivo-fonte / backup imutável</label><input id="ra" value="${dEsc(r.sourceArchive||'')}"></div><div class="field" style="margin-top:8px"><label>Registros / protocolos / referências</label><textarea id="rg">${dEsc(r.registrations||'')}</textarea></div><div class="field" style="margin-top:8px"><label>Marca / nome / protocolos</label><textarea id="rt">${dEsc(r.trademark||'')}</textarea></div><div class="field" style="margin-top:8px"><label>Licenças / cessões</label><textarea id="rl">${dEsc(r.licenses||'')}</textarea></div><div class="field" style="margin-top:8px"><label>Observações</label><textarea id="rn">${dEsc(r.notes||'')}</textarea></div><button class="btn primary" id="rSave" style="margin-top:10px">Salvar</button></div><div class="box"><h3>Evidências de criação e titularidade</h3><p>Commit, release, documento datado, contrato, registro, domínio, e-mail, recibo ou arquivo com hash.</p><div class="form-grid"><div class="field"><label>Descrição</label><input id="el"></div><div class="field"><label>Link / referência</label><input id="eu"></div></div><button class="btn small" id="eAdd" style="margin-top:8px">+ Evidência</button><div class="dossier-list compact-list">${d.evidence.length?d.evidence.map(e=>`<div class="dossier-row"><div><b>${dEsc(e.label)}</b><small>${dDate(e.when)}</small></div><div class="row-actions"><button class="btn small" data-eopen="${e.id}">Abrir</button><button class="btn danger small" data-edel="${e.id}">Excluir</button></div></div>`).join(''):'<div class="empty">Nenhuma evidência cadastrada.</div>'}</div><p class="legal-note">Este módulo organiza evidências. Não equivale sozinho a registro formal de software, marca ou obra.</p></div></div>`;
  rSave.onclick=()=>{Object.assign(r,{owner:ro.value.trim(),creationDate:rc.value.trim(),repo:rr.value.trim(),sourceArchive:ra.value.trim(),registrations:rg.value.trim(),trademark:rt.value.trim(),licenses:rl.value.trim(),notes:rn.value.trim()});saveState();audit('Direitos atualizados',a.name);toast('Titularidade salva.')};
  eAdd.onclick=()=>{const label=el.value.trim(),url=eu.value.trim();if(!label||!url)return toast('Informe descrição e link.');d.evidence.unshift({id:crypto.randomUUID(),label,url,when:dNow()});saveState();dRender(a.id,'rights')};
  $$('[data-eopen]').forEach(b=>b.onclick=()=>{const e=d.evidence.find(x=>x.id===b.dataset.eopen);if(e?.url)open(e.url,'_blank','noopener')});
  $$('[data-edel]').forEach(b=>b.onclick=()=>{d.evidence=d.evidence.filter(x=>x.id!==b.dataset.edel);saveState();dRender(a.id,'rights')});
}
function dGroup(a,category){
  const docs=dEnsure(a).docs.filter(x=>x.category===category);
  dossierPanel.innerHTML=`<div class="panel dossier-subpanel"><div class="panel-head"><div><h2>${category}</h2><p>${category==='Marketing'?'Plano, posicionamento e materiais do produto.':'Arquitetura, componentes, APIs, integrações e licenças.'}</p></div></div><div class="dossier-list">${docs.map(doc=>`<div class="dossier-row"><div><b>${dEsc(doc.title)}</b><small>${doc.status==='final'?'Finalizado':doc.status==='review'?'Em revisão':'Base'}${doc.link?' • Link anexado':''}</small></div><div class="row-actions"><button class="btn small" data-gedit="${doc.id}">Editar</button><button class="btn small" data-gdown="${doc.id}">Baixar</button><button class="btn small" data-gsend="${doc.id}">Enviar</button></div></div>`).join('')}</div></div>`;
  $$('[data-gedit]').forEach(b=>b.onclick=()=>dDocEdit(a.id,b.dataset.gedit));
  $$('[data-gdown]').forEach(b=>b.onclick=()=>dDocDownload(a,b.dataset.gdown));
  $$('[data-gsend]').forEach(b=>b.onclick=()=>dDocSend(a,b.dataset.gsend));
}
function dShares(a){
  const d=dEnsure(a);
  dossierPanel.innerHTML=`<div class="panel dossier-subpanel"><div class="panel-head"><div><h2>Histórico de compartilhamento</h2><p>Registra o que foi preparado para envio, destinatário e data. A Central local não consegue confirmar a entrega final do provedor de e-mail.</p></div></div><div class="tablewrap"><table class="table"><thead><tr><th>Quando</th><th>Tipo</th><th>Item</th><th>Destinatário</th><th>Status</th></tr></thead><tbody>${d.shares.length?d.shares.map(s=>`<tr><td>${dDate(s.when)}</td><td>${dEsc(s.itemType)}</td><td>${dEsc(s.itemTitle)}</td><td>${dEsc(s.email)}</td><td>${dEsc(s.status)}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">Nenhum compartilhamento registrado.</td></tr>'}</tbody></table></div></div>`;
}

if(typeof renderApps==='function')renderApps();