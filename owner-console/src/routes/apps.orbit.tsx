import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "orbit")!;

export const Route = createFileRoute("/apps/orbit")({
  head: () => ({
    meta: [
      { title: "Orbit / Agenda / LifeOS — LAMOU" },
      { name: "description", content: "Agenda e sistema de vida operacional do proprietário no ecossistema LAMOU." },
      { property: "og:title", content: "Orbit / Agenda / LifeOS — LAMOU" },
      { property: "og:description", content: "Agenda e sistema de vida operacional do proprietário no ecossistema LAMOU." },
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
