import { describe, expect, test } from "bun:test";

import { APP_ROUTES, appRoute } from "../src/lib/lamou/nav";

describe("appRoute", () => {
  test("resolve slugs registrados para a rota correta", () => {
    expect(appRoute("research-scout")).toBe("/apps/research-scout");
    expect(appRoute("version")).toBe("/apps/version");
  });

  test("slug desconhecido nunca cai silenciosamente em Research Scout", () => {
    expect(() => appRoute("slug-inexistente")).toThrow("APP_ROUTE_NOT_REGISTERED:slug-inexistente");
  });

  test("cada rota registrada é única", () => {
    const routes = Object.values(APP_ROUTES);
    expect(new Set(routes).size).toBe(routes.length);
  });
});
