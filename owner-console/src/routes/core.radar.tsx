import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/radar")({
  head: () => ({ meta: [{ title: "Radar & Oportunidades — LAMOU CORE" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="radar" />;
}
