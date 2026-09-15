import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["security"]!;

export const Route = createFileRoute("/core/security")({
  head: () => ({
    meta: [
      { title: "Segurança, RBAC/ABAC & Tenants — LAMOU CORE" },
      { name: "description", content: "Permissões por superfície, isolamento de tenant, entitlements e política de segredos." },
      { property: "og:title", content: "Segurança, RBAC/ABAC & Tenants — LAMOU CORE" },
      { property: "og:description", content: "Permissões por superfície, isolamento de tenant, entitlements e política de segredos." },
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
