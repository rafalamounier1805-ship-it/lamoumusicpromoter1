import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/documents")({
  head: () => ({ meta: [{ title: "Documentos — LAMOU CORE" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="documents" />;
}
