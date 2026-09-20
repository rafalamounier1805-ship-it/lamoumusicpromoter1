import { describe, expect, test } from "bun:test";

import { CORE_DETAIL_SURFACES, CORE_MENU } from "../src/lib/lamou/nav";

const EXPECTED_ROOTS = [
  ["/core/mapa-vivo", "Mapa Vivo"],
  ["/core/execution", "Execução & Indicadores"],
  ["/core/products", "Produtos & Aplicativos"],
  ["/core/cases", "Casos & Soluções"],
  ["/core/radar", "Radar & Oportunidades"],
  ["/core/documents", "Documentos"],
  ["/core/lifecycle", "Versões, Distribuição & Recuperação"],
  ["/core/governance", "Governança"],
  ["/core/settings", "Configurações"],
] as const;

describe("CORE root navigation", () => {
  test("mantém exatamente as nove raízes canônicas, na ordem aprovada", () => {
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
