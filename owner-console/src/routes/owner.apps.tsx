import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APPS } from "@/lib/lamou/demo-data";
import { appRoute } from "@/lib/lamou/nav";
import { APP_PAGES } from "@/lib/lamou/pages";
import { WAVE1_APPS } from "@/lib/lamou/registry";
import { SEVERITY_LABEL } from "@/lib/lamou/types";

export { APP_ROUTES } from "@/lib/lamou/nav";

export const Route = createFileRoute("/owner/apps")({
  head: () => ({
    meta: [
      { title: "Aplicativos — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Portfólio gerencial dos aplicativos LAMOU: ID, objetivo, status, versão, clientes, saúde, valor comprovado, testes, CORE usado e ações.",
      },
      { property: "og:title", content: "Aplicativos — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Portfólio gerencial de aplicativos do proprietário: a Central gerencia o produto; a arquitetura técnica fica no CORE.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppsPage,
});

function product(name: string) {
  return APPS.find((p) => p.name.toLowerCase() === name.toLowerCase()) ?? null;
}

function binding(name: string) {
  return WAVE1_APPS.find((w) => name.toLowerCase().includes(w.name.toLowerCase())) ?? null;
}

function AppsPage() {
  const [openFicha, setOpenFicha] = useState<string | null>(null);

  return (
    <AppShell group="owner">
      <PageHeader
        title="Aplicativos"
        subtitle="Portfólio gerencial de aplicativos do proprietário. A Central gerencia o produto; a arquitetura técnica de cada app fica no LAMOU CORE."
        right={<DemoBadge />}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {APP_PAGES.map((a) => {
          const p = product(a.name);
          const b = binding(a.name);
          const executable = a.truth.startsWith("IMPLEMENTED");
          const ficha = openFicha === a.slug;

          return (
            <article
              key={a.slug}
              className="flex flex-col rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-sm font-semibold">{a.name}</p>
                <TruthBadge truth={a.truth} />
              </div>
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">{a.id}</p>
              <p className="mt-2 flex-1 text-xs text-muted-foreground">{a.purpose}</p>

              <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
                <Cell label="Status" value={p ? `${p.status}` : "sem ficha de produto"} />
                <Cell label="Versão" value={p ? `v${p.version}` : "não reconciliada"} />
                <Cell
                  label="Clientes"
                  value={p && p.clients.length ? p.clients.join(", ") : "nenhum"}
                />
                <Cell label="Saúde" value={p ? SEVERITY_LABEL[p.health] : "não avaliada"} />
                <Cell
                  label="Testes / evidências"
                  value={
                    p ? `${p.tests.passed} ok / ${p.tests.failed} falhas (DEMO)` : "sem execução"
                  }
                />
                <Cell
                  label="CORE usado"
                  value={
                    p
                      ? p.coreUsed
                          .map((c) => (c === "padrao" ? "CORE Padrão" : "CORE Cubo"))
                          .join(", ")
                      : "binding não reconciliado"
                  }
                />
              </dl>

              <div className="mt-3 rounded-lg border border-border/50 bg-surface-1/40 p-2">
                <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                  Valor / resultado
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="text-muted-foreground">
                    nenhum resultado comprovado neste build
                  </span>
                  <TruthBadge truth="NOT_VERIFIED" />
                </div>
              </div>

              {!executable ? (
                <p className="mt-3 rounded-lg border border-warning/40 bg-warning/10 p-2 text-[11px] text-warning">
                  APP NÃO IMPLEMENTADO / FICHA TÉCNICA — a rota abre a especificação do produto, não
                  uma execução real.
                </p>
              ) : null}

              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link to={appRoute(a.slug)}>Abrir aplicativo</Link>
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  aria-expanded={ficha}
                  onClick={() => setOpenFicha(ficha ? null : a.slug)}
                >
                  Ficha do produto
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/owner/plans">Resultados</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/owner/clients">Clientes</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/owner/versions">Versões</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link to="/owner/tests">Qualidade &amp; Evidências</Link>
                </Button>
              </div>

              {ficha ? (
                <div className="mt-3 space-y-2 rounded-lg border border-border/50 bg-surface-1/40 p-3 text-[11px] text-muted-foreground">
                  <p>
                    <span className="text-foreground">Objetivo: </span>
                    {a.purpose}
                  </p>
                  <p>
                    <span className="text-foreground">Estado declarado: </span>
                    {a.status}
                  </p>
                  <p>
                    <span className="text-foreground">Classificação de roadmap: </span>
                    Wave 1{b?.chainStep ? ` · etapa ${b.chainStep} da cadeia` : ""}
                  </p>
                  <p>
                    <span className="text-foreground">Capabilities CORE declaradas: </span>
                    {b ? b.capabilities.join(", ") : "não reconciliadas"}
                  </p>
                  <p>
                    <span className="text-foreground">Documentos: </span>
                    {a.docs.join(", ")}
                  </p>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/core/apps">Ver binding técnico no CORE</Link>
                  </Button>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>

      <Panel title="Fichas de produto (fixtures do catálogo)">
        <div className="space-y-3">
          {APPS.map((p) => (
            <div key={p.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-medium">
                  {p.id} · {p.name}
                </span>
                <Badge variant="outline" className="text-[10px]">
                  v{p.version} · {p.status}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  saúde: {SEVERITY_LABEL[p.health]}
                </Badge>
                <DemoBadge label="DEMO" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{p.summary}</p>
              <div className="mt-2 grid gap-2 text-[11px] text-muted-foreground md:grid-cols-2">
                <p>
                  <span className="text-foreground">CORE usado: </span>
                  {p.coreUsed.map((c) => (c === "padrao" ? "CORE Padrão" : "CORE Cubo")).join(", ")}
                </p>
                <p>
                  <span className="text-foreground">Tecnologia: </span>
                  {p.tech.join(", ")}
                </p>
                <p>
                  <span className="text-foreground">Clientes: </span>
                  {p.clients.length ? p.clients.join(", ") : "nenhum"}
                </p>
                <p>
                  <span className="text-foreground">Testes: </span>
                  {p.tests.passed} aprovados / {p.tests.failed} reprovados
                </p>
                <p>
                  <span className="text-foreground">Documentos: </span>
                  {p.docs.join(", ")}
                </p>
                <p>
                  <span className="text-foreground">Canais: </span>
                  {p.channels.map((c) => `${c.channel}${c.route ? "" : " (sem rota)"}`).join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Limite desta camada">
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            A Central gerencia portfólio, valor, clientes e qualidade. Bindings, CALLs, providers,
            dados, permissões e observabilidade ficam em{" "}
            <Link className="text-primary underline" to="/core/apps">
              LAMOU CORE &gt; Apps &amp; Bindings
            </Link>
            .
          </p>
          <p>
            Aplicativos licenciados de cliente permanecem fora daqui: eles pertencem ao Portal LAMOU
            IA Cliente, com CORE Cliente próprio.
          </p>
        </div>
      </Panel>
    </AppShell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
