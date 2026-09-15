import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "teste3")!;

export const Route = createFileRoute("/apps/teste3")({
  head: () => ({
    meta: [
      { title: "Teste³ IA — LAMOU" },
      {
        name: "description",
        content: "Executor transversal de testes do ecossistema LAMOU, com evidência e reteste.",
      },
      { property: "og:title", content: "Teste³ IA — LAMOU" },
      {
        property: "og:description",
        content: "Executor transversal de testes do ecossistema LAMOU, com evidência e reteste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="apps">
      <AppPage
        spec={appSpecToPage(app)}
        id={app.id}
        chain={app.chain}
        docs={app.docs}
        calls={app.calls}
      />
    </AppShell>
  ),
});
