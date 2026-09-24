import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["tests"]!;

export const Route = createFileRoute("/owner/tests")({
  head: () => ({
    meta: [
      { title: "Testes & Qualidade — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Visão consolidada de Teste³ IA, Validation Gate e Lab, com evidências e retestes.",
      },
      { property: "og:title", content: "Testes & Qualidade — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Visão consolidada de Teste³ IA, Validation Gate e Lab, com evidências e retestes.",
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
