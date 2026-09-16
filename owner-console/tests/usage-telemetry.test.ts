import { describe, expect, test } from "bun:test";

import { classifyLamouRoute } from "../src/lib/lamou/usage-telemetry";

describe("LAMOU usage telemetry surface classification", () => {
  test("classifies governed owner/core surfaces", () => {
    expect(classifyLamouRoute("/owner/documents")).toEqual({
      surfaceType: "DOCUMENT",
      surfaceId: "owner-documents",
    });
    expect(classifyLamouRoute("/core/ai").surfaceType).toBe("AI");
    expect(classifyLamouRoute("/core/problems/CASE-001").surfaceType).toBe(
      "HYPOTHESIS_PROBLEM",
    );
    expect(classifyLamouRoute("/core/health").surfaceType).toBe("INDICATOR_METRIC");
    expect(classifyLamouRoute("/core/observability").surfaceType).toBe(
      "METRIC_OBSERVABILITY",
    );
    expect(classifyLamouRoute("/core/security").surfaceType).toBe("CORE");
  });

  test("classifies apps, mapa, client and installation surfaces", () => {
    expect(classifyLamouRoute("/apps/version")).toEqual({
      surfaceType: "APP",
      surfaceId: "version",
    });
    expect(classifyLamouRoute("/owner/mapa-vivo").surfaceType).toBe("MAPA_VIVO");
    expect(classifyLamouRoute("/owner/products/APP-001").surfaceType).toBe(
      "PRODUCT_APP_CATALOG",
    );
    expect(classifyLamouRoute("/owner/clients/CLIENTE-001").surfaceType).toBe("CLIENT_360");
    expect(classifyLamouRoute("/install/owner").surfaceType).toBe("INSTALL_OWNER");
    expect(classifyLamouRoute("/install/client").surfaceType).toBe("INSTALL_CLIENT");
    expect(classifyLamouRoute("/labtest/next").surfaceType).toBe("LABTEST");
  });

  test("never leaks query or fragment into the surface id", () => {
    expect(classifyLamouRoute("/apps/showroom?client=secret#tab")).toEqual({
      surfaceType: "APP",
      surfaceId: "showroom",
    });
  });
});
