import { Brain, CheckCircle2, CircleSlash2, ShieldCheck, Users } from "lucide-react";

import { Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { PROFESSIONAL_ROLES } from "@/lib/lamou/council-data";
import {
  COUNCIL_PIPELINE,
  EFFECTIVE_COUNCIL_RUNS,
  planCouncilRun,
} from "@/lib/lamou/council-runtime";
import { CALL_REGISTRY } from "@/lib/lamou/registry";

export function CouncilView() {
  const providerCall = CALL_REGISTRY.find((call) => call.id === "CALL-0003");
  const providerConnected = providerCall?.status === "IMPLEMENTED_VERIFIED";
  const plan = planCouncilRun({
    taskType: "arquitetura",
    mode: "PROFUNDO",
    risk: "alto",
    evidence: "parcial",
    providerConnected,
    toolsConnected: false,
    privacy: "sensivel",
    costKnown: false,
  });

  return (
    <div className="space-y-4">
      <Panel title="Conselho & API — estado efetivo">
        <div className="flex flex-wrap items-center gap-2">
          <TruthBadge truth={plan.truth} />
          <Badge variant="outline">provider: {plan.providerState}</Badge>
          <Badge variant="outline">tools: {plan.toolState}</Badge>
          <Badge variant="outline">modo: {plan.executionMode}</Badge>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Sem provider conectado, o sistema faz somente seleção determinística e checklists locais.
          Especialistas externos, Red Team e síntese não são simulados.
        </p>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Panel title="Perfis disponíveis">
          <p className="font-display text-2xl font-semibold">{PROFESSIONAL_ROLES.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">contagem dinâmica</p>
        </Panel>
        <Panel title="Perfis selecionados">
          <p className="font-display text-2xl font-semibold">{plan.roles.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">PROFUNDO · risco alto</p>
        </Panel>
        <Panel title="Provider de IA">
          <p className="font-display text-lg font-semibold">{plan.providerState}</p>
          <p className="mt-1 text-xs text-muted-foreground">origem: CALL-0003</p>
        </Panel>
        <Panel title="Aprovação humana">
          <p className="font-display text-lg font-semibold">OBRIGATÓRIA</p>
          <p className="mt-1 text-xs text-muted-foreground">antes de qualquer ação</p>
        </Panel>
      </div>

      <Panel title="Pipeline canônico do Conselho">
        <ol className="grid gap-2 sm:grid-cols-2 xl:grid-cols-5">
          {COUNCIL_PIPELINE.map((stage, index) => {
            const blocked = plan.blockedStages.some((value) => value.startsWith(stage.label));
            return (
              <li key={stage.id} className="rounded-xl border border-border/60 bg-card/60 p-3 text-xs">
                <div className="flex items-center gap-2">
                  {blocked ? (
                    <CircleSlash2 className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-primary" aria-hidden="true" />
                  )}
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="mt-2 font-medium">{stage.label}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">execução: {stage.execution}</p>
              </li>
            );
          })}
        </ol>
      </Panel>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Especialistas selecionados">
          <div className="space-y-2">
            {plan.roles.map((role) => (
              <div key={role.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                  <span className="font-medium">{role.name}</span>
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {role.id}
                  </Badge>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{role.mission}</p>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Pergunta obrigatória: {role.mandatoryQuestions[0] ?? "não definida"}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Gates e bloqueios atuais">
          <ul className="space-y-2 text-sm">
            {plan.blockedStages.map((blocked) => (
              <li
                key={blocked}
                className="flex items-start gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-3"
              >
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
                <span>{blocked}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 space-y-1 text-xs text-muted-foreground">
            {plan.reasons.map((reason) => (
              <p key={reason}>{reason}</p>
            ))}
          </div>
        </Panel>
      </div>

      <Panel title="Execuções históricas — truth-state efetivo">
        <p className="mb-3 text-xs text-muted-foreground">
          Seeds preservados não viram FACT por existirem no código. Sem persistência/proveniência de
          execução, são exibidos como demonstração sintética.
        </p>
        <div className="space-y-2">
          {EFFECTIVE_COUNCIL_RUNS.map((run) => (
            <div key={run.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Brain className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="min-w-0 flex-1 font-medium">
                  {run.id} · {run.task}
                </span>
                <TruthBadge truth={run.truth} />
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                persisted={String(run.persisted)} · custo={run.cost.source} · modo={run.mode}
              </p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
