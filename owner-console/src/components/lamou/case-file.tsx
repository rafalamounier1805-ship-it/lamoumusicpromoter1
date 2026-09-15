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
import { SEVERITY_LABEL, type CaseNode, type Severity } from "@/lib/lamou/types";
import { cn } from "@/lib/utils";

const SEV_TONE: Record<Severity, string> = {
  normal: "border-success/40 text-success",
  tendencia: "border-primary/40 text-primary",
  probabilidade: "border-warning/40 text-warning",
  critico: "border-destructive/50 text-destructive",
  falha: "border-destructive/60 text-destructive",
};

/** Cadeia canônica exibida na ficha. */
const CHAIN = [
  "Origem",
  "Sinal",
  "Problema",
  "Benchmark/Métrica",
  "Hipótese",
  "Evidência",
  "Teste",
  "Decisão",
  "Ação",
  "Resultado",
  "Eficácia",
  "Aprendizado",
] as const;

const STAGE_TO_CHAIN: Record<CaseNode["stage"], string> = {
  origem: "Origem",
  sinal: "Sinal",
  evidencia: "Evidência",
  teste: "Teste",
  decisao: "Decisão",
  acao: "Ação",
  resultado: "Resultado",
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
  const {
    cases,
    routeCase,
    noteCase,
    assignCaseOwner,
    createProject,
    createTestRequest,
    createReferral,
  } = useLamou();
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
  const aiConnected = extra.ai.providerStatus === "CONNECTED";

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
        <TabsList className="grid w-full grid-cols-3 gap-1 sm:grid-cols-6">
          <TabsTrigger value="resumo" className="text-[11px]">
            Resumo
          </TabsTrigger>
          <TabsTrigger value="fonte" className="text-[11px]">
            Fonte
          </TabsTrigger>
          <TabsTrigger value="hipotese" className="text-[11px]">
            Hipótese
          </TabsTrigger>
          <TabsTrigger value="plano" className="text-[11px]">
            Plano/Ação
          </TabsTrigger>
          <TabsTrigger value="evidencias" className="text-[11px]">
            Evidências
          </TabsTrigger>
          <TabsTrigger value="historico" className="text-[11px]">
            Histórico
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resumo" className="mt-3 space-y-3">
          <Block title="Cadeia do caso">
            <ol className="flex flex-wrap gap-1">
              {CHAIN.map((f) => (
                <li
                  key={f}
                  className={cn(
                    "rounded-full border px-2 py-0.5 text-[10px]",
                    f === STAGE_TO_CHAIN[item.stage]
                      ? "border-primary/60 bg-primary/15 text-foreground"
                      : "border-border/50 text-muted-foreground",
                  )}
                >
                  {f}
                </li>
              ))}
            </ol>
            <div>
              <p className="font-medium">Destinos criados</p>
              {item.relatedIds?.length ? (
                <div className="mt-1 flex flex-wrap gap-1">
                  {item.relatedIds.map((r) => (
                    <Badge key={r} variant="outline" className="font-mono text-[10px]">
                      {r}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Nenhum destino criado a partir deste caso ainda.
                </p>
              )}
              {item.destination ? (
                <p className="mt-1 text-muted-foreground">
                  Decisão atual:{" "}
                  <span className="font-medium text-foreground">{item.destination}</span>
                  {item.archivedReason ? ` — ${item.archivedReason}` : ""}
                </p>
              ) : null}
            </div>
          </Block>

          <Block title="Resumo do problema">
            <dl className="space-y-2">
              <Field label="Problema / sinal" value={extra.problem.statement} />
              <Field label="Sinal detectado" value={item.signal} />
              <Field label="Entidade afetada" value={extra.problem.entity} />
              <Field label="Severidade" value={SEVERITY_LABEL[item.severity]} />
              <Field label="Impacto conhecido" value={extra.problem.knownImpact} />
              <Field label="Impacto ainda não verificado" value={extra.problem.unverifiedImpact} />
              <Field
                label="Responsável"
                value={item.owner ?? extra.problem.owner ?? "sem responsável atribuído"}
              />
            </dl>
          </Block>
        </TabsContent>

        <TabsContent value="fonte" className="mt-3 space-y-3">
          <Block title="Fonte & Proveniência">
            <dl className="space-y-2">
              <Field label="case_id" value={item.id} />
              <Field label="source_id" value={extra.source.sourceId} />
              <Field label="source_system" value={extra.source.sourceSystem} />
              <Field label="source_type" value={extra.source.sourceType} />
              <Field label="Origem / módulo" value={`${item.origin} · ${extra.source.module}`} />
              <Field
                label="collected_at / updated_at"
                value={`${extra.source.collectedAt} → ${extra.source.updatedAt}`}
              />
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

        <TabsContent value="hipotese" className="mt-3 space-y-3">
          <Block title="Análise da IA">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                provider
              </span>
              <TruthBadge
                truth={extra.ai.providerStatus}
                hint="Status do provider de IA no CORE Owner"
              />
            </div>
            <div>
              <p className="font-medium">Hipóteses registradas</p>
              <p className="text-muted-foreground">
                {(extra.ai.hypotheses.length ? extra.ai.hypotheses : item.hypotheses).join(" · ") ||
                  "nenhuma hipótese registrada"}
              </p>
            </div>
            <Field
              label="Evidências usadas pela IA"
              value={
                extra.ai.evidenceIds.length
                  ? extra.ai.evidenceIds.join(", ")
                  : "nenhuma — IA não executou"
              }
            />
            <Field
              label="Confiança / método"
              value={extra.ai.confidence ?? extra.ai.method ?? "não disponível"}
            />
            <div>
              <p className="font-medium">Limitações</p>
              <ul className="mt-1 list-inside list-disc text-muted-foreground">
                {extra.ai.limitations.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </div>
            {!aiConnected ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-2">
                <p className="font-medium">IA NÃO CONECTADA</p>
                <p className="mt-1 text-muted-foreground">
                  Nenhuma resposta é gerada ou simulada enquanto o provider não estiver configurado.
                </p>
                <Button asChild size="sm" variant="outline" className="mt-2">
                  <Link to="/core/ai">Configurar IA no CORE</Link>
                </Button>
              </div>
            ) : null}
          </Block>
        </TabsContent>

        <TabsContent value="plano" className="mt-3 space-y-3">
          <Block title="O que fazer agora?">
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  noteCase(item.id, "Investigação adicional registrada — caso mantido aberto");
                  setFeedback("Investigação registrada no histórico. O caso permanece aberto.");
                }}
              >
                Investigar mais
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  if (!aiConnected) {
                    setFeedback(
                      "Bloqueado: provider de IA NOT_CONNECTED. Configure a IA no CORE antes de analisar.",
                    );
                    return;
                  }
                  routeCase(item.id, "ia");
                  setFeedback("Caso enviado para análise de IA.");
                }}
              >
                Analisar com IA
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  routeCase(item.id, "plano");
                  setFeedback("Plano de Ação criado com origem, problema e evidências deste caso.");
                }}
              >
                Criar Plano de Ação
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  createProject(item.id);
                  setFeedback("Projeto criado como RASCUNHO vinculado ao caso.");
                }}
              >
                Criar Projeto
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  routeCase(item.id, "oportunidade");
                  setFeedback("Melhoria/oportunidade registrada a partir do caso.");
                }}
              >
                Criar Melhoria/Oportunidade
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  createTestRequest(item.id);
                  setFeedback("Caso de teste solicitado. Runner Teste³ permanece NOT_CONNECTED.");
                }}
              >
                Criar Caso de Teste
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  createReferral(
                    item.id,
                    "Meeting Architect",
                    "Encaminhamento local DEMO, sem integração",
                  );
                  setFeedback("Encaminhamento para reunião registrado localmente.");
                }}
              >
                Enviar para Reunião
              </Button>
              <Button size="sm" variant="outline" onClick={() => setReasonFor("falso-positivo")}>
                Marcar falso positivo
              </Button>
              <Button size="sm" variant="outline" onClick={() => setReasonFor("arquivado")}>
                Arquivar
              </Button>
            </div>

            <div className="rounded-lg border border-border/50 bg-card/50 p-2">
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
                      setFeedback("Decisão registrada com justificativa no histórico.");
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

            <div className="flex flex-wrap gap-2 pt-1">
              <Button asChild size="sm" variant="ghost">
                <Link to="/owner/plans">Abrir Planos & Projetos</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/owner/opportunities">Abrir Oportunidades</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/owner/tests">Abrir Testes & Qualidade</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/apps/meeting-architect">Abrir Meeting Architect</Link>
              </Button>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Persistência local DEMO (navegador). Nenhuma integração externa, IA ou runner de teste
              está conectada.
            </p>
          </Block>
        </TabsContent>

        <TabsContent value="evidencias" className="mt-3 space-y-3">
          <Block title="Evidências">
            <div>
              <p className="font-medium">Evidências (evidence_id rastreável)</p>
              <ul className="mt-1 space-y-1">
                {item.evidences.length ? (
                  item.evidences.map((e) => (
                    <li key={e.id} className="flex items-center gap-2 text-muted-foreground">
                      <span className="font-mono text-[10px]">EV-{e.id}</span>
                      <span className="min-w-0 flex-1 truncate">
                        {e.kind} · {e.label}
                      </span>
                      {e.demo ? <DemoBadge label="DEMO" /> : null}
                    </li>
                  ))
                ) : (
                  <li className="flex items-center gap-2 text-muted-foreground">
                    <span>Sem evidência anexada</span>
                    <TruthBadge truth="NOT_VERIFIED" />
                  </li>
                )}
              </ul>
            </div>
          </Block>

          <Block title="Benchmark & Métricas gerenciais">
            {extra.benchmarks.length ? (
              <ul className="space-y-2">
                {extra.benchmarks.map((b) => (
                  <li key={b.label} className="rounded-lg border border-border/50 bg-card/50 p-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-medium">{b.label}</span>
                      <TruthBadge truth={b.truthState} />
                    </div>
                    {b.baseline || b.current || b.reference || b.target ? (
                      <dl className="mt-2 grid grid-cols-2 gap-1">
                        <Field label="Baseline" value={b.baseline ?? "não disponível"} />
                        <Field label="Atual" value={b.current ?? "não disponível"} />
                        <Field
                          label="Referência / benchmark"
                          value={b.reference ?? "benchmark não disponível"}
                        />
                        <Field label="Meta / limite" value={b.target ?? "não definido"} />
                        <Field label="Delta" value={b.delta ?? "não calculável"} />
                      </dl>
                    ) : (
                      <p className="mt-1 text-muted-foreground">
                        Benchmark não disponível — nenhum valor de referência foi coletado.
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">Benchmark não disponível para este caso.</p>
            )}
            <p className="text-[11px] text-muted-foreground">
              Visão gerencial. A leitura técnica profunda fica no{" "}
              <Link className="text-primary underline" to="/core/health">
                LAMOU CORE Owner
              </Link>
              .
            </p>
          </Block>
        </TabsContent>

        <TabsContent value="historico" className="mt-3 space-y-3">
          <Block title="Histórico">
            <ul className="space-y-1 text-muted-foreground">
              {item.history.map((h, i) => (
                <li key={`${h.at}-${i}`}>
                  <span className="font-mono">{h.at}</span> — {h.text}
                </li>
              ))}
            </ul>
          </Block>
        </TabsContent>
      </Tabs>
    </Panel>
  );
}
