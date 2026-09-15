import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { CoreDetailSurfaces } from "@/components/lamou/core-detail-surfaces";
import { PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { appRoute } from "@/lib/lamou/nav";
import { APP_PAGES } from "@/lib/lamou/pages";
import { CALL_REGISTRY, WAVE1_APPS } from "@/lib/lamou/registry";

export const Route = createFileRoute("/core/apps")({
  head: () => ({
    meta: [
      { title: "Apps & Bindings — LAMOU CORE" },
      {
        name: "description",
        content:
          "Visão técnica: APP-ID, capabilities do CORE, CALL-IDs, providers e adapters, dados, permissões, observabilidade e evidências de teste.",
      },
      { property: "og:title", content: "Apps & Bindings — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Binding técnico entre aplicativos e capabilities do CORE Proprietário, com CALL-IDs e estado de evidência.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoreAppsPage,
});

function slugFor(name: string) {
  return APP_PAGES.find((a) => a.name.toLowerCase().includes(name.toLowerCase()))?.slug ?? null;
}

function callsFor(name: string) {
  return CALL_REGISTRY.filter((c) => c.app.toLowerCase().includes(name.toLowerCase()));
}

function CoreAppsPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <AppShell group="core">
      <PageHeader
        title="Apps & Bindings"
        subtitle="Visão técnica do binding: APP-ID → capabilities do CORE → CALL-IDs → providers/adapters → dados → permissões → observabilidade → evidências. O portfólio gerencial fica na Central."
        right={<TruthBadge truth="PARTIAL" hint="Estado de verdade desta tela" />}
      />

      <div className="space-y-3">
        {WAVE1_APPS.map((a) => {
          const slug = slugFor(a.name);
          const calls = callsFor(a.name);
          const expanded = open === a.id;

          return (
            <article
              key={a.id}
              className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur"
            >
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {a.id}
                </Badge>
                <span className="min-w-0 flex-1 text-sm font-medium">{a.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  shell: {a.shell}
                </Badge>
                <TruthBadge truth={a.truth} />
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-7 px-2 text-xs"
                  aria-expanded={expanded}
                  onClick={() => setOpen(expanded ? null : a.id)}
                >
                  {expanded ? "Ocultar binding" : "Detalhe do binding"}
                </Button>
              </div>

              <p className="mt-2 text-xs text-muted-foreground">{a.purpose}</p>

              <div className="mt-2 flex flex-wrap gap-1">
                {a.capabilities.map((c) => (
                  <Badge key={c} variant="outline" className="text-[10px]">
                    {c}
                  </Badge>
                ))}
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {slug ? (
                  <Button asChild size="sm" variant="outline">
                    <Link to={appRoute(slug)}>Abrir aplicativo</Link>
                  </Button>
                ) : null}
                <Button asChild size="sm" variant="ghost">
                  <Link to="/core/ai">Providers, prompts &amp; VAs</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/core/data">Dados &amp; fontes</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/core/security">Permissões &amp; tenants</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/core/observability">Observabilidade</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/core/tests">Testes &amp; evidências</Link>
                </Button>
              </div>

              {expanded ? (
                <div className="mt-3 space-y-2 rounded-lg border border-border/50 bg-surface-1/40 p-3 text-[11px] text-muted-foreground">
                  <p>
                    <span className="text-foreground">CALL-IDs vinculados: </span>
                    {calls.length ? (
                      <span className="font-mono">{calls.map((c) => c.id).join(", ")}</span>
                    ) : (
                      "nenhum CALL declarado para este APP-ID no Registry"
                    )}
                  </p>
                  {calls.map((c) => (
                    <div key={c.id} className="rounded-md border border-border/50 bg-card/60 p-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px]">{c.id}</span>
                        <span className="min-w-0 flex-1">{c.fn}</span>
                        <TruthBadge truth={c.status} />
                      </div>
                      <p className="mt-1">
                        {c.source} → {c.target} · auth: {c.auth} · escopo: {c.scope} · dado:{" "}
                        {c.dataClass} · timeout {c.timeoutMs} ms · fallback: {c.fallback}
                      </p>
                      <p className="mt-1">
                        Testes de contrato: {c.tests.filter((t) => t.result === "PASS").length} PASS
                        / {c.tests.filter((t) => t.result === "NOT_RUN").length} NOT_RUN /{" "}
                        {c.tests.filter((t) => t.result === "FAIL").length} FAIL
                      </p>
                    </div>
                  ))}
                  <p>
                    <span className="text-foreground">Providers / plugins / adapters: </span>
                    nenhum provider configurado neste build — ver CORE &gt; IA, Prompts &amp; VAs.
                  </p>
                  <p>
                    <span className="text-foreground">Dados: </span>
                    somente fixtures locais; contrato de dado não conectado.
                  </p>
                  <p>
                    <span className="text-foreground">Permissões: </span>
                    RBAC declarado, isolamento de tenant ainda não testado.
                  </p>
                  <p>
                    <span className="text-foreground">Observabilidade: </span>
                    sem telemetria conectada.
                  </p>
                  {a.note ? (
                    <p>
                      <span className="text-foreground">Nota: </span>
                      {a.note}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <Panel title="Regra de binding">
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>Um app só abre rota real quando existir tela; ficha não é execução.</p>
          <p>
            Cada CALL exige contrato, escopo, fallback e teste próprio antes de virar evidência.
          </p>
          <p>
            Portfólio, clientes, contratos e valor não são inspecionados aqui: isso é{" "}
            <Link className="text-primary underline" to="/owner/apps">
              Central &gt; Aplicativos
            </Link>
            .
          </p>
          <p>
            CORE Cliente expõe apenas os bindings do próprio tenant — nunca este CORE Proprietário.
          </p>
        </div>
      </Panel>
      <CoreDetailSurfaces parent="Aplicativos, Plugins & Bindings" />
    </AppShell>
  );
}
