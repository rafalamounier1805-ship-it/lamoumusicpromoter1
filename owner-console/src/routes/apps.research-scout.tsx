import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "research-scout")!;

export const Route = createFileRoute("/apps/research-scout")({
  head: () => ({
    meta: [
      { title: "Research Scout — LAMOU" },
      {
        name: "description",
        content:
          "Varredura de fontes e sinais externos que alimenta a cadeia de oportunidade LAMOU.",
      },
      { property: "og:title", content: "Research Scout — LAMOU" },
      {
        property: "og:description",
        content:
          "Varredura de fontes e sinais externos que alimenta a cadeia de oportunidade LAMOU.",
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
