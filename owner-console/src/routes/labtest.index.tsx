import { createFileRoute } from "@tanstack/react-router";

import { LabTestView } from "@/components/lamou/labtest-view";

export const Route = createFileRoute("/labtest/")({
  head: () => ({
    meta: [
      { title: "LABTEST — Criação, Teste & Pré-Promoção | LAMOU IA" },
      {
        name: "description",
        content:
          "Superfície única de tudo que está em criação, desenvolvimento, teste, homologação e fila de promoção do ecossistema LAMOU IA.",
      },
      { property: "og:title", content: "LABTEST — Criação, Teste & Pré-Promoção | LAMOU IA" },
      {
        property: "og:description",
        content:
          "Resumo executivo por estágio e tipo, ficha de cada item testável, workspace de ensaio e fila da próxima versão.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LabTestView initialTab="overview" />,
});
