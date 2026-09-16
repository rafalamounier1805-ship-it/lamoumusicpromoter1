import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info,
  Laptop,
  Lock,
  Moon,
  Sun,
  type LucideIcon,
} from "lucide-react";
import { type ReactNode, useCallback, useEffect, useState } from "react";

import { CoreMark, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { TruthState } from "@/lib/lamou/council-data";
import { cn } from "@/lib/utils";

export const OWNER_INSTALL_KEY = "lamou.install.owner";
export const CLIENT_INSTALL_KEY = "lamou.install.client";

/* ------------------------------------------------------------------ estado */

export function markInstallDone(key: string) {
  try {
    localStorage.setItem(key, new Date().toISOString());
  } catch {
    /* storage indisponível */
  }
}

export function useInstallDone(key: string) {
  const [done, setDone] = useState<string | null>(null);
  useEffect(() => {
    try {
      setDone(localStorage.getItem(key));
    } catch {
      setDone(null);
    }
  }, [key]);
  return done;
}

/** Progresso da jornada persistido localmente (nunca segredos/API keys). */
function usePersistedNumber(key: string, fallback: number) {
  const [value, setValue] = useState(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null && Number.isFinite(Number(raw))) setValue(Number(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);
  const update = useCallback(
    (next: number) => {
      setValue(next);
      try {
        localStorage.setItem(key, String(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );
  return [value, update, ready] as const;
}

export type ThemeMode = "light" | "dark" | "auto";

/** Light / Dark / Automático — mesma arquitetura, tokens escopados por classe. */
export function useThemeMode(storageKey: string) {
  const [mode, setMode] = useState<ThemeMode>("light");
  const [systemDark, setSystemDark] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === "light" || raw === "dark" || raw === "auto") setMode(raw);
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const change = useCallback(
    (next: ThemeMode) => {
      setMode(next);
      try {
        localStorage.setItem(storageKey, next);
      } catch {
        /* ignore */
      }
    },
    [storageKey],
  );

  const isLight = mode === "light" || (mode === "auto" && !systemDark);
  return { mode, setMode: change, isLight };
}

export function ThemeModeSwitch({
  mode,
  onChange,
}: {
  mode: ThemeMode;
  onChange: (m: ThemeMode) => void;
}) {
  const options: { key: ThemeMode; label: string; icon: LucideIcon }[] = [
    { key: "light", label: "Claro", icon: Sun },
    { key: "dark", label: "Escuro", icon: Moon },
    { key: "auto", label: "Automático", icon: Laptop },
  ];
  return (
    <div
      role="group"
      aria-label="Tema da interface"
      className="flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface-1 p-1"
    >
      {options.map((o) => (
        <button
          key={o.key}
          type="button"
          onClick={() => onChange(o.key)}
          aria-pressed={mode === o.key}
          aria-label={`Tema ${o.label}`}
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
            mode === o.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <o.icon className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ------------------------------------------------------- blocos reutilizáveis */

export function ReadinessDonut({
  percent,
  label,
  sub,
}: {
  percent: number;
  label: string;
  sub?: string;
}) {
  const pct = Math.max(0, Math.min(100, Math.round(percent)));
  const r = 34;
  const c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 80 80"
        className="h-20 w-20 shrink-0"
        role="img"
        aria-label={`${label}: ${pct}%`}
      >
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--color-border)" strokeWidth="8" />
        <circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(c * pct) / 100} ${c}`}
          transform="rotate(-90 40 40)"
        />
        <text
          x="40"
          y="45"
          textAnchor="middle"
          className="fill-foreground font-mono text-[15px] font-semibold"
        >
          {pct}%
        </text>
      </svg>
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {sub ? <p className="text-xs text-muted-foreground">{sub}</p> : null}
      </div>
    </div>
  );
}

export function StepSection({
  icon: Icon,
  title,
  description,
  children,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <h3 className="text-sm font-semibold">{title}</h3>
            {description ? (
              <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className="mt-4 space-y-3 text-sm">{children}</div>
    </section>
  );
}

export function CheckRow({
  icon: Icon,
  label,
  source,
  updatedAt,
  truth,
  detail,
  impact = "Bloqueia ou reduz a confiabilidade da ativação.",
  owner = "Equipe CORE do proprietário",
  nextStep = "Revisar o requisito e conectar a superfície responsável.",
  action,
}: {
  icon: LucideIcon;
  label: string;
  source: string;
  updatedAt: string;
  truth: TruthState | string;
  detail: string;
  impact?: string;
  owner?: string;
  nextStep?: string;
  action?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative rounded-lg border border-border bg-surface-1 p-3 pr-11 transition-colors hover:border-primary/40 focus-within:border-primary/50">
      <TooltipProvider delayDuration={180}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`Informações sobre ${label}`}
              className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Info className="h-4 w-4" aria-hidden="true" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-64">
            {detail} Fonte: {source}.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex sm:justify-between"
      >
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{label}</p>
            <p className="truncate font-mono text-[10px] text-muted-foreground">
              {source} · atualizado {updatedAt}
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pr-1">
          <TruthBadge truth={truth} />
        </div>
      </button>
      {open ? (
        <div className="mt-3 space-y-3 rounded-md border border-border bg-surface-2 p-3 text-xs">
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Origem / fonte</dt>
              <dd className="mt-0.5 font-mono">{source}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="mt-0.5">
                <TruthBadge truth={truth} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Impacto</dt>
              <dd className="mt-0.5">{impact}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Responsável</dt>
              <dd className="mt-0.5">{owner}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Última verificação</dt>
              <dd className="mt-0.5">{updatedAt}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Próximo passo</dt>
              <dd className="mt-0.5">{nextStep}</dd>
            </div>
          </dl>
          <p className="text-muted-foreground">{detail}</p>
          <div className="flex flex-wrap items-center gap-2">
            {action ?? (
              <Button variant="outline" size="sm" disabled>
                Superfície ainda não conectada
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function StatusActionLink({
  to,
  children,
  variant = "outline",
}: {
  to:
    | "/owner"
    | "/owner/mapa-vivo"
    | "/owner/apps"
    | "/owner/plans"
    | "/owner/settings"
    | "/owner/security"
    | "/owner/documents"
    | "/owner/integrations"
    | "/core"
    | "/core/tests"
    | "/core/observability"
    | "/core/settings"
    | "/labtest";
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <Button asChild variant={variant} size="sm">
      <Link to={to}>
        {children}
        <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </Button>
  );
}

export function Note({
  tone = "info",
  children,
}: {
  tone?: "info" | "warning" | "blocked";
  children: ReactNode;
}) {
  const tones = {
    info: "border-primary/30 bg-primary/5 text-foreground",
    warning: "border-warning/40 bg-warning/10 text-foreground",
    blocked: "border-destructive/40 bg-destructive/10 text-foreground",
  } as const;
  return (
    <p className={cn("flex gap-2 rounded-lg border p-3 text-xs", tones[tone])}>
      <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}

/* ------------------------------------------------------------------ launcher */

export interface LauncherBullet {
  icon: LucideIcon;
  title: string;
  text: string;
}

export function InstallLauncher({
  kicker,
  headline,
  lead,
  version,
  bullets,
  aside,
  asideTitle,
  startLabel,
  onStart,
  footNote,
}: {
  kicker: string;
  headline: string;
  lead: string;
  version: string;
  bullets: LauncherBullet[];
  aside: { label: string; value: string; truth?: TruthState | string }[];
  asideTitle: string;
  startLabel: string;
  onStart: () => void;
  footNote: string;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="relative overflow-hidden border-b border-border"
        style={{
          backgroundImage:
            "radial-gradient(1000px 520px at 82% -18%, oklch(0.66 0.19 296 / 0.28), transparent 62%), radial-gradient(900px 480px at 6% 0%, oklch(0.74 0.15 218 / 0.26), transparent 64%), linear-gradient(160deg, oklch(0.19 0.05 262), oklch(0.13 0.04 262))",
        }}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-14">
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 sm:flex sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <CoreMark className="h-9 w-9 shrink-0" />
              <div className="min-w-0">
                <p className="font-display text-base font-semibold tracking-tight text-[oklch(0.97_0.01_250)]">
                  LAMOU IA
                </p>
                <p className="truncate text-xs text-[oklch(0.78_0.03_250)]">{kicker}</p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="shrink-0 border-[oklch(0.74_0.15_218/0.5)] font-mono text-[10px] text-[oklch(0.85_0.13_200)]"
            >
              {version}
            </Badge>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <h1 className="font-display text-3xl font-semibold tracking-tight text-[oklch(0.98_0.01_250)] md:text-4xl">
                {headline}
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-[oklch(0.82_0.02_250)] md:text-base">
                {lead}
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {bullets.map((b) => (
                  <div
                    key={b.title}
                    className="rounded-xl border border-[oklch(0.98_0.01_250/0.14)] bg-[oklch(0.98_0.01_250/0.05)] p-3 backdrop-blur"
                  >
                    <div className="flex items-center gap-2">
                      <b.icon
                        className="h-4 w-4 shrink-0 text-[oklch(0.85_0.13_200)]"
                        aria-hidden="true"
                      />
                      <p className="text-sm font-medium text-[oklch(0.97_0.01_250)]">{b.title}</p>
                    </div>
                    <p className="mt-1 text-xs text-[oklch(0.8_0.02_250)]">{b.text}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button size="lg" onClick={onStart} className="gap-2">
                  {startLabel} <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="text-[oklch(0.85_0.02_250)] hover:text-[oklch(0.98_0.01_250)]"
                >
                  <Link to="/">Voltar ao início</Link>
                </Button>
              </div>
              <p className="mt-4 max-w-2xl text-xs text-[oklch(0.75_0.02_250)]">{footNote}</p>
            </div>

            <aside className="rounded-2xl border border-[oklch(0.98_0.01_250/0.16)] bg-[oklch(0.98_0.01_250/0.06)] p-4 backdrop-blur">
              <h2 className="font-display text-sm font-semibold text-[oklch(0.97_0.01_250)]">
                {asideTitle}
              </h2>
              <dl className="mt-3 space-y-3">
                {aside.map((a) => (
                  <div
                    key={a.label}
                    className="border-b border-[oklch(0.98_0.01_250/0.1)] pb-2 last:border-0 last:pb-0"
                  >
                    <dt className="text-[11px] uppercase tracking-wide text-[oklch(0.72_0.02_250)]">
                      {a.label}
                    </dt>
                    <dd className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[oklch(0.92_0.01_250)]">
                      <span className="min-w-0">{a.value}</span>
                      {a.truth ? <TruthBadge truth={a.truth} /> : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- linha evolutiva */

export interface JourneyStep {
  key: string;
  title: string;
  short: string;
  icon: LucideIcon;
  description: string;
  content: ReactNode;
  aside?: ReactNode;
}

function Stepper({
  steps,
  index,
  onSelect,
}: {
  steps: JourneyStep[];
  index: number;
  onSelect: (i: number) => void;
}) {
  return (
    <nav aria-label="Linha de evolução da instalação" className="min-w-0">
      <ol className="scrollbar-thin flex min-w-0 items-start gap-0 overflow-x-auto pb-2">
        {steps.map((s, i) => {
          const done = i < index;
          const current = i === index;
          return (
            <li key={s.key} className="flex min-w-0 shrink-0 items-start">
              <button
                type="button"
                onClick={() => onSelect(i)}
                aria-current={current ? "step" : undefined}
                className="group flex w-[104px] flex-col items-center gap-1.5 rounded-lg px-1 py-1 text-center outline-none focus-visible:ring-2 focus-visible:ring-ring md:w-[126px]"
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-full border text-xs font-semibold transition-colors",
                    current && "border-primary bg-primary text-primary-foreground",
                    done && "border-success bg-success/15 text-success",
                    !current && !done && "border-border bg-surface-1 text-muted-foreground",
                  )}
                >
                  {done ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <s.icon className="h-4 w-4" aria-hidden="true" />
                  )}
                </span>
                <span
                  className={cn(
                    "text-[11px] leading-tight",
                    current ? "font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  {i + 1}. {s.short}
                </span>
              </button>
              {i < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    "mt-[18px] h-px w-4 shrink-0 md:w-6",
                    done ? "bg-success/60" : "bg-border",
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function InstallJourney({
  kind,
  title,
  subtitle,
  version,
  steps,
  storageKey,
  themeKey,
  launcher,
  finishTo,
  finishLabel,
  finishDisabledReason,
  showJourneyProgress = true,
}: {
  kind: "owner" | "client";
  title: string;
  subtitle: string;
  version: string;
  steps: JourneyStep[];
  storageKey: string;
  themeKey: string;
  launcher: Omit<Parameters<typeof InstallLauncher>[0], "onStart">;
  finishTo: "/owner" | "/owner/clients";
  finishLabel: string;
  /** Quando presente, "ativar ambiente" fica bloqueado e o motivo é exibido. */
  finishDisabledReason?: string;
  /** Mantém compatibilidade com jornadas legadas; o Owner usa apenas a linha das etapas. */
  showJourneyProgress?: boolean;
}) {
  const [phase, setPhase] = usePersistedNumber(`${storageKey}.phase`, 0);
  const [index, setIndex] = usePersistedNumber(`${storageKey}.step`, 0);
  const { mode, setMode, isLight } = useThemeMode(themeKey);
  const [finished, setFinished] = useState(false);

  const safeIndex = Math.min(Math.max(index, 0), steps.length - 1);
  const step = steps[safeIndex]!;
  const last = safeIndex === steps.length - 1;
  const percent = Math.round(((safeIndex + 1) / steps.length) * 100);

  if (phase === 0) {
    return (
      <div className="lamou-dark">
        <InstallLauncher {...launcher} onStart={() => setPhase(1)} />
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen bg-background text-foreground", isLight && "lamou-light")}>
      <div className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-8">
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:flex sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <CoreMark className="h-8 w-8 shrink-0" />
            <div className="min-w-0">
              <h1 className="truncate font-display text-lg font-semibold tracking-tight md:text-xl">
                {title}
              </h1>
              <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <Badge variant="outline" className="font-mono text-[10px]">
              {kind === "owner" ? "PROPRIETÁRIO" : "CLIENTE / TENANT"}
            </Badge>
            <Badge variant="outline" className="font-mono text-[10px]">
              {version}
            </Badge>
            <ThemeModeSwitch mode={mode} onChange={setMode} />
            <Button variant="ghost" size="sm" onClick={() => setPhase(0)}>
              Boas-vindas
            </Button>
          </div>
        </header>

        <div className="mt-5 rounded-xl border border-border bg-card px-3 pb-1 pt-3 shadow-sm md:px-4">
          <Stepper steps={steps} index={safeIndex} onSelect={setIndex} />
          {showJourneyProgress ? (
            <p className="border-t border-border py-2 text-right font-mono text-xs text-muted-foreground">
              {percent}% · etapa {safeIndex + 1} de {steps.length}
            </p>
          ) : null}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_300px]">
          <main className="min-w-0 space-y-4">
            <div className="rounded-xl border border-border bg-surface-1 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/12 text-primary">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <h2 className="font-display text-lg font-semibold">
                    {safeIndex + 1}. {step.title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            </div>

            {step.content}

            <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card p-3 shadow-sm">
              <Button
                variant="outline"
                size="sm"
                disabled={safeIndex === 0}
                onClick={() => setIndex(Math.max(0, safeIndex - 1))}
              >
                <ChevronLeft className="mr-1 h-4 w-4" aria-hidden="true" /> Etapa anterior
              </Button>
              {last ? (
                finished ? (
                  <Button asChild size="sm">
                    <Link to={finishTo}>{finishLabel}</Link>
                  </Button>
                ) : (
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {finishDisabledReason ? (
                      <span className="text-xs text-muted-foreground">{finishDisabledReason}</span>
                    ) : null}
                    <Button
                      size="sm"
                      disabled={Boolean(finishDisabledReason)}
                      onClick={() => {
                        markInstallDone(storageKey);
                        setFinished(true);
                      }}
                    >
                      {kind === "owner" ? "Ativar meu ambiente" : "Ativar ambiente do cliente"}
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <Link to={finishTo}>{finishLabel}</Link>
                    </Button>
                  </div>
                )
              ) : (
                <Button
                  size="sm"
                  onClick={() => setIndex(Math.min(steps.length - 1, safeIndex + 1))}
                >
                  Avançar <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Button>
              )}
            </div>
          </main>

          <aside className="min-w-0 space-y-4 lg:sticky lg:top-6 lg:self-start">
            {showJourneyProgress ? (
              <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
                <ReadinessDonut
                  percent={percent}
                  label="Progresso da jornada"
                  sub="Progresso de interface. Prontidão técnica é medida na etapa de testes."
                />
              </div>
            ) : null}
            {step.aside}
            <p className="rounded-xl border border-border bg-surface-1 p-3 text-xs leading-relaxed text-muted-foreground">
              Progresso e preferências ficam salvos neste navegador — você pode pausar e continuar
              depois. Senhas, chaves e segredos nunca são gravados aqui.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
