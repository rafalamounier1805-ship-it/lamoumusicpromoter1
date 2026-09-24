import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { Panel, TruthBadge } from "@/components/lamou/shell";
import { Button } from "@/components/ui/button";
import { RADAR_OPPORTUNITY_PROMPT } from "@/lib/lamou/b144-candidate";
import { ModulePage } from "@/components/lamou/module-page";
import { OWNER_PAGES } from "@/lib/lamou/pages";

const spec = OWNER_PAGES["opportunities"]!;

export const Route = createFileRoute("/owner/opportunities")({
  head: () => ({
    meta: [
      { title: "Oportunidades — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Cadeia Research Scout, Benchmarker e Opportunity Intelligence com ficha e gate de validação.",
      },
      { property: "og:title", content: "Oportunidades — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Cadeia Research Scout, Benchmarker e Opportunity Intelligence com ficha e gate de validação.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="owner">
      <Panel
        title="Radar de Oportunidades — Prompt conectado"
        action={<TruthBadge truth="DOCUMENTED_ONLY" />}
      >
        <p className="text-xs text-muted-foreground">
          {RADAR_OPPORTUNITY_PROMPT.id} conecta esta superfície ao Comercial e ao módulo
          Opportunity Intelligence. O contrato exige origem, freshness e evidência; runtime de IA
          ainda NOT_CONNECTED.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/owner/commercial">Abrir Comercial</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/apps/opportunity-intelligence">Abrir Opportunity Intelligence</Link>
          </Button>
        </div>
      </Panel>
      <ModulePage spec={spec} />
    </AppShell>
  ),
});
