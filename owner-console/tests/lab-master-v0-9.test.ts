import { describe, expect, test } from "bun:test";

import {
  ARCHITECTURE_EVOLUTION,
  EVOLUTION_ROWS,
  LAB_CANONICAL_SCREENS,
  MY_TEST_FIELDS,
  RADAR_OPPORTUNITIES,
  RESEARCH_MAP,
  TEST_FAMILIES,
  THEORY_MAP,
} from "../src/lib/lamou/lab-master-data";

describe("LAMOU LAB V0.9 canonical architecture", () => {
  test("preserva exatamente as 21 telas canônicas recuperadas", () => {
    expect(LAB_CANONICAL_SCREENS).toHaveLength(21);
    expect(LAB_CANONICAL_SCREENS.map((screen) => screen.label)).toEqual([
      "LAB",
      "Testes",
      "Validation",
      "Cubo Mágico",
      "Arquiteturas LAB",
      "Banco de Dados",
      "Simulações",
      "Pessoas · Personas · UAT",
      "Evidências · Estudos · Scout",
      "Métricas & Analytics",
      "Modelo de Teste",
      "Comparar",
      "Predição & Antecipação",
      "Campanhas",
      "Conselho Profissional",
      "Registry & Documentos",
      "Programados",
      "Histórico",
      "Auditoria & Segurança",
      "Meta-Validation",
      "Resultado Geral",
    ]);
    expect(new Set(LAB_CANONICAL_SCREENS.map((screen) => screen.key)).size).toBe(21);
  });

  test("cada tela possui camada didática completa", () => {
    for (const screen of LAB_CANONICAL_SCREENS) {
      expect(screen.simple.length).toBeGreaterThan(10);
      expect(screen.why.length).toBeGreaterThan(10);
      expect(screen.known.length).toBeGreaterThan(10);
      expect(screen.pending.length).toBeGreaterThan(10);
      expect(screen.next.length).toBeGreaterThan(10);
      expect(screen.technical.length).toBeGreaterThan(10);
    }
  });

  test("modo 10→15 nunca reduz potencial abaixo do estado atual", () => {
    for (const row of EVOLUTION_ROWS) {
      expect(row.withExisting).toBeGreaterThanOrEqual(row.current);
      expect(row.withEvolution).toBeGreaterThanOrEqual(row.withExisting);
    }
  });

  test("Planilhão, teorias, pesquisa, radar e evolução estão materializados", () => {
    expect(EVOLUTION_ROWS.length).toBeGreaterThanOrEqual(5);
    expect(THEORY_MAP.length).toBeGreaterThanOrEqual(4);
    expect(RESEARCH_MAP.length).toBeGreaterThanOrEqual(3);
    expect(RADAR_OPPORTUNITIES.length).toBeGreaterThanOrEqual(5);
    expect(ARCHITECTURE_EVOLUTION[0]).toBe("Planilha / Standard");
    expect(ARCHITECTURE_EVOLUTION).toContain("Cubo Mágico");
    expect(ARCHITECTURE_EVOLUTION).toContain("Caleidoscópio");
    expect(ARCHITECTURE_EVOLUTION).toContain("Triângulo / Pirâmide");
  });

  test("Meus Testes preserva campos mínimos de governança", () => {
    for (const field of [
      "test_id",
      "objetivo",
      "hipótese",
      "métricas",
      "evidências_obrigatórias",
      "baseline",
      "resultado_esperado",
      "resultado_real",
      "runner",
      "reteste_de",
      "eficácia",
      "truth_state",
    ]) {
      expect(MY_TEST_FIELDS).toContain(field);
    }
  });

  test("famílias incluem ciência, UAT, IA, segurança, industrial e Meus Testes", () => {
    expect(TEST_FAMILIES).toContain("Arquitetura / Ciência");
    expect(TEST_FAMILIES).toContain("Pessoas / Persona / UAT");
    expect(TEST_FAMILIES).toContain("IA / Modelo");
    expect(TEST_FAMILIES).toContain("Segurança / Privacidade / Resiliência");
    expect(TEST_FAMILIES).toContain("Hardware / Equipamento / Industrial");
    expect(TEST_FAMILIES).toContain("Meus Testes");
  });

  test("radar técnico não auto-promove e sempre propõe teste", () => {
    for (const item of RADAR_OPPORTUNITIES) {
      expect(item.test.length).toBeGreaterThan(10);
      expect(item.state).not.toBe("PROMOTED");
      expect(item.potential15).toBeGreaterThanOrEqual(item.target10);
    }
  });
});
