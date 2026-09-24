export const ICON_LIBRARY_VISUAL_LOCK = {
  assetId: "4bb418e9-92d2-41ba-8aa2-2945087ca585",
  projectId: "bee5a2f8-878d-4954-a168-029ef7399b36",
  file: "src/assets/visual-lock/icon-library.asset.json",
  originalFilename: "icon-library.webp",
  truth: "EXTERNAL_EVIDENCE",
  perFeatureBinding: "PARTIAL",
} as const;

export const OWNER_ICON_INVENTORY = {
  libraryId: "LAMOU-OWNER-ICONS",
  version: "V0.1-CR",
  status: "CANDIDATE_NOT_PROMOTED",
  scope: "LAMOU CENTRAL — PROPRIETARIO",
  generatedCount: 10,
  plannedRemainingCount: 16,
  sprite: "/src/assets/owner-icons/owner-icons-sprite.webp",
  cells: { columns: 5, rows: 2 },
  generated: [
    { code: "OWNER-ICO-001", label: "LAMOU CENTRAL", index: 0 },
    { code: "OWNER-ICO-002", label: "CORE", index: 1 },
    { code: "OWNER-ICO-003", label: "CORE CUBO", index: 2 },
    { code: "OWNER-ICO-004", label: "APLICATIVOS", index: 3 },
    { code: "OWNER-ICO-005", label: "DOCUMENTOS MESTRE", index: 4 },
    { code: "OWNER-ICO-006", label: "SEGURANCA", index: 5 },
    { code: "OWNER-ICO-007", label: "CONFIGURACOES", index: 6 },
    { code: "OWNER-ICO-008", label: "TESTES E EVIDENCIAS", index: 7 },
    { code: "OWNER-ICO-009", label: "BACKUP E RECOVERY", index: 8 },
    { code: "OWNER-ICO-010", label: "EMERGENCIA OWNER", index: 9 },
  ],
  planned: [
    "PERFIL DO PROPRIETÁRIO",
    "IDENTIDADE E VERIFICAÇÃO",
    "EMPRESA E CNPJ",
    "DISPOSITIVOS E ACESSOS",
    "PLUGINS E INTEGRAÇÕES",
    "LICENÇAS E IP",
    "AUDITORIA E LOGS",
    "ATUALIZAÇÕES E VERSÕES",
    "CLIENTES",
    "CONTRATOS",
    "NOTIFICAÇÕES",
    "HISTÓRICO",
    "AJUDA E ORIENTAÇÃO",
    "DADOS E ARMAZENAMENTO",
    "IMPORTAR FOTO / ARQUIVO",
    "OBSOLETOS E ARQUIVO",
  ],
} as const;

export type OwnerOfficialIconCode = (typeof OWNER_ICON_INVENTORY.generated)[number]["code"];

/**
 * Regra de governança visual:
 * - quando o inventário já possui um ícone individual inventariado, ele pode ser usado como
 *   derivado web otimizado da fonte oficial/candidata V0.1-CR;
 * - o status CANDIDATE_NOT_PROMOTED do inventário é preservado: usar em candidata não promove;
 * - itens ainda em `planned` continuam com fallback funcional, sem inventar arte oficial;
 * - micro-ações continuam com família funcional leve (Lucide), conforme a regra do inventário.
 */
export const FEATURE_ICON_POLICY = {
  officialSource: "LAMOU-OWNER-ICONS V0.1-CR",
  officialTruth: "PARTIAL",
  fallbackSource: "lucide-react",
  fallbackTruth: "IMPLEMENTED_VERIFIED",
  domMarker: "data-icon-source=lucide-fallback",
  replacementGate: [
    "generated asset exists in canonical owner inventory",
    "light/dark contrast check",
    "keyboard and screen-reader semantics unchanged",
    "responsive QA",
  ],
} as const;

export const OWNER_OFFICIAL_ICON_BY_LABEL: Readonly<Record<string, OwnerOfficialIconCode>> = {
  "LAMOU IA": "OWNER-ICO-001",
  "LAMOU CENTRAL": "OWNER-ICO-001",
  "Visão Geral": "OWNER-ICO-002",
  CORE: "OWNER-ICO-002",
  Aplicativos: "OWNER-ICO-004",
  Módulos: "OWNER-ICO-004",
  "Módulos & Produtos": "OWNER-ICO-004",
  "Módulos, Plugins & Bindings": "OWNER-ICO-004",
  Segurança: "OWNER-ICO-006",
  Configurações: "OWNER-ICO-007",
  "Testes & Evidências": "OWNER-ICO-008",
};

export function ownerOfficialIconIndex(code: OwnerOfficialIconCode): number {
  return OWNER_ICON_INVENTORY.generated.find((icon) => icon.code === code)!.index;
}
