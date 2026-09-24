import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  FlaskConical,
  GitCompare,
  ImageOff,
  Moon,
  ShieldCheck,
  ShieldQuestion,
  Sun,
  Target,
} from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
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
import { LAB_AREA_LABEL, LAB_CONCEPTS, type LabConcept } from "@/lib/lamou/lab-data";

/** Linha evolutiva do Visual Lock "Próximas camadas de evolução".
 *  SOL é referência; tudo depois é experimento não validado. */
const EVOLUTION: {
  key: string;
  name: string;
  conceptId: string | null;
  truth: string;
  role: string;
}[] = [
  {
    key: "sol",
    name: "CORE Padrão / SOL",
    conceptId: null,
    truth: "PARTIAL",
    role: "REFERÊNCIA CORRENTE",
  },
  {
    key: "cubo",
    name: "CORE Cubo / LUA",
    conceptId: "LAB-CUBO",
    truth: "HYPOTHESIS",
    role: "EXPERIMENTAL",
  },
  { key: "magico", name: "Cubo Mágico", conceptId: null, truth: "NOT_VERIFIED", role: "PROPOSTA" },
  {
    key: "prisma",
    name: "Prisma",
    conceptId: "LAB-PRISMA",
    truth: "HYPOTHESIS",
    role: "EXPERIMENTAL",
  },
  {
    key: "fantasma",
    name: "Cubo Fantasma",
    conceptId: "LAB-FANTASMA",
    truth: "HYPOTHESIS",
    role: "EXPERIMENTAL",
  },
  {
    key: "caleidoscopio",
    name: "Caleidoscópio",
    conceptId: "LAB-CALEIDOSCOPIO",
    truth: "HYPOTHESIS",
    role: "EXPERIMENTAL",
  },
];

/** Capacidades laterais: não entram na linha evolutiva. */
const LATERAL = [
  { name: "Snapshot / Fotografia lógica", conceptId: "LAB-SNAPSHOT" },
  { name: "Cubo da Relação", conceptId: "LAB-RELACAO" },
];

const CRITERIA = [
  "Qualidade",
  "Custo",
  "Latência",
  "Segurança",
  "Cobertura de dados",
  "Valor / impacto",
  "Eficácia comprovada",
];

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border/60 bg-surface-1/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

function ConceptDetail({ c }: { c: LabConcept }) {
  return (
    <div className="space-y-3 text-xs">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-[10px]">
          {c.id}
        </Badge>
        <span className="min-w-0 flex-1 font-display text-sm font-semibold">{c.name}</span>
        <Badge variant="outline" className="border-violet/50 text-[10px] text-violet">
          LUA · NÃO VALIDADO
        </Badge>
        <TruthBadge truth={c.truth} />
      </div>

      <p className="text-muted-foreground">
        <span className="font-medium text-foreground/80">Pergunta / hipótese: </span>
        {c.lamouHypothesis}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground/80">Objetivo / mecanismo: </span>
        {c.mechanism}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground/80">Origem / fonte: </span>
        {c.existingScience.join(" · ")}
      </p>
      <p className="text-muted-foreground">
        <span className="font-medium text-foreground/80">Evidências LAMOU: </span>
        nenhuma anexada (NOT_VERIFIED)
      </p>

      <div>
        <p className="flex items-center gap-1.5 font-medium">
          <GitCompare className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Comparação com SOL
        </p>
        <p className="mt-1 text-muted-foreground">
          SOL permanece a referência corrente. {c.name} é divergência intencional isolada em LUA:
          não altera SOL e não é promovido por aparecer nesta tela.
        </p>
      </div>

      <div>
        <p className="flex items-center gap-1.5 font-medium">
          <ShieldQuestion className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
          Testes / experimentos ligados
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">
          {c.requiredTests.map((t) => (
            <li key={t}>{t} — não executado</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="flex items-center gap-1.5 font-medium">
          <AlertTriangle className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
          Riscos
        </p>
        <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">
          {c.risks.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </div>

      <div>
        <p className="flex items-center gap-1.5 font-medium">
          <Target className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Gate pendente / próximo passo
        </p>
        <p className="mt-1 text-muted-foreground">
          Executar “{c.requiredTests[0] ?? "primeiro teste previsto"}” no Teste³ e registrar
          evidência no Validation Gate. Sem evidência, o estado não muda.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {c.applications.map((a) => (
          <Chip key={a.area + a.use}>{LAB_AREA_LABEL[a.area]}</Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled>
          Abrir experimento
        </Button>
        <span className="font-mono text-[10px] text-muted-foreground">
          rota de execução não existe
        </span>
      </div>

      <p className="text-muted-foreground">{c.matrixNote}</p>
    </div>
  );
}

function LabCorePage() {
  const [selected, setSelected] = useState<string>(EVOLUTION[1]?.key ?? "cubo");
  const active = EVOLUTION.find((e) => e.key === selected) ?? null;
  const concept = active?.conceptId
    ? (LAB_CONCEPTS.find((c) => c.id === active.conceptId) ?? null)
    : null;

  return (
    <AppShell group="core">
      <PageHeader
        title="LAB · Teorias & Experimentos"
        subtitle="Camada de experimentos do CORE. SOL é a referência corrente; Cubo e variantes são estados de teste não validados. Aparecer aqui não promove nada."
        right={
          <>
            <TruthBadge truth="HYPOTHESIS" hint="Experimentos sem validação registrada" />
            <Button asChild size="sm" variant="ghost">
              <Link to="/core/sol-lua">SOL / LUA / LAB</Link>
            </Button>
          </>
        }
      />

      <Panel title="Linha evolutiva das próximas camadas">
        <div className="scrollbar-thin overflow-x-auto pb-1">
          <ol className="flex min-w-max items-stretch gap-2">
            {EVOLUTION.map((e, i) => {
              const isSol = e.key === "sol";
              const on = e.key === selected;
              return (
                <li key={e.key} className="flex items-stretch gap-2">
                  <button
                    type="button"
                    onClick={() => setSelected(e.key)}
                    aria-pressed={on}
                    className={`w-[168px] rounded-xl border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isSol
                        ? "border-success/40 bg-success/5"
                        : on
                          ? "border-violet/60 bg-violet/10"
                          : "border-border/60 bg-card/70 hover:border-violet/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      {isSol ? (
                        <Sun className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                      ) : (
                        <Moon className="h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
                      )}
                      <span className="truncate text-xs font-semibold">{e.name}</span>
                    </div>
                    <p
                      className={`mt-1 font-mono text-[10px] ${isSol ? "text-success" : "text-violet"}`}
                    >
                      {e.role}
                    </p>
                    <div className="mt-2">
                      <TruthBadge truth={e.truth} />
                    </div>
                  </button>
                  {i < EVOLUTION.length - 1 ? (
                    <span className="flex items-center text-muted-foreground" aria-hidden="true">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ol>
        </div>

        <div className="flex flex-wrap gap-2">
          {LATERAL.map((l) => {
            const c = LAB_CONCEPTS.find((x) => x.id === l.conceptId);
            return (
              <div
                key={l.name}
                className="rounded-lg border border-dashed border-border/70 bg-surface-1/40 p-2.5"
              >
                <p className="text-xs font-medium">{l.name}</p>
                <p className="font-mono text-[10px] text-muted-foreground">
                  capacidade lateral · {c?.id ?? "ID não reconciliado"} ·{" "}
                  {c?.truth ?? "NOT_VERIFIED"}
                </p>
              </div>
            );
          })}
        </div>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
          <div className="flex items-center gap-2 text-xs font-medium">
            <ImageOff className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
            Referência visual: Visual Lock recebido — arquivo binário ainda não conectado
            <TruthBadge truth="NOT_CONNECTED" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            A sequência acima foi reconstruída em componentes reais a partir do Visual Lock “LAMOU
            IA — Próximas camadas de evolução”. A imagem original não está no projeto e não é usada
            como fundo nem como interface.
          </p>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
        <Panel
          title="Comparação SOL × experimento selecionado"
          action={<DemoBadge label="SEM MÉTRICA COLETADA" />}
        >
          <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[150px]">Critério</TableHead>
                  <TableHead className="min-w-[150px]">CORE Padrão / SOL</TableHead>
                  <TableHead className="min-w-[150px]">{active?.name ?? "—"}</TableHead>
                  <TableHead className="min-w-[110px]">Delta</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {CRITERIA.map((k) => (
                  <TableRow key={k}>
                    <TableCell className="text-xs">{k}</TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      — / NOT_VERIFIED
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">
                      — / NOT_VERIFIED
                    </TableCell>
                    <TableCell className="font-mono text-[11px] text-muted-foreground">—</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <p className="text-xs text-muted-foreground">
            Nenhum número foi estimado: sem execução medida, cada célula permanece NOT_VERIFIED. A
            comparação só ganha valor depois de execução no Teste³ com evidência no Validation Gate.
          </p>
        </Panel>

        <aside className="min-w-0 space-y-4">
          <Panel title={active ? `Ficha · ${active.name}` : "Ficha"} className="xl:sticky xl:top-4">
            {concept ? (
              <ConceptDetail c={concept} />
            ) : active?.key === "sol" ? (
              <div className="space-y-2 text-xs text-muted-foreground">
                <TruthBadge truth="PARTIAL" />
                <p>
                  Referência corrente do proprietário: runtime, capabilities, CALLs, dados,
                  segurança, observabilidade, versões e evidências. Todo experimento é comparado
                  contra este estado.
                </p>
                <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  <Link to="/core/architecture">Ver Arquitetura Técnica</Link>
                </Button>
                <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
                  <Link to="/core/health">Ver Saúde &amp; Evidências</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2 text-xs text-muted-foreground">
                <TruthBadge truth="NOT_VERIFIED" hint="PROPOSED_NOT_VERIFIED" />
                <p>
                  Proposta sem conceito formalizado: não há ID canônico no Registry, hipótese
                  fechada, falsificador nem teste ligado. Permanece como ideia registrada.
                </p>
                <p className="font-mono text-[10px]">ID não reconciliado</p>
              </div>
            )}
          </Panel>

          <Panel title="Quem faz o quê">
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2">
                <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
                <span>
                  <span className="font-medium text-foreground/80">LAB</span> — teorias e
                  experimentos. Não executa teste nem aprova nada.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Boxes className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  <span className="font-medium text-foreground/80">Teste³</span> — executor das
                  execuções.{" "}
                  <Link className="underline" to="/apps/teste3">
                    abrir
                  </Link>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                <span>
                  <span className="font-medium text-foreground/80">Validation Gate</span> — gate de
                  aprovação e promoção.{" "}
                  <Link className="underline" to="/apps/validation-gate">
                    abrir
                  </Link>
                </span>
              </li>
              <li>
                A Central mostra apenas o resumo gerencial e encaminha para cá:{" "}
                <Link className="underline" to="/owner/tests">
                  Testes &amp; Qualidade
                </Link>
                .
              </li>
            </ul>
          </Panel>

          <Panel title="Execuções e evidências do LAB">
            <p className="text-xs text-muted-foreground">
              Nenhuma execução de experimento registrada: o executor de testes não está conectado e
              não há evidência anexada a nenhuma arquitetura desta linha.
            </p>
          </Panel>
        </aside>
      </div>
    </AppShell>
  );
}

export const Route = createFileRoute("/core/lab")({
  head: () => ({
    meta: [
      { title: "LAB · Teorias & Experimentos — LAMOU CORE" },
      {
        name: "description",
        content:
          "Linha evolutiva SOL → Cubo → Cubo Mágico → Prisma → Fantasma → Caleidoscópio, com hipótese, riscos, gate pendente e comparação contra SOL.",
      },
      { property: "og:title", content: "LAB · Teorias & Experimentos — LAMOU CORE" },
      {
        property: "og:description",
        content:
          "Experimentos do LAMOU CORE em estado de teste, sem promoção automática e sem métrica fabricada.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LabCorePage,
});
