import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/mapa-vivo")({
  head: () => ({ meta: [{ title: "Mapa Vivo — LAMOU CORE Proprietário" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="map" />;
}
