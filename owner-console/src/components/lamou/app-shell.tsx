import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun } from "lucide-react";
import { useState, type ReactNode } from "react";

import { OwnerOfficialIcon } from "@/components/lamou/owner-official-icon";
import { OwnerGuard } from "@/components/lamou/owner-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { OWNER_OFFICIAL_ICON_BY_LABEL } from "@/lib/lamou/icon-governance";
import { NAV_GROUPS, type NavGroup } from "@/lib/lamou/nav";
import { cn } from "@/lib/utils";

export function AppShell({ group, children }: { group: NavGroup; children: ReactNode }) {
  return (
    <OwnerGuard>
      <AppShellChrome group={group}>{children}</AppShellChrome>
    </OwnerGuard>
  );
}

function AppShellChrome({ group, children }: { group: NavGroup; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // "apps" não é superfície raiz: um aplicativo é aberto a partir da Central,
  // então o menu lateral continua sendo o da Central.
  const surface: "owner" | "labtest" | "core" =
    group === "core" ? "core" : group === "labtest" ? "labtest" : "owner";
  const active = NAV_GROUPS.find((g) => g.group === surface) ?? NAV_GROUPS[0]!;

  return (
    <TooltipProvider delayDuration={200}>
      <div
        className={cn(
          "lamou-shell-depth min-h-screen bg-background text-foreground",
          light && "lamou-light",
        )}
      >
        <a href="#main-content" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <div className="flex">
          <aside
            id="lamou-primary-nav"
            aria-label="Navegação principal LAMOU"
            className={cn(
              "fixed inset-y-0 left-0 z-40 w-72 shrink-0 overflow-y-auto border-r border-border/60 bg-surface-1/95 p-3 backdrop-blur transition-transform lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
              open ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg px-2 py-3 hover:bg-surface-2"
            >
              <OwnerOfficialIcon code="OWNER-ICO-001" className="h-9 w-9" />
              <span className="leading-tight">
                <span className="block font-display text-sm font-semibold">LAMOU IA</span>
                <span className="block text-[11px] text-muted-foreground">
                  CORE PROPRIETÁRIO / OWNER
                </span>
              </span>
            </Link>

            <div
              role="navigation"
              aria-label="Superfícies LAMOU"
              className="mt-2 grid grid-cols-3 gap-1 rounded-lg bg-surface-2/60 p-1"
            >
              {NAV_GROUPS.map((g) => (
                <Link
                  key={g.group}
                  to={g.items[0]!.to}
                  onClick={() => setOpen(false)}
                  aria-current={g.group === surface ? "page" : undefined}
                  className={cn(
                    "rounded-md px-2 py-1.5 text-center text-[11px] font-medium transition-colors",
                    g.group === surface
                      ? "bg-primary/20 text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {g.short}
                </Link>
              ))}
            </div>
            {group === "apps" ? (
              <p className="mt-2 rounded-md border border-border/50 bg-surface-1/50 px-2 py-1.5 text-[10px] text-muted-foreground">
                Aplicativo aberto a partir da Central &gt; Aplicativos.
              </p>
            ) : null}

            <p className="mt-4 px-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              {active.label} · {active.sub}
            </p>
            <nav aria-label={`${active.label}: navegação`} className="mt-2 space-y-1 pb-8">
              {active.items.map(({ to, label, icon: Icon }) => {
                const isRoot = to === "/owner" || to === "/core" || to === "/labtest";
                const isActive = isRoot ? pathname === to : pathname.startsWith(to);
                const officialCode = OWNER_OFFICIAL_ICON_BY_LABEL[label];
                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                      isActive
                        ? "bg-primary/15 text-foreground shadow-[inset_0_0_0_1px_oklch(0.74_0.15_218/0.35)]"
                        : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                    )}
                  >
                    {officialCode ? (
                      <OwnerOfficialIcon code={officialCode} className="h-6 w-6" />
                    ) : (
                      <Icon
                        className="h-4 w-4 shrink-0"
                        aria-hidden="true"
                        data-icon-source="lucide-fallback"
                      />
                    )}
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <div className="min-w-0 flex-1">
            <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/85 px-4 backdrop-blur">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                aria-label="Abrir menu"
                aria-expanded={open}
                aria-controls="lamou-primary-nav"
                onClick={() => setOpen((v) => !v)}
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
              <Badge
                variant="outline"
                className="border-warning/40 font-mono text-[10px] text-warning"
              >
                CANDIDATE_NOT_PROMOTED
              </Badge>
              <div
                className="hidden items-center gap-1 md:flex"
                aria-label="Contexto de execução do ambiente"
              >
                <Badge variant="outline" className="border-primary/35 font-mono text-[9px]">
                  SOL · CURRENT
                </Badge>
                <Badge
                  variant="outline"
                  className="border-violet/40 font-mono text-[9px] text-violet"
                >
                  LUA · LAB
                </Badge>
                <Badge variant="outline" className="border-demo/40 font-mono text-[9px] text-demo">
                  DEMO · QUANDO MARCADO
                </Badge>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={light ? "Ativar tema escuro" : "Ativar tema claro"}
                  aria-pressed={light}
                  onClick={() => setLight((v) => !v)}
                >
                  {light ? (
                    <Moon className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Sun className="h-4 w-4" aria-hidden="true" />
                  )}
                </Button>
                <Badge
                  variant="outline"
                  className="hidden border-primary/40 text-primary sm:inline-flex"
                >
                  OWNER
                </Badge>
              </div>
            </header>
            <main
              id="main-content"
              tabIndex={-1}
              className="mx-auto w-full max-w-[1400px] space-y-6 px-4 py-6 pb-24 md:px-6"
            >
              {children}
            </main>
          </div>
        </div>
        {open ? (
          <button
            type="button"
            aria-label="Fechar menu"
            className="fixed inset-0 z-30 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}
      </div>
    </TooltipProvider>
  );
}
