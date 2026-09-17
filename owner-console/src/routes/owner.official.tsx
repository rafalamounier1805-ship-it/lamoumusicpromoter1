import { createFileRoute } from "@tanstack/react-router";
import { createClient, type Session, type User } from "@supabase/supabase-js";
import { AppWindow, Building2, Boxes, Database, FileText, LogIn, Plug, RefreshCw, ShieldCheck, Users } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/owner/official")({
  head: () => ({ meta: [{ title: "LAMOU IA — Proprietário Oficial" }] }),
  component: OwnerOfficial,
});

const supabase = createClient(
  "https://afzdqrryqsuwpkaiinez.supabase.co",
  "sb_publishable_Qmx6sPa323jSAiMEdCkjvw_Y0MakWka",
  { auth: { persistSession: true, autoRefreshToken: true } },
);

type Row = Record<string, any>;
type State = {
  memberships: Row[]; tenants: Row[]; customers: Row[]; contracts: Row[];
  products: Row[]; documents: Row[]; apps: Row[]; grants: Row[]; bindings: Row[];
  validation: Row[]; coreVersions: Row[]; coreInstances: Row[]; identity: Row[];
  plugins: Row[]; systems: Row[]; deliveries: Row[];
};
const EMPTY: State = { memberships:[],tenants:[],customers:[],contracts:[],products:[],documents:[],apps:[],grants:[],bindings:[],validation:[],coreVersions:[],coreInstances:[],identity:[],plugins:[],systems:[],deliveries:[] };
const TABLES: Array<[keyof State,string,string]> = [
  ["memberships","lamou_memberships","tenant_id,user_id,role,status,created_at,updated_at"],
  ["tenants","lamou_tenants","id,name,status,customer_id,core_instance_code,updated_at"],
  ["customers","lamou_customers","id,customer_code,display_name,status,updated_at"],
  ["contracts","lamou_contracts","id,contract_code,plan_name,status,starts_at,ends_at,updated_at"],
  ["products","lamou_owner_products","id,product_key,name,family,stage,purpose,source_state,updated_at"],
  ["documents","lamou_owner_documents","id,title,state,version,scope,artifact_ref,sha256,source_url,updated_at"],
  ["apps","lamou_apps","id,app_key,name,status,metadata,updated_at"],
  ["grants","lamou_app_grants","id,app_key,app_name,enabled,release_channel,approved_version,status,updated_at"],
  ["bindings","lamou_app_core_bindings","id,core_code,profile,provider,environment,status,evidence,updated_at"],
  ["validation","lamou_validation_evidence","id,evidence_type,subject,state,sha256,created_at"],
  ["coreVersions","lamou_core_version_registry","version_code,scope,state,parent_version_code,artifact_ref,artifact_sha256,production_authorized,created_at,frozen_at"],
  ["coreInstances","lamou_core_instance_registry","id,instance_code,source_version_code,lifecycle_state,updated_at"],
  ["identity","lamou_client_identity_bindings","id,protocol,provider_name,state,updated_at"],
  ["plugins","lamou_client_plugin_choices","id,plugin_key,display_name,category,provider,state,updated_at"],
  ["systems","lamou_client_systems","id,system_key,name,category,vendor,credential_state,status,updated_at"],
  ["deliveries","lamou_delivery_records","id,delivery_id,artifact_name,product,app_key,version,core_version,channel,sha256,status,delivered_at,installed_at,updated_at"],
];

function f(v: unknown) { if (v === null || v === undefined || v === "") return "—"; if (typeof v === "boolean") return v ? "SIM" : "NÃO"; return typeof v === "object" ? JSON.stringify(v) : String(v); }
function dt(v: unknown) { if (!v) return "—"; const d=new Date(String(v)); return Number.isNaN(d.getTime())?String(v):d.toLocaleString("pt-BR"); }
function Pill({children,tone="neutral"}:{children:React.ReactNode;tone?:"ok"|"warn"|"bad"|"neutral"}) { const cls=tone==="ok"?"border-emerald-500/50 text-emerald-400":tone==="warn"?"border-amber-500/50 text-amber-400":tone==="bad"?"border-red-500/50 text-red-400":"border-border text-muted-foreground"; return <Badge variant="outline" className={cls}>{children}</Badge>; }
function Card({label,value,sub,icon:Icon}:{label:string;value:string;sub:string;icon:any}) { return <div className="rounded-xl border border-border/60 bg-card/70 p-4"><div className="flex items-center gap-2 text-xs text-muted-foreground"><Icon className="h-4 w-4"/>{label}</div><div className="mt-2 text-2xl font-semibold">{value}</div><div className="mt-1 text-[11px] text-muted-foreground">{sub}</div></div>; }
function Table({rows,fields}:{rows:Row[];fields:Array<[string,string]>}) { if(!rows.length)return <p className="text-xs text-muted-foreground">Nenhum registro real retornado.</p>; return <div className="overflow-x-auto rounded-lg border border-border/50"><table className="w-full min-w-[720px] text-left text-xs"><thead className="bg-muted/30"><tr>{fields.map(([k,l])=><th key={k} className="px-3 py-2 font-medium text-muted-foreground">{l}</th>)}</tr></thead><tbody>{rows.map((r,i)=><tr key={r.id??r.key??r.app_key??r.version_code??i} className="border-t border-border/40">{fields.map(([k])=><td key={k} className="max-w-[280px] break-words px-3 py-2 align-top">{k.endsWith("_at")?dt(r[k]):f(r[k])}</td>)}</tr>)}</tbody></table></div>; }
function Section({title,children}:{title:string;children:React.ReactNode}) { return <section className="rounded-xl border border-border/60 bg-card/70 p-4"><h2 className="mb-3 text-sm font-semibold">{title}</h2>{children}</section>; }

function OwnerOfficial(){
  const [session,setSession]=useState<Session|null>(null); const [user,setUser]=useState<User|null>(null);
  const [email,setEmail]=useState(""); const [password,setPassword]=useState(""); const [authBusy,setAuthBusy]=useState(false); const [authError,setAuthError]=useState<string|null>(null);
  const [data,setData]=useState<State>(EMPTY); const [loading,setLoading]=useState(false); const [error,setError]=useState<string|null>(null); const [last,setLast]=useState<string|null>(null);

  useEffect(()=>{ void supabase.auth.getSession().then(({data:d})=>{setSession(d.session);setUser(d.session?.user??null);}); const {data:sub}=supabase.auth.onAuthStateChange((_e,s)=>{setSession(s);setUser(s?.user??null);}); return()=>sub.subscription.unsubscribe(); },[]);
  const load=useCallback(async()=>{ if(!session)return; setLoading(true);setError(null); try{ const out=await Promise.all(TABLES.map(async([key,table,select])=>{const q=await (supabase as any).from(table).select(select);if(q.error)throw new Error(`${table}: ${q.error.message}`);return [key,q.data??[]] as const;})); const n={...EMPTY} as State; out.forEach(([k,v])=>{(n as any)[k]=v;});setData(n);setLast(new Date().toLocaleString("pt-BR")); }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setLoading(false);} },[session]);
  useEffect(()=>{if(session)void load();},[session,load]);
  const owner=useMemo(()=>data.memberships.find(m=>m.user_id===user?.id&&m.role==="OWNER"&&m.status==="ACTIVE"),[data.memberships,user?.id]);
  const apps=useMemo(()=>{const m=new Map<string,Row>();for(const a of data.apps){const k=a.app_key||a.name;const p=m.get(k);if(!p||p.status!=="ACTIVE"&&a.status==="ACTIVE")m.set(k,a);}return [...m.values()].sort((a,b)=>String(a.name).localeCompare(String(b.name)));},[data.apps]);
  const activeApps=apps.filter(a=>a.status==="ACTIVE").length; const connectedPlugins=data.plugins.filter(p=>p.state==="CONNECTED").length;

  async function login(){setAuthBusy(true);setAuthError(null);const {error:e}=await supabase.auth.signInWithPassword({email,password});if(e)setAuthError(e.message);setAuthBusy(false);}
  async function recover(){if(!email){setAuthError("Informe o e-mail.");return;}setAuthBusy(true);const {error:e}=await supabase.auth.resetPasswordForEmail(email,{redirectTo:`${window.location.origin}/reset-password`});setAuthBusy(false);setAuthError(e?e.message:"Link de recuperação solicitado.");}

  if(!session||!user)return <div className="min-h-screen bg-background p-4 text-foreground"><div className="mx-auto mt-16 max-w-lg rounded-2xl border border-border/60 bg-card p-6"><div className="flex items-center gap-3"><ShieldCheck className="h-8 w-8 text-primary"/><div><h1 className="text-xl font-semibold">LAMOU IA — Proprietário Oficial</h1><p className="text-xs text-muted-foreground">Autenticação real · Supabase Auth</p></div></div><div className="mt-6 space-y-4"><div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="email"/></div><div><Label htmlFor="password">Senha</Label><Input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></div><div className="flex gap-2"><Button disabled={authBusy||!email||!password} onClick={()=>void login()}><LogIn className="mr-2 h-4 w-4"/>Entrar</Button><Button variant="ghost" disabled={authBusy} onClick={()=>void recover()}>Recuperar acesso</Button></div>{authError?<p className="text-xs text-destructive">{authError}</p>:null}</div></div></div>;

  return <div className="min-h-screen bg-background text-foreground"><header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur"><div className="mx-auto flex max-w-[1500px] items-center gap-3 px-4 py-3"><div className="h-9 w-9 rounded-xl border border-cyan-400/40 bg-cyan-400/10"/><div className="min-w-0 flex-1"><div className="font-semibold">LAMOU IA — Proprietário</div><div className="text-[11px] text-muted-foreground">Superfície oficial · backend real · sem fixtures</div></div><Pill tone={owner?"ok":"bad"}>{owner?"OWNER AUTORIZADO":"ACESSO BLOQUEADO"}</Pill><Pill tone="ok">REAL</Pill><Button size="sm" variant="outline" disabled={loading} onClick={()=>void load()}><RefreshCw className="mr-2 h-4 w-4"/>{loading?"Atualizando…":"Atualizar"}</Button><Button size="sm" variant="ghost" onClick={()=>void supabase.auth.signOut()}>Sair</Button></div></header><main className="mx-auto max-w-[1500px] space-y-5 px-4 py-6">
    <div><h1 className="text-2xl font-semibold md:text-3xl">Proprietário Oficial</h1><p className="mt-1 max-w-4xl text-sm text-muted-foreground">Tudo abaixo é lido do backend autenticado. O que não possui runtime/provider oficial permanece explicitamente NÃO CONECTADO ou no estado registrado.</p></div>
    {error?<div className="rounded-lg border border-red-500/40 bg-red-500/5 p-3 text-xs text-red-400">Falha real de backend: {error}</div>:null}
    {!owner&&!loading?<Section title="Acesso"><div className="flex items-start gap-2"><Pill tone="bad">BLOCKED</Pill><p className="text-sm text-muted-foreground">A conta autenticou, mas não possui membership OWNER ativo visível em <code>lamou_memberships</code>. Nenhum dado gerencial é liberado.</p></div></Section>:null}
    {owner?<><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6"><Card label="Clientes" value={String(data.customers.length)} sub="lamou_customers" icon={Users}/><Card label="Contratos" value={String(data.contracts.length)} sub="lamou_contracts" icon={Building2}/><Card label="Produtos" value={String(data.products.length)} sub="lamou_owner_products" icon={Boxes}/><Card label="Apps ACTIVE" value={`${activeApps}/${apps.length}`} sub="lamou_apps" icon={AppWindow}/><Card label="Documentos" value={String(data.documents.length)} sub="lamou_owner_documents" icon={FileText}/><Card label="Plugins conectados" value={`${connectedPlugins}/${data.plugins.length}`} sub="lamou_client_plugin_choices" icon={Plug}/></div><p className="text-[11px] text-muted-foreground">Última leitura: {last??"carregando…"}</p>
    <Tabs defaultValue="visao" className="space-y-4"><div className="overflow-x-auto"><TabsList className="w-max"><TabsTrigger value="visao">Visão real</TabsTrigger><TabsTrigger value="apps">Aplicativos</TabsTrigger><TabsTrigger value="clientes">Clientes & Contratos</TabsTrigger><TabsTrigger value="docs">Documentos</TabsTrigger><TabsTrigger value="core">CORE</TabsTrigger><TabsTrigger value="integracoes">Integrações</TabsTrigger><TabsTrigger value="validacao">Validação</TabsTrigger></TabsList></div>
      <TabsContent value="visao" className="grid gap-4 lg:grid-cols-2"><Section title="Tenants"><Table rows={data.tenants} fields={[["name","Tenant"],["status","Estado"],["core_instance_code","CORE"],["updated_at","Atualização"]]}/></Section><Section title="Entregas"><Table rows={data.deliveries} fields={[["product","Produto"],["version","Versão"],["channel","Canal"],["status","Estado"],["installed_at","Instalado"]]}/></Section></TabsContent>
      <TabsContent value="apps"><Section title={`Aplicativos registrados (${apps.length})`}><div className="space-y-2">{apps.map(a=>{const g=data.grants.find(x=>x.app_key===a.app_key);const version=a.app_key==="APP-LAMOU-VERSION";return <div key={a.app_key} className="flex flex-col gap-2 rounded-lg border border-border/50 p-3 md:flex-row md:items-center"><div className="min-w-0 flex-1"><div className="font-medium">{a.name}</div><div className="text-[11px] text-muted-foreground">{a.app_key} · {dt(a.updated_at)}</div></div><Pill tone={a.status==="ACTIVE"?"ok":"warn"}>{a.status}</Pill>{g?<Pill tone={g.release_channel==="PRODUCTION"?"ok":"warn"}>{g.release_channel} · {g.status}</Pill>:<Pill>NÃO CONECTADO</Pill>}{version?<Button size="sm" onClick={()=>{window.location.href="lamou-version://open";}}>Abrir LAMOU Version</Button>:a.status==="ACTIVE"?<Pill tone="ok">OPERACIONAL</Pill>:<Pill>NÃO CONECTADO</Pill>}</div>})}</div></Section></TabsContent>
      <TabsContent value="clientes" className="space-y-4"><Section title="Clientes"><Table rows={data.customers} fields={[["customer_code","Código"],["display_name","Cliente"],["status","Estado"],["updated_at","Atualização"]]}/></Section><Section title="Contratos"><Table rows={data.contracts} fields={[["contract_code","Contrato"],["plan_name","Plano"],["status","Estado"],["starts_at","Início"],["ends_at","Fim"]]}/></Section><Section title="CORE por cliente"><Table rows={data.coreInstances} fields={[["instance_code","Instância"],["source_version_code","Versão"],["lifecycle_state","Ciclo"],["updated_at","Atualização"]]}/></Section></TabsContent>
      <TabsContent value="docs"><Section title="Documentos reais"><Table rows={data.documents} fields={[["title","Documento"],["state","Estado"],["version","Versão"],["scope","Escopo"],["sha256","SHA-256"],["updated_at","Atualização"]]}/></Section></TabsContent>
      <TabsContent value="core" className="space-y-4"><Section title="Versões CORE"><Table rows={data.coreVersions} fields={[["version_code","Versão"],["scope","Escopo"],["state","Estado"],["production_authorized","Produção autorizada"],["artifact_sha256","SHA-256"],["frozen_at","Frozen"]]}/></Section><Section title="Bindings App → CORE"><Table rows={data.bindings} fields={[["core_code","CORE"],["profile","Perfil"],["provider","Provider"],["environment","Ambiente"],["status","Estado"],["updated_at","Atualização"]]}/></Section></TabsContent>
      <TabsContent value="integracoes" className="space-y-4"><Section title="Identidade"><Table rows={data.identity} fields={[["protocol","Protocolo"],["provider_name","Provider"],["state","Estado"],["updated_at","Atualização"]]}/></Section><Section title="Plugins"><Table rows={data.plugins} fields={[["display_name","Plugin"],["category","Categoria"],["provider","Provider"],["state","Estado"],["updated_at","Atualização"]]}/></Section><Section title="Sistemas externos"><Table rows={data.systems} fields={[["name","Sistema"],["category","Categoria"],["vendor","Fornecedor"],["credential_state","Credencial"],["status","Estado"],["updated_at","Atualização"]]}/></Section></TabsContent>
      <TabsContent value="validacao"><Section title="Evidências"><Table rows={data.validation} fields={[["evidence_type","Tipo"],["subject","Objeto"],["state","Estado"],["sha256","SHA-256"],["created_at","Criado"]]}/><div className="mt-4 flex flex-wrap gap-2"><Pill tone="ok">DADO REAL</Pill><Pill>NÃO CONECTADO = NÃO CONECTADO</Pill></div></Section></TabsContent>
    </Tabs></>:null}
  </main></div>;
}
