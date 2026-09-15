import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["versions"]!;

export const Route = createFileRoute("/core/versions")({
  head: () => ({
    meta: [
      { title: "Versões, Builds & Rollback — LAMOU CORE" },
      { name: "description", content: "Baseline preservada, candidata corrente, backup, restore e rollback do LAMOU CORE." },
      { property: "og:title", content: "Versões, Builds & Rollback — LAMOU CORE" },
      { property: "og:description", content: "Baseline preservada, candidata corrente, backup, restore e rollback do LAMOU CORE." },
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
