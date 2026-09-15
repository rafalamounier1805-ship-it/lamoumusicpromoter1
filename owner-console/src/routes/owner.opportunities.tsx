import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["opportunities"]!;

export const Route = createFileRoute("/owner/opportunities")({
  head: () => ({
    meta: [
      { title: "Oportunidades — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Cadeia Research Scout, Benchmarker e Opportunity Intelligence com ficha e gate de validação.",
      },
      { property: "og:title", content: "Oportunidades — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Cadeia Research Scout, Benchmarker e Opportunity Intelligence com ficha e gate de validação.",
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
