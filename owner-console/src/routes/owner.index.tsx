import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  Boxes,
  FileSignature,
  GitBranch,
  Lightbulb,
  Route as RouteIcon,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import {
  ContextColumn,
  ContextLayout,
  Field,
  InfoTip,
  KpiCard,
  type ColumnTab,
  type KpiSpec,
  type Tone,
} from "@/components/lamou/context-column";
import { NextActionsPanel, OverallHealth } from "@/components/lamou/health-widgets";
import { InteractiveCard, InteractiveRow } from "@/components/lamou/interactive";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { filterCognitiveModules, type CognitiveFilterMode } from "@/lib/lamou/cognitive";
import {
  MODULES,
  CASES,
  VERSIONS,
  CLIENTS,
  CONTRACTS,
  ACTION_PLANS,
  IMPROVEMENTS,
  APPS,
} from "@/lib/lamou/demo-data";
import { SEVERITY_LABEL, type Severity } from "@/lib/lamou/types";
import { cn } from "@/lib/utils";

const SEV_TONE: Record<Severity, string> = {
  normal: "border-success/40 text-success",
  tendencia: "border-primary/40 text-primary",
  probabilidade: "border-warning/40 text-warning",
  critico: "border-destructive/50 text-destructive",
  falha: "border-destructive/60 text-destructive",
};

const ATTENTION_SEVERITIES: Severity[] = ["probabilidade", "critico", "falha"];
const HARD_CRITICAL: Severity[] = ["critico", "falha"];

const GOV_ROUTES = [
  "/owner/clients",
  "/owner/commercial",
  "/owner/products",
  "/owner/plans",
  "/owner/versions",
  "/owner/opportunities",
  "/core/health",
] as const;

type GovRoute = (typeof GOV_ROUTES)[number];

interface GovItem {
  id: string;
  title: string;
  value: string;
  target: string;
  definition: string;
  truth: string;
  tone: Tone;
  source: string;
  body: string;
  route: GovRoute;
  routeLabel: string;
}

const hardCritical = MODULES.filter((m) => HARD_CRITICAL.includes(m.severity));
const activeContracts = CONTRACTS.filter((c) => c.status === "ativo");
const openPlans = ACTION_PLANS.filter((p) => p.status !== "CONCLUÍDO" && p.status !== "CANCELADO");
const candidates = VERSIONS.filter((v) => v.state === "CANDIDATA");

const GOVERNANCE: GovItem[] = [
  {
    id: "GEST-FALHAS",
    title: "Falhas & criticidade",
    value: `${hardCritical.length} de ${MODULES.length}`,
    target: `${hardCritical.length} em crítico/falha · meta: 0`,
    definition:
      "Módulos gerenciais exclusivamente em estado crítico ou falha. Probabilidade é atenção e possui filtro próprio.",
    truth: "SYNTHETIC_DEMO",
    tone: hardCritical.length > 0 ? "critical" : "ok",
    source: "Fixtures de módulos do cockpit (SYNTHETIC_DEMO). Telemetria real não conectada.",
    body: "Quantos módulos gerenciais estão em criticidade dura. A lista detalhada contém exatamente os itens que compõem o número mostrado.",
    route: "/core/health",
    routeLabel: "Abrir Indicadores de Saúde do CORE",
  },
  {
    id: "GEST-CLIENTES",
    title: "Clientes",
    value: String(CLIENTS.length),
    target: "carteira de demonstração · meta comercial não definida",
    definition: "Contas na carteira gerenciada pela Central, com ambiente, pacote e ficha 360.",
    truth: "SYNTHETIC_DEMO",
    tone: "neutral",
    source: "Carteira de demonstração. Provisionamento real parte de Central > Clientes.",
    body: "Carteira gerenciada pela Central, com ambiente, pacote e ficha Cliente 360 de cada conta.",
    route: "/owner/clients",
    routeLabel: "Abrir Clientes",
  },
  {
    id: "GEST-CONTRATOS",
    title: "Contratos & valores",
    value: `${activeContracts.length} de ${CONTRACTS.length}`,
    target: "valores não verificados (faturamento não conectado)",
    definition:
      "Contratos ativos sobre o total registrado. Valores dependem de faturamento conectado.",
    truth: "NOT_VERIFIED",
    tone: "attention",
    source:
      "Contratos de demonstração. Faturamento e gateway de cobrança seguem NOT_CONNECTED, então nenhum valor é comprovado.",
    body: "Contratos, entitlements, cobranças e pendências comerciais. Valores permanecem não verificados enquanto o faturamento real não estiver ligado.",
    route: "/owner/commercial",
    routeLabel: "Abrir Comercial & Contratos",
  },
  {
    id: "GEST-PRODUTOS",
    title: "Produtos & portfólio",
    value: String(APPS.length),
    target: "portfólio declarado · adoção não medida",
    definition: "Aplicativos no portfólio gerencial, com estado, versão e qualidade declarada.",
    truth: "SYNTHETIC_DEMO",
    tone: "neutral",
    source: "Fichas de portfólio. Execução real de cada app fica no próprio aplicativo.",
    body: "Visão gerencial do portfólio: estado, versão, clientes e qualidade declarada de cada produto.",
    route: "/owner/products",
    routeLabel: "Abrir Produtos",
  },
  {
    id: "GEST-PLANOS",
    title: "Planos & melhorias",
    value: `${openPlans.length + IMPROVEMENTS.length}`,
    target: `${openPlans.length} planos abertos + ${IMPROVEMENTS.length} melhorias`,
    definition: "Fila gerencial de planos de ação abertos somada às melhorias registradas.",
    truth: "SYNTHETIC_DEMO",
    tone: openPlans.length > 0 ? "attention" : "ok",
    source: "Planos e melhorias registrados localmente a partir de casos do Mapa Vivo.",
    body: "Fila gerencial de problemas, planos de ação e melhorias com origem rastreável até o caso.",
    route: "/owner/plans",
    routeLabel: "Abrir Problemas, Planos & Projetos",
  },
  {
    id: "GEST-VERSOES",
    title: "Versões",
    value: `${candidates.length} de ${VERSIONS.length}`,
    target: "candidatas em aberto · SALVAR ≠ PROMOVER",
    definition: "Versões em estado CANDIDATA sobre o total registrado. Promoção exige gate.",
    truth: "SYNTHETIC_DEMO",
    tone: "neutral",
    source: "Registro de versões da candidata. Promoção automática não existe.",
    body: "Estado das versões: baseline congelada, candidatas e rollback. Não há histórico de promoção comprovado nesta leitura; use a superfície real de Versões.",
    route: "/owner/versions",
    routeLabel: "Abrir Versões",
  },
  {
    id: "GEST-OPORTUNIDADES",
    title: "Oportunidades",
    value: String(IMPROVEMENTS.length),
    target: "nenhuma validada com cliente ou receita",
    definition: "Oportunidades derivadas de sinais internos; permanecem hipótese até evidência.",
    truth: "HYPOTHESIS",
    tone: "neutral",
    source: "Derivadas de sinais internos; nenhuma foi validada com cliente ou receita real.",
    body: "Oportunidades comerciais e de produto levantadas a partir de sinais. Permanecem hipóteses até evidência.",
    route: "/owner/opportunities",
    routeLabel: "Abrir Oportunidades",
  },
];

const PRIMARY_GOVERNANCE = GOVERNANCE.filter((item) => item.id !== "GEST-OPORTUNIDADES");

const GOV_ICONS: Record<string, LucideIcon> = {
  "GEST-FALHAS": AlertTriangle,
  "GEST-CLIENTES": Users,
  "GEST-CONTRATOS": FileSignature,
  "GEST-PRODUTOS": Boxes,
  "GEST-PLANOS": RouteIcon,
  "GEST-VERSOES": GitBranch,
  "GEST-OPORTUNIDADES": Lightbulb,
};

type Sel =
  | { kind: "kpi"; id: string }
  | { kind: "gestao"; id: string }
  | { kind: "module"; id: string }
  | { kind: "pending"; id: string; moduleId: string }
  | null;

export const Route = createFileRoute("/owner/")({
  head: () => ({
    meta: [
      { title: "Cockpit Cognitive — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Cockpit do proprietário LAMOU IA: KPIs com meta e origem, saúde dos módulos, pendências críticas e coluna de contexto com proveniência.",
      },
      { property: "og:title", content: "Cockpit Cognitive — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Visão gerencial do ecossistema LAMOU com KPIs contextualizados, coluna de contexto e estados de verdade explícitos.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Cockpit,
});

function Cockpit() {
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [probabilityOnly, setProbabilityOnly] = useState(false);
  const [treated, setTreated] = useState<string[]>([]);
  const [sel, setSel] = useState<Sel>(null);

  const filterMode: CognitiveFilterMode = criticalOnly
    ? "critical"
    : probabilityOnly
      ? "probability"
      : "all";

  const modules = useMemo(() => {
    const withPendings = MODULES.map((m) => ({
      ...m,
      openPendings: m.pendings.filter((p) => !p.resolved),
    }));
    return filterCognitiveModules(withPendings, filterMode);
  }, [filterMode]);

  const openTotal = modules.reduce((a, m) => a + m.openPendings.length, 0);
  const totalPendings = MODULES.reduce((a, m) => a + m.pendings.length, 0);
  const occurrences = CASES.filter((c) => c.occurrence).length;

  const KPIS: KpiSpec[] = [
    {
      id: "KPI-MODULOS",
      label: "Módulos exibidos",
      definition:
        "Quantos módulos gerenciais a Central está mostrando agora, sobre o total conhecido nas fixtures. Crítico significa apenas crítico/falha; probabilidade possui filtro próprio.",
      value: `${modules.length} de ${MODULES.length}`,
      target:
        filterMode === "critical"
          ? "somente crítico/falha · meta não se aplica"
          : filterMode === "probability"
            ? "somente probabilidade · meta não se aplica"
            : `${MODULES.length} conhecidos · meta de exibição: ${MODULES.length}`,
      trend: filterMode === "all" ? "completo" : "filtrado",
      meaning:
        "Mede cobertura de leitura: se menos módulos aparecem do que os conhecidos, a visão está parcial por filtro explícito.",
      source: "Fixtures de módulos do cockpit (demo-data).",
      updatedAt: "atualizado com o carregamento da tela",
      owner: "responsável: proprietário",
      truth: "SYNTHETIC_DEMO",
      tone: modules.length === MODULES.length ? "ok" : "attention",
      ratio: { value: modules.length, total: MODULES.length },
    },
    {
      id: "KPI-PENDENCIAS",
      label: "Pendências abertas",
      definition:
        "Pendências não resolvidas nos módulos exibidos, sobre o total de pendências registradas.",
      value: `${openTotal} de ${totalPendings}`,
      target: "meta: 0 pendências abertas",
      trend: openTotal > 0 ? "acima da meta" : "na meta",
      meaning: "Fila de trabalho gerencial. Cada pendência tem módulo de origem e severidade.",
      source: "Fixtures de pendências por módulo (SYNTHETIC_DEMO).",
      updatedAt: "sem data de coleta real",
      owner: "responsável: proprietário",
      truth: "SYNTHETIC_DEMO",
      tone: openTotal > 0 ? "attention" : "ok",
      ratio: { value: openTotal, total: totalPendings || 1 },
    },
    {
      id: "KPI-OCORRENCIAS",
      label: "Ocorrências no Mapa Vivo",
      definition: "Casos com ocorrência registrada no Mapa Vivo, sobre o total de casos.",
      value: `${occurrences} de ${CASES.length}`,
      target: "meta não definida / NOT_VERIFIED",
      trend: "sem série histórica",
      meaning: "Volume de problemas já observados. Sem série temporal real, não há tendência.",
      source: "Casos do Mapa Vivo (fixtures).",
      updatedAt: "sem data de coleta real",
      owner: "responsável: proprietário",
      truth: "SYNTHETIC_DEMO",
      tone: occurrences > 0 ? "attention" : "ok",
      ratio: { value: occurrences, total: CASES.length },
    },
    {
      id: "KPI-CANDIDATAS",
      label: "Candidatas em aberto",
      definition:
        "Versões em estado CANDIDATA aguardando gate. Nenhuma promoção acontece automaticamente.",
      value: `${candidates.length} de ${VERSIONS.length}`,
      target: "SALVAR ≠ PROMOVER · promoção exige gate completo",
      trend: "sem histórico de promoções comprovado nesta leitura",
      meaning: "Indica quanto está pronto para avaliação, não quanto está aprovado.",
      source: "Registro de versões da candidata.",
      updatedAt: "sem data de verificação registrada",
      owner: "responsável: proprietário",
      truth: "SYNTHETIC_DEMO",
      tone: "info",
      ratio: { value: candidates.length, total: VERSIONS.length },
    },
  ];

  function listTab(
    rows: { id: string; label: string; extra?: string; tone?: string }[],
    onOpen?: (id: string) => void,
  ) {
    return (
      <ul className="space-y-1">
        {rows.map((r) => {
          const content = (
            <>
              <span className="font-mono text-[10px] text-muted-foreground">{r.id}</span>
              <span className="min-w-0 flex-1 text-left">{r.label}</span>
              {r.extra ? (
                <Badge variant="outline" className={cn("text-[10px]", r.tone)}>
                  {r.extra}
                </Badge>
              ) : null}
            </>
          );

          return (
            <li key={r.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
              {onOpen ? (
                <button
                  type="button"
                  onClick={() => onOpen(r.id)}
                  className="flex w-full flex-wrap items-center gap-1.5 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {content}
                </button>
              ) : (
                <div className="flex flex-wrap items-center gap-1.5">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    );
  }

  const column = (() => {
    if (!sel) {
      return (
        <ContextColumn empty="Selecione um KPI, um card de gestão, um módulo ou uma pendência: o detalhe abre aqui, sem sair da tela." />
      );
    }

    if (sel.kind === "kpi") {
      const kpi = KPIS.find((k) => k.id === sel.id);
      if (!kpi) return <ContextColumn empty="Item não encontrado." />;
      const rows =
        kpi.id === "KPI-MODULOS"
          ? modules.map((m) => ({
              id: m.id,
              label: m.name,
              extra: SEVERITY_LABEL[m.severity],
              tone: SEV_TONE[m.severity],
            }))
          : kpi.id === "KPI-PENDENCIAS"
            ? modules.flatMap((m) =>
                m.openPendings.map((p) => ({
                  id: p.id,
                  label: `${p.label} · ${m.name}`,
                  extra: SEVERITY_LABEL[p.severity],
                  tone: SEV_TONE[p.severity],
                })),
              )
            : kpi.id === "KPI-OCORRENCIAS"
              ? CASES.filter((c) => c.occurrence).map((c) => ({
                  id: c.id,
                  label: c.title,
                  extra: SEVERITY_LABEL[c.severity],
                  tone: SEV_TONE[c.severity],
                }))
              : candidates.map((v) => ({ id: v.id, label: v.label, extra: v.state }));

      const itemsContent =
        kpi.id === "KPI-MODULOS" ? (
          listTab(rows, (id) => setSel({ kind: "module", id }))
        ) : kpi.id === "KPI-OCORRENCIAS" ? (
          <ul className="space-y-1">
            {CASES.filter((c) => c.occurrence).map((c) => (
              <li key={c.id}>
                <Link
                  to="/owner/mapa-vivo"
                  search={{ case_id: c.id }}
                  className="flex flex-wrap items-center gap-1.5 rounded-lg border border-border/50 bg-surface-1/40 p-2 outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span className="font-mono text-[10px] text-muted-foreground">{c.id}</span>
                  <span className="min-w-0 flex-1">{c.title}</span>
                  <Badge variant="outline" className={cn("text-[10px]", SEV_TONE[c.severity])}>
                    {SEVERITY_LABEL[c.severity]}
                  </Badge>
                </Link>
              </li>
            ))}
          </ul>
        ) : kpi.id === "KPI-CANDIDATAS" ? (
          <div className="space-y-3">
            {listTab(rows)}
            <p className="text-[11px] text-muted-foreground">
              Sem histórico de promoção comprovado nesta leitura. O destino operacional é a
              superfície real de Versões.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/owner/versions">Abrir Versões</Link>
            </Button>
          </div>
        ) : (
          listTab(rows)
        );

      const tabs: ColumnTab[] = [
        {
          id: "resumo",
          label: "Resumo",
          content: (
            <>
              <Field label="Valor atual" value={kpi.value} />
              <Field label="Meta / denominador" value={kpi.target} />
              <Field label="Tendência" value={kpi.trend ?? "sem série histórica"} />
              <Field label="Significado" value={kpi.meaning} />
            </>
          ),
        },
        {
          id: "itens",
          label: `Itens (${rows.length})`,
          content:
            rows.length === 0 ? (
              <p className="text-muted-foreground">Nenhum item neste agregador agora.</p>
            ) : (
              itemsContent
            ),
        },
        {
          id: "fonte",
          label: "Fonte",
          content: (
            <>
              <Field label="Origem / proveniência" value={kpi.source} />
              <Field label="Última atualização" value={kpi.updatedAt} />
              <Field label="Responsável" value={kpi.owner} />
            </>
          ),
        },
        {
          id: "evidencias",
          label: "Evidências",
          content: (
            <>
              <Field
                label="Evidência anexada"
                value="evidência ausente / NOT_VERIFIED — nenhum log, medição ou documento real sustenta este número."
              />
              <Button asChild size="sm" variant="outline">
                <Link to="/core/observability">Abrir Observabilidade do CORE</Link>
              </Button>
            </>
          ),
        },
      ];
      return (
        <ContextColumn
          badgeId={kpi.id}
          title={kpi.label}
          subtitle={kpi.definition}
          truth={kpi.truth}
          tabs={tabs}
          onClose={() => setSel(null)}
          footer={
            <Button asChild size="sm" variant="outline">
              <Link to="/core/health">Ver Indicadores de Saúde do CORE</Link>
            </Button>
          }
        />
      );
    }

    if (sel.kind === "gestao") {
      const g = GOVERNANCE.find((x) => x.id === sel.id);
      if (!g) return <ContextColumn empty="Item não encontrado." />;
      const tabs: ColumnTab[] = [
        {
          id: "resumo",
          label: "Resumo",
          content: (
            <>
              <Field label="Valor atual" value={g.value} />
              <Field label="Meta / denominador" value={g.target} />
              <Field label="O que é" value={g.body} />
            </>
          ),
        },
        ...(g.id === "GEST-FALHAS"
          ? [
              {
                id: "itens",
                label: `Itens (${hardCritical.length})`,
                content: listTab(
                  hardCritical.map((m) => ({
                    id: m.id,
                    label: m.name,
                    extra: SEVERITY_LABEL[m.severity],
                    tone: SEV_TONE[m.severity],
                  })),
                  (id) => setSel({ kind: "module", id }),
                ),
              } satisfies ColumnTab,
            ]
          : []),
        {
          id: "fonte",
          label: "Fonte",
          content: (
            <>
              <Field label="Origem / proveniência" value={g.source} />
              <Field label="Responsável" value="responsável: proprietário" />
            </>
          ),
        },
        {
          id: "acao",
          label: "Planos / Ações",
          content: (
            <>
              <Field
                label="Onde é tratado"
                value={`${g.routeLabel} — rota real desta candidata.`}
              />
              <Button asChild size="sm">
                <Link to={g.route}>{g.routeLabel}</Link>
              </Button>
            </>
          ),
        },
        {
          id: "evidencias",
          label: "Evidências",
          content: (
            <Field
              label="Evidência anexada"
              value="evidência ausente / NOT_VERIFIED — este bloco é leitura gerencial de fixtures."
            />
          ),
        },
      ];
      return (
        <ContextColumn
          badgeId={g.id}
          title={g.title}
          subtitle={g.definition}
          truth={g.truth}
          tabs={tabs}
          onClose={() => setSel(null)}
          footer={
            <Button asChild size="sm">
              <Link to={g.route}>{g.routeLabel}</Link>
            </Button>
          }
        />
      );
    }

    if (sel.kind === "module") {
      const m = MODULES.find((x) => x.id === sel.id);
      if (!m) return <ContextColumn empty="Módulo não encontrado." />;
      const open = m.pendings.filter((p) => !p.resolved);
      const tabs: ColumnTab[] = [
        {
          id: "resumo",
          label: "Resumo",
          content: (
            <>
              <Field label="O que é" value={m.summary} />
              <Field label="Criticidade" value={SEVERITY_LABEL[m.severity]} />
            </>
          ),
        },
        {
          id: "indicadores",
          label: "Indicadores",
          content:
            m.metrics.length === 0 ? (
              <p className="text-muted-foreground">Nenhum indicador declarado neste módulo.</p>
            ) : (
              <>
                {m.metrics.map((mt) => (
                  <Field
                    key={mt.label}
                    label={mt.label}
                    value={`${mt.value} · ${mt.demo ? "SYNTHETIC_DEMO" : "sem fonte declarada"} · meta não definida`}
                  />
                ))}
              </>
            ),
        },
        {
          id: "problemas",
          label: `Problemas (${open.length})`,
          content:
            open.length === 0 ? (
              <p className="text-success">Sem pendências abertas neste módulo.</p>
            ) : (
              listTab(
                open.map((p) => ({
                  id: p.id,
                  label: p.label,
                  extra: SEVERITY_LABEL[p.severity],
                  tone: SEV_TONE[p.severity],
                })),
              )
            ),
        },
        {
          id: "fonte",
          label: "Fonte",
          content: (
            <>
              <Field label="Origem" value="Fixture de módulo do cockpit (SYNTHETIC_DEMO)." />
              <Field label="Última verificação" value="sem verificação registrada" />
            </>
          ),
        },
      ];
      return (
        <ContextColumn
          badgeId={m.id}
          title={m.name}
          subtitle="Ficha gerencial do módulo. A profundidade técnica fica no LAMOU CORE."
          truth="SYNTHETIC_DEMO"
          tabs={tabs}
          onClose={() => setSel(null)}
          footer={
            <Button asChild size="sm" variant="outline">
              <Link to="/core/health">Indicadores de Saúde do CORE</Link>
            </Button>
          }
        />
      );
    }

    const mod = MODULES.find((x) => x.id === sel.moduleId);
    const p = mod?.pendings.find((x) => x.id === sel.id);
    if (!mod || !p) return <ContextColumn empty="Pendência não encontrada." />;
    const tabs: ColumnTab[] = [
      {
        id: "resumo",
        label: "Resumo",
        content: (
          <>
            <Field label="Pendência" value={p.label} />
            <Field label="Módulo de origem" value={`${mod.id} · ${mod.name}`} />
            <Field label="Severidade" value={SEVERITY_LABEL[p.severity]} />
            <Field
              label="Estado local"
              value={
                treated.includes(p.id)
                  ? "tratada localmente (continua visível)"
                  : "aberta, sem tratativa registrada"
              }
            />
          </>
        ),
      },
      {
        id: "fonte",
        label: "Fonte",
        content: (
          <Field
            label="Origem"
            value="Fixture de pendência do cockpit. Nenhuma correção externa é executada por esta tela."
          />
        ),
      },
      {
        id: "acao",
        label: "Planos / Ações",
        content: (
          <>
            <Button
              size="sm"
              onClick={() => setTreated((v) => (v.includes(p.id) ? v : [...v, p.id]))}
            >
              Registrar tratativa (local DEMO)
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/owner/mapa-vivo">Abrir no Mapa Vivo</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/owner/plans">Criar plano em Problemas, Planos &amp; Projetos</Link>
            </Button>
            <p className="text-[11px] text-muted-foreground">
              “Registrar tratativa” marca a pendência localmente e ela continua visível no cockpit
              com esse rótulo. Nada é apagado.
            </p>
          </>
        ),
      },
    ];
    return (
      <ContextColumn
        badgeId={p.id}
        title={p.label}
        subtitle={`Pendência do módulo ${mod.name}`}
        truth="SYNTHETIC_DEMO"
        tabs={tabs}
        onClose={() => setSel(null)}
      />
    );
  })();

  return (
    <AppShell group="owner">
      <PageHeader
        title="Cognitive / Cockpit"
        subtitle="Visão gerencial do ecossistema LAMOU IA. Cada número traz meta/denominador, origem e estado de verdade; o detalhe abre na coluna de contexto à direita."
        right={
          <>
            <DemoBadge />
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/70 px-3 py-1.5">
              <Switch
                id="critical-only"
                checked={criticalOnly}
                onCheckedChange={(checked) => {
                  setCriticalOnly(checked);
                  if (checked) setProbabilityOnly(false);
                }}
              />
              <Label htmlFor="critical-only" className="text-xs">
                Somente críticos
              </Label>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/70 px-3 py-1.5">
              <Switch
                id="probability-only"
                checked={probabilityOnly}
                onCheckedChange={(checked) => {
                  setProbabilityOnly(checked);
                  if (checked) setCriticalOnly(false);
                }}
              />
              <Label htmlFor="probability-only" className="text-xs">
                Somente probabilidade
              </Label>
            </div>
          </>
        }
      />

      <ContextLayout column={column}>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          {KPIS.map((k) => (
            <KpiCard
              key={k.id}
              kpi={k}
              selected={sel?.kind === "kpi" && sel.id === k.id}
              onOpen={() => setSel({ kind: "kpi", id: k.id })}
            />
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <OverallHealth />
          <Panel title="Como ler a Saúde Geral aqui">
            <p className="text-xs text-muted-foreground">
              A Central mostra apenas o resumo: o score só existe com metodologia de peso publicada
              e histórico. A leitura técnica completa, com contribuição, peso e evidência por
              indicador, fica em Saúde &amp; Evidências do CORE.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/core/health">Abrir Saúde &amp; Evidências do CORE</Link>
            </Button>
          </Panel>
        </div>

        <NextActionsPanel limit={3} />

        <Panel title="Gestão do ecossistema (visão gerencial)">
          <p className="text-xs text-muted-foreground">
            Cada item abre na coluna de contexto com valor, meta, origem, estado de verdade e o
            destino real onde o assunto é tratado. A Central não executa operação técnica: isso fica
            no LAMOU CORE.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {PRIMARY_GOVERNANCE.map((g) => (
              <InteractiveCard
                key={g.id}
                selected={sel?.kind === "gestao" && sel.id === g.id}
                label={`Abrir ${g.title} na coluna de contexto`}
                onOpen={() => setSel({ kind: "gestao", id: g.id })}
                className="p-3"
              >
                <div className="flex items-start gap-2">
                  {(() => {
                    const Icon = GOV_ICONS[g.id] ?? Boxes;
                    return (
                      <Icon
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground"
                        aria-hidden="true"
                      />
                    );
                  })()}
                  <p className="min-w-0 flex-1 text-xs font-semibold">{g.title}</p>
                  <InfoTip text={g.definition} />
                </div>
                <p
                  className={cn(
                    "mt-2 font-display text-xl font-semibold",
                    g.tone === "critical"
                      ? "text-destructive"
                      : g.tone === "attention"
                        ? "text-warning"
                        : g.tone === "ok"
                          ? "text-success"
                          : "text-foreground",
                  )}
                >
                  {g.value}
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">{g.target}</p>
                <div className="mt-2">
                  <TruthBadge truth={g.truth} />
                </div>
              </InteractiveCard>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-3">
            <p className="text-[11px] text-muted-foreground">
              Oportunidades permanece na superfície própria como leitura secundária; não compõe o
              bloco principal do Cognitive.
            </p>
            <Button asChild size="sm" variant="outline">
              <Link to="/owner/opportunities">Abrir Oportunidades</Link>
            </Button>
          </div>
        </Panel>

        {modules.length === 0 ? (
          <Panel
            title={
              filterMode === "probability"
                ? "Nenhuma probabilidade aberta"
                : "Nenhuma criticidade aberta"
            }
          >
            <p className="text-sm text-muted-foreground">
              O filtro ativo não encontrou módulos neste estado. Desligue o filtro para voltar à
              visão geral.
            </p>
          </Panel>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {modules.map((m) => (
              <div
                key={m.id}
                className={cn(
                  "motion-safe:transition-shadow rounded-xl border bg-card/70 p-4 backdrop-blur",
                  HARD_CRITICAL.includes(m.severity)
                    ? "border-destructive/40"
                    : ATTENTION_SEVERITIES.includes(m.severity)
                      ? "border-warning/40"
                      : "border-border/60",
                )}
              >
                <button
                  type="button"
                  onClick={() => setSel({ kind: "module", id: m.id })}
                  aria-pressed={sel?.kind === "module" && sel.id === m.id}
                  aria-label={`Abrir módulo ${m.name} na coluna de contexto`}
                  className="w-full rounded-lg text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-display text-sm font-semibold">{m.name}</p>
                    <Badge variant="outline" className={cn("text-[10px]", SEV_TONE[m.severity])}>
                      {SEVERITY_LABEL[m.severity]}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{m.summary}</p>
                </button>

                {filterMode === "all" && m.metrics.length ? (
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {m.metrics.map((mt) => (
                      <div key={mt.label} className="rounded-lg bg-surface-1/50 p-2">
                        <p className="text-[10px] text-muted-foreground">{mt.label}</p>
                        <p className="font-mono text-sm">{mt.value}</p>
                        <p className="text-[10px] text-muted-foreground">meta não definida</p>
                        {mt.demo ? <DemoBadge label="DEMO" /> : null}
                      </div>
                    ))}
                  </div>
                ) : null}

                <div className="mt-3 space-y-2">
                  {m.openPendings.length === 0 ? (
                    <p className="text-xs text-success">Sem pendências abertas.</p>
                  ) : (
                    m.openPendings.map((p) => (
                      <InteractiveRow
                        key={p.id}
                        selected={sel?.kind === "pending" && sel.id === p.id}
                        label={`Abrir pendência ${p.label} na coluna de contexto`}
                        onOpen={() => setSel({ kind: "pending", id: p.id, moduleId: m.id })}
                      >
                        <span className="flex flex-wrap items-center gap-2">
                          <span className="min-w-0 flex-1">{p.label}</span>
                          {treated.includes(p.id) ? (
                            <Badge
                              variant="outline"
                              className="border-primary/50 text-[10px] text-primary"
                            >
                              tratada localmente
                            </Badge>
                          ) : null}
                          <Badge
                            variant="outline"
                            className={cn("text-[10px]", SEV_TONE[p.severity])}
                          >
                            {SEVERITY_LABEL[p.severity]}
                          </Badge>
                        </span>
                      </InteractiveRow>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 2xl:grid-cols-2">
          <Panel
            title="Prioridades no Mapa Vivo"
            action={
              <Button asChild size="sm" variant="outline">
                <Link to="/owner/mapa-vivo">Abrir Mapa Vivo</Link>
              </Button>
            }
          >
            <div className="space-y-2">
              {CASES.filter((c) => ATTENTION_SEVERITIES.includes(c.severity))
                .slice(0, 5)
                .map((c) => (
                  <Link
                    key={c.id}
                    to="/owner/mapa-vivo"
                    search={{ case_id: c.id }}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-3 text-sm outline-none transition-colors hover:border-primary/60 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="min-w-0 flex-1">
                      {c.id} · {c.title}
                    </span>
                    <Badge variant="outline" className={cn("text-[10px]", SEV_TONE[c.severity])}>
                      {SEVERITY_LABEL[c.severity]}
                    </Badge>
                    <DemoBadge label="DEMO" />
                  </Link>
                ))}
            </div>
          </Panel>

          <Panel title="Ações rápidas">
            <div className="flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to="/owner/clients">Clientes</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/install/client">Provisionar cliente</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/owner/tests">Testes &amp; Qualidade</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/core/health">Indicadores de Saúde do CORE</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/owner/versions">Versões</Link>
              </Button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Nenhuma ação aqui executa integração externa. Ações que dependem de conexão aparecem
              como não conectadas na tela correspondente.
            </p>
          </Panel>
        </div>
      </ContextLayout>
    </AppShell>
  );
}
