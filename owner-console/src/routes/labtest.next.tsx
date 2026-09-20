import { createFileRoute } from "@tanstack/react-router";

import { LabMasterView } from "@/components/lamou/lab-master-view";

export const Route = createFileRoute("/labtest/next")({
  head: () => ({
    meta: [
      { title: "Programados / Retestes / Fila — LABTEST | LAMOU IA" },
      {
        name: "description",
        content:
          "O que está guardado para subir: itens candidatos, testes obrigatórios, gate, risco e status READY / NOT_READY. Adicionar à fila não promove.",
      },
      {
        property: "og:title",
        content: "Próxima Versão / Fila de Promoção — LABTEST | LAMOU IA",
      },
      {
        property: "og:description",
        content:
          "Fila explícita de pré-promoção com evidências, bloqueadores e regra SALVAR ≠ PROMOVER.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <LabMasterView initialSection="scheduler" />,
});
