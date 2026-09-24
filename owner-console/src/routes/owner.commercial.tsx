import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { CommercialView } from "@/components/lamou/commercial-view";
import { PageHeader, TruthBadge } from "@/components/lamou/shell";

export const Route = createFileRoute("/owner/commercial")({
  head: () => ({
    meta: [
      { title: "Comercial & Contratos — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Clientes, contratos, cobranças e pendências comerciais com estado, origem, próximo passo e ligação com a ficha do cliente.",
      },
      { property: "og:title", content: "Comercial & Contratos — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Registro governado de clientes, contratos, cobranças e pendências; faturamento real permanece não conectado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="owner">
      <PageHeader
        title="Comercial &amp; Contratos"
        subtitle="Clientes, contratos, cobranças e pendências com origem, estado e próximo passo. Registros locais governados: SALVAR ≠ PROMOVER."
        right={<TruthBadge truth="SYNTHETIC_DEMO" />}
      />
      <CommercialView />
    </AppShell>
  ),
});
