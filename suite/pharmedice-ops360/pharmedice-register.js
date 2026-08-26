/* PHARMÉDICE OPS 360 — registro na Central LAMOU IA */
(() => {
  const app = {
    id:'pharmedice-ops360',
    name:'PHARMÉDICE OPS 360',
    mark:'P360',
    category:'Pharma • Operações & Qualidade',
    status:'dev',
    version:'Design Lock / Integração CORE',
    color:'linear-gradient(135deg,#0d3b72,#3d7fc9)',
    desc:'Gestão operacional farmacêutica por resultados, processos, qualidade, diagnóstico, dados, IA governada e melhoria contínua.',
    url:'',
    testUrl:'./pharmedice-ops360/',
    core:86,
    history:['Especificação Mestre V6','Seed DEMO V6','V1 teste — REJEITADA visualmente','V2 redesign — REJEITADA como direção visual','Design System — EM DEFINIÇÃO'],
    tags:['Pharma','Processos','Qualidade','IA','Diagnóstico 360']
  };
  const project = {
    id:'p-pharmedice-ops360',
    name:'PHARMÉDICE OPS 360',
    area:'Pharma / Operações',
    status:'Em desenvolvimento',
    owner:'LAMOU IA',
    next:'Fechar Design System, telas-mãe, Manual do Usuário e Teste³ IA'
  };
  if (typeof state !== 'undefined' && Array.isArray(state.apps) && !state.apps.some(x=>x.id===app.id)) state.apps.push(app);
  if (typeof state !== 'undefined' && Array.isArray(state.projects) && !state.projects.some(x=>x.id===project.id)) state.projects.push(project);
  if (typeof saveState === 'function') saveState();
  if (typeof audit === 'function') audit('Produto registrado','PHARMÉDICE OPS 360 conectado à Central / CORE');
})();
