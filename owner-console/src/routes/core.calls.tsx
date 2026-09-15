import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CircleDot,
  Clock,
  Database,
  FileCode2,
  KeyRound,
  RefreshCw,
  Search,
  ShieldCheck,
  Signal,
  Target,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CALL_REGISTRY, type CallContract } from "@/lib/lamou/registry";

const RESULT_TONE: Record<string, string> = {
  PASS: "border-success/40 text-success",
  FAIL: "border-destructive/40 text-destructive",
  NOT_RUN: "border-muted-foreground/40 text-muted-foreground",
};

function FlowDiagram({ call }: { call: CallContract }) {
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <div className="flex min-w-max items-center gap-2 rounded-lg border border-border/60 bg-surface-1/40 p-3">
        {[
          { icon: Users, label: call.source, sub: "origem" },
          { icon: CircleDot, label: call.id, sub: call.fn },
          { icon: Database, label: call.target, sub: "destino" },
        ].map((node, i) => (
          <div key={node.label + String(i)} className="flex items-center gap-2">
            <div className="min-w-[132px] rounded-lg border border-border bg-card px-3 py-2">
              <div className="flex items-center gap-1.5">
                <node.icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate text-xs font-medium">{node.label}</span>
              </div>
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                {node.sub}
              </p>
            </div>
            {i < 2 ? (
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function CallDetail({ call }: { call: CallContract }) {
  const rows: { icon: typeof KeyRound; label: string; value: string }[] = [
    { icon: Target, label: "Finalidade / função", value: call.fn },
    { icon: KeyRound, label: "Auth", value: call.auth },
    { icon: ShieldCheck, label: "Scope", value: call.scope },
    { icon: Users, label: "Tenant / consumidor", value: `${call.app} · classe ${call.dataClass}` },
    { icon: FileCode2, label: "Input", value: call.input },
    { icon: FileCode2, label: "Output", value: call.output },
    { icon: Clock, label: "Timeout", value: `${call.timeoutMs} ms` },
    {
      icon: RefreshCw,
      label: "Retry / idempotência",
      value: `${call.retry} · ${call.idempotency}`,
    },
    { icon: Signal, label: "Fallback", value: call.fallback },
  ];
  const passed = call.tests.filter((t) => t.result === "PASS").length;

  return (
    <div className="space-y-4">
      <FlowDiagram call={call} />

      <dl className="grid gap-2 sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="rounded-lg border border-border/60 bg-surface-1/40 p-2.5">
            <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
              <r.icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {r.label}
            </dt>
            <dd className="mt-1 break-words font-mono text-[11px]">{r.value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Testes obrigatórios ({passed}/{call.tests.length} PASS)
          </p>
          <Button asChild size="sm" variant="ghost">
            <Link to="/core/tests">Abrir Testes &amp; Evidências</Link>
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {call.tests.map((t) => (
            <Badge
              key={t.name}
              variant="outline"
              className={`text-[10px] ${RESULT_TONE[t.result] ?? ""}`}
            >
              {t.name}: {t.result}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Auditoria e observabilidade deste CALL: nenhuma trilha coletada (telemetria
          NOT_CONNECTED). Evidências anexadas: nenhuma.
        </p>
      </div>
    </div>
  );
}

function CallsPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(CALL_REGISTRY[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CALL_REGISTRY;
    return CALL_REGISTRY.filter((c) =>
      [c.id, c.app, c.fn, c.source, c.target].join(" ").toLowerCase().includes(q),
    );
  }, [query]);

  const open = CALL_REGISTRY.find((c) => c.id === openId) ?? null;
  const passing = CALL_REGISTRY.filter((c) => c.tests.some((t) => t.result === "PASS")).length;

  return (
    <AppShell group="core">
      <PageHeader
        title="CALLs & Contratos"
        subtitle="Registro visual dos contratos de chamada do CORE: origem → CALL → destino, auth, escopo, schema, timeout, fallback, testes e evidências."
        right={
          <>
            <TruthBadge
              truth="DOCUMENTED_ONLY"
              hint="Contratos definidos; nenhuma execução coletada neste build"
            />
            <Button asChild size="sm" variant="ghost">
              <Link to="/core/apps">Apps &amp; Bindings</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "CALLs registradas",
            value: String(CALL_REGISTRY.length),
            truth: "FACT/EVIDENCED",
          },
          {
            label: "Com teste PASS",
            value: `${passing}`,
            truth: passing ? "PARTIAL" : "NOT_VERIFIED",
          },
          {
            label: "Cenários por CALL",
            value: String(CALL_REGISTRY[0]?.tests.length ?? 0),
            truth: "DOCUMENTED_ONLY",
          },
          { label: "Trilha de auditoria", value: "não coletada", truth: "NOT_CONNECTED" },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border/60 bg-card/70 p-4">
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{k.value}</p>
            <div className="mt-2">
              <TruthBadge truth={k.truth} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel
          title={`Registro de CALLs (${filtered.length})`}
          action={
            <div className="relative w-44">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar CALL, app, destino"
                aria-label="Filtrar CALLs"
                className="h-8 pl-8 text-xs"
              />
            </div>
          }
        >
          <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[110px]">CALL-ID</TableHead>
                  <TableHead className="min-w-[140px]">App / consumidor</TableHead>
                  <TableHead className="min-w-[220px]">Origem → destino</TableHead>
                  <TableHead className="min-w-[130px]">Auth / scope</TableHead>
                  <TableHead className="min-w-[150px]">Estado</TableHead>
                  <TableHead className="min-w-[90px]">Detalhe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((c) => (
                  <TableRow key={c.id} data-state={c.id === openId ? "selected" : undefined}>
                    <TableCell className="font-mono text-[11px]">{c.id}</TableCell>
                    <TableCell className="text-xs">{c.app}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.source} → {c.target}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {c.auth} · {c.scope}
                    </TableCell>
                    <TableCell>
                      <TruthBadge truth={c.status} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => setOpenId(c.id)}
                        aria-label={`Abrir contrato ${c.id}`}
                      >
                        Abrir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma CALL corresponde ao filtro.</p>
          ) : null}
        </Panel>

        <aside className="min-w-0 space-y-4">
          {open ? (
            <Panel
              title={`Contrato ${open.id}`}
              action={<TruthBadge truth={open.status} />}
              className="xl:sticky xl:top-4"
            >
              <CallDetail call={open} />
            </Panel>
          ) : (
            <Panel title="Contrato">
              <p className="text-sm text-muted-foreground">
                Selecione uma CALL na tabela para ver contrato, fluxo e testes.
              </p>
            </Panel>
          )}
        </aside>
      </div>

      <Panel title="Regra do registro">
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            Nenhuma CALL é declarada aprovada sem os cenários executados: sucesso, não autorizado,
            papel errado, schema inválido, timeout, provider offline, tenant errado, resposta vazia
            e recuperação.
          </li>
          <li>Segredos ficam server-side; a interface nunca exibe chave ou token.</li>
          <li>
            Auditoria, observabilidade e evidências permanecem NOT_CONNECTED neste build — nada é
            apresentado como trilha real.
          </li>
        </ul>
      </Panel>
    </AppShell>
  );
}

export const Route = createFileRoute("/core/calls")({
  head: () => ({
    meta: [
      { title: "CALLs & Contratos — LAMOU CORE" },
      {
        name: "description",
        content:
          "Registro visual das CALLs do LAMOU CORE: origem, destino, auth, escopo, schema, timeout, fallback, testes e evidências.",
      },
      { property: "og:title", content: "CALLs & Contratos — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Contratos de chamada do CORE com diagrama de fluxo origem → CALL → destino e estado real de cada teste.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CallsPage,
});
