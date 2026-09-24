import { createFileRoute } from "@tanstack/react-router";

import { PlansView } from "@/components/lamou/plans-view";

/** Visão gerencial/compatibilidade de Projetos & Ações.
 *  Ela organiza e encaminha registros, mas NÃO substitui Plano de Ação nem PROJECT,
 *  que permanecem aplicativos independentes com fonte de verdade própria. */
export const Route = createFileRoute("/owner/plans")({
  head: () => ({
    meta: [
      { title: "Projetos & Ações — LAMOU IA" },
      {
        name: "description",
        content:
          "Visão gerencial de casos, encaminhamentos, ações e projetos com origem, evidência e IDs relacionados; sem absorver os aplicativos Plano de Ação e PROJECT.",
      },
      { property: "og:title", content: "Problemas, Planos & Projetos — LAMOU IA" },
      {
        property: "og:description",
        content: "Problemas encaminhados, planos, projetos e oportunidades com vínculo de origem.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlansView group="owner" />,
});
