/**
 * Candidate Vault — previous candidates recovered and locked.
 *
 * LOCK semantics:
 * - exact candidate identity/version is immutable;
 * - artifact SHA-256 is the integrity key;
 * - no edit and no overwrite;
 * - any change must create a derived candidate;
 * - SALVAR != PROMOVER.
 *
 * "Pull" in this Owner candidate exports the immutable source pointer/manifest.
 * Fetching binary bytes from the Library requires the storage bridge/backend.
 */

export type CandidateSourceMode =
  | "LIBRARY_FILE"
  | "LIBRARY_PACKAGE"
  | "RECOVERED_HISTORICAL_PACKAGE"
  | "SOURCE_NOT_FOUND";

export interface CandidateVaultItem {
  slot: string;
  appKey: string;
  name: string;
  version: string;
  immutable: true;
  promotion: "CANDIDATE_NOT_PROMOTED" | "APPROVED_REFERENCE";
  sourceMode: CandidateSourceMode;
  source: string;
  sha256: string | null;
  note?: string;
}

export const CANDIDATE_VAULT_POLICY = {
  immutable: true,
  editForbidden: true,
  overwriteForbidden: true,
  deriveOnly: true,
  hashRequiredBeforeUse: true,
  lockDoesNotEqualPromotion: true,
  binaryStorageBridge: "NOT_CONNECTED",
} as const;

export const CANDIDATE_VAULT_EXCLUSIONS = [
  {
    name: "VECTRA Intelligence 360",
    reason: "Mesma linhagem de BELGO Intelligence; não entra como aplicativo separado neste cofre.",
  },
  {
    name: "Validation Gate",
    reason: "Excluído explicitamente desta seleção de candidatos.",
  },
  {
    name: "APP Observer 360",
    reason: "Excluído explicitamente desta seleção de candidatos.",
  },
] as const;

export const CANDIDATE_VAULT: CandidateVaultItem[] = [
  {
    slot: "01",
    appKey: "project-prime",
    name: "PROJECT PRIME MASTER V1",
    version: "V1",
    immutable: true,
    promotion: "APPROVED_REFERENCE",
    sourceMode: "LIBRARY_FILE",
    source: "/PROJECT_PRIME_MASTER_EXECUTABLE.html",
    sha256: "1ae0a5ef1af9a607bb70addaddb5f7dfaf6a3a43dca0f1dc75bb9801eb1487bb",
  },
  {
    slot: "02",
    appKey: "meu-desenvolvimento",
    name: "LAMU IA — Meu Desenvolvimento",
    version: "v1 COMPLETO",
    immutable: true,
    promotion: "APPROVED_REFERENCE",
    sourceMode: "LIBRARY_FILE",
    source: "/LAMU_IA_Meu_Desenvolvimento_v1_COMPLETO.html",
    sha256: "0f553c268201be7ee6446b33eef8b0471cad08e5c032d44c46a6a5e9abb96090",
  },
  {
    slot: "03",
    appKey: "belgo-intelligence-360",
    name: "BELGO Intelligence 360",
    version: "V2 CORE_PRISMA_CUBO",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source:
      "/BELGO Intelligence 360/CANDIDATAS/BELGO_INTELLIGENCE_360_V2_CORE_PRISMA_CUBO_CANDIDATE/BELGO_INTELLIGENCE_360_V2_CORE_PRISMA_CUBO_EXECUTAVEL.html",
    sha256: "d49880f116242d753967c4bfbb10d6e052f60f06093deff214a4d7e635af4015",
    note: "Versão anterior da linhagem BELGO/VECTRA; VECTRA não é uma entrada separada aqui.",
  },
  {
    slot: "04",
    appKey: "certificacoes",
    name: "Certificações / Assurance 360",
    version: "V0.3",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source: "/LAMOU_CERTIF_ASSURANCE_360_V0_3_RECOVERED_EXECUTABLE.html",
    sha256: "c773543e839ea8e659c5c1c02b9379583fc321808551fcf792571d9095511c69",
  },
  {
    slot: "05",
    appKey: "version",
    name: "LAMOU Version",
    version: "V0.6",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_PACKAGE",
    source:
      "/LAMOU IA CORE/Documentos Mestre/CANDIDATAS/2026-09-06_LAMOU_VERSION_V0_6_P0_P1_CORE_PRESENTATION/LAMOU_VERSION_V0_6_P0_P1_CORE_PRESENTATION_PACKAGE.zip",
    sha256: "659d8679ae3fec8b93cfee5f17d37ed2fe16b6360f903983ab213fc80df08988",
    note: "Hash do executável Windows recuperado do pacote travado.",
  },
  {
    slot: "06",
    appKey: "orbit",
    name: "LAMOU Orbite",
    version: "V5.9",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_PACKAGE",
    source:
      "/LAMOU IA CORE/Documentos Mestre/CANDIDATAS/2026-09-06_LAMOU_ORBITE_V5_9_P0_P1/LAMOU_ORBITE_V5_9_P0_P1_CANDIDATE_01.zip",
    sha256: "07877c2366b79a7b00d33db120232e6619a705982c2113ade1f0f5943c8ceafc",
    note: "Hash do executável Owner recuperado do pacote V5.9.",
  },
  {
    slot: "07",
    appKey: "amudoc",
    name: "A-MuDoc",
    version: "V0.4",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source:
      "/LAMOU IA CORE/Builds/V7_5_CANDIDATA_INTEGRADA/LAMOU_AMUDOC_V0_4_CANDIDATA_EXECUTAVEL.html",
    sha256: "56549301be7f74fa2fb52c5e19daab728575406c2cd17becbc52ab81aa18218f",
  },
  {
    slot: "08",
    appKey: "showroom",
    name: "LAMOU Showroom / Nexus",
    version: "Showroom V0.4 + Nexus V0.5",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "RECOVERED_HISTORICAL_PACKAGE",
    source: "APP-029 historical package — Showroom V0.4 preserved + Nexus V0.5 derivative",
    sha256: "25f344ed3f5f3d5baad87ca6f6ba8f2bbd872458bd63c94b0681020305abe1f7",
    note: "Hash principal = Showroom V0.4 original; Nexus continua como derivada da mesma linhagem.",
  },
  {
    slot: "09",
    appKey: "processo",
    name: "LAMOU App Processo",
    version: "V0.2 DESIGN GOLD",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source: "/LAMOU/App Processo/V0_2_DESIGN_GOLD_CANDIDATA/index.html",
    sha256: "9ae577e02dd964dbce1bb41a6eaa37a5acfcb172a0159f75fe5c4da463a023ab",
  },
  {
    slot: "10",
    appKey: "teste3",
    name: "Teste³ IA",
    version: "V0.2",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "RECOVERED_HISTORICAL_PACKAGE",
    source: "APP-010 historical candidate — Teste³ / Forge lineage",
    sha256: "792eef755c8ad7893f9e7770fa341ba06a2570256bb2a2707e4f4818efadd2dd",
  },
  {
    slot: "11",
    appKey: "digital-improvement",
    name: "LAMOU Digital Improvement",
    version: "V0.2",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "RECOVERED_HISTORICAL_PACKAGE",
    source: "APP-012 historical candidate — Digital Improvement / Evolve lineage",
    sha256: "84c5dd40146c6602fcb15f37d8b4b2430d1b8963e0fe2cead26c6c7a908d341a",
  },
  {
    slot: "12",
    appKey: "benchmarker",
    name: "Benchmarker — referência histórica",
    version: "BELGO BENCH V0.4.1",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source: "/LAMOU_BELGO_BENCH_V0_4_1_EXECUTAVEL_CANDIDATA.exe",
    sha256: "095197476b7e86c564e6c3db3a58b45f860d42212b5ad7d5d082810e5a509005",
    note: "Referência histórica; não afirmar que este binário é o Benchmarker canônico.",
  },
  {
    slot: "13",
    appKey: "app-clone",
    name: "LAMOU App Clone",
    version: "V0.5 SEMANTIC LINK",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source: "/LAMOU_APP_CLONE_V0_5_SEMANTIC_LINK_EXECUTAVEL_CANDIDATA.html",
    sha256: "ff303454df5572c7a98928874f2010a19c799ff6bd833bcc7ee5f0682f3eff9f",
  },
  {
    slot: "14",
    appKey: "research-scout",
    name: "LAMOU Research Scout",
    version: "V0.1",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source:
      "/LAMOU IA CORE/Builds/V7_5_CANDIDATA_INTEGRADA/APP_034_LAMOU_RESEARCH_SCOUT_V0_1_CANDIDATA_EXECUTAVEL.html",
    sha256: "1e2d2d71ab3f7fc5a3d77c330c74b147e9949cb9cdf263410bebb5762cac5b95",
  },
  {
    slot: "15",
    appKey: "opportunity-intelligence",
    name: "Opportunity Intelligence / Value",
    version: "V0.4",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_FILE",
    source: "/LAMOU_OPPORTUNITY_VALUE_V0_4_CANDIDATE.html",
    sha256: "d17fa45199e74876025a81b213a7b0b3cc260031f91c75bba5bb676dd75553c0",
  },
  {
    slot: "16",
    appKey: "perfil-avaliacao",
    name: "Perfil & Avaliação",
    version: "RECOVERED_PREVIOUS",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_PACKAGE",
    source: "/LAMOU_PERFIL_AVALIACAO_PESSOA_EXECUTAVEL.zip",
    sha256: "e2c8eb6e8fac988c809a540f3d1e4d8a14098a5245f7e56af03892ce961906ed",
    note: "Hash do HTML recuperado do pacote.",
  },
  {
    slot: "17",
    appKey: "app-reader-lens",
    name: "App Reader / Lens",
    version: "SOURCE_NOT_FOUND",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "SOURCE_NOT_FOUND",
    source: "SOURCE_NOT_FOUND — manter slot travado até localizar o executável anterior físico",
    sha256: null,
  },
  {
    slot: "18",
    appKey: "push-360",
    name: "LAMOU PUSH 360 / PULSE 360",
    version: "V0.6",
    immutable: true,
    promotion: "CANDIDATE_NOT_PROMOTED",
    sourceMode: "LIBRARY_PACKAGE",
    source: "/LAMOU PULSE 360/LAMOU_PULSE_360_V0_6_CANDIDATA_EXECUTAVEL_COMPLETO.zip",
    sha256: "7e29ad6424f1ad8095bc3843bf47d4f90f13074e6e60f165ffe68c3c1b4dbcc9",
  },
];

export function candidateVaultItem(appKey: string): CandidateVaultItem | null {
  return CANDIDATE_VAULT.find((item) => item.appKey === appKey) ?? null;
}
