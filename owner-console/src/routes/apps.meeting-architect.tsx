import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "meeting-architect")!;

export const Route = createFileRoute("/apps/meeting-architect")({
  head: () => ({
    meta: [
      { title: "Meeting Architect — LAMOU" },
      { name: "description", content: "Estrutura reuniões diagnósticas com pauta, perguntas, evidências e decisões." },
      { property: "og:title", content: "Meeting Architect — LAMOU" },
      { property: "og:description", content: "Estrutura reuniões diagnósticas com pauta, perguntas, evidências e decisões." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="apps">
      <AppPage spec={appSpecToPage(app)} id={app.id} chain={app.chain} docs={app.docs} calls={app.calls} />
    </AppShell>
  ),
});
