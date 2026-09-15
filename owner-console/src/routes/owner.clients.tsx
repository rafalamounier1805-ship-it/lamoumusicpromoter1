import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CalendarClock,
  DatabaseBackup,
  FileText,
  LifeBuoy,
  Mail,
  Package,
  Receipt,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { ContextDetailSheet, InteractiveCard } from "@/components/lamou/interactive";
import { DemoBadge, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { CLIENT_360, CLIENT_360_FALLBACK, MSG_TEMPLATES, PACKAGES } from "@/lib/lamou/client-360";
import { useOwnerAuth } from "@/lib/lamou/owner-auth";
import { CLIENTS } from "@/lib/lamou/demo-data";
import { PLAN_LABEL, type PlanKey } from "@/lib/lamou/types";

export const Route = createFileRoute("/owner/clients")({
  head: () => ({
    meta: [
      { title: "Clientes — LAMOU IA Central" },
      {
        name: "description",
        content:
          "Cliente 360 do proprietário LAMOU: pacote, entitlements, cobrança, versões, backup, comunicações, apps e suporte.",
      },
      { property: "og:title", content: "Clientes — LAMOU IA Central" },
      {
        property: "og:description",
        content:
          "Hub operacional de pós-venda por cliente, com ambientes TESTE e OFICIAL separados e ações externas marcadas como não conectadas.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientsPage,
});

type Flow = "package" | "update" | "backup" | null;

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}

function ClientsPage() {
  const [id, setId] = useState(CLIENTS[0]?.id ?? "");
  const [flow, setFlow] = useState<Flow>(null);
  const [localEvents, setLocalEvents] = useState<Record<string, { at: string; text: string }[]>>(
    {},
  );

  const client = CLIENTS.find((c) => c.id === id) ?? CLIENTS[0];
  const ficha = (client && CLIENT_360[client.id]) ?? CLIENT_360_FALLBACK;
  const current = useMemo(
    () => PACKAGES.find((p) => p.key === client?.plan) ?? PACKAGES[0]!,
    [client?.plan],
  );

  const events = (client ? localEvents[client.id] : undefined) ?? [];
  const addEvent = (text: string) => {
    if (!client) return;
    setLocalEvents((s) => ({
      ...s,
      [client.id]: [
        { at: new Date().toLocaleString("pt-BR"), text: `${text} (registro local DEMO)` },
        ...(s[client.id] ?? []),
      ],
    }));
  };

  if (!client) return null;

  return (
    <AppShell group="owner">
      <PageHeader
        title="Clientes — Cliente 360"
        subtitle="Vida operacional pós-venda de cada cliente. Venda, proposta e contrato continuam sendo fonte de verdade em Comercial & Contratos; aqui aparece apenas o vínculo e o impacto."
        right={
          <>
            <DemoBadge />
            <Button asChild size="sm" variant="outline">
              <Link to="/owner/commercial">Comercial &amp; Contratos</Link>
            </Button>
            <Button asChild size="sm">
              <Link to="/install/client">Provisionar Cliente</Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[300px_1fr]">
        <nav aria-label="Lista de clientes" className="space-y-2">
          {CLIENTS.map((c) => (
            <InteractiveCard
              key={c.id}
              selected={c.id === client.id}
              onOpen={() => {
                setId(c.id);
                setFlow(null);
              }}
              label={`Abrir ficha de ${c.name}`}
              className="p-3"
            >
              <p className="text-sm font-medium">{c.name}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {c.segment} · {PLAN_LABEL[c.plan]}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Badge variant="outline" className="text-[10px]">
                  {c.environment}
                </Badge>
                {c.id === client.id ? (
                  <Badge variant="outline" className="border-primary/50 text-[10px] text-primary">
                    aberto
                  </Badge>
                ) : null}
              </div>
            </InteractiveCard>
          ))}
        </nav>

        <div className="min-w-0 space-y-4">
          <Panel
            title={`${client.name} — ficha 360`}
            action={
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-[10px]">
                  {client.environment}
                </Badge>
                <TruthBadge truth="SYNTHETIC_DEMO" hint="Fixture local: nenhum cliente real." />
              </div>
            }
          >
            <Tabs defaultValue="visao">
              <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
                <TabsList className="w-max">
                  <TabsTrigger value="visao">Visão geral</TabsTrigger>
                  <TabsTrigger value="pacote">Pacote &amp; Entitlements</TabsTrigger>
                  <TabsTrigger value="cobranca">Cobrança &amp; Contrato</TabsTrigger>
                  <TabsTrigger value="versoes">Versões &amp; Atualizações</TabsTrigger>
                  <TabsTrigger value="backup">Backup &amp; Restore</TabsTrigger>
                  <TabsTrigger value="comms">Comunicações</TabsTrigger>
                  <TabsTrigger value="apps">Apps &amp; CORE</TabsTrigger>
                  <TabsTrigger value="suporte">Suporte &amp; Timeline</TabsTrigger>
                </TabsList>
              </div>

              {/* 1. VISÃO GERAL */}
              <TabsContent value="visao" className="mt-4 space-y-3">
                <div className="grid gap-2 text-xs md:grid-cols-2 xl:grid-cols-3">
                  <Info label="Segmento" value={client.segment} />
                  <Info label="Ambiente" value={client.environment} />
                  <Info label="Responsável pela conta" value={ficha.accountOwner} />
                  <Info
                    label="Contato"
                    value={`${ficha.contact.name} · ${ficha.contact.role} · ${ficha.contact.email}`}
                  />
                  <Info label="Saúde" value={ficha.health} />
                  <Info label="Contrato" value={client.contractId} />
                  <Info label="Pacote atual" value={PLAN_LABEL[client.plan]} />
                  <Info
                    label="CORE instalado"
                    value={client.core
                      .map((c) => (c === "padrao" ? "CORE Padrão" : "CORE Cubo"))
                      .join(", ")}
                  />
                  <Info label="Apps licenciados" value={client.apps.join(", ")} />
                  <Info label="Entitlements" value={ficha.entitlements.join(", ") || "—"} />
                  <Info label="Armazenamento" value={ficha.storage} />
                  <Info
                    label="Usuários / ambientes"
                    value={`${ficha.users} · ${ficha.environments}`}
                  />
                  <Info
                    label="Suporte"
                    value={`${client.support.filter((s) => s.open).length} chamado(s) aberto(s)`}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => setFlow("package")}>
                    <Package className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Alterar pacote
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setFlow("update")}>
                    <CalendarClock className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Programar atualização
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setFlow("backup")}>
                    <DatabaseBackup className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                    Backup &amp; restauração
                  </Button>
                  <Button size="sm" variant="outline" disabled>
                    Visualizar exatamente como cliente
                  </Button>
                  <TruthBadge
                    truth="NOT_CONNECTED"
                    hint="O preview client-safe exige o ambiente do cliente conectado; não é simulado aqui."
                  />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-medium">Implantação</p>
                  <ul className="grid gap-2 md:grid-cols-2">
                    {client.deployment.map((d) => (
                      <li
                        key={d.step}
                        className="flex items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-2 text-xs"
                      >
                        <span className="min-w-0 flex-1">{d.step}</span>
                        <Badge
                          variant="outline"
                          className={
                            d.done
                              ? "border-success/40 text-[10px] text-success"
                              : "border-warning/40 text-[10px] text-warning"
                          }
                        >
                          {d.done ? "concluído" : "pendente"}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              {/* 2. PACOTE */}
              <TabsContent value="pacote" className="mt-4 space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-xl border border-primary/40 bg-primary/5 p-3 text-xs">
                    <p className="text-sm font-semibold">{current.name} · pacote atual</p>
                    <p className="mt-2 font-medium">Apps incluídos</p>
                    <p className="text-muted-foreground">{current.apps.join(", ")}</p>
                    <p className="mt-2 font-medium">Entitlements</p>
                    <p className="text-muted-foreground">{current.entitlements.join(", ")}</p>
                    <p className="mt-2 font-medium">Limites e permissões</p>
                    <ul className="text-muted-foreground">
                      {current.limits.map((l) => (
                        <li key={l.label}>
                          {l.label}: {l.value}
                        </li>
                      ))}
                    </ul>
                    <p className="mt-2 font-mono text-[10px] text-muted-foreground">
                      preço {current.price}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium">Histórico de pacotes</p>
                    {ficha.packageHistory.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Sem histórico registrado.</p>
                    ) : (
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {ficha.packageHistory.map((h) => (
                          <li key={h.at}>
                            <span className="font-mono">{h.at}</span> — {h.from} → {h.to} (
                            {h.reason})
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button size="sm" onClick={() => setFlow("package")}>
                      Alterar pacote
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* 3. COBRANÇA */}
              <TabsContent value="cobranca" className="mt-4 space-y-3">
                {ficha.invoices.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma fatura na fixture deste cliente (piloto sem cobrança).
                  </p>
                ) : (
                  <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fatura</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Vencimento</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {ficha.invoices.map((i) => (
                          <TableRow key={i.id}>
                            <TableCell className="font-mono text-[11px]">{i.id}</TableCell>
                            <TableCell className="text-xs">{i.period}</TableCell>
                            <TableCell className="font-mono text-[11px] text-muted-foreground">
                              {i.amount}
                            </TableCell>
                            <TableCell className="font-mono text-[11px]">{i.due}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-[10px]">
                                {i.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-xs font-medium">Alterações contratuais vinculadas</p>
                  <ul className="space-y-1 text-xs text-muted-foreground">
                    {ficha.contractChanges.map((c) => (
                      <li key={c.at}>
                        <span className="font-mono">{c.at}</span> — {c.text}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button asChild size="sm" variant="outline">
                    <Link to="/owner/commercial">
                      <Receipt className="mr-1.5 h-3.5 w-3.5" aria-hidden="true" />
                      Abrir em Comercial &amp; Contratos
                    </Link>
                  </Button>
                  <TruthBadge
                    truth="NOT_CONNECTED"
                    hint="Faturamento, gateway de pagamento e emissão fiscal não estão conectados."
                  />
                </div>
                <RealCharges clientName={client.name} />
              </TabsContent>

              {/* 4. VERSÕES */}
              <TabsContent value="versoes" className="mt-4 space-y-3">
                <div className="grid gap-2 text-xs md:grid-cols-3">
                  <Info label="Versão atual" value={ficha.currentVersion} />
                  <Info label="Canal / ambiente" value={ficha.channel} />
                  <Info
                    label="Atualização disponível"
                    value={ficha.availableVersion ?? "nenhuma na fixture"}
                  />
                </div>
                {ficha.updates.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Nenhuma atualização agendada ou aplicada nesta fixture.
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {ficha.updates.map((u) => (
                      <li
                        key={u.id}
                        className="rounded-lg border border-border/50 bg-surface-1/40 p-2 text-xs"
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-[10px]">{u.id}</span>
                          <span className="min-w-0 flex-1">
                            versão {u.version} · {u.window}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {u.status}
                          </Badge>
                        </div>
                        <p className="mt-1 text-muted-foreground">
                          responsável {u.owner} · {u.note}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" onClick={() => setFlow("update")}>
                    Programar atualização
                  </Button>
                  <TruthBadge
                    truth="NOT_CONNECTED"
                    hint="Não há executor de atualização nem rollback conectado ao ambiente do cliente."
                  />
                </div>
              </TabsContent>

              {/* 5. BACKUP */}
              <TabsContent value="backup" className="mt-4 space-y-3">
                <div className="grid gap-2 text-xs md:grid-cols-2">
                  <Info label="Política / frequência" value={ficha.backupPolicy} />
                  <Info label="Próximo backup" value={ficha.nextBackup} />
                </div>
                {ficha.backups.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Nenhum backup registrado. Nada aqui pode ser lido como “backup OK”.
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Backup</TableHead>
                        <TableHead>Quando</TableHead>
                        <TableHead>Tamanho</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Restauração testada</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ficha.backups.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="font-mono text-[11px]">{b.id}</TableCell>
                          <TableCell className="text-xs">{b.at}</TableCell>
                          <TableCell className="font-mono text-[11px] text-muted-foreground">
                            {b.size}
                          </TableCell>
                          <TableCell>
                            <TruthBadge
                              truth={b.status === "concluído" ? "SYNTHETIC_DEMO" : "NOT_VERIFIED"}
                            />
                          </TableCell>
                          <TableCell className="text-xs">
                            {b.restoreTested ? "sim (com evidência)" : "não — sem evidência"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
                <Button size="sm" variant="outline" onClick={() => setFlow("backup")}>
                  Agendar backup / teste de restauração
                </Button>
              </TabsContent>

              {/* 6. COMUNICAÇÕES */}
              <TabsContent value="comms" className="mt-4 space-y-3">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <TruthBadge truth="NOT_CONNECTED" />
                    <span className="font-medium">Nenhum canal de envio conectado</span>
                  </div>
                  <p className="mt-1 text-muted-foreground">
                    E-mail, WhatsApp e SMS não estão integrados. As mensagens abaixo são preparadas
                    localmente e nunca saem do sistema.
                  </p>
                </div>
                {ficha.comms.length === 0 && events.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Nenhuma mensagem preparada.</p>
                ) : null}
                <ul className="space-y-2">
                  {ficha.comms.map((m) => (
                    <li
                      key={m.id}
                      className="rounded-lg border border-border/50 bg-surface-1/40 p-2 text-xs"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                        <span className="min-w-0 flex-1">
                          {m.event} · {m.channel} · {m.to}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground">
                          {m.template} · {m.at}
                        </span>
                        <Badge variant="outline" className="text-[10px]">
                          {m.status}
                        </Badge>
                      </div>
                      <p className="mt-1 text-muted-foreground">
                        Evidência de envio: nenhuma (canal não conectado).
                      </p>
                    </li>
                  ))}
                </ul>
                <div className="space-y-1">
                  <p className="text-xs font-medium">Eventos que preparam mensagem</p>
                  <p className="text-xs text-muted-foreground">
                    Boas-vindas · alteração de pacote · atualização agendada · atualização concluída
                    ou com falha · cobrança e vencimento · ativação de app ou entitlement. Cada um
                    gera apenas um rascunho revisável.
                  </p>
                </div>
              </TabsContent>

              {/* 7. APPS & CORE */}
              <TabsContent value="apps" className="mt-4 space-y-2">
                {ficha.clientCore.map((c) => (
                  <div
                    key={c.name}
                    className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-2 text-xs"
                  >
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    <span className="min-w-0 flex-1">{c.name}</span>
                    <span className="font-mono text-[10px] text-muted-foreground">{c.state}</span>
                  </div>
                ))}
                <p className="text-xs text-muted-foreground">
                  O CORE do cliente é sintetizado e isolado: nunca dá acesso ao CORE do
                  proprietário.
                </p>
                <Button asChild size="sm" variant="outline">
                  <Link to="/owner/apps">
                    Portfólio de aplicativos
                    <ArrowRight className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              </TabsContent>

              {/* 8. SUPORTE & TIMELINE */}
              <TabsContent value="suporte" className="mt-4 space-y-3">
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium">
                    <LifeBuoy className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Chamados e incidentes
                  </p>
                  {client.support.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum chamado registrado.</p>
                  ) : (
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      {client.support.map((s) => (
                        <li key={s.at}>
                          <span className="font-mono">{s.at}</span> — {s.text}{" "}
                          <Badge variant="outline" className="text-[10px]">
                            {s.open ? "aberto" : "encerrado"}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="space-y-2">
                  <p className="flex items-center gap-1.5 text-xs font-medium">
                    <FileText className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Timeline do cliente
                  </p>
                  <ol className="space-y-1 text-xs text-muted-foreground">
                    {[...events, ...ficha.timeline, ...client.history].map((t, i) => (
                      <li key={`${t.at}-${i}`} className="border-l border-border/60 pl-2">
                        <span className="font-mono">{t.at}</span> — {t.text}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="space-y-1">
                  <p className="flex items-center gap-1.5 text-xs font-medium">
                    <Users className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                    Documentos e testes vinculados
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {client.docs.join(", ")} · testes {client.tests.join(", ") || "nenhum"}
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </Panel>
        </div>
      </div>

      {flow === "package" ? (
        <PackageFlow
          clientName={client.name}
          currentKey={client.plan}
          onClose={() => setFlow(null)}
          onRegister={addEvent}
        />
      ) : null}
      {flow === "update" ? (
        <UpdateFlow
          clientName={client.name}
          versions={[ficha.availableVersion, ficha.currentVersion].filter(Boolean) as string[]}
          onClose={() => setFlow(null)}
          onRegister={addEvent}
        />
      ) : null}
      {flow === "backup" ? (
        <BackupFlow
          policy={ficha.backupPolicy}
          onClose={() => setFlow(null)}
          onRegister={addEvent}
        />
      ) : null}
    </AppShell>
  );
}

function PackageFlow({
  clientName,
  currentKey,
  onClose,
  onRegister,
}: {
  clientName: string;
  currentKey: PlanKey;
  onClose: () => void;
  onRegister: (t: string) => void;
}) {
  const currentPkg = PACKAGES.find((p) => p.key === currentKey)!;
  const [target, setTarget] = useState<PlanKey>(
    (PACKAGES.find((p) => p.key !== currentKey)?.key ?? currentKey) as PlanKey,
  );
  const next = PACKAGES.find((p) => p.key === target)!;
  const [when, setWhen] = useState("imediato");
  const [at, setAt] = useState("");
  const [msg, setMsg] = useState(
    MSG_TEMPLATES["packageChange"]!({ client: clientName, a: currentPkg.name, b: next.name }),
  );
  const [confirmed, setConfirmed] = useState(false);

  const addedApps = next.apps.filter((a) => !currentPkg.apps.includes(a));
  const removedApps = currentPkg.apps.filter((a) => !next.apps.includes(a));
  const addedEnt = next.entitlements.filter((a) => !currentPkg.entitlements.includes(a));
  const removedEnt = currentPkg.entitlements.filter((a) => !next.entitlements.includes(a));

  return (
    <ContextDetailSheet
      open
      onOpenChange={(v) => !v && onClose()}
      title="Alterar pacote"
      description="Fluxo local de demonstração: nada é cobrado, liberado ou enviado fora do sistema."
      footer={
        <>
          <Button
            size="sm"
            disabled={!confirmed || target === currentKey}
            onClick={() => {
              onRegister(
                `Alteração de pacote preparada: ${currentPkg.name} → ${next.name} (${when === "imediato" ? "imediato" : `agendada ${at || "sem data"}`}) · mensagem apenas rascunho`,
              );
              onClose();
            }}
          >
            Confirmar alteração (local DEMO)
          </Button>
          <TruthBadge
            truth="NOT_CONNECTED"
            hint="Cobrança, entitlement e envio de mensagem não conectados."
          />
        </>
      }
    >
      <div className="space-y-1">
        <Label className="text-xs">Novo pacote</Label>
        <Select value={target} onValueChange={(v) => setTarget(v as PlanKey)}>
          <SelectTrigger className="h-9 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PACKAGES.map((p) => (
              <SelectItem key={p.key} value={p.key} className="text-xs">
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2 md:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-surface-1/40 p-3 text-xs">
          <p className="font-semibold">Atual · {currentPkg.name}</p>
          <p className="mt-1 text-muted-foreground">{currentPkg.apps.join(", ")}</p>
        </div>
        <div className="rounded-lg border border-primary/50 bg-primary/5 p-3 text-xs">
          <p className="font-semibold">Novo · {next.name}</p>
          <p className="mt-1 text-muted-foreground">{next.apps.join(", ")}</p>
        </div>
      </div>

      <div className="space-y-1 text-xs">
        <p className="font-medium">Delta</p>
        <p className="text-muted-foreground">
          Apps ganhos: {addedApps.join(", ") || "—"} · perdidos: {removedApps.join(", ") || "—"}
        </p>
        <p className="text-muted-foreground">
          Entitlements ganhos: {addedEnt.join(", ") || "—"} · perdidos:{" "}
          {removedEnt.join(", ") || "—"}
        </p>
        <ul className="text-muted-foreground">
          {next.limits.map((l) => (
            <li key={l.label}>
              {l.label}: {currentPkg.limits.find((x) => x.label === l.label)?.value ?? "—"} →{" "}
              {l.value}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-lg border border-border/60 bg-surface-1/40 p-3 text-xs">
        <p className="font-medium">Impacto contratual e de cobrança</p>
        <p className="mt-1 text-muted-foreground">
          Valor do novo pacote: {next.price}. O efeito financeiro é decidido e registrado em
          Comercial &amp; Contratos; esta tela apenas mostra o vínculo.
        </p>
        <p className="mt-1">
          Aceite/aprovação:{" "}
          {next.requiresApproval ? "exige aprovação do cliente" : "não exige aprovação formal"}
        </p>
        <TruthBadge truth="SYNTHETIC_DEMO" />
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Mensagem automática correspondente (rascunho editável)</Label>
        <Textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={7}
          className="text-xs"
        />
        <p className="font-mono text-[10px] text-muted-foreground">
          canal não conectado · a mensagem não será enviada
        </p>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="space-y-1">
          <Label className="text-xs">Quando</Label>
          <Select value={when} onValueChange={setWhen}>
            <SelectTrigger className="h-9 w-40 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="imediato" className="text-xs">
                Imediato
              </SelectItem>
              <SelectItem value="agendado" className="text-xs">
                Agendado
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {when === "agendado" ? (
          <div className="space-y-1">
            <Label className="text-xs" htmlFor="pkg-at">
              Data e hora
            </Label>
            <Input
              id="pkg-at"
              value={at}
              onChange={(e) => setAt(e.target.value)}
              placeholder="2026-10-01 02:00"
              className="h-9 w-52 text-xs"
            />
          </div>
        ) : null}
      </div>

      <label className="flex items-start gap-2 text-xs">
        <Checkbox checked={confirmed} onCheckedChange={(v) => setConfirmed(Boolean(v))} />
        <span>
          Entendi que esta confirmação apenas registra um evento local de demonstração na timeline
          do cliente, sem alterar cobrança, entitlement ou enviar mensagem.
        </span>
      </label>
    </ContextDetailSheet>
  );
}

function UpdateFlow({
  clientName,
  versions,
  onClose,
  onRegister,
}: {
  clientName: string;
  versions: string[];
  onClose: () => void;
  onRegister: (t: string) => void;
}) {
  const [version, setVersion] = useState(versions[0] ?? "—");
  const [window, setWindow] = useState("");
  const [backupOk, setBackupOk] = useState(false);
  const [gateOk, setGateOk] = useState(false);
  const [msg, setMsg] = useState(
    MSG_TEMPLATES["preUpdate"]!({
      client: clientName,
      a: "a janela definida",
      b: versions[0] ?? "—",
    }),
  );

  return (
    <ContextDetailSheet
      open
      onOpenChange={(v) => !v && onClose()}
      title="Programar atualização"
      description="Checklists obrigatórios antes de agendar. O executor de atualização não está conectado."
      footer={
        <>
          <Button
            size="sm"
            disabled={!backupOk || !gateOk || !window}
            onClick={() => {
              onRegister(
                `Atualização ${version} marcada como agendada para ${window} · backup prévio e gate confirmados no checklist`,
              );
              onClose();
            }}
          >
            Marcar como agendada (local DEMO)
          </Button>
          <TruthBadge truth="NOT_CONNECTED" />
        </>
      }
    >
      <div className="grid gap-2 md:grid-cols-2">
        <div className="space-y-1">
          <Label className="text-xs">Versão candidata / permitida</Label>
          <Select value={version} onValueChange={setVersion}>
            <SelectTrigger className="h-9 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v} value={v} className="text-xs">
                  {v}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label className="text-xs" htmlFor="upd-window">
            Janela (data e hora)
          </Label>
          <Input
            id="upd-window"
            value={window}
            onChange={(e) => setWindow(e.target.value)}
            placeholder="2026-10-05 01:00–02:00"
            className="h-9 text-xs"
          />
        </div>
      </div>

      <div className="space-y-2 rounded-lg border border-border/60 bg-surface-1/40 p-3 text-xs">
        <p className="font-medium">Checklist obrigatório</p>
        <label className="flex items-start gap-2">
          <Checkbox checked={backupOk} onCheckedChange={(v) => setBackupOk(Boolean(v))} />
          <span>Backup prévio confirmado (sem executor conectado, é confirmação manual)</span>
        </label>
        <label className="flex items-start gap-2">
          <Checkbox checked={gateOk} onCheckedChange={(v) => setGateOk(Boolean(v))} />
          <span>Teste prévio / Validation Gate revisado para esta versão</span>
        </label>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
            <Link to="/apps/validation-gate">Abrir Validation Gate</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-7 px-2 text-xs">
            <Link to="/apps/teste3">Abrir Teste³</Link>
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <Label className="text-xs">Mensagem pré-atualização (rascunho editável)</Label>
        <Textarea
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          rows={6}
          className="text-xs"
        />
        <p className="font-mono text-[10px] text-muted-foreground">
          canal não conectado · nada é enviado
        </p>
      </div>
    </ContextDetailSheet>
  );
}

function BackupFlow({
  policy,
  onClose,
  onRegister,
}: {
  policy: string;
  onClose: () => void;
  onRegister: (t: string) => void;
}) {
  return (
    <ContextDetailSheet
      open
      onOpenChange={(v) => !v && onClose()}
      title="Backup e restauração"
      description="Política declarada, sem executor de backup conectado a este cliente."
    >
      <p className="text-xs text-muted-foreground">{policy}</p>
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-xs">
        <div className="flex items-center gap-2">
          <TruthBadge truth="NOT_CONNECTED" />
          <span className="font-medium">Execução de backup e restore não conectada</span>
        </div>
        <p className="mt-1 text-muted-foreground">
          Nenhum resultado pode ser apresentado como “backup OK”. As ações abaixo apenas registram
          uma intenção local na timeline do cliente.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRegister("Backup solicitado — sem executor conectado")}
        >
          Registrar solicitação de backup
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onRegister("Teste de restauração solicitado — sem executor conectado")}
        >
          Registrar teste de restauração
        </Button>
      </div>
    </ContextDetailSheet>
  );
}

interface RealChargeRow {
  id: string;
  client_name: string;
  amount_cents: number;
  status: string;
  due_date: string | null;
}

/** Cobranças reais gravadas em banco (RLS por proprietário), filtradas pelo nome do cliente.
 *  Gateway de pagamento segue NOT_CONNECTED: nada é emitido ou conciliado aqui. */
function RealCharges({ clientName }: { clientName: string }) {
  const { session } = useOwnerAuth();
  const [rows, setRows] = useState<RealChargeRow[] | null>(null);

  useEffect(() => {
    if (!session) {
      setRows(null);
      return;
    }
    let alive = true;
    void supabase
      .from("billing_charges")
      .select("id, client_name, amount_cents, status, due_date")
      .eq("client_name", clientName)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (alive) setRows((data as RealChargeRow[] | null) ?? []);
      });
    return () => {
      alive = false;
    };
  }, [session, clientName]);

  return (
    <div className="rounded-lg border border-border/60 bg-surface-1/40 p-3">
      <div className="flex flex-wrap items-center gap-2">
        <p className="min-w-0 flex-1 text-xs font-medium">Cobranças registradas em base real</p>
        <TruthBadge truth={session ? "IMPLEMENTED_VERIFIED" : "BLOCKED"} />
      </div>
      {!session ? (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-muted-foreground">
            Sem sessão do proprietário não é possível ler a base real. Entre pela instalação para
            ver as cobranças gravadas.
          </p>
          <Button asChild size="sm" variant="outline">
            <Link to="/install/owner">Entrar como proprietário</Link>
          </Button>
        </div>
      ) : rows === null ? (
        <p className="mt-2 text-xs text-muted-foreground">Carregando cobranças…</p>
      ) : rows.length === 0 ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Nenhuma cobrança em base real para “{clientName}”. Registre em Comercial &amp; Contratos
          ou nas Configurações do CORE.
        </p>
      ) : (
        <ul className="mt-2 space-y-1">
          {rows.map((r) => (
            <li
              key={r.id}
              className="flex flex-wrap items-center gap-2 rounded-md border border-border/50 bg-card/60 p-2 text-xs"
            >
              <span className="min-w-0 flex-1 font-medium">
                {(r.amount_cents / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                venc. {r.due_date ?? "—"}
              </span>
              <Badge variant="outline" className="text-[10px]">
                {r.status}
              </Badge>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">
        Emissão, cartão, boleto e conciliação seguem NOT_CONNECTED — a baixa é manual e fica marcada
        como tal.
      </p>
    </div>
  );
}
