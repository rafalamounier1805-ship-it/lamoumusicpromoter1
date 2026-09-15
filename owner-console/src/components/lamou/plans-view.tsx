import { Link } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { NavGroup } from "@/lib/lamou/nav";
import { useLamou } from "@/lib/lamou/store";

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
export function PlansView({ group }: { group: NavGroup }) {
  const { cases, plans, projects, improvements, referrals, testRequests } = useLamou();
  const routed = cases.filter((c) => c.destination);

  return (
    <AppShell group={group}>
      <PageHeader
        title="Problemas, Planos de Ação, Projetos & Melhorias"
        subtitle="Operação do CORE. Destinos criados a partir de casos do Mapa Vivo, com vínculo de origem e IDs relacionados sempre visíveis."
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
                  <Row
                    key={c.id}
                    id={c.id}
                    title={c.title}
                    origin={`${c.origin} · ${c.district}`}
                    status={c.destination ?? undefined}
                    truth="SYNTHETIC_DEMO"
                    detail={`Relacionados: ${c.relatedIds?.join(", ") || "nenhum"} · Responsável: ${c.owner ?? "não atribuído"}`}
                  />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum caso encaminhado ainda. Abra um caso no Mapa Vivo e use “O que fazer agora?”.
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
                Nenhum projeto criado. Projetos nascem de um caso, com status inicial RASCUNHO.
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

      <Panel title="Onde cada teste acontece">
        <ul className="space-y-1 text-sm text-muted-foreground">
          <li>
            Teste do que já está em operação: CORE &gt; Testes & Qualidade. Teste de candidata,
            ideia, plugin ou nova versão: LABTEST.
          </li>
          <li>Persistência local DEMO no navegador; banco de dados permanece NOT_CONNECTED.</li>
          <li>
            Runner de teste, provider de IA e integração com Meeting Architect permanecem
            NOT_CONNECTED.
          </li>
          <li>Nenhuma versão foi promovida: SALVAR ≠ PROMOVER.</li>
        </ul>
      </Panel>
    </AppShell>
  );
}
