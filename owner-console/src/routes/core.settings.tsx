import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/settings")({
  head: () => ({ meta: [{ title: "Configurações — LAMOU CORE Proprietário" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="settings" />;
}
