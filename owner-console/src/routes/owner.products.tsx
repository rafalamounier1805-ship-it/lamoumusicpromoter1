import { createFileRoute, Link } from "@tanstack/react-router";
import { AppWindow, Boxes, Cpu, FlaskConical, Users } from "lucide-react";

import { AppShell } from "@/components/lamou/app-shell";
import {
  ContextColumn,
  ContextLayout,
  Field,
  type ColumnTab,
} from "@/components/lamou/context-column";
import { InteractiveRow } from "@/components/lamou/interactive";
import { DemoBadge, NotConnected, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  APP_ARCHITECTURE_NODES,
  APP_FLOW_EDGES,
  DUPLICATION_RECONCILIATION,
  NEW_SINCE_V75,
  OWNER_MODULE_ORDER,
} from "@/lib/lamou/app-architecture";
import { METRICS_REGISTRY } from "@/lib/lamou/metrics-registry";
import { APPS_MENU, APP_ROUTES, appRoute, type AppSlug } from "@/lib/lamou/nav";
import { useMemo, useState } from "react";

/** Dependências externas declaradas. Nenhuma medição de custo ou SLA importada. */
const PLUGINS: { name: string; role: string; truth: string }[] = [
  { name: "Lovable AI Gateway", role: "provider de IA (modelos de texto)", truth: "PARTIAL" },
  { name: "Armazenamento privado de imagem", role: "avatar do proprietário", truth: "PARTIAL" },
  { name: "Gateway de pagamento", role: "cobrança de contratos", truth: "NOT_CONNECTED" },
  { name: "Analytics / telemetria de produto", role: "adoção e uso", truth: "NOT_CONNECTED" },
  { name: "Canal de SAC / suporte", role: "chamados e satisfação", truth: "NOT_CONNECTED" },
];

type Stage =
  "Ideia" | "Incubado" | "Protótipo" | "Em Teste" | "Piloto" | "Homologação" | "Produto Comercial";

type Product = {
  id: string;
  slug: AppSlug | null;
  name: string;
  family: string;
  classification: "Incubado do Proprietário" | "Produto Comercial";
  stage: Stage;
  truth: string;
  clients: string;
  version: string;
  source?: string;
};

/** Catálogo gerencial SYNTHETIC_DEMO. Nenhuma venda, receita ou adoção medida. */
const PRODUCTS: Product[] = [
  {
    id: "PRD-0001",
    slug: "research-scout",
    name: "Research Scout",
    family: "Inteligência & Pesquisa",
    classification: "Incubado do Proprietário",
    stage: "Incubado",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0002",
    slug: "benchmarker",
    name: "Benchmarker",
    family: "Inteligência & Pesquisa",
    classification: "Incubado do Proprietário",
    stage: "Protótipo",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0003",
    slug: "opportunity-intelligence",
    name: "Opportunity Intelligence",
    family: "Inteligência & Pesquisa",
    classification: "Incubado do Proprietário",
    stage: "Ideia",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0004",
    slug: "showroom",
    name: "Showroom",
    family: "Comercial",
    classification: "Produto Comercial",
    stage: "Homologação",
    truth: "NOT_VERIFIED",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0005",
    slug: "diagnostico-360",
    name: "Diagnóstico 360",
    family: "Diagnóstico & Melhoria",
    classification: "Produto Comercial",
    stage: "Em Teste",
    truth: "NOT_VERIFIED",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0006",
    slug: "digital-improvement",
    name: "Digital Improvement",
    family: "Diagnóstico & Melhoria",
    classification: "Incubado do Proprietário",
    stage: "Incubado",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0007",
    slug: "meeting-architect",
    name: "Meeting Architect",
    family: "Operação",
    classification: "Incubado do Proprietário",
    stage: "Protótipo",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0008",
    slug: "teste3",
    name: "Teste³ IA",
    family: "Qualidade & Validação",
    classification: "Incubado do Proprietário",
    stage: "Em Teste",
    truth: "NOT_VERIFIED",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0009",
    slug: "validation-gate",
    name: "Validation Gate",
    family: "Qualidade & Validação",
    classification: "Incubado do Proprietário",
    stage: "Homologação",
    truth: "NOT_VERIFIED",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0010",
    slug: "orbit",
    name: "Orbit / Agenda / LifeOS",
    family: "Operação",
    classification: "Incubado do Proprietário",
    stage: "Ideia",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0011",
    slug: "version",
    name: "LAMOU Version",
    family: "Documentação & Governança",
    classification: "Incubado do Proprietário",
    stage: "Incubado",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "spec",
  },
  {
    id: "PRD-0012",
    slug: "lab",
    name: "LAMOU Lab",
    family: "Qualidade & Validação",
    classification: "Incubado do Proprietário",
    stage: "Em Teste",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    clients: "—",
    version: "V0.9 external candidate / bundled route version to reconcile",
    source: "Rota já existe no Owner source; candidata externa mais nova LAMOU LAB V0.9 precisa de reconciliação de source/version antes de substituir a rota.",
  },
  {
    id: "PRD-0013",
    slug: null,
    name: "PROJECT PRIME MASTER V1",
    family: "Projetos",
    classification: "Incubado do Proprietário",
    stage: "Homologação",
    truth: "APPROVED_REFERENCE",
    clients: "—",
    version: "V1",
    source: "Aplicativo aprovado externo; não embutido nesta Owner Console.",
  },
  {
    id: "PRD-0014",
    slug: null,
    name: "LAMU IA — Meu Desenvolvimento v1 COMPLETO",
    family: "Pessoas & Desenvolvimento",
    classification: "Incubado do Proprietário",
    stage: "Homologação",
    truth: "APPROVED_REFERENCE",
    clients: "—",
    version: "v1 COMPLETO",
    source: "Aplicativo aprovado externo; preserva escopo próprio.",
  },
  {
    id: "PRD-0015",
    slug: null,
    name: "VECTRA Intelligence 360 V4 — Mapa Vivo",
    family: "Operação & Observabilidade",
    classification: "Produto Comercial",
    stage: "Produto Comercial",
    truth: "OFFICIAL_APPROVED",
    clients: "—",
    version: "V4",
    source: "Manifest oficial externo; linhagem BELGO/VECTRA em reconciliação.",
  },
  {
    id: "PRD-0016",
    slug: null,
    name: "LAMOU App Processo",
    family: "Processos & Operação",
    classification: "Incubado do Proprietário",
    stage: "Em Teste",
    truth: "CANDIDATE_NOT_PROMOTED",
    clients: "—",
    version: "V0.3",
    source: "Candidata externa; engenharia de processos completa permanece no próprio app.",
  },
  {
    id: "PRD-0017",
    slug: null,
    name: "Plano de Ação",
    family: "Execução & Eficácia",
    classification: "Incubado do Proprietário",
    stage: "Ideia",
    truth: "DOCUMENTED_ONLY",
    clients: "—",
    version: "documented",
    source: "Contrato funcional documentado; source standalone não materializado neste repo.",
  },
  {
    id: "PRD-0018",
    slug: null,
    name: "APP Observer 360 V2",
    family: "Observabilidade & Diagnóstico Técnico",
    classification: "Incubado do Proprietário",
    stage: "Em Teste",
    truth: "CANDIDATE_NOT_PROMOTED",
    clients: "—",
    version: "V2",
    source: "Executável/candidata externa criada em 2026-09-23; integrações reais ainda exigem fontes autorizadas.",
  },
];

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: typeof Cpu;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function ProductsPage() {
  const [openId, setOpenId] = useState<string | null>(null);
  const current = PRODUCTS.find((p) => p.id === openId) ?? null;
  const commercial = PRODUCTS.filter((p) => p.classification === "Produto Comercial").length;
  const stages = Array.from(new Set(PRODUCTS.map((p) => p.stage)));
  const families = Array.from(new Set(PRODUCTS.map((p) => p.family)));
  const classifications = Array.from(new Set(PRODUCTS.map((p) => p.classification)));

  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("todos");
  const [classification, setClassification] = useState("todos");
  const [stage, setStage] = useState("todos");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (family === "todos" || p.family === family) &&
        (classification === "todos" || p.classification === classification) &&
        (stage === "todos" || p.stage === stage) &&
        (q === "" || `${p.id} ${p.name} ${p.family}`.toLowerCase().includes(q)),
    );
  }, [query, family, classification, stage]);

  const column = (() => {
    if (!current) {
      return (
        <ContextColumn empty="Selecione um aplicativo do portfólio: a leitura executiva abre aqui, sem sair da tela." />
      );
    }
    const route =
      current.slug && Object.prototype.hasOwnProperty.call(APP_ROUTES, current.slug)
        ? appRoute(current.slug)
        : null;
    const executavel = Boolean(route && APPS_MENU.some((a) => a.to === route));
    const tabs: ColumnTab[] = [
      {
        id: "resumo",
        label: "Resumo",
        content: (
          <>
            <Field
              label="Família / classificação"
              value={`${current.family} · ${current.classification}`}
            />
            <Field label="Estágio" value={current.stage} />
            <Field label="Versão" value={current.version} />
            <Field
              label="Execução"
              value={
                executavel
                  ? "Rota do aplicativo está materializada nesta candidata. Isso não prova integração externa nem promoção."
                  : "Aplicativo/referência externo ao bundle atual; fonte e estado são preservados sem falsa incorporação."
              }
            />
          </>
        ),
      },
      {
        id: "indicadores",
        label: "Indicadores",
        content: (
          <>
            <Field
              label="Clientes ativos"
              value={`${current.clients} · meta não definida · NOT_VERIFIED`}
            />
            <Field label="Receita / contratos" value="— · gateway de cobrança NOT_CONNECTED" />
            <Field label="Uso / adoção" value="— · telemetria de produto NOT_CONNECTED" />
            <Field label="Chamados / incidentes" value="— · canal de SAC NOT_CONNECTED" />
            <Field label="Satisfação / NPS" value="— · sem fonte real" />
          </>
        ),
      },
      {
        id: "saude",
        label: "Saúde",
        content: (
          <>
            <Field
              label="Saúde declarada"
              value="Sem execução de testes conectada, a saúde do produto permanece PARTIAL: ficha e rota existem, comportamento não foi medido."
            />
            <Button asChild size="sm" variant="outline">
              <Link to="/core/health">Indicadores de Saúde do CORE</Link>
            </Button>
          </>
        ),
      },
      {
        id: "fonte",
        label: "Fonte",
        content: (
          <>
            <Field
              label="Origem / proveniência"
              value="Catálogo gerencial de portfólio (fixtures do proprietário)."
            />
            <Field label="Responsável" value="responsável: proprietário" />
            <Field label="Última verificação" value="sem verificação de runtime registrada" />
            <Field
              label="Fonte / reconciliação"
              value={current.source ?? "Catálogo da candidata; ver arquitetura e lineage registry."}
            />
          </>
        ),
      },
      {
        id: "evidencias",
        label: "Evidências",
        content: (
          <>
            <Field label="Evidência anexada" value="evidência ausente / NOT_VERIFIED" />
            <Button asChild size="sm" variant="outline">
              <Link to="/core/tests">Testes & Qualidade do CORE</Link>
            </Button>
          </>
        ),
      },
      {
        id: "evolucao",
        label: "Evolução",
        content: (
          <>
            <Field
              label="Roadmap"
              value="Estágio atual dentro da esteira Ideia → Produção. Promoção exige gate: SALVAR ≠ PROMOVER."
            />
            <Button asChild size="sm" variant="outline">
              <Link to="/labtest">Estado no LABTEST</Link>
            </Button>
          </>
        ),
      },
    ];
    return (
      <ContextColumn
        badgeId={current.id}
        title={current.name}
        subtitle={`${current.family} · ${current.classification}`}
        truth={current.truth}
        tabs={tabs}
        onClose={() => setOpenId(null)}
        footer={
          <>
            {route ? (
              <Button asChild size="sm" variant="outline">
                <Link to={route}>Abrir aplicativo</Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" disabled>
                Fonte externa / sem rota embutida
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link to="/core/apps">Binding técnico no CORE</Link>
            </Button>
          </>
        }
      />
    );
  })();

  return (
    <AppShell group="owner">
      <PageHeader
        title="Produtos"
        subtitle="Catálogo gerencial do portfólio: aplicativos incubados do proprietário, produtos comerciais e o CORE como ativo estratégico."
      />
      <DemoBadge label="SYNTHETIC_DEMO — sem vendas, receita, uso ou satisfação medidos" />

      <ContextLayout column={column}>
        <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <Kpi label="Produtos catalogados" value={String(PRODUCTS.length)} icon={AppWindow} />
          <Kpi
            label="Comerciais × incubados"
            value={`${commercial} / ${PRODUCTS.length - commercial}`}
            hint="Incubados podem não estar à venda"
            icon={FlaskConical}
          />
          <Kpi
            label="Clientes por produto"
            value="—"
            hint="NOT_VERIFIED — sem base de contratos conectada"
            icon={Users}
          />
          <Kpi
            label="Receita / MRR"
            value="—"
            hint="NOT_CONNECTED — nenhuma fonte financeira ligada"
            icon={Boxes}
          />
        </div>

        <Panel title="Revisão de arquitetura da próxima candidata">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
              <p className="text-xs text-muted-foreground">Apps/referências reconciliados</p>
              <p className="mt-1 font-display text-xl font-semibold">{APP_ARCHITECTURE_NODES.length}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
              <p className="text-xs text-muted-foreground">Novos desde V7.5</p>
              <p className="mt-1 font-display text-xl font-semibold">{NEW_SINCE_V75.length}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
              <p className="text-xs text-muted-foreground">Handoffs contratados</p>
              <p className="mt-1 font-display text-xl font-semibold">{APP_FLOW_EDGES.length}</p>
            </div>
            <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
              <p className="text-xs text-muted-foreground">Métricas cadastradas</p>
              <p className="mt-1 font-display text-xl font-semibold">{METRICS_REGISTRY.length}</p>
              <p className="mt-1 text-[10px] text-muted-foreground">definições; valores exigem fonte medida</p>
            </div>
          </div>

          <div className="mt-3 grid gap-3 xl:grid-cols-2">
            <div className="rounded-lg border border-border/50 bg-background/40 p-3">
              <p className="text-xs font-medium">Ordem gerencial</p>
              <ol className="mt-2 space-y-1 text-xs text-muted-foreground">
                {OWNER_MODULE_ORDER.map((item, index) => (
                  <li key={item}>{index + 1}. {item}</li>
                ))}
              </ol>
            </div>
            <div className="rounded-lg border border-border/50 bg-background/40 p-3">
              <p className="text-xs font-medium">Duplicidades / linhagens revisadas</p>
              <div className="mt-2 space-y-2 text-xs text-muted-foreground">
                {DUPLICATION_RECONCILIATION.map((d) => (
                  <div key={d.id}>
                    <span className="font-mono text-[10px]">{d.id}</span> · {d.items.join(" ↔ ")}
                    <br />
                    <span>{d.decision}: {d.rule}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Distribuição por estágio">
          <div className="flex flex-wrap gap-2">
            {stages.map((s) => (
              <Badge key={s} variant="outline" className="border-primary/40 text-primary">
                {s}: {PRODUCTS.filter((p) => p.stage === s).length}
              </Badge>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Ideia → Incubado → Protótipo → Em Teste → Piloto → Homologação → Produto Comercial →
            Produção → Evolução → Descontinuado.
          </p>
        </Panel>

        <Tabs defaultValue="apps">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
            <TabsTrigger value="apps">Aplicativos</TabsTrigger>
            <TabsTrigger value="core">CORE / Plataforma</TabsTrigger>
            <TabsTrigger value="plugins">Plugins / Providers</TabsTrigger>
            <TabsTrigger value="quality">Qualidade & SAC</TabsTrigger>
          </TabsList>

          <TabsContent value="apps" className="mt-3 space-y-3">
            <Panel title={`Portfólio de aplicativos (${filtered.length} de ${PRODUCTS.length})`}>
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar por nome, família ou ID"
                  aria-label="Buscar produto"
                />
                {(
                  [
                    ["Família", family, setFamily, families],
                    ["Classificação", classification, setClassification, classifications],
                    ["Estágio", stage, setStage, stages],
                  ] as const
                ).map(([label, value, set, options]) => (
                  <label key={label} className="text-xs text-muted-foreground">
                    <span className="sr-only">{label}</span>
                    <select
                      value={value}
                      onChange={(e) => set(e.target.value)}
                      aria-label={label}
                      className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="todos">{label}: todos</option>
                      {options.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="space-y-2">
                {filtered.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Nenhum produto atende a esses filtros. Ajuste a busca para ver o portfólio.
                  </p>
                ) : (
                  filtered.map((p) => (
                    <InteractiveRow
                      key={p.id}
                      selected={openId === p.id}
                      onOpen={() => setOpenId(p.id)}
                      label={`Abrir ficha de ${p.name}`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] text-muted-foreground">{p.id}</span>
                        <span className="font-medium">{p.name}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {p.family}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {p.classification}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-primary/40 text-[10px] text-primary"
                        >
                          {p.stage}
                        </Badge>
                        <TruthBadge truth={p.truth} />
                      </div>
                    </InteractiveRow>
                  ))
                )}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="core" className="mt-3">
            <Panel title="CORE como produto / ativo estratégico">
              <p className="text-sm text-muted-foreground">
                Resumo gerencial apenas. A profundidade técnica (arquitetura, saúde, bindings,
                CALLs, versões) vive na superfície CORE.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/core">Abrir CORE técnico</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/labtest">Ver candidatos no LABTEST</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/owner/apps">Portfólio detalhado de aplicativos</Link>
                </Button>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="plugins" className="mt-3">
            <Panel title="Plugins & Providers do portfólio">
              <p className="text-xs text-muted-foreground">
                Visão gerencial de dependências externas. A configuração técnica, o teste real e a
                comparação Atual → Novo ficam nas Configurações do CORE.
              </p>
              <div className="mt-3 space-y-2">
                {PLUGINS.map((pl) => (
                  <div
                    key={pl.name}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-3 text-sm"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="font-medium">{pl.name}</span>{" "}
                      <span className="text-xs text-muted-foreground">· {pl.role}</span>
                    </span>
                    <TruthBadge truth={pl.truth} />
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/core/settings">Abrir Configurações do CORE</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/core/apps">Bindings técnicos</Link>
                </Button>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="quality" className="mt-3">
            <Panel title="Qualidade, satisfação & SAC por produto">
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { label: "Testes com evidência", value: "—", truth: "NOT_VERIFIED" },
                  { label: "Satisfação / NPS", value: "—", truth: "NOT_CONNECTED" },
                  { label: "Chamados abertos (SAC)", value: "—", truth: "NOT_CONNECTED" },
                  { label: "Incidentes reincidentes", value: "—", truth: "NOT_CONNECTED" },
                ].map((q) => (
                  <div
                    key={q.label}
                    className="rounded-lg border border-border/50 bg-surface-1/40 p-3"
                  >
                    <p className="text-xs text-muted-foreground">{q.label}</p>
                    <p className="mt-1 font-display text-xl font-semibold">{q.value}</p>
                    <div className="mt-2">
                      <TruthBadge truth={q.truth} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Nenhum número de satisfação ou atendimento é inventado. Enquanto não houver canal de
                SAC e execução de testes conectados, estes indicadores permanecem sem valor.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button asChild size="sm" variant="outline">
                  <Link to="/core/tests">Testes & Qualidade do CORE</Link>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link to="/owner/plans">Abrir planos e melhorias</Link>
                </Button>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>

        <NotConnected
          what="Vendas, receita, adoção, churn, NPS e valuation por produto"
          next="Conectar base de contratos/cobrança e telemetria; até então esses indicadores permanecem — / NOT_VERIFIED."
        />
      </ContextLayout>
    </AppShell>
  );
}

export const Route = createFileRoute("/owner/products")({
  head: () => ({
    meta: [
      { title: "Produtos — Portfólio Gerencial | LAMOU IA Central" },
      {
        name: "description",
        content:
          "Catálogo gerencial do portfólio LAMOU: aplicativos incubados do proprietário, produtos comerciais, estágios, clientes e o CORE como ativo estratégico.",
      },
      { property: "og:title", content: "Produtos — Portfólio Gerencial | LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Estágio, classificação, clientes, receita e valor por produto — com truth-state explícito quando não há fonte medida.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});
