import { createFileRoute } from "@tanstack/react-router";
import { createClient, type Session, type User } from "@supabase/supabase-js";
import {
  AppWindow,
  Building2,
  Boxes,
  FileText,
  LogIn,
  Plug,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/owner/")({
  head: () => ({ meta: [{ title: "LAMOU IA — Proprietário Oficial" }] }),
  component: OwnerOfficial,
});

const supabase = createClient(
  "https://afzdqrryqsuwpkaiinez.supabase.co",
  "sb_publishable_Qmx6sPa323jSAiMEdCkjvw_Y0MakWka",
  { auth: { persistSession: true, autoRefreshToken: true } },
);

type Row = Record<string, unknown>;
type DataState = {
  memberships: Row[];
  tenants: Row[];
  customers: Row[];
  contracts: Row[];
  products: Row[];
  documents: Row[];
  apps: Row[];
  grants: Row[];
  bindings: Row[];
  validation: Row[];
  coreVersions: Row[];
  coreInstances: Row[];
  identity: Row[];
  plugins: Row[];
  adapters: Row[];
  systems: Row[];
  deliveries: Row[];
};

type SourceKey = keyof DataState;
type SourceSpec = { key: SourceKey; table: string; select: string };
type SourceIssue = { table: string; message: string };

const EMPTY: DataState = {
  memberships: [],
  tenants: [],
  customers: [],
  contracts: [],
  products: [],
  documents: [],
  apps: [],
  grants: [],
  bindings: [],
  validation: [],
  coreVersions: [],
  coreInstances: [],
  identity: [],
  plugins: [],
  adapters: [],
  systems: [],
  deliveries: [],
};

const SOURCES: SourceSpec[] = [
  { key: "memberships", table: "lamou_memberships", select: "tenant_id,user_id,role,status,created_at,updated_at" },
  { key: "tenants", table: "lamou_tenants", select: "id,name,status,customer_id,core_instance_code,updated_at" },
  { key: "customers", table: "lamou_customers", select: "id,customer_code,display_name,status,updated_at" },
  { key: "contracts", table: "lamou_contracts", select: "id,contract_code,plan_name,status,starts_at,ends_at,updated_at" },
  { key: "products", table: "lamou_owner_products", select: "id,product_key,name,family,stage,purpose,source_state,updated_at" },
  { key: "documents", table: "lamou_owner_documents", select: "id,title,state,version,scope,artifact_ref,sha256,source_url,updated_at" },
  { key: "apps", table: "lamou_apps", select: "id,app_key,name,status,metadata,updated_at" },
  { key: "grants", table: "lamou_app_grants", select: "id,app_key,app_name,enabled,release_channel,approved_version,status,updated_at" },
  { key: "bindings", table: "lamou_app_core_bindings", select: "id,app_id,core_code,profile,provider,environment,status,evidence,updated_at" },
  { key: "validation", table: "lamou_validation_evidence", select: "id,evidence_type,subject,state,sha256,created_at" },
  { key: "coreVersions", table: "lamou_core_version_registry", select: "version_code,scope,state,parent_version_code,artifact_ref,artifact_sha256,production_authorized,created_at,frozen_at" },
  { key: "coreInstances", table: "lamou_core_instance_registry", select: "id,instance_code,source_version_code,lifecycle_state,updated_at" },
  { key: "identity", table: "lamou_client_identity_bindings", select: "id,protocol,provider_name,state,updated_at" },
  { key: "plugins", table: "lamou_client_plugin_choices", select: "id,plugin_key,display_name,category,provider,state,updated_at" },
  { key: "adapters", table: "lamou_adapter_registry", select: "id,adapter_key,version,provider,environment,auth_mode,certification,fallback,updated_at" },
  { key: "systems", table: "lamou_client_systems", select: "id,system_key,name,category,vendor,credential_state,status,updated_at" },
  { key: "deliveries", table: "lamou_delivery_records", select: "id,delivery_id,artifact_name,product,app_key,version,core_version,channel,sha256,status,delivered_at,installed_at,updated_at" },
];

function value(row: Row, key: string): unknown {
  return row[key];
}

function text(row: Row, key: string): string {
  const current = value(row, key);
  return current === null || current === undefined ? "" : String(current);
}

function show(current: unknown): string {
  if (current === null || current === undefined || current === "") return "—";
  if (typeof current === "boolean") return current ? "SIM" : "NÃO";
  if (typeof current === "object") return JSON.stringify(current);
  return String(current);
}

function dateTime(current: unknown): string {
  if (!current) return "—";
  const parsed = new Date(String(current));
  return Number.isNaN(parsed.getTime()) ? String(current) : parsed.toLocaleString("pt-BR");
}

function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "ok" | "warn" | "bad" | "neutral" }) {
  const className =
    tone === "ok"
      ? "border-emerald-500/50 text-emerald-400"
      : tone === "warn"
        ? "border-amber-500/50 text-amber-400"
        : tone === "bad"
          ? "border-red-500/50 text-red-400"
          : "border-border text-muted-foreground";
  return <Badge variant="outline" className={className}>{children}</Badge>;
}

function MetricCard({ label, metric, sub, icon: Icon }: { label: string; metric: string; sub: string; icon: typeof Users }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/70 p-4">
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-4 w-4" />{label}</div>
      <div className="mt-2 text-2xl font-semibold">{metric}</div>
      <div className="mt-1 text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function DataTable({ rows, fields }: { rows: Row[]; fields: Array<[string, string]> }) {
  if (!rows.length) return <p className="text-xs text-muted-foreground">Nenhum registro real retornado.</p>;
  return (
    <div className="overflow-x-auto rounded-lg border border-border/50">
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="bg-muted/30"><tr>{fields.map(([key, label]) => <th key={key} className="px-3 py-2 font-medium text-muted-foreground">{label}</th>)}</tr></thead>
        <tbody>
          {rows.map((row, index) => {
            const rowKey = show(value(row, "id") ?? value(row, "app_key") ?? value(row, "version_code") ?? index);
            return <tr key={rowKey} className="border-t border-border/40">{fields.map(([key]) => <td key={key} className="max-w-[300px] break-words px-3 py-2 align-top">{key.endsWith("_at") ? dateTime(value(row, key)) : show(value(row, key))}</td>)}</tr>;
          })}
        </tbody>
      </table>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return <section className="rounded-xl border border-border/60 bg-card/70 p-4"><h2 className="mb-3 text-sm font-semibold">{title}</h2>{children}</section>;
}

function OwnerOfficial() {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authBusy, setAuthBusy] = useState(false);
  const [authMessage, setAuthMessage] = useState<string | null>(null);
  const [data, setData] = useState<DataState>(EMPTY);
  const [issues, setIssues] = useState<SourceIssue[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastRead, setLastRead] = useState<string | null>(null);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data: result }) => {
      setSession(result.session);
      setUser(result.session?.user ?? null);
    });
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next);
      setUser(next?.user ?? null);
    });
    return () => subscription.subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const next: DataState = { ...EMPTY };
    const nextIssues: SourceIssue[] = [];
    for (const source of SOURCES) {
      const result = await (supabase as any).from(source.table).select(source.select);
      if (result.error) {
        nextIssues.push({ table: source.table, message: result.error.message });
        next[source.key] = [];
      } else {
        next[source.key] = (result.data ?? []) as Row[];
      }
    }
    setData(next);
    setIssues(nextIssues);
    setLastRead(new Date().toLocaleString("pt-BR"));
    setLoading(false);
  }, [session]);

  useEffect(() => { if (session) void load(); }, [session, load]);

  const ownerMembership = useMemo(
    () => data.memberships.find((row) => text(row, "user_id") === user?.id && text(row, "role") === "OWNER" && text(row, "status") === "ACTIVE"),
    [data.memberships, user?.id],
  );

  const apps = useMemo(() => {
    const unique = new Map<string, Row>();
    for (const app of data.apps) {
      const key = text(app, "app_key") || text(app, "name");
      const previous = unique.get(key);
      if (!previous || (text(previous, "status") !== "ACTIVE" && text(app, "status") === "ACTIVE")) unique.set(key, app);
    }
    return [...unique.values()].sort((a, b) => text(a, "name").localeCompare(text(b, "name")));
  }, [data.apps]);

  const activeApps = apps.filter((app) => text(app, "status") === "ACTIVE").length;
  const connectedPlugins = data.plugins.filter((plugin) => text(plugin, "state") === "CONNECTED").length;
  const certifiedAdapters = data.adapters.filter((adapter) => text(adapter, "certification") === "CERTIFIED").length;

  async function login() {
    setAuthBusy(true);
    setAuthMessage(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthMessage(error.message);
    setAuthBusy(false);
  }

  async function recover() {
    if (!email) { setAuthMessage("Informe o e-mail."); return; }
    setAuthBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    setAuthBusy(false);
    setAuthMessage(error ? error.message : "Solicitação de recuperação enviada pelo provedor de autenticação.");
  }

  if (!session || !user) {
    return (
      <div className="min-h-screen bg-background p-4 text-foreground">
        <div className="mx-auto mt-16 max-w-lg rounded-2xl border border-border/60 bg-card p-6">
          <div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-primary" /><div><h1 className="text-xl font-semibold">LAMOU IA — Proprietário Oficial</h1><p className="text-xs text-muted-foreground">Autenticação real · LAMOU-IA-CORE</p></div></div>
          <div className="mt-6 space-y-4">
            <div><Label htmlFor="owner-email">E-mail</Label><Input id="owner-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" /></div>
            <div><Label htmlFor="owner-password">Senha</Label><Input id="owner-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /></div>
            <div className="flex flex-wrap gap-2"><Button disabled={authBusy || !email || !password} onClick={() => void login()}><LogIn className="mr-2 h-4 w-4" />Entrar</Button><Button variant="ghost" disabled={authBusy} onClick={() => void recover()}>Recuperar acesso</Button></div>
            {authMessage ? <p className="text-xs text-muted-foreground">{authMessage}</p> : null}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3">
          <div className="h-9 w-9 rounded-xl border border-cyan-400/40 bg-cyan-400/10" />
          <div className="min-w-0 flex-1"><div className="font-semibold">LAMOU IA — Proprietário</div><div className="text-[11px] text-muted-foreground">Oficial · backend real · sem fixtures nesta superfície</div></div>
          <Pill tone={ownerMembership ? "ok" : "bad"}>{ownerMembership ? "OWNER AUTORIZADO" : "ACESSO BLOQUEADO"}</Pill>
          <Pill tone="ok">REAL</Pill>
          <Button size="sm" variant="outline" disabled={loading} onClick={() => void load()}><RefreshCw className="mr-2 h-4 w-4" />{loading ? "Atualizando…" : "Atualizar"}</Button>
          <Button size="sm" variant="ghost" onClick={() => void supabase.auth.signOut()}>Sair</Button>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] space-y-5 px-4 py-6">
        <div><h1 className="text-2xl font-semibold md:text-3xl">Proprietário Oficial</h1><p className="mt-1 max-w-4xl text-sm text-muted-foreground">Os dados abaixo são lidos do backend autenticado. O que não possui runtime, provider ou certificação real mantém o estado registrado ou aparece como NÃO CONECTADO.</p></div>

        {issues.length ? <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-3"><div className="text-xs font-medium text-amber-400">Fontes não acessíveis nesta sessão</div><div className="mt-2 flex flex-wrap gap-2">{issues.map((issue) => <Pill key={issue.table} tone="warn">{issue.table}: NÃO CONECTADO</Pill>)}</div></div> : null}

        {!ownerMembership && !loading ? <Section title="Acesso"><div className="flex items-start gap-2"><Pill tone="bad">BLOCKED</Pill><p className="text-sm text-muted-foreground">A conta autenticou, mas não possui membership OWNER ativo visível em lamou_memberships. Os dados gerenciais ficam bloqueados.</p></div></Section> : null}

        {ownerMembership ? (
          <>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
              <MetricCard label="Clientes" metric={String(data.customers.length)} sub="lamou_customers" icon={Users} />
              <MetricCard label="Contratos" metric={String(data.contracts.length)} sub="lamou_contracts" icon={Building2} />
              <MetricCard label="Produtos" metric={String(data.products.length)} sub="lamou_owner_products" icon={Boxes} />
              <MetricCard label="Apps ACTIVE" metric={`${activeApps}/${apps.length}`} sub="estado real do registry" icon={AppWindow} />
              <MetricCard label="Documentos" metric={String(data.documents.length)} sub="lamou_owner_documents" icon={FileText} />
              <MetricCard label="Plugins conectados" metric={`${connectedPlugins}/${data.plugins.length}`} sub={`${certifiedAdapters}/${data.adapters.length} adapters certificados`} icon={Plug} />
            </div>
            <p className="text-[11px] text-muted-foreground">Última leitura real: {lastRead ?? "carregando…"}</p>

            <Tabs defaultValue="visao" className="space-y-4">
              <div className="overflow-x-auto"><TabsList className="w-max"><TabsTrigger value="visao">Visão real</TabsTrigger><TabsTrigger value="apps">Aplicativos</TabsTrigger><TabsTrigger value="clientes">Clientes & Contratos</TabsTrigger><TabsTrigger value="docs">Documentos</TabsTrigger><TabsTrigger value="core">CORE</TabsTrigger><TabsTrigger value="integracoes">Integrações</TabsTrigger><TabsTrigger value="validacao">Validação</TabsTrigger></TabsList></div>

              <TabsContent value="visao" className="grid gap-4 lg:grid-cols-2">
                <Section title="Tenants"><DataTable rows={data.tenants} fields={[["name", "Tenant"], ["status", "Estado"], ["core_instance_code", "CORE"], ["updated_at", "Atualização"]]} /></Section>
                <Section title="Entregas"><DataTable rows={data.deliveries} fields={[["product", "Produto"], ["version", "Versão"], ["channel", "Canal"], ["status", "Estado"], ["installed_at", "Instalado"]]} /></Section>
              </TabsContent>

              <TabsContent value="apps"><Section title={`Aplicativos registrados (${apps.length})`}><div className="space-y-2">{apps.map((app, index) => {
                const appKey = text(app, "app_key");
                const appStatus = text(app, "status");
                const grant = data.grants.find((item) => text(item, "app_key") === appKey);
                const isVersion = appKey === "APP-LAMOU-VERSION";
                return <div key={appKey || String(index)} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3 md:flex-row md:items-center"><div className="min-w-0 flex-1"><div className="font-medium">{text(app, "name") || "Sem nome"}</div><div className="text-[11px] text-muted-foreground">{appKey || "sem chave"} · {dateTime(value(app, "updated_at"))}</div></div><Pill tone={appStatus === "ACTIVE" ? "ok" : "warn"}>{appStatus || "NOT_VERIFIED"}</Pill>{grant ? <Pill tone={text(grant, "release_channel") === "PRODUCTION" ? "ok" : "warn"}>{text(grant, "release_channel")} · {text(grant, "status")}</Pill> : <Pill>NÃO CONECTADO</Pill>}{isVersion ? <Button size="sm" onClick={() => { window.location.href = "lamou-version://open"; }}>Abrir LAMOU Version</Button> : appStatus === "ACTIVE" ? <Pill tone="ok">OPERACIONAL</Pill> : <Pill>NÃO CONECTADO</Pill>}</div>;
              })}</div></Section></TabsContent>

              <TabsContent value="clientes" className="space-y-4"><Section title="Clientes"><DataTable rows={data.customers} fields={[["customer_code", "Código"], ["display_name", "Cliente"], ["status", "Estado"], ["updated_at", "Atualização"]]} /></Section><Section title="Contratos"><DataTable rows={data.contracts} fields={[["contract_code", "Contrato"], ["plan_name", "Plano"], ["status", "Estado"], ["starts_at", "Início"], ["ends_at", "Fim"]]} /></Section><Section title="CORE por cliente"><DataTable rows={data.coreInstances} fields={[["instance_code", "Instância"], ["source_version_code", "Versão"], ["lifecycle_state", "Ciclo"], ["updated_at", "Atualização"]]} /></Section></TabsContent>

              <TabsContent value="docs"><Section title="Documentos reais"><DataTable rows={data.documents} fields={[["title", "Documento"], ["state", "Estado"], ["version", "Versão"], ["scope", "Escopo"], ["sha256", "SHA-256"], ["updated_at", "Atualização"]]} /></Section></TabsContent>

              <TabsContent value="core" className="space-y-4"><Section title="Versões CORE"><DataTable rows={data.coreVersions} fields={[["version_code", "Versão"], ["scope", "Escopo"], ["state", "Estado"], ["production_authorized", "Produção autorizada"], ["artifact_sha256", "SHA-256"], ["frozen_at", "Frozen"]]} /></Section><Section title="Bindings App → CORE"><DataTable rows={data.bindings} fields={[["core_code", "CORE"], ["profile", "Perfil"], ["provider", "Provider"], ["environment", "Ambiente"], ["status", "Estado"], ["updated_at", "Atualização"]]} /></Section></TabsContent>

              <TabsContent value="integracoes" className="space-y-4"><Section title="Identidade"><DataTable rows={data.identity} fields={[["protocol", "Protocolo"], ["provider_name", "Provider"], ["state", "Estado"], ["updated_at", "Atualização"]]} /></Section><Section title="Plugins"><DataTable rows={data.plugins} fields={[["display_name", "Plugin"], ["category", "Categoria"], ["provider", "Provider"], ["state", "Estado"], ["updated_at", "Atualização"]]} /></Section><Section title="Adapters"><DataTable rows={data.adapters} fields={[["adapter_key", "Adapter"], ["version", "Versão"], ["provider", "Provider"], ["certification", "Certificação"], ["fallback", "Fallback"], ["updated_at", "Atualização"]]} /></Section><Section title="Sistemas externos"><DataTable rows={data.systems} fields={[["name", "Sistema"], ["category", "Categoria"], ["vendor", "Fornecedor"], ["credential_state", "Credencial"], ["status", "Estado"], ["updated_at", "Atualização"]]} /></Section></TabsContent>

              <TabsContent value="validacao"><Section title="Evidências"><DataTable rows={data.validation} fields={[["evidence_type", "Tipo"], ["subject", "Objeto"], ["state", "Estado"], ["sha256", "SHA-256"], ["created_at", "Criado"]]} /><div className="mt-4 flex flex-wrap gap-2"><Pill tone="ok">DADO REAL</Pill><Pill>NÃO CONECTADO = NÃO CONECTADO</Pill></div></Section></TabsContent>
            </Tabs>
          </>
        ) : null}
      </main>
    </div>
  );
}
