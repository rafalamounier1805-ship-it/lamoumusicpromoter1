/* LAMOU IA — navegação contextual por empresa */
const legacyCompanyWorkspace = companyWorkspace;
const legacyCompanyTabContent = companyTabContent;
const legacyMeetingsView = meetingsView;

const COMPANY_NAV = [
  ['overview','⌂','Visão geral'],
  ['meetings','◷','Reuniões'],
  ['diagnostics','◎','Diagnóstico 360'],
  ['projects','◇','Projetos'],
  ['actions','✓','Planos de ação'],
  ['indicators','↗','Indicadores'],
  ['resources','▣','Recursos & arquivos'],
  ['evidence','◫','Evidências'],
  ['presentations','▤','Apresentações']
];

function companyGo(tab){
  companyTab=tab;
  view='companies';
  activeMeeting=null;
  stopTimer();
  toggleMenu(false);
  render();
}

function exitCompany(dest='companies'){
  selectedCompany=null;
  companyTab='overview';
  activeMeeting=null;
  stopTimer();
  view=dest;
  localStorage.removeItem('lamou360_active_company');
  render();
}

function switchCompanyContext(id){
  if(!id)return exitCompany('companies');
  selectedCompany=id;
  companyTab='overview';
  activeMeeting=null;
  stopTimer();
  view='companies';
  localStorage.setItem('lamou360_active_company',id);
  render();
  toast(`Empresa ativa: ${company(id)?.name||''}`);
}

openCompany = function(id){
  selectedCompany=id;
  view='companies';
  companyTab='overview';
  activeMeeting=null;
  localStorage.setItem('lamou360_active_company',id);
  render();
};

openMeeting = function(id){
  activeMeeting=id;
  view='meetings';
  const m=state.meetings.find(x=>x.id===id);
  if(m?.companyId){
    selectedCompany=m.companyId;
    localStorage.setItem('lamou360_active_company',m.companyId);
  }
  meetingStartedAt=Date.now();
  render();
};

renderNav = function(){
  const nav=document.getElementById('nav');
  const search=document.getElementById('globalSearch');
  if(selectedCompany){
    const c=company(selectedCompany);
    if(!c){ selectedCompany=null; return renderNav(); }
    document.body.classList.add('company-mode');
    if(search) search.placeholder=`Buscar dentro de ${c.name}...`;
    const activeTab = view==='meetings' ? 'meetings' : companyTab;
    nav.innerHTML=`
      <div class="context-card">
        <button class="context-back" onclick="exitCompany('companies')">← Portfólio de empresas</button>
        <div class="context-label">EMPRESA ATIVA</div>
        <select class="company-switch" onchange="switchCompanyContext(this.value)">
          ${state.companies.map(x=>`<option value="${x.id}" ${x.id===c.id?'selected':''}>${esc(x.name)}</option>`).join('')}
        </select>
        <div class="context-meta">${esc(c.segment)} · ${esc(c.location)}</div>
        <div class="context-stats"><span>Saúde <b>${c.health}</b></span><span>Evolução <b>+${c.evolution}</b></span><span>Alertas <b>${c.alerts}</b></span></div>
      </div>
      <div class="nav-section-label">Workspace da empresa</div>
      ${COMPANY_NAV.map(([id,ico,label])=>`<button class="navbtn ${activeTab===id?'active':''}" onclick="companyGo('${id}')"><span class="navico">${ico}</span>${label}</button>`).join('')}
      <div class="nav-separator"></div>
      <button class="navbtn" onclick="openNewMeeting('${c.id}')"><span class="navico">＋</span>Nova reunião</button>
      <button class="navbtn" onclick="openCompanyImport()"><span class="navico">⇧</span>Importar dados</button>
      <button class="navbtn" onclick="exitCompany('settings')"><span class="navico">⚙</span>Configurações gerais</button>`;
  }else{
    document.body.classList.remove('company-mode');
    if(search) search.placeholder='Buscar empresa, reunião, problema...';
    nav.innerHTML=NAV.map(([id,ico,label])=>`<button class="navbtn ${view===id?'active':''}" onclick="go('${id}')"><span class="navico">${ico}</span>${label}</button>`).join('');
  }
};

companyWorkspace = function(){
  const c=company(selectedCompany);
  let html=legacyCompanyWorkspace();
  html=html.replace('<button class="btn small" onclick="selectedCompany=null;render()">← Empresas</button>','');
  html=html.replace(/<div class="tabs">[\s\S]*?<\/div>/,'');
  const label=(COMPANY_NAV.find(x=>x[0]===companyTab)||['','','Visão geral'])[2];
  return `<div class="context-breadcrumb"><button onclick="exitCompany('companies')">Empresas</button><span>›</span><b>${esc(c?.name||'')}</b><span>›</span><span>${esc(label)}</span></div>${html}`;
};

companyTabContent = function(c,t){
  if(t==='resources'){
    const ev=state.evidence.filter(x=>x.companyId===c.id);
    const ms=state.meetings.filter(x=>x.companyId===c.id);
    const ps=state.projects.filter(x=>x.companyId===c.id);
    const pres=state.presentations.filter(x=>x.companyId===c.id);
    return `<div class="grid split">
      <div class="grid">
        <div class="card"><div class="section-title"><h2>Recursos da empresa</h2><button class="btn small primary" onclick="openCompanyImport()">⇧ Importar arquivo</button></div>
          <div class="resource-grid">
            <div class="resource-stat"><b>${ev.length}</b><span>Arquivos / evidências</span></div>
            <div class="resource-stat"><b>${ms.length}</b><span>Reuniões</span></div>
            <div class="resource-stat"><b>${ps.length}</b><span>Projetos</span></div>
            <div class="resource-stat"><b>${pres.length}</b><span>Apresentações</span></div>
          </div>
        </div>
        <div class="card"><h2>Ações rápidas</h2><div class="actions">
          <button class="btn primary" onclick="openNewMeeting('${c.id}')">◉ Nova reunião</button>
          <button class="btn" onclick="companyTab='diagnostics';render()">◎ Abrir diagnóstico</button>
          <button class="btn" onclick="openCompanyImport()">⇧ Adicionar evidência</button>
        </div></div>
      </div>
      <div class="card"><div class="section-title"><h2>Fontes e recursos recentes</h2><span class="badge b-blue">${ev.length} itens</span></div>
        ${ev.slice(0,8).map(e=>`<div class="need"><div><b>${esc(e.title)}</b><div class="rowsub">${esc(e.source)} · ${dateBR(e.date)}</div></div><span class="badge ${e.status==='Registrada'?'b-green':'b-yellow'}">${esc(e.status)}</span></div>`).join('')||'<div class="empty">Nenhum recurso importado ainda.</div>'}
      </div>
    </div>`;
  }
  return legacyCompanyTabContent(c,t);
};

meetingsView = function(){
  if(selectedCompany && !activeMeeting){
    const c=company(selectedCompany);
    const arr=state.meetings.filter(m=>m.companyId===selectedCompany);
    return pageHead(`Reuniões · ${esc(c?.name||'')}`,'Histórico de reuniões, decisões, evidências e próximos passos desta empresa.',`<button class="btn primary" onclick="openNewMeeting('${selectedCompany}')">◉ Nova reunião</button>`) + `<div class="card"><div class="list">${arr.map(meetingRow).join('')||'<div class="empty">Sem reuniões nesta empresa.</div>'}</div></div>`;
  }
  return legacyMeetingsView();
};

function openCompanyImport(){
  openImport();
  const sel=document.getElementById('imp_company');
  if(sel&&selectedCompany)sel.value=selectedCompany;
}

saveImport = function(){
  const cid=document.getElementById('imp_company').value,
        f=document.getElementById('imp_file').files[0],
        ctx=document.getElementById('imp_context').value.trim();
  if(!cid||!f)return toast('Selecione empresa e arquivo');
  state.evidence.unshift({id:uid('e'),companyId:cid,title:f.name,source:`Upload local · ${Math.round(f.size/1024)} KB`,date:today(),context:ctx||'Arquivo recebido',confidence:'A confirmar',related:'Processamento avançado ainda não ativado',status:'Arquivo recebido'});
  save();closeModal();
  if(selectedCompany){selectedCompany=cid;view='companies';companyTab='resources'}else{view='evidence'}
  render();toast('Arquivo registrado como evidência');
};

createMeeting = function(){
  const cid=document.getElementById('m_company').value,
        theme=document.getElementById('m_theme').value.trim(),
        objective=document.getElementById('m_objective').value.trim();
  if(!cid||!theme)return toast('Empresa e tema são obrigatórios');
  const cls=classifyTheme(theme),m={id:uid('m'),companyId:cid,theme,objective,date:today(),status:'Em andamento',duration:'00:00:00',notes:'',problems:[],evidences:[],hypotheses:[],indicators:cls.metrics.slice(0,1),pending:[],snapshot:false};
  state.meetings.unshift(m);save();closeModal();activeMeeting=m.id;selectedCompany=cid;view='meetings';meetingStartedAt=Date.now();localStorage.setItem('lamou360_active_company',cid);render();toast(`Tema classificado em ${cls.area}`);
};

searchGlobal = function(q){
  q=q.trim().toLowerCase();if(q.length<2)return;
  const c=state.companies.find(c=>c.name.toLowerCase().includes(q)||c.segment.toLowerCase().includes(q));
  if(c){openCompany(c.id);return}
  const pool=selectedCompany?state.meetings.filter(m=>m.companyId===selectedCompany):state.meetings;
  const m=pool.find(m=>m.theme.toLowerCase().includes(q));
  if(m){selectedCompany=m.companyId;activeMeeting=m.id;view='meetings';meetingStartedAt=Date.now();render()}
};

render();
