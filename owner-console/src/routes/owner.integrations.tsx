import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["integrations"]!;

export const Route = createFileRoute("/owner/integrations")({
  head: () => ({
    meta: [
      { title: "Integrações — LAMOU IA Central" },
      { name: "description", content: "Estado real de cada integração do ecossistema LAMOU, sem declarar conexão sem evidência." },
      { property: "og:title", content: "Integrações — LAMOU IA Central" },
      { property: "og:description", content: "Estado real de cada integração do ecossistema LAMOU, sem declarar conexão sem evidência." },
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
