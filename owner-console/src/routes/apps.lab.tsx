import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  Beaker,
  FlaskConical,
  GitCompare,
  Moon,
  ShieldQuestion,
  Sun,
  Target,
} from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LAB_AREA_LABEL, LAB_CONCEPTS, type LabConcept } from "@/lib/lamou/lab-data";

/** Arquiteturas/teorias sem conceito detalhado ainda: preservadas como proposta. */
const PROPOSED: { id: string; name: string; question: string; note: string }[] = [
  {
    id: "LAB-CUBO-MAGICO",
    name: "Cubo Mágico",
    question:
      "É possível recombinar faces/estados do Cubo sem perder coerência de evidência entre as rotações?",
    note: "Sem conceito formalizado, sem falsificador definido e sem teste ligado.",
  },
];

const SOL = {
  id: "CORE-SOL",
  name: "CORE Padrão / SOL",
  role: "REFERÊNCIA CORRENTE",
  truth: "PARTIAL",
  summary:
    "Camada técnica operacional do proprietário: runtime, capabilities, CALLs, dados, segurança, observabilidade, versões e evidências. É a baseline com que qualquer experimento LUA é comparado.",
  modules: [
    "Capabilities",
    "CALLs & Contratos",
    "Dados & Fontes",
    "Segurança & Tenants",
    "Testes & Evidence",
  ],
};

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded border border-border/60 bg-surface-1/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

function ConceptCard({ c, open, onOpen }: { c: LabConcept; open: boolean; onOpen: () => void }) {
  return (
    <div className="rounded-xl border border-violet/30 bg-card/70 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-[10px]">
          {c.id}
        </Badge>
        <span className="min-w-0 flex-1 font-display text-sm font-semibold">{c.name}</span>
        <Badge variant="outline" className="border-violet/50 text-violet text-[10px]">
          LUA · EXPERIMENTAL
        </Badge>
        <TruthBadge truth={c.truth} />
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">Pergunta / hipótese: </span>
        {c.lamouHypothesis}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        <span className="font-medium text-foreground/80">Objetivo: </span>
        {c.mechanism}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Chip>fonte: literatura externa ({c.existingScience.length})</Chip>
        <Chip>evidências LAMOU: nenhuma</Chip>
        <Chip>testes ligados: {c.requiredTests.length} previstos · 0 executados</Chip>
        <Chip>risco: {c.risks.length} registrados</Chip>
      </div>

      {open ? (
        <div className="mt-3 space-y-3 border-t border-border/50 pt-3 text-xs">
          <div>
            <p className="flex items-center gap-1.5 font-medium">
              <GitCompare className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Comparação com SOL
            </p>
            <p className="mt-1 text-muted-foreground">
              SOL permanece a referência corrente. {c.name} não substitui nem altera SOL:
              divergência intencional mantida isolada em LUA, sem promoção automática.
            </p>
          </div>
          <div>
            <p className="flex items-center gap-1.5 font-medium">
              <ShieldQuestion className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
              Falsificadores
            </p>
            <ul className="mt-1 list-disc space-y-0.5 pl-4 text-muted-foreground">
              {c.falsifiers.map((f) => (
                <li key={f}>{f}</li>
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
              Próximo gate
            </p>
            <p className="mt-1 text-muted-foreground">
              Executar {c.requiredTests[0] ?? "o primeiro teste previsto"} e registrar evidência no
              Validation Gate. Sem evidência não há mudança de estado.
            </p>
          </div>
          <div>
            <p className="font-medium">Aplicações mapeadas</p>
            <div className="mt-1 flex flex-wrap gap-1.5">
              {c.applications.map((a) => (
                <Chip key={a.area + a.use}>{LAB_AREA_LABEL[a.area]}</Chip>
              ))}
            </div>
          </div>
          <p className="text-muted-foreground">{c.matrixNote}</p>
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="h-7 text-xs" onClick={onOpen}>
          {open ? "Fechar experimento" : "Abrir experimento"}
        </Button>
        <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
          <Link to="/core/sol-lua">Ver SOL / LUA no CORE</Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="h-7 text-xs">
          <Link to="/apps/validation-gate">Validation Gate</Link>
        </Button>
      </div>
    </div>
  );
}

function LabPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <AppShell group="apps">
      <PageHeader
        title="LAMOU Lab — ficha do aplicativo (legado)"
        subtitle="Ficha de produto do Lab. A superfície técnica de teorias e experimentos vive no CORE: LAB · Teorias & Experimentos. Nenhuma promoção é automática: SALVAR ≠ PROMOVER."
        right={
          <>
            <TruthBadge truth="HYPOTHESIS" hint="Conceitos experimentais, sem validação externa" />
            <Button asChild size="sm">
              <Link to="/core/lab">Abrir LAB técnico no CORE</Link>
            </Button>
            <Button asChild size="sm" variant="ghost">
              <Link to="/owner/apps">Voltar à Central &gt; Aplicativos</Link>
            </Button>
          </>
        }
      />

      <Panel title="Mapa de arquiteturas — SOL (referência) × LUA (experimentos)">
        <div className="grid gap-3 lg:grid-cols-[minmax(0,320px)_44px_minmax(0,1fr)] lg:items-start">
          <div className="rounded-xl border border-success/30 bg-success/5 p-4">
            <div className="flex items-center gap-2">
              <Sun className="h-4 w-4 text-success" aria-hidden="true" />
              <span className="font-display text-sm font-semibold">{SOL.name}</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-success">{SOL.role}</p>
            <p className="mt-2 text-xs text-muted-foreground">{SOL.summary}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {SOL.modules.map((m) => (
                <Chip key={m}>{m}</Chip>
              ))}
            </div>
            <div className="mt-3">
              <TruthBadge truth={SOL.truth} hint="Contratos definidos; runtime não executado" />
            </div>
          </div>

          <div
            className="flex items-center justify-center py-2 text-muted-foreground lg:h-full"
            aria-hidden="true"
          >
            <ArrowRight className="h-5 w-5 rotate-90 lg:rotate-0" />
          </div>

          <div className="rounded-xl border border-violet/30 bg-violet/5 p-4">
            <div className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-violet" aria-hidden="true" />
              <span className="font-display text-sm font-semibold">LUA / LAB — experimentos</span>
            </div>
            <p className="mt-1 font-mono text-[10px] text-violet">
              ISOLADO DE SOL · SEM PROMOÇÃO AUTOMÁTICA
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {LAB_CONCEPTS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setOpenId(c.id)}
                  className="rounded-lg border border-border/60 bg-card/70 p-2 text-left transition hover:border-violet/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={`Abrir ${c.name}`}
                >
                  <p className="font-mono text-[10px] text-muted-foreground">{c.id}</p>
                  <p className="truncate text-xs font-medium">{c.name}</p>
                </button>
              ))}
              {PROPOSED.map((p) => (
                <div key={p.id} className="rounded-lg border border-dashed border-border/60 p-2">
                  <p className="font-mono text-[10px] text-muted-foreground">{p.id}</p>
                  <p className="truncate text-xs font-medium">{p.name}</p>
                  <p className="mt-0.5 font-mono text-[9px] text-muted-foreground">
                    PROPOSED_NOT_VERIFIED
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        {LAB_CONCEPTS.map((c) => (
          <ConceptCard
            key={c.id}
            c={c}
            open={openId === c.id}
            onOpen={() => setOpenId(openId === c.id ? null : c.id)}
          />
        ))}
      </div>

      <Panel title="Teorias propostas sem experimento formalizado">
        <div className="space-y-2">
          {PROPOSED.map((p) => (
            <div key={p.id} className="rounded-lg border border-dashed border-border/60 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="font-mono text-[10px]">
                  {p.id}
                </Badge>
                <span className="min-w-0 flex-1 text-sm font-medium">{p.name}</span>
                <TruthBadge truth="NOT_VERIFIED" hint="PROPOSED_NOT_VERIFIED" />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{p.question}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.note}</p>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Regras do Lab">
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <FlaskConical className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
            Todo experimento nasce em LUA e só muda de estado com evidência registrada.
          </li>
          <li className="flex items-start gap-2">
            <Beaker className="mt-0.5 h-4 w-4 shrink-0 text-violet" aria-hidden="true" />
            Nenhuma métrica aqui é probabilidade científica; plausibilidade de engenharia é
            estimativa heurística não calibrada.
          </li>
          <li className="flex items-start gap-2">
            <Sun className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            SOL nunca é sobrescrito por um experimento: a promoção exige gate explícito.
          </li>
        </ul>
      </Panel>
    </AppShell>
  );
}

export const Route = createFileRoute("/apps/lab")({
  head: () => ({
    meta: [
      { title: "LAMOU Lab — Teorias e Arquiteturas em Teste" },
      {
        name: "description",
        content:
          "Laboratório de arquiteturas LAMOU: SOL como referência corrente e LUA com experimentos, hipóteses, falsificadores, riscos e gates.",
      },
      { property: "og:title", content: "LAMOU Lab — Teorias e Arquiteturas em Teste" },
      {
        property: "og:description",
        content:
          "SOL × LUA, conceitos experimentais com hipótese, evidência, risco e próximo gate. Nada promovido automaticamente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LabPage,
});
