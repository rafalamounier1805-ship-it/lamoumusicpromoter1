import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { CouncilView } from "@/components/lamou/council-view";
import { ModulePage } from "@/components/lamou/module-page";
import { Panel } from "@/components/lamou/shell";
import { SubstitutionGovernancePanel } from "@/components/lamou/substitution-impact";
import { CORE_PAGES } from "@/lib/lamou/pages";

const spec = CORE_PAGES["ai"]!;

export const Route = createFileRoute("/core/ai")({
  head: () => ({
    meta: [
      { title: "IA, Conselho, Prompts, Skills & VAs — LAMOU CORE" },
      {
        name: "description",
        content:
          "Conselho profissional governado, Router de especialistas, API e agentes com truth-state explícito.",
      },
      { property: "og:title", content: "IA, Conselho & API — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Conselho profissional governado por evidência, risco, permissões, custo e estado real de provider/ferramentas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <AppShell group="core">
      <ModulePage spec={spec} />
      <CouncilView />
      <Panel title="Substituição governada de provider, plugin ou modelo">
        <SubstitutionGovernancePanel context="core" />
      </Panel>
    </AppShell>
  ),
});
