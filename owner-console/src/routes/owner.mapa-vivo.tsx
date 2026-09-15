import { createFileRoute } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { CaseFile } from "@/components/lamou/case-file";
import { DemoBadge, PageHeader, Panel } from "@/components/lamou/shell";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLamou } from "@/lib/lamou/store";
import { type Severity } from "@/lib/lamou/types";
import { cn } from "@/lib/utils";

const SEV_DOT: Record<Severity, string> = {
  normal: "bg-success",
  tendencia: "bg-primary",
  probabilidade: "bg-warning",
  critico: "bg-destructive",
  falha: "bg-destructive",
};

type MapaVivoSearch = {
  case_id?: string;
};

function parseMapaVivoSearch(search: Record<string, unknown>): MapaVivoSearch {
  return typeof search.case_id === "string" && search.case_id.trim()
    ? { case_id: search.case_id }
    : {};
}

export const Route = createFileRoute("/owner/mapa-vivo")({
  validateSearch: parseMapaVivoSearch,
  head: () => ({
    meta: [
      { title: "Mapa Vivo — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Mapa vivo gerencial do ecossistema LAMOU IA: casos clicáveis com origem, sinal, evidência, teste, decisão, ação e resultado.",
      },
      { property: "og:title", content: "Mapa Vivo — LAMOU IA Central" },
      {
        property: "og:description",
        content: "Cidade LAMOU IA com bairros, ocorrências e ficha lateral de cada caso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MapaVivo,
});

function MapaVivo() {
  const { cases } = useLamou();
  const { case_id: caseId } = Route.useSearch();
  const [selected, setSelected] = useState<string | null>(null);
  const [layer, setLayer] = useState<"todos" | "padrao" | "cubo">("todos");

  useEffect(() => {
    if (caseId && cases.some((item) => item.id === caseId)) {
      setSelected(caseId);
    }
  }, [caseId, cases]);

  const nodes = cases.filter((c) => layer === "todos" || c.layer === layer);

  return (
    <AppShell group="owner">
      <PageHeader
        title="Mapa Vivo"
        subtitle="LAMOU IA é a cidade; o CORE é um bairro dentro dela. O objeto de raciocínio é o caso, não a decoração do mapa."
        right={
          <>
            <DemoBadge />
            <div className="flex gap-1 rounded-lg border border-border/60 bg-card/70 p-1">
              {(["todos", "padrao", "cubo"] as const).map((l) => (
                <Tooltip key={l}>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant={layer === l ? "secondary" : "ghost"}
                      className="h-7 px-2 text-xs"
                      onClick={() => setLayer(l)}
                      aria-pressed={layer === l}
                    >
                      {l === "todos" ? (
                        "Tudo"
                      ) : l === "padrao" ? (
                        <Sun className="h-4 w-4" />
                      ) : (
                        <Moon className="h-4 w-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {l === "todos"
                      ? "Todos os bairros"
                      : l === "padrao"
                        ? "CORE Padrão — referência operacional corrente"
                        : "CORE Cubo — candidatas e experiências"}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_420px]">
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-surface-1/50 p-3 backdrop-blur">
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.74 0.15 218 / 0.08) 1px, transparent 1px), linear-gradient(90deg, oklch(0.74 0.15 218 / 0.08) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
            aria-hidden="true"
          />
          <ul className="relative h-[300px] sm:h-[340px]">
            {nodes.map((c) => (
              <li
                key={c.id}
                className="absolute"
                style={{ left: `${Math.min(92, c.x)}%`, top: `${Math.min(90, c.y)}%` }}
              >
                <button
                  onClick={() => setSelected(c.id)}
                  aria-label={`Abrir caso ${c.id} — ${c.title}`}
                  className={cn(
                    "flex max-w-[176px] items-center gap-1.5 rounded-full border border-border/60 bg-card/90 px-2 py-1 text-left text-[11px] leading-tight shadow-sm outline-none transition-colors hover:border-primary/60 hover:shadow-[0_0_0_3px_oklch(0.74_0.15_218/0.15)] focus-visible:ring-2 focus-visible:ring-ring",
                    selected === c.id && "border-primary bg-primary/15",
                  )}
                >
                  <span
                    className={cn(
                      "h-2 w-2 shrink-0 rounded-full",
                      SEV_DOT[c.severity],
                      c.occurrence && "animate-pulse",
                    )}
                  />
                  <span className="truncate">{c.title}</span>
                  {c.layer === "padrao" ? (
                    <Sun className="h-2.5 w-2.5 shrink-0 text-warning" />
                  ) : (
                    <Moon className="h-2.5 w-2.5 shrink-0 text-violet" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-4 xl:max-h-[calc(100vh-6rem)] xl:overflow-y-auto xl:pr-1">
          {selected ? (
            <CaseFile caseId={selected} onClose={() => setSelected(null)} />
          ) : (
            <Panel title="Ficha do caso">
              <p className="text-sm text-muted-foreground">
                Selecione um nó no mapa: a ficha abre aqui mesmo, em abas — Resumo,
                Fonte/Proveniência, Hipótese, Plano/Ação, Evidências e Histórico. Nenhum clique abre
                outra tela.
              </p>
            </Panel>
          )}

          <Panel title="Legenda">
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>Ponto pulsando: ocorrência ativa.</li>
              <li className="flex items-center gap-2">
                <Sun className="h-3 w-3 text-warning" /> referência operacional corrente.
              </li>
              <li className="flex items-center gap-2">
                <Moon className="h-3 w-3 text-violet" /> candidatas e experiências.
              </li>
            </ul>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}
