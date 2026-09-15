import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "diagnostico-360")!;

export const Route = createFileRoute("/apps/diagnostico-360")({
  head: () => ({
    meta: [
      { title: "Diagnóstico 360 — LAMOU" },
      { name: "description", content: "Diagnóstico estruturado da situação atual do cliente em múltiplas dimensões." },
      { property: "og:title", content: "Diagnóstico 360 — LAMOU" },
      { property: "og:description", content: "Diagnóstico estruturado da situação atual do cliente em múltiplas dimensões." },
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
