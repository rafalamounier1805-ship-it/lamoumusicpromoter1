import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["security"]!;

export const Route = createFileRoute("/owner/security")({
  head: () => ({
    meta: [
      { title: "Segurança — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Visão defensiva do ecossistema: alertas, integridade, snapshots, incidentes, permissões e isolamento.",
      },
      { property: "og:title", content: "Segurança — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Visão defensiva do ecossistema: alertas, integridade, snapshots, incidentes, permissões e isolamento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="owner">
      <ModulePage spec={spec} />
    </AppShell>
  ),
});
