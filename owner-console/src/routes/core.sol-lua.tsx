import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["sol-lua"]!;

export const Route = createFileRoute("/core/sol-lua")({
  head: () => ({
    meta: [
      { title: "SOL / LUA / LAB — LAMOU CORE" },
      { name: "description", content: "SOL é a referência operacional corrente; LUA reúne candidatas e experiências, sem promoção automática." },
      { property: "og:title", content: "SOL / LUA / LAB — LAMOU CORE" },
      { property: "og:description", content: "SOL é a referência operacional corrente; LUA reúne candidatas e experiências, sem promoção automática." },
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
