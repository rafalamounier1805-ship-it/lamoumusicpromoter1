import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Activity, CreditCard, Image as ImageIcon, Sun } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { supabase } from "@/integrations/supabase/client";
import { useOwnerAuth } from "@/lib/lamou/owner-auth";
import {
  CORE_AI_MODELS,
  runProviderCheck,
  type ProviderCheckResult,
} from "@/lib/lamou/provider-check.functions";

/** Superfícies técnicas LIGADAS a backend real.
 *  Regras permanentes: nada é simulado; falha aparece como falha;
 *  sem sessão real a superfície fica BLOCKED com caminho de resolução. */

function NeedsSession({ what }: { what: string }) {
  return (
    <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs">
      <p className="font-semibold text-sm">Sessão do proprietário necessária</p>
      <p className="mt-1 text-muted-foreground">
        {what} depende de conta autenticada com RLS por proprietário. Estado: BLOCKED (sem sessão).
      </p>
      <Button asChild size="sm" variant="outline" className="mt-2">
        <Link to="/install/owner">Abrir instalação e entrar</Link>
      </Button>
    </div>
  );
}

interface CheckRow {
  id: string;
  model: string;
  provider: string;
  ok: boolean;
  latency_ms: number | null;
  output_chars: number | null;
  error: string | null;
  created_at: string;
}

interface SlotRow {
  id: string;
  slot: string;
  provider: string;
  model: string;
  role: string;
  state: string;
}

/** Providers & Modelos: chamada real ao provider, latência medida e SOL definido em banco. */
export function ProvidersLivePanel() {
  const { session } = useOwnerAuth();
  const check = useServerFn(runProviderCheck);
  const [model, setModel] = useState<string>(CORE_AI_MODELS[0].id);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<ProviderCheckResult | null>(null);
  const [rows, setRows] = useState<CheckRow[]>([]);
  const [sol, setSol] = useState<SlotRow | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    const [checks, slots] = await Promise.all([
      supabase
        .from("core_provider_checks")
        .select("id, model, provider, ok, latency_ms, output_chars, error, created_at")
        .order("created_at", { ascending: false })
        .limit(10),
      supabase
        .from("core_provider_slots")
        .select("id, slot, provider, model, role, state")
        .eq("slot", "SLOT-AI-MODEL")
        .eq("role", "SOL")
        .maybeSingle(),
    ]);
    setRows((checks.data as CheckRow[] | null) ?? []);
    setSol((slots.data as SlotRow | null) ?? null);
  }, [session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function runCheck() {
    setBusy(true);
    try {
      const result = await check({ data: { model } });
      setLast(result);
      await load();
    } catch (cause) {
      setLast({
        ok: false,
        model,
        provider: "—",
        latencyMs: 0,
        outputChars: 0,
        error: cause instanceof Error ? cause.message : "Falha ao executar o teste.",
        checkedAt: new Date().toISOString(),
      });
    } finally {
      setBusy(false);
    }
  }

  async function promoteToSol() {
    if (!last?.ok || !session) return;
    const payload = {
      owner_id: session.user.id,
      slot: "SLOT-AI-MODEL",
      provider: last.provider,
      model: last.model,
      role: "SOL",
      state: "IMPLEMENTED_VERIFIED",
    };
    if (sol) {
      await supabase.from("core_provider_slots").update(payload).eq("id", sol.id);
    } else {
      await supabase.from("core_provider_slots").insert(payload);
    }
    await load();
  }

  const solChecks = rows.filter((r) => sol && r.model === sol.model && r.ok && r.latency_ms);
  const candChecks = rows.filter((r) => r.model === model && r.ok && r.latency_ms);
  const avg = (list: CheckRow[]) =>
    list.length
      ? Math.round(list.reduce((a, r) => a + (r.latency_ms ?? 0), 0) / list.length)
      : null;
  const solAvg = avg(solChecks);
  const candAvg = avg(candChecks);
  const delta =
    solAvg && candAvg && sol && sol.model !== model
      ? Math.round(((candAvg - solAvg) / solAvg) * 100)
      : null;

  if (!session) return <NeedsSession what="Testar o provider de IA e registrar evidência" />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface-1 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Sun className="h-4 w-4 text-warning" aria-hidden="true" />
          <p className="text-sm font-semibold">SOL — modelo em referência operacional</p>
          <TruthBadge truth={sol ? sol.state : "NOT_CONNECTED"} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {sol
            ? `${sol.model} · ${sol.provider} · latência média medida: ${solAvg ? `${solAvg} ms` : "sem medição"}`
            : "Nenhum modelo definido como referência. Execute um teste real e defina o SOL."}
        </p>
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <div className="space-y-1.5">
          <Label htmlFor="core-model">Modelo candidato</Label>
          <Select value={model} onValueChange={setModel}>
            <SelectTrigger id="core-model">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CORE_AI_MODELS.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.label} — {m.provider}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => void runCheck()} disabled={busy} size="sm">
          <Activity className="h-4 w-4" aria-hidden="true" />
          {busy ? "Testando…" : "Testar conexão real"}
        </Button>
        <Button
          onClick={() => void promoteToSol()}
          disabled={!last?.ok}
          size="sm"
          variant="outline"
        >
          Definir como SOL
        </Button>
      </div>

      {last ? (
        <div
          className={
            last.ok
              ? "rounded-lg border border-success/40 bg-success/10 p-3 text-xs"
              : "rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs"
          }
        >
          <p className="text-sm font-semibold">
            {last.ok ? "Chamada real concluída" : "Chamada real falhou"}
          </p>
          <p className="mt-1 text-muted-foreground">
            {last.model} · {last.provider} · latência medida {last.latencyMs} ms ·{" "}
            {last.ok ? `${last.outputChars} caracteres de resposta` : last.error}
          </p>
        </div>
      ) : null}

      <div className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
        <p className="text-sm font-semibold">Comparação Atual → Novo com dados medidos</p>
        {delta !== null ? (
          <p className="mt-1 text-muted-foreground">
            SOL {sol?.model}: {solAvg} ms · candidato {model}: {candAvg} ms ·{" "}
            <strong>
              {delta > 0 ? `+${delta}% de latência` : `${delta}% de latência`} (medição própria,{" "}
              {solChecks.length + candChecks.length} chamadas)
            </strong>
            . Demais dimensões seguem NOT_VERIFIED.
          </p>
        ) : (
          <p className="mt-1 text-muted-foreground">
            Impacto percentual não verificado: é preciso ao menos uma chamada bem-sucedida do SOL e
            uma do candidato para comparar latência real. Nenhum número é estimado.
          </p>
        )}
        <Button asChild size="sm" variant="outline" className="mt-2">
          <Link to="/labtest">Testar antes no LABTEST</Link>
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Quando</TableHead>
              <TableHead>Modelo</TableHead>
              <TableHead>Resultado</TableHead>
              <TableHead>Latência</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-xs text-muted-foreground">
                  Nenhuma chamada registrada ainda.
                </TableCell>
              </TableRow>
            ) : (
              rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="text-xs">
                    {new Date(r.created_at).toLocaleString("pt-BR")}
                  </TableCell>
                  <TableCell className="text-xs">{r.model}</TableCell>
                  <TableCell className="text-xs">
                    <Badge variant={r.ok ? "secondary" : "destructive"}>
                      {r.ok ? "OK" : (r.error ?? "falha")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs">
                    {r.latency_ms ? `${r.latency_ms} ms` : "—"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

interface PlanRow {
  id: string;
  code: string;
  name: string;
  price_cents: number;
  currency: string;
  cycle: string;
  entitlements: string | null;
  active: boolean;
}

interface ChargeRow {
  id: string;
  client_name: string;
  amount_cents: number;
  status: string;
  due_date: string | null;
  plan_id: string | null;
}

const brl = (cents: number) =>
  (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** Faturamento: planos e cobranças persistidos em banco real com RLS por proprietário.
 *  O gateway de pagamento permanece NOT_CONNECTED — nenhuma cobrança é emitida. */
export function BillingLivePanel() {
  const { session } = useOwnerAuth();
  const [plans, setPlans] = useState<PlanRow[]>([]);
  const [charges, setCharges] = useState<ChargeRow[]>([]);
  const [plan, setPlan] = useState({ code: "", name: "", price: "", cycle: "mensal" });
  const [charge, setCharge] = useState({ client: "", amount: "", due: "", planId: "" });
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    const [p, c] = await Promise.all([
      supabase
        .from("billing_plans")
        .select("id, code, name, price_cents, currency, cycle, entitlements, active")
        .order("created_at"),
      supabase
        .from("billing_charges")
        .select("id, client_name, amount_cents, status, due_date, plan_id")
        .order("created_at", { ascending: false }),
    ]);
    setPlans((p.data as PlanRow[] | null) ?? []);
    setCharges((c.data as ChargeRow[] | null) ?? []);
  }, [session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function savePlan() {
    setError(null);
    if (!plan.code || !plan.name) return setError("Código e nome do plano são obrigatórios.");
    const price = Math.round(Number(plan.price.replace(",", ".")) * 100);
    const { error: err } = await supabase.from("billing_plans").insert({
      code: plan.code,
      name: plan.name,
      price_cents: Number.isFinite(price) ? price : 0,
      cycle: plan.cycle,
    });
    if (err) return setError(err.message);
    setPlan({ code: "", name: "", price: "", cycle: "mensal" });
    await load();
  }

  async function saveCharge() {
    setError(null);
    if (!charge.client) return setError("Informe o cliente da cobrança.");
    const amount = Math.round(Number(charge.amount.replace(",", ".")) * 100);
    const { error: err } = await supabase.from("billing_charges").insert({
      client_name: charge.client,
      amount_cents: Number.isFinite(amount) ? amount : 0,
      due_date: charge.due || null,
      plan_id: charge.planId || null,
      status: "pendente",
    });
    if (err) return setError(err.message);
    setCharge({ client: "", amount: "", due: "", planId: "" });
    await load();
  }

  async function markPaid(id: string) {
    await supabase
      .from("billing_charges")
      .update({ status: "baixa manual", paid_at: new Date().toISOString() })
      .eq("id", id);
    await load();
  }

  async function removePlan(id: string) {
    await supabase.from("billing_plans").delete().eq("id", id);
    await load();
  }

  if (!session) return <NeedsSession what="Cadastro de planos e cobranças" />;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-warning/40 bg-warning/10 p-3 text-xs">
        <p className="text-sm font-semibold">Gateway de pagamento: NOT_CONNECTED</p>
        <p className="mt-1 text-muted-foreground">
          Planos e cobranças ficam registrados em banco real com isolamento por proprietário.
          Emissão de boleto, cartão e conciliação exigem provedor de pagamento conectado — nenhuma
          cobrança é enviada por esta tela. Baixa é manual e fica marcada como tal.
        </p>
      </div>

      {error ? <p className="text-xs text-destructive">{error}</p> : null}

      <div className="rounded-lg border border-border bg-surface-1 p-3">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <CreditCard className="h-4 w-4" aria-hidden="true" /> Planos
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="plan-code">Código</Label>
            <Input
              id="plan-code"
              value={plan.code}
              onChange={(e) => setPlan({ ...plan, code: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-name">Nome</Label>
            <Input
              id="plan-name"
              value={plan.name}
              onChange={(e) => setPlan({ ...plan, name: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-price">Valor (R$)</Label>
            <Input
              id="plan-price"
              value={plan.price}
              onChange={(e) => setPlan({ ...plan, price: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="plan-cycle">Ciclo</Label>
            <Select value={plan.cycle} onValueChange={(v) => setPlan({ ...plan, cycle: v })}>
              <SelectTrigger id="plan-cycle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["mensal", "trimestral", "anual", "único"].map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button size="sm" className="mt-2" onClick={() => void savePlan()}>
          Cadastrar plano
        </Button>

        <div className="mt-3 space-y-2">
          {plans.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhum plano cadastrado.</p>
          ) : (
            plans.map((p) => (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/60 p-2 text-xs"
              >
                <span className="font-medium">{p.name}</span>
                <Badge variant="outline">{p.code}</Badge>
                <span className="text-muted-foreground">
                  {brl(p.price_cents)} · {p.cycle}
                </span>
                <Button
                  size="sm"
                  variant="ghost"
                  className="ml-auto h-7"
                  onClick={() => void removePlan(p.id)}
                >
                  Excluir
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-surface-1 p-3">
        <p className="text-sm font-semibold">Cobranças</p>
        <div className="mt-2 grid gap-2 sm:grid-cols-4">
          <div className="space-y-1.5">
            <Label htmlFor="charge-client">Cliente</Label>
            <Input
              id="charge-client"
              value={charge.client}
              onChange={(e) => setCharge({ ...charge, client: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="charge-amount">Valor (R$)</Label>
            <Input
              id="charge-amount"
              value={charge.amount}
              onChange={(e) => setCharge({ ...charge, amount: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="charge-due">Vencimento</Label>
            <Input
              id="charge-due"
              type="date"
              value={charge.due}
              onChange={(e) => setCharge({ ...charge, due: e.target.value })}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="charge-plan">Plano</Label>
            <Select
              value={charge.planId}
              onValueChange={(v) => setCharge({ ...charge, planId: v })}
              disabled={plans.length === 0}
            >
              <SelectTrigger id="charge-plan">
                <SelectValue placeholder={plans.length ? "Selecionar" : "Cadastre um plano"} />
              </SelectTrigger>
              <SelectContent>
                {plans.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button size="sm" className="mt-2" onClick={() => void saveCharge()}>
          Registrar cobrança
        </Button>

        <div className="mt-3 space-y-2">
          {charges.length === 0 ? (
            <p className="text-xs text-muted-foreground">Nenhuma cobrança registrada.</p>
          ) : (
            charges.map((c) => (
              <div
                key={c.id}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border/60 bg-card/60 p-2 text-xs"
              >
                <span className="font-medium">{c.client_name}</span>
                <span className="text-muted-foreground">{brl(c.amount_cents)}</span>
                <Badge variant="outline">{c.status}</Badge>
                {c.due_date ? (
                  <span className="text-muted-foreground">vence {c.due_date}</span>
                ) : null}
                {c.status === "pendente" ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto h-7"
                    onClick={() => void markPaid(c.id)}
                  >
                    Dar baixa manual
                  </Button>
                ) : null}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/** Armazenamento de imagem real: bucket privado por proprietário. */
export function StorageLivePanel() {
  const { session } = useOwnerAuth();
  const [busy, setBusy] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!session) return;
    const { data } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", session.user.id)
      .maybeSingle();
    const path = (data as { avatar_url: string | null } | null)?.avatar_url;
    if (!path) return;
    const signed = await supabase.storage.from("owner-avatars").createSignedUrl(path, 300);
    setUrl(signed.data?.signedUrl ?? null);
  }, [session]);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload(file: File) {
    if (!session) return;
    setBusy(true);
    setMessage(null);
    const path = `${session.user.id}/avatar-${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
    const up = await supabase.storage.from("owner-avatars").upload(path, file, { upsert: true });
    if (up.error) {
      setMessage(up.error.message);
      setBusy(false);
      return;
    }
    const prof = await supabase
      .from("profiles")
      .update({ avatar_url: path })
      .eq("id", session.user.id);
    if (prof.error) setMessage(prof.error.message);
    else setMessage("Imagem enviada e vinculada ao perfil.");
    await load();
    setBusy(false);
  }

  if (!session) return <NeedsSession what="Envio de imagem para o armazenamento" />;

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <ImageIcon className="h-4 w-4" aria-hidden="true" /> Armazenamento privado do proprietário
        </p>
        <p className="mt-1 text-muted-foreground">
          Bucket privado com acesso restrito à pasta do próprio proprietário. Leitura por link
          assinado temporário; nenhum arquivo fica público.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        {url ? (
          <img
            src={url}
            alt="Imagem do proprietário armazenada"
            className="h-16 w-16 rounded-full border border-border object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-dashed border-border text-[10px] text-muted-foreground">
            sem imagem
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="storage-file">Enviar imagem (até 5 MB)</Label>
          <Input
            id="storage-file"
            type="file"
            accept="image/*"
            disabled={busy}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
            }}
          />
        </div>
      </div>
      {message ? <p className="text-xs text-muted-foreground">{message}</p> : null}
    </div>
  );
}

/** SOL — referência operacional corrente, montada só com o que é medido/real. */
export function SolLivePanel() {
  const { session } = useOwnerAuth();
  const [sol, setSol] = useState<SlotRow | null>(null);
  const [plansCount, setPlansCount] = useState<number | null>(null);

  useEffect(() => {
    if (!session) return;
    void (async () => {
      const slot = await supabase
        .from("core_provider_slots")
        .select("id, slot, provider, model, role, state")
        .eq("role", "SOL")
        .maybeSingle();
      setSol((slot.data as SlotRow | null) ?? null);
      const plans = await supabase
        .from("billing_plans")
        .select("id", { count: "exact", head: true });
      setPlansCount(plans.count ?? 0);
    })();
  }, [session]);

  const items = [
    {
      title: "Ambiente em execução (oficina)",
      value: "Runtime que serve esta interface",
      truth: "IMPLEMENTED_VERIFIED",
      note: "Confirmado por esta sessão de navegação.",
    },
    {
      title: "Modelo de IA em referência",
      value: sol ? `${sol.model} · ${sol.provider}` : "Nenhum definido",
      truth: sol ? sol.state : "NOT_CONNECTED",
      note: sol
        ? "Definido após chamada real bem-sucedida em Providers & Modelos."
        : "Execute o teste real em Providers & Modelos e defina o SOL.",
    },
    {
      title: "Identidade e perfil do proprietário",
      value: session ? "Sessão real com RLS por proprietário" : "Sem sessão",
      truth: session ? "IMPLEMENTED_VERIFIED" : "BLOCKED",
      note: "Perfil gravado e lido na base do proprietário.",
    },
    {
      title: "Planos de faturamento registrados",
      value: plansCount === null ? "—" : `${plansCount} plano(s)`,
      truth: session ? "IMPLEMENTED_VERIFIED" : "BLOCKED",
      note: "Registro real; emissão de cobrança segue NOT_CONNECTED.",
    },
    {
      title: "Produção publicada",
      value: "Não publicada",
      truth: "NOT_CONNECTED",
      note: "A candidata não foi promovida. SALVAR ≠ PROMOVER.",
    },
  ];

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-warning/40 bg-warning/5 p-3 text-xs">
        <p className="flex items-center gap-2 text-sm font-semibold">
          <Sun className="h-4 w-4 text-warning" aria-hidden="true" /> SOL = referência operacional
          corrente
        </p>
        <p className="mt-1 text-muted-foreground">
          LUA (candidatas e experimentos) vive no LABTEST. Nada sai do LABTEST para o SOL sem
          evidência e decisão explícita.
        </p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.title} className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <p className="min-w-0 flex-1 text-sm font-medium">{i.title}</p>
              <TruthBadge truth={i.truth} />
            </div>
            <p className="mt-1 font-medium">{i.value}</p>
            <p className="mt-1 text-muted-foreground">{i.note}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <Link to="/labtest">Abrir LABTEST (LUA)</Link>
        </Button>
        <Button asChild size="sm" variant="outline">
          <Link to="/core/versions">Versões & rollback</Link>
        </Button>
      </div>
    </div>
  );
}

export const LIVE_PANELS = {
  providers: ProvidersLivePanel,
  billing: BillingLivePanel,
  storage: StorageLivePanel,
  sol: SolLivePanel,
} as const;

export type LivePanelId = keyof typeof LIVE_PANELS;

export function LivePanel({ id }: { id: LivePanelId }) {
  const Component = LIVE_PANELS[id];
  return (
    <Panel title="Superfície conectada (dados reais)">
      <Component />
    </Panel>
  );
}
