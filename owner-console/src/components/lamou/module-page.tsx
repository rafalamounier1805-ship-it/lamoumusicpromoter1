import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TruthState } from "@/lib/lamou/council-data";

export interface PageItem {
  label: string;
  value?: string;
  note?: string;
  truth?: TruthState | string;
}

export interface PageSection {
  title: string;
  items: PageItem[];
}

export interface PageSpec {
  title: string;
  subtitle: string;
  truth: TruthState | string;
  kpis?: { label: string; value: string; truth?: TruthState | string }[];
  sections: PageSection[];
  next?: string[];
}

export function ItemRow({ item }: { item: PageItem }) {
  const [open, setOpen] = useState(false);
  const expandable = Boolean(item.note);
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="min-w-0 flex-1 text-sm font-medium">{item.label}</span>
        {item.value ? (
          <span className="font-mono text-xs text-muted-foreground">{item.value}</span>
        ) : null}
        {item.truth ? <TruthBadge truth={item.truth} /> : null}
        {expandable ? (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Ocultar" : "Detalhe"}
          </Button>
        ) : null}
      </div>
      {expandable && open ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.note}</p>
      ) : null}
    </div>
  );
}

export function ModulePage({ spec }: { spec: PageSpec }) {
  return (
    <>
      <PageHeader
        title={spec.title}
        subtitle={spec.subtitle}
        right={<TruthBadge truth={spec.truth} hint="Estado de verdade desta tela" />}
      />

      {spec.kpis?.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {spec.kpis.map((k) => (
            <div
              key={k.label}
              className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur"
            >
              <p className="text-xs text-muted-foreground">{k.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold">{k.value}</p>
              {k.truth ? (
                <div className="mt-2">
                  <TruthBadge truth={k.truth} />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        {spec.sections.map((s) => (
          <Panel key={s.title} title={s.title}>
            <div className="space-y-2">
              {s.items.map((i) => (
                <ItemRow key={i.label} item={i} />
              ))}
            </div>
          </Panel>
        ))}
      </div>

      {spec.next?.length ? (
        <Panel title="Próximos passos">
          <ul className="space-y-2">
            {spec.next.map((n) => (
              <li key={n} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </>
  );
}

export function AppPage({
  spec,
  id,
  chain,
  docs,
  calls,
}: {
  spec: PageSpec;
  id: string;
  chain: string;
  docs: string[];
  calls: { label: string; truth: TruthState | string }[];
}) {
  return (
    <>
      <PageHeader
        title={spec.title}
        subtitle={spec.subtitle}
        right={
          <>
            <Badge variant="outline" className="font-mono text-[10px]">
              {id}
            </Badge>
            <TruthBadge truth={spec.truth} />
            <Button asChild variant="outline" size="sm">
              <Link to="/owner/apps">Voltar à Central &gt; Aplicativos</Link>
            </Button>
            <Button asChild variant="ghost" size="sm">
              <Link to="/core/apps">Binding técnico no CORE</Link>
            </Button>
          </>
        }
      />
      {!String(spec.truth).startsWith("IMPLEMENTED") ? (
        <div className="rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm text-warning">
          <p className="font-medium">APP NÃO IMPLEMENTADO / FICHA TÉCNICA</p>
          <p className="mt-1 text-warning/90">
            Esta superfície é a especificação do produto: não existe execução real, navegação
            interna nem dado de operação. O binding técnico fica no CORE &gt; Apps &amp; Bindings.
          </p>
        </div>
      ) : null}
      <div className="rounded-xl border border-border/60 bg-card/70 p-4 text-sm text-muted-foreground backdrop-blur">
        <span className="font-medium text-foreground">Posição na cadeia: </span>
        {chain}
        <span className="ml-2 text-xs">(classificação de roadmap: Wave 1)</span>
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        {spec.sections.map((s) => (
          <Panel key={s.title} title={s.title}>
            <div className="space-y-2">
              {s.items.map((i) => (
                <ItemRow key={i.label} item={i} />
              ))}
            </div>
          </Panel>
        ))}
        <Panel title="CALLs e contratos">
          <div className="space-y-2">
            {calls.map((c) => (
              <ItemRow key={c.label} item={{ label: c.label, truth: c.truth }} />
            ))}
          </div>
        </Panel>
        <Panel title="Documentos vivos">
          <div className="space-y-2">
            {docs.map((d) => (
              <ItemRow key={d} item={{ label: d, truth: "DOCUMENTED_ONLY" }} />
            ))}
          </div>
        </Panel>
      </div>
      {spec.next?.length ? (
        <Panel title="Próximos passos">
          <ul className="space-y-2">
            {spec.next.map((n) => (
              <li key={n} className="flex gap-2 text-sm text-muted-foreground">
                <span className="text-primary">•</span>
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </Panel>
      ) : null}
    </>
  );
}
