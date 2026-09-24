import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";

import { AppShell } from "@/components/lamou/app-shell";
import { ContextDetailSheet, InteractiveRow } from "@/components/lamou/interactive";
import { DemoBadge, NotConnected, PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { B144_LABTEST_MODULES } from "@/lib/lamou/b144-candidate";
import { useOwnerAuth } from "@/lib/lamou/owner-auth";
import {
  isReady,
  LT_IMPROVE,
  LT_ITEMS,
  LT_STAGES,
  LT_TABS,
  LT_TYPE_LABEL,
  NEXT_VERSION,
  type LtItem,
  type LtStage,
} from "@/lib/lamou/labtest-data";
import { cn } from "@/lib/utils";

const LABTEST_STORAGE_KEY = "lamou_b144_labtest_state_v2";

type ValidationStatus = "VALIDADO" | "NAO_VALIDADO";
type ValidationDestination = "TESTE" | "PLANO_DE_ACAO" | "MELHORIA" | "APROVACAO_PROXIMA_VERSAO";

interface ValidationRecord {
  itemId: string;
  status: ValidationStatus;
  enteredAt: string;
  submittedBy: string;
  source: string;
  decidedAt: string;
  decidedBy: string;
  destination: ValidationDestination | null;
}

const STAGE_TONE: Record<string, string> = {
  "IDEIA/CRIAÇÃO": "border-border/60 text-muted-foreground",
  DESENVOLVIMENTO: "border-primary/40 text-primary",
  TESTE: "border-primary/50 text-primary",
  HOMOLOGAÇÃO: "border-warning/50 text-warning",
  READY_FOR_GATE: "border-success/50 text-success",
  PROMOVIDO: "border-success/60 text-success",
  BLOQUEADO: "border-destructive/50 text-destructive",
  NÃO_VERIFICADO: "border-border/60 text-muted-foreground",
};

function Kpi({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
      {hint ? <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Bars({ data }: { data: { label: string; value: number; tone?: string }[] }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate text-xs text-muted-foreground">{d.label}</span>
          <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-surface-2">
            <div
              className={cn("h-full rounded-full bg-primary/70", d.tone)}
              style={{ width: `${(d.value / max) * 100}%` }}
            />
          </div>
          <span className="w-8 shrink-0 text-right font-mono text-xs">{d.value}</span>
        </div>
      ))}
    </div>
  );
}

function ItemRow({
  item,
  selected,
  onOpen,
}: {
  item: LtItem;
  selected: boolean;
  onOpen: () => void;
}) {
  return (
    <InteractiveRow
      selected={selected}
      label={`Abrir ficha de ${item.id} ${item.name}`}
      onOpen={onOpen}
    >
      <span className="block">
        <span className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-mono text-[10px]">
            {item.id}
          </Badge>
          <span className="min-w-0 flex-1 text-sm font-medium">{item.name}</span>
          <Badge variant="outline" className={cn("text-[10px]", STAGE_TONE[item.stage])}>
            {item.stage}
          </Badge>
          <TruthBadge truth={item.truth} />
        </span>
        <span className="mt-1 block text-[11px] text-muted-foreground">
          {LT_TYPE_LABEL[item.type]} · {item.family} · versão {item.version ?? "—"} · responsável{" "}
          {item.owner ?? "não definido"} · atualizado {item.updatedAt} · testes {item.testsDone} ok
          / {item.testsPending} pendentes · evidências {item.evidences.length} · blockers{" "}
          {item.blockers.length} · alvo {item.target ?? "sem alvo de versão"}
        </span>
      </span>
    </InteractiveRow>
  );
}

type Sheet = { item: LtItem; mode: "ficha" | "testar" } | null;

export function LabTestView({ initialTab = "overview" }: { initialTab?: string }) {
  const { profile } = useOwnerAuth();
  const [tab, setTab] = useState(initialTab);
  const [sheet, setSheet] = useState<Sheet>(null);
  const [queue, setQueue] = useState<string[]>(() => {
    const fallback = NEXT_VERSION.entries.map((e) => e.itemId);
    if (typeof window === "undefined") return fallback;
    try {
      const saved = JSON.parse(window.localStorage.getItem(LABTEST_STORAGE_KEY) ?? "{}") as {
        queue?: string[];
      };
      return Array.isArray(saved.queue) ? saved.queue : fallback;
    } catch {
      return fallback;
    }
  });
  const [validated, setValidated] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem(LABTEST_STORAGE_KEY) ?? "{}") as {
        validated?: string[];
      };
      return Array.isArray(saved.validated) ? saved.validated : [];
    } catch {
      return [];
    }
  });
  const [validationRecords, setValidationRecords] = useState<Record<string, ValidationRecord>>(
    () => {
      if (typeof window === "undefined") return {};
      try {
        const saved = JSON.parse(window.localStorage.getItem(LABTEST_STORAGE_KEY) ?? "{}") as {
          validationRecords?: Record<string, ValidationRecord>;
        };
        return saved.validationRecords ?? {};
      } catch {
        return {};
      }
    },
  );
  const [log, setLog] = useState<{ at: string; text: string }[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = JSON.parse(window.localStorage.getItem(LABTEST_STORAGE_KEY) ?? "{}") as {
        log?: { at: string; text: string }[];
      };
      return Array.isArray(saved.log) ? saved.log : [];
    } catch {
      return [];
    }
  });
  const [criticalPending, setCriticalPending] = useState(3);
  const [scenario, setScenario] = useState("Cenário de teste");
  const [dataset, setDataset] = useState("");

  const byStage = useMemo(() => {
    const m = new Map<LtStage, number>();
    for (const s of LT_STAGES) m.set(s, 0);
    for (const i of LT_ITEMS) m.set(i.stage, (m.get(i.stage) ?? 0) + 1);
    return m;
  }, []);

  const byType = useMemo(() => {
    const m = new Map<string, number>();
    for (const i of LT_ITEMS) {
      const k = LT_TYPE_LABEL[i.type];
      m.set(k, (m.get(k) ?? 0) + 1);
    }
    return [...m.entries()].map(([label, value]) => ({ label, value }));
  }, []);

  const blocked = LT_ITEMS.filter((i) => i.stage === "BLOQUEADO" || i.blockers.length > 0);
  const ready = LT_ITEMS.filter((i) => i.stage === "READY_FOR_GATE");
  const critical = LT_ITEMS.filter((i) => i.testsPending >= criticalPending);

  function addLog(text: string) {
    setLog((v) => [{ at: new Date().toLocaleString("pt-BR"), text }, ...v]);
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(
      LABTEST_STORAGE_KEY,
      JSON.stringify({ queue, validated, validationRecords, log: log.slice(0, 100) }),
    );
  }, [queue, validated, validationRecords, log]);

  function decideValidation(item: LtItem, status: ValidationStatus) {
    if (status === "VALIDADO" && !isReady(item)) {
      addLog(`Validação bloqueada para ${item.name}: ainda existem testes ou blockers pendentes.`);
      return;
    }

    const now = new Date().toLocaleString("pt-BR");
    const actor = profile?.full_name?.trim() || "Proprietário";
    const record: ValidationRecord = {
      itemId: item.id,
      status,
      enteredAt: item.updatedAt,
      submittedBy: item.owner ?? "origem não informada",
      source: item.source,
      decidedAt: now,
      decidedBy: actor,
      destination: status === "VALIDADO" ? "APROVACAO_PROXIMA_VERSAO" : "TESTE",
    };

    setValidationRecords((current) => ({ ...current, [item.id]: record }));
    setValidated((current) =>
      status === "VALIDADO"
        ? current.includes(item.id)
          ? current
          : [...current, item.id]
        : current.filter((id) => id !== item.id),
    );

    if (status === "VALIDADO") {
      setQueue((current) => (current.includes(item.id) ? current : [...current, item.id]));
      addLog(
        `VALIDADO: ${item.name} · por ${actor} · origem ${item.source} · conclusão registrada no LABTEST e adicionada à fila da próxima versão.`,
      );
    } else {
      setQueue((current) => current.filter((id) => id !== item.id));
      addLog(`NÃO VALIDADO: ${item.name} · por ${actor} · retorno para TESTE/AJUSTE.`);
    }
  }

  function setValidationDestination(item: LtItem, destination: ValidationDestination) {
    setValidationRecords((current) => {
      const existing = current[item.id];
      if (!existing) return current;
      return { ...current, [item.id]: { ...existing, destination } };
    });
    addLog(`Destino da conclusão de ${item.name}: ${destination}.`);
  }

  function toggleQueue(id: string) {
    setQueue((v) => (v.includes(id) ? v.filter((x) => x !== id) : [...v, id]));
    addLog(
      `${queue.includes(id) ? "Removido da" : "Adicionado à"} fila da próxima versão: ${id} (estado TESTE persistido na candidata — adicionar à fila ≠ promover)`,
    );
  }

  const listFor = (key: string) => {
    const spec = LT_TABS.find((t) => t.key === key);
    if (!spec?.types) return LT_ITEMS;
    return LT_ITEMS.filter((i) => spec.types!.includes(i.type));
  };

  const queueItems = queue
    .map((id) => LT_ITEMS.find((i) => i.id === id))
    .filter((i): i is LtItem => Boolean(i));

  return (
    <AppShell group="labtest">
      <PageHeader
        title="LABTEST — criação, teste, homologação e pré-promoção"
        subtitle="Superfície única do que ainda NÃO foi promovido: aplicativos, módulos, builds, CORE e arquiteturas experimentais, plugins, providers, CALLs, integrações, dados de teste, treinamentos e cenários de eval."
        right={
          <>
            <Badge variant="outline">TESTE · B144</Badge>
            <TruthBadge truth="NOT_CONNECTED" hint="Nenhum runtime de teste conectado" />
            <Button asChild size="sm" variant="outline">
              <Link to="/labtest/next">Próxima Versão</Link>
            </Button>
          </>
        }
      />

      <Panel title="Módulos do LABTEST">
        <p className="text-xs text-muted-foreground">
          Teste³ IA executa testes; Validation Gate decide passagem por evidência. Permanecem
          módulos distintos dentro do LABTEST e nenhum deles promove versão automaticamente.
        </p>
        <div className="mt-3 grid gap-2 md:grid-cols-2">
          {B144_LABTEST_MODULES.map((item) => (
            <div key={item.id} className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="min-w-0 flex-1 text-sm font-medium">{item.name}</span>
                <Badge variant="outline" className="text-[10px]">
                  {item.version}
                </Badge>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{item.software}</p>
              <Button asChild size="sm" variant="outline" className="mt-3">
                <a href={item.route ?? "/owner/products"}>Abrir módulo</a>
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Itens em criação (ideia)" value={String(byStage.get("IDEIA/CRIAÇÃO") ?? 0)} />
        <Kpi label="Em desenvolvimento" value={String(byStage.get("DESENVOLVIMENTO") ?? 0)} />
        <Kpi label="Em teste" value={String(byStage.get("TESTE") ?? 0)} />
        <Kpi label="Em homologação" value={String(byStage.get("HOMOLOGAÇÃO") ?? 0)} />
        <Kpi label="Prontos para gate" value={String(ready.length)} />
        <Kpi label="Bloqueados / com problema" value={String(blocked.length)} />
        <Kpi label="Aguardando próxima versão" value={String(queue.length)} />
        <Kpi
          label="Promovidos"
          value={String(byStage.get("PROMOVIDO") ?? 0)}
          hint="Sem promoção: SALVAR ≠ PROMOVER"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Distribuição por estágio">
          <Bars data={LT_STAGES.map((s) => ({ label: s, value: byStage.get(s) ?? 0 }))} />
        </Panel>
        <Panel title="Distribuição por tipo">
          <Bars data={byType} />
        </Panel>
      </div>

      <Panel title="Critérios de criticidade do ambiente de teste">
        <div className="flex flex-wrap items-end gap-3">
          <div className="w-56">
            <Label htmlFor="lt-threshold" className="text-xs">
              Considerar crítico a partir de N testes pendentes
            </Label>
            <Input
              id="lt-threshold"
              type="number"
              min={1}
              value={criticalPending}
              onChange={(e) => setCriticalPending(Math.max(1, Number(e.target.value) || 1))}
              className="mt-1"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {critical.length} item(ns) atingem o critério. Este limite pertence ao ambiente de
            teste. Dados sintéticos continuam identificados quando forem usados.
          </p>
        </div>
      </Panel>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="flex w-full flex-wrap justify-start gap-1">
          {LT_TABS.map((t) => (
            <TabsTrigger key={t.key} value={t.key}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="overview" className="mt-3 space-y-4">
          <Panel title="Tudo que pode ser testado (visão consolidada)">
            <div className="space-y-2">
              {LT_ITEMS.map((i) => (
                <ItemRow
                  key={i.id}
                  item={i}
                  selected={sheet?.item.id === i.id}
                  onOpen={() => setSheet({ item: i, mode: "ficha" })}
                />
              ))}
            </div>
          </Panel>
          <Panel title="Onde cada teste acontece">
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>
                LABTEST: candidata, ideia, plugin, provider, nova versão — nada promovido ainda.
              </li>
              <li>
                CORE &gt; Testes & Qualidade: o que já está operacional.{" "}
                <Link className="underline" to="/core/tests">
                  abrir
                </Link>
              </li>
              <li>
                Aplicativos aparecem como produto na{" "}
                <Link className="underline" to="/owner/products">
                  Central &gt; Produtos
                </Link>{" "}
                e como binding em{" "}
                <Link className="underline" to="/core/apps">
                  CORE &gt; Apps &amp; Bindings
                </Link>
                .
              </li>
            </ul>
          </Panel>
        </TabsContent>

        <TabsContent value="improve" className="mt-3 space-y-4">
          <Panel title="Pode melhorar">
            <div className="space-y-2">
              {LT_IMPROVE.map((i) => {
                const item = LT_ITEMS.find((x) => x.id === i.itemId);
                return (
                  <div
                    key={i.id}
                    className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {i.id}
                      </Badge>
                      <span className="min-w-0 flex-1">{i.text}</span>
                      {item ? (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => setSheet({ item, mode: "ficha" })}
                        >
                          Abrir {item.id}
                        </Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="opportunities" className="mt-3 space-y-4">
          <Panel title="Oportunidades ligadas ao LABTEST">
            <p className="text-sm text-muted-foreground">
              Oportunidades comerciais e gerenciais continuam em{" "}
              <Link className="underline" to="/owner/opportunities">
                Central &gt; Oportunidades
              </Link>
              . Aqui aparecem apenas os itens testáveis que sustentam uma oportunidade.
            </p>
            <div className="mt-3 space-y-2">
              {LT_ITEMS.filter((i) => i.target).map((i) => (
                <ItemRow
                  key={i.id}
                  item={i}
                  selected={sheet?.item.id === i.id}
                  onOpen={() => setSheet({ item: i, mode: "ficha" })}
                />
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="ideas" className="mt-3 space-y-4">
          <Panel title="Candidatos & ideias (sem promoção)">
            <div className="space-y-2">
              {LT_ITEMS.filter(
                (i) => i.stage === "IDEIA/CRIAÇÃO" || i.stage === "DESENVOLVIMENTO",
              ).map((i) => (
                <ItemRow
                  key={i.id}
                  item={i}
                  selected={sheet?.item.id === i.id}
                  onOpen={() => setSheet({ item: i, mode: "ficha" })}
                />
              ))}
            </div>
          </Panel>
        </TabsContent>

        {LT_TABS.filter((t) => t.types).map((t) => (
          <TabsContent key={t.key} value={t.key} className="mt-3 space-y-4">
            <Panel title={t.label}>
              {listFor(t.key).length ? (
                <div className="space-y-2">
                  {listFor(t.key).map((i) => (
                    <ItemRow
                      key={i.id}
                      item={i}
                      selected={sheet?.item.id === i.id}
                      onOpen={() => setSheet({ item: i, mode: "ficha" })}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Nenhum item nesta categoria.</p>
              )}
            </Panel>
            {t.key === "core" ? (
              <Panel title="SOL × LUA">
                <p className="text-sm text-muted-foreground">
                  CORE Padrão / SOL é a referência corrente e vive no CORE. As arquiteturas acima
                  são estados LUA: hipóteses experimentais, sem promoção. Comparação contra SOL
                  permanece “— / NOT_VERIFIED” enquanto não houver execução.
                </p>
              </Panel>
            ) : null}
            {t.key === "data" ? (
              <Panel title="Bancos de teste disponíveis">
                <p className="text-sm text-muted-foreground">
                  Datasets sintéticos (pessoas, documentos, compras, operações) podem ser
                  selecionados no fluxo “Testar”. Nenhum banco real está conectado.
                </p>
              </Panel>
            ) : null}
          </TabsContent>
        ))}

        <TabsContent value="evidence" className="mt-3 space-y-4">
          <Panel title="Evidências & Validation Gate">
            <NotConnected
              what="Validation Gate executável"
              next="Sem runner e sem repositório de evidências conectado; o gate existe como contrato e ficha."
            />
            <div className="mt-3 space-y-2">
              {LT_ITEMS.map((i) => (
                <div
                  key={i.id}
                  className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-2 text-xs"
                >
                  <Badge variant="outline" className="font-mono text-[10px]">
                    {i.id}
                  </Badge>
                  <span className="min-w-0 flex-1">{i.name}</span>
                  <span className="text-muted-foreground">
                    evidências: {i.evidences.length ? i.evidences.join(", ") : "nenhuma"}
                  </span>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-[10px]",
                      isReady(i)
                        ? "border-success/50 text-success"
                        : "border-warning/50 text-warning",
                    )}
                  >
                    {isReady(i) ? "critérios mínimos ok" : "critérios pendentes"}
                  </Badge>
                </div>
              ))}
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="next" className="mt-3 space-y-4">
          <Panel title={`Próxima versão · alvo ${NEXT_VERSION.target} · ${NEXT_VERSION.planned}`}>
            <div className="space-y-2">
              {queueItems.map((i) => {
                const entry = NEXT_VERSION.entries.find((e) => e.itemId === i.id);
                const ok = isReady(i);
                return (
                  <div
                    key={i.id}
                    className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-sm"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="outline" className="font-mono text-[10px]">
                        {i.id}
                      </Badge>
                      <span className="min-w-0 flex-1 font-medium">{i.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px]",
                          ok ? "border-primary/50 text-primary" : "border-warning/50 text-warning",
                        )}
                      >
                        {ok ? "PRONTO PARA VALIDAR" : "PENDENTE"}
                      </Badge>
                      {validated.includes(i.id) ? (
                        <Badge
                          variant="outline"
                          className="border-success/50 text-[10px] text-success"
                        >
                          VALIDADO PARA FILA
                        </Badge>
                      ) : null}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-[11px]"
                        onClick={() => toggleQueue(i.id)}
                      >
                        Remover da fila
                      </Button>
                    </div>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Entrada: {i.updatedAt} · enviado por {i.owner ?? "não informado"} · origem:{" "}
                      {entry?.origin ?? i.source} · tipo {LT_TYPE_LABEL[i.type]} · testes{" "}
                      {i.testsDone} ok / {i.testsPending} pendentes · evidências{" "}
                      {i.evidences.join(", ") || "nenhuma"}
                    </p>
                    {validationRecords[i.id] ? (
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Decisão: {validationRecords[i.id]!.status} ·{" "}
                        {validationRecords[i.id]!.decidedAt} · por{" "}
                        {validationRecords[i.id]!.decidedBy} · destino{" "}
                        {validationRecords[i.id]!.destination ?? "não definido"}
                      </p>
                    ) : null}
                  </div>
                );
              })}
              {queueItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Fila vazia.</p>
              ) : null}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Adicionar à fila ≠ promover. A promoção depende do Validation Gate com evidência real
              e permanece bloqueada.
            </p>
          </Panel>

          <Panel title="Fora da fila">
            <div className="space-y-2">
              {LT_ITEMS.filter((i) => !queue.includes(i.id)).map((i) => (
                <ItemRow
                  key={i.id}
                  item={i}
                  selected={sheet?.item.id === i.id}
                  onOpen={() => setSheet({ item: i, mode: "ficha" })}
                />
              ))}
            </div>
          </Panel>

          {log.length ? (
            <Panel title="Registro persistido do ambiente de teste">
              <ul className="space-y-1 text-xs text-muted-foreground">
                {log.map((l, idx) => (
                  <li key={idx}>
                    {l.at} — {l.text}
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </TabsContent>
      </Tabs>

      <ContextDetailSheet
        open={Boolean(sheet)}
        onOpenChange={(o) => !o && setSheet(null)}
        title={sheet ? `${sheet.item.id} · ${sheet.item.name}` : ""}
        description={
          sheet
            ? sheet.mode === "testar"
              ? "Workspace de TESTE — estado persistente da candidata; dados sintéticos são identificados separadamente e o runtime externo continua não conectado."
              : `${LT_TYPE_LABEL[sheet.item.type]} · ${sheet.item.family} · estágio ${sheet.item.stage}`
            : ""
        }
      >
        {sheet ? (
          sheet.mode === "ficha" ? (
            <div className="space-y-4 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className={cn("text-[10px]", STAGE_TONE[sheet.item.stage])}
                >
                  {sheet.item.stage}
                </Badge>
                <TruthBadge truth={sheet.item.truth} />
                <Badge variant="outline" className="text-[10px]">
                  versão {sheet.item.version ?? "—"}
                </Badge>
              </div>

              <dl className="grid gap-2 sm:grid-cols-2">
                {[
                  ["Origem / fonte", sheet.item.source],
                  ["Responsável", sheet.item.owner ?? "não definido"],
                  ["Última mudança", sheet.item.updatedAt],
                  ["Alvo de versão", sheet.item.target ?? "sem alvo"],
                  ["Dependências", sheet.item.dependencies.join(", ") || "nenhuma"],
                  ["Consumidores", sheet.item.consumers.join(", ") || "nenhum"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-lg border border-border/50 bg-surface-1/40 p-2">
                    <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">
                      {k}
                    </dt>
                    <dd className="text-xs">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                <p className="text-xs font-medium">Entrada do teste</p>
                <dl className="mt-2 grid gap-2 sm:grid-cols-2">
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">Nome / objeto</dt>
                    <dd className="text-xs">{sheet.item.name}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">Data de entrada</dt>
                    <dd className="text-xs">{sheet.item.updatedAt}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">Enviado por</dt>
                    <dd className="text-xs">{sheet.item.owner ?? "não informado"}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">Origem</dt>
                    <dd className="text-xs">{sheet.item.source}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">Problema</dt>
                    <dd className="text-xs">
                      {sheet.item.blockers.join("; ") || "problema não informado na entrada"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] uppercase text-muted-foreground">Hipótese</dt>
                    <dd className="text-xs">
                      não informada na entrada — registrar antes da conclusão
                    </dd>
                  </div>
                </dl>
                <div className="mt-2">
                  <p className="text-[10px] uppercase text-muted-foreground">
                    Pontos críticos a testar
                  </p>
                  <ul className="mt-1 space-y-1 text-xs">
                    {sheet.item.requiredTests.map((point) => (
                      <li key={point}>· {point}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div>
                <p className="text-xs font-medium">Testes obrigatórios</p>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {sheet.item.requiredTests.map((t) => (
                    <li key={t}>· {t}</li>
                  ))}
                </ul>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  {sheet.item.testsDone} executado(s) / {sheet.item.testsPending} pendente(s)
                </p>
              </div>

              <div>
                <p className="text-xs font-medium">Riscos</p>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {sheet.item.risks.map((t) => (
                    <li key={t}>· {t}</li>
                  ))}
                </ul>
              </div>

              <div>
                <p className="text-xs font-medium">Evidências</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sheet.item.evidences.join(", ") || "nenhuma evidência registrada"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium">Blockers</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {sheet.item.blockers.join("; ") || "nenhum"}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium">Histórico</p>
                <ul className="mt-1 space-y-1 text-xs text-muted-foreground">
                  {sheet.item.history.map((h, i) => (
                    <li key={i}>
                      {h.at} — {h.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setSheet({ item: sheet.item, mode: "testar" })}>
                  Abrir teste · {sheet.item.name}
                </Button>
                <Button size="sm" variant="outline" onClick={() => toggleQueue(sheet.item.id)}>
                  {queue.includes(sheet.item.id)
                    ? "Remover da próxima versão"
                    : "Adicionar à próxima versão"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={!isReady(sheet.item)}
                  onClick={() =>
                    addLog(
                      `Enviado ao Validation Gate no ambiente TESTE: ${sheet.item.id} — aguardando execução/validação com evidência`,
                    )
                  }
                >
                  Enviar ao Validation Gate
                </Button>
                <Button
                  size="sm"
                  variant={validated.includes(sheet.item.id) ? "default" : "outline"}
                  disabled={!isReady(sheet.item)}
                  onClick={() => decideValidation(sheet.item, "VALIDADO")}
                >
                  {validated.includes(sheet.item.id) ? "VALIDADO" : "Validar"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => decideValidation(sheet.item, "NAO_VALIDADO")}
                >
                  Não validar
                </Button>
                <Button size="sm" variant="outline" disabled>
                  Promover — bloqueado por gate
                </Button>
              </div>
              {validationRecords[sheet.item.id] ? (
                <div className="rounded-lg border border-border/60 bg-surface-1/40 p-3">
                  <p className="text-xs font-medium">Conclusão e próximo destino</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {validationRecords[sheet.item.id]!.status} em{" "}
                    {validationRecords[sheet.item.id]!.decidedAt} por{" "}
                    {validationRecords[sheet.item.id]!.decidedBy}. A conclusão fica registrada no
                    LABTEST.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setValidationDestination(sheet.item, "TESTE");
                        setSheet({ item: sheet.item, mode: "testar" });
                      }}
                    >
                      Voltar para Teste / Ajuste
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        to="/owner/plans"
                        onClick={() => setValidationDestination(sheet.item, "PLANO_DE_ACAO")}
                      >
                        Enviar para Plano de Ação
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        to="/owner/plans"
                        onClick={() => setValidationDestination(sheet.item, "MELHORIA")}
                      >
                        Enviar para Melhoria
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link
                        to="/labtest/next"
                        onClick={() =>
                          setValidationDestination(sheet.item, "APROVACAO_PROXIMA_VERSAO")
                        }
                      >
                        Próxima versão / Aprovação
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : null}
              <p className="text-[11px] text-muted-foreground">
                Verde significa VALIDADO. Estar pronto para validar não equivale a validação nem a
                aprovação. SALVAR ≠ PROMOVER.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-sm">
              <NotConnected
                what="Executor externo do teste"
                next="O ambiente TESTE da B144 registra o fluxo e a conclusão. O executor automatizado externo ainda não está conectado; quando houver dado sintético ele é marcado separadamente como sintético."
              />
              <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-xs">
                <p>
                  Alvo: <span className="font-mono">{sheet.item.id}</span> — {sheet.item.name} (
                  {LT_TYPE_LABEL[sheet.item.type]})
                </p>
                <p className="mt-1 text-muted-foreground">
                  Baseline / SOL: CORE Padrão — comparação NOT_VERIFIED.
                </p>
              </div>

              <div>
                <Label htmlFor="lt-scenario" className="text-xs">
                  Ambiente / cenário
                </Label>
                <Input
                  id="lt-scenario"
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <p className="text-xs font-medium">Banco / dataset de teste (sintético)</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(
                    sheet.item.demoDatasets ?? [
                      "Clientes sintéticos",
                      "Pessoas sintéticas",
                      "Documentos sintéticos",
                      "Compras sintéticas",
                      "Operações sintéticas",
                    ]
                  ).map((d) => (
                    <Button
                      key={d}
                      size="sm"
                      variant={dataset === d ? "default" : "outline"}
                      className="h-7 px-2 text-[11px]"
                      onClick={() => setDataset(d)}
                    >
                      {d}
                    </Button>
                  ))}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Persona / cliente sintético e provedor de IA quando aplicável: provider
                  NOT_CONNECTED.
                </p>
              </div>

              <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-xs">
                <p className="font-medium">Critérios e indicadores</p>
                <ul className="mt-1 space-y-1 text-muted-foreground">
                  {sheet.item.requiredTests.map((t) => (
                    <li key={t}>· {t} — resultado: — / NOT_VERIFIED</li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() =>
                    addLog(
                      `Ensaio TESTE registrado para ${sheet.item.id} · cenário “${scenario}” · dataset “${dataset || "não selecionado"}” — runtime externo não conectado`,
                    )
                  }
                >
                  Registrar ensaio de TESTE
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSheet({ item: sheet.item, mode: "ficha" })}
                >
                  Voltar à ficha
                </Button>
              </div>

              {log.length ? (
                <div>
                  <p className="text-xs font-medium">Resultados / logs desta sessão</p>
                  <ul className="mt-1 space-y-1 text-[11px] text-muted-foreground">
                    {log.slice(0, 8).map((l, i) => (
                      <li key={i}>
                        {l.at} — {l.text}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          )
        ) : null}
      </ContextDetailSheet>
    </AppShell>
  );
}
