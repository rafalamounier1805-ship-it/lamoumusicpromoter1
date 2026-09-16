export const ICON_LIBRARY_VISUAL_LOCK = {
  assetId: "4bb418e9-92d2-41ba-8aa2-2945087ca585",
  projectId: "bee5a2f8-878d-4954-a168-029ef7399b36",
  file: "src/assets/visual-lock/icon-library.asset.json",
  originalFilename: "icon-library.webp",
  truth: "EXTERNAL_EVIDENCE",
  perFeatureBinding: "NOT_VERIFIED",
} as const;

/**
 * Regra de governança visual:
 * - o asset visual-lock é preservado como referência e não é fingido como ícone individual;
 * - enquanto não existir mapeamento/crop verificável por função, a navegação usa Lucide como
 *   fallback técnico explícito e acessível;
 * - a troca pelo ícone visual-lock exige vínculo por código, revisão visual e teste de contraste.
 */
export const FEATURE_ICON_POLICY = {
  currentSource: "lucide-react",
  currentTruth: "PARTIAL",
  domMarker: "data-icon-source=lucide-fallback",
  replacementGate: [
    "visual-lock mapping by feature code",
    "light/dark contrast check",
    "keyboard and screen-reader semantics unchanged",
    "responsive QA",
  ],
} as const;
