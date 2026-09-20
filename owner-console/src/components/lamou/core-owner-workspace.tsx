import { Link } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Archive,
  Boxes,
  Building2,
  CheckCircle2,
  Clock3,
  Download,
  FileCheck2,
  FileText,
  Filter,
  FlaskConical,
  Gauge,
  GitBranch,
  History,
  Layers3,
  Lightbulb,
  Map as MapIcon,
  Network,
  Package,
  RefreshCcw,
  Search,
  Settings2,
  ShieldCheck,
  Sparkles,
  Users,
  Waypoints,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CoreOwnerModule =
  | "map"
  | "execution"
  | "products"
  | "cases"
  | "radar"
  | "documents"
  | "lifecycle"
  | "governance"
  | "settings";

type Metric = { label: string; value: string; note: string; tone?: "ok" | "warn" | "bad" | "info" };
type Row = { id: string; title: string; subtitle: string; status: string; meta?: string };
type ModuleDefinition = {
  title: string;
  subtitle: string;
  eyebrow: string;
  metrics: Metric[];
  actions: string[];
  rows: Row[];
};

const MODULES: Record<Exclude<CoreOwnerModule, "map">, ModuleDefinition> = {
  execution: {
    eyebrow: "CORE-02",
    title: "Execução & Indicadores",
    subtitle:
      "Saúde, disponibilidade, desempenho, falhas e uso — sempre com origem do dado, baseline e evidência.",
    metrics: [
      { label: "Saúde observada", value: "PARTIAL", note: "Sem score agregado sem metodologia.", tone: "warn" },
      { label: "Integrações monitoradas", value: "12", note: "6 verificadas · 6 NOT_VERIFIED", tone: "info" },
      { label: "Alertas abertos", value: "4", note: "2 críticos · 2 atenção", tone: "bad" },
      { label: "Evidências recentes", value: "28", note: "Últimas 24 h no fixture candidato", tone: "ok" },
    ],
    actions: [
      "Atualizar indicadores",
      "Comparar período",
      "Criar alerta",
      "Abrir incidente",
      "Criar caso",
      "Abrir no LABTEST",
      "Exportar relatório",
    ],
    rows: [
      { id: "EX-01", title: "Supabase / Auth", subtitle: "Sessão e políticas RLS", status: "VERIFIED", meta: "p95 184 ms" },
      { id: "EX-02", title: "Provider IA primário", subtitle: "Slot de provider sem prova runtime", status: "NOT_VERIFIED", meta: "sem amostra" },
      { id: "EX-03", title: "Owner Console", subtitle: "Build candidato", status: "CANDIDATE", meta: "920a3a3 baseline" },
      { id: "EX-04", title: "Distribuição cliente", subtitle: "Fluxo de instalação", status: "ATTENTION", meta: "reteste pendente" },
    ],
  },
  products: {
    eyebrow: "CORE-03",
    title: "Produtos & Aplicativos",
    subtitle:
      "Catálogo técnico: composição, COREs, capabilities, providers, dependências, versões, clientes e evidências.",
    metrics: [
      { label: "Aplicativos catalogados", value: "46", note: "Dados recuperados do baseline", tone: "info" },
      { label: "Produtos", value: "35", note: "Catálogo candidato", tone: "info" },
      { label: "Bindings ativos", value: "10", note: "Vínculos registrados", tone: "ok" },
      { label: "Candidates", value: "36", note: "Nenhuma promoção automática", tone: "warn" },
    ],
    actions: [
      "Novo produto",
      "Novo aplicativo",
      "Editar selecionado",
      "Comparar versões",
      "Enviar ao LABTEST",
      "Criar nova versão",
      "Gerar build",
      "Vincular cliente",
      "Documentar",
    ],
    rows: [
      { id: "APP-001", title: "LAMOU Version", subtitle: "Versionamento, arquivos e builds", status: "CANDIDATE", meta: "CORE + Visual & Media" },
      { id: "APP-002", title: "Showroom", subtitle: "Diagnóstico, proposta e roadmap", status: "CANDIDATE", meta: "cliente-ready: NOT_VERIFIED" },
      { id: "APP-003", title: "Opportunity Intelligence", subtitle: "Radar de oportunidades", status: "CANDIDATE", meta: "integrações parciais" },
      { id: "APP-004", title: "Orbite", subtitle: "Agenda, rotina e reuniões", status: "TEST_ONLY", meta: "LABTEST" },
    ],
  },
  cases: {
    eyebrow: "CORE-04",
    title: "Casos & Soluções",
    subtitle:
      "Memória técnica rastreável: problema → causa → hipótese → solução → teste → evidência → eficácia.",
    metrics: [
      { label: "Casos abertos", value: "7", note: "Fixture operacional candidato", tone: "warn" },
      { label: "Em investigação", value: "3", note: "Sem causa raiz confirmada", tone: "info" },
      { label: "Em reteste", value: "2", note: "Aguardando eficácia", tone: "warn" },
      { label: "Conhecimentos publicados", value: "18", note: "Base pesquisável local", tone: "ok" },
    ],
    actions: [
      "Novo caso",
      "Associar incidente",
      "Investigar",
      "Adicionar hipótese",
      "Registrar causa",
      "Propor solução",
      "Enviar ao LABTEST",
      "Validar solução",
      "Transformar em conhecimento",
    ],
    rows: [
      { id: "CASE-241", title: "Binding sem evidência runtime", subtitle: "Provider marcado sem execução comprovada", status: "INVESTIGANDO", meta: "Impacto: CORE" },
      { id: "CASE-238", title: "Instalação cliente", subtitle: "Fluxo precisa reteste de ponta a ponta", status: "RETESTE", meta: "Impacto: Cliente" },
      { id: "CASE-232", title: "Visual regression 1672×941", subtitle: "Ajuste de shell e densidade", status: "EM_SOLUCAO", meta: "Visual Lock" },
      { id: "CASE-221", title: "RLS tenant", subtitle: "Hardening aplicado", status: "RESOLVIDO", meta: "Evidência registrada" },
    ],
  },
  radar: {
    eyebrow: "CORE-05",
    title: "Radar & Oportunidades",
    subtitle:
      "Evolução técnica e de produto. Não substitui o Comercial: transforma sinais em hipóteses e candidates testáveis.",
    metrics: [
      { label: "Sinais novos", value: "14", note: "Clientes · LABTEST · métricas", tone: "info" },
      { label: "Em validação", value: "5", note: "Hipóteses com critério definido", tone: "warn" },
      { label: "Planejadas", value: "8", note: "Dependências mapeadas", tone: "info" },
      { label: "Medindo eficácia", value: "3", note: "Pós-implementação", tone: "ok" },
    ],
    actions: [
      "Nova oportunidade",
      "Associar caso",
      "Associar cliente",
      "Criar hipótese",
      "Enviar ao LABTEST",
      "Criar projeto",
      "Descartar",
      "Reavaliar",
      "Registrar resultado",
    ],
    rows: [
      { id: "RAD-031", title: "Provider fallback automático", subtitle: "Reduzir indisponibilidade de IA", status: "VALIDANDO", meta: "benefício esperado: resiliência" },
      { id: "RAD-028", title: "Visual & Media CORE", subtitle: "Centralizar gráficos, dashboards e exportação", status: "PLANEJADO", meta: "alto reuso" },
      { id: "RAD-024", title: "Meus Testes", subtitle: "Testes personalizados do Owner", status: "EM_TESTE", meta: "LABTEST" },
      { id: "RAD-019", title: "Recovery guiado", subtitle: "Restore point + evidência", status: "IMPLEMENTADO", meta: "eficácia em medição" },
    ],
  },
  documents: {
    eyebrow: "CORE-06",
    title: "Documentos",
    subtitle:
      "Biblioteca versionada de documentação, decisões, evidências, relatórios, release notes e auditoria.",
    metrics: [
      { label: "Documentos", value: "11", note: "Baseline conectado", tone: "info" },
      { label: "Pendentes de aprovação", value: "3", note: "Fluxo governado", tone: "warn" },
      { label: "Evidências vinculadas", value: "28", note: "Casos, testes e versões", tone: "ok" },
      { label: "Versões documentais", value: "41", note: "Histórico preservado", tone: "info" },
    ],
    actions: [
      "Novo documento",
      "Importar",
      "Editar",
      "Criar nova versão",
      "Comparar",
      "Associar",
      "Enviar para aprovação",
      "Aprovar",
      "Exportar",
      "Arquivar",
    ],
    rows: [
      { id: "DOC-011", title: "Owner Console — Handoff", subtitle: "Baseline técnico e governança", status: "ATUAL", meta: "16/09/2026" },
      { id: "DOC-010", title: "Security Hardening", subtitle: "RLS e isolamento", status: "APROVADO", meta: "evidência técnica" },
      { id: "DOC-009", title: "Prompt Mestre Owner", subtitle: "Finalização controlada", status: "CANDIDATE", meta: "não promovido" },
      { id: "DOC-008", title: "Visual Lock", subtitle: "Referência 1672×941", status: "REFERENCIA", meta: "desktop" },
    ],
  },
  lifecycle: {
    eyebrow: "CORE-07",
    title: "Versões, Distribuição & Recuperação",
    subtitle:
      "SALVAR ≠ PROMOVER. Candidate → LABTEST → Validation Gate → Freeze → Build → Distribuição → Monitoramento.",
    metrics: [
      { label: "Baseline atual", value: "920a3a3", note: "Owner Console candidata", tone: "info" },
      { label: "Candidates", value: "36", note: "Promoção bloqueada por padrão", tone: "warn" },
      { label: "Builds verificáveis", value: "1+", note: "Evidência depende do pipeline", tone: "info" },
      { label: "Recovery points", value: "3", note: "Fixture desta superfície", tone: "ok" },
    ],
    actions: [
      "Nova versão",
      "Criar candidate",
      "Comparar",
      "Congelar",
      "Solicitar desbloqueio",
      "Enviar ao LABTEST",
      "Gerar build",
      "Verificar build",
      "Distribuir",
      "Baixar pacote",
      "Rollback",
      "Restaurar",
      "Ver histórico",
    ],
    rows: [
      { id: "VER-920a3a3", title: "Owner Console 920a3a3", subtitle: "Pacote Node executável", status: "CANDIDATE", meta: "17/09/2026" },
      { id: "VER-8f249aa", title: "Candidata completa 8f249aa", subtitle: "Hardening + testes", status: "PRESERVADA", meta: "16/09/2026" },
      { id: "VER-FROZEN", title: "Baseline FROZEN", subtitle: "Imutável · derivar somente", status: "FROZEN", meta: "não sobrescrever" },
      { id: "REC-003", title: "Restore point seguro", subtitle: "Snapshot pré-alteração", status: "AVAILABLE", meta: "rollback manual" },
    ],
  },
  governance: {
    eyebrow: "CORE-08",
    title: "Governança",
    subtitle:
      "Identidade, RBAC, Authorization Gate, segurança, políticas e trilha de auditoria — sem autoautorização.",
    metrics: [
      { label: "Usuários Owner", value: "2", note: "Baseline recuperado", tone: "info" },
      { label: "RLS", value: "50/50", note: "Hardening previamente verificado", tone: "ok" },
      { label: "MFA Owner", value: "PENDENTE", note: "Gate de produção ainda aberto", tone: "warn" },
      { label: "Eventos auditáveis", value: "100%", note: "Meta arquitetural desta superfície", tone: "info" },
    ],
    actions: [
      "Novo usuário",
      "Novo papel",
      "Autorizar",
      "Revogar",
      "Criar política",
      "Editar política",
      "Solicitar aprovação",
      "Aprovar",
      "Reprovar",
      "Ver auditoria",
      "Exportar evidências",
    ],
    rows: [
      { id: "GOV-01", title: "Owner", subtitle: "Administração do CORE Proprietário", status: "OWNER", meta: "escopo global" },
      { id: "GOV-02", title: "Authorization Gate", subtitle: "Titular do contrato como autoridade primária", status: "ENFORCED_DESIGN", meta: "delegação explícita" },
      { id: "GOV-03", title: "Tenant isolation", subtitle: "Cliente não acessa Owner", status: "VERIFIED", meta: "hardening Supabase" },
      { id: "GOV-04", title: "MFA proprietário", subtitle: "Proteção adicional de conta", status: "PENDENTE", meta: "bloqueia promoção" },
    ],
  },
  settings: {
    eyebrow: "CORE-09",
    title: "Configurações",
    subtitle:
      "Organização, ambientes, providers, integrações, Visual & Media CORE, acessibilidade, notificações e dados.",
    metrics: [
      { label: "Ambientes", value: "4", note: "REAL · TESTE · DEMO · DEV", tone: "info" },
      { label: "Providers catalogados", value: "34", note: "Conectado ≠ catalogado", tone: "info" },
      { label: "Tema", value: "DARK/LIGHT", note: "Shell preservado", tone: "ok" },
      { label: "Visual Lock", value: "1672×941", note: "Referência desktop", tone: "ok" },
    ],
    actions: [
      "Editar",
      "Salvar",
      "Testar conexão",
      "Adicionar provider",
      "Adicionar integração",
      "Ativar",
      "Desativar",
      "Restaurar padrão",
      "Ver histórico",
    ],
    rows: [
      { id: "SET-01", title: "Organização", subtitle: "Marca, identidade, domínios e contatos", status: "CONFIGURADO", meta: "Owner" },
      { id: "SET-02", title: "Providers", subtitle: "Slots, fallback, limites e credenciais", status: "PARTIAL", meta: "runtime variável" },
      { id: "SET-03", title: "Visual & Media CORE", subtitle: "Gráficos, tabelas, motion e exportação", status: "CANDIDATE", meta: "camada comum" },
      { id: "SET-04", title: "Acessibilidade", subtitle: "Contraste, fonte, teclado e redução de movimento", status: "IMPLEMENTED", meta: "QA contínuo" },
    ],
  },
};

const MAP_NODES = [
  { id: "client", label: "Cliente", x: 10, y: 48, status: "ok", icon: Building2 },
  { id: "product", label: "Produto", x: 24, y: 25, status: "ok", icon: Package },
  { id: "app", label: "Aplicativo", x: 39, y: 52, status: "warn", icon: Boxes },
  { id: "core", label: "CORE", x: 54, y: 27, status: "ok", icon: Layers3 },
  { id: "capability", label: "Capability", x: 67, y: 53, status: "ok", icon: Sparkles },
  { id: "provider", label: "Provider", x: 80, y: 26, status: "bad", icon: Network },
  { id: "runtime", label: "Ambiente", x: 91, y: 53, status: "warn", icon: Gauge },
];

const MAP_CONNECTIONS: ReadonlyArray<readonly [string, string]> = [
  ["Cliente", "Produto"],
  ["Produto", "Aplicativo"],
  ["Aplicativo", "CORE"],
  ["CORE", "Capability"],
  ["Capability", "Provider"],
  ["Provider", "Ambiente"],
];

function statusClass(status: string) {
  if (/VERIFIED|APROVADO|RESOLVIDO|AVAILABLE|CONFIGURADO|IMPLEMENTED|OWNER|FROZEN|PRESERVADA|REFERENCIA|ATUAL/i.test(status)) {
    return "border-success/35 bg-success/10 text-success";
  }
  if (/CRIT|FAIL|BAD|REPROV/i.test(status)) {
    return "border-destructive/35 bg-destructive/10 text-destructive";
  }
  if (/PEND|ATTENTION|RETESTE|PARTIAL|CANDIDATE|TEST|INVESTIGANDO|VALIDANDO|PLANEJADO|EM_/i.test(status)) {
    return "border-warning/35 bg-warning/10 text-warning";
  }
  return "border-primary/35 bg-primary/10 text-primary";
}

function downloadSnapshot(module: string, rows: Row[]) {
  const blob = new Blob(
    [JSON.stringify({ module, exportedAt: new Date().toISOString(), truth: "CANDIDATE_NOT_PROMOTED", rows }, null, 2)],
    { type: "application/json" },
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lamou-core-${module}-snapshot.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function MetricGrid({ metrics }: { metrics: Metric[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <div key={metric.label} className="rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{metric.label}</p>
          <p className="mt-2 font-display text-2xl font-semibold">{metric.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{metric.note}</p>
        </div>
      ))}
    </div>
  );
}

function ActionBar({
  actions,
  onAction,
}: {
  actions: string[];
  onAction: (action: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <Button
          key={action}
          type="button"
          size="sm"
          variant={index === 0 ? "default" : "outline"}
          onClick={() => onAction(action)}
        >
          {action}
        </Button>
      ))}
    </div>
  );
}

function RegistryTable({
  rows,
  selected,
  onSelect,
}: {
  rows: Row[];
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card/55">
      <div className="hidden grid-cols-[110px_minmax(0,1.4fr)_minmax(0,1fr)_140px] gap-3 border-b border-border/60 bg-surface-2/60 px-4 py-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground md:grid">
        <span>ID</span><span>Objeto</span><span>Contexto</span><span>Status</span>
      </div>
      <div className="divide-y divide-border/50">
        {rows.map((row) => (
          <button
            type="button"
            key={row.id}
            onClick={() => onSelect(row.id)}
            className={cn(
              "grid w-full gap-2 px-4 py-3 text-left outline-none transition-colors hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-ring md:grid-cols-[110px_minmax(0,1.4fr)_minmax(0,1fr)_140px] md:items-center",
              selected === row.id && "bg-primary/10",
            )}
          >
            <span className="font-mono text-[11px] text-primary">{row.id}</span>
            <span>
              <span className="block text-sm font-medium">{row.title}</span>
              <span className="block text-xs text-muted-foreground md:hidden">{row.subtitle}</span>
            </span>
            <span className="hidden text-xs text-muted-foreground md:block">{row.subtitle}{row.meta ? ` · ${row.meta}` : ""}</span>
            <Badge variant="outline" className={cn("w-fit font-mono text-[9px]", statusClass(row.status))}>
              {row.status}
            </Badge>
          </button>
        ))}
      </div>
    </div>
  );
}

function DetailPanel({ row, onClose }: { row: Row | undefined; onClose: () => void }) {
  if (!row) return null;
  return (
    <Panel title="Detalhe contextual">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] text-primary">{row.id}</p>
          <h3 className="mt-1 font-display text-lg font-semibold">{row.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{row.subtitle}</p>
        </div>
        <Button type="button" size="sm" variant="ghost" onClick={onClose}>Fechar</Button>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {[
          ["Status", row.status],
          ["Contexto", row.meta ?? "Sem metadado adicional"],
          ["Ambiente", "CANDIDATE / DEMO quando marcado"],
          ["Rastreabilidade", "ID · status · histórico · evidências"],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-border/50 bg-surface-1/50 p-3">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="mt-1 text-xs">{value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function MapaVivoCore() {
  const [mode, setMode] = useState<"ecossistema" | "problemas" | "alteracoes">("ecossistema");
  const [selected, setSelected] = useState("provider");
  const [updatedAt, setUpdatedAt] = useState(() => new Date());
  const [query, setQuery] = useState("");

  const visibleNodes = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MAP_NODES.filter((node) => {
      if (mode === "problemas" && node.status === "ok") return false;
      return !q || node.label.toLowerCase().includes(q);
    });
  }, [mode, query]);

  const selectedNode = MAP_NODES.find((node) => node.id === selected);

  return (
    <AppShell group="core">
      <PageHeader
        title="Mapa Vivo"
        subtitle="Centro visual do CORE Proprietário: Cliente → Produto → Aplicativo → CORE → Capability → Provider → Ambiente. O mapa detecta; os módulos técnicos investigam e resolvem."
        right={<div className="flex gap-2"><TruthBadge truth="PARTIAL" /><DemoBadge label="candidate · dados de demonstração estruturados" /></div>}
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Clientes", "1", Users],
          ["Produtos", "35", Package],
          ["Aplicativos", "46", Boxes],
          ["Alertas", "4", AlertTriangle],
        ].map(([label, value, Icon]) => {
          const I = Icon as typeof Users;
          return (
            <div key={String(label)} className="rounded-2xl border border-border/60 bg-card/70 p-4">
              <div className="flex items-center gap-2 text-muted-foreground"><I className="h-4 w-4" /><span className="text-xs">{String(label)}</span></div>
              <p className="mt-2 font-display text-3xl font-semibold">{String(value)}</p>
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border/60 bg-card/60 p-3">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-border/60 bg-background/70 px-3">
          <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cliente, produto, app, CORE ou provider..."
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        {(["ecossistema", "problemas", "alteracoes"] as const).map((item) => (
          <Button key={item} size="sm" variant={mode === item ? "default" : "outline"} onClick={() => setMode(item)}>
            {item === "ecossistema" ? "Ecossistema" : item === "problemas" ? "Somente problemas" : "Alterações"}
          </Button>
        ))}
        <Button size="sm" variant="outline" onClick={() => setUpdatedAt(new Date())}>
          <RefreshCcw className="mr-2 h-3.5 w-3.5" /> Atualizar mapa
        </Button>
        <Button size="sm" variant="outline" onClick={() => downloadSnapshot("mapa-vivo", MAP_NODES.map((n) => ({id:n.id,title:n.label,subtitle:"Nó do Mapa Vivo",status:n.status})))}>
          <Download className="mr-2 h-3.5 w-3.5" /> Exportar
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="relative min-h-[520px] overflow-hidden rounded-3xl border border-border/60 bg-surface-1/65 p-4">
          <div className="absolute inset-0 opacity-35" aria-hidden="true" style={{
            backgroundImage: "linear-gradient(oklch(0.74 0.15 218 / .08) 1px, transparent 1px),linear-gradient(90deg,oklch(0.74 0.15 218 / .08) 1px,transparent 1px)",
            backgroundSize: "34px 34px",
          }} />
          <div className="relative mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold">Ecossistema técnico</p>
              <p className="text-[11px] text-muted-foreground">Atualizado {updatedAt.toLocaleTimeString("pt-BR")}</p>
            </div>
            <Badge variant="outline" className="font-mono text-[9px]">REAL · TESTE · DEMO separados</Badge>
          </div>

          <div className="relative h-[420px]">
            <div className="absolute left-[8%] right-[6%] top-1/2 h-px bg-gradient-to-r from-primary/20 via-primary/70 to-warning/40" aria-hidden="true" />
            {visibleNodes.map((node) => {
              const Icon = node.icon;
              return (
                <button
                  type="button"
                  key={node.id}
                  onClick={() => setSelected(node.id)}
                  className={cn(
                    "absolute -translate-x-1/2 -translate-y-1/2 rounded-2xl border bg-card/95 p-3 text-left shadow-lg outline-none transition-all hover:-translate-y-[54%] focus-visible:ring-2 focus-visible:ring-ring",
                    selected === node.id ? "border-primary shadow-[0_0_0_4px_oklch(0.74_0.15_218/.12)]" : "border-border/70",
                  )}
                  style={{ left: `${node.x}%`, top: `${node.y}%` }}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-xl",
                      node.status === "ok" ? "bg-success/12 text-success" : node.status === "bad" ? "bg-destructive/12 text-destructive" : "bg-warning/12 text-warning",
                    )}>
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>
                      <span className="block text-[10px] text-muted-foreground">{node.id.toUpperCase()}</span>
                      <span className="block text-xs font-semibold">{node.label}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <Panel title="Objeto selecionado">
            {selectedNode ? (
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold">{selectedNode.label}</h3>
                  <Badge variant="outline" className={cn("font-mono text-[9px]", statusClass(selectedNode.status))}>{selectedNode.status.toUpperCase()}</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Página contextual com status, versão, dependências, uso, clientes afetados, métricas, alertas, evidências e histórico.
                </p>
                <div className="mt-4 grid gap-2">
                  <Button type="button" size="sm" onClick={() => setMode("problemas")}>Ver impacto</Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => downloadSnapshot(selectedNode.id, [{id:selectedNode.id,title:selectedNode.label,subtitle:"Dependências do nó",status:selectedNode.status}])}>Exportar objeto</Button>
                  <Button asChild size="sm" variant="outline"><Link to="/core/cases">Criar caso / investigar</Link></Button>
                </div>
              </div>
            ) : <p className="text-sm text-muted-foreground">Selecione um nó.</p>}
          </Panel>

          <Panel title="Relações">
            <ul className="space-y-2 text-xs">
              {MAP_CONNECTIONS.map(([from, to]) => (
                <li key={from + to} className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface-1/50 px-3 py-2">
                  <Waypoints className="h-3.5 w-3.5 text-primary" />
                  <span>{from}</span><span className="text-muted-foreground">→</span><span>{to}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}

function StandardModule({ module }: { module: Exclude<CoreOwnerModule, "map"> }) {
  const definition = MODULES[module];
  const [selected, setSelected] = useState<string | null>(definition.rows[0]?.id ?? null);
  const [lastAction, setLastAction] = useState("Nenhuma ação executada nesta sessão.");
  const [criticalOnly, setCriticalOnly] = useState(false);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return definition.rows.filter((row) => {
      const matchesSearch = !q || [row.id, row.title, row.subtitle, row.status, row.meta ?? ""].join(" ").toLowerCase().includes(q);
      const matchesCritical = !criticalOnly || /PEND|ATTENTION|RETESTE|PARTIAL|NOT_VERIFIED|INVESTIGANDO|VALIDANDO/i.test(row.status);
      return matchesSearch && matchesCritical;
    });
  }, [criticalOnly, definition.rows, query]);

  const selectedRow = definition.rows.find((row) => row.id === selected);

  const onAction = (action: string) => {
    if (/exportar|baixar/i.test(action)) {
      downloadSnapshot(module, rows);
      setLastAction(`${action}: snapshot JSON gerado localmente. Nenhuma promoção/deploy executado.`);
      return;
    }
    if (/atualizar/i.test(action)) {
      setLastAction(`${action}: visão recalculada às ${new Date().toLocaleTimeString("pt-BR")}.`);
      return;
    }
    setLastAction(`${action}: fluxo candidato acionado. Alteração permanece local/DEMO até backend e gate autorizarem persistência real.`);
  };

  return (
    <AppShell group="core">
      <PageHeader
        title={definition.title}
        subtitle={definition.subtitle}
        right={<div className="flex flex-wrap gap-2"><TruthBadge truth="PARTIAL" /><DemoBadge label="CANDIDATE_NOT_PROMOTED" /></div>}
      />

      <MetricGrid metrics={definition.metrics} />

      <Panel title="Ações do módulo">
        <ActionBar actions={definition.actions} onAction={onAction} />
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground" role="status" aria-live="polite">
          <Activity className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>{lastAction}</span>
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Pesquisar nesta área..."
            className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <Button type="button" size="sm" variant={criticalOnly ? "default" : "outline"} onClick={() => setCriticalOnly((value) => !value)}>
          <Filter className="mr-2 h-3.5 w-3.5" /> Dados críticos
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => { setCriticalOnly(false); setQuery(""); }}>
          Todos os dados
        </Button>
      </div>

      <RegistryTable rows={rows} selected={selected} onSelect={setSelected} />
      <DetailPanel row={selectedRow} onClose={() => setSelected(null)} />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Rastreabilidade obrigatória">
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              [History, "Histórico", "Antes/depois, autor e justificativa"],
              [FileCheck2, "Evidências", "Teste, arquivo, log e resultado"],
              [GitBranch, "Versão", "Estado e origem da alteração"],
              [ShieldCheck, "Permissão", "RBAC + Authorization Gate"],
            ].map(([Icon, title, note]) => {
              const I = Icon as typeof History;
              return (
                <div key={String(title)} className="rounded-xl border border-border/50 bg-surface-1/50 p-3">
                  <I className="h-4 w-4 text-primary" />
                  <p className="mt-2 text-xs font-semibold">{String(title)}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{String(note)}</p>
                </div>
              );
            })}
          </div>
        </Panel>

        <Panel title="Integração do fluxo">
          <ol className="space-y-2 text-xs text-muted-foreground">
            {[
              "Mapa Vivo detecta e contextualiza.",
              "Execução confirma sinal e impacto.",
              "Casos investiga causa e solução.",
              "Radar transforma aprendizado em hipótese.",
              "Produto recebe alteração versionada.",
              "LABTEST + Validation Gate validam.",
              "Lifecycle distribui apenas após aprovação.",
            ].map((item, index) => (
              <li key={item} className="flex gap-2 rounded-lg border border-border/50 bg-surface-1/50 px-3 py-2">
                <span className="font-mono text-primary">{String(index + 1).padStart(2, "0")}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      {module === "governance" ? (
        <Panel title="Superfícies técnicas preservadas">
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link to="/core/architecture">Arquitetura Técnica</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/core/security">Segurança & Tenants</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/core/calls">CALLs & Contratos</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/core/data">Dados & Fontes</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/core/ai">IA, Prompts & Agentes</Link></Button>
          </div>
        </Panel>
      ) : null}

      {module === "settings" ? (
        <Panel title="Configurações técnicas relacionadas">
          <div className="flex flex-wrap gap-2">
            <Button asChild size="sm" variant="outline"><Link to="/core/apps">Bindings existentes</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/core/observability">Observabilidade existente</Link></Button>
            <Button asChild size="sm" variant="outline"><Link to="/labtest">Abrir LABTEST</Link></Button>
          </div>
        </Panel>
      ) : null}
    </AppShell>
  );
}

export function CoreOwnerWorkspace({ module }: { module: CoreOwnerModule }) {
  if (module === "map") return <MapaVivoCore />;
  return <StandardModule module={module} />;
}
