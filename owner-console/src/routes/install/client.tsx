import { createFileRoute } from "@tanstack/react-router";
import {
  Accessibility,
  Boxes,
  Building2,
  ClipboardCheck,
  Cpu,
  Database,
  FileSignature,
  FlaskConical,
  Globe,
  Handshake,
  Headphones,
  Info,
  KeyRound,
  Layers,
  Mail,
  Package,
  Plug,
  ScrollText,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import { useState } from "react";

import { TruthBadge } from "@/components/lamou/shell";
import {
  CheckRow,
  CLIENT_INSTALL_KEY,
  InstallJourney,
  type JourneyStep,
  Note,
  ReadinessDonut,
  StepSection,
} from "@/components/lamou/wizard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TruthState } from "@/lib/lamou/council-data";

const VERSION = "CORE CLIENTE (sintetizado) · CANDIDATE_NOT_PROMOTED";

/* ------------------------------------------------------------- 1 pacote/empresa */

function StepPackage() {
  const checks = [
    {
      icon: Package,
      label: "Pacote contratado identificado",
      source: "CLI-CHK-0001 · origem: Central > Clientes (fixture)",
      updatedAt: "nesta sessão",
      truth: "SYNTHETIC_DEMO" as TruthState,
      detail:
        "O pacote vem de dados DEMO do portfólio. Não há contrato real carregado de nenhum sistema comercial.",
    },
    {
      icon: Boxes,
      label: "Capacidade de tenant disponível",
      source: "CLI-CHK-0002 · origem: capacidade do CORE",
      updatedAt: "sem execução",
      truth: "NOT_CONNECTED" as TruthState,
      detail: "Sem backend de provisionamento conectado, a capacidade não pode ser consultada.",
    },
    {
      icon: Building2,
      label: "Empresa do cliente cadastrada",
      source: "CLI-CHK-0003 · origem: cadastro local",
      updatedAt: "nesta sessão",
      truth: "NOT_VERIFIED" as TruthState,
      detail: "Dados informados na próxima etapa; nada é persistido como tenant real por esta jornada.",
    },
    {
      icon: FlaskConical,
      label: "Ambiente de destino definido (TESTE ou OFICIAL)",
      source: "CLI-CHK-0004 · política de provisionamento",
      updatedAt: "documento vivo",
      truth: "DOCUMENTED_ONLY" as TruthState,
      detail:
        "Ambiente TESTE e ambiente OFICIAL são separados por política. A separação real depende de provisionamento e evidência.",
    },
  ];
  return (
    <StepSection
      icon={Package}
      title="Pacote e empresa do cliente"
      description="Pré-requisitos do provisionamento, com ID e origem de cada item. Não existe botão de reverificação sem backend real."
    >
      {checks.map((c) => (
        <CheckRow key={c.label} {...c} />
      ))}
      <Note tone="warning">
        A reverificação automática foi removida: sem backend de provisionamento, atualizar um timer
        não constitui teste. Esta é a jornada do proprietário para provisionar um cliente; ela não é
        a instalação do proprietário e não é o Portal do Cliente.
      </Note>
    </StepSection>
  );
}

/* ------------------------------------------------------------- 2 identidade/tenant */

function StepTenant() {
  const [f, setF] = useState({ company: "", tenant: "", segment: "", contact: "", env: "TESTE" });
  return (
    <div className="space-y-4">
      <StepSection
        icon={Building2}
        title="Identidade do cliente e tenant"
        description="Nome, identificador e contato responsável."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cli-company">
              Empresa do cliente <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cli-company"
              value={f.company}
              onChange={(e) => setF({ ...f, company: e.target.value })}
              placeholder="Razão social ou nome comercial"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cli-tenant">
              Identificador do tenant <span className="text-destructive">*</span>
            </Label>
            <Input
              id="cli-tenant"
              value={f.tenant}
              onChange={(e) => setF({ ...f, tenant: e.target.value })}
              placeholder="ex.: cliente-industrial-01"
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cli-segment">Segmento</Label>
            <Input
              id="cli-segment"
              value={f.segment}
              onChange={(e) => setF({ ...f, segment: e.target.value })}
              placeholder="ex.: indústria, serviços, varejo"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cli-contact">Contato responsável</Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="cli-contact"
                type="email"
                className="pl-9"
                value={f.contact}
                onChange={(e) => setF({ ...f, contact: e.target.value })}
                placeholder="responsavel@cliente.com"
              />
            </div>
          </div>
        </div>
      </StepSection>

      <StepSection
        icon={FlaskConical}
        title="Ambiente: TESTE ou OFICIAL"
        description="A diferença precisa ficar explícita em todas as telas do cliente."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {(
            [
              {
                key: "TESTE",
                title: "TESTE / homologação",
                text: "Dados descartáveis, sem valor contratual. Rótulo visível para o cliente.",
              },
              {
                key: "OFICIAL",
                title: "OFICIAL / produção",
                text: "Exige contrato ativo, testes aprovados e evidência de isolamento.",
              },
            ] as const
          ).map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setF({ ...f, env: o.key })}
              aria-pressed={f.env === o.key}
              className={
                f.env === o.key
                  ? "rounded-lg border border-primary bg-primary/10 p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : "rounded-lg border border-border bg-surface-1 p-3 text-left outline-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              <span className="block text-sm font-medium">{o.title}</span>
              <span className="mt-1 block text-xs text-muted-foreground">{o.text}</span>
            </button>
          ))}
        </div>
        <div className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
          <p className="font-medium">Pré-visualização do tenant</p>
          <p className="mt-1 font-mono text-muted-foreground">
            {(f.tenant || "tenant-nao-definido").toLowerCase()} · {f.env} ·{" "}
            {f.company || "empresa não informada"}
          </p>
        </div>
      </StepSection>
    </div>
  );
}

/* --------------------------------------------------------- 3 segurança e usuários */

function StepAccess() {
  const [rows, setRows] = useState([
    { email: "", role: "Administrador do cliente" },
    { email: "", role: "Operador" },
  ]);
  return (
    <div className="space-y-4">
      <StepSection
        icon={Users}
        title="Usuários e papéis do cliente"
        description="Papéis ficam em tabela própria de roles; o cliente nunca recebe papel de proprietário."
      >
        {rows.map((r, i) => (
          <div
            key={i}
            className="grid gap-2 rounded-lg border border-border bg-surface-1 p-3 sm:grid-cols-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor={`u-${i}`}>E-mail do usuário</Label>
              <Input
                id={`u-${i}`}
                type="email"
                value={r.email}
                onChange={(e) =>
                  setRows((s) => s.map((x, j) => (j === i ? { ...x, email: e.target.value } : x)))
                }
                placeholder="usuario@cliente.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`r-${i}`}>Papel</Label>
              <select
                id={`r-${i}`}
                value={r.role}
                onChange={(e) =>
                  setRows((s) => s.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))
                }
                className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option>Administrador do cliente</option>
                <option>Gestor</option>
                <option>Operador</option>
                <option>Leitor</option>
              </select>
            </div>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setRows((s) => [...s, { email: "", role: "Leitor" }])}
        >
          <UserCog className="mr-1 h-4 w-4" aria-hidden="true" /> Adicionar usuário
        </Button>
        <Note>
          Convites não são enviados: o provisionamento de usuários e o e-mail transacional do
          cliente estão NOT_CONNECTED.
        </Note>
      </StepSection>

      <StepSection
        icon={ShieldCheck}
        title="Segurança e isolamento do tenant"
        description="Isolamento é requisito obrigatório, não fato comprovado."
      >
        <div className="grid gap-2">
          {[
            { label: "MFA obrigatório para administradores do cliente", truth: "DOCUMENTED_ONLY" },
            { label: "Isolamento de dados por tenant (RLS)", truth: "NOT_VERIFIED" },
            { label: "Cliente não acessa o CORE Proprietário", truth: "FACT/EVIDENCED" },
            { label: "Registro de auditoria de acessos do cliente", truth: "NOT_CONNECTED" },
          ].map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-surface-1 p-3 text-sm"
            >
              <span className="min-w-0">{r.label}</span>
              <TruthBadge truth={r.truth} />
            </div>
          ))}
        </div>
      </StepSection>
    </div>
  );
}

/* ------------------------------------------------- 4 contrato/licença/entitlements */

const PLANS = [
  { name: "Essencial", text: "Portal, resultados e documentos.", apps: 2 },
  { name: "Profissional", text: "Aplicativos licenciados e evidências.", apps: 4 },
  { name: "Premium", text: "Portfólio ampliado e integrações.", apps: 7 },
  { name: "Privado", text: "Escopo negociado caso a caso.", apps: 0 },
];

function StepContract() {
  const [plan, setPlan] = useState("Profissional");
  const [ack, setAck] = useState(false);
  return (
    <div className="space-y-4">
      <StepSection
        icon={FileSignature}
        title="Contrato, licença e entitlements"
        description="Nenhum preço, prazo ou cobrança é inventado aqui."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {PLANS.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPlan(p.name)}
              aria-pressed={plan === p.name}
              className={
                plan === p.name
                  ? "rounded-lg border border-primary bg-primary/10 p-3 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : "rounded-lg border border-border bg-surface-1 p-3 text-left outline-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{p.name}</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {p.apps > 0 ? `${p.apps} apps` : "sob medida"}
                </Badge>
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">{p.text}</span>
            </button>
          ))}
        </div>
        <div className="grid gap-2">
          {[
            { label: "Contrato assinado anexado", truth: "NOT_CONNECTED" },
            { label: "Entitlements aplicados ao tenant", truth: "NOT_VERIFIED" },
            { label: "Pagamento / faturamento do cliente", truth: "NOT_CONNECTED" },
            { label: "Vigência e renovação", truth: "DOCUMENTED_ONLY" },
          ].map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-surface-1 p-3 text-sm"
            >
              <span className="min-w-0">{r.label}</span>
              <TruthBadge truth={r.truth} />
            </div>
          ))}
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-surface-1 p-3">
          <Checkbox
            checked={ack}
            onCheckedChange={(v) => setAck(Boolean(v))}
            aria-label="Confirmo que os entitlements refletem o contrato"
            className="mt-0.5"
          />
          <span className="min-w-0 text-xs">
            Confirmo que os entitlements selecionados refletem o contrato do cliente e que nenhuma
            cobrança é processada nesta tela.
          </span>
        </label>
      </StepSection>
    </div>
  );
}

/* ------------------------------------------------------- 5 APIs e configurações */

function StepApis() {
  const [allow, setAllow] = useState<Record<string, boolean>>({
    documentos: true,
    reunioes: false,
    ia: false,
    telemetria: false,
  });
  return (
    <div className="space-y-4">
      <StepSection
        icon={Plug}
        title="APIs permitidas ao cliente"
        description="Somente o que o contrato autoriza. Segredos ficam server-side."
      >
        {(
          [
            { k: "documentos", label: "Documentos e evidências do próprio tenant" },
            { k: "reunioes", label: "Agenda / reuniões" },
            { k: "ia", label: "Provider de IA (uso com quota do cliente)" },
            { k: "telemetria", label: "Telemetria de uso do portal" },
          ] as const
        ).map((o) => (
          <div
            key={o.k}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface-1 p-3"
          >
            <div className="min-w-0">
              <Label htmlFor={`api-${o.k}`} className="text-sm">
                {o.label}
              </Label>
              <p className="text-xs text-muted-foreground">
                Escopo mínimo · timeout 30s · fallback manual · NOT_CONNECTED neste provisionamento
              </p>
            </div>
            <Switch
              id={`api-${o.k}`}
              checked={allow[o.k] ?? false}
              onCheckedChange={(v) => setAllow((s) => ({ ...s, [o.k]: v }))}
              aria-label={o.label}
            />
          </div>
        ))}
      </StepSection>

      <StepSection
        icon={Globe}
        title="Configurações do cliente"
        description="Preferências iniciais do ambiente do tenant."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="cli-lang">Idioma do portal</Label>
            <select
              id="cli-lang"
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>Português (Brasil)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cli-tz">Fuso horário</Label>
            <select
              id="cli-tz"
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option>America/Sao_Paulo (UTC−3)</option>
              <option>UTC</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cli-ret">Retenção de dados</Label>
            <Input id="cli-ret" placeholder="ex.: 12 meses" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="cli-dom">Domínio / subdomínio</Label>
            <Input id="cli-dom" placeholder="cliente.exemplo" className="font-mono" />
          </div>
        </div>
        <Note>
          Preferências permanecem locais nesta jornada: o backend de provisionamento do cliente não
          está conectado.
        </Note>
      </StepSection>
    </div>
  );
}

/* --------------------------------------------- 6 CORE Cliente e apps licenciados */

function StepClientCore() {
  return (
    <div className="space-y-4">
      <StepSection
        icon={Cpu}
        title="CORE Cliente — sintetizado e isolado"
        description="Somente capacidades contratadas; nunca acesso ao CORE Proprietário."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {[
            { label: "Capacidades contratadas", truth: "NOT_VERIFIED" },
            { label: "Bindings do tenant", truth: "NOT_CONNECTED" },
            { label: "Dados isolados por tenant", truth: "NOT_VERIFIED" },
            { label: "Laboratório e governança Owner ocultos", truth: "FACT/EVIDENCED" },
          ].map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-surface-1 p-3 text-sm"
            >
              <span className="min-w-0">{r.label}</span>
              <TruthBadge truth={r.truth} />
            </div>
          ))}
        </div>
      </StepSection>

      <StepSection
        icon={Layers}
        title="Aplicativos licenciados"
        description="Somente aplicativos contratados aparecem no portal do cliente."
      >
        <div className="grid gap-2">
          {[
            { label: "Metration 360", truth: "DOCUMENTED_ONLY" },
            { label: "Diagnóstico 360", truth: "DOCUMENTED_ONLY" },
            { label: "Digital Improvement", truth: "DOCUMENTED_ONLY" },
          ].map((r) => (
            <div
              key={r.label}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-surface-1 p-3 text-sm"
            >
              <span className="min-w-0">{r.label}</span>
              <TruthBadge truth={r.truth} />
            </div>
          ))}
        </div>
        <Note tone="warning">
          O Showroom é um aplicativo comercial/demonstrativo que pode se relacionar a este cliente —
          ele não é o Portal do Cliente. O portal só existe depois da instalação concluída.
        </Note>
      </StepSection>
    </div>
  );
}

/* -------------------------------------------------- 7 testes, evidências, entrega */

interface Row {
  item: string;
  source: string;
  state: string;
  evidence: string;
  blocker: string;
  action: string;
}

const CLIENT_READINESS: Row[] = [
  {
    item: "Acesso do usuário do cliente",
    source: "CLI-TST-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "provisionamento de usuário do tenant ausente",
    action: "Conectar autenticação do tenant",
  },
  {
    item: "Teste negativo de isolamento",
    source: "CLI-TST-02",
    state: "NOT_VERIFIED",
    evidence: "nenhuma",
    blocker: "depende do tenant provisionado",
    action: "Executar acesso cruzado",
  },
  {
    item: "Políticas RLS do tenant",
    source: "CLI-TST-03",
    state: "NOT_VERIFIED",
    evidence: "nenhuma",
    blocker: "sem tenant real provisionado",
    action: "Escrever e testar políticas",
  },
  {
    item: "Backup do tenant",
    source: "CLI-TST-04",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "storage do tenant ausente",
    action: "Definir rotina",
  },
  {
    item: "Recuperação / restore",
    source: "CLI-TST-05",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "depende de backup",
    action: "Testar restauração",
  },
  {
    item: "Entitlements aplicados",
    source: "CLI-TST-06",
    state: "NOT_VERIFIED",
    evidence: "seleção local",
    blocker: "sem persistência no tenant",
    action: "Validar após provisionar",
  },
  {
    item: "Separação TESTE × OFICIAL",
    source: "CLI-TST-07",
    state: "DOCUMENTED_ONLY",
    evidence: "política escrita",
    blocker: "sem ambientes reais",
    action: "Provisionar ambientes",
  },
  {
    item: "Homologação com o cliente",
    source: "CLI-TST-08",
    state: "NOT_VERIFIED",
    evidence: "nenhuma",
    blocker: "aguarda testes acima",
    action: "Agendar homologação",
  },
];

function StepClientTests() {
  return (
    <StepSection
      icon={ClipboardCheck}
      title="Testes, evidências e entrega"
      description="Ativação do cliente exige acesso, isolamento, backup e recuperação aprovados."
    >
      <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[160px]">Item</TableHead>
              <TableHead className="min-w-[120px]">Fonte / ID</TableHead>
              <TableHead className="min-w-[130px]">Estado</TableHead>
              <TableHead className="min-w-[140px]">Evidência</TableHead>
              <TableHead className="min-w-[150px]">Bloqueador</TableHead>
              <TableHead className="min-w-[160px]">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CLIENT_READINESS.map((r) => (
              <TableRow key={r.item}>
                <TableCell className="text-sm font-medium">{r.item}</TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {r.source}
                </TableCell>
                <TableCell className="font-mono text-[11px] text-muted-foreground">
                  {r.state}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.evidence}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{r.blocker}</TableCell>
                <TableCell className="text-xs">{r.action}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Note tone="blocked">
        Entrega e ativação bloqueadas: nenhum teste foi executado e o ambiente do cliente não está
        provisionado.
      </Note>
    </StepSection>
  );
}

function ClientAside() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <ReadinessDonut
          percent={0}
          label="Prontidão do cliente"
          sub="0 de 8 itens com evidência."
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">Estado pós-instalação</h3>
        <dl className="mt-3 space-y-2 text-xs">
          <div className="flex items-center justify-between gap-2">
            <dt>Ativação</dt>
            <dd><TruthBadge truth="BLOCKED" /></dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt>Provisionamento backend</dt>
            <dd><TruthBadge truth="NOT_CONNECTED" /></dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt>Isolamento / RLS</dt>
            <dd><TruthBadge truth="NOT_VERIFIED" /></dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt>Portal do Cliente</dt>
            <dd><TruthBadge truth="NOT_CONNECTED" /></dd>
          </div>
        </dl>
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">Depois da ativação</h3>
        <ul className="mt-3 space-y-2 text-xs text-muted-foreground">
          <li className="flex items-start gap-2">
            <Handshake className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>O cliente entra pelo Portal LAMOU IA Cliente, não por esta jornada.</span>
          </li>
          <li className="flex items-start gap-2">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>O Showroom continua sendo aplicativo comercial, não portal.</span>
          </li>
          <li className="flex items-start gap-2">
            <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>O CORE Proprietário permanece inacessível ao cliente.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ rota */

const STEPS: JourneyStep[] = [
  {
    key: "package",
    title: "Pacote e empresa",
    short: "Pacote",
    icon: Package,
    description: "Pacote contratado, capacidade de tenant e ambiente de destino.",
    content: <StepPackage />,
  },
  {
    key: "tenant",
    title: "Identidade e tenant",
    short: "Tenant",
    icon: Building2,
    description: "Empresa, identificador do tenant, contato e ambiente TESTE ou OFICIAL.",
    content: <StepTenant />,
  },
  {
    key: "access",
    title: "Segurança, usuários e papéis",
    short: "Acessos",
    icon: ShieldCheck,
    description: "Usuários do cliente, papéis, MFA e isolamento do tenant.",
    content: <StepAccess />,
  },
  {
    key: "contract",
    title: "Contrato, licença e entitlements",
    short: "Contrato",
    icon: FileSignature,
    description: "Plano, licenças, entitlements e faturamento quando aplicável.",
    content: <StepContract />,
  },
  {
    key: "apis",
    title: "APIs permitidas e configurações",
    short: "APIs",
    icon: Plug,
    description: "Integrações autorizadas, escopos, idioma, fuso, retenção e domínio.",
    content: <StepApis />,
  },
  {
    key: "core",
    title: "CORE Cliente e aplicativos",
    short: "CORE Cliente",
    icon: Cpu,
    description: "CORE sintetizado e isolado, com apenas os aplicativos licenciados.",
    content: <StepClientCore />,
  },
  {
    key: "tests",
    title: "Testes, evidências e entrega",
    short: "Entrega",
    icon: Database,
    description: "Acesso, isolamento, RLS, backup, recuperação, homologação e ativação.",
    content: <StepClientTests />,
    aside: <ClientAside />,
  },
];

export const Route = createFileRoute("/install/client")({
  head: () => ({
    meta: [
      { title: "Provisionamento de Cliente — LAMOU IA" },
      {
        name: "description",
        content:
          "Jornada do proprietário para provisionar um cliente: pacote, tenant, acessos, contrato, APIs, CORE Cliente e entrega com evidências.",
      },
      { property: "og:title", content: "Provisionamento de Cliente — LAMOU IA" },
      {
        property: "og:description",
        content:
          "Sete etapas de provisionamento de cliente, com isolamento de tenant como requisito verificável.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <InstallJourney
      kind="client"
      title="Instalação / Provisionamento do Cliente"
      subtitle="Disparado pela Central > Clientes · não é o Portal do Cliente"
      version={VERSION}
      steps={STEPS}
      storageKey={CLIENT_INSTALL_KEY}
      themeKey="lamou.install.client.theme"
      finishTo="/owner/clients"
      finishLabel="Voltar para Clientes"
      finishDisabledReason="Ativação bloqueada: ambiente do cliente não provisionado, isolamento não verificado e sem evidência de teste."
      launcher={{
        kicker: "Proprietário · provisionamento de cliente",
        headline: "Vamos preparar o ambiente deste cliente.",
        lead: "Jornada própria do cliente: pacote, tenant, acessos, contrato e entitlements, APIs, CORE Cliente isolado e testes de entrega. O cliente nunca acessa o CORE Proprietário.",
        version: VERSION,
        bullets: [
          {
            icon: ScrollText,
            title: "Contrato primeiro",
            text: "Entitlements e aplicativos licenciados definem o que o cliente verá no portal.",
          },
          {
            icon: ShieldCheck,
            title: "Isolamento obrigatório",
            text: "Cada tenant vê apenas os próprios dados, usuários e evidências.",
          },
          {
            icon: FlaskConical,
            title: "TESTE ou OFICIAL",
            text: "Ambientes separados e rotulados; nada de teste vira produção sem homologação.",
          },
          {
            icon: Accessibility,
            title: "Acessível e em PT-BR",
            text: "Teclado, foco visível, contraste e leitura clara em todas as etapas.",
          },
        ],
        asideTitle: "Resumo do provisionamento",
        aside: [
          { label: "Tempo aproximado", value: "10 a 15 minutos" },
          {
            label: "O que será feito agora",
            value: "Pacote, tenant, acessos, contrato, APIs, CORE Cliente e testes",
          },
          {
            label: "O que pode ficar para depois",
            value: "Integrações opcionais, domínio próprio e apps adicionais",
            truth: "NOT_APPLICABLE",
          },
          {
            label: "Origem desta jornada",
            value: "Central > Clientes (não fica na página inicial)",
            truth: "FACT/EVIDENCED",
          },
          {
            label: "Portal do Cliente",
            value: "Só existe depois da instalação; Showroom é outro produto",
            truth: "DOCUMENTED_ONLY",
          },
          {
            label: "Estado desta jornada",
            value: "Interface real, provisionamento ainda não conectado",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
        ],
        startLabel: "Iniciar provisionamento",
        footNote:
          "Dados informados aqui ficam apenas neste navegador. Nenhum ambiente, usuário, cobrança ou integração é criado enquanto o backend de provisionamento estiver NOT_CONNECTED.",
      }}
    />
  ),
});
