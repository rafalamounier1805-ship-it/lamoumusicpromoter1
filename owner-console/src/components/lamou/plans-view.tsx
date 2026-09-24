import { Link } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { caseExtra } from "@/lib/lamou/case-provenance";
import { mapCaseToCoreFacts } from "@/lib/lamou/core-case-facts";
import type { NavGroup } from "@/lib/lamou/nav";
import { useLamou } from "@/lib/lamou/store";
import { SEVERITY_LABEL } from "@/lib/lamou/types";

const TECHNICAL_CHAIN = [
  "Origem",
  "Sinal",
  "Problema",
  "Benchmark",
  "Hipótese",
  "Evidência",
  "Teste",
  "Decisão",
  "Ação",
  "Resultado",
  "Eficácia",
  "Aprendizado",
] as const;

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 break-words text-xs">{value}</dd>
    </div>
  );
}

function Row({
  id,
  title,
  origin,
  status,
  truth,
  detail,
}: {
  id: string;
  title: string;
  origin: string;
  status?: string | undefined;
  truth: string;
  detail?: string | undefined;
}) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline" className="font-mono text-[10px]">
          {id}
        </Badge>
        <span className="min-w-0 flex-1 text-sm font-medium">{title}</span>
        {status ? (
          <Badge variant="outline" className="text-[10px]">
            {status}
          </Badge>
        ) : null}
        <TruthBadge truth={truth} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">Origem: {origin}</p>
      {detail ? <p className="mt-1 text-xs text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

/** Problemas, Planos de Ação, Projetos & Melhorias.
 *  Superfície canônica: CORE (operação). A Central mantém a rota antiga como
 *  compatibilidade e mostra apenas resumo/alerta com link. */
export function PlansView({
  group,
  selectedCaseId,
}: {
  group: NavGroup;
  selectedCaseId?: string | undefined;
}) {
  const { cases, plans, projects, improvements, referrals, testRequests, routeCase } = useLamou();
  const routed = cases.filter((c) => c.destination);
  const selectedCase = selectedCaseId ? cases.find((c) => c.id === selectedCaseId) : undefined;
  const selectedExtra = selectedCase ? caseExtra(selectedCase.id) : undefined;
  const facts =
    selectedCase && selectedExtra ? mapCaseToCoreFacts(selectedCase, selectedExtra) : null;
  const selectedPlan = selectedCase
    ? plans.find((plan) => plan.originCaseId === selectedCase.id)
    : undefined;

  return (
    <AppShell group={group}>
      <PageHeader
        title="Problemas, Planos de Ação, Projetos & Melhorias"
        subtitle="Operação técnica do CORE. O Mapa Vivo detecta e encaminha; investigação, hipótese, testes, decisão e plano vivem aqui."
        right={
          <>
            <DemoBadge label="SYNTHETIC_DEMO" />
            <TruthBadge
              truth="IMPLEMENTED_NOT_VERIFIED"
              hint="Persistência local no navegador, sem banco conectado"
            />
          </>
        }
      />

      {selectedCase && facts ? (
        <Panel
          title={`Caso técnico · ${selectedCase.id}`}
          action={
            <Button asChild size="sm" variant="ghost">
              <Link to="/owner/mapa-vivo" search={{ case_id: selectedCase.id }}>
                Voltar ao Mapa Vivo
              </Link>
            </Button>
          }
        >
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="font-mono text-[10px]">
                {facts.case_id}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                {SEVERITY_LABEL[facts.severity]}
              </Badge>
              <TruthBadge truth={facts.truth_state} />
            </div>

            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide">
                Facts recebidos do Mapa
              </p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Contrato de entrada restrito. Nenhuma hipótese, análise de IA, decisão ou plano foi
                transferido automaticamente.
              </p>
              <dl className="mt-3 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                <Field label="case_id" value={facts.case_id} />
                <Field label="timestamp" value={facts.timestamp} />
                <Field label="origem" value={facts.origin} />
                <Field label="entidade afetada" value={facts.affected_entity} />
                <Field label="responsável" value={facts.responsible ?? "não atribuído"} />
                <Field label="source_id" value={facts.source_id} />
              </dl>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {facts.metrics.length ? (
                  facts.metrics.map((metric) => (
                    <Field
                      key={metric.label}
                      label={`Métrica · ${metric.label}`}
                      value={`${metric.value} · ${metric.demo ? "SYNTHETIC_DEMO" : "truth-state não declarado"}`}
                    />
                  ))
                ) : (
                  <Field label="Métricas" value="nenhuma métrica recebida" />
                )}
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide">
                Cadeia técnica no CORE
              </p>
              <ol className="mt-2 flex flex-wrap gap-1">
                {TECHNICAL_CHAIN.map((stage, index) => (
                  <li
                    key={stage}
                    className="rounded-full border border-border/60 px-2 py-0.5 text-[10px] text-muted-foreground"
                  >
                    {index + 1}. {stage}
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
              <Field label="Origem" value={facts.source_system} />
              <Field label="Sinal" value={selectedCase.signal} />
              <Field
                label="Problema técnico"
                value={`${selectedExtra?.problem.statement ?? "não registrado"} · SYNTHETIC_DEMO`}
              />
              <Field
                label="Benchmark"
                value="não transferido pelo Mapa; avaliar no CORE antes de usar"
              />
              <Field
                label="Hipótese técnica"
                value="NOT_VERIFIED — nenhuma hipótese foi transferida ou criada automaticamente"
              />
              <Field
                label="Evidência"
                value={
                  selectedCase.evidences.length
                    ? `${selectedCase.evidences.length} referência(s) de evidência disponíveis para revisão técnica`
                    : "NOT_VERIFIED — sem evidência anexada"
                }
              />
              <Field label="Teste" value="NOT_VERIFIED — nenhum teste executado por esta ação" />
              <Field label="Decisão" value="pendente de análise técnica" />
              <Field
                label="Ação"
                value={selectedPlan ? `Plano ${selectedPlan.id} existente` : "não definida"}
              />
              <Field label="Resultado" value="não disponível" />
              <Field label="Eficácia" value="não disponível" />
              <Field label="Aprendizado" value="não disponível" />
            </div>

            <div className="flex flex-wrap gap-2 border-t border-border/50 pt-3">
              <Button
                size="sm"
                disabled={Boolean(selectedPlan)}
                onClick={() => routeCase(selectedCase.id, "plano")}
              >
                {selectedPlan
                  ? `Plano ${selectedPlan.id} já criado`
                  : "Registrar encaminhamento para Plano de Ação"}
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/core/tests">Abrir Testes & Qualidade</Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link to="/core/observability">Abrir Observabilidade</Link>
              </Button>
            </div>
          </div>
        </Panel>
      ) : selectedCaseId ? (
        <Panel title="Caso técnico não encontrado">
          <p className="text-sm text-muted-foreground">
            O `case_id` informado não existe na fonte local atual. Nenhum caso foi inventado.
          </p>
        </Panel>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Casos encaminhados", value: String(routed.length) },
          { label: "Planos de Ação", value: String(plans.length) },
          { label: "Projetos", value: String(projects.length) },
          { label: "Melhorias / Oportunidades", value: String(improvements.length) },
        ].map((k) => (
          <div
            key={k.label}
            className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur"
          >
            <p className="text-xs text-muted-foreground">{k.label}</p>
            <p className="mt-1 font-display text-2xl font-semibold">{k.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="problemas" className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          <TabsTrigger value="problemas">Problemas ({routed.length})</TabsTrigger>
          <TabsTrigger value="planos">Planos de Ação ({plans.length})</TabsTrigger>
          <TabsTrigger value="projetos">Projetos ({projects.length})</TabsTrigger>
          <TabsTrigger value="melhorias">Melhorias ({improvements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="problemas" className="mt-3 grid gap-4 xl:grid-cols-2">
          <Panel
            title="Problemas / casos encaminhados"
            action={
              <Button asChild size="sm" variant="ghost">
                <Link to="/owner/mapa-vivo">Abrir Mapa Vivo</Link>
              </Button>
            }
          >
            {routed.length ? (
              <div className="space-y-2">
                {routed.map((c) => (
                  <Link key={c.id} to="/core/problems" search={{ case_id: c.id }}>
                    <Row
                      id={c.id}
                      title={c.title}
                      origin={`${c.origin} · ${c.district}`}
                      status={c.destination ?? undefined}
                      truth="SYNTHETIC_DEMO"
                      detail={`Responsável: ${c.owner ?? "não atribuído"} · abrir para investigação técnica`}
                    />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum caso encaminhado ainda. O Mapa Vivo detecta o sinal e encaminha para esta
                superfície técnica.
              </p>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="planos" className="mt-3 grid gap-4 xl:grid-cols-2">
          <Panel title="Planos de Ação">
            {plans.length ? (
              <div className="space-y-2">
                {plans.map((p) => (
                  <Row
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    origin={p.originCaseId ? `Caso ${p.originCaseId} · ${p.origin}` : p.origin}
                    status={p.status}
                    truth="SYNTHETIC_DEMO"
                    detail={`Evidências: ${p.evidences.length} · Responsável: ${p.owner || "não definido"} · Critério de conclusão: ${p.completionCriteria || "não definido"}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum plano registrado.</p>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="projetos" className="mt-3 grid gap-4 xl:grid-cols-2">
          <Panel title="Projetos">
            {projects.length ? (
              <div className="space-y-2">
                {projects.map((p) => (
                  <Row
                    key={p.id}
                    id={p.id}
                    title={p.title}
                    origin={p.originCaseId ? `Caso ${p.originCaseId}` : "origem não registrada"}
                    status={p.status}
                    truth="SYNTHETIC_DEMO"
                    detail={p.problem}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum projeto criado nesta visão de compatibilidade. Quando a complexidade exigir
                projeto, o handoff deve apontar para PROJECT sem recriar o PROJECT aqui.
              </p>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="melhorias" className="mt-3 grid gap-4 xl:grid-cols-2">
          <Panel
            title="Melhorias / Oportunidades relacionadas"
            action={
              <Button asChild size="sm" variant="ghost">
                <Link to="/owner/opportunities">Abrir Oportunidades</Link>
              </Button>
            }
          >
            {improvements.length ? (
              <div className="space-y-2">
                {improvements.map((i) => (
                  <Row
                    key={i.id}
                    id={i.id}
                    title={i.title}
                    origin={i.origin}
                    status={i.route ?? "sem rota definida"}
                    truth="SYNTHETIC_DEMO"
                    detail={i.description}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhuma melhoria registrada.</p>
            )}
          </Panel>

          <Panel
            title="Solicitações de teste"
            action={
              <Button asChild size="sm" variant="ghost">
                <Link to="/core/tests">Abrir Testes & Qualidade do CORE</Link>
              </Button>
            }
          >
            {testRequests.length ? (
              <div className="space-y-2">
                {testRequests.map((t) => (
                  <Row
                    key={t.id}
                    id={t.id}
                    title={t.title}
                    origin={`Caso ${t.caseId} · ${t.target}`}
                    status="runner não conectado"
                    truth="NOT_CONNECTED"
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhuma solicitação de teste registrada.
              </p>
            )}
          </Panel>

          <Panel title="Encaminhamentos registrados">
            {referrals.length ? (
              <div className="space-y-2">
                {referrals.map((r) => (
                  <Row
                    key={r.id}
                    id={r.id}
                    title={`Encaminhado para ${r.app}`}
                    origin={`Caso ${r.caseId}`}
                    status={r.createdAt}
                    truth="NOT_CONNECTED"
                    detail={r.note}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum encaminhamento registrado.</p>
            )}
          </Panel>
        </TabsContent>
      </Tabs>

      <Panel title="Onde cada atividade acontece">
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>Mapa Vivo: detectar, contextualizar fatos e encaminhar.</li>
          <li>
            CORE: investigar tecnicamente, observar e encaminhar sem absorver o aplicativo
            responsável pela execução.
          </li>
          <li>
            Plano de Ação: governar ação, responsável, prazo, aprovação, evidência, resultado e
            eficácia.
          </li>
          <li>
            PROJECT: assumir iniciativas complexas com múltiplas frentes, dependências e marcos.
          </li>
          <li>
            Teste do que já está em operação: CORE &gt; Testes & Qualidade. Candidata/experimento:
            LABTEST.
          </li>
          <li>
            Persistência local DEMO nesta visão de compatibilidade; Plano de Ação e PROJECT
            permanecem aplicativos independentes e seus runtimes/bancos não são declarados
            conectados.
          </li>
          <li>Nenhuma versão foi promovida: SALVAR ≠ PROMOVER.</li>
        </ul>
      </Panel>
    </AppShell>
  );
}
