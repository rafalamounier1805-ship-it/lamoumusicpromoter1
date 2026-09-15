import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["overview"]!;

export const Route = createFileRoute("/core/")({
  head: () => ({
    meta: [
      { title: "LAMOU CORE — Visão Geral do Proprietário" },
      {
        name: "description",
        content:
          "Camada técnica do CORE proprietário: capabilities, contratos, SOL e LUA com estados verificáveis.",
      },
      { property: "og:title", content: "LAMOU CORE — Visão Geral do Proprietário" },
      {
        property: "og:description",
        content:
          "Camada técnica do CORE proprietário: capabilities, contratos, SOL e LUA com estados verificáveis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="core">
      <ModulePage spec={spec} />
    </AppShell>
  ),
});
