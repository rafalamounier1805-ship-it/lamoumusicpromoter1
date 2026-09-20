import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/")({
  head: () => ({
    meta: [
      { title: "Mapa Vivo — LAMOU CORE Proprietário" },
      {
        name: "description",
        content:
          "Entrada do CORE Proprietário LAMOU: Mapa Vivo do ecossistema técnico e acesso às nove áreas canônicas.",
      },
    ],
  }),
  component: CoreEntry,
});

function CoreEntry() {
  return <CoreOwnerWorkspace module="map" />;
}
