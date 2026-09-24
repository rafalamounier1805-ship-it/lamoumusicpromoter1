export type CoreCubeTheoryState =
  "BASELINE_REFERENCE" | "EXPERIMENTAL_NOT_PROMOTED" | "PROPOSED_NOT_VERIFIED";

export type CoreCubeTheoryKey =
  | "grid"
  | "cube"
  | "magic-cube"
  | "multi-magic-cube"
  | "prism"
  | "snapshot"
  | "ghost"
  | "relation"
  | "kaleidoscope"
  | "pyramid";

export interface CoreCubeTheory {
  key: CoreCubeTheoryKey;
  label: string;
  state: CoreCubeTheoryState;
  concept: string;
  technicalTranslation: string;
  hypothesis: string;
  personas: string[];
  capabilities: string[];
  evidenceRequired: string[];
  productionEligible: boolean;
}

const DATA_PERSONAS = [
  "data-architect",
  "data-engineer",
  "software-architect",
  "systems-engineer",
  "research-scientist",
];

const CORE_CAPABILITIES = ["data-router", "object-storage", "usage-telemetry", "validation-gate"];

const COMMON_EVIDENCE = [
  "latency benchmark against the Planilhão baseline",
  "retrieval accuracy or task-success benchmark",
  "storage and indexing overhead",
  "lineage and provenance preservation",
  "tenant/permission isolation evidence",
  "reproducible experiment build and environment",
];

export const CORE_CUBE_THEORIES: CoreCubeTheory[] = [
  {
    key: "grid",
    label: "Planilhão / Linha e Coluna",
    state: "BASELINE_REFERENCE",
    concept: "Dados em linhas, colunas, tabelas, filtros e relações explícitas.",
    technicalTranslation: "Modelo relacional/tabular usado como baseline comparável e auditável.",
    hypothesis: "É a referência mais simples para governança, exportação, auditoria e comparação.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: true,
  },
  {
    key: "cube",
    label: "CORE Cubo",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept: "Corredores, salas, armários e objetos representam caminhos contextuais até o dado.",
    technicalTranslation:
      "Índices hierárquicos e relacionais organizam contexto, processo, cliente, app e evidência sem substituir a fonte canônica.",
    hypothesis: "Navegação contextual pode reduzir custo de localização e montagem do contexto.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "magic-cube",
    label: "Cubo Mágico",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept:
      "Os quadrados relevantes se movem para a face frontal e entregam o conjunto necessário ao orquestrador.",
    technicalTranslation:
      "Ranking, índice e cache montam um working set temporário; o movimento visual representa recuperação priorizada, não movimentação física do dado.",
    hypothesis:
      "Trazer somente as células relevantes pode reduzir leitura desnecessária e tempo de contexto.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "multi-magic-cube",
    label: "Cubo Mágico Múltiplo",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept:
      "Cada quadrado pode conter outro conjunto organizado por modalidade, como som, bit, imagem, sinal ou documento.",
    technicalTranslation:
      "Cada célula funciona como manifesto multimodal com metadados, hash, proveniência e ponteiros para objetos pesados; mídia bruta não precisa ser duplicada dentro da célula.",
    hypothesis:
      "Manifestos multimodais podem aproximar sinais relacionados sem duplicar o armazenamento pesado.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "prism",
    label: "Prisma",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept: "O mesmo dado pode ser projetado por dimensões diferentes sem alterar sua origem.",
    technicalTranslation:
      "Views e projeções derivadas preservam identidade, proveniência e fonte canônica.",
    hypothesis:
      "Projeções especializadas podem melhorar leitura por perfil sem criar verdades paralelas.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "snapshot",
    label: "Snapshot",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept: "Congela uma visão temporal reproduzível do contexto usado numa decisão ou teste.",
    technicalTranslation:
      "Manifesto imutável referencia versões, hashes, timestamp e fontes do working set.",
    hypothesis: "Snapshots podem melhorar reprodutibilidade, rollback e auditoria de decisões.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "ghost",
    label: "Fantasma",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept: "Uma camada efêmera permite explorar combinações sem modificar o dado de origem.",
    technicalTranslation:
      "Overlay derivado e descartável mantém rastreabilidade para a fonte e não vira FACT automaticamente.",
    hypothesis: "Overlays temporários podem acelerar simulações sem contaminar CURRENT ou FROZEN.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "relation",
    label: "Relação",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept: "Prioriza ligações entre objetos, eventos, pessoas, processos, apps e evidências.",
    technicalTranslation:
      "Índice de grafo/arestas complementa a origem tabular ou documental sem substituir o source of truth.",
    hypothesis: "Relações explícitas podem reduzir saltos de busca em investigações multientidade.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "kaleidoscope",
    label: "Caleidoscópio",
    state: "EXPERIMENTAL_NOT_PROMOTED",
    concept:
      "Recombina perspectivas do mesmo conjunto de dados conforme objetivo, papel e contexto.",
    technicalTranslation:
      "Composição de views governadas muda a perspectiva, preservando IDs, proveniência e truth-state.",
    hypothesis: "Perspectivas adaptativas podem reduzir ruído sem duplicar a verdade original.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
  {
    key: "pyramid",
    label: "Pirâmide",
    state: "PROPOSED_NOT_VERIFIED",
    concept: "Organização em níveis de síntese e detalhe ainda sem mecanismo validado.",
    technicalTranslation: "Proposta de pesquisa; não possui contrato de execução aprovado.",
    hypothesis:
      "Níveis progressivos podem ajudar síntese executiva, mas o ganho ainda não foi demonstrado.",
    personas: DATA_PERSONAS,
    capabilities: CORE_CAPABILITIES,
    evidenceRequired: COMMON_EVIDENCE,
    productionEligible: false,
  },
];

export interface CoreCubeExperimentPlan {
  baseline: "grid";
  target: Exclude<CoreCubeTheoryKey, "grid">;
  state: "NOT_RUN";
  oneVariableOnly: true;
  requiredEvidence: string[];
  promotionAllowed: false;
}

export function getCoreCubeTheory(key: CoreCubeTheoryKey): CoreCubeTheory {
  const theory = CORE_CUBE_THEORIES.find((candidate) => candidate.key === key);
  if (!theory) throw new Error(`CORE_CUBE_THEORY_NOT_FOUND:${key}`);
  return theory;
}

export function planCoreCubeExperiment(
  target: Exclude<CoreCubeTheoryKey, "grid">,
): CoreCubeExperimentPlan {
  const theory = getCoreCubeTheory(target);
  return {
    baseline: "grid",
    target,
    state: "NOT_RUN",
    oneVariableOnly: true,
    requiredEvidence: theory.evidenceRequired,
    promotionAllowed: false,
  };
}

export function productionArchitectures(): CoreCubeTheory[] {
  return CORE_CUBE_THEORIES.filter((theory) => theory.productionEligible);
}
