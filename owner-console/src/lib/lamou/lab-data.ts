/**
 * LAMOU Research & Theory Lab — conceitos preservados como EXPERIMENTAL / NÃO VALIDADO.
 * Nenhuma métrica aqui é probabilidade científica. As quatro métricas são separadas
 * e a plausibilidade de engenharia é sempre ESTIMATIVA HEURÍSTICA NÃO CALIBRADA.
 */
import type { TruthState } from "./council-data";

export type Metric = number | null; // null => INDETERMINADO / NOT_VERIFIED

export interface TruthMatrix {
  externalScience: Metric;
  engineeringPlausibility: Metric; // ESTIMATIVA HEURÍSTICA NÃO CALIBRADA
  lamouEvidence: Metric;
  lamouReadiness: Metric;
}

export type LabArea =
  | "software"
  | "dados-ia"
  | "industria"
  | "telecom"
  | "fisica"
  | "matematica"
  | "biologia"
  | "farmaceutica"
  | "saude"
  | "seguranca";

export const LAB_AREA_LABEL: Record<LabArea, string> = {
  software: "Software & Arquitetura",
  "dados-ia": "Dados & IA",
  industria: "Indústria & Manufatura",
  telecom: "Telecom & Fotônica",
  fisica: "Física",
  matematica: "Matemática & Modelagem",
  biologia: "Biologia & Sistemas Complexos",
  farmaceutica: "Farmacêutica / PAT / QbD / Validação",
  saude: "Saúde & Biomedicina (somente pesquisa)",
  seguranca: "Segurança & Resiliência (não ofensiva)",
};

export const AREA_GUARDRAIL: Partial<Record<LabArea, string>> = {
  saude: "Escopo pesquisa/hipótese. Nenhuma alegação clínica, diagnóstica ou terapêutica.",
  seguranca:
    "Somente detecção, resiliência, comunicações, manutenção, logística e simulação não ofensiva. Nada de projeto ou otimização de armas.",
};

export interface LabConcept {
  id: string;
  name: string;
  layer: "LUA";
  problem: string;
  mechanism: string;
  existingScience: string[];
  plausibleCombination: string;
  lamouHypothesis: string;
  risks: string[];
  falsifiers: string[];
  requiredTests: string[];
  applications: { area: LabArea; use: string }[];
  truth: TruthState;
  matrix: TruthMatrix;
  matrixNote: string;
}

export const LAB_CONCEPTS: LabConcept[] = [
  {
    id: "LAB-CUBO",
    name: "Cubo",
    layer: "LUA",
    problem:
      "Estado de um sistema é observado em fatias planas; perde-se a relação simultânea entre dimensões (tempo, contexto, dependência, evidência).",
    mechanism:
      "Representar estado como volume indexado por eixos ortogonais, permitindo cortes coerentes sem recomputar o todo.",
    existingScience: [
      "Cubos OLAP e modelagem multidimensional (literatura externa consolidada)",
      "Tensores e decomposição tensorial",
      "Bancos de séries temporais versionados",
    ],
    plausibleCombination:
      "Cubo OLAP + versionamento imutável + grafo de dependências para navegar estado com linhagem.",
    lamouHypothesis:
      "Um estado volumétrico com linhagem reduz erro de decisão ao expor contexto que a visão plana esconde.",
    risks: ["Explosão combinatória de eixos", "Custo de armazenamento", "Complexidade cognitiva"],
    falsifiers: [
      "Decisões com o Cubo não reduzem retrabalho vs. visão plana",
      "Custo por consulta cresce acima do aceitável sem ganho medido",
    ],
    requiredTests: [
      "Benchmark de consulta vs. modelo relacional atual",
      "Teste A/B de decisão com e sem eixo de linhagem",
    ],
    applications: [
      { area: "software", use: "Estado de app/CORE com linhagem consultável" },
      { area: "dados-ia", use: "Feature store multidimensional com proveniência" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 72,
      engineeringPlausibility: 60,
      lamouEvidence: null,
      lamouReadiness: 15,
    },
    matrixNote: "Base externa forte; nenhuma evidência interna executada.",
  },
  {
    id: "LAB-PRISMA",
    name: "Prisma",
    layer: "LUA",
    problem: "Um mesmo fato precisa ser lido por lentes diferentes sem duplicar a fonte.",
    mechanism:
      "Decompor um registro único em projeções por lente (profissional, área, risco, custo) mantendo referência à fonte.",
    existingScience: [
      "Materialized views e projeções CQRS",
      "Multi-view learning",
      "Teoria de decisão multicritério (MCDA)",
    ],
    plausibleCombination: "CQRS + MCDA + Council de perfis profissionais como lentes declaradas.",
    lamouHypothesis:
      "Projeções por lente aumentam detecção de divergência antes da decisão, sem multiplicar fontes de verdade.",
    risks: ["Divergência entre projeções sem árbitro", "Latência de reprojeção"],
    falsifiers: ["Divergências detectadas não mudam nenhuma decisão em série de casos reais"],
    requiredTests: ["Medição de divergência detectada vs. decisão alterada", "Custo de reprojeção"],
    applications: [
      { area: "software", use: "Projeções de ficha por perfil" },
      { area: "matematica", use: "Agregação multicritério explicável" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 68,
      engineeringPlausibility: 64,
      lamouEvidence: null,
      lamouReadiness: 18,
    },
    matrixNote: "Mecanismo padrão em engenharia; hipótese LAMOU não medida.",
  },
  {
    id: "LAB-SNAPSHOT",
    name: "Snapshot",
    layer: "LUA",
    problem: "Sem estado congelado verificável, evidência e rollback ficam sem âncora.",
    mechanism:
      "Captura imutável com hash, escopo, autor e dependências para comparação e restauração.",
    existingScience: [
      "Content-addressed storage (Merkle/Git)",
      "Point-in-time recovery em bancos",
      "Copy-on-write filesystems",
    ],
    plausibleCombination: "Hash de conteúdo + PITR + Registry de linhagem LAMOU.",
    lamouHypothesis:
      "Snapshot com linhagem torna gate de promoção auditável sem congelar a evolução.",
    risks: ["Retenção e custo", "Snapshot sem contexto vira lixo verificável"],
    falsifiers: ["Restore não reproduz o estado declarado em teste executado"],
    requiredTests: ["Backup/restore com verificação de hash", "Teste de rollback com evidência"],
    applications: [
      { area: "software", use: "Baseline FROZEN e candidata" },
      { area: "seguranca", use: "Integridade e resposta a incidente" },
    ],
    truth: "EXTERNAL_EVIDENCE",
    matrix: {
      externalScience: 88,
      engineeringPlausibility: 78,
      lamouEvidence: null,
      lamouReadiness: 25,
    },
    matrixNote: "Ciência externa madura; execução interna ainda NOT_VERIFIED.",
  },
  {
    id: "LAB-FANTASMA",
    name: "Cubo Fantasma",
    layer: "LUA",
    problem: "Testar mudança estrutural sem contaminar o estado operacional corrente (SOL).",
    mechanism:
      "Réplica sombra que recebe tráfego espelhado e divergências são medidas, não aplicadas.",
    existingScience: [
      "Shadow deployment e dark launching",
      "Digital twin",
      "Chaos engineering controlado",
    ],
    plausibleCombination: "Shadow traffic + digital twin + gates de validação LAMOU.",
    lamouHypothesis: "Sombra medida antecipa falha estrutural antes da promoção, sem risco ao SOL.",
    risks: ["Custo de duplicação", "Efeitos colaterais em integrações não idempotentes"],
    falsifiers: ["Falhas continuam aparecendo só em produção após sombra aprovar"],
    requiredTests: [
      "Espelhamento com writes bloqueados",
      "Comparação de divergência sombra vs. real",
    ],
    applications: [
      { area: "software", use: "Validação pré-promoção" },
      { area: "industria", use: "Gêmeo de processo para ajuste sem parar linha" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 80,
      engineeringPlausibility: 55,
      lamouEvidence: null,
      lamouReadiness: 12,
    },
    matrixNote: "Padrão externo existe; variante LAMOU não construída.",
  },
  {
    id: "LAB-RELACAO",
    name: "Cubo da Relação",
    layer: "LUA",
    problem: "Relações entre casos, apps, clientes e evidências ficam implícitas e se perdem.",
    mechanism:
      "Grafo tipado sobre o volume de estado, com peso por evidência e decaimento por obsolescência.",
    existingScience: [
      "Knowledge graphs",
      "Causal discovery (limites conhecidos)",
      "Análise de redes",
    ],
    plausibleCombination: "Grafo de conhecimento + freshness/decay + provenance obrigatória.",
    lamouHypothesis: "Relação com peso de evidência reduz falso positivo de causa.",
    risks: ["Correlação lida como causa", "Grafo denso sem utilidade"],
    falsifiers: ["Relações de alto peso não se confirmam em teste dirigido"],
    requiredTests: ["Validação dirigida das 20 relações de maior peso"],
    applications: [
      { area: "dados-ia", use: "Contexto para agentes com proveniência" },
      { area: "biologia", use: "Mapeamento de sistemas complexos (pesquisa)" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 70,
      engineeringPlausibility: 50,
      lamouEvidence: null,
      lamouReadiness: 10,
    },
    matrixNote: "Risco central: confundir similaridade com causa.",
  },
  {
    id: "LAB-CALEIDOSCOPIO",
    name: "Caleidoscópio",
    layer: "LUA",
    problem: "Resiliência costuma ser testada só no cenário feliz e um único caminho.",
    mechanism:
      "Motor de cenários A/B/C/D/SAFE com drills, cenários adormecidos, revalidação e pós-falha preditivo.",
    existingScience: [
      "Engenharia de resiliência e game days",
      "Planejamento por cenários",
      "Teoria de confiabilidade / FMEA",
    ],
    plausibleCombination: "Game days + FMEA + rota SAFE sempre disponível.",
    lamouHypothesis: "Manter cenários adormecidos revalidados encurta o tempo de recuperação real.",
    risks: ["Cenários envelhecidos dando falsa segurança", "Custo de drills"],
    falsifiers: ["Tempo de recuperação real não melhora após ciclos de drill"],
    requiredTests: ["Drill cronometrado por cenário", "Revalidação de cenário adormecido"],
    applications: [
      { area: "seguranca", use: "Resiliência, comunicações e continuidade" },
      { area: "industria", use: "Continuidade de processo e manutenção" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 76,
      engineeringPlausibility: 58,
      lamouEvidence: null,
      lamouReadiness: 20,
    },
    matrixNote: "Drills LAMOU ainda não executados neste build.",
  },
  {
    id: "LAB-OPTICAL-EGRESS",
    name: "Optical Multi-Egress / Saída Óptica Multicanal",
    layer: "LUA",
    problem: "Um único caminho de egresso é ponto de falha e limita banda agregada.",
    mechanism:
      "Múltiplas saídas ópticas coordenadas por política, com seleção de rota por qualidade e integridade.",
    existingScience: [
      "WDM / DWDM e multiplexação óptica",
      "Multipath TCP / MPLS-TE",
      "Diversidade de caminho em redes ópticas",
    ],
    plausibleCombination:
      "WDM + política de rota orientada a evidência + verificação de integridade por canal.",
    lamouHypothesis:
      "Egresso multicanal com política orientada a evidência melhora continuidade sem degradar latência.",
    risks: [
      "Custo de hardware óptico",
      "Complexidade de sincronização",
      "Sem bancada não há medida",
    ],
    falsifiers: ["Ganho de continuidade não aparece em bancada com carga controlada"],
    requiredTests: [
      "Bancada óptica com medição de BER e latência por canal",
      "Teste de falha de canal",
    ],
    applications: [
      { area: "telecom", use: "Diversidade de egresso e continuidade" },
      { area: "fisica", use: "Estudo de limites de canal" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 84,
      engineeringPlausibility: 40,
      lamouEvidence: null,
      lamouReadiness: 5,
    },
    matrixNote: "Depende de bancada física inexistente hoje: evidência LAMOU INDETERMINADA.",
  },
  {
    id: "LAB-REPLICADOR",
    name: "Replicador / Regenerador Seletivo de Ramo",
    layer: "LUA",
    problem: "Recuperar um ramo específico do estado sem restaurar o sistema inteiro.",
    mechanism: "Regeneração seletiva de subárvore a partir de snapshot + log de eventos do ramo.",
    existingScience: [
      "Event sourcing e replay parcial",
      "Regeneração de sinal em enlaces ópticos (analogia externa)",
      "CRDTs e reconciliação parcial",
    ],
    plausibleCombination:
      "Event sourcing por ramo + snapshot com hash + reconciliação determinística.",
    lamouHypothesis: "Restore de ramo reduz janela de indisponibilidade vs. restore completo.",
    risks: ["Divergência silenciosa entre ramos", "Ordem de eventos e idempotência"],
    falsifiers: ["Restore de ramo produz estado divergente verificável"],
    requiredTests: ["Restore de ramo com verificação de hash", "Teste de idempotência de replay"],
    applications: [
      { area: "software", use: "Recuperação granular" },
      { area: "farmaceutica", use: "Reconstituição de trilha de lote (pesquisa/validação)" },
    ],
    truth: "HYPOTHESIS",
    matrix: {
      externalScience: 66,
      engineeringPlausibility: 45,
      lamouEvidence: null,
      lamouReadiness: 8,
    },
    matrixNote: "Nada implementado; apenas mecanismo descrito.",
  },
];

export interface LabStudy {
  id: string;
  title: string;
  conceptId: string;
  question: string;
  design: string;
  status: "planejado" | "em desenho" | "bloqueado";
  blocker: string | null;
  truth: TruthState;
}

export const LAB_STUDIES: LabStudy[] = [
  {
    id: "STU-001",
    title: "Snapshot: restore verificado por hash",
    conceptId: "LAB-SNAPSHOT",
    question: "O restore reproduz exatamente o estado declarado?",
    design:
      "Snapshot de baseline, mutação controlada, restore, comparação de hash e diff de linhagem.",
    status: "planejado",
    blocker: null,
    truth: "NOT_VERIFIED",
  },
  {
    id: "STU-002",
    title: "Caleidoscópio: drill cronometrado A/B/C/D/SAFE",
    conceptId: "LAB-CALEIDOSCOPIO",
    question: "O tempo de recuperação cai com cenários revalidados?",
    design: "Drill por trilha com cronômetro, registro de evidência e comparação entre ciclos.",
    status: "planejado",
    blocker: null,
    truth: "NOT_VERIFIED",
  },
  {
    id: "STU-003",
    title: "Optical Multi-Egress: bancada de BER por canal",
    conceptId: "LAB-OPTICAL-EGRESS",
    question: "Existe ganho de continuidade sem penalidade de latência?",
    design: "Bancada óptica com múltiplos canais, carga controlada, medição de BER e failover.",
    status: "bloqueado",
    blocker: "Sem laboratório/bancada óptica disponível. BLOCKED até haver instrumentação.",
    truth: "BLOCKED",
  },
];

export interface LabEvidenceItem {
  id: string;
  label: string;
  kind: "referência externa" | "medição interna" | "documento" | "log";
  source: string;
  truth: TruthState;
}

export const LAB_EVIDENCE: LabEvidenceItem[] = [
  {
    id: "EV-EXT-001",
    label: "Literatura de multiplexação óptica (WDM/DWDM)",
    kind: "referência externa",
    source: "Bibliografia externa de comunicações ópticas — não anexada neste build",
    truth: "EXTERNAL_EVIDENCE",
  },
  {
    id: "EV-EXT-002",
    label: "Padrões de shadow deployment e digital twin",
    kind: "referência externa",
    source: "Prática consolidada de engenharia — referência não anexada",
    truth: "EXTERNAL_EVIDENCE",
  },
  {
    id: "EV-INT-001",
    label: "Medição interna LAMOU de qualquer conceito do Lab",
    kind: "medição interna",
    source: "Não existe medição interna neste build",
    truth: "NOT_VERIFIED",
  },
];

export const LAB_PENDINGS: { id: string; text: string; truth: TruthState }[] = [
  {
    id: "PEND-001",
    text: "Anexar referências externas com DOI/URL e data ao Evidence Store",
    truth: "NOT_VERIFIED",
  },
  {
    id: "PEND-002",
    text: "Executar STU-001 (restore verificado) e registrar evidência",
    truth: "NOT_VERIFIED",
  },
  { id: "PEND-003", text: "Bancada óptica para STU-003", truth: "BLOCKED" },
  {
    id: "PEND-004",
    text: "Calibrar plausibilidade de engenharia (hoje heurística)",
    truth: "NOT_VERIFIED",
  },
];
