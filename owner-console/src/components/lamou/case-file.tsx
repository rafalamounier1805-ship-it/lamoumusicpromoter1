import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { DemoBadge, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { caseExtra } from "@/lib/lamou/case-provenance";
import { useLamou } from "@/lib/lamou/store";
import { SEVERITY_LABEL, type Severity } from "@/lib/lamou/types";
import { cn } from "@/lib/utils";

const SEV_TONE: Record<Severity, string> = {
  normal: "border-success/40 text-success",
  tendencia: "border-primary/40 text-primary",
  probabilidade: "border-warning/40 text-warning",
  critico: "border-destructive/50 text-destructive",
  falha: "border-destructive/60 text-destructive",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words">{value}</dd>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border/50 bg-surface-1/30 p-3">
      <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground/80">{title}</h3>
      <div className="mt-2 space-y-2 text-xs">{children}</div>
    </section>
  );
}

export function CaseFile({ caseId, onClose }: { caseId: string; onClose: () => void }) {
  const { cases, routeCase, assignCaseOwner } = useLamou();
  const item = cases.find((c) => c.id === caseId);
  const [reasonFor, setReasonFor] = useState<"falso-positivo" | "arquivado" | null>(null);
  const [reason, setReason] = useState("");
  const [ownerDraft, setOwnerDraft] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setReasonFor(null);
    setReason("");
    setOwnerDraft("");
    setFeedback(null);
  }, [caseId]);

  if (!item) return null;
  const extra = caseExtra(item.id);
  const owner = item.owner ?? extra.problem.owner ?? "sem responsável atribuído";

  return (
    <Panel
      title={`${item.id} · ${item.title}`}
      action={
        <Button size="sm" variant="ghost" onClick={onClose}>
          Fechar
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className={cn("text-[10px]", SEV_TONE[item.severity])}>
          {SEVERITY_LABEL[item.severity]}
        </Badge>
        <Badge variant="outline" className="text-[10px]">
          {item.district}
        </Badge>
        <DemoBadge label="SYNTHETIC_DEMO" />
      </div>

      <p className="text-sm text-muted-foreground">{item.description}</p>

      <Tabs defaultValue="resumo">
        <TabsList className="grid w-full grid-cols-2 gap-1 sm:grid-cols-4">
          <TabsTrigger value="resumo" className="text-[11px]">
            Resumo
          </TabsTrigger>
          <TabsTrigger value="fonte" className="text-[11px]">
            Fonte
          </TabsTrigger>
          <TabsTrigger value="encaminhamento" className="text-[11px]">
            Encaminhar
          </TabsTrigger>
          <TabsTrigger value="historico" className="text-[11px]">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-3 space-y-3">
          <Block title="Fatos detectados">
            <dl className="space-y-2">
              <Field label="O que aconteceu" value={item.description} />
              <Field label="Quando" value={extra.source.collectedAt} />
              <Field label="Onde / entidade afetada" value={extra.problem.entity} />
              <Field label="Responsável" value={owner} />
              <Field label="Criticidade" value={SEVERITY_LABEL[item.severity]} />
              <Field label="Sinal detectado" value={item.signal} />
              <Field label="Destino atual" value={item.destination ?? "ainda não encaminhado"} />
            </dl>
          </Block>

          <Block title="Métricas afetadas">
            {item.metrics.length ? (
              <dl className="space-y-2">
                {item.metrics.map((metric) => (
                  <Field
                    key={metric.label}
                    label={metric.label}
                    value={`${metric.value} · ${metric.demo ? "SYNTHETIC_DEMO" : "sem truth-state declarado"}`}
                  />
                ))}
              </dl>
            ) : (
              <p className="text-muted-foreground">Nenhuma métrica registrada para este sinal.</p>
            )}
          </Block>
        </TabsContent>

        <TabsContent value="fonte" className="mt-3 space-y-3">
          <Block title="Origem & Proveniência do sinal">
            <dl className="space-y-2">
              <Field label="case_id" value={item.id} />
              <Field label="source_id" value={extra.source.sourceId} />
              <Field label="source_system" value={extra.source.sourceSystem} />
              <Field label="source_type" value={extra.source.sourceType} />
              <Field label="Origem / módulo" value={`${item.origin} · ${extra.source.module}`} />
              <Field label="Coletado em" value={extra.source.collectedAt} />
              <Field label="Atualizado em" value={extra.source.updatedAt} />
              <Field label="Freshness" value={extra.source.freshness} />
            </dl>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                truth_state
              </span>
              <TruthBadge
                truth={extra.source.truthState}
                hint="Estado de verdade da informação de origem"
              />
            </div>
          </Block>
        </TabsContent>

        <TabsContent value="encaminhamento" className="mt-3 space-y-3">
          <Block title="Detectar aqui. Investigar e resolver no CORE.">
            <p className="text-muted-foreground">
              O Mapa Vivo não cria hipótese, análise de IA, benchmark técnico, teste ou plano. Ao
              encaminhar, o CORE recebe somente case_id, timestamp, métricas, severidade, origem e
              responsável.
            </p>
            <Button asChild size="sm">
              <Link
                to="/core/problems"
                search={{ case_id: item.id }}
                onClick={() => {
                  if (!item.destination) routeCase(item.id, "investigar");
                }}
              >
                Analisar / Resolver no CORE
              </Link>
            </Button>
          </Block>

          <Block title="Responsável pelo caso">
            <label
              className="text-[10px] uppercase tracking-wide text-muted-foreground"
              htmlFor="case-owner"
            >
              Atribuir responsável (registro local DEMO)
            </label>
            <div className="mt-1 flex gap-2">
              <Input
                id="case-owner"
                value={ownerDraft}
                onChange={(e) => setOwnerDraft(e.target.value)}
                placeholder="Nome do responsável"
                className="h-8 text-xs"
              />
              <Button
                size="sm"
                disabled={!ownerDraft.trim()}
                onClick={() => {
                  assignCaseOwner(item.id, ownerDraft.trim());
                  setOwnerDraft("");
                  setFeedback("Responsável registrado no caso local DEMO.");
                }}
              >
                Salvar
              </Button>
            </div>
          </Block>

          <Block title="Triagem gerencial">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="outline" onClick={() => setReasonFor("falso-positivo")}>
                Marcar falso positivo
              </Button>
              <Button size="sm" variant="outline" onClick={() => setReasonFor("arquivado")}>
                Arquivar
              </Button>
            </div>

            {reasonFor ? (
              <div className="rounded-lg border border-warning/40 bg-warning/5 p-2">
                <label
                  className="text-[10px] uppercase tracking-wide text-muted-foreground"
                  htmlFor="case-reason"
                >
                  Justificativa obrigatória para{" "}
                  {reasonFor === "arquivado" ? "arquivar" : "marcar falso positivo"}
                </label>
                <Textarea
                  id="case-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 min-h-16 text-xs"
                  placeholder="Descreva a justificativa que ficará no histórico"
                />
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    disabled={reason.trim().length < 5}
                    onClick={() => {
                      routeCase(item.id, reasonFor, reason.trim());
                      setReasonFor(null);
                      setReason("");
                      setFeedback("Decisão de triagem registrada com justificativa no histórico.");
                    }}
                  >
                    Confirmar
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setReasonFor(null)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : null}

            {feedback ? (
              <p className="rounded-lg border border-primary/30 bg-primary/5 p-2 text-[11px]">
                {feedback}
              </p>
            ) : null}
          </Block>
        </TabsContent>

        <TabsContent value="historico" className="mt-3 space-y-3">
          <Block title="Histórico de detecção e encaminhamento">
            <ul className="space-y-1 text-muted-foreground">
              {item.history.map((historyItem, index) => (
                <li key={`${historyItem.at}-${index}`}>
                  <span className="font-mono">{historyItem.at}</span> — {historyItem.text}
                </li>
              ))}
            </ul>
          </Block>
        </TabsContent>
      </Tabs>
    </Panel>
  );
}
