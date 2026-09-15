import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { SettingsView } from "@/components/lamou/settings-view";
import { PageHeader, TruthBadge } from "@/components/lamou/shell";

export const Route = createFileRoute("/owner/settings")({
  head: () => ({
    meta: [
      { title: "Configurações — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Workspace, proprietário, usuários, papéis, MFA, clientes, IA, APIs, integrações, dados, notificações, backup, ambientes, aparência, licenças, custos, auditoria, flags e LAB.",
      },
      { property: "og:title", content: "Configurações — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Superfície de configuração do proprietário com estado, origem, motivo, próximo passo e registro governado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="owner">
      <PageHeader
        title="Configurações"
        subtitle="Cada item mostra o que é, de onde vem, por que está nesse estado e onde resolver. Registros são locais e governados: SALVAR ≠ PROMOVER."
        right={<TruthBadge truth="PARTIAL" />}
      />
      <SettingsView />
    </AppShell>
  ),
});
