import { createFileRoute } from "@tanstack/react-router";

import { LabMasterView } from "@/components/lamou/lab-master-view";

export const Route = createFileRoute("/labtest/")({
  head: () => ({
    meta: [
      { title: "LAMOU LABTEST V0.9 — 21 telas + Evolução | LAMOU IA" },
      {
        name: "description",
        content:
          "Laboratório mestre: 21 telas canônicas, Planilhão, evolução 10→15, teorias, pesquisas, radar, Validation, evidências, retestes e eficácia.",
      },
      { property: "og:title", content: "LAMOU LABTEST V0.9 — 21 telas + Evolução | LAMOU IA" },
      {
        property: "og:description",
        content:
          "Pergunta → teste → baseline → execução → evidência → Validation → resultado → reteste → eficácia → próximo experimento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LabMasterView initialSection="lab" />,
});
