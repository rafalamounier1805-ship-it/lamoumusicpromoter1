import { describe, expect, test } from "bun:test";

import { CORE_DETAIL_SURFACES, CORE_MENU } from "../src/lib/lamou/nav";

const EXPECTED_ROOTS = [
  ["/core", "Visão Geral"],
  ["/core/health", "Indicadores de Saúde"],
  ["/core/observability", "Observabilidade"],
  ["/core/architecture", "Arquitetura Técnica"],
  ["/core/apps", "Módulos, Plugins & Bindings"],
  ["/core/problems", "Problemas & Encaminhamentos"],
  ["/core/tests", "Testes Técnicos do CORE"],
  ["/core/versions", "Versões & Atualizações"],
  ["/core/settings", "Configurações"],
] as const;

describe("CORE root navigation", () => {
  test("mantém exatamente as nove raízes técnicas, na ordem reconciliada", () => {
    expect(CORE_MENU).toHaveLength(9);
    expect(CORE_MENU.map((item) => [item.to, item.label])).toEqual(EXPECTED_ROOTS);
  });

  test("superfícies técnicas de detalhe não viram raízes", () => {
    const roots = new Set(CORE_MENU.map((item) => item.to));
    const detailOnly = CORE_DETAIL_SURFACES.filter((item) => item.parent !== "");

    for (const detail of detailOnly) {
      expect(roots.has(detail.to)).toBe(false);
    }
  });

  test("não existem rotas raiz duplicadas", () => {
    const roots = CORE_MENU.map((item) => item.to);
    expect(new Set(roots).size).toBe(roots.length);
  });
});
