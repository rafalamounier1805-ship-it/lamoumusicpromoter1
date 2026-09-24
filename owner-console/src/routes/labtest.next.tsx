import { createFileRoute } from "@tanstack/react-router";

import { LabTestView } from "@/components/lamou/labtest-view";

export const Route = createFileRoute("/labtest/next")({
  head: () => ({
    meta: [
      { title: "Validar — LABTEST | LAMOU IA" },
      {
        name: "description",
        content:
          "Entradas para validação com data, quem enviou, origem, teste, evidências e próximo destino. Validar não promove.",
      },
      {
        property: "og:title",
        content: "Validar — LABTEST | LAMOU IA",
      },
      {
        property: "og:description",
        content:
          "Validação explícita com proveniência, evidências, decisão e destino da conclusão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LabTestView initialTab="next" />,
});
