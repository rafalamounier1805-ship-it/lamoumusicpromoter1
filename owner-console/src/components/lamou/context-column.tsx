import { Info, X } from "lucide-react";
import type { ReactNode } from "react";

import { TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

/** Semântica de cor única do console: vermelho só para crítico/bloqueio real. */
export type Tone = "critical" | "attention" | "ok" | "info" | "neutral";

export const TONE_TEXT: Record<Tone, string> = {
  critical: "text-destructive",
  attention: "text-warning",
  ok: "text-success",
  info: "text-primary",
  neutral: "text-foreground",
};

export const TONE_BORDER: Record<Tone, string> = {
  critical: "border-destructive/45",
  attention: "border-warning/45",
  ok: "border-success/40",
  info: "border-primary/35",
  neutral: "border-border/60",
};

export const TONE_FILL: Record<Tone, string> = {
  critical: "bg-destructive",
  attention: "bg-warning",
  ok: "bg-success",
  info: "bg-primary",
  neutral: "bg-muted-foreground",
};

/** Glossário: nenhum termo técnico aparece sem explicação curta. */
export const TERMS: Record<string, string> = {
  capability:
    "Capability = capacidade técnica que o CORE oferece e que os aplicativos consomem (ex.: busca, validação, geração de texto).",
  saudeCore:
    "Saúde do CORE = estado técnico consolidado (interface, dados, autenticação, testes, versão, evidência).",
  indicador:
    "Indicador de saúde = medida de uma área técnica, com valor atual, meta e origem declarada.",
  PARTIAL:
    "PARTIAL = parcialmente implementado ou parcialmente comprovado. Sempre precisa dizer parcial de quê.",
  NOT_CONNECTED:
    "NOT_CONNECTED = a integração não existe neste ambiente; nada é medido nem enviado por aqui.",
  NOT_VERIFIED: "NOT_VERIFIED = não existe execução ou evidência que comprove o número.",
  SYNTHETIC_DEMO: "SYNTHETIC_DEMO = número de demonstração, criado para exercitar a tela.",
  HYPOTHESIS: "HYPOTHESIS = suposição de trabalho, ainda sem evidência.",
  benchmark: "Benchmark = referência externa usada para comparar o valor atual.",
  meta: "Meta = valor combinado que caracteriza o indicador como saudável.",
  proveniencia:
    "Proveniência = de onde o dado veio: sistema, arquivo, pessoa, data e forma de coleta.",
  evidencia: "Evidência = artefato real (log, medição, print, documento) que sustenta o estado.",
};

/** Ícone “i”: apenas definição curta. Nunca substitui a ação do card. */
export function InfoTip({ text, className }: { text: string; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="note"
          tabIndex={0}
          aria-label={`Informação: ${text}`}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            "inline-flex h-5 w-5 shrink-0 cursor-help items-center justify-center rounded-full border border-border/70 text-muted-foreground outline-none hover:border-primary/50 hover:text-primary focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Info className="h-3 w-3" aria-hidden="true" />
        </span>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
    </Tooltip>
  );
}

/** Termo técnico com definição em linguagem simples. */
export function Term({ term, label }: { term: keyof typeof TERMS | string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <span>{label ?? term}</span>
      <InfoTip text={TERMS[term] ?? String(term)} />
    </span>
  );
}

/** Explica PARTIAL/NOT_CONNECTED sem deixar rótulo solto. */
export function truthMeaning(truth: string, note?: string): string {
  if (truth === "PARTIAL") return note ?? "parcial sem denominador verificado";
  if (truth === "NOT_CONNECTED") return note ?? "integração ausente neste ambiente";
  if (truth === "NOT_VERIFIED") return note ?? "sem execução que comprove";
  return note ?? TERMS[truth] ?? truth;
}

export function Sparkline({
  values,
  tone = "info",
  className,
}: {
  values: number[];
  tone?: Tone;
  className?: string;
}) {
  if (values.length < 2) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const span = max - min || 1;
  const d = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * 100;
      const y = 24 - ((v - min) / span) * 22 - 1;
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 24"
      preserveAspectRatio="none"
      className={cn("h-6 w-full", TONE_TEXT[tone], className)}
      aria-hidden="true"
    >
      <path d={d} fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

/** Barra com meta: sem valor numérico verificável, não desenha barra. */
export function MetricBar({
  value,
  total,
  tone = "info",
}: {
  value: number | null;
  total: number | null;
  tone?: Tone;
}) {
  if (value === null || total === null || total <= 0) {
    return <p className="text-[11px] text-muted-foreground">sem denominador verificável</p>;
  }
  const pct = Math.min(100, Math.round((value / total) * 100));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-1">
      <div className={cn("h-full rounded-full", TONE_FILL[tone])} style={{ width: `${pct}%` }} />
    </div>
  );
}

export interface KpiSpec {
  id: string;
  label: string;
  definition: string;
  value: string;
  /** Denominador/meta explícita — “11 de 11”, “meta não definida”. */
  target: string;
  trend?: string;
  meaning: string;
  source: string;
  updatedAt: string;
  owner: string;
  truth: string;
  tone: Tone;
  spark?: number[];
  ratio?: { value: number; total: number } | undefined;
}

/** Card de KPI: só parece clicável quando existe detalhe/ação real. */
export function KpiCard({
  kpi,
  selected = false,
  onOpen,
}: {
  kpi: KpiSpec;
  selected?: boolean;
  onOpen?: (() => void) | undefined;
}) {
  const interactive = Boolean(onOpen);
  const body = (
    <>
      <div className="flex items-start gap-2">
        <p className="min-w-0 flex-1 text-xs text-muted-foreground">{kpi.label}</p>
        <InfoTip text={kpi.definition} />
      </div>
      <p className={cn("mt-1 font-display text-2xl font-semibold", TONE_TEXT[kpi.tone])}>
        {kpi.value}
      </p>
      <p className="text-[11px] text-muted-foreground">{kpi.target}</p>
      {kpi.spark ? <Sparkline values={kpi.spark} tone={kpi.tone} className="mt-1" /> : null}
      {kpi.ratio ? (
        <div className="mt-2">
          <MetricBar value={kpi.ratio.value} total={kpi.ratio.total} tone={kpi.tone} />
        </div>
      ) : null}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <TruthBadge truth={kpi.truth} />
        {kpi.trend ? (
          <Badge variant="outline" className="text-[10px]">
            {kpi.trend}
          </Badge>
        ) : null}
      </div>
      <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
        {kpi.updatedAt} · {kpi.owner}
      </p>
    </>
  );

  const base =
    "rounded-xl border bg-card/70 p-4 text-left backdrop-blur motion-safe:transition-[transform,box-shadow,border-color]";
  if (!interactive) {
    return (
      <div className={cn(base, TONE_BORDER[kpi.tone], "cursor-default")} aria-disabled>
        {body}
      </div>
    );
  }
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={selected}
      aria-label={`Abrir detalhe de ${kpi.label} na coluna de contexto`}
      className={cn(
        base,
        "w-full outline-none focus-visible:ring-2 focus-visible:ring-ring",
        selected
          ? "border-primary/70 bg-primary/10 shadow-[var(--shadow-glow)]"
          : cn(
              TONE_BORDER[kpi.tone],
              "hover:border-primary/50 hover:shadow-[var(--shadow-glow)] motion-safe:hover:-translate-y-[2px] active:translate-y-0",
            ),
      )}
    >
      {body}
    </button>
  );
}

export interface ColumnTab {
  id: string;
  label: string;
  content: ReactNode;
}

/**
 * Terceira coluna contextual: painel persistente à direita, sem modal e sem sheet flutuante.
 * A tela principal permanece visível; no celular a coluna vira bloco no fluxo.
 */
export function ContextColumn({
  title,
  subtitle,
  truth,
  badgeId,
  tabs,
  onClose,
  footer,
  empty,
}: {
  title?: string;
  subtitle?: string;
  truth?: string;
  badgeId?: string;
  tabs?: ColumnTab[];
  onClose?: () => void;
  footer?: ReactNode;
  empty?: string;
}) {
  return (
    <aside
      aria-label="Coluna de contexto"
      className="xl:sticky xl:top-4 xl:max-h-[calc(100dvh-2rem)] xl:overflow-y-auto scrollbar-thin rounded-xl border border-border/60 bg-card/80 backdrop-blur"
    >
      {!tabs || tabs.length === 0 ? (
        <div className="p-4 text-xs text-muted-foreground">
          {empty ?? "Selecione um card, KPI ou indicador para ver o detalhe aqui."}
        </div>
      ) : (
        <>
          <div className="flex items-start gap-2 border-b border-border/60 px-4 py-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                {badgeId ? (
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {badgeId}
                  </Badge>
                ) : null}
                {truth ? <TruthBadge truth={truth} hint={truthMeaning(truth)} /> : null}
              </div>
              <p className="mt-1 font-display text-sm font-semibold">{title}</p>
              {subtitle ? (
                <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
                  {subtitle}
                </p>
              ) : null}
            </div>
            {onClose ? (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={onClose}
                aria-label="Fechar coluna de contexto"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </Button>
            ) : null}
          </div>
          <Tabs defaultValue={tabs[0]!.id} className="px-3 py-3">
            <TabsList className="flex h-auto w-full flex-wrap justify-start gap-1 bg-transparent p-0">
              {tabs.map((t) => (
                <TabsTrigger
                  key={t.id}
                  value={t.id}
                  className="h-7 rounded-md border border-border/50 px-2 text-[11px] data-[state=active]:border-primary/60 data-[state=active]:bg-primary/10"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map((t) => (
              <TabsContent key={t.id} value={t.id} className="mt-3 space-y-2 text-xs">
                {t.content}
              </TabsContent>
            ))}
          </Tabs>
          {footer ? (
            <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3">
              {footer}
            </div>
          ) : null}
        </>
      )}
    </aside>
  );
}

/** Grade principal + terceira coluna. */
export function ContextLayout({ children, column }: { children: ReactNode; column: ReactNode }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_400px]">
      <div className="min-w-0 space-y-4">{children}</div>
      {column}
    </div>
  );
}

/** Linha rótulo → valor usada dentro da coluna. */
export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-xs leading-relaxed">{value}</p>
    </div>
  );
}
