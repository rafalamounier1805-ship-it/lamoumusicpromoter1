import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "benchmarker")!;

export const Route = createFileRoute("/apps/benchmarker")({
  head: () => ({
    meta: [
      { title: "Benchmarker — LAMOU" },
      { name: "description", content: "Comparação estruturada entre soluções, versões e alternativas com critérios explícitos." },
      { property: "og:title", content: "Benchmarker — LAMOU" },
      { property: "og:description", content: "Comparação estruturada entre soluções, versões e alternativas com critérios explícitos." },
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
