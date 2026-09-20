export type LabReadingLevel = "essential" | "intermediate" | "technical";

export type LabScreenKey =
  | "lab"
  | "testes"
  | "validation"
  | "cube"
  | "architectures"
  | "database"
  | "simulations"
  | "personas"
  | "evidence"
  | "metrics"
  | "model"
  | "compare"
  | "prediction"
  | "campaigns"
  | "council"
  | "registry"
  | "scheduler"
  | "history"
  | "audit"
  | "self"
  | "result";

export interface LabScreenSpec {
  key: LabScreenKey;
  index: string;
  label: string;
  simple: string;
  why: string;
  known: string;
  pending: string;
  next: string;
  technical: string;
}

export const LAB_CANONICAL_SCREENS: LabScreenSpec[] = [
  {
    key: "lab",
    index: "01",
    label: "LAB",
    simple: "Escolha o que você quer investigar e comece pela pergunta, não pela tecnologia.",
    why: "Mantém o experimento compreensível e evita combinar mudanças demais antes de existir hipótese.",
    known: "SOL permanece referência operacional; LUA concentra experiências e candidates.",
    pending: "Runners externos e conectores de pesquisa permanecem dependentes de binding real.",
    next: "Escolha uma família, um objeto e uma pergunta de teste.",
    technical:
      "Orquestra identidade do teste, baseline, target, evidence lineage e handoff ao Validation Gate.",
  },
  {
    key: "testes",
    index: "02",
    label: "Testes",
    simple: "Catálogo de testes estruturados e Meus Testes.",
    why: "Transforma problema ou hipótese em um protocolo reproduzível.",
    known: "Existem suites funcionais, industriais, CORE Cubo, segurança, IA, UAT e regressão.",
    pending: "Nem todos os testes possuem runner real ou evidência de produção.",
    next: "Abra um teste existente ou crie um novo em Meus Testes.",
    technical:
      "Test schema inclui target, objective, questions, criteria, baseline, metrics, evidence, version e truth-state.",
  },
  {
    key: "validation",
    index: "03",
    label: "Validation",
    simple:
      "Confere se o teste está pronto antes de rodar e se a evidência sustenta a conclusão depois.",
    why: "Evita PASS falso, target errado, evidência incompleta ou resultado sem integridade.",
    known: "G0–G11, Evidence Requirements e gates já fazem parte da arquitetura.",
    pending: "Gate executável depende do runner e repositório de evidências conectados.",
    next: "Cheque baseline, oracle, versão, evidência obrigatória e reverse path.",
    technical:
      "Pre-run + post-run, target/version/hash binding, rerun independente e Evidence Pack.",
  },
  {
    key: "cube",
    index: "04",
    label: "Cubo Mágico",
    simple: "Visão multidimensional do mesmo conjunto de dados e relações.",
    why: "Permite testar se outra organização melhora recuperação, contexto, rastreabilidade ou decisão.",
    known:
      "Existe como arquitetura experimental isolada em LUA e possui benchmark local sintético.",
    pending: "Não existe promoção automática nem superioridade universal comprovada.",
    next: "Compare com o baseline usando a mesma entrada, oracle e janela.",
    technical:
      "Working-set retrieval, células, caminho, ranking, lineage, tenant isolation e mídia referenciada.",
  },
  {
    key: "architectures",
    index: "05",
    label: "Arquiteturas LAB",
    simple:
      "Compare formas diferentes de organizar e recuperar estado sem contaminar o CORE oficial.",
    why: "Uma arquitetura pode melhorar uma métrica e piorar outra; o LAB precisa mostrar trade-offs.",
    known:
      "Planilha/Standard, Cubo, Cubo Mágico, Prisma, Snapshot, Fantasma, Relação, Caleidoscópio e Pirâmide.",
    pending: "Família integrada só deve ser testada depois de ablações suficientes.",
    next: "Escolha baseline e uma única mudança arquitetural.",
    technical:
      "One-change-at-a-time, ablation sequence, same oracle/window/input, delta + evidence.",
  },
  {
    key: "database",
    index: "06",
    label: "Banco de Dados",
    simple:
      "Escolha quais dados o teste usa e deixe claro se são reais, sintéticos, externos ou derivados.",
    why: "Resultado só é interpretável quando origem, escala, versão e proveniência do dado são conhecidas.",
    known: "Fixtures sintéticas e datasets locais já existem.",
    pending: "Fontes reais autorizadas variam por ambiente e não podem ser presumidas.",
    next: "Selecione fonte, escala, mídia, seed e versão.",
    technical:
      "Dataset ID, hash, provenance, consent, tenant scope, schema/version e replay lineage.",
  },
  {
    key: "simulations",
    index: "07",
    label: "Simulações",
    simple: "Rode cenários controlados antes de expor produção a risco.",
    why: "Permite testar falhas, SAFE, replay e cenários extremos com reversibilidade.",
    known: "A/B/C/D-SAFE, shadow, dry-run, mock e replay fazem parte do modelo.",
    pending: "Fault injection em produção exige autorização explícita e ambiente apropriado.",
    next: "Defina cenário, falha, seed, cleanup e reverse path.",
    technical:
      "Sandbox-first, deterministic seeds, fault catalog, SAFE route and reproducible cleanup.",
  },
  {
    key: "personas",
    index: "08",
    label: "Pessoas · Personas · UAT",
    simple: "Teste comportamento com personas sintéticas ou UAT humano autorizado.",
    why: "Uma solução pode funcionar tecnicamente e falhar para pessoas, papéis ou contextos específicos.",
    known: "Teste³ IA, Persona Lab e Quest 360 fazem parte do ecossistema.",
    pending: "Persona sintética nunca representa automaticamente uma pessoa real.",
    next: "Selecione papéis, jornada, contexto e tipo de avaliação.",
    technical:
      "Persona provenance, synthetic/real separation, tasks, journey, segmentation and UAT evidence.",
  },
  {
    key: "evidence",
    index: "09",
    label: "Evidências · Estudos · Scout",
    simple: "Reúna evidência interna, estudos e descobertas externas sem misturar fonte com prova.",
    why: "Pesquisa pode sugerir hipótese, mas não prova que o resultado vale no seu ambiente.",
    known: "Research Scout possui work order de matching e handoff para o LAB.",
    pending: "Monitoramento externo contínuo depende de fontes conectadas.",
    next: "Adicione conhecimento, classifique a fonte e vincule a uma hipótese/teste.",
    technical:
      "Evidence provenance, EXTERNAL vs MEASURED, source quality, DOI/URL, snapshot/hash when permitted.",
  },
  {
    key: "metrics",
    index: "10",
    label: "Métricas & Analytics",
    simple: "Meça resultado técnico, científico e eficácia do próprio teste.",
    why: "Sem métrica, melhoria vira impressão.",
    known:
      "Efetividade, eficiência, eficácia, reality alignment, risco e cobertura de evidência estão definidos.",
    pending: "Algumas métricas só podem ser calculadas quando houver dados medidos.",
    next: "Escolha métrica primária, secundárias, baseline, unidade e tolerância.",
    technical:
      "p50/p95/p99, precision/recall/F1, drift, false PASS/FAIL, throughput, cost and reproducibility.",
  },
  {
    key: "model",
    index: "11",
    label: "Modelo de Teste",
    simple: "Escolha o desenho experimental que realmente consegue responder a pergunta.",
    why: "Comparação errada pode produzir conclusão causal falsa.",
    known: "Baseline simples e uma mudança por vez são as regras preferenciais.",
    pending: "Experimentos multifatoriais precisam justificar desenho e poder estatístico.",
    next: "Defina variável, controle, oracle, amostra, janela e ablação.",
    technical:
      "A/B/C/D-SAFE, ablation, replay, paired comparison, DOE quando justificado e falsification criteria.",
  },
  {
    key: "compare",
    index: "12",
    label: "Comparar",
    simple: "Veja lado a lado baseline, candidate, arquitetura, provider ou período.",
    why: "Evita declarar um vencedor geral quando existem trade-offs.",
    known: "SOL × LUA e arquiteturas experimentais possuem contrato de comparação.",
    pending: "Comparação real depende de mesmas entradas, versões e métricas.",
    next: "Fixe baseline, selecione braço e escolha métricas.",
    technical:
      "Same input/oracle/window, delta, confidence, trade-off matrix and evidence references.",
  },
  {
    key: "prediction",
    index: "13",
    label: "Predição & Antecipação",
    simple: "Teste se um sinal consegue antecipar um problema com antecedência útil.",
    why: "Antecipar sem controlar falsos alarmes pode criar mais ruído do que valor.",
    known: "Lead time, misses, false alarms, drift e calibração estão previstos.",
    pending: "Previsão nunca deve aparecer como fato observado.",
    next: "Defina janela, threshold, custo do falso alerta e custo do miss.",
    technical:
      "Calibration, precision/recall over time, drift, lead-time distribution and uncertainty.",
  },
  {
    key: "campaigns",
    index: "14",
    label: "Campanhas",
    simple: "Agrupe testes que sustentam uma mesma decisão, release ou hipótese.",
    why: "Dá visão de cobertura sem apagar o truth-state de cada teste.",
    known: "Campanhas podem reunir regressão, segurança, arquitetura e UAT.",
    pending: "Status da campanha precisa ser derivado dos runs, não digitado como verdade.",
    next: "Agrupe testes obrigatórios, opcionais e bloqueados.",
    technical: "Campaign status derived from child runs; no campaign-level truth override.",
  },
  {
    key: "council",
    index: "15",
    label: "Conselho Profissional",
    simple: "Use especialistas diferentes para desafiar método, risco, dado e interpretação.",
    why: "Cada lente encontra um tipo de falha que outra pode não perceber.",
    known:
      "Produto, software, UX, dados, QA, segurança, pesquisa e pedagogia já possuem checklists locais.",
    pending: "Provider externo do Conselho não deve ser fingido como conectado.",
    next: "Escolha as lentes adequadas ao risco do teste.",
    technical:
      "Council recommends; never overwrites oracle, evidence, truth-state or promotion gate.",
  },
  {
    key: "registry",
    index: "16",
    label: "Registry & Documentos",
    simple: "Saiba qual documento é CURRENT e qual versão exata foi usada como PINNED.",
    why: "Sem versionamento, auditoria muda quando o documento atual muda.",
    known: "CURRENT, PINNED, FROZEN e CANDIDATE fazem parte da governança.",
    pending: "Bindings físicos precisam ser comprovados em cada consumidor.",
    next: "Fixe versão, hash e documento usado no teste.",
    technical:
      "Canonical ID stable; location/filename mutable; evidence always references pinned versions.",
  },
  {
    key: "scheduler",
    index: "17",
    label: "Programados",
    simple: "Fila de testes e revalidações que precisam acontecer novamente.",
    why: "Evidência pode expirar quando muda versão, provider, modelo, schema ou processo.",
    known: "Reteste, regressão, drift check e expiração estão modelados.",
    pending: "Agendado não significa executado.",
    next: "Defina gatilho, janela, dono e condição de revalidação.",
    technical: "Scheduler state remains planned until runner evidence exists.",
  },
  {
    key: "history",
    index: "18",
    label: "Histórico",
    simple: "Memória auditável de teste, configuração, resultado e mudança.",
    why: "Permite saber se melhorou, regrediu ou apenas mudou a régua.",
    known: "Replay e snapshots fazem parte da arquitetura.",
    pending: "Persistência multiusuário precisa de backend auditável.",
    next: "Abra uma execução e reproduza configuração, versão e dataset.",
    technical:
      "Append-only history, run identity, evidence lineage, replay contract and immutable snapshots.",
  },
  {
    key: "audit",
    index: "19",
    label: "Auditoria & Segurança",
    simple: "Confirme quem fez o quê, com qual permissão e em qual ambiente.",
    why: "Resultado perde valor se não houver integridade, isolamento e trilha de auditoria.",
    known: "RBAC, tenant isolation, secrets, LGPD e hashes fazem parte do modelo.",
    pending: "Declaração de UI não substitui enforcement server-side.",
    next: "Cheque acesso, tenant, segredo, consentimento, hash e auditoria.",
    technical:
      "Identity, authorization, tenant scope, evidence integrity, immutable logs and policy enforcement.",
  },
  {
    key: "self",
    index: "20",
    label: "Meta-Validation",
    simple: "O LAB testa a própria capacidade de encontrar erros conhecidos.",
    why: "Se o LAB não detecta um defeito plantado, sua confiança deve cair.",
    known: "Seeded defects, false PASS e false FAIL estão definidos.",
    pending: "Meta-validation dinâmica completa depende de runners reais.",
    next: "Plante falha conhecida em sandbox e confira detecção.",
    technical:
      "Reliability score is evidence-dependent; seeded defect miss must reduce confidence.",
  },
  {
    key: "result",
    index: "21",
    label: "Resultado Geral",
    simple:
      "Síntese final do que foi provado, falhou, ficou pendente e precisa ser testado depois.",
    why: "Conclusão sem trilha de evidência vira opinião.",
    known: "Resultado Geral é view derivada, nunca source-of-truth primário.",
    pending: "NOT_VERIFIED continua pendente mesmo se indicadores positivos existirem.",
    next: "Use somente depois de abrir evidências, métricas, Validation e comparação.",
    technical:
      "Aggregates run/evidence/findings/trade-offs/retest/efficacy without mutating source truth.",
  },
];

export interface EvolutionRow {
  id: string;
  item: string;
  type: string;
  priority: "P0" | "P1" | "P2" | "P3";
  current: number;
  withExisting: number;
  withEvolution: number;
  decision: string;
  situation: string;
  existing: string;
  evolution: string;
  next: string;
  truth: string;
}

export const EVOLUTION_ROWS: EvolutionRow[] = [
  {
    id: "LAB-EVO-001",
    item: "LAMOU Lab",
    type: "Programa / laboratório",
    priority: "P1",
    current: 59,
    withExisting: 78,
    withEvolution: 88,
    decision: "MELHORAR",
    situation: "Base funcional existe; parte importante ainda depende de dados/runners conectados.",
    existing: "Validation Gate, métricas, casos industriais, Cubo, meta-validation e histórico.",
    evolution: "Conectar evidência real autorizada e consolidar 21 telas com execução guiada.",
    next: "Usar o LAB para validar toda melhoria antes de promover.",
    truth: "PARTIAL",
  },
  {
    id: "LAB-EVO-002",
    item: "Research Scout",
    type: "Pesquisa / radar",
    priority: "P1",
    current: 43,
    withExisting: 65,
    withEvolution: 82,
    decision: "MELHORAR",
    situation: "Work order e matching existem; fontes live continuam dependentes de conectores.",
    existing: "Potential Fit, handoff ao LAB e comparação de hipótese humana × IA.",
    evolution: "Fontes autorizadas + rastreabilidade + matching contínuo + criação de experimento.",
    next: "Enviar descoberta validada como hipótese de teste, nunca como prova.",
    truth: "NOT_CONNECTED",
  },
  {
    id: "LAB-EVO-003",
    item: "Build Auditor",
    type: "Governança / release",
    priority: "P2",
    current: 80,
    withExisting: 92,
    withEvolution: 94,
    decision: "MELHORAR",
    situation: "Motor existe; precisa ser rotina automática por release.",
    existing: "Manifestos, hashes, gates e Evidence Pack.",
    evolution: "Binding automático commit → build → evidência → gate.",
    next: "Anexar Evidence Pack imutável a toda candidata relevante.",
    truth: "IMPLEMENTED_VERIFIED",
  },
  {
    id: "LAB-EVO-004",
    item: "IA / Gateway",
    type: "IA / execução",
    priority: "P2",
    current: 45,
    withExisting: 82,
    withEvolution: 90,
    decision: "CONFIGURAR",
    situation: "Roteamento e Budget Gate foram definidos; medição precisa fechar o ciclo.",
    existing: "Roteamento econômico e política de fallback.",
    evolution: "Telemetria custo/qualidade por chamada e comparação controlada de providers.",
    next: "Testar qualidade, custo e fallback no LAB antes de alterar política.",
    truth: "PARTIAL",
  },
  {
    id: "LAB-EVO-005",
    item: "Saúde por capability",
    type: "CORE / observabilidade",
    priority: "P2",
    current: 65,
    withExisting: 85,
    withEvolution: 90,
    decision: "MELHORAR",
    situation: "Status agregado pode esconder capabilities fortes e fracas.",
    existing: "Catálogo por capability e evidências locais.",
    evolution: "Health granular por capability, consumidor, teste e ambiente.",
    next: "Criar regressão por capability e não apenas por CORE inteiro.",
    truth: "PARTIAL",
  },
];

export interface TheoryNode {
  id: string;
  name: string;
  state: string;
  problem: string;
  hypothesis: string;
  falsifier: string;
  architectures: string[];
  research: string[];
  tests: string[];
  favorable: number;
  contrary: number;
  truth: string;
}

export const THEORY_MAP: TheoryNode[] = [
  {
    id: "TH-001",
    name: "Working-set contextual",
    state: "UNDER_STUDY",
    problem: "Contexto amplo pode elevar custo e reduzir foco.",
    hypothesis: "Trazer apenas o conjunto relevante reduz contexto sem perder retrieval.",
    falsifier: "Perder recall/lineage ou aumentar custo total em comparação ao baseline.",
    architectures: ["Cubo Mágico", "Snapshot"],
    research: ["Research Scout: recuperação contextual (fonte externa ainda não conectada)"],
    tests: ["CORE Cubo benchmark local", "Ablation 0→N"],
    favorable: 2,
    contrary: 0,
    truth: "SYNTHETIC",
  },
  {
    id: "TH-002",
    name: "Pattern + Delta",
    state: "HYPOTHESIS",
    problem: "Snapshots completos podem consumir memória e duplicar estado.",
    hypothesis: "Base + delta pode preservar recuperação reduzindo payload.",
    falsifier: "A reconstrução ficar mais lenta, frágil ou perder integridade.",
    architectures: ["Snapshot", "Prisma"],
    research: ["Pesquisa externa a conectar"],
    tests: ["Novo experimento proposto"],
    favorable: 0,
    contrary: 0,
    truth: "NOT_VERIFIED",
  },
  {
    id: "TH-003",
    name: "Relação como objeto",
    state: "UNDER_STUDY",
    problem: "Relacionamentos importantes se perdem quando ficam apenas como atributo.",
    hypothesis: "Materializar relação com histórico melhora rastreabilidade e explicação.",
    falsifier: "Aumentar complexidade sem ganho de retrieval, auditabilidade ou decisão.",
    architectures: ["Cubo da Relação", "Caleidoscópio"],
    research: ["Research Scout: graph/relational evidence (não conectado)"],
    tests: ["Cubo Relacional synthetic suite"],
    favorable: 1,
    contrary: 0,
    truth: "SYNTHETIC",
  },
  {
    id: "TH-004",
    name: "Adaptive Route com SAFE",
    state: "HYPOTHESIS",
    problem: "Uma rota fixa pode falhar em contexto degradado.",
    hypothesis: "Rota adaptativa com guardrails mantém serviço sem violar hard rules.",
    falsifier: "A adaptação ampliar permissão, mascarar falha ou piorar recuperação.",
    architectures: ["CORE Padrão", "Cubo Mágico"],
    research: ["Resilience/SAFE research intake"],
    tests: ["A/B/C/D-SAFE"],
    favorable: 0,
    contrary: 0,
    truth: "NOT_VERIFIED",
  },
];

export interface ResearchNode {
  id: string;
  title: string;
  source: string;
  quality: string;
  state: string;
  match: string[];
  fit: number | null;
  hypothesis: string;
  contradiction: string;
  suggestedTest: string;
  truth: string;
}

export const RESEARCH_MAP: ResearchNode[] = [
  {
    id: "RSC-INT-001",
    title: "Research Scout — intake de recuperação contextual",
    source: "Fonte externa ainda não conectada",
    quality: "PENDENTE",
    state: "SOURCE_NOT_CONNECTED",
    match: ["Cubo Mágico", "Snapshot", "CORE de recuperação"],
    fit: null,
    hypothesis: "Comparar working-set contextual contra baseline simples.",
    contradiction: "Sem fonte/paper conectado não existe evidência externa para citar.",
    suggestedTest: "Mesma entrada + mesmo oracle + baseline grid vs working-set.",
    truth: "NOT_CONNECTED",
  },
  {
    id: "RSC-INT-002",
    title: "Research Scout — relações e grafos",
    source: "Fonte externa ainda não conectada",
    quality: "PENDENTE",
    state: "SOURCE_NOT_CONNECTED",
    match: ["Cubo da Relação", "Caleidoscópio"],
    fit: null,
    hypothesis: "Relação materializada pode melhorar explicabilidade e rastreabilidade.",
    contradiction: "Aumento de índice/complexidade pode superar o benefício.",
    suggestedTest: "Ablation relation-object ON/OFF com mesmas tarefas e dataset.",
    truth: "NOT_CONNECTED",
  },
  {
    id: "RSC-INT-003",
    title: "Research Scout — eficiência de provider/modelo",
    source: "Benchmarks públicos a conectar",
    quality: "PENDENTE",
    state: "SOURCE_NOT_CONNECTED",
    match: ["IA / Gateway", "Provider Competition"],
    fit: null,
    hypothesis: "Roteamento por tarefa pode reduzir custo sem degradar qualidade.",
    contradiction: "Benchmark externo pode não representar workload LAMOU.",
    suggestedTest: "Comparar providers no mesmo conjunto de evals com custo/qualidade/latência.",
    truth: "NOT_CONNECTED",
  },
];

export interface RadarOpportunity {
  id: string;
  title: string;
  source: string;
  gap: string;
  current: number;
  target10: number;
  potential15: number;
  hypothesis: string;
  benefit: string;
  risk: string;
  effort: "baixo" | "médio" | "alto";
  state: string;
  test: string;
  truth: string;
}

export const RADAR_OPPORTUNITIES: RadarOpportunity[] = [
  {
    id: "RAD-001",
    title: "Conectar fontes autorizadas ao Research Scout",
    source: "Planilhão + Research Scout",
    gap: "Descoberta externa ainda não é contínua nem rastreável por fonte conectada.",
    current: 43,
    target10: 65,
    potential15: 82,
    hypothesis: "Fonte real + matching explicável acelera descoberta de experimentos úteis.",
    benefit: "Mais hipóteses qualificadas chegando ao LAB.",
    risk: "Viés de confirmação ou uso indevido de conteúdo externo.",
    effort: "alto",
    state: "INVESTIGATE",
    test: "Conector piloto com 1–2 fontes autorizadas + avaliação de precisão do matching.",
    truth: "NOT_CONNECTED",
  },
  {
    id: "RAD-002",
    title: "Evidence Pack automático por release",
    source: "Build Auditor + Version",
    gap: "Evidence Pack ainda não acompanha toda candidata de forma automática.",
    current: 80,
    target10: 92,
    potential15: 94,
    hypothesis: "Automação reduz regressão de governança e facilita reprodução.",
    benefit: "Release mais auditável com menor esforço manual.",
    risk: "Automação defeituosa pode registrar evidência incompleta como suficiente.",
    effort: "médio",
    state: "TEST_CANDIDATE",
    test: "Gerar pack em branch candidata e validar hash/commit/build/manifest.",
    truth: "PARTIAL",
  },
  {
    id: "RAD-003",
    title: "Health granular por capability",
    source: "Planilhão + CORE",
    gap: "Saúde agregada pode esconder componentes frágeis.",
    current: 65,
    target10: 85,
    potential15: 90,
    hypothesis: "Health por capability melhora diagnóstico e priorização.",
    benefit: "Menos falso verde e melhor localização de risco.",
    risk: "Mais sinais podem aumentar ruído se não houver hierarquia.",
    effort: "médio",
    state: "HYPOTHESIS",
    test: "Comparar diagnóstico agregado vs capability-level em casos conhecidos.",
    truth: "PARTIAL",
  },
  {
    id: "RAD-004",
    title: "Provider Competition com Budget Gate",
    source: "IA / Gateway",
    gap: "Política de roteamento ainda precisa de telemetria comparável.",
    current: 45,
    target10: 82,
    potential15: 90,
    hypothesis: "Roteamento por tarefa reduz custo mantendo limiar de qualidade.",
    benefit: "Controle de custo e melhor fallback.",
    risk: "Troca de provider pode causar drift de qualidade ou comportamento.",
    effort: "médio",
    state: "LAB_ONLY",
    test: "Mesmo eval set em providers/modelos com custo, latência e qualidade.",
    truth: "NOT_VERIFIED",
  },
  {
    id: "RAD-005",
    title: "Windows E2E completo do LAB",
    source: "Planilhão + QA",
    gap: "Alguns ciclos antigos eram locais/offline e não provavam integração completa.",
    current: 59,
    target10: 78,
    potential15: 88,
    hypothesis: "E2E do executável fecha lacuna entre build e uso real.",
    benefit: "Mais confiança no pacote entregue ao Owner.",
    risk: "Ambiente local específico pode não representar todas as máquinas.",
    effort: "baixo",
    state: "TEST_CANDIDATE",
    test: "Build Windows + launch + navigation + smoke de 21 telas.",
    truth: "PARTIAL",
  },
];

export const ARCHITECTURE_EVOLUTION = [
  "Planilha / Standard",
  "CORE Padrão / SOL",
  "Cubo",
  "Cubo Mágico",
  "Multi-Cubo",
  "Prisma",
  "Snapshot / Delta",
  "Fantasma",
  "Cubo da Relação",
  "Caleidoscópio",
  "Triângulo / Pirâmide",
  "Família Integrada",
] as const;

export const TEST_FAMILIES = [
  "Testes LAMOU criados",
  "Arquitetura / Ciência",
  "Pessoas / Persona / UAT",
  "Sistema / Plataforma / App",
  "IA / Modelo",
  "Segurança / Privacidade / Resiliência",
  "Hardware / Equipamento / Industrial",
  "Humano / Usabilidade / Acessibilidade",
  "Aleatório / Exploração",
  "Meus Testes",
] as const;

export const MY_TEST_FIELDS = [
  "test_id",
  "nome",
  "objeto",
  "target",
  "target_type",
  "objetivo",
  "problema",
  "hipótese",
  "pergunta_principal",
  "perguntas_secundárias",
  "critérios",
  "métricas",
  "evidências_obrigatórias",
  "cenário",
  "pré_condições",
  "dados_de_teste",
  "baseline",
  "resultado_esperado",
  "resultado_real",
  "regra_aprovação",
  "regra_reprovação",
  "criticidade",
  "severidade",
  "executor",
  "revisor",
  "ambiente",
  "versão",
  "cliente",
  "produto",
  "aplicativo",
  "CORE",
  "capability",
  "provider",
  "persona",
  "runner",
  "reteste_de",
  "eficácia",
  "truth_state",
] as const;
