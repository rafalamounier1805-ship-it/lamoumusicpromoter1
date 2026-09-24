import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Check, FileText, Lock, Search, ShieldCheck, Upload } from "lucide-react";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
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
import { DOC_STRUCTURE } from "@/lib/lamou/registry";

const STAGES = ["Rascunho", "Candidata", "Revisão / Validação", "Homologado", "Publicado"] as const;
type Stage = (typeof STAGES)[number];

interface DocItem {
  id: string;
  title: string;
  type: string;
  version: string;
  stage: Stage;
  owner: string;
  source: string;
  freshness: string;
  modules: string[];
  evidences: number;
  truth: string;
  blocker: string | null;
}

const DOCS: DocItem[] = [
  {
    id: "DOC-0001",
    title: "Build Pack V1 — visão de produto do Owner Console",
    type: "Produto",
    version: "v1.0-candidata",
    stage: "Candidata",
    owner: "Proprietário",
    source: "Especificação interna (fixture local)",
    freshness: "atualizado nesta candidata",
    modules: ["Central", "CORE"],
    evidences: 0,
    truth: "DOCUMENTED_ONLY",
    blocker: "Sem validação registrada no Validation Gate",
  },
  {
    id: "DOC-0002",
    title: "Arquitetura do CORE — capabilities, CALLs e bindings",
    type: "Arquitetura",
    version: "v0.9-candidata",
    stage: "Revisão / Validação",
    owner: "Proprietário",
    source: "CALL Registry + Apps & Bindings",
    freshness: "derivado dos registries em código",
    modules: ["CORE", "Apps"],
    evidences: 0,
    truth: "DOCUMENTED_ONLY",
    blocker: "Nenhuma CALL com teste executado",
  },
  {
    id: "DOC-0003",
    title: "Contratos de integração e escopos permitidos",
    type: "Contrato",
    version: "v0.6-rascunho",
    stage: "Rascunho",
    owner: "Proprietário",
    source: "Registro de integrações (fixture local)",
    freshness: "sem revisão registrada",
    modules: ["Integrações", "CORE"],
    evidences: 0,
    truth: "NOT_VERIFIED",
    blocker: "Documento incompleto",
  },
  {
    id: "DOC-0004",
    title: "Política de segurança, acesso e isolamento por tenant",
    type: "Política",
    version: "v0.8-candidata",
    stage: "Candidata",
    owner: "Proprietário",
    source: "Instalação do Proprietário — etapa de segurança",
    freshness: "alinhado à candidata atual",
    modules: ["Segurança", "CORE", "Clientes"],
    evidences: 0,
    truth: "DOCUMENTED_ONLY",
    blocker: "Texto jurídico final não validado",
  },
  {
    id: "DOC-0005",
    title: "Política de retenção, backup e restauração",
    type: "Política",
    version: "v0.5-rascunho",
    stage: "Rascunho",
    owner: "Proprietário",
    source: "Requisito declarado na instalação",
    freshness: "sem revisão registrada",
    modules: ["Segurança", "Dados"],
    evidences: 0,
    truth: "NOT_VERIFIED",
    blocker: "Backup e restauração não testados",
  },
  {
    id: "DOC-0006",
    title: "Política de uso de IA, dados e limites de autonomia",
    type: "Política",
    version: "v0.7-candidata",
    stage: "Revisão / Validação",
    owner: "Proprietário",
    source: "Instalação do Proprietário — consentimentos e APIs",
    freshness: "alinhado à candidata atual",
    modules: ["IA", "CORE", "Documentos"],
    evidences: 0,
    truth: "DOCUMENTED_ONLY",
    blocker: "Provider de IA não conectado",
  },
  {
    id: "DOC-0007",
    title: "Matriz de testes, Validation Gate e evidências",
    type: "Qualidade",
    version: "v0.9-candidata",
    stage: "Revisão / Validação",
    owner: "Proprietário",
    source: "Teste³ / Validation Gate (fixtures)",
    freshness: "sem execução real de runner",
    modules: ["Testes", "CORE"],
    evidences: 0,
    truth: "NOT_VERIFIED",
    blocker: "Runner de teste não conectado",
  },
  {
    id: "DOC-0008",
    title: "Documentação viva — estrutura de pastas canônica",
    type: "Referência",
    version: `v1.0 · ${DOC_STRUCTURE.length} pastas`,
    stage: "Candidata",
    owner: "Proprietário",
    source: "Estrutura declarada no Build Pack",
    freshness: "repositório não lido neste build",
    modules: ["Documentos"],
    evidences: 0,
    truth: "DOCUMENTED_ONLY",
    blocker: "Repositório canônico não sincronizado",
  },
];

const STAGE_TONE: Record<Stage, string> = {
  Rascunho: "border-muted-foreground/40 text-muted-foreground",
  Candidata: "border-warning/40 text-warning",
  "Revisão / Validação": "border-primary/40 text-primary",
  Homologado: "border-success/40 text-success",
  Publicado: "border-success/60 text-success",
};

function Lifecycle({ current }: { current: Stage }) {
  const idx = STAGES.indexOf(current);
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <ol className="flex min-w-max items-center gap-1.5">
        {STAGES.map((s, i) => (
          <li key={s} className="flex items-center gap-1.5">
            <span
              className={`flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] ${
                i <= idx ? STAGE_TONE[s] : "border-border/60 text-muted-foreground/60"
              }`}
            >
              {i < idx ? <Check className="h-3 w-3" aria-hidden="true" /> : null}
              {s}
            </span>
            {i < STAGES.length - 1 ? (
              <span className="h-px w-4 bg-border" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function DocumentsPage() {
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(DOCS[0]?.id ?? null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return DOCS;
    return DOCS.filter((d) => [d.id, d.title, d.type, d.stage].join(" ").toLowerCase().includes(q));
  }, [query]);

  const open = DOCS.find((d) => d.id === openId) ?? null;
  const canPublish = open ? open.stage === "Homologado" && open.evidences > 0 : false;

  return (
    <AppShell group="owner">
      <PageHeader
        title="Documentos & Documentação Viva"
        subtitle="Catálogo documental do ecossistema: DOC-ID, tipo, versão, estado, responsável, fonte, freshness, módulos relacionados, evidências e publicação. SALVAR ≠ PROMOVER."
        right={
          <>
            <DemoBadge label="SYNTHETIC_DEMO" />
            <TruthBadge truth="DOCUMENTED_ONLY" hint="Repositório canônico não lido neste build" />
          </>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Documentos catalogados", value: String(DOCS.length), truth: "FACT/EVIDENCED" },
          {
            label: "Em revisão / validação",
            value: String(DOCS.filter((d) => d.stage === "Revisão / Validação").length),
            truth: "PARTIAL",
          },
          { label: "Homologados", value: "0", truth: "NOT_VERIFIED" },
          { label: "Publicados", value: "0", truth: "NOT_VERIFIED" },
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
          title={`Catálogo (${filtered.length})`}
          action={
            <div className="relative w-44">
              <Search
                className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Filtrar documento"
                aria-label="Filtrar documentos"
                className="h-8 pl-8 text-xs"
              />
            </div>
          }
        >
          <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[100px]">DOC-ID</TableHead>
                  <TableHead className="min-w-[240px]">Título / tipo</TableHead>
                  <TableHead className="min-w-[120px]">Versão</TableHead>
                  <TableHead className="min-w-[150px]">Estado</TableHead>
                  <TableHead className="min-w-[140px]">Estado de verdade</TableHead>
                  <TableHead className="min-w-[90px]">Detalhe</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((d) => (
                  <TableRow key={d.id} data-state={d.id === openId ? "selected" : undefined}>
                    <TableCell className="font-mono text-[11px]">{d.id}</TableCell>
                    <TableCell className="text-xs">
                      <span className="font-medium">{d.title}</span>
                      <span className="block text-muted-foreground">{d.type}</span>
                    </TableCell>
                    <TableCell className="font-mono text-[11px]">{d.version}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-[10px] ${STAGE_TONE[d.stage]}`}>
                        {d.stage}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <TruthBadge truth={d.truth} />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs"
                        onClick={() => setOpenId(d.id)}
                        aria-label={`Abrir ${d.id}`}
                      >
                        Abrir
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Panel>

        <aside className="min-w-0 space-y-4">
          {open ? (
            <Panel
              title={`${open.id} · ${open.type}`}
              action={<TruthBadge truth={open.truth} />}
              className="xl:sticky xl:top-4"
            >
              <div className="space-y-3">
                <p className="text-sm font-medium">{open.title}</p>
                <Lifecycle current={open.stage} />

                <dl className="grid gap-2 sm:grid-cols-2">
                  {[
                    { label: "Versão", value: open.version },
                    { label: "Responsável", value: open.owner },
                    { label: "Fonte", value: open.source },
                    { label: "Freshness", value: open.freshness },
                    { label: "Módulos relacionados", value: open.modules.join(", ") },
                    { label: "Evidências anexadas", value: String(open.evidences) },
                  ].map((r) => (
                    <div
                      key={r.label}
                      className="rounded-lg border border-border/60 bg-surface-1/40 p-2.5"
                    >
                      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">
                        {r.label}
                      </dt>
                      <dd className="mt-1 break-words text-xs">{r.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="h-7 text-xs" disabled>
                    <FileText className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Abrir documento
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" disabled>
                    Editar candidata
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" disabled>
                    Ver fontes
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 text-xs" disabled>
                    Ver impacto
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
                    <Link to="/apps/validation-gate">
                      <ShieldCheck className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                      Validar no gate
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    disabled={!canPublish}
                    aria-disabled={!canPublish}
                  >
                    <Upload className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                    Exportar / Publicar
                  </Button>
                </div>

                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Lock className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
                    Publicação bloqueada
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {open.blocker ?? "Sem evidência de homologação registrada."} Enquanto o gate não
                    for satisfeito, o documento permanece candidato.
                  </p>
                </div>

                <div className="rounded-lg border border-border/60 bg-surface-1/40 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Brain className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    IA no documento
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Touchpoint governado: a IA só pode sugerir revisão de trecho com fonte citada e
                    registro no histórico do documento. Provider de IA permanece NOT_CONNECTED,
                    então nenhuma sugestão é gerada.
                  </p>
                  <Button asChild size="sm" variant="ghost" className="mt-2 h-7 text-xs">
                    <Link to="/core/ai">Configurar IA no CORE</Link>
                  </Button>
                </div>
              </div>
            </Panel>
          ) : (
            <Panel title="Documento">
              <p className="text-sm text-muted-foreground">Selecione um documento no catálogo.</p>
            </Panel>
          )}
        </aside>
      </div>

      <Panel title="Estrutura documental canônica (referência)">
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {DOC_STRUCTURE.map((f) => (
            <div key={f.folder} className="rounded-lg border border-border/60 bg-surface-1/40 p-3">
              <p className="font-mono text-[11px] text-primary">{f.folder}</p>
              <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {f.files.map((file) => (
                  <li key={file}>{file}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Repositório canônico e Drive permanecem NOT_CONNECTED: nada aqui foi lido de fora.
        </p>
      </Panel>
    </AppShell>
  );
}

export const Route = createFileRoute("/owner/documents")({
  head: () => ({
    meta: [
      { title: "Documentos & Publicação — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Catálogo documental com DOC-ID, versão, estado, fonte, evidências e ciclo Rascunho → Candidata → Validação → Homologado → Publicado.",
      },
      { property: "og:title", content: "Documentos & Publicação — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Documentação viva do LAMOU com gate de publicação, proveniência e IA governada no documento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DocumentsPage,
});
