import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { B144_CANDIDATE } from "@/lib/lamou/b144-candidate";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["versions"]!;

export const Route = createFileRoute("/owner/versions")({
  head: () => ({
    meta: [
      { title: "Versões — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Histórico, baseline congelada, candidatas, evidências e gate de promoção. Salvar não é promover.",
      },
      { property: "og:title", content: "Versões — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Histórico, baseline congelada, candidatas, evidências e gate de promoção. Salvar não é promover.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="owner">
      <Panel
        title="B144 — trava da candidata"
        action={<TruthBadge truth="IMPLEMENTED_NOT_VERIFIED" />}
      >
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{B144_CANDIDATE.version}</Badge>
          <Badge variant="outline">{B144_CANDIDATE.state}</Badge>
          <Badge variant="outline">LOCKED</Badge>
          <Badge variant="outline">NO_OVERWRITE</Badge>
          <Badge variant="outline">DERIVE_ONLY</Badge>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Branch travada: {B144_CANDIDATE.branch}. Base preservada: {B144_CANDIDATE.baseCommit}.
          Validar não promove. Qualquer alteração posterior deve gerar nova candidata derivada.
        </p>
      </Panel>
      <ModulePage spec={spec} />
    </AppShell>
  ),
});
