import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowRight, BookOpenCheck, CheckCircle2, Info, ShieldAlert } from "lucide-react";

import { OwnerOfficialIcon } from "@/components/lamou/owner-official-icon";
import { DemoBadge, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APPS, CASES, CLIENTS, VERSIONS } from "@/lib/lamou/demo-data";
import { pageExecutionProfile } from "@/lib/lamou/page-execution-profile";
import { validatedPromptReview } from "@/lib/lamou/prompt-review";

const CORE_TREND = [
  { period: "Seg", saude: 78, evidencias: 62 },
  { period: "Ter", saude: 81, evidencias: 66 },
  { period: "Qua", saude: 76, evidencias: 70 },
  { period: "Qui", saude: 84, evidencias: 73 },
  { period: "Sex", saude: 86, evidencias: 77 },
  { period: "Sáb", saude: 85, evidencias: 79 },
  { period: "Hoje", saude: 88, evidencias: 82 },
];

function ReviewPill({ label }: { label: string }) {
  return (
    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-[10px]">
      {label}
    </Badge>
  );
}

export function CouncilReviewedOverview() {
  const profile = pageExecutionProfile("PAGE-OWNER-COGNITIVE");
  const review = validatedPromptReview();
  const criticalCases = CASES.filter((item) => item.severity === "critico" || item.severity === "falha");
  const candidates = VERSIONS.filter((item) => item.state === "CANDIDATA");

  const summary = [
    {
      label: "Clientes na visão",
      value: String(CLIENTS.length),
      note: "carteira visível nesta candidata",
      truth: "SYNTHETIC_DEMO",
      icon: "OWNER-ICO-001" as const,
    },
    {
      label: "Produtos / apps",
      value: String(APPS.length),
      note: "portfólio gerencial declarado",
      truth: "SYNTHETIC_DEMO",
      icon: "OWNER-ICO-004" as const,
    },
    {
      label: "Casos críticos",
      value: String(criticalCases.length),
      note: "somente crítico/falha; probabilidade fica separada",
      truth: "SYNTHETIC_DEMO",
      icon: "OWNER-ICO-006" as const,
    },
    {
      label: "Candidatas",
      value: String(candidates.length),
      note: "SALVAR ≠ PROMOVER",
      truth: "SYNTHETIC_DEMO",
      icon: "OWNER-ICO-009" as const,
    },
  ];

  return (
    <section aria-labelledby="council-reviewed-overview" className="space-y-4">
      <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/8 via-card/75 to-violet/8 p-4 shadow-[0_24px_80px_oklch(0.2_0.04_240/0.22)] backdrop-blur md:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/15 text-primary hover:bg-primary/15">LAMOU IA · Gestão</Badge>
              <TruthBadge truth={review.valid ? "IMPLEMENTED_VERIFIED" : "PARTIAL"} />
              <DemoBadge label="dados demonstrativos explicitamente marcados" />
            </div>
            <h2 id="council-reviewed-overview" className="font-display text-xl font-semibold md:text-2xl">
              {profile.primaryQuestion}
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Perfil da página revisado pelo Conselho: produto, software, tela/UI, pedagogia,
              responsividade, qualidade e acessibilidade. O objetivo é compreender primeiro,
              decidir depois e executar somente em destinos governados.
            </p>
          </div>

          <div className="grid min-w-[240px] gap-2 rounded-2xl border border-border/60 bg-background/45 p-3">
            <div className="flex items-center gap-2">
              <BookOpenCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-xs font-semibold">Contrato didático da página</span>
            </div>
            {profile.pedagogy.sequence.map((item, index) => (
              <div key={item} className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <span className="flex h-5 w-5 items-center justify-center rounded-full border border-primary/25 bg-primary/8 font-mono text-[9px] text-primary">
                  {index + 1}
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {review.reviewers.map((item) => (
            <ReviewPill key={item.roleId} label={item.lens} />
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
        {summary.map((item) => (
          <div key={item.label} className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur">
            <div className="flex items-start gap-3">
              <OwnerOfficialIcon code={item.icon} className="h-10 w-10" decorative={false} />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{item.label}</p>
                <p className="mt-1 font-display text-2xl font-semibold">{item.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{item.note}</p>
              </div>
            </div>
            <div className="mt-3">
              <TruthBadge truth={item.truth} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 2xl:grid-cols-[1.25fr_.75fr]">
        <Panel
          title="Gráfico do CORE · saúde observada × cobertura de evidência"
          action={<DemoBadge label="SYNTHETIC_DEMO · estrutura do gráfico validável" />}
        >
          <p className="mb-3 text-xs text-muted-foreground">
            Demonstração da regra visual do Visual & Media CORE: período, unidade, legenda,
            baseline/contexto e truth-state ficam junto do gráfico. Estes valores não são
            telemetria de produção.
          </p>
          <div className="h-64 w-full" role="img" aria-label="Gráfico demonstrativo de saúde e cobertura de evidência do CORE">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CORE_TREND} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                <defs>
                  <linearGradient id="lamouHealthFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="currentColor" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="currentColor" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.16} />
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
                <RechartsTooltip
                  contentStyle={{
                    background: "var(--card)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="saude"
                  name="Saúde observada"
                  stroke="currentColor"
                  fill="url(#lamouHealthFill)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="evidencias"
                  name="Cobertura de evidência"
                  stroke="currentColor"
                  fillOpacity={0}
                  strokeDasharray="5 4"
                  strokeWidth={1.5}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full border border-border/60 px-2 py-1">Unidade: %</span>
            <span className="rounded-full border border-border/60 px-2 py-1">Período: 7 pontos demo</span>
            <span className="rounded-full border border-border/60 px-2 py-1">Fonte: fixture da candidata</span>
          </div>
        </Panel>

        <Panel title="Como esta página deve ensinar sem virar tutorial">
          <div className="space-y-3">
            {[
              {
                title: "Situação",
                text: "Mostre primeiro o que mudou, o que está crítico e qual o tamanho do impacto.",
                icon: ShieldAlert,
              },
              {
                title: "Evidência",
                text: "Todo número mostra origem e truth-state; ausência vira NOT_VERIFIED/NOT_CONNECTED.",
                icon: CheckCircle2,
              },
              {
                title: "Próxima ação",
                text: "Toda leitura termina em destino real: cliente, produto, caso, CORE, LABTEST ou documento.",
                icon: ArrowRight,
              },
              {
                title: "Explicação contextual",
                text: "Use ⓘ e microcopy curta para conceitos técnicos; não esconda a nomenclatura correta.",
                icon: Info,
              },
            ].map(({ title, text, icon: Icon }) => (
              <div key={title} className="rounded-xl border border-border/50 bg-surface-1/45 p-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  <p className="text-xs font-semibold">{title}</p>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <a href="#main-content">Continuar para os dados da gestão</a>
          </Button>
        </Panel>
      </div>
    </section>
  );
}
