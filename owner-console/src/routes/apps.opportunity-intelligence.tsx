import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "opportunity-intelligence")!;

export const Route = createFileRoute("/apps/opportunity-intelligence")({
  head: () => ({
    meta: [
      { title: "Opportunity Intelligence — LAMOU" },
      { name: "description", content: "Transforma sinais comparados em ficha de oportunidade com gate de validação." },
      { property: "og:title", content: "Opportunity Intelligence — LAMOU" },
      { property: "og:description", content: "Transforma sinais comparados em ficha de oportunidade com gate de validação." },
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
