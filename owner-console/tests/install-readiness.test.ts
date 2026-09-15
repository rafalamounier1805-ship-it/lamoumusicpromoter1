import { describe, expect, test } from "bun:test";

import {
  CLIENT_POST_INSTALL,
  OWNER_INSTALL_CURRENT,
  OWNER_POST_INSTALL,
  truthFromHealth,
} from "../src/lib/lamou/install-readiness";

describe("installation readiness reconciliation", () => {
  test("owner readiness acompanha o Health Model em vez de estados stale", () => {
    expect(OWNER_INSTALL_CURRENT.database.truth).toBe(truthFromHealth("HS-DADOS"));
    expect(OWNER_INSTALL_CURRENT.observability.truth).toBe(truthFromHealth("HS-OBS"));
    expect(OWNER_INSTALL_CURRENT.security.truth).toBe(truthFromHealth("HS-SEGURANCA"));
  });

  test("MFA permanece implementado mas não verificado até validação real", () => {
    expect(OWNER_INSTALL_CURRENT.auth.truth).toBe("IMPLEMENTED_NOT_VERIFIED");
    expect(OWNER_POST_INSTALL.find((item) => item.id === "owner-mfa")?.truth).toBe(
      "IMPLEMENTED_NOT_VERIFIED",
    );
  });

  test("storage de avatar não promove storage geral de evidências", () => {
    expect(OWNER_INSTALL_CURRENT.evidenceStorage.truth).toBe("NOT_CONNECTED");
  });

  test("ativação completa do Owner continua bloqueada enquanto gates faltam", () => {
    expect(OWNER_POST_INSTALL.find((item) => item.id === "owner-activation")?.truth).toBe("BLOCKED");
  });

  test("cliente não ganha tenant, RLS ou portal sem provisionamento real", () => {
    expect(CLIENT_POST_INSTALL.find((item) => item.id === "client-backend")?.truth).toBe(
      "NOT_CONNECTED",
    );
    expect(CLIENT_POST_INSTALL.find((item) => item.id === "client-isolation")?.truth).toBe(
      "NOT_VERIFIED",
    );
    expect(CLIENT_POST_INSTALL.find((item) => item.id === "client-portal")?.truth).toBe(
      "NOT_CONNECTED",
    );
  });
});
