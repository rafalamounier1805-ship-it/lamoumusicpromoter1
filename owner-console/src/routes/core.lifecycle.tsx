import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/lifecycle")({
  head: () => ({ meta: [{ title: "Versões, Distribuição & Recuperação — LAMOU CORE" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="lifecycle" />;
}
