import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { APPS } from "@/lib/lamou/demo-data";
import { APP_PAGES } from "@/lib/lamou/pages";
import { WAVE1_APPS } from "@/lib/lamou/registry";
import { SEVERITY_LABEL } from "@/lib/lamou/types";

export const Route = createFileRoute("/owner/apps")({
  head: () => ({
    meta: [
      { title: "Inventário reconciliado de Módulos — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Rota de compatibilidade somente-leitura para preservar os registros legados de módulos. A superfície gerencial canônica é Central > Módulos & Produtos.",
      },
      { property: "og:title", content: "Inventário reconciliado de Módulos — LAMOU IA" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppsCompatibilityPage,
});

function AppsCompatibilityPage() {
  return (
    <AppShell group="owner">
      <PageHeader
        title="Módulos — inventário reconciliado"
        subtitle="Rota de compatibilidade somente-leitura. A experiência gerencial canônica foi unificada em Central > Módulos & Produtos; os registros anteriores permanecem visíveis aqui para não perder proveniência nem dados."
        right={
          <Button asChild size="sm">
            <Link to="/owner/products">Abrir Módulos & Produtos</Link>
          </Button>
        }
      />

      <div className="flex flex-wrap gap-2">
        <TruthBadge truth="DOCUMENTED_ONLY" />
        <DemoBadge label="PRESERVAÇÃO / RECONCILIAÇÃO" />
      </div>

      <Panel title={`Fichas de módulo preservadas (${APP_PAGES.length})`}>
        <p className="text-xs text-muted-foreground">
          Fonte: `APP_PAGES`. Estes registros não criam um segundo modelo gerencial; servem como
          evidência de reconciliação do catálogo existente.
        </p>
        <div className="mt-3 space-y-2">
          {APP_PAGES.map((app) => (
            <article
              key={app.slug}
              className="rounded-lg border border-border/50 bg-surface-1/40 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-medium">{app.name}</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {app.id}
                </Badge>
                <TruthBadge truth={app.truth} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{app.purpose}</p>
              <dl className="mt-2 grid gap-2 text-[11px] sm:grid-cols-2">
                <Cell label="Slug" value={app.slug} />
                <Cell label="Cadeia" value={app.chain} />
                <Cell label="Estado declarado" value={app.status} />
                <Cell label="Documentos" value={app.docs.join(", ") || "nenhum"} />
                <Cell
                  label="CALLs declarados"
                  value={app.calls.map((call) => `${call.label} [${call.truth}]`).join(" · ")}
                />
                <Cell label="Próximo passo" value={app.next.join(" · ") || "não definido"} />
              </dl>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title={`Wave 1 / Registry preservado (${WAVE1_APPS.length})`}>
        <p className="text-xs text-muted-foreground">
          Fonte: `WAVE1_APPS`. IDs, capabilities e truth-states continuam disponíveis para comparar
          com a ficha canônica de Produtos e com os bindings do CORE.
        </p>
        <div className="mt-3 space-y-2">
          {WAVE1_APPS.map((app) => (
            <article
              key={`${app.id}-${app.name}`}
              className="rounded-lg border border-border/50 bg-surface-1/40 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-medium">{app.name}</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {app.id}
                </Badge>
                <TruthBadge truth={app.truth} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{app.purpose}</p>
              <dl className="mt-2 grid gap-2 text-[11px] sm:grid-cols-2">
                <Cell
                  label="Etapa da cadeia"
                  value={app.chainStep === null ? "transversal" : String(app.chainStep)}
                />
                <Cell label="Shell" value={app.shell} />
                <Cell label="Rota declarada" value={app.route ?? "não reconciliada"} />
                <Cell label="Capabilities" value={app.capabilities.join(", ")} />
                <Cell label="Nota" value={app.note ?? "sem nota"} />
              </dl>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title={`Fixtures históricas de produto/módulo (${APPS.length})`}>
        <p className="text-xs text-muted-foreground">
          Fonte: `demo-data.APPS`. Os números abaixo continuam explicitamente DEMO e não comprovam
          produção, clientes reais, saúde real ou promoção.
        </p>
        <div className="mt-3 space-y-2">
          {APPS.map((app) => (
            <article
              key={app.id}
              className="rounded-lg border border-border/50 bg-surface-1/40 p-3"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-medium">{app.name}</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {app.id}
                </Badge>
                <Badge variant="outline" className="text-[10px]">
                  v{app.version} · {app.status}
                </Badge>
                <DemoBadge label="SYNTHETIC_DEMO" />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">{app.summary}</p>
              <dl className="mt-2 grid gap-2 text-[11px] sm:grid-cols-2">
                <Cell label="Saúde (fixture)" value={SEVERITY_LABEL[app.health]} />
                <Cell
                  label="CORE usado"
                  value={app.coreUsed
                    .map((core) => (core === "padrao" ? "CORE Padrão" : "CORE Cubo"))
                    .join(", ")}
                />
                <Cell label="Tecnologia" value={app.tech.join(", ")} />
                <Cell label="Clientes (fixture)" value={app.clients.join(", ") || "nenhum"} />
                <Cell
                  label="Testes (fixture)"
                  value={`${app.tests.passed} aprovados / ${app.tests.failed} reprovados`}
                />
                <Cell label="Documentos" value={app.docs.join(", ")} />
                <Cell
                  label="Canais"
                  value={app.channels
                    .map((channel) => `${channel.channel}: ${channel.route ?? "sem rota"}`)
                    .join(" · ")}
                />
                <Cell
                  label="Histórico"
                  value={app.history.map((event) => `${event.at}: ${event.text}`).join(" · ")}
                />
              </dl>
            </article>
          ))}
        </div>
      </Panel>

      <Panel title="Regra de superfície">
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            Gestão do produto, saúde, qualidade, uso, clientes, versão, evidências e evolução:
            Central &gt; Produtos.
          </p>
          <p>
            Bindings, providers, CALLs e arquitetura técnica: LAMOU CORE. Candidatas/experimentos:
            LABTEST.
          </p>
          <p>Nenhum registro desta rota promove versão ou altera truth-state.</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/owner/products">Módulos & Produtos — superfície canônica</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/core/apps">Bindings técnicos no CORE</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/labtest">Candidatas no LABTEST</Link>
          </Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-background/40 p-2">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}
