import { createFileRoute } from "@tanstack/react-router";

import { PlansView } from "@/components/lamou/plans-view";

export const Route = createFileRoute("/core/problems")({
  head: () => ({
    meta: [
      { title: "Problemas, Planos & Projetos — LAMOU CORE" },
      {
        name: "description",
        content:
          "Problemas, ocorrências, planos de ação, projetos e melhorias da operação técnica do LAMOU CORE.",
      },
      { property: "og:title", content: "Problemas, Planos & Projetos — LAMOU CORE" },
      {
        property: "og:description",
        content: "Ocorrências, planos de ação, projetos e melhorias com origem e evidência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlansView group="core" />,
});
