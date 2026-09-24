import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { CoreDetailSurfaces } from "@/components/lamou/core-detail-surfaces";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["architecture"]!;

export const Route = createFileRoute("/core/architecture")({
  head: () => ({
    meta: [
      { title: "Arquitetura Técnica — LAMOU CORE" },
      {
        name: "description",
        content:
          "Superfícies oficiais, contratos, registries e limites entre proprietário e cliente no LAMOU CORE.",
      },
      { property: "og:title", content: "Arquitetura Técnica — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Superfícies oficiais, contratos, registries e limites entre proprietário e cliente no LAMOU CORE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="core">
      <ModulePage spec={spec} />
      <div className="mt-4">
        <CoreDetailSurfaces parent="Arquitetura Técnica" />
      </div>
    </AppShell>
  ),
});
