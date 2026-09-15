import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { TruthState } from "@/lib/lamou/council-data";
import { cn } from "@/lib/utils";

export function CoreMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-7 w-7", className)} aria-hidden="true">
      <defs>
        <linearGradient id="lamou-core" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.85 0.13 200)" />
          <stop offset="100%" stopColor="oklch(0.66 0.19 296)" />
        </linearGradient>
      </defs>
      <path d="M16 2 29 9v14L16 30 3 23V9z" fill="none" stroke="url(#lamou-core)" strokeWidth="1.6" />
      <path d="M16 2v12M16 14 3 9M16 14l13-5M16 14v16" fill="none" stroke="url(#lamou-core)" strokeWidth="1.1" opacity="0.75" />
    </svg>
  );
}

const TRUTH_TONE: Record<string, string> = {
  "FACT/EVIDENCED": "border-success/40 text-success",
  IMPLEMENTED_VERIFIED: "border-success/40 text-success",
  EXTERNAL_EVIDENCE: "border-primary/40 text-primary",
  PARTIAL: "border-warning/40 text-warning",
  IMPLEMENTED_NOT_VERIFIED: "border-warning/40 text-warning",
  HYPOTHESIS: "border-violet/50 text-violet",
  SYNTHETIC_DEMO: "border-demo/50 text-demo",
  SIMULATED: "border-demo/50 text-demo",
  NOT_VERIFIED: "border-muted-foreground/40 text-muted-foreground",
  DOCUMENTED_ONLY: "border-muted-foreground/40 text-muted-foreground",
  NOT_CONNECTED: "border-destructive/40 text-destructive",
  BLOCKED: "border-destructive/50 text-destructive",
  NOT_APPLICABLE: "border-muted-foreground/30 text-muted-foreground",
};

export function TruthBadge({ truth, hint }: { truth: TruthState | string; hint?: string }) {
  const badge = (
    <Badge variant="outline" className={cn("font-mono text-[10px] tracking-wide", TRUTH_TONE[truth] ?? "")}>
      {truth}
    </Badge>
  );
  if (!hint) return badge;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0} className="rounded outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {badge}
        </span>
      </TooltipTrigger>
      <TooltipContent>{hint}</TooltipContent>
    </Tooltip>
  );
}

export function DemoBadge({ label = "DEMO / SIMULADO" }: { label?: string }) {
  return (
    <Badge variant="outline" className="border-demo/50 text-demo text-[10px] font-mono">
      {label}
    </Badge>
  );
}

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle: string;
  right?: ReactNode;
}) {
  return (
    <header className="flex flex-col gap-3 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {right ? <div className="flex flex-wrap items-center gap-2">{right}</div> : null}
    </header>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("border-border/60 bg-card/70 backdrop-blur", className)}>
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <CardTitle className="text-sm font-semibold tracking-wide text-foreground/90">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">{children}</CardContent>
    </Card>
  );
}

export function NotConnected({ what, next }: { what: string; next: string }) {
  return (
    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm">
      <div className="flex items-center gap-2">
        <TruthBadge truth="NOT_CONNECTED" />
        <span className="font-medium">{what}</span>
      </div>
      <p className="mt-1 text-muted-foreground">Próximo passo: {next}</p>
    </div>
  );
}
