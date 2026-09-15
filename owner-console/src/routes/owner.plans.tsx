import { createFileRoute } from "@tanstack/react-router";

import { PlansView } from "@/components/lamou/plans-view";

/** Rota mantida por compatibilidade de links. A superfície canônica é
 *  /core/problems (CORE, operação). Não aparece no menu da Central. */
export const Route = createFileRoute("/owner/plans")({
  head: () => ({
    meta: [
      { title: "Problemas, Planos & Projetos — LAMOU IA" },
      {
        name: "description",
        content:
          "Casos encaminhados, planos de ação, projetos e melhorias do ecossistema LAMOU, com origem, evidência e IDs relacionados.",
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
