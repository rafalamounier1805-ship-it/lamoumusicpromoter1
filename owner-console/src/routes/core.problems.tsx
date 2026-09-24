import { createFileRoute } from "@tanstack/react-router";

import { PlansView } from "@/components/lamou/plans-view";

type CoreProblemsSearch = {
  case_id?: string;
};

function parseCoreProblemsSearch(search: Record<string, unknown>): CoreProblemsSearch {
  const caseId = search["case_id"];
  return typeof caseId === "string" && caseId.trim() ? { case_id: caseId } : {};
}

export const Route = createFileRoute("/core/problems")({
  validateSearch: parseCoreProblemsSearch,
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
  component: CoreProblemsRoute,
});

function CoreProblemsRoute() {
  const { case_id: caseId } = Route.useSearch();
  return <PlansView group="core" selectedCaseId={caseId} />;
}
