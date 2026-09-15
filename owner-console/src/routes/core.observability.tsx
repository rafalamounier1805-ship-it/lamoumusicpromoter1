import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, AlertTriangle, Eye, Lightbulb, Signal, TrendingUp } from "lucide-react";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, NotConnected, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CALL_REGISTRY } from "@/lib/lamou/registry";
import { useLamou } from "@/lib/lamou/store";

const SEV_LABEL: Record<string, string> = {
  critico: "Crítico",
  tendencia: "Tendência",
  probabilidade: "Probabilidade",
  estavel: "Estável",
};

const SEV_TONE: Record<string, string> = {
  critico: "bg-destructive/70",
  tendencia: "bg-warning/70",
  probabilidade: "bg-primary/70",
  estavel: "bg-success/70",
};

function ObservabilityPage() {
  const { modules, tests, security, improvements, createImprovement } = useLamou();

  const signals = modules.flatMap((m) =>
    m.pendings
      .filter((p) => !p.resolved)
      .map((p) => ({
        id: p.id,
        module: m.name,
        moduleId: m.id,
        label: p.label,
        severity: p.severity as string,
      })),
  );

  const bySeverity = ["critico", "tendencia", "probabilidade", "estavel"].map((s) => ({
    key: s,
    count: signals.filter((x) => x.severity === s).length,
  }));
  const maxSev = Math.max(1, ...bySeverity.map((b) => b.count));

  const testsByResult = [
    "aprovado",
    "reprovado",
    "inconclusivo",
    "falso positivo",
    "falso negativo",
  ].map((r) => ({
    key: r,
    count: tests.filter((t) => (t.result as string) === r).length,
  }));
  const maxTest = Math.max(1, ...testsByResult.map((t) => t.count));

  const callsWithoutTest = CALL_REGISTRY.filter((c) =>
    c.tests.every((t) => t.result === "NOT_RUN"),
  ).length;

  return (
    <AppShell group="core">
      <PageHeader
        title="Observabilidade do CORE"
        subtitle="Sinais, pendências, testes e alertas consolidados. Séries externas de telemetria não estão conectadas; o que aparece aqui vem de fixtures locais marcadas como demonstração."
        right={
          <>
            <DemoBadge label="SYNTHETIC_DEMO" />
            <TruthBadge truth="NOT_CONNECTED" hint="Coletor de telemetria e APM não conectados" />
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Sinais abertos",
            value: String(signals.length),
            truth: "SYNTHETIC_DEMO",
            icon: Signal,
          },
          {
            label: "Alertas de segurança",
            value: String(security.length),
            truth: "SYNTHETIC_DEMO",
            icon: AlertTriangle,
          },
          {
            label: "CALLs sem teste executado",
            value: `${callsWithoutTest}/${CALL_REGISTRY.length}`,
            truth: "NOT_VERIFIED",
            icon: Activity,
          },
          { label: "Traços / logs coletados", value: "0", truth: "NOT_CONNECTED", icon: Eye },
        ].map((k) => (
          <div key={k.label} className="rounded-xl border border-border/60 bg-card/70 p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <k.icon className="h-3.5 w-3.5" aria-hidden="true" />
              {k.label}
            </div>
            <p className="mt-1 font-display text-2xl font-semibold">{k.value}</p>
            <div className="mt-2">
              <TruthBadge truth={k.truth} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Sinais por severidade (fixtures DEMO)" action={<DemoBadge />}>
          <div className="space-y-2">
            {bySeverity.map((b) => (
              <div key={b.key} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs text-muted-foreground">
                  {SEV_LABEL[b.key]}
                </span>
                <div className="h-2.5 min-w-0 flex-1 rounded bg-surface-1/60">
                  <div
                    className={`h-2.5 rounded ${SEV_TONE[b.key]}`}
                    style={{ width: `${(b.count / maxSev) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs">{b.count}</span>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Resultado dos testes registrados (fixtures DEMO)" action={<DemoBadge />}>
          <div className="space-y-2">
            {testsByResult.map((t) => (
              <div key={t.key} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-xs capitalize text-muted-foreground">
                  {t.key.replace("-", " ")}
                </span>
                <div className="h-2.5 min-w-0 flex-1 rounded bg-surface-1/60">
                  <div
                    className="h-2.5 rounded bg-primary/70"
                    style={{ width: `${(t.count / maxTest) * 100}%` }}
                  />
                </div>
                <span className="w-6 text-right font-mono text-xs">{t.count}</span>
              </div>
            ))}
          </div>
          <Button asChild size="sm" variant="ghost" className="mt-1">
            <Link to="/core/tests">Abrir Testes, Validation &amp; Evidence</Link>
          </Button>
        </Panel>
      </div>

      <Panel
        title={`Sinais e oportunidade de melhoria (${signals.length})`}
        action={
          <Button asChild size="sm" variant="ghost">
            <Link to="/owner/opportunities">Ver Oportunidades</Link>
          </Button>
        }
      >
        <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[110px]">Sinal / ID</TableHead>
                <TableHead className="min-w-[130px]">Fonte / módulo</TableHead>
                <TableHead className="min-w-[240px]">Observação</TableHead>
                <TableHead className="min-w-[110px]">Severidade</TableHead>
                <TableHead className="min-w-[190px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signals.map((s) => {
                const already = improvements.some((i) => i.origin.includes(s.id));
                return (
                  <TableRow key={s.id}>
                    <TableCell className="font-mono text-[11px]">{s.id}</TableCell>
                    <TableCell className="text-xs">{s.module}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{s.label}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-[10px]">
                        {SEV_LABEL[s.severity] ?? s.severity}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {already ? (
                        <span className="text-xs text-muted-foreground">
                          Oportunidade já criada
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs"
                          onClick={() =>
                            createImprovement({
                              title: `Melhoria a partir do sinal ${s.id}`,
                              description: s.label,
                              origin: `Observabilidade do CORE · sinal ${s.id} · módulo ${s.module} (fixture SYNTHETIC_DEMO)`,
                            })
                          }
                        >
                          <Lightbulb className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                          Criar oportunidade
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {signals.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum sinal aberto nas fixtures atuais.</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          A oportunidade criada preserva a proveniência do sinal e fica registrada apenas no
          navegador (persistência local DEMO).
        </p>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Séries e trilhas ainda não conectadas">
          <div className="space-y-2">
            <NotConnected
              what="Logs, traços e métricas de runtime"
              next="Conectar coletor de telemetria e registrar a primeira evidência de coleta."
            />
            <NotConnected
              what="Métricas externas de benchmark"
              next="Definir fonte externa auditável antes de exibir qualquer comparação."
            />
          </div>
        </Panel>

        <Panel title="Regra de leitura">
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              Nenhum número foi fabricado: os gráficos contam apenas itens existentes nas fixtures.
            </li>
            <li>Verde só aparece com evidência; sem execução o item permanece NOT_VERIFIED.</li>
            <li>Nada aqui foi publicado ou promovido: SALVAR ≠ PROMOVER.</li>
          </ul>
        </Panel>
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/core/observability")({
  head: () => ({
    meta: [
      { title: "Observabilidade — LAMOU CORE" },
      {
        name: "description",
        content:
          "Sinais, pendências, testes e alertas do CORE com proveniência preservada e criação de oportunidade de melhoria.",
      },
      { property: "og:title", content: "Observabilidade — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Gráficos e tabelas a partir de fixtures DEMO, sem métricas externas fabricadas. Telemetria real permanece não conectada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ObservabilityPage,
});
