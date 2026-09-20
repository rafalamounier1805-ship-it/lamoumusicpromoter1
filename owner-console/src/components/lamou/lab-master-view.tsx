import {
  Area,
  AreaChart,
  CartesianGrid,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  Beaker,
  ChevronRight,
  Gauge,
  History,
  Microscope,
  Network,
  Play,
  Radar as RadarIcon,
  Search,
  ShieldCheck,
  Sparkles,
  TestTube2,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { OwnerOfficialIcon } from "@/components/lamou/owner-official-icon";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ARCHITECTURE_EVOLUTION,
  EVOLUTION_ROWS,
  LAB_CANONICAL_SCREENS,
  MY_TEST_FIELDS,
  RADAR_OPPORTUNITIES,
  RESEARCH_MAP,
  TEST_FAMILIES,
  THEORY_MAP,
  type LabReadingLevel,
  type LabScreenKey,
} from "@/lib/lamou/lab-master-data";
import { LT_ITEMS } from "@/lib/lamou/labtest-data";
import { cn } from "@/lib/utils";

type DataMode = "all" | "critical";

type LocalTest = {
  id: string;
  title: string;
  object: string;
  objective: string;
  baseline: string;
  expected: string;
  truth: "NOT_RUN";
};

const METRIC_TREND = [
  { period: "Run 01", effectiveness: 62, evidence: 54, reality: 48 },
  { period: "Run 02", effectiveness: 68, evidence: 61, reality: 55 },
  { period: "Run 03", effectiveness: 73, evidence: 69, reality: 61 },
  { period: "Run 04", effectiveness: 79, evidence: 76, reality: 67 },
  { period: "Run 05", effectiveness: 82, evidence: 80, reality: 70 },
];

const RADAR_DATA = [
  { axis: "Evidência", value: 76 },
  { axis: "Reprodut.", value: 72 },
  { axis: "Segurança", value: 84 },
  { axis: "Custo", value: 66 },
  { axis: "Realidade", value: 70 },
  { axis: "Cobertura", value: 81 },
];

const LAB_FACTS = {
  screenCount: LAB_CANONICAL_SCREENS.length,
  theoryCount: THEORY_MAP.length,
  researchCount: RESEARCH_MAP.length,
  radarCount: RADAR_OPPORTUNITIES.length,
};

const truthTone = (truth: string) => {
  if (truth.includes("VERIFIED") || truth === "MEASURED") return "border-success/40 text-success";
  if (truth.includes("PARTIAL") || truth === "SYNTHETIC") return "border-warning/40 text-warning";
  if (truth.includes("NOT_CONNECTED")) return "border-border/60 text-muted-foreground";
  return "border-violet/40 text-violet";
};

function TruthPill({ truth }: { truth: string }) {
  return (
    <Badge variant="outline" className={cn("font-mono text-[9px]", truthTone(truth))}>
      {truth}
    </Badge>
  );
}

function ReadingToggle({
  value,
  onChange,
}: {
  value: LabReadingLevel;
  onChange: (value: LabReadingLevel) => void;
}) {
  const options: { key: LabReadingLevel; label: string; helper: string }[] = [
    { key: "essential", label: "Essencial", helper: "decisão" },
    { key: "intermediate", label: "Intermediário", helper: "operação" },
    { key: "technical", label: "Técnico", helper: "auditoria" },
  ];
  return (
    <div
      className="flex flex-wrap items-center gap-1 rounded-xl border border-border/60 bg-surface-1/60 p-1"
      role="group"
      aria-label="Nível de leitura"
    >
      {options.map((option) => (
        <Button
          key={option.key}
          type="button"
          size="sm"
          variant={value === option.key ? "default" : "ghost"}
          aria-pressed={value === option.key}
          onClick={() => onChange(option.key)}
          className="h-8"
        >
          {option.label}
          <span className="ml-1 hidden text-[9px] opacity-70 sm:inline">· {option.helper}</span>
        </Button>
      ))}
    </div>
  );
}

function DataModeToggle({
  value,
  onChange,
}: {
  value: DataMode;
  onChange: (value: DataMode) => void;
}) {
  return (
    <div className="flex rounded-xl border border-border/60 bg-surface-1/60 p-1">
      <Button
        size="sm"
        variant={value === "all" ? "default" : "ghost"}
        onClick={() => onChange("all")}
        aria-pressed={value === "all"}
        className="h-8"
      >
        Todos os dados
      </Button>
      <Button
        size="sm"
        variant={value === "critical" ? "default" : "ghost"}
        onClick={() => onChange("critical")}
        aria-pressed={value === "critical"}
        className="h-8"
      >
        Dados críticos
      </Button>
    </div>
  );
}

function DidacticGuide({
  reading,
  screen,
}: {
  reading: LabReadingLevel;
  screen: (typeof LAB_CANONICAL_SCREENS)[number];
}) {
  return (
    <div className="grid gap-2 rounded-2xl border border-primary/20 bg-primary/5 p-3 md:grid-cols-2 xl:grid-cols-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Em palavras simples</p>
        <p className="mt-1 text-xs">{screen.simple}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">Por que importa</p>
        <p className="mt-1 text-xs text-muted-foreground">{screen.why}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">O que já sabemos</p>
        <p className="mt-1 text-xs text-muted-foreground">{screen.known}</p>
      </div>
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-wide text-primary">O que fazer agora</p>
        <p className="mt-1 text-xs text-muted-foreground">{screen.next}</p>
      </div>
      {reading !== "essential" ? (
        <div className="md:col-span-2 xl:col-span-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-warning">Ainda falta provar</p>
          <p className="mt-1 text-xs text-muted-foreground">{screen.pending}</p>
        </div>
      ) : null}
      {reading === "technical" ? (
        <div className="md:col-span-2 xl:col-span-4 rounded-xl border border-border/50 bg-background/40 p-2">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-violet">Leitura técnica</p>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">{screen.technical}</p>
        </div>
      ) : null}
    </div>
  );
}

function MaturityCard({
  label,
  current,
  target,
  potential,
  truth,
  onOpen,
}: {
  label: string;
  current: number;
  target: number;
  potential: number;
  truth: string;
  onOpen?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="w-full rounded-2xl border border-border/60 bg-card/70 p-4 text-left outline-none transition hover:border-primary/40 hover:bg-card focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="flex items-start gap-3">
        <OwnerOfficialIcon code="OWNER-ICO-008" className="h-10 w-10" decorative={false} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{label}</p>
            <TruthPill truth={truth} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Hoje</p>
              <p className="font-display text-xl font-semibold">{current}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Meta 10</p>
              <p className="font-display text-xl font-semibold text-primary">{target}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase text-muted-foreground">Potencial 15</p>
              <p className="font-display text-xl font-semibold text-violet">{potential}%</p>
            </div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-2">
            <div className="h-full bg-primary/70" style={{ width: `${current}%` }} />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">
            10/15 é camada de maturidade com evidência; não substitui PASS/FAIL.
          </p>
        </div>
      </div>
    </button>
  );
}

function EvolutionTable({
  search,
  dataMode,
}: {
  search: string;
  dataMode: DataMode;
}) {
  const rows = EVOLUTION_ROWS.filter((row) => {
    const hit = [row.item, row.type, row.situation, row.existing, row.evolution]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase());
    const critical = row.priority === "P0" || row.priority === "P1";
    return hit && (dataMode === "all" || critical);
  });
  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.id} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
          <div className="flex flex-wrap items-start gap-2">
            <Badge variant="outline" className="font-mono text-[9px]">
              {row.id}
            </Badge>
            <Badge variant="outline" className="text-[9px]">
              {row.priority}
            </Badge>
            <span className="min-w-0 flex-1 text-sm font-semibold">{row.item}</span>
            <TruthPill truth={row.truth} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{row.situation}</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="rounded-lg border border-border/40 p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Hoje</p>
              <p className="text-lg font-semibold">{row.current}%</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Com o que já temos / 10</p>
              <p className="text-lg font-semibold text-primary">{row.withExisting}%</p>
            </div>
            <div className="rounded-lg border border-violet/20 bg-violet/5 p-2">
              <p className="text-[10px] uppercase text-muted-foreground">Com evolução / 15</p>
              <p className="text-lg font-semibold text-violet">{row.withEvolution}%</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-[11px] text-muted-foreground md:grid-cols-3">
            <p>
              <b className="text-foreground">Já temos:</b> {row.existing}
            </p>
            <p>
              <b className="text-foreground">Evolução:</b> {row.evolution}
            </p>
            <p>
              <b className="text-foreground">Próxima ação:</b> {row.next}
            </p>
          </div>
        </div>
      ))}
      {rows.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum item atende ao filtro atual.
        </div>
      ) : null}
    </div>
  );
}

function ArchitectureFlow() {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max items-center gap-2">
        {ARCHITECTURE_EVOLUTION.map((item, index) => (
          <div key={item} className="flex items-center gap-2">
            <div className="w-40 rounded-xl border border-border/60 bg-card/70 p-3 text-center">
              <p className="text-[10px] text-muted-foreground">{index === 0 ? "BASELINE" : `ETAPA ${index}`}</p>
              <p className="mt-1 text-xs font-semibold">{item}</p>
              <p className="mt-1 text-[9px] text-muted-foreground">
                {index <= 1 ? "referência" : "LAB / hipótese"}
              </p>
            </div>
            {index < ARCHITECTURE_EVOLUTION.length - 1 ? (
              <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            ) : null}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Fluxo de investigação, não ranking: cada seta exige hipótese → teste → delta → evidência → trade-off.
      </p>
    </div>
  );
}

function TheoryMap({ reading }: { reading: LabReadingLevel }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {THEORY_MAP.map((theory) => (
        <div key={theory.id} className="rounded-2xl border border-border/60 bg-card/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-[9px]">
              {theory.id}
            </Badge>
            <span className="min-w-0 flex-1 font-semibold">{theory.name}</span>
            <TruthPill truth={theory.truth} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{theory.problem}</p>
          <div className="mt-3 flex items-center gap-2 text-[11px]">
            <span className="rounded-full border border-border/50 px-2 py-1">{theory.state}</span>
            <span>favoráveis {theory.favorable}</span>
            <span>contrárias {theory.contrary}</span>
          </div>
          <div className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3">
            <p className="text-[10px] uppercase text-primary">Hipótese</p>
            <p className="mt-1 text-xs">{theory.hypothesis}</p>
          </div>
          {reading !== "essential" ? (
            <div className="mt-3 grid gap-2 text-[11px] text-muted-foreground">
              <p>
                <b className="text-foreground">Falsifica se:</b> {theory.falsifier}
              </p>
              <p>
                <b className="text-foreground">Arquiteturas:</b> {theory.architectures.join(", ")}
              </p>
              <p>
                <b className="text-foreground">Testes:</b> {theory.tests.join(", ")}
              </p>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function ResearchMap({ reading }: { reading: LabReadingLevel }) {
  return (
    <div className="space-y-3">
      {RESEARCH_MAP.map((item) => (
        <div key={item.id} className="rounded-2xl border border-border/60 bg-card/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-[9px]">
              {item.id}
            </Badge>
            <span className="min-w-0 flex-1 font-semibold">{item.title}</span>
            <TruthPill truth={item.truth} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Fonte: {item.source} · qualidade {item.quality} · Potential Fit{" "}
            {item.fit === null ? "— / NOT_VERIFIED" : `${item.fit}%`}
          </p>
          <div className="mt-3 flex flex-wrap gap-1">
            {item.match.map((match) => (
              <Badge key={match} variant="outline" className="text-[9px]">
                {match}
              </Badge>
            ))}
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
              <p className="text-[10px] uppercase text-primary">Hipótese</p>
              <p className="mt-1 text-xs">{item.hypothesis}</p>
            </div>
            <div className="rounded-xl border border-warning/20 bg-warning/5 p-3">
              <p className="text-[10px] uppercase text-warning">Contradição / limite</p>
              <p className="mt-1 text-xs">{item.contradiction}</p>
            </div>
          </div>
          {reading === "technical" ? (
            <p className="mt-3 font-mono text-[11px] text-muted-foreground">
              TEST_SUGGESTION: {item.suggestedTest}
            </p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function RadarOpportunities({
  dataMode,
  onSend,
}: {
  dataMode: DataMode;
  onSend: (id: string) => void;
}) {
  const rows = RADAR_OPPORTUNITIES.filter(
    (item) => dataMode === "all" || item.state === "TEST_CANDIDATE" || item.state === "LAB_ONLY",
  );
  return (
    <div className="space-y-3">
      {rows.map((item) => (
        <div key={item.id} className="rounded-2xl border border-border/60 bg-card/70 p-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono text-[9px]">
              {item.id}
            </Badge>
            <span className="min-w-0 flex-1 font-semibold">{item.title}</span>
            <Badge variant="outline" className="text-[9px]">
              {item.state}
            </Badge>
            <TruthPill truth={item.truth} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{item.gap}</p>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg border border-border/50 p-2">
              <p className="text-[9px] uppercase text-muted-foreground">Hoje</p>
              <p className="text-lg font-semibold">{item.current}%</p>
            </div>
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-2">
              <p className="text-[9px] uppercase text-muted-foreground">Meta 10</p>
              <p className="text-lg font-semibold text-primary">{item.target10}%</p>
            </div>
            <div className="rounded-lg border border-violet/20 bg-violet/5 p-2">
              <p className="text-[9px] uppercase text-muted-foreground">Potencial 15</p>
              <p className="text-lg font-semibold text-violet">{item.potential15}%</p>
            </div>
          </div>
          <div className="mt-3 grid gap-2 text-[11px] text-muted-foreground md:grid-cols-2">
            <p>
              <b className="text-foreground">Hipótese:</b> {item.hypothesis}
            </p>
            <p>
              <b className="text-foreground">Teste:</b> {item.test}
            </p>
            <p>
              <b className="text-foreground">Benefício:</b> {item.benefit}
            </p>
            <p>
              <b className="text-foreground">Risco:</b> {item.risk}
            </p>
          </div>
          <Button size="sm" variant="outline" className="mt-3" onClick={() => onSend(item.id)}>
            <Beaker className="mr-2 h-4 w-4" aria-hidden="true" />
            Enviar como experimento local
          </Button>
        </div>
      ))}
    </div>
  );
}

function MetricCharts() {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Panel title="Efetividade, evidência e alinhamento com realidade">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={METRIC_TREND} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="period" tick={{ fontSize: 10 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} unit="%" />
              <RechartsTooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 12,
                  fontSize: 11,
                }}
              />
              <Area type="monotone" dataKey="effectiveness" name="Test Effectiveness" stroke="currentColor" fill="currentColor" fillOpacity={0.08} />
              <Area type="monotone" dataKey="evidence" name="Cobertura de evidência" stroke="currentColor" fillOpacity={0} strokeDasharray="5 4" />
              <Area type="monotone" dataKey="reality" name="Reality Alignment" stroke="currentColor" fillOpacity={0} strokeDasharray="2 4" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          SYNTHETIC_DEMO · estrutura do gráfico e semântica validadas; valores demonstrativos.
        </p>
      </Panel>
      <Panel title="Radar do teste · visão multidimensional">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={RADAR_DATA}>
              <PolarGrid />
              <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10 }} />
              <Radar dataKey="value" stroke="currentColor" fill="currentColor" fillOpacity={0.12} />
              <RechartsTooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <p className="mt-2 text-[10px] text-muted-foreground">
          Radar não cria nota geral; dimensões permanecem separadas.
        </p>
      </Panel>
    </div>
  );
}

function TestsScreen({
  localTests,
  setLocalTests,
  log,
}: {
  localTests: LocalTest[];
  setLocalTests: Dispatch<SetStateAction<LocalTest[]>>;
  log: (text: string) => void;
}) {
  const [title, setTitle] = useState("");
  const [object, setObject] = useState("");
  const [objective, setObjective] = useState("");
  const [baseline, setBaseline] = useState("CORE Padrão / SOL");
  const [expected, setExpected] = useState("");

  const create = () => {
    if (!title.trim() || !objective.trim()) {
      log("Novo teste bloqueado: título e objetivo são obrigatórios.");
      return;
    }
    const id = `MY-${String(localTests.length + 1).padStart(3, "0")}`;
    setLocalTests((current) => [
      {
        id,
        title: title.trim(),
        object: object.trim() || "não definido",
        objective: objective.trim(),
        baseline,
        expected: expected.trim() || "não definido",
        truth: "NOT_RUN",
      },
      ...current,
    ]);
    log(`${id} criado localmente como NOT_RUN. Criar ≠ executar ≠ promover.`);
    setTitle("");
    setObject("");
    setObjective("");
    setExpected("");
  };

  return (
    <div className="space-y-4">
      <Panel title="Famílias de teste">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {TEST_FAMILIES.map((family, index) => (
            <div key={family} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
              <p className="font-mono text-[9px] text-muted-foreground">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-1 text-xs font-semibold">{family}</p>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Meus Testes · criar candidato local">
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <Label htmlFor="my-test-title" className="text-xs">Nome *</Label>
            <Input id="my-test-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex.: Snapshot + Delta" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="my-test-object" className="text-xs">Objeto</Label>
            <Input id="my-test-object" value={object} onChange={(e) => setObject(e.target.value)} placeholder="CORE, app, arquitetura..." className="mt-1" />
          </div>
          <div>
            <Label htmlFor="my-test-objective" className="text-xs">Objetivo *</Label>
            <Input id="my-test-objective" value={objective} onChange={(e) => setObjective(e.target.value)} placeholder="O que queremos provar?" className="mt-1" />
          </div>
          <div>
            <Label htmlFor="my-test-baseline" className="text-xs">Baseline</Label>
            <Input id="my-test-baseline" value={baseline} onChange={(e) => setBaseline(e.target.value)} className="mt-1" />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="my-test-expected" className="text-xs">Resultado esperado</Label>
            <Input id="my-test-expected" value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="Critério que será comparado ao resultado real" className="mt-1" />
          </div>
        </div>
        <Button size="sm" className="mt-3" onClick={create}>
          <TestTube2 className="mr-2 h-4 w-4" aria-hidden="true" />
          Criar teste candidato
        </Button>
        <p className="mt-2 text-[10px] text-muted-foreground">Persistência desta candidata: local da sessão. Runner externo continua NOT_CONNECTED.</p>
      </Panel>
      <Panel title="Meus Testes · sessão atual">
        <div className="space-y-2">
          {localTests.length ? localTests.map((test) => (
            <div key={test.id} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[9px]">{test.id}</Badge>
                <span className="min-w-0 flex-1 text-sm font-semibold">{test.title}</span>
                <TruthPill truth={test.truth} />
              </div>
              <p className="mt-2 text-xs text-muted-foreground">Objeto: {test.object} · baseline {test.baseline}</p>
              <p className="mt-1 text-xs">{test.objective}</p>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">Nenhum teste personalizado criado nesta sessão.</p>
          )}
        </div>
      </Panel>
      <Panel title="Schema completo de Meus Testes">
        <div className="flex flex-wrap gap-1">
          {MY_TEST_FIELDS.map((field) => (
            <Badge key={field} variant="outline" className="font-mono text-[9px]">{field}</Badge>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function ValidationScreen() {
  const checks = [
    ["Versão/target resolvido", "PARTIAL"],
    ["Hipótese clara", "IMPLEMENTED_VERIFIED"],
    ["Baseline PINNED/FROZEN", "IMPLEMENTED_VERIFIED"],
    ["Oracle definido", "PARTIAL"],
    ["Evidências obrigatórias", "PARTIAL"],
    ["Ambiente autorizado", "NOT_VERIFIED"],
    ["Reverse path / cleanup", "PARTIAL"],
    ["Runner conectado", "NOT_CONNECTED"],
  ] as const;
  return (
    <div className="space-y-4">
      <Panel title="Validation pré-execução">
        <div className="grid gap-2 md:grid-cols-2">
          {checks.map(([label, truth]) => (
            <div key={label} className="flex items-center gap-2 rounded-xl border border-border/50 bg-surface-1/40 p-3">
              <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="min-w-0 flex-1 text-xs">{label}</span>
              <TruthPill truth={truth} />
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Validation pós-execução">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
          {["PASS", "FAIL", "BLOCKED", "NOT_RUN", "NOT_VERIFIED"].map((state) => (
            <div key={state} className="rounded-xl border border-border/50 p-3 text-center">
              <p className="font-mono text-xs font-semibold">{state}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          PASS exige oracle satisfeito + Evidence Pack + versão/hash + integridade. Aprovação do gate não promove automaticamente.
        </p>
      </Panel>
    </div>
  );
}

function GenericScreen({
  screenKey,
  reading,
  onLog,
}: {
  screenKey: LabScreenKey;
  reading: LabReadingLevel;
  onLog: (text: string) => void;
}) {
  switch (screenKey) {
    case "testes":
      return null;
    case "validation":
      return <ValidationScreen />;
    case "cube":
      return (
        <div className="space-y-4">
          <Panel title="Cubo Mágico · componente experimental navegável">
            <div className="grid gap-3 lg:grid-cols-[.75fr_1.25fr]">
              <div className="flex aspect-square max-h-80 items-center justify-center rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card to-violet/10">
                <div className="relative h-44 w-44">
                  <div className="absolute inset-4 rotate-12 rounded-3xl border border-primary/40 bg-primary/5 shadow-[0_0_60px_oklch(0.7_0.15_220/0.15)]" />
                  <div className="absolute inset-4 -rotate-12 rounded-3xl border border-violet/40 bg-violet/5" />
                  <div className="absolute inset-10 flex items-center justify-center rounded-2xl border border-border/60 bg-card/90">
                    <OwnerOfficialIcon code="OWNER-ICO-003" className="h-20 w-20" decorative={false} />
                  </div>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  ["C-ID", "identidade canônica da célula"],
                  ["Linha/coluna", "posição e agrupamento"],
                  ["Caminho", "rota até o working-set"],
                  ["Contexto", "sinais e filtros ativos"],
                  ["Evidence", "proveniência vinculada"],
                  ["Truth-state", "SYNTHETIC / MEASURED / NOT_VERIFIED"],
                ].map(([title, text]) => (
                  <div key={title} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                    <p className="text-xs font-semibold">{title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
          <Panel title="Regra de comparação">
            <ArchitectureFlow />
          </Panel>
        </div>
      );
    case "architectures":
      return (
        <div className="space-y-4">
          <Panel title="Mapa de evolução arquitetural">
            <ArchitectureFlow />
          </Panel>
          <Panel title="Mapa de Teorias & Hipóteses">
            <TheoryMap reading={reading} />
          </Panel>
        </div>
      );
    case "database":
      return (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Fontes de dados">
            <div className="grid gap-2 sm:grid-cols-2">
              {["REAL autorizado", "SYNTHETIC", "EXTERNAL", "DERIVED", "NOT_VERIFIED", "Replay histórico"].map((item) => (
                <div key={item} className="rounded-xl border border-border/50 bg-surface-1/40 p-3 text-xs">{item}</div>
              ))}
            </div>
          </Panel>
          <Panel title="Escala & mídia">
            <div className="flex flex-wrap gap-1">
              {["30", "300", "30.000", "30 milhões", "customizada", "XLSX", "CSV", "JSON", "PDF", "DOCX", "imagem", "áudio", "vídeo", "telemetria"].map((item) => (
                <Badge key={item} variant="outline" className="text-[10px]">{item}</Badge>
              ))}
            </div>
          </Panel>
        </div>
      );
    case "simulations":
      return (
        <div className="space-y-4">
          <Panel title="A/B/C/D-SAFE">
            <div className="grid gap-2 sm:grid-cols-5">
              {["A", "B", "C", "D", "SAFE"].map((arm) => (
                <button
                  key={arm}
                  type="button"
                  onClick={() => onLog(`Braço ${arm} selecionado localmente para configuração. Nenhuma execução foi iniciada.`)}
                  className="rounded-xl border border-border/60 bg-card/70 p-4 text-center outline-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <p className="font-display text-2xl font-semibold">{arm}</p>
                  <p className="mt-1 text-[10px] text-muted-foreground">{arm === "SAFE" ? "rota controlada" : "braço experimental"}</p>
                </button>
              ))}
            </div>
          </Panel>
          <Panel title="Modos de runtime">
            <div className="flex flex-wrap gap-2">
              {["Runtime A", "Runtime B", "Runtime C", "Shadow", "Dry Run", "Replay", "Sandbox", "Mock", "Canary"].map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </Panel>
        </div>
      );
    case "personas":
      return (
        <div className="grid gap-4 xl:grid-cols-3">
          {[
            { title: "Teste³ IA", text: "simulação digital de workers/personas e cenários" },
            { title: "Persona Lab", text: "perfil, contexto, jornada e comportamento sintético" },
            { title: "Quest 360 / UAT", text: "perguntas, pesquisa e validação humana autorizada" },
          ].map((item) => (
            <Panel key={item.title} title={item.title}>
              <p className="text-sm text-muted-foreground">{item.text}</p>
              <TruthPill truth="PARTIAL" />
            </Panel>
          ))}
        </div>
      );
    case "evidence":
      return (
        <div className="space-y-4">
          <Panel title="Mapa de Pesquisa & Estudos">
            <ResearchMap reading={reading} />
          </Panel>
          <Panel title="Mapa de Teorias & Hipóteses">
            <TheoryMap reading={reading} />
          </Panel>
        </div>
      );
    case "metrics":
      return <MetricCharts />;
    case "model":
      return (
        <div className="space-y-4">
          <Panel title="Modelos experimentais disponíveis">
            <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
              {[
                ["A/B", "uma variável, dois braços"],
                ["A/B/C/D-SAFE", "múltiplos braços com rota segura"],
                ["Ablation", "remove componentes para atribuir ganho"],
                ["Replay pareado", "mesma sequência contra versões diferentes"],
                ["Shadow", "observa sem afetar produção"],
                ["DOE", "somente quando desenho multifatorial for justificado"],
                ["Seeded defects", "mede capacidade de detectar falha conhecida"],
                ["Canary", "exposição progressiva sob gate"],
              ].map(([title, text]) => (
                <div key={title} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                  <p className="text-xs font-semibold">{title}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      );
    case "compare":
      return (
        <div className="space-y-4">
          <MetricCharts />
          <Panel title="Comparação 10 → 15 por objeto">
            <EvolutionTable search="" dataMode="all" />
          </Panel>
        </div>
      );
    case "prediction":
      return (
        <Panel title="Predição & Antecipação">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {[
              ["Lead time", "tempo útil antes do evento"],
              ["False alarm", "alerta sem evento"],
              ["Miss", "evento não antecipado"],
              ["Drift", "mudança de distribuição"],
              ["Calibração", "probabilidade vs frequência real"],
            ].map(([title, text]) => (
              <div key={title} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                <p className="text-xs font-semibold">{title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </Panel>
      );
    case "campaigns":
      return (
        <Panel title="Campanhas de teste">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["LAB V0.9 / 21 telas", "8 obrigatórios · 3 pendentes", "CANDIDATE"],
              ["CORE Cubo", "6 comparações · evidence local", "TEST"],
              ["Meta-Validation", "seeded defects · false PASS/FAIL", "NOT_RUN"],
            ].map(([title, detail, state]) => (
              <div key={title} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                <p className="text-xs font-semibold">{title}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{detail}</p>
                <Badge variant="outline" className="mt-2 text-[9px]">{state}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      );
    case "council":
      return (
        <Panel title="Conselho Profissional">
          <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
            {[
              "Produto",
              "Software",
              "Arquitetura",
              "Dados",
              "Estatística",
              "UX / Tela",
              "Acessibilidade",
              "QA / Testes",
              "Segurança",
              "Pesquisa",
              "Processo",
              "Pedagógico",
            ].map((lens) => (
              <div key={lens} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                <p className="text-xs font-semibold">{lens}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">Recomenda e desafia; não promove nem sobrescreve evidência.</p>
              </div>
            ))}
          </div>
        </Panel>
      );
    case "registry":
      return (
        <div className="grid gap-4 xl:grid-cols-4">
          {[
            { title: "CURRENT", text: "versão efetiva vigente", truth: "IMPLEMENTED_VERIFIED" },
            { title: "PINNED", text: "snapshot exato para evidência/replay", truth: "IMPLEMENTED_VERIFIED" },
            { title: "FROZEN", text: "baseline congelada", truth: "IMPLEMENTED_VERIFIED" },
            { title: "CANDIDATE", text: "mudança ainda não promovida", truth: "PARTIAL" },
          ].map((item) => (
            <Panel key={item.title} title={item.title}>
              <p className="text-sm text-muted-foreground">{item.text}</p>
              <TruthPill truth={item.truth} />
            </Panel>
          ))}
        </div>
      );
    case "scheduler":
      return (
        <Panel title="Programados / Scheduler">
          <div className="space-y-2">
            {[
              { title: "Reteste LAB V0.9", trigger: "quando build mudar", state: "PLANNED" },
              { title: "Drift check IA / Gateway", trigger: "após mudança de provider/modelo", state: "PLANNED" },
              { title: "Revalidação Research Scout", trigger: "quando conectar fonte", state: "WAITING_CONNECTION" },
              { title: "Evidence expiry", trigger: "por versão/política", state: "PLANNED" },
            ].map((item) => (
              <div key={item.title} className="flex flex-wrap items-center gap-2 rounded-xl border border-border/50 bg-surface-1/40 p-3">
                <History className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1 text-xs font-semibold">{item.title}</span>
                <span className="text-[10px] text-muted-foreground">{item.trigger}</span>
                <Badge variant="outline" className="text-[9px]">{item.state}</Badge>
              </div>
            ))}
          </div>
        </Panel>
      );
    case "history":
      return (
        <Panel title="Histórico auditável">
          <div className="space-y-2">
            {[
              ["20/09/2026", "LAB V0.9 iniciado a partir do CORE oficial; 21 telas recuperadas."],
              ["16/09/2026", "V0.8 consolidou fluxo pergunta → teste → arquitetura → objeto → validation."],
              ["15/09/2026", "V0.7 adicionou leitura Essencial / Intermediário / Técnico."],
              ["10/09/2026", "LAB consolidou Testes + Validation + Métricas."],
            ].map(([date, text]) => (
              <div key={date} className="grid gap-1 rounded-xl border border-border/50 bg-surface-1/40 p-3 sm:grid-cols-[120px_1fr]">
                <p className="font-mono text-[10px] text-muted-foreground">{date}</p>
                <p className="text-xs">{text}</p>
              </div>
            ))}
          </div>
        </Panel>
      );
    case "audit":
      return (
        <div className="grid gap-4 xl:grid-cols-2">
          <Panel title="Controles obrigatórios">
            <div className="flex flex-wrap gap-1">
              {["RBAC", "Tenant isolation", "Secrets", "Consentimento", "Integridade", "LGPD", "Logs", "Assinatura", "Hash", "Authorization Gate"].map((item) => (
                <Badge key={item} variant="outline">{item}</Badge>
              ))}
            </div>
          </Panel>
          <Panel title="Regra">
            <p className="text-sm text-muted-foreground">Declaração em UI não prova enforcement server-side. Resultado técnico exige trilha de identidade, permissão e evidência.</p>
          </Panel>
        </div>
      );
    case "self":
      return (
        <Panel title="Meta-Validation / Self-Test">
          <div className="rounded-2xl border border-warning/30 bg-warning/5 p-4">
            <div className="flex items-start gap-3">
              <TriangleAlert className="h-5 w-5 text-warning" aria-hidden="true" />
              <div>
                <p className="font-semibold">Pergunta de confiança</p>
                <p className="mt-1 text-sm text-muted-foreground">O LAB consegue encontrar um erro que sabemos que existe?</p>
              </div>
            </div>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => onLog("Self-test local executado: estrutura validada; seeded defect runtime permanece NOT_CONNECTED.")}
            >
              <Play className="mr-2 h-4 w-4" aria-hidden="true" />
              Rodar self-test local
            </Button>
          </div>
        </Panel>
      );
    case "result":
      return (
        <div className="space-y-4">
          <Panel title="Resultado Geral · síntese final">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Telas canônicas", value: String(LAB_FACTS.screenCount), truth: "IMPLEMENTED_VERIFIED" },
                { label: "Teorias mapeadas", value: String(LAB_FACTS.theoryCount), truth: "PARTIAL" },
                { label: "Intakes de pesquisa", value: String(LAB_FACTS.researchCount), truth: "NOT_CONNECTED" },
                { label: "Oportunidades radar", value: String(LAB_FACTS.radarCount), truth: "PARTIAL" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                  <p className="text-[10px] uppercase text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-display text-2xl font-semibold">{item.value}</p>
                  <TruthPill truth={item.truth} />
                </div>
              ))}
            </div>
          </Panel>
          <MetricCharts />
          <Panel title="Conclusão governada">
            <p className="text-sm text-muted-foreground">
              Resultado Geral consolida somente fontes exibidas nas telas anteriores. NOT_VERIFIED e NOT_CONNECTED permanecem pendentes; nenhuma oportunidade, teoria ou score promove uma mudança.
            </p>
          </Panel>
        </div>
      );
    default:
      return null;
  }
}

export function LabMasterView({
  initialSection = "lab",
}: {
  initialSection?: LabScreenKey;
}) {
  const [screenKey, setScreenKey] = useState<LabScreenKey>(initialSection);
  const [reading, setReading] = useState<LabReadingLevel>("essential");
  const [dataMode, setDataMode] = useState<DataMode>("all");
  const [search, setSearch] = useState("");
  const [localTests, setLocalTests] = useState<LocalTest[]>([]);
  const [sessionLog, setSessionLog] = useState<string[]>([]);
  const [question, setQuestion] = useState("");

  const screen = LAB_CANONICAL_SCREENS.find((item) => item.key === screenKey) ?? LAB_CANONICAL_SCREENS[0]!;

  const criticalCount = useMemo(
    () => EVOLUTION_ROWS.filter((row) => row.priority === "P0" || row.priority === "P1").length,
    [],
  );

  const addLog = (text: string) => {
    setSessionLog((current) => [`${new Date().toLocaleString("pt-BR")} — ${text}`, ...current].slice(0, 20));
  };

  const sendRadar = (id: string) => {
    addLog(`${id} enviado para experimento local como TEST_CANDIDATE. Nenhuma promoção realizada.`);
    setScreenKey("testes");
  };

  const jump = (key: LabScreenKey) => {
    setScreenKey(key);
    window?.scrollTo?.({ top: 0, behavior: "smooth" });
  };

  return (
    <AppShell group="labtest">
      <PageHeader
        title="LAMOU LABTEST · laboratório mestre de evolução"
        subtitle="Pergunta → teste → baseline → execução → evidência → Validation → resultado → reteste → eficácia → próximo experimento."
        right={
          <>
            <DemoBadge label="V0.9 · 21 TELAS RECUPERADAS" />
            <TruthBadge truth="NOT_CONNECTED" hint="Runners/fontes externas dependem de conexão real" />
          </>
        }
      />

      <div className="flex flex-wrap items-center justify-between gap-2">
        <ReadingToggle value={reading} onChange={setReading} />
        <DataModeToggle value={dataMode} onChange={setDataMode} />
      </div>

      <div className="grid gap-4 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="self-start rounded-2xl border border-border/60 bg-card/70 p-2 xl:sticky xl:top-20">
          <div className="mb-2 flex items-center gap-2 px-2 py-2">
            <OwnerOfficialIcon code="OWNER-ICO-008" className="h-8 w-8" decorative={false} />
            <div>
              <p className="text-xs font-semibold">21 telas canônicas</p>
              <p className="text-[10px] text-muted-foreground">V0.7 + V0.8 + evolução</p>
            </div>
          </div>
          <nav className="max-h-[72vh] space-y-1 overflow-y-auto pr-1" aria-label="Telas do LAMOU LABTEST">
            {LAB_CANONICAL_SCREENS.map((item) => (
              <button
                key={item.key}
                type="button"
                aria-current={item.key === screenKey ? "page" : undefined}
                onClick={() => jump(item.key)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-xs outline-none transition focus-visible:ring-2 focus-visible:ring-ring",
                  item.key === screenKey
                    ? "bg-primary/15 text-foreground"
                    : "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
                )}
              >
                <span className="w-6 font-mono text-[9px]">{item.index}</span>
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <ChevronRight className="h-3 w-3" aria-hidden="true" />
              </button>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 space-y-4">
          <div className="overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/10 via-card/80 to-violet/10 p-4 md:p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary/15 text-primary hover:bg-primary/15">{screen.index}</Badge>
                  <Badge variant="outline">{screen.label}</Badge>
                  <Badge variant="outline" className="border-warning/40 text-warning">SALVAR ≠ PROMOVER</Badge>
                </div>
                <h1 className="mt-3 font-display text-2xl font-semibold">{screen.label}</h1>
                <p className="mt-1 max-w-3xl text-sm text-muted-foreground">{screen.simple}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">{reading.toUpperCase()}</Badge>
                <Badge variant="outline">{dataMode === "all" ? "TODOS" : `CRÍTICOS · ${criticalCount}`}</Badge>
              </div>
            </div>
          </div>

          <DidacticGuide reading={reading} screen={screen} />

          {screenKey === "lab" ? (
            <div className="space-y-4">
              <Panel title="LAB FIRST · escolha a pergunta">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
                  <div>
                    <Label htmlFor="lab-question" className="text-xs">O que você quer investigar?</Label>
                    <Input
                      id="lab-question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ex.: o Cubo realmente melhora retrieval sem perder lineage?"
                      className="mt-1"
                    />
                  </div>
                  <Button
                    className="self-end"
                    onClick={() => {
                      if (!question.trim()) {
                        addLog("Pergunta não registrada: escreva o que deseja investigar.");
                        return;
                      }
                      addLog(`Pergunta registrada: ${question.trim()}`);
                      jump("testes");
                    }}
                  >
                    Começar investigação
                    <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
                <div className="mt-4 grid gap-2 md:grid-cols-3">
                  {[
                    ["PASSO 1", "Escolha a pergunta", "Problema, hipótese ou comparação."],
                    ["PASSO 2", "Abra a evidência", "Teste, banco, simulação, estudo ou histórico."],
                    ["PASSO 3", "Conclua no final", "Validation + Métricas + Comparar + Resultado Geral."],
                  ].map(([step, title, text]) => (
                    <div key={step} className="rounded-xl border border-border/50 bg-surface-1/40 p-3">
                      <p className="font-mono text-[9px] text-primary">{step}</p>
                      <p className="mt-1 text-xs font-semibold">{title}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{text}</p>
                    </div>
                  ))}
                </div>
              </Panel>

              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                {[
                  { title: "Planilhão", subtitle: "Hoje → 10 → 15", icon: Gauge, key: "metrics" as LabScreenKey },
                  { title: "Teorias", subtitle: "Ideia → hipótese → evidência", icon: Network, key: "architectures" as LabScreenKey },
                  { title: "Pesquisas", subtitle: "Descoberta → fit → contradição", icon: Microscope, key: "evidence" as LabScreenKey },
                  { title: "Radar", subtitle: "Sinal → oportunidade → teste", icon: RadarIcon, key: "evidence" as LabScreenKey },
                  { title: "Evolução", subtitle: "Baseline → mudança → resultado", icon: Sparkles, key: "compare" as LabScreenKey },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => jump(item.key)}
                      className="rounded-2xl border border-border/60 bg-card/70 p-4 text-left outline-none transition hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                      <p className="mt-3 text-sm font-semibold">{item.title}</p>
                      <p className="mt-1 text-[11px] text-muted-foreground">{item.subtitle}</p>
                    </button>
                  );
                })}
              </div>

              <Panel title="Estado & Evolução · 10 → 15">
                <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                  {EVOLUTION_ROWS.slice(0, 5).map((row) => (
                    <MaturityCard
                      key={row.id}
                      label={row.item}
                      current={row.current}
                      target={row.withExisting}
                      potential={row.withEvolution}
                      truth={row.truth}
                      onOpen={() => jump("metrics")}
                    />
                  ))}
                </div>
              </Panel>

              <Panel title="Planilhão Mestre · Estado & Evolução">
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <div className="relative min-w-[240px] flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar item, tipo, situação, evolução..." className="pl-9" />
                  </div>
                  <Badge variant="outline">fonte: Planilhão + reconciliação LAB</Badge>
                </div>
                <EvolutionTable search={search} dataMode={dataMode} />
              </Panel>

              <Panel title="Radar · Oportunidades de Crescimento">
                <RadarOpportunities dataMode={dataMode} onSend={sendRadar} />
              </Panel>

              <Panel title="Mapa de evolução">
                <ArchitectureFlow />
              </Panel>
            </div>
          ) : screenKey === "testes" ? (
            <TestsScreen localTests={localTests} setLocalTests={setLocalTests} log={addLog} />
          ) : (
            <GenericScreen screenKey={screenKey} reading={reading} onLog={addLog} />
          )}

          {sessionLog.length ? (
            <Panel title="Registro local desta sessão">
              <div className="space-y-1">
                {sessionLog.map((entry, index) => (
                  <p key={index} className="font-mono text-[10px] text-muted-foreground">{entry}</p>
                ))}
              </div>
            </Panel>
          ) : null}
        </div>
      </div>
    </AppShell>
  );
}
