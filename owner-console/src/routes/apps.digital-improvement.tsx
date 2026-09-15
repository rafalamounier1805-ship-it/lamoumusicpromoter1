import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "digital-improvement")!;

export const Route = createFileRoute("/apps/digital-improvement")({
  head: () => ({
    meta: [
      { title: "Digital Improvement — LAMOU" },
      { name: "description", content: "Converte diagnóstico em plano de melhoria digital priorizado." },
      { property: "og:title", content: "Digital Improvement — LAMOU" },
      { property: "og:description", content: "Converte diagnóstico em plano de melhoria digital priorizado." },
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
