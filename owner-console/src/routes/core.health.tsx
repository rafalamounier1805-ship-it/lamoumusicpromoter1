import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import {
  ContextColumn,
  ContextLayout,
  Field,
  InfoTip,
  MetricBar,
  Term,
  TONE_BORDER,
  TONE_TEXT,
  type ColumnTab,
} from "@/components/lamou/context-column";
import {
  CoverageStack,
  DomainBars,
  NextActionsPanel,
  OverallHealth,
  STATUS_TONE,
} from "@/components/lamou/health-widgets";
import { PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HEALTH_INDICATORS,
  HEALTH_LABEL,
  HEALTH_MEANING,
  HEALTH_TRUTH,
  NEXT_ACTIONS,
  healthCoverage,
} from "@/lib/lamou/health-model";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/core/health")({
  head: () => ({
    meta: [
      { title: "Indicadores de Saúde — LAMOU CORE" },
      {
        name: "description",
        content:
          "Saúde Geral explicável, contribuição de cada indicador, cobertura de evidência e ações prioritárias do LAMOU CORE, com origem e responsável.",
      },
      { property: "og:title", content: "Indicadores de Saúde — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Saúde Geral com composição declarada, barras por domínio, cobertura de evidência e bloco Melhorar hoje. Verde apenas quando comprovado.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HealthPage,
});

type Sel = { kind: "geral" } | { kind: "indicador"; id: string } | null;

function HealthPage() {
  const [sel, setSel] = useState<Sel>(null);
  const cov = healthCoverage();
  const current = sel?.kind === "indicador" ? HEALTH_INDICATORS.find((i) => i.id === sel.id) : null;

  const column = (() => {
    if (sel?.kind === "geral") {
      const tabs: ColumnTab[] = [
        {
          id: "resumo",
          label: "Resumo",
          content: (
            <>
              <Field label="Valor atual" value="Saúde geral não calculável ainda" />
              <Field label="Meta" value="score único exige metodologia de peso publicada" />
              <Field label="Tendência" value="sem série histórica registrada" />
              <Field
                label="Última atualização"
                value="calculada no carregamento, a partir dos indicadores desta tela"
              />
            </>
          ),
        },
        {
          id: "saude",
          label: "Saúde",
          content: (
            <>
              <Field
                label="Cobertura de evidência"
                value={`${cov.verificado} de ${cov.total} indicadores comprovados · meta ${cov.total} de ${cov.total}`}
              />
              <CoverageStack />
              <Field
                label="Composição do score"
                value="peso por indicador não definido / NOT_VERIFIED — nenhum percentual é atribuído sem metodologia real."
              />
            </>
          ),
        },
        {
          id: "fonte",
          label: "Fonte",
          content: (
            <>
              <Field
                label="Origem / proveniência"
                value="Indicadores do CORE: registries de capabilities e CALLs, migrações aplicadas e medições reais de provider."
              />
              <Field
                label="Confiança"
                value="NOT_VERIFIED para o score; por indicador, ver Saúde"
              />
              <Field label="Responsável" value="responsável: proprietário" />
            </>
          ),
        },
        {
          id: "evidencias",
          label: "Evidências",
          content: (
            <>
              <Field
                label="Evidências reais registradas"
                value={`${HEALTH_INDICATORS.reduce((a, i) => a + i.evidences.length, 0)} artefatos, todos vinculados a um indicador. Selecione o indicador para abrir cada artefato.`}
              />
              <Button asChild size="sm" variant="outline">
                <Link to="/core/observability">Abrir Observabilidade</Link>
              </Button>
            </>
          ),
        },
        {
          id: "problemas",
          label: "Problemas",
          content: (
            <ul className="space-y-1">
              {HEALTH_INDICATORS.filter((i) => i.impact === "negativo").map((i) => (
                <li key={i.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{i.id}</span>{" "}
                  {i.label} — {i.why}
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "acoes",
          label: "Ações",
          content: (
            <ul className="space-y-1">
              {NEXT_ACTIONS.slice(0, 4).map((a) => (
                <li key={a.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
                  <p>{a.title}</p>
                  <Button asChild size="sm" variant="outline" className="mt-1">
                    <Link to={a.to}>{a.ctaLabel}</Link>
                  </Button>
                </li>
              ))}
            </ul>
          ),
        },
        {
          id: "historico",
          label: "Histórico",
          content: (
            <p className="text-muted-foreground">
              Sem série histórica: nenhuma medição anterior foi persistida para comparar. Estado
              vazio proposital — gráfico de tendência só aparece quando existir histórico real.
            </p>
          ),
        },
      ];
      return (
        <ContextColumn
          badgeId="HS-GERAL"
          title="Saúde Geral"
          subtitle="Score único do CORE: só existe com metodologia de peso e histórico. Hoje mostramos cobertura de evidência."
          truth="NOT_VERIFIED"
          tabs={tabs}
          onClose={() => setSel(null)}
        />
      );
    }

    if (!current) {
      return (
        <ContextColumn empty="Selecione a Saúde Geral, um domínio ou um indicador: valor, meta, contribuição, origem, evidências e ações abrem aqui, sem sair da tela." />
      );
    }

    const tabs: ColumnTab[] = [
      {
        id: "resumo",
        label: "Resumo",
        content: (
          <>
            <Field label="O que é" value={current.definition} />
            <Field label="Valor atual" value={current.value} />
            <Field label="Meta / denominador" value={current.target} />
            <Field label="Significado do estado" value={HEALTH_MEANING[current.status]} />
          </>
        ),
      },
      {
        id: "saude",
        label: "Saúde",
        content: (
          <>
            <Field label="Domínio" value={current.domain} />
            <Field
              label="Peso na Saúde Geral"
              value={
                current.weight === null
                  ? "peso não definido / NOT_VERIFIED — sem metodologia publicada, nenhum percentual é atribuído."
                  : `${current.weight}%`
              }
            />
            <Field
              label="Contribuição atual"
              value={`impacto ${current.impact} — ${
                current.status === "verificado"
                  ? "área comprovada, sustenta decisões."
                  : current.status === "parcial"
                    ? "implementado, comprovação incompleta."
                    : current.status === "nao-conectado"
                      ? "sem integração neste ambiente."
                      : "nada foi executado para comprovar."
              }`}
            />
            <Field label="Tendência" value={current.trend} />
            {current.ratio ? (
              <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Progresso verificável
                </p>
                <p className="mt-0.5 text-xs">
                  {current.ratio.value} de {current.ratio.total}
                </p>
                <div className="mt-1.5">
                  <MetricBar
                    value={current.ratio.value}
                    total={current.ratio.total}
                    tone={STATUS_TONE[current.status]}
                  />
                </div>
              </div>
            ) : (
              <Field label="Progresso" value="parcial sem denominador verificado" />
            )}
          </>
        ),
      },
      {
        id: "fonte",
        label: "Fonte",
        content: (
          <>
            <Field label="Origem / proveniência" value={current.source} />
            <Field label="Última verificação" value={current.updatedAt} />
            <Field label="Responsável" value={current.owner} />
            <Field label="Confiança / estado" value={HEALTH_TRUTH[current.status]} />
          </>
        ),
      },
      {
        id: "evidencias",
        label: `Evidências (${current.evidences.length})`,
        content:
          current.evidences.length === 0 ? (
            <>
              <p className="text-muted-foreground">
                Evidência ausente / NOT_VERIFIED: nenhum log, medição ou documento sustenta este
                indicador. Use o destino abaixo para produzir a evidência na origem correta.
              </p>
              <Button asChild size="sm">
                <Link to={current.where.to}>{current.where.label}</Link>
              </Button>
            </>
          ) : (
            <ul className="space-y-1">
              {current.evidences.map((e) => (
                <li key={e.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] text-muted-foreground">{e.id}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {e.kind}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px]", TONE_TEXT[STATUS_TONE[e.status]])}
                    >
                      {HEALTH_LABEL[e.status]}
                    </Badge>
                  </div>
                  <p className="mt-1">{e.source}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {e.at} · responsável: {e.owner}
                  </p>
                </li>
              ))}
            </ul>
          ),
      },
      {
        id: "problemas",
        label: "Problemas / Impacto",
        content: (
          <>
            <Field label="Por que está nesse estado" value={current.why} />
            <Field
              label="Impacto na decisão"
              value={
                current.status === "verificado"
                  ? "Pode sustentar decisão de promoção nesta dimensão."
                  : "Enquanto não houver comprovação, nenhuma decisão de promoção pode se apoiar neste indicador."
              }
            />
          </>
        ),
      },
      {
        id: "acoes",
        label: "Ações",
        content: (
          <>
            <Field
              label="Onde resolver"
              value={`${current.where.label} — rota real da candidata.`}
            />
            <Button asChild size="sm">
              <Link to={current.where.to}>{current.where.label}</Link>
            </Button>
          </>
        ),
      },
      {
        id: "historico",
        label: "Histórico",
        content: (
          <p className="text-muted-foreground">
            Sem série histórica para este indicador: nenhuma medição anterior foi persistida. Não
            exibimos gráfico de tendência sem dado real.
          </p>
        ),
      },
    ];

    return (
      <ContextColumn
        badgeId={current.id}
        title={current.label}
        subtitle={`${current.domain} · ${HEALTH_LABEL[current.status]}`}
        truth={HEALTH_TRUTH[current.status]}
        tabs={tabs}
        onClose={() => setSel(null)}
        footer={
          <Button asChild size="sm" variant="outline">
            <Link to={current.where.to}>{current.where.label}</Link>
          </Button>
        }
      />
    );
  })();

  return (
    <AppShell group="core">
      <PageHeader
        title="Saúde & Evidências do CORE"
        subtitle="Saúde Geral explicável, contribuição de cada indicador, cobertura de evidência e ações prioritárias. Verde somente com comprovação."
        right={
          <TruthBadge truth="PARTIAL" hint="Fundação implementada; verificação ainda incompleta." />
        }
      />

      <ContextLayout column={column}>
        <div className="grid gap-3 lg:grid-cols-2">
          <OverallHealth
            onOpen={() => setSel({ kind: "geral" })}
            selected={sel?.kind === "geral"}
          />
          <div className="space-y-3">
            <Panel title="Cobertura de evidência">
              <p className="text-xs text-muted-foreground">
                Quantos dos {cov.total} indicadores têm <Term term="evidencia" label="evidência" />{" "}
                comprovada, parcial, não verificada ou não conectada. Cobertura não é saúde: é o
                quanto podemos afirmar.
              </p>
              <CoverageStack />
            </Panel>
            <Panel title="Saúde por domínio">
              <p className="text-xs text-muted-foreground">
                Cada domínio agrupa indicadores da mesma natureza — inclusive as{" "}
                <Term term="capability" label="capabilities" /> do CORE. Clique para abrir o
                indicador na coluna de contexto.
              </p>
              <DomainBars onSelect={(id) => setSel({ kind: "indicador", id })} />
            </Panel>
          </div>
        </div>

        <NextActionsPanel limit={4} />

        <Panel title="Metraction 360 — módulo de Indicadores">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">MÓDULO</Badge>
            <Badge variant="outline">V0.4 VISUAL BASELINE</Badge>
            <TruthBadge truth="PARTIAL" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Metraction 360 fica sob Indicadores como módulo independente de métricas e
            rastreabilidade. Esta tela não absorve sua lógica nem transforma o módulo em CORE.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-3">
            <Link to="/owner/products">Abrir ficha do Metraction em Produtos</Link>
          </Button>
        </Panel>

        <Panel title={`Indicadores (${HEALTH_INDICATORS.length})`}>
          <p className="text-xs text-muted-foreground">
            Cada indicador tem ícone próprio da sua família, valor, meta/denominador, peso
            declarado, impacto, tendência, origem, responsável e evidência. Cor indica apenas
            estado: vermelho é bloqueio real, amarelo atenção, verde meta atingida.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            {HEALTH_INDICATORS.map((i) => {
              const tone = STATUS_TONE[i.status];
              const selected = sel?.kind === "indicador" && sel.id === i.id;
              const Icon = i.icon;
              return (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => setSel({ kind: "indicador", id: i.id })}
                  aria-pressed={selected}
                  aria-label={
                    i.evidences.length > 0
                      ? `Abrir ${i.label}: ver ${i.evidences.length} evidências na coluna de contexto`
                      : `Abrir ${i.label} na coluna de contexto (evidência ausente)`
                  }
                  className={cn(
                    "motion-safe:transition-[transform,box-shadow,border-color] rounded-xl border bg-card/70 p-4 text-left outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-ring",
                    selected
                      ? "border-primary/70 bg-primary/10 shadow-[var(--shadow-glow)]"
                      : cn(
                          TONE_BORDER[tone],
                          "hover:border-primary/50 hover:shadow-[var(--shadow-glow)] motion-safe:hover:-translate-y-[2px] active:translate-y-0",
                        ),
                  )}
                >
                  <div className="flex items-start gap-2">
                    <Icon
                      className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground"
                      aria-hidden="true"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{i.label}</p>
                      <p className="text-[10px] text-muted-foreground">{i.domain}</p>
                    </div>
                    <InfoTip text={i.definition} />
                  </div>
                  <p className={cn("mt-2 font-display text-lg font-semibold", TONE_TEXT[tone])}>
                    {i.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{i.target}</p>
                  {i.ratio ? (
                    <div className="mt-2">
                      <MetricBar value={i.ratio.value} total={i.ratio.total} tone={tone} />
                    </div>
                  ) : null}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className={cn("text-[10px]", TONE_TEXT[tone])}>
                      {HEALTH_LABEL[i.status]}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] text-muted-foreground">
                      {i.weight === null ? "peso não definido" : `peso ${i.weight}%`}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">
                      {i.evidences.length > 0
                        ? `ver ${i.evidences.length} evidência${i.evidences.length > 1 ? "s" : ""}`
                        : "evidência ausente"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </Panel>

        <Panel title="Criticidade por domínio">
          <p className="text-xs text-muted-foreground">
            Contagem de indicadores em bloqueio real (não conectado) e em atenção (parcial ou não
            verificado). Sem histórico, não há gráfico temporal — apenas o estado atual.
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {Array.from(new Set(HEALTH_INDICATORS.map((i) => i.domain))).map((d) => {
              const items = HEALTH_INDICATORS.filter((i) => i.domain === d);
              const blocked = items.filter((i) => i.status === "nao-conectado").length;
              const attention = items.filter(
                (i) => i.status === "parcial" || i.status === "nao-verificado",
              ).length;
              return (
                <li
                  key={d}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-2 text-xs"
                >
                  <span className="min-w-0 flex-1">{d}</span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      blocked > 0 ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    bloqueio: {blocked}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      attention > 0 ? "text-warning" : "text-muted-foreground",
                    )}
                  >
                    atenção: {attention}
                  </Badge>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Regra de cor e de ícone">
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>Ícone identifica a família/domínio; cor identifica apenas estado.</li>
            <li>Verde / COMPROVADO: existe evidência executada e anexada.</li>
            <li>
              Amarelo / PARCIAL: implementado, com comprovação incompleta — sempre dizemos de quê.
            </li>
            <li>Cinza / NÃO VERIFICADO: nada foi executado para comprovar.</li>
            <li>Vermelho / NÃO CONECTADO: bloqueio real, integração inexistente neste ambiente.</li>
          </ul>
        </Panel>
      </ContextLayout>
    </AppShell>
  );
}
