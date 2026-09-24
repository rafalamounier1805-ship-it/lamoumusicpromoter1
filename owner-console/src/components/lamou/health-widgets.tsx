import { Link } from "@tanstack/react-router";
import { ArrowRight, HeartPulse, ListChecks } from "lucide-react";

import { InfoTip, TONE_FILL, TONE_TEXT, type Tone } from "@/components/lamou/context-column";
import { Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  HEALTH_INDICATORS,
  HEALTH_LABEL,
  NEXT_ACTIONS,
  healthCoverage,
  type HealthStatus,
  type NextAction,
} from "@/lib/lamou/health-model";
import { cn } from "@/lib/utils";

/**
 * Cor representa evidência/estado, não ausência de conexão.
 * Vermelho é reservado a bloqueio/falha/erro real; HealthStatus não possui um estado de falha.
 */
export const STATUS_TONE: Record<HealthStatus, Tone> = {
  verificado: "ok",
  parcial: "attention",
  "nao-verificado": "neutral",
  "nao-conectado": "neutral",
};

const URGENCY_TONE: Record<NextAction["urgency"], Tone> = {
  critico: "critical",
  atencao: "attention",
  informativo: "info",
};

const URGENCY_LABEL: Record<NextAction["urgency"], string> = {
  critico: "crítico",
  atencao: "atenção",
  informativo: "informativo",
};

/** Anel de progresso. Mostra cobertura de evidência — nunca um score inventado. */
export function Ring({
  value,
  total,
  caption,
  tone = "info",
  size = 116,
}: {
  value: number;
  total: number;
  caption: string;
  tone?: Tone;
  size?: number;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  const r = size / 2 - 8;
  const c = 2 * Math.PI * r;
  const stroke =
    tone === "critical"
      ? "stroke-destructive"
      : tone === "attention"
        ? "stroke-warning"
        : tone === "ok"
          ? "stroke-success"
          : "stroke-primary";
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} role="img" aria-label={`${caption}: ${pct}%`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className="fill-none stroke-border/60"
          strokeWidth={8}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          className={cn("fill-none", stroke)}
          strokeWidth={8}
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="47%"
          textAnchor="middle"
          className="fill-foreground font-display text-lg font-semibold"
        >
          {pct}%
        </text>
        <text x="50%" y="63%" textAnchor="middle" className="fill-muted-foreground text-[9px]">
          {value}/{total}
        </text>
      </svg>
      <p className="text-xs text-muted-foreground">{caption}</p>
    </div>
  );
}

/** Barra empilhada de cobertura de evidência por estado. */
export function CoverageStack() {
  const c = healthCoverage();
  const parts: { key: HealthStatus; n: number }[] = [
    { key: "verificado", n: c.verificado },
    { key: "parcial", n: c.parcial },
    { key: "nao-verificado", n: c.naoVerificado },
    { key: "nao-conectado", n: c.naoConectado },
  ];
  return (
    <div className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden rounded-full border border-border/60">
        {parts.map((p) =>
          p.n === 0 ? null : (
            <span
              key={p.key}
              className={cn(TONE_FILL[STATUS_TONE[p.key]])}
              style={{ width: `${(p.n / c.total) * 100}%` }}
              aria-hidden="true"
            />
          ),
        )}
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {parts.map((p) => (
          <li key={p.key} className="flex items-center gap-1.5">
            <span
              className={cn("h-2 w-2 rounded-full", TONE_FILL[STATUS_TONE[p.key]])}
              aria-hidden="true"
            />
            {HEALTH_LABEL[p.key]}: {p.n} de {c.total}
          </li>
        ))}
      </ul>
    </div>
  );
}

function domainTone(items: (typeof HEALTH_INDICATORS)[number][]): Tone {
  if (items.every((item) => item.status === "verificado")) return "ok";
  if (items.some((item) => item.status === "parcial")) return "attention";
  return "neutral";
}

/** Barras por domínio: quantos indicadores comprovados sobre o total do domínio. */
export function DomainBars({ onSelect }: { onSelect?: (indicatorId: string) => void }) {
  const domains = Array.from(new Set(HEALTH_INDICATORS.map((i) => i.domain)));
  return (
    <ul className="space-y-2">
      {domains.map((d) => {
        const items = HEALTH_INDICATORS.filter((i) => i.domain === d);
        const done = items.filter((i) => i.status === "verificado").length;
        const tone = domainTone(items);
        const first = items[0]!;
        const Icon = first.icon;
        const body = (
          <>
            <span className="flex items-center gap-2 text-xs">
              <Icon className={cn("h-3.5 w-3.5", TONE_TEXT[tone])} aria-hidden="true" />
              <span className="min-w-0 flex-1">{d}</span>
              <span className="font-mono text-[10px] text-muted-foreground">
                {done} de {items.length} comprovados
              </span>
            </span>
            <span className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full border border-border/50">
              <span
                className={cn(TONE_FILL[done > 0 ? "ok" : tone])}
                style={{ width: `${Math.max((done / items.length) * 100, done > 0 ? 6 : 100)}%` }}
                aria-hidden="true"
              />
            </span>
          </>
        );
        return (
          <li key={d}>
            {onSelect ? (
              <button
                type="button"
                onClick={() => onSelect(first.id)}
                aria-label={`Abrir indicadores do domínio ${d} na coluna de contexto`}
                className="motion-safe:transition-colors block w-full rounded-lg border border-border/50 bg-surface-1/40 p-2 text-left outline-none hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"
              >
                {body}
              </button>
            ) : (
              <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Saúde Geral. Sem metodologia de peso publicada, o score não é calculável —
 * mostramos isso de forma explícita e exibimos cobertura de evidência à parte.
 */
export function OverallHealth({ onOpen, selected }: { onOpen?: () => void; selected?: boolean }) {
  const c = healthCoverage();
  const inner = (
    <>
      <div className="flex items-start gap-2">
        <HeartPulse className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-sm font-semibold">Saúde Geral</p>
        <InfoTip text="Score único do ecossistema. Só pode existir com metodologia de peso publicada e série histórica; sem isso mostramos cobertura de evidência, não saúde." />
      </div>
      <p className="mt-2 font-display text-lg font-semibold text-muted-foreground">
        NÃO CALCULÁVEL
      </p>
      <p className="text-[11px] text-muted-foreground">{c.reason}</p>
      <div className="mt-3">
        <Ring
          value={c.verificado}
          total={c.total}
          tone="attention"
          caption={`Cobertura de evidência: ${c.verificado} de ${c.total} indicadores comprovados. Meta: ${c.total} de ${c.total}. Tendência: sem série histórica.`}
        />
      </div>
      <dl className="mt-3 grid gap-1 text-[11px] text-muted-foreground sm:grid-cols-2">
        <div>
          <dt className="uppercase tracking-wide">Meta</dt>
          <dd>score exige metodologia de peso publicada</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Última atualização</dt>
          <dd>calculado no carregamento, a partir dos indicadores</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Fonte / proveniência</dt>
          <dd>indicadores do CORE (registries, migrações e medições reais)</dd>
        </div>
        <div>
          <dt className="uppercase tracking-wide">Composição do score</dt>
          <dd>peso por indicador não definido / NOT_VERIFIED</dd>
        </div>
      </dl>
      <div className="mt-2">
        <TruthBadge truth="NOT_VERIFIED" />
      </div>
    </>
  );

  if (!onOpen) {
    return <div className="rounded-xl border border-border/60 bg-card/70 p-4">{inner}</div>;
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={!!selected}
      aria-label="Abrir Saúde Geral na coluna de contexto"
      className={cn(
        "motion-safe:transition-[transform,box-shadow,border-color] rounded-xl border bg-card/70 p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary/70 bg-primary/10 shadow-[var(--shadow-glow)]"
          : "border-border/60 hover:border-primary/50 hover:shadow-[var(--shadow-glow)] motion-safe:hover:-translate-y-[2px] active:translate-y-0",
      )}
    >
      {inner}
    </button>
  );
}

/** Bloco “Melhorar hoje”: 3–5 ações ordenadas por impacto/urgência, com CTA real. */
export function NextActionsPanel({ limit = 4 }: { limit?: number }) {
  return (
    <Panel
      title="Melhorar hoje"
      action={
        <Badge variant="outline" className="text-[10px]">
          ordenado por impacto e urgência
        </Badge>
      }
    >
      <p className="flex items-start gap-2 text-xs text-muted-foreground">
        <ListChecks className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
        Cada ação nasce de um indicador e leva a uma rota existente. Impacto quantitativo só é
        mostrado quando o denominador está declarado; esforço não é estimado sem base histórica.
      </p>
      <ul className="mt-2 space-y-2">
        {NEXT_ACTIONS.slice(0, limit).map((a) => (
          <li
            key={a.id}
            className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-xs sm:flex sm:items-center sm:gap-3"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[10px] text-muted-foreground">{a.id}</span>
                <span className="font-medium">{a.title}</span>
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", TONE_TEXT[URGENCY_TONE[a.urgency]])}
                >
                  {URGENCY_LABEL[a.urgency]}
                </Badge>
              </div>
              <p className="mt-1 text-muted-foreground">Impacto esperado: {a.impact}</p>
              <p className="text-[11px] text-muted-foreground">
                {a.effort} · {a.owner} · {a.due} · origem: {a.origin}
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="mt-2 shrink-0 sm:mt-0">
              <Link to={a.to}>
                {a.ctaLabel}
                <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </Panel>
  );
}
