import { createFileRoute, Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, NotConnected, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/** Treinamentos já adotados na operação. Candidatas/conteúdo em criação ficam no LABTEST. */
const TRAININGS = [
  {
    id: "TRN-0001",
    name: "Governança LAMOU: SALVAR ≠ PROMOVER",
    audience: "Proprietário / operação",
    status: "Adotado",
    truth: "DOCUMENTED_ONLY",
    gap: "Sem registro de conclusão por pessoa",
  },
  {
    id: "TRN-0002",
    name: "Truth-states e evidências",
    audience: "Operação / qualidade",
    status: "Adotado",
    truth: "DOCUMENTED_ONLY",
    gap: "Eficácia não medida",
  },
  {
    id: "TRN-0003",
    name: "Instalação e provisionamento de cliente",
    audience: "Operação comercial",
    status: "Em revisão",
    truth: "NOT_VERIFIED",
    gap: "Depende da jornada de cliente homologada",
  },
];

function TrainingsPage() {
  return (
    <AppShell group="core">
      <PageHeader
        title="Treinamentos & Capacitação"
        subtitle="Treinamentos operacionais já adotados, lacunas, vencimentos e vínculo com problemas e planos de ação."
      />
      <DemoBadge label="SYNTHETIC_DEMO — sem LMS, matrículas ou conclusões conectadas" />

      <Panel title="Treinamentos operacionais">
        <div className="space-y-2">
          {TRAININGS.map((t) => (
            <div
              key={t.id}
              className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-xs"
            >
              <div className="flex flex-wrap items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span className="font-mono text-[10px] text-muted-foreground">{t.id}</span>
                <span className="font-medium">{t.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {t.audience}
                </Badge>
                <Badge variant="outline" className="border-primary/40 text-[10px] text-primary">
                  {t.status}
                </Badge>
                <TruthBadge truth={t.truth} />
              </div>
              <p className="mt-2 text-muted-foreground">Lacuna: {t.gap}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Onde cada coisa acontece">
        <p className="text-sm text-muted-foreground">
          Conteúdo de treinamento em criação, teste ou homologação vive no LABTEST &gt;
          Treinamentos. Aqui ficam apenas os treinamentos já adotados pela operação.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline">
            <Link to="/labtest">Treinamentos em teste (LABTEST)</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/core/problems">Planos de ação relacionados</Link>
          </Button>
        </div>
      </Panel>

      <NotConnected
        what="Matrículas, conclusões, vencimentos e eficácia de treinamento"
        next="Conectar fonte de capacitação (LMS ou registro interno) para medir cobertura e eficácia; até então permanece DOCUMENTED_ONLY."
      />
    </AppShell>
  );
}

export const Route = createFileRoute("/core/trainings")({
  head: () => ({
    meta: [
      { title: "Treinamentos & Capacitação — LAMOU CORE" },
      {
        name: "description",
        content:
          "Treinamentos operacionais adotados, lacunas de capacitação, vencimentos e vínculo com planos de ação no CORE proprietário.",
      },
      { property: "og:title", content: "Treinamentos & Capacitação — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Capacitação operacional com truth-state explícito; conteúdo em criação e teste permanece no LABTEST.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrainingsPage,
});
