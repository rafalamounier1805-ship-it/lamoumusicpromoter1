import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { AppPage } from "@/components/lamou/module-page";
import { APP_PAGES, appSpecToPage } from "@/lib/lamou/pages";

const app = APP_PAGES.find((a) => a.slug === "validation-gate")!;

export const Route = createFileRoute("/apps/validation-gate")({
  head: () => ({
    meta: [
      { title: "Validation Gate — LAMOU" },
      {
        name: "description",
        content: "Gate que autoriza ou bloqueia promoção com base em evidência verificável.",
      },
      { property: "og:title", content: "Validation Gate — LAMOU" },
      {
        property: "og:description",
        content: "Gate que autoriza ou bloqueia promoção com base em evidência verificável.",
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
