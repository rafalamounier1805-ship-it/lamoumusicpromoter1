import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["versions"]!;

export const Route = createFileRoute("/owner/versions")({
  head: () => ({
    meta: [
      { title: "Versões — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Histórico, baseline congelada, candidatas, evidências e gate de promoção. Salvar não é promover.",
      },
      { property: "og:title", content: "Versões — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Histórico, baseline congelada, candidatas, evidências e gate de promoção. Salvar não é promover.",
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
