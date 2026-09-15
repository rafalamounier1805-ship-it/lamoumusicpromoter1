import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { ModulePage } from "@/components/lamou/module-page";
import { Panel } from "@/components/lamou/shell";
import { SubstitutionGovernancePanel } from "@/components/lamou/substitution-impact";
import { Button } from "@/components/ui/button";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["ai"]!;

export const Route = createFileRoute("/core/ai")({
  head: () => ({
    meta: [
      { title: "IA, Prompts, Skills & VAs — LAMOU CORE" },
      {
        name: "description",
        content:
          "Conselho profissional adaptativo, Router de especialistas e agentes governados por Registry.",
      },
      { property: "og:title", content: "IA, Prompts, Skills & VAs — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Conselho profissional adaptativo, Router de especialistas e agentes governados por Registry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="core">
      <ModulePage spec={spec} />
      <Panel title="Conselho profissional & API">
        <p className="text-xs text-muted-foreground">
          O Conselho é uma superfície técnica de detalhe. O router local pode selecionar perfis e
          checklists; especialistas externos, Red Team e síntese só executam quando provider,
          permissões e contratos estiverem conectados.
        </p>
        <Button asChild size="sm" variant="outline" className="mt-3">
          <Link to="/core/council">Abrir Conselho & API</Link>
        </Button>
      </Panel>
      <Panel title="Substituição governada de provider, plugin ou modelo">
        <SubstitutionGovernancePanel context="core" />
      </Panel>
    </AppShell>
  ),
});
