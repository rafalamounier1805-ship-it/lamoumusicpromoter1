import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["tests"]!;

export const Route = createFileRoute("/core/tests")({
  head: () => ({
    meta: [
      { title: "Testes, Validation & Evidence — LAMOU CORE" },
      {
        name: "description",
        content:
          "Matriz obrigatória de testes por chamada e exigência de evidência para qualquer promoção.",
      },
      { property: "og:title", content: "Testes, Validation & Evidence — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Matriz obrigatória de testes por chamada e exigência de evidência para qualquer promoção.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="core">
      <ModulePage spec={spec} />
    </AppShell>
  ),
});
