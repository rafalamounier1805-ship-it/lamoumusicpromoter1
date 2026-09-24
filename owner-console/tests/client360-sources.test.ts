import { describe, expect, test } from "bun:test";

import {
  CLIENT360_SOURCES,
  CLIENT360_TABS,
  client360Source,
} from "../src/lib/lamou/client360-sources";

describe("Client 360 source-of-truth", () => {
  test("preserva exatamente as oito abas aprovadas", () => {
    expect(CLIENT360_TABS).toEqual([
      "Visão geral",
      "Pacote & Entitlements",
      "Cobrança & Contrato",
      "Versões & Atualizações",
      "Backup & Restore",
      "Comunicações",
      "Apps & CORE",
      "Suporte & Timeline",
    ]);
  });

  test("fixture de cobrança e cobrança em banco são fontes distintas", () => {
    expect(client360Source("cobranca-fixture").truth).toBe("SYNTHETIC_DEMO");
    expect(client360Source("cobranca-db").truth).toBe("PARTIAL");
    expect(client360Source("gateway").truth).toBe("NOT_CONNECTED");
  });

  test("backup e atualização local nunca aparecem como execução real", () => {
    expect(client360Source("backup").executor).toBe("fixture");
    expect(client360Source("backup").truth).toBe("SYNTHETIC_DEMO");
    expect(client360Source("versoes").executor).toBe("fixture");
    expect(client360Source("versoes").truth).toBe("SYNTHETIC_DEMO");
  });

  test("comunicação continua sem executor externo", () => {
    expect(client360Source("comunicacoes").executor).toBe("none");
    expect(client360Source("comunicacoes").truth).toBe("NOT_CONNECTED");
  });

  test("todos os domínios possuem fonte, nota e truth-state explícitos", () => {
    for (const item of CLIENT360_SOURCES) {
      expect(item.source.trim().length).toBeGreaterThan(0);
      expect(item.note.trim().length).toBeGreaterThan(0);
      expect(item.truth.trim().length).toBeGreaterThan(0);
    }
  });
});
