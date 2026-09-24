import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "version")!;

export const Route = createFileRoute("/apps/version")({
  head: () => ({
    meta: [
      { title: "LAMOU Version — Arquivos e Builds" },
      {
        name: "description",
        content: "Arquivos, builds, documentos, versionamento, retenção e deduplicação.",
      },
      { property: "og:title", content: "LAMOU Version — Arquivos e Builds" },
      {
        property: "og:description",
        content: "Arquivos, builds, documentos, versionamento, retenção e deduplicação.",
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
