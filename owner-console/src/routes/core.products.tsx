import { createFileRoute } from "@tanstack/react-router";

import { CoreOwnerWorkspace } from "@/components/lamou/core-owner-workspace";

export const Route = createFileRoute("/core/products")({
  head: () => ({ meta: [{ title: "Produtos & Aplicativos — LAMOU CORE" }] }),
  component: Screen,
});

function Screen() {
  return <CoreOwnerWorkspace module="products" />;
}
