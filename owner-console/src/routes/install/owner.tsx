import { createFileRoute } from "@tanstack/react-router";

import {
  Accessibility,
  BadgeCheck,
  Bell,
  Boxes,
  Building2,
  Camera,
  ClipboardCheck,
  Cpu,
  Database,
  Eye,
  EyeOff,
  Fingerprint,
  Gauge,
  Globe,
  HardDrive,
  Headphones,
  Info,
  KeyRound,
  Languages,
  Link2,
  Mail,
  Moon,
  Network,
  Phone,
  Plug,
  RefreshCw,
  ScrollText,
  ShieldCheck,
  Siren,
  Sparkles,
  SquareStack,
  Timer,
  Tv,
  User,
  UserCheck,
  Wifi,
  Workflow,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  OwnerAccountPanel,
  OwnerMfaPanel,
  OwnerProfilePanel,
} from "@/components/lamou/owner-auth-panel";
import { TruthBadge } from "@/components/lamou/shell";
import { SubstitutionImpactPreview } from "@/components/lamou/substitution-impact";
import {
  CheckRow,
  InstallJourney,
  type JourneyStep,
  Note,
  OWNER_INSTALL_KEY,
  ReadinessDonut,
  StatusActionLink,
  StepSection,
} from "@/components/lamou/wizard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TruthState } from "@/lib/lamou/council-data";

const VERSION = "CORE SOL v0.2 · CANDIDATE_NOT_PROMOTED";

function InfoTip({ label, text }: { label: string; text: string }) {
  return (
    <TooltipProvider delayDuration={180}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-label={`Informações sobre ${label}`}
            className="grid h-7 w-7 shrink-0 place-items-center rounded-md text-muted-foreground outline-none hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Info className="h-4 w-4" aria-hidden="true" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="left" className="max-w-64">
          {text}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

type InstallDestination = Parameters<typeof StatusActionLink>[0]["to"];

function ActionableStatus({
  icon: Icon,
  title,
  source,
  truth,
  definition,
  impact,
  owner,
  updatedAt,
  nextStep,
  destination,
  actionLabel = "Configurar",
  disabledReason,
}: {
  icon: typeof Info;
  title: string;
  source: string;
  truth: TruthState | string;
  definition: string;
  impact: string;
  owner: string;
  updatedAt: string;
  nextStep: string;
  destination?: InstallDestination | undefined;
  actionLabel?: string;
  disabledReason?: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="relative rounded-lg border border-border bg-surface-1 p-3 pr-11 transition-colors hover:border-primary/40 focus-within:border-primary/50">
      <div className="absolute right-2 top-2">
        <InfoTip label={title} text={`${definition} Fonte: ${source}.`} />
      </div>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="flex min-w-0 items-center gap-2">
          <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          <div className="min-w-0">
            <h4 className="truncate text-sm font-medium">{title}</h4>
            <p className="truncate font-mono text-[10px] text-muted-foreground">{source}</p>
          </div>
        </div>
        <TruthBadge truth={truth} />
      </button>
      {open ? (
        <div className="mt-3 space-y-3 rounded-md border border-border bg-surface-2 p-3 text-xs">
          <p className="text-muted-foreground">{definition}</p>
          <dl className="grid gap-2 sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">Estado</dt>
              <dd className="mt-0.5">
                <TruthBadge truth={truth} />
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Origem</dt>
              <dd className="mt-0.5 font-mono">{source}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Impacto</dt>
              <dd className="mt-0.5">{impact}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Responsável</dt>
              <dd className="mt-0.5">{owner}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Última verificação</dt>
              <dd className="mt-0.5">{updatedAt}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Próximo passo</dt>
              <dd className="mt-0.5">{nextStep}</dd>
            </div>
          </dl>
          {destination ? (
            <StatusActionLink to={destination}>{actionLabel}</StatusActionLink>
          ) : (
            <div className="space-y-1.5">
              <Button variant="outline" size="sm" disabled>
                Superfície ainda não conectada
              </Button>
              <p className="text-muted-foreground">
                {disabledReason ?? "Não existe destino executável nesta candidata."}
              </p>
            </div>
          )}
        </div>
      ) : null}
    </article>
  );
}

/* --------------------------------------------------------------- 1 verificação */

const CHECKS: {
  icon: typeof Wifi;
  label: string;
  source: string;
  updatedAt: string;
  truth: TruthState | string;
  detail: string;
}[] = [
  {
    icon: BadgeCheck,
    label: "Integridade do pacote",
    source: "CHK-0001 · origem: build local do preview",
    updatedAt: "nesta sessão",
    truth: "NOT_VERIFIED",
    detail:
      "Não há verificação de hash/manifesto executada. O pacote é o build de interface servido pelo preview; nenhuma assinatura foi conferida.",
  },
  {
    icon: Wifi,
    label: "Conectividade com a plataforma",
    source: "CHK-0002 · origem: navegador (fetch da própria origem)",
    updatedAt: "nesta sessão",
    truth: "PARTIAL",
    detail:
      "A interface carregou a partir da própria origem, o que comprova conectividade com o preview. Não há teste de conectividade com serviços externos.",
  },
  {
    icon: Cpu,
    label: "Requisitos do sistema",
    source: "CHK-0003 · origem: heurística de interface",
    updatedAt: "nesta sessão",
    truth: "NOT_VERIFIED",
    detail:
      "Nenhuma coleta de CPU, memória, versão de navegador ou sistema operacional foi executada. Requisito documentado, não medido.",
  },
  {
    icon: KeyRound,
    label: "Permissões iniciais",
    source: "CHK-0004 · origem: política declarada do proprietário",
    updatedAt: "documento vivo",
    truth: "DOCUMENTED_ONLY",
    detail:
      "As permissões do proprietário estão descritas na governança, mas não existe provedor de identidade conectado para concedê-las de fato.",
  },
  {
    icon: Fingerprint,
    label: "Validação da assinatura digital",
    source: "CHK-0005 · origem: cadeia de assinatura do pacote",
    updatedAt: "sem execução",
    truth: "NOT_CONNECTED",
    detail:
      "Não existe serviço de assinatura/verificação conectado. Este item permanece bloqueador para ativação real.",
  },
  {
    icon: Plug,
    label: "Compatibilidade de serviços",
    source: "CHK-0006 · origem: catálogo de providers do CORE",
    updatedAt: "sem execução",
    truth: "NOT_CONNECTED",
    detail:
      "Banco, autenticação, provider de IA, storage e observabilidade não estão conectados; a compatibilidade não pode ser afirmada.",
  },
];

function StepVerify() {
  const [reloading, setReloading] = useState(false);
  const [lastLocalCheck, setLastLocalCheck] = useState("nesta sessão");
  return (
    <div className="space-y-4">
      <StepSection
        icon={ClipboardCheck}
        title="Checagens de pré-instalação"
        description="Cada item mostra ID, origem, estado e última atualização. Nenhum PASS é declarado sem execução real."
        action={
          <Button
            variant="outline"
            size="sm"
            disabled={reloading}
            onClick={() => {
              setReloading(true);
              window.fetch(window.location.origin, { method: "HEAD" }).finally(() => {
                setLastLocalCheck(new Date().toLocaleTimeString("pt-BR"));
                setReloading(false);
              });
            }}
            aria-label="Reexecutar checagens disponíveis"
          >
            <RefreshCw
              className={reloading ? "mr-1 h-4 w-4 animate-spin" : "mr-1 h-4 w-4"}
              aria-hidden="true"
            />
            {reloading ? "Verificando…" : "Reverificar"}
          </Button>
        }
      >
        {CHECKS.map((c) => (
          <CheckRow
            key={c.label}
            {...c}
            updatedAt={c.label === "Conectividade com a plataforma" ? lastLocalCheck : c.updatedAt}
            owner={
              c.truth === "NOT_CONNECTED"
                ? "Configuração técnica do CORE"
                : "Instalação do proprietário"
            }
            nextStep={
              c.label === "Permissões iniciais"
                ? "Revisar papéis e acessos na área de Segurança."
                : c.truth === "NOT_CONNECTED"
                  ? "Conectar o serviço técnico responsável antes da ativação."
                  : "Anexar evidência verificável na área de Testes do CORE."
            }
            action={
              c.label === "Permissões iniciais" ? (
                <StatusActionLink to="/owner/security">Configurar permissões</StatusActionLink>
              ) : c.label === "Conectividade com a plataforma" ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLastLocalCheck(new Date().toLocaleTimeString("pt-BR"))}
                >
                  Reverificar origem local
                </Button>
              ) : c.truth === "NOT_CONNECTED" ? (
                <StatusActionLink to="/owner/settings">Configurar</StatusActionLink>
              ) : (
                <StatusActionLink to="/core/tests">Rever teste</StatusActionLink>
              )
            }
          />
        ))}
        <Note tone="warning">
          Sem serviço de assinatura e sem serviços de plataforma conectados, esta etapa não pode
          resultar em aprovação. Os estados acima são reais para este build.
        </Note>
      </StepSection>
    </div>
  );
}

/* ------------------------------------------------------------------ 2 identidade */

function StepIdentity() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    org: "",
    phone: "",
    role: "",
    ownerIsResponsible: true,
    responsibleName: "",
    responsibleEmail: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const required = ["name", "email", "org", "phone", "role"] as const;
  const filled = required.filter((k) => form[k].trim().length > 0).length;

  useEffect(
    () => () => {
      if (avatarUrl) URL.revokeObjectURL(avatarUrl);
    },
    [avatarUrl],
  );

  return (
    <div className="space-y-4">
      <OwnerProfilePanel />
      <StepSection
        icon={User}
        title="Essencial agora"
        description="Dados mínimos do proprietário para identificar o ambiente."
        action={
          <Badge variant="outline" className="font-mono text-[10px]">
            {filled}/5 obrigatórios
          </Badge>
        }
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="own-name">
              Nome completo <span className="text-destructive">*</span>
            </Label>
            <Input
              id="own-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex.: Rafael Lamounier"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="own-email">
              E-mail <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="own-email"
                type="email"
                className="pl-9"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="proprietario@empresa.com"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="own-org">
              Empresa / organização <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Building2
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="own-org"
                className="pl-9"
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
                placeholder="Nome da organização"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="own-phone">
              Telefone <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <Input
                id="own-phone"
                className="pl-9"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+55 (00) 00000-0000"
              />
            </div>
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="own-role">
              Cargo / função <span className="text-destructive">*</span>
            </Label>
            <Input
              id="own-role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              placeholder="Ex.: Proprietário do ecossistema"
            />
          </div>
        </div>
      </StepSection>

      <StepSection
        icon={UserCheck}
        title="Responsável principal"
        description="Define quem responde pelo ambiente após a instalação."
      >
        <label className="flex items-center gap-3 rounded-lg border border-border bg-surface-1 p-3">
          <Checkbox
            checked={form.ownerIsResponsible}
            onCheckedChange={(value) => setForm({ ...form, ownerIsResponsible: Boolean(value) })}
            aria-label="Sou o responsável principal pelo ambiente"
          />
          <span className="text-sm font-medium">Sou o responsável principal pelo ambiente</span>
        </label>
        {!form.ownerIsResponsible ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="responsible-name">
                Nome do responsável <span className="text-destructive">*</span>
              </Label>
              <Input
                id="responsible-name"
                value={form.responsibleName}
                onChange={(e) => setForm({ ...form, responsibleName: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="responsible-email">
                E-mail do responsável <span className="text-destructive">*</span>
              </Label>
              <Input
                id="responsible-email"
                type="email"
                value={form.responsibleEmail}
                onChange={(e) => setForm({ ...form, responsibleEmail: e.target.value })}
              />
            </div>
          </div>
        ) : null}
      </StepSection>

      <StepSection
        icon={Camera}
        title="Foto e pré-visualização"
        description="Foto opcional; outros dados do perfil ficam para Configurações."
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="space-y-1.5">
            <Label htmlFor="own-photo">Foto de perfil (opcional)</Label>
            <Input
              id="own-photo"
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;
                if (avatarUrl) URL.revokeObjectURL(avatarUrl);
                setAvatarUrl(URL.createObjectURL(file));
              }}
              aria-describedby="photo-h"
            />
            <p id="photo-h" className="text-xs text-muted-foreground">
              Preview local; a persistência depende do storage, hoje NOT_CONNECTED.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-surface-1 p-3">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Pré-visualização do perfil
            </p>
            <div className="mt-2 flex min-w-0 items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Preview do avatar escolhido"
                  className="h-12 w-12 shrink-0 rounded-full object-cover"
                />
              ) : (
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/12 text-primary">
                  <User className="h-5 w-5" aria-hidden="true" />
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">
                  {form.name.trim() || "Nome do proprietário"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {[form.role.trim(), form.org.trim()].filter(Boolean).join(" · ") ||
                    "Cargo · Organização"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {form.email.trim() || "e-mail não informado"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Responsável:{" "}
                  {form.ownerIsResponsible
                    ? form.name.trim() || "o proprietário"
                    : form.responsibleName.trim() || "não informado"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Note>
          Os dados ficam apenas nesta tela: não há banco conectado para persistir identidade
          (NOT_CONNECTED).
        </Note>
      </StepSection>
    </div>
  );
}

/* ------------------------------------------------------------------- 3 segurança */

const PASSWORD_RULES = [
  { label: "Mínimo de 12 caracteres", test: (v: string) => v.length >= 12 },
  { label: "Ao menos uma letra maiúscula", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Ao menos um número", test: (v: string) => /\d/.test(v) },
  { label: "Ao menos um símbolo", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const PERMISSIONS = [
  {
    label: "Gestão total do ecossistema",
    purpose: "Criar, editar e arquivar clientes, aplicativos e planos.",
    impact: "Alto — altera o portfólio inteiro.",
    source: "SEC-PERM-01 · política de papéis",
  },
  {
    label: "Promoção de versões",
    purpose: "Promover candidata para referência corrente (SOL).",
    impact: "Crítico — exige dupla autorização e evidência.",
    source: "SEC-PERM-02 · gate de versões",
  },
  {
    label: "Acesso a segredos server-side",
    purpose: "Configurar providers sem expor chaves na interface.",
    impact: "Crítico — nunca no navegador.",
    source: "SEC-PERM-03 · configuração server-side",
  },
];

function StepSecurity() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [mfa, setMfa] = useState<"app" | "sms" | "email" | null>("app");
  const [dual, setDual] = useState(true);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryPhone, setRecoveryPhone] = useState("");
  const [sessionHours, setSessionHours] = useState("8");
  const match = pwd.length > 0 && pwd === confirm;
  const strength = PASSWORD_RULES.filter((rule) => rule.test(pwd)).length;

  return (
    <div className="space-y-4">
      <OwnerAccountPanel />
      <OwnerMfaPanel />
      <StepSection
        icon={KeyRound}
        title="Critérios de senha"
        description="Conferência local dos critérios antes de criar a credencial real acima."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="pwd">Senha</Label>
            <div className="relative">
              <Input
                id="pwd"
                type={show ? "text" : "password"}
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
                autoComplete="new-password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
              >
                {show ? (
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pwd2">Confirmar senha</Label>
            <Input
              id="pwd2"
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              autoComplete="new-password"
            />
            {confirm.length > 0 ? (
              <p className={match ? "text-xs text-success" : "text-xs text-destructive"}>
                {match ? "As senhas conferem." : "As senhas não conferem."}
              </p>
            ) : null}
          </div>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {PASSWORD_RULES.map((r) => {
            const ok = r.test(pwd);
            return (
              <li
                key={r.label}
                className={
                  ok
                    ? "flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-2 text-xs"
                    : "flex items-center gap-2 rounded-lg border border-border bg-surface-1 p-2 text-xs text-muted-foreground"
                }
              >
                <ShieldCheck
                  className={ok ? "h-3.5 w-3.5 shrink-0 text-success" : "h-3.5 w-3.5 shrink-0"}
                  aria-hidden="true"
                />
                {r.label}
              </li>
            );
          })}
        </ul>
        <div className="space-y-1.5" aria-live="polite">
          <div
            className="grid grid-cols-4 gap-1"
            aria-label={`Força da senha: ${strength} de 4 regras`}
          >
            {PASSWORD_RULES.map((rule, index) => (
              <span
                key={rule.label}
                className={
                  index < strength
                    ? "h-1.5 rounded-full bg-primary"
                    : "h-1.5 rounded-full bg-border"
                }
              />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Força local: {strength < 2 ? "fraca" : strength < 4 ? "média" : "forte"}. A credencial
            real é criada no bloco &quot;Credencial do proprietário&quot; acima.
          </p>
        </div>
        <Note>
          Esta conferência é local. A criação da conta, a entrada, a recuperação por e-mail e o
          segundo fator acontecem na autenticação real do ambiente (IMPLEMENTED_NOT_VERIFIED até
          você concluir o fluxo).
        </Note>
      </StepSection>

      <StepSection
        icon={Siren}
        title="MFA e recuperação de acesso"
        description="Fator adicional obrigatório na política do proprietário."
      >
        <div className="grid gap-2 sm:grid-cols-3">
          {(
            [
              { key: "app", label: "Aplicativo autenticador", icon: Fingerprint },
              { key: "sms", label: "SMS", icon: Phone },
              { key: "email", label: "E-mail", icon: Mail },
            ] as const
          ).map((o) => (
            <button
              key={o.key}
              type="button"
              onClick={() => setMfa(o.key)}
              aria-pressed={mfa === o.key}
              className={
                mfa === o.key
                  ? "relative flex min-h-12 items-center gap-2 rounded-lg border border-primary bg-primary/10 p-3 pr-10 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  : "relative flex min-h-12 items-center gap-2 rounded-lg border border-border bg-surface-1 p-3 pr-10 text-left text-sm outline-none hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-ring"
              }
            >
              <o.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">{o.label}</span>
              <span className="absolute right-2 top-2">
                <Info className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </span>
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="recovery-email">E-mail de recuperação</Label>
            <Input
              id="recovery-email"
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="recuperacao@empresa.com"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="recovery-phone">Telefone de recuperação</Label>
            <Input
              id="recovery-phone"
              value={recoveryPhone}
              onChange={(e) => setRecoveryPhone(e.target.value)}
              placeholder="+55 (00) 00000-0000"
            />
          </div>
        </div>
        <div className="grid gap-2">
          {[
            {
              label: "Recuperação de acesso por e-mail verificado",
              truth: "NOT_CONNECTED",
              source: "AUTH-REC-01",
              definition: "Canal de recuperação que depende do provedor de identidade.",
              next: "Conectar autenticação e validar o e-mail.",
              destination: "/owner/security" as const,
            },
            {
              label: "Fluxo “esqueci a senha”",
              truth: "NOT_CONNECTED",
              source: "AUTH-REC-02",
              definition: "Redefinição segura de credencial; ainda não existe fluxo executável.",
              next: "Implementar o fluxo no serviço de autenticação.",
              destination: undefined,
            },
            {
              label: "Chave do proprietário (plano B offline)",
              truth: "DOCUMENTED_ONLY",
              source: "SEC-KEY-01",
              definition: "Procedimento de contingência descrito, sem chave emitida.",
              next: "Revisar e homologar o procedimento.",
              destination: "/owner/documents" as const,
            },
          ].map((r) => (
            <ActionableStatus
              key={r.label}
              icon={KeyRound}
              title={r.label}
              source={r.source}
              truth={r.truth}
              definition={r.definition}
              impact="Sem este controle, a recuperação real permanece indisponível."
              owner="Segurança do proprietário"
              updatedAt="sem execução"
              nextStep={r.next}
              destination={r.destination}
              actionLabel={r.destination === "/owner/documents" ? "Abrir origem" : "Configurar"}
              disabledReason="A autenticação ainda não oferece este fluxo nesta candidata."
            />
          ))}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="session-duration">Duração da sessão</Label>
          <select
            id="session-duration"
            value={sessionHours}
            onChange={(e) => setSessionHours(e.target.value)}
            className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring sm:max-w-xs"
          >
            <option value="4">4 horas</option>
            <option value="8">8 horas</option>
            <option value="12">12 horas</option>
          </select>
          <p className="text-xs text-muted-foreground">
            Preferência DOCUMENTED_ONLY; depende da autenticação para ser aplicada.
          </p>
        </div>
      </StepSection>

      <StepSection
        icon={UserCheck}
        title="Política de aprovação e permissões"
        description="Finalidade e impacto de cada permissão do proprietário."
      >
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-surface-1 p-3">
          <div className="min-w-0">
            <Label htmlFor="dual" className="text-sm">
              Dupla checagem em ações críticas
            </Label>
            <p className="text-xs text-muted-foreground">
              Promoção de versão, exclusão de cliente e alteração de segredos exigem segunda
              autorização.
            </p>
          </div>
          <Switch
            id="dual"
            checked={dual}
            onCheckedChange={setDual}
            aria-label="Dupla checagem em ações críticas"
          />
        </div>
        <div className="grid gap-2">
          {PERMISSIONS.map((p) => (
            <ActionableStatus
              key={p.label}
              icon={ShieldCheck}
              title={p.label}
              source={p.source}
              truth="DOCUMENTED_ONLY"
              definition={p.purpose}
              impact={p.impact}
              owner="Proprietário e Segurança"
              updatedAt="documento vivo"
              nextStep="Revisar esta permissão após a ativação."
              destination="/owner/security"
              actionLabel="Configurar permissões"
            />
          ))}
        </div>
      </StepSection>
    </div>
  );
}

/* -------------------------------------------------------- 4 consentimentos/APIs */

const POLICIES: {
  id: string;
  title: string;
  version: string;
  required: boolean;
  scope: string;
  impact: string;
  truth: TruthState;
}[] = [
  {
    id: "POL-KEY-1",
    title: "Termos de uso, licença e propriedade intelectual",
    version: "v0.9-candidata",
    required: true,
    scope: "Uso do ambiente do proprietário, titularidade do código, dos dados e das evidências.",
    impact: "Define o que pertence ao proprietário e o que pode ser licenciado a clientes.",
    truth: "DOCUMENTED_ONLY" as TruthState,
  },
  {
    id: "POL-KEY-2",
    title: "Política de privacidade e LGPD",
    version: "v0.8-candidata",
    required: true,
    scope: "Dados pessoais tratados, base legal, direitos do titular e prazo de guarda.",
    impact: "Restringe o uso de dado pessoal a finalidade declarada.",
    truth: "DOCUMENTED_ONLY" as TruthState,
  },
  {
    id: "POL-KEY-3",
    title: "Política de segurança e acesso",
    version: "v0.8-candidata",
    required: true,
    scope: "Senhas, MFA, sessão, papéis, dupla autorização e ações críticas.",
    impact: "Ações críticas passam a exigir dupla checagem.",
    truth: "DOCUMENTED_ONLY" as TruthState,
  },
  {
    id: "POL-KEY-4",
    title: "Política de retenção, backup e restauração",
    version: "v0.5-rascunho",
    required: true,
    scope: "Prazo de retenção, frequência de backup, teste de restauração e descarte.",
    impact: "Sem teste de restauração comprovado, o item permanece NOT_VERIFIED.",
    truth: "NOT_VERIFIED" as TruthState,
  },
  {
    id: "POL-KEY-5",
    title: "Política de uso de IA, dados usados pela IA e limites de autonomia",
    version: "v0.7-candidata",
    required: true,
    scope:
      "Quais dados podem ser enviados ao provider, o que a IA pode decidir sozinha e o que exige aprovação humana.",
    impact: "A IA nunca promove versão nem publica documento sem decisão do proprietário.",
    truth: "DOCUMENTED_ONLY" as TruthState,
  },
  {
    id: "POL-KEY-6",
    title: "Consentimento de analytics e telemetria",
    version: "v0.6-candidata",
    required: false,
    scope: "Coleta de uso, desempenho e erros do próprio ambiente.",
    impact: "Sem aceite, os painéis de observabilidade seguem sem série coletada.",
    truth: "NOT_CONNECTED" as TruthState,
  },
  {
    id: "POL-KEY-7",
    title: "Consentimento para integrações, APIs e escopos",
    version: "v0.6-candidata",
    required: false,
    scope: "Providers autorizados, escopos concedidos, quotas, timeout e fallback.",
    impact: "Cada escopo concedido amplia o alcance de uma integração externa.",
    truth: "NOT_CONNECTED" as TruthState,
  },
  {
    id: "POL-KEY-8",
    title: "Compartilhamento e uso de dados por tenant",
    version: "v0.7-candidata",
    required: true,
    scope: "Isolamento entre clientes, o que nunca sai do tenant e o que é agregado.",
    impact: "Cliente nunca acessa o CORE do proprietário nem dado de outro tenant.",
    truth: "DOCUMENTED_ONLY" as TruthState,
  },
  {
    id: "POL-KEY-9",
    title: "Política de logs, evidências e auditoria",
    version: "v0.6-candidata",
    required: true,
    scope: "O que é registrado, por quanto tempo, quem audita e como a evidência é anexada.",
    impact: "Decisões sem evidência anexada permanecem NOT_VERIFIED.",
    truth: "NOT_VERIFIED" as TruthState,
  },
];

const CONSENTS = [
  {
    label: "Registro de decisões e histórico de governança",
    purpose: "Rastrear origem, decisão e evidência de cada caso.",
    impact: "Necessário para o Decision & Provenance Gate.",
  },
  {
    label: "Coleta de evidências de teste e validação",
    purpose: "Guardar provas de aprovação antes de promover versões.",
    impact: "Sem isso, nenhum gate pode aprovar.",
  },
  {
    label: "Uso de dados DEMO identificados como sintéticos",
    purpose: "Permitir navegação sem dados reais.",
    impact: "Nada é apresentado como resultado comprovado.",
  },
];

const PROVIDERS = [
  {
    icon: Sparkles,
    label: "Provider de IA (modelo e comparação)",
    scope: "análise de casos, hipóteses, rascunhos",
    quota: "quota/custo por token — não configurado",
    fallback: "timeout 30s · sem fallback definido",
    truth: "NOT_CONNECTED",
  },
  {
    icon: HardDrive,
    label: "Storage de evidências",
    scope: "anexos, relatórios, provas de teste",
    quota: "retenção não definida",
    fallback: "sem fallback",
    truth: "NOT_CONNECTED",
  },
  {
    icon: Gauge,
    label: "Analytics / telemetria",
    scope: "uso das superfícies do proprietário",
    quota: "amostragem não definida",
    fallback: "degradação silenciosa",
    truth: "NOT_CONNECTED",
  },
  {
    icon: Link2,
    label: "Integrações permitidas (repositório, documentos, reuniões)",
    scope: "leitura conforme escopo autorizado",
    quota: "limites por integração",
    fallback: "operação manual",
    truth: "NOT_CONNECTED",
  },
];

type ProviderCandidate = (typeof PROVIDERS)[number];

function ProviderImpactPreview({ provider }: { provider: ProviderCandidate }) {
  return (
    <SubstitutionImpactPreview
      currentLabel="Nenhum provider conectado"
      candidateLabel={provider.label}
      risk="Alto enquanto compatibilidade, segurança e recovery não forem testados."
      fallback={provider.fallback}
      evidence="Fonte: LABTEST LT-PROV-0001 · atualização documental: 12/09/2026 · 0 testes concluídos de 4 pendentes. Estado NOT_CONNECTED."
    />
  );
}

function StepConsents() {
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [policyAt, setPolicyAt] = useState<Record<string, string>>({});
  return (
    <div className="space-y-4">
      <StepSection
        icon={ScrollText}
        title="Políticas, termos e consentimentos"
        description="Finalidade, impacto, obrigatoriedade e data/hora do aceite. Nenhum ID é inventado: sem entrada no Registry, o item aparece como “ID não reconciliado”."
        action={
          <Badge variant="outline" className="font-mono text-[10px]">
            {POLICIES.filter((p) => p.required).length} obrigatórias ·{" "}
            {POLICIES.filter((p) => policyAt[p.id]).length}/{POLICIES.length} aceitas
          </Badge>
        }
      >
        <Accordion type="single" collapsible className="w-full">
          {POLICIES.map((p) => (
            <AccordionItem key={p.id} value={p.id} className="border-border">
              <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 py-2">
                <Checkbox
                  checked={Boolean(policyAt[p.id])}
                  onCheckedChange={(v) =>
                    setPolicyAt((s) => {
                      const next = { ...s };
                      if (v) next[p.id] = new Date().toLocaleString("pt-BR");
                      else delete next[p.id];
                      return next;
                    })
                  }
                  aria-label={`Aceitar ${p.title}`}
                />
                <AccordionTrigger className="min-w-0 gap-2 py-1 text-left hover:no-underline">
                  <span className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                    <span className="min-w-0 text-sm font-medium">{p.title}</span>
                    <Badge variant="outline" className="text-[10px]">
                      {p.required ? "aceite obrigatório" : "aceite opcional"}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground">
                      ID não reconciliado · versão não reconciliada
                    </span>
                    <TruthBadge truth={p.truth} />
                  </span>
                </AccordionTrigger>
                <InfoTip
                  label={p.title}
                  text={`${p.scope} Origem declarada: ${p.id}, ${p.version}.`}
                />
              </div>
              <AccordionContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  <span className="font-medium text-foreground/80">Finalidade / escopo: </span>
                  {p.scope}
                </p>
                <p>
                  <span className="font-medium text-foreground/80">Impacto de aceitar: </span>
                  {p.impact}
                </p>
                <p>
                  <span className="font-medium text-foreground/80">Aceite: </span>
                  {policyAt[p.id]
                    ? `registrado em ${policyAt[p.id]} (hora local do navegador, registro local DEMO)`
                    : "não registrado"}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 px-2 text-xs" disabled>
                    Abrir política
                  </Button>
                  <span className="font-mono text-[10px]">Documento não conectado</span>
                </div>
                <p className="flex gap-2 rounded-md border border-border bg-surface-1 p-2">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>
                    Não existe documento mestre ligado a esta instalação: o texto final não foi
                    escrito nem validado juridicamente, e nenhum ID/versão foi reconciliado com o
                    Registry. Nada aqui é política vigente.
                  </span>
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </StepSection>

      <StepSection
        icon={ScrollText}
        title="Consentimentos explícitos"
        description="Confirme a leitura de cada item; finalidade e impacto ficam visíveis."
        action={
          <Badge variant="outline" className="font-mono text-[10px]">
            {Object.values(accepted).filter(Boolean).length}/{CONSENTS.length} confirmados
          </Badge>
        }
      >
        {CONSENTS.map((c) => (
          <label
            key={c.label}
            className="flex cursor-pointer gap-3 rounded-lg border border-border bg-surface-1 p-3"
          >
            <Checkbox
              checked={Boolean(accepted[c.label])}
              onCheckedChange={(v) => setAccepted((s) => ({ ...s, [c.label]: Boolean(v) }))}
              aria-label={`Confirmo a leitura: ${c.label}`}
              className="mt-0.5"
            />
            <span className="min-w-0">
              <span className="block text-sm font-medium">{c.label}</span>
              <span className="mt-0.5 block text-xs text-muted-foreground">
                Finalidade: {c.purpose}
              </span>
              <span className="block text-xs text-muted-foreground">Impacto: {c.impact}</span>
            </span>
          </label>
        ))}
      </StepSection>

      <StepSection
        icon={Plug}
        title="APIs, providers e limites"
        description="Segredos são server-side: nenhuma chave é digitada nesta tela."
      >
        {PROVIDERS.map((p) => (
          <div key={p.label}>
            <ActionableStatus
              icon={p.icon}
              title={p.label}
              source={`CORE Provider Registry · ${p.scope}`}
              truth={p.truth}
              definition={`Provider previsto para ${p.scope}. ${p.quota}; ${p.fallback}.`}
              impact="Sem conexão, esta capacidade não executa nem produz evidência."
              owner="Configurações técnicas do CORE"
              updatedAt="sem execução"
              nextStep="Configurar provider, escopo, limite, timeout e fallback."
              destination="/owner/integrations"
              actionLabel="Configurar"
            />
            <ProviderImpactPreview provider={p} />
          </div>
        ))}
        <Note tone="warning">
          IA pessoal e comparação de modelos aparecem aqui como opção de teste. Enquanto não houver
          provider conectado, nenhuma resposta de IA é produzida nem simulada.
        </Note>
      </StepSection>
    </div>
  );
}

/* --------------------------------------------------------------- 5 configurações */

function StepSettings() {
  const [cfg, setCfg] = useState({
    lang: "pt-BR",
    tz: "America/Sao_Paulo",
    mode: "Executivo",
    notify: true,
    tv: false,
    critical: false,
    contrast: false,
    motion: false,
    keyboard: true,
    fontLarge: false,
  });
  const toggle = (k: keyof typeof cfg) => setCfg((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="space-y-4">
      <StepSection
        icon={Languages}
        title="Idioma, fuso e leitura"
        description="Preferências base da interface."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="lang">Idioma</Label>
            <select
              id="lang"
              value={cfg.lang}
              onChange={(e) => setCfg({ ...cfg, lang: e.target.value })}
              className="h-9 w-full rounded-md border border-input bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="pt-BR">Português (Brasil)</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tz">Fuso horário</Label>
            <div className="relative">
              <Globe
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />
              <select
                id="tz"
                value={cfg.tz}
                onChange={(e) => setCfg({ ...cfg, tz: e.target.value })}
                className="h-9 w-full rounded-md border border-input bg-card pl-9 pr-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="America/Sao_Paulo">America/Sao_Paulo (UTC−3)</option>
                <option value="UTC">UTC</option>
              </select>
            </div>
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Modo de leitura</Label>
          <div className="grid gap-2 sm:grid-cols-3">
            {["Didático", "Executivo", "Técnico"].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setCfg({ ...cfg, mode: m })}
                aria-pressed={cfg.mode === m}
                className={
                  cfg.mode === m
                    ? "rounded-lg border border-primary bg-primary/10 p-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    : "rounded-lg border border-border bg-surface-1 p-2 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
                }
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <Note>
          O tema Claro/Escuro/Automático fica no seletor do topo desta jornada e é independente do
          filtro “Somente críticos”.
        </Note>
      </StepSection>

      <StepSection
        icon={Accessibility}
        title="Acessibilidade, notificações e painel"
        description="Cada preferência é aplicada apenas neste navegador."
      >
        {(
          [
            {
              k: "notify",
              icon: Bell,
              label: "Notificações e alertas",
              hint: "Alertas críticos do cockpit",
            },
            {
              k: "tv",
              icon: Tv,
              label: "Modo Painel / TV",
              hint: "Tipografia e cartões ampliados",
            },
            {
              k: "critical",
              icon: Siren,
              label: "Filtro “Somente críticos”",
              hint: "Filtro de conteúdo — não é tema visual",
            },
            { k: "contrast", icon: Moon, label: "Alto contraste", hint: "Reforça bordas e texto" },
            {
              k: "fontLarge",
              icon: SquareStack,
              label: "Texto ampliado",
              hint: "Aumenta o tamanho base",
            },
            { k: "motion", icon: Timer, label: "Reduzir movimento", hint: "Desativa animações" },
            {
              k: "keyboard",
              icon: Workflow,
              label: "Navegação por teclado reforçada",
              hint: "Foco sempre visível",
            },
          ] as const
        ).map((o) => (
          <div
            key={o.k}
            className="relative grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-lg border border-border bg-surface-1 p-3 pr-11"
          >
            <div className="absolute right-2 top-2">
              <InfoTip
                label={o.label}
                text={`${o.hint}. Origem: preferência local desta instalação.`}
              />
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <o.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <div className="min-w-0">
                <Label htmlFor={`cfg-${o.k}`} className="text-sm">
                  {o.label}
                </Label>
                <p className="text-xs text-muted-foreground">{o.hint}</p>
              </div>
            </div>
            <Switch
              id={`cfg-${o.k}`}
              checked={cfg[o.k]}
              onCheckedChange={() => toggle(o.k)}
              aria-label={o.label}
              className="mr-1"
            />
          </div>
        ))}
      </StepSection>

      <StepSection
        icon={ClipboardCheck}
        title="Resumo das escolhas"
        description="Confira antes de avançar."
      >
        <dl className="grid gap-2 sm:grid-cols-2">
          {[
            ["Idioma", cfg.lang],
            ["Fuso", cfg.tz],
            ["Modo de leitura", cfg.mode],
            ["Notificações", cfg.notify ? "ativas" : "desativadas"],
            ["Painel / TV", cfg.tv ? "ativo" : "desativado"],
            ["Somente críticos", cfg.critical ? "ligado" : "desligado"],
            ["Alto contraste", cfg.contrast ? "ligado" : "desligado"],
            ["Reduzir movimento", cfg.motion ? "ligado" : "desligado"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-lg border border-border bg-surface-1 p-2 text-xs">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </StepSection>
    </div>
  );
}

/* ------------------------------------------------------------- 6 CORE e conexões */

const CORE_MODULES = [
  {
    label: "Cognitivo / Cockpit",
    essential: true,
    truth: "IMPLEMENTED_NOT_VERIFIED",
    to: "/owner" as const,
  },
  {
    label: "Mapa Vivo",
    essential: true,
    truth: "IMPLEMENTED_NOT_VERIFIED",
    to: "/owner/mapa-vivo" as const,
  },
  { label: "Minha Área", essential: false, truth: "PARTIAL", to: "/owner/settings" as const },
  {
    label: "Plano de Ação",
    essential: true,
    truth: "IMPLEMENTED_NOT_VERIFIED",
    to: "/owner/plans" as const,
  },
  { label: "Aplicativos", essential: true, truth: "PARTIAL", to: "/owner/apps" as const },
  { label: "Segurança", essential: true, truth: "PARTIAL", to: "/owner/security" as const },
  {
    label: "Documentos",
    essential: false,
    truth: "DOCUMENTED_ONLY",
    to: "/owner/documents" as const,
  },
  {
    label: "Integrações",
    essential: false,
    truth: "NOT_CONNECTED",
    to: "/owner/integrations" as const,
  },
];

const CORE_CONNECTIONS = [
  {
    label: "Banco de dados do proprietário",
    truth: "NOT_CONNECTED",
    to: "/owner/settings" as const,
    source: "CORE-DATA-01",
  },
  {
    label: "Autenticação e MFA",
    truth: "NOT_CONNECTED",
    to: "/owner/security" as const,
    source: "CORE-AUTH-01",
  },
  {
    label: "Provider de IA",
    truth: "NOT_CONNECTED",
    to: "/owner/integrations" as const,
    source: "CORE-AI-01",
  },
  {
    label: "Storage de evidências",
    truth: "NOT_CONNECTED",
    to: "/owner/settings" as const,
    source: "CORE-STO-01",
  },
  {
    label: "Observabilidade",
    truth: "NOT_CONNECTED",
    to: "/core/observability" as const,
    source: "CORE-OBS-01",
  },
  {
    label: "Controle local / PC do proprietário (bridge)",
    truth: "BLOCKED",
    to: undefined,
    source: "CORE-BRIDGE-01",
  },
];

function StepCore() {
  return (
    <div className="space-y-4">
      <StepSection
        icon={Boxes}
        title="CORE Padrão / SOL — referência corrente"
        description="Módulos preparados agora. Essencial agora × Opcional depois."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {CORE_MODULES.map((m) => (
            <ActionableStatus
              key={m.label}
              icon={Boxes}
              title={m.label}
              source="Registry de superfícies · CORE SOL v0.2"
              truth={m.truth}
              definition={
                m.essential
                  ? "Módulo essencial desta instalação."
                  : "Módulo opcional após a instalação."
              }
              impact="Abre a superfície real sem alterar seu estado de validação."
              owner="Proprietário do ambiente"
              updatedAt="build atual"
              nextStep="Abrir o módulo e revisar sua situação."
              destination={m.to}
              actionLabel="Abrir módulo"
            />
          ))}
        </div>
      </StepSection>

      <StepSection
        icon={Moon}
        title="LUA / LAB — experimentos"
        description="Candidatas e conceitos vivem separados do SOL; promoção nunca é automática."
      >
        <div className="grid gap-2">
          {[
            { label: "CORE Cubo / Prisma / Caleidoscópio (conceitos)", truth: "HYPOTHESIS" },
            { label: "Experiências e candidatas em laboratório", truth: "SIMULATED" },
            { label: "Promoção automática desabilitada", truth: "FACT/EVIDENCED" },
          ].map((r) => (
            <ActionableStatus
              key={r.label}
              icon={Moon}
              title={r.label}
              source="LABTEST · linha evolutiva LUA"
              truth={r.truth}
              definition="Conceito experimental separado da referência operacional SOL."
              impact="Não altera o CORE corrente nem implica promoção."
              owner="LABTEST / proprietário"
              updatedAt="candidata atual"
              nextStep="Abrir o LABTEST para examinar hipótese, teste e gate."
              destination="/labtest"
              actionLabel="Abrir LABTEST"
            />
          ))}
        </div>
        <Note tone="warning">
          SALVAR ≠ PROMOVER. Nada nesta jornada altera a referência corrente do CORE.
        </Note>
      </StepSection>

      <StepSection
        icon={Network}
        title="Providers, plugins, adapters e conexões"
        description="Estado real de cada conexão do CORE do proprietário."
      >
        <div className="grid gap-2">
          {CORE_CONNECTIONS.map((c) => (
            <ActionableStatus
              key={c.label}
              icon={Network}
              title={c.label}
              source={c.source}
              truth={c.truth}
              definition="Conexão técnica necessária para uma capacidade real do ambiente."
              impact="Enquanto desconectada, a função relacionada não executa."
              owner="Configuração técnica do CORE"
              updatedAt="sem execução"
              nextStep={
                c.to
                  ? "Abrir a superfície responsável e configurar a conexão."
                  : "Aguardar uma bridge segura e auditável."
              }
              destination={c.to}
              actionLabel="Configurar"
              disabledReason="Não existe bridge local segura nesta candidata; o tratamento futuro pertence à arquitetura técnica do CORE."
            />
          ))}
        </div>
        <Note tone="blocked">
          O controle local do computador do proprietário aparece como BLOCKED: não existe bridge
          real. Ele não deve ser apresentado como funcionando em nenhuma tela.
        </Note>
      </StepSection>
    </div>
  );
}

function CoreAside() {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">Topologia preparada</h3>
      <ul className="mt-3 space-y-2 text-xs">
        {[
          "Central Owner — camada gerencial",
          "CORE Owner — camada técnica",
          "SOL: referência corrente",
          "LUA/LAB: candidatas e conceitos",
          "CORE Cliente: fora desta jornada",
        ].map((t) => (
          <li key={t} className="flex items-start gap-2">
            <Network className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* -------------------------------------------------------------- 7 testes/ativação */

interface ReadinessRow {
  item: string;
  source: string;
  state: TruthState | string;
  evidence: string;
  blocker: string;
  action: string;
  destination?: InstallDestination;
}

const READINESS: ReadinessRow[] = [
  {
    item: "UI e navegação",
    source: "TST-UI-01 · percurso manual no preview",
    state: "IMPLEMENTED_NOT_VERIFIED",
    evidence: "sem relatório anexado",
    blocker: "—",
    action: "Registrar evidência no Teste³",
    destination: "/core/tests",
  },
  {
    item: "Assinatura e integridade",
    source: "CHK-0005 · cadeia de assinatura",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "serviço de assinatura ausente",
    action: "Conectar serviço no CORE",
    destination: "/owner/integrations",
  },
  {
    item: "Autenticação e MFA",
    source: "TST-AUTH-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "provedor de identidade ausente",
    action: "Configurar autenticação",
    destination: "/owner/security",
  },
  {
    item: "Banco de dados",
    source: "TST-DB-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "banco não provisionado",
    action: "Provisionar banco",
    destination: "/owner/settings",
  },
  {
    item: "RLS e isolamento",
    source: "TST-RLS-01",
    state: "NOT_VERIFIED",
    evidence: "nenhuma",
    blocker: "depende do banco",
    action: "Escrever políticas e teste negativo",
    destination: "/core/tests",
  },
  {
    item: "APIs e CALLs",
    source: "CALL Registry",
    state: "NOT_VERIFIED",
    evidence: "contratos documentados",
    blocker: "sem execução",
    action: "Rodar suíte de CALLs",
    destination: "/core/tests",
  },
  {
    item: "Provider de IA",
    source: "TST-AI-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "provider ausente",
    action: "Conectar provider no CORE",
    destination: "/owner/integrations",
  },
  {
    item: "Storage de evidências",
    source: "TST-STO-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "bucket inexistente",
    action: "Criar storage",
    destination: "/owner/settings",
  },
  {
    item: "Observabilidade",
    source: "TST-OBS-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "telemetria ausente",
    action: "Instrumentar CORE",
    destination: "/core/observability",
  },
  {
    item: "Backup e restauração",
    source: "TST-BKP-01",
    state: "NOT_CONNECTED",
    evidence: "nenhuma",
    blocker: "depende do banco",
    action: "Definir rotina e teste de restore",
  },
  {
    item: "Recuperação e fallback",
    source: "TST-FAIL-01",
    state: "NOT_VERIFIED",
    evidence: "nenhuma",
    blocker: "sem cenário executado",
    action: "Definir cenários de falha",
  },
  {
    item: "Separação Owner × Cliente",
    source: "TST-ISO-01",
    state: "NOT_VERIFIED",
    evidence: "arquitetura documentada",
    blocker: "sem teste negativo",
    action: "Executar teste de acesso cruzado",
    destination: "/core/tests",
  },
  {
    item: "Responsividade e acessibilidade",
    source: "TST-A11Y-01",
    state: "PARTIAL",
    evidence: "verificação manual de foco e mobile",
    blocker: "sem auditoria formal",
    action: "Rodar auditoria de a11y",
    destination: "/core/tests",
  },
];

const STATE_TONE: Record<string, string> = {
  NOT_CONNECTED: "text-destructive",
  BLOCKED: "text-destructive",
  NOT_VERIFIED: "text-muted-foreground",
  PARTIAL: "text-warning",
  IMPLEMENTED_NOT_VERIFIED: "text-warning",
};

function StepTests() {
  const blockers = READINESS.filter((r) => r.blocker !== "—").length;
  const ok = READINESS.filter((r) => r.state === "IMPLEMENTED_VERIFIED").length;
  return (
    <div className="space-y-4">
      <StepSection
        icon={ClipboardCheck}
        title="Tabela de prontidão"
        description="Item, fonte/ID, estado, evidência, bloqueador e ação. Nenhum PASS sem evidência."
        action={
          <Badge variant="outline" className="font-mono text-[10px]">
            {ok}/{READINESS.length} aprovados
          </Badge>
        }
      >
        <div className="scrollbar-thin -mx-1 overflow-x-auto px-1">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[150px]">Item</TableHead>
                <TableHead className="min-w-[170px]">Fonte / ID</TableHead>
                <TableHead className="min-w-[120px]">Estado</TableHead>
                <TableHead className="min-w-[150px]">Evidência</TableHead>
                <TableHead className="min-w-[150px]">Bloqueador</TableHead>
                <TableHead className="min-w-[170px]">Ação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {READINESS.map((r) => (
                <TableRow key={r.item}>
                  <TableCell className="text-sm font-medium">{r.item}</TableCell>
                  <TableCell className="font-mono text-[11px] text-muted-foreground">
                    {r.source}
                  </TableCell>
                  <TableCell className={`font-mono text-[11px] ${STATE_TONE[r.state] ?? ""}`}>
                    {r.state}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.evidence}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{r.blocker}</TableCell>
                  <TableCell className="text-xs">
                    {r.destination ? (
                      <StatusActionLink to={r.destination} variant="ghost">
                        {r.action}
                      </StatusActionLink>
                    ) : (
                      <div className="space-y-1">
                        <Button variant="outline" size="sm" disabled>
                          {r.action}
                        </Button>
                        <p className="max-w-48 text-[10px] text-muted-foreground">
                          Sem executor conectado; tratar futuramente em Testes &amp; Qualidade.
                        </p>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <Note tone="blocked">
          Ativação do ambiente bloqueada: {blockers} itens têm bloqueador ativo e nenhum teste
          automatizado foi executado neste build.
        </Note>
      </StepSection>
    </div>
  );
}

function TestsAside() {
  const notConnected = READINESS.filter((r) => r.state === "NOT_CONNECTED").length;
  const notVerified = READINESS.filter((r) => r.state === "NOT_VERIFIED").length;
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card p-4">
        <ReadinessDonut
          percent={0}
          label="Prontidão técnica"
          sub="0 de 13 itens com evidência aprovada."
        />
      </div>
      <div className="rounded-2xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold">Resumo da ativação</h3>
        <ul className="mt-3 space-y-2 text-xs">
          <li className="flex items-center justify-between gap-2">
            <span>Módulos ativos (interface)</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              6
            </Badge>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span>Pendências NOT_VERIFIED</span>
            <Badge variant="outline" className="font-mono text-[10px]">
              {notVerified}
            </Badge>
          </li>
          <li className="flex items-center justify-between gap-2">
            <span>Bloqueadores NOT_CONNECTED</span>
            <Badge
              variant="outline"
              className="border-destructive/40 font-mono text-[10px] text-destructive"
            >
              {notConnected}
            </Badge>
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ rota */

const STEPS: JourneyStep[] = [
  {
    key: "verify",
    title: "Verificação inicial",
    short: "Verificação",
    icon: ClipboardCheck,
    description:
      "Integridade, conectividade, requisitos, permissões, assinatura digital e compatibilidade de serviços.",
    content: <StepVerify />,
  },
  {
    key: "identity",
    title: "Identidade",
    short: "Identidade",
    icon: User,
    description: "Identificação do proprietário e do ambiente. Essencial agora × completar depois.",
    content: <StepIdentity />,
  },
  {
    key: "security",
    title: "Segurança e acessos",
    short: "Segurança",
    icon: ShieldCheck,
    description:
      "Senha, MFA, recuperação, sessão, aprovação e dupla autorização em ações críticas.",
    content: <StepSecurity />,
  },
  {
    key: "consents",
    title: "Consentimentos e APIs",
    short: "Consentimentos",
    icon: ScrollText,
    description: "Consentimentos explícitos, providers, escopos, quotas, timeout e fallback.",
    content: <StepConsents />,
  },
  {
    key: "settings",
    title: "Configurações",
    short: "Configurações",
    icon: Gauge,
    description: "Idioma, fuso, tema, modo de leitura, notificações, acessibilidade e Painel/TV.",
    content: <StepSettings />,
  },
  {
    key: "core",
    title: "CORE e conexões",
    short: "CORE",
    icon: Cpu,
    description: "Módulos do CORE Padrão/SOL, experimentos em LUA/LAB e estado das conexões.",
    content: <StepCore />,
    aside: <CoreAside />,
  },
  {
    key: "tests",
    title: "Testes e ativação",
    short: "Testes",
    icon: Database,
    description: "Prontidão item por item, com fonte, evidência, bloqueador e ação.",
    content: <StepTests />,
    aside: <TestsAside />,
  },
];

export const Route = createFileRoute("/install/owner")({
  head: () => ({
    meta: [
      { title: "Instalação do Proprietário — LAMOU IA CORE" },
      {
        name: "description",
        content:
          "Jornada de instalação do proprietário do LAMOU IA: verificação, identidade, segurança, consentimentos, configurações, CORE e testes de ativação.",
      },
      { property: "og:title", content: "Instalação do Proprietário — LAMOU IA CORE" },
      {
        property: "og:description",
        content:
          "Sete etapas de instalação privada do proprietário, com estado real e evidência de cada requisito.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <InstallJourney
      kind="owner"
      title="Instalação do Proprietário"
      subtitle="LAMOU IA — Ambiente do Proprietário · candidata não promovida"
      version={VERSION}
      steps={STEPS}
      storageKey={OWNER_INSTALL_KEY}
      themeKey="lamou.install.owner.theme"
      showJourneyProgress={false}
      finishTo="/owner"
      finishLabel="Abrir LAMOU IA Central"
      finishDisabledReason="Ativação bloqueada: existem itens NOT_CONNECTED e nenhuma evidência de teste."
      launcher={{
        kicker: "Ambiente do Proprietário · instalação privada",
        headline: "Seu pacote está pronto para instalar.",
        lead: "Esta é a instalação do proprietário do LAMOU IA: sete etapas para preparar identidade, segurança, consentimentos, configurações, o CORE e os testes de ativação. O cliente nunca acessa esta superfície.",
        version: VERSION,
        bullets: [
          {
            icon: ClipboardCheck,
            title: "Requisitos",
            text: "Navegador atual, conexão estável e acesso de proprietário. Nada é instalado no seu computador.",
          },
          {
            icon: ScrollText,
            title: "Documentação",
            text: "Cada etapa mostra finalidade, impacto e estado real, com IDs rastreáveis.",
          },
          {
            icon: Accessibility,
            title: "Acessibilidade",
            text: "Navegação por teclado, foco visível, contraste, texto ampliado e redução de movimento.",
          },
          {
            icon: Headphones,
            title: "Suporte",
            text: "Você pode pausar em qualquer etapa: o progresso fica salvo e você continua depois.",
          },
        ],
        asideTitle: "Resumo da instalação",
        aside: [
          { label: "Tempo aproximado", value: "12 a 18 minutos, sem pressa" },
          {
            label: "O que será feito agora",
            value:
              "Verificação, identidade, segurança, consentimentos, configurações, CORE e testes",
          },
          {
            label: "O que pode ficar para depois",
            value: "Foto, cargo, integrações externas, analytics e apps opcionais",
            truth: "NOT_APPLICABLE",
          },
          {
            label: "Segurança",
            value: "Senhas e chaves não são gravadas no navegador; segredos ficam server-side",
          },
          {
            label: "Estado desta jornada",
            value: "Interface real, integrações ainda ausentes",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
          {
            label: "Governança",
            value: "SALVAR ≠ PROMOVER — nada é promovido ao concluir",
            truth: "FACT/EVIDENCED",
          },
        ],
        startLabel: "Iniciar instalação",
        footNote:
          "Ao iniciar, você entra em uma linha de etapas com progresso salvo neste navegador. Nenhuma ativação real acontece enquanto houver requisitos NOT_CONNECTED.",
      }}
    />
  ),
});
