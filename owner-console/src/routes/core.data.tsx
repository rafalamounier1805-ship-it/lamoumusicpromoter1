import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["data"]!;

export const Route = createFileRoute("/core/data")({
  head: () => ({
    meta: [
      { title: "Dados & Fontes — LAMOU CORE" },
      {
        name: "description",
        content: "Contratos de dado, fontes, retenção e isolamento por tenant no LAMOU CORE.",
      },
      { property: "og:title", content: "Dados & Fontes — LAMOU CORE" },
      {
        property: "og:description",
        content: "Contratos de dado, fontes, retenção e isolamento por tenant no LAMOU CORE.",
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
