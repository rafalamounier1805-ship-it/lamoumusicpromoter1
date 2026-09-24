import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { SettingsView } from "@/components/lamou/settings-view";
import { PageHeader, TruthBadge } from "@/components/lamou/shell";
import { CORE_SETTINGS_SECTIONS } from "@/lib/lamou/core-settings-data";

export const Route = createFileRoute("/core/settings")({
  head: () => ({
    meta: [
      { title: "Configurações do CORE — LAMOU IA" },
      {
        name: "description",
        content:
          "Ambientes, runtime, providers e modelos, APIs e scopes, segurança e tenants, dados, observabilidade, backup, limites, custos e feature flags do CORE proprietário.",
      },
      { property: "og:title", content: "Configurações do CORE — LAMOU IA" },
      {
        property: "og:description",
        content:
          "Configuração técnica do CORE com origem, estado, motivo, próximo passo e troca governada de provider.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="core">
      <PageHeader
        title="Configurações do CORE"
        subtitle="Configuração técnica real: ambientes, runtime, providers, APIs, segurança, dados, observabilidade, backup, limites, custos e flags. Registros são locais e governados — SALVAR ≠ PROMOVER."
        right={<TruthBadge truth="PARTIAL" />}
      />
      <SettingsView sections={CORE_SETTINGS_SECTIONS} context="core" />
    </AppShell>
  ),
});
