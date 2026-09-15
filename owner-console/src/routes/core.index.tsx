import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Boxes,
  FlaskConical,
  Gauge,
  GitBranch,
  ShieldAlert,
  Waypoints,
} from "lucide-react";

import { AppShell } from "@/components/lamou/app-shell";
import { CoverageStack, NextActionsPanel, OverallHealth } from "@/components/lamou/health-widgets";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CORE_MENU } from "@/lib/lamou/nav";
import { useLamou } from "@/lib/lamou/store";

export const Route = createFileRoute("/core/")({
  head: () => ({
    meta: [
      { title: "LAMOU CORE — Visão Geral do Proprietário" },
      {
        name: "description",
        content:
          "Visão técnica conectada do LAMOU CORE: saúde, riscos, problemas, planos, testes, versões e prioridades, com nove raízes canônicas.",
      },
      { property: "og:title", content: "LAMOU CORE — Visão Geral do Proprietário" },
      {
        property: "og:description",
        content:
          "Resumo técnico conectado do CORE proprietário sem duplicar a camada gerencial da Central.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoreOverview,
});

type RootRoute =
  | "/core"
  | "/core/health"
  | "/core/architecture"
  | "/core/apps"
  | "/core/problems"
  | "/core/tests"
  | "/core/versions"
  | "/core/observability"
  | "/core/settings";

function MetricCard({
  label,
  value,
  note,
  icon: Icon,
  truth,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof Activity;
  truth: string;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur">
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
        </div>
        <TruthBadge truth={truth} />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">{note}</p>
    </div>
  );
}

function CoreOverview() {
  const { cases, plans, tests, security, versions } = useLamou();

  const routedCases = cases.filter((c) => c.destination).length;
  const openPlans = plans.filter((p) => p.status !== "CONCLUÍDO").length;
  const testsNeedingAttention = tests.filter((t) => t.result !== "aprovado" || t.retest).length;
  const openSecurity = security.filter((s) => s.status === "aberto").length;
  const candidates = versions.filter((v) => v.state === "CANDIDATA").length;

  return (
    <AppShell group="core">
      <PageHeader
        title="LAMOU CORE"
        subtitle="Visão técnica conectada: saúde → riscos → problemas → planos → testes → versões → prioridade. A Central continua gerencial; o CORE investiga, executa e comprova."
        right={
          <div className="flex flex-wrap items-center gap-2">
            <TruthBadge truth="PARTIAL" />
            <DemoBadge label="fixtures operacionais = SYNTHETIC_DEMO" />
          </div>
        }
      />

      <section aria-labelledby="core-roots-title">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 id="core-roots-title" className="font-display text-sm font-semibold">
              9 raízes canônicas do CORE
            </h2>
            <p className="text-xs text-muted-foreground">
              Segurança, Dados, CALLs, IA, Treinamentos e SOL/LUA permanecem como detalhes internos,
              nunca como novas raízes.
            </p>
          </div>
          <Badge variant="outline" className="font-mono text-[10px]">
            {CORE_MENU.length}/9
          </Badge>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {CORE_MENU.map((item, index) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.to}
                asChild
                variant="outline"
                className="h-auto justify-start gap-3 rounded-xl p-3 text-left"
              >
                <Link to={item.to as RootRoute}>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[10px] font-mono text-muted-foreground">
                      CORE-{String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="block text-sm font-medium">{item.label}</span>
                  </span>
                </Link>
              </Button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.1fr_.9fr]">
        <OverallHealth />
        <Panel title="Cobertura de evidência">
          <p className="mb-3 text-xs text-muted-foreground">
            Cobertura indica quanto podemos afirmar, não um score de saúde. Sem metodologia de peso,
            a Saúde Geral permanece NÃO CALCULÁVEL / NOT_VERIFIED.
          </p>
          <CoverageStack />
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link to="/core/health">Abrir Saúde & Evidências</Link>
          </Button>
        </Panel>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <MetricCard
          label="Casos encaminhados ao CORE"
          value={String(routedCases)}
          note="Origem: Mapa Vivo / estado local. O Mapa apenas detecta e encaminha."
          icon={Waypoints}
          truth="SYNTHETIC_DEMO"
        />
        <MetricCard
          label="Planos abertos"
          value={String(openPlans)}
          note="Planos persistidos localmente; não equivalem a execução operacional real."
          icon={Activity}
          truth="SYNTHETIC_DEMO"
        />
        <MetricCard
          label="Testes com atenção"
          value={String(testsNeedingAttention)}
          note="Fixtures de teste; runner externo continua separado e exige evidência real."
          icon={FlaskConical}
          truth="SYNTHETIC_DEMO"
        />
        <MetricCard
          label="Alertas de segurança abertos"
          value={String(openSecurity)}
          note="Alertas locais do modelo DEMO; segurança real exige isolamento e auditoria comprovados."
          icon={ShieldAlert}
          truth="SYNTHETIC_DEMO"
        />
        <MetricCard
          label="Candidatas registradas"
          value={String(candidates)}
          note="Nenhuma promoção automática. SALVAR ≠ PROMOVER."
          icon={GitBranch}
          truth="SYNTHETIC_DEMO"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Fluxo técnico do CORE">
          <ol className="space-y-2 text-sm">
            {[
              ["1", "Saúde", "mede o que está comprovado e explicita o que não está"],
              [
                "2",
                "Riscos",
                "mostra bloqueios, falhas e dependências sem transformar ausência de conexão em falso crítico",
              ],
              ["3", "Problemas", "recebe facts do Mapa e conduz investigação técnica"],
              [
                "4",
                "Planos",
                "registra ação, responsável, evidência esperada e critério de conclusão",
              ],
              ["5", "Testes", "executa e registra evidência antes de qualquer gate"],
              ["6", "Versões", "mantém candidata, rollback e promoção manual governada"],
            ].map(([n, title, text]) => (
              <li key={n} className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
                <div className="flex gap-3">
                  <span className="font-mono text-xs text-primary">{n}</span>
                  <span>
                    <strong>{title}:</strong> <span className="text-muted-foreground">{text}</span>
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Atalhos técnicos conectados">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ["Saúde", "/core/health", Gauge],
              ["Problemas & Planos", "/core/problems", Activity],
              ["Testes & Qualidade", "/core/tests", FlaskConical],
              ["Versões & Atualizações", "/core/versions", Boxes],
            ].map(([label, to, Icon]) => {
              const I = Icon as typeof Activity;
              return (
                <Button key={String(to)} asChild variant="outline" className="justify-start">
                  <Link to={to as RootRoute}>
                    <I className="mr-2 h-4 w-4" aria-hidden="true" />
                    {String(label)}
                  </Link>
                </Button>
              );
            })}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Esta visão geral não replica o Cockpit da Central. Ela resume somente estado técnico,
            evidência e caminhos de resolução do CORE.
          </p>
        </Panel>
      </div>

      <NextActionsPanel limit={5} />
    </AppShell>
  );
}
