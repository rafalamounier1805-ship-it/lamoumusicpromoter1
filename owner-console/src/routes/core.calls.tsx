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
  CALL_REGISTRY,
  CALL_TEST_SCENARIOS,
  validateCallContract,
  type CallContract,
} from "@/lib/lamou/call-registry";

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
          { icon: CircleDot, label: call.id, sub: `${call.fn} · v${call.version}` },
          { icon: Database, label: call.target, sub: "destino" },
        ].map((node, index) => (
          <div key={node.label + String(index)} className="flex items-center gap-2">
            <div className="min-w-[150px] rounded-lg border border-border bg-card px-3 py-2">
              <div className="flex items-center gap-1.5">
                <node.icon className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                <span className="truncate text-xs font-medium">{node.label}</span>
              </div>
              <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                {node.sub}
              </p>
            </div>
            {index < 2 ? (
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof KeyRound;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface-1/40 p-2.5">
      <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {label}
      </dt>
      <dd className="mt-1 break-words text-[11px]">{value}</dd>
    </div>
  );
}

function CallDetail({ call }: { call: CallContract }) {
  const errors = validateCallContract(call);
  const passed = call.tests.filter((test) => test.result === "PASS").length;

  return (
    <div className="space-y-4">
      <FlowDiagram call={call} />

      <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
        <p className="text-xs font-semibold">{call.purpose}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          owner: {call.owner} · consumidor: {call.consumer}
        </p>
      </div>

      <dl className="grid gap-2 sm:grid-cols-2">
        <Field icon={KeyRound} label="Auth" value={call.auth} />
        <Field icon={ShieldCheck} label="Scopes" value={call.scopes.join(", ")} />
        <Field icon={Users} label="Tenant" value={call.tenant} />
        <Field icon={FileCode2} label="Schema" value={call.schema} />
        <Field icon={FileCode2} label="Input" value={call.input} />
        <Field icon={FileCode2} label="Output" value={call.output} />
        <Field icon={Database} label="Fontes / dados" value={call.dataSources.join(", ")} />
        <Field icon={Clock} label="Timeout" value={`${call.timeoutMs} ms`} />
        <Field icon={RefreshCw} label="Retry" value={call.retry} />
        <Field icon={RefreshCw} label="Idempotência" value={call.idempotency} />
        <Field icon={Signal} label="Fallback" value={call.fallback} />
        <Field icon={ShieldCheck} label="SAFE" value={call.safeMode} />
        <Field icon={Target} label="Custo / limites" value={call.costLimits} />
        <Field icon={Signal} label="Logs / tracing" value={call.logsTracing} />
        <Field icon={ShieldCheck} label="Riscos" value={call.risks.join(", ")} />
        <Field icon={Database} label="Dependências" value={call.dependencies.join(", ")} />
      </dl>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            12 cenários obrigatórios ({passed}/{CALL_TEST_SCENARIOS.length} PASS)
          </p>
          <Button asChild size="sm" variant="ghost">
            <Link to="/core/tests">Abrir Testes & Evidências</Link>
          </Button>
        </div>
        <div className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {call.tests.map((test) => (
            <div
              key={test.name}
              className="rounded-lg border border-border/50 bg-surface-1/40 p-2 text-[11px]"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1">{test.name}</span>
                <Badge
                  variant="outline"
                  className={`text-[10px] ${RESULT_TONE[test.result] ?? ""}`}
                >
                  {test.result}
                </Badge>
              </div>
              {test.result === "PASS" ? (
                <p className="mt-1 text-muted-foreground">
                  evidence={test.evidenceId} · build={test.build} · env={test.environment}
                </p>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Field
          icon={Clock}
          label="Último teste"
          value={
            call.lastTest.at
              ? `${call.lastTest.at} · ${call.lastTest.build} · ${call.lastTest.environment}`
              : "nenhum teste real registrado"
          }
        />
        <Field
          icon={FileCode2}
          label="Evidências"
          value={call.evidence.length ? call.evidence.join(", ") : "nenhuma evidência anexada"}
        />
      </div>

      <div className="rounded-lg border border-border/60 bg-card/60 p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium">Integridade do contrato</span>
          <TruthBadge truth={errors.length ? "BLOCKED" : "DOCUMENTED_ONLY"} />
        </div>
        <p className="mt-1 text-muted-foreground">
          {errors.length ? errors.join(" · ") : "estrutura obrigatória completa; execução ainda depende dos testes"}
        </p>
      </div>
    </div>
  );
}

function CallsPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(CALL_REGISTRY[0]?.id ?? null);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return CALL_REGISTRY;
    return CALL_REGISTRY.filter((call) =>
      [call.id, call.app, call.fn, call.source, call.target, call.consumer, call.purpose]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [query]);

  const open = CALL_REGISTRY.find((call) => call.id === openId) ?? null;
  const passing = CALL_REGISTRY.filter((call) =>
    call.tests.some((test) => test.result === "PASS"),
  ).length;
  const invalid = CALL_REGISTRY.filter((call) => validateCallContract(call).length > 0).length;

  return (
    <AppShell group="core">
      <PageHeader
        title="CALL Registry & Contratos"
        subtitle="Contrato canônico por chamada: finalidade, versão, owner/consumidor, auth/scopes, tenant, schema, fontes, timeout, retry, idempotência, SAFE, custo, tracing, riscos, dependências, teste e evidência."
        right={
          <>
            <TruthBadge truth="DOCUMENTED_ONLY" />
            <Button asChild size="sm" variant="ghost">
              <Link to="/core/apps">Apps & Bindings</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["CALLs canônicas", String(CALL_REGISTRY.length), "FACT/EVIDENCED"],
          ["Cenários por CALL", String(CALL_TEST_SCENARIOS.length), "FACT/EVIDENCED"],
          ["Com teste PASS", String(passing), passing ? "PARTIAL" : "NOT_VERIFIED"],
          ["Contratos estruturalmente inválidos", String(invalid), invalid ? "BLOCKED" : "FACT/EVIDENCED"],
        ].map(([label, value, truth]) => (
          <div key={label} className="rounded-xl border border-border/60 bg-card/70 p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
            <div className="mt-2">
              <TruthBadge truth={truth} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_430px]">
        <Panel
          title={`Registro canônico (${filtered.length})`}
          action={
            <div className="relative w-48">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filtrar CALL, app, destino"
                aria-label="Filtrar CALLs"
                className="h-8 pl-8 text-xs"
              />
            </div>
          }
        >
          <div className="space-y-2">
            {filtered.map((call) => (
              <button
                key={call.id}
                type="button"
                onClick={() => setOpenId(call.id)}
                aria-pressed={call.id === openId}
                className="w-full rounded-lg border border-border/60 bg-surface-1/40 p-3 text-left outline-none motion-safe:transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring aria-pressed:border-primary/70 aria-pressed:bg-primary/10"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">{call.id}</span>
                  <span className="min-w-0 flex-1 text-sm font-medium">{call.fn}</span>
                  <TruthBadge truth={call.status} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {call.source} → {call.target}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{call.purpose}</p>
              </button>
            ))}
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
                Selecione uma CALL para abrir contrato, fluxo, testes e evidências.
              </p>
            </Panel>
          )}
        </aside>
      </div>

      <Panel title="Regra de PASS">
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Os 12 cenários são obrigatórios por CALL; ausência permanece NOT_RUN.</li>
          <li>PASS exige evidence_id, build e environment no próprio resultado.</li>
          <li>Build e environment da evidência precisam coincidir com o último teste do contrato.</li>
          <li>Segredos continuam server-side; nenhum token/chave é exibido nesta superfície.</li>
          <li>SALVAR ≠ PROMOVER.</li>
        </ul>
      </Panel>
    </AppShell>
  );
}

export const Route = createFileRoute("/core/calls")({
  head: () => ({
    meta: [
      { title: "CALL Registry & Contratos — LAMOU CORE" },
      {
        name: "description",
        content:
          "CALL Registry canônico do LAMOU CORE com doze cenários obrigatórios e PASS condicionado a evidência do mesmo build e ambiente.",
      },
      { property: "og:title", content: "CALL Registry & Contratos — LAMOU CORE" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CallsPage,
});
