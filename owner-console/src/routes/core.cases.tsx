import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/cases")({
  head: () => ({ meta: [{ title: "Casos & Soluções — LAMOU CORE" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="cases" />;
}
