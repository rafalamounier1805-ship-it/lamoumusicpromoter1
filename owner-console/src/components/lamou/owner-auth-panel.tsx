import { CheckCircle2, KeyRound, ShieldCheck, UserCheck } from "lucide-react";
import { useEffect, useState } from "react";

import { TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useOwnerAuth } from "@/lib/lamou/owner-auth";

function Shell({
  icon: Icon,
  title,
  description,
  right,
  children,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <span className="rounded-lg border border-primary/40 bg-primary/10 p-1.5">
            <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
          </span>
          <div>
            <h3 className="text-sm font-semibold">{title}</h3>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

/** Cadastro, login e recuperação reais do proprietário (Auth do backend). */
export function OwnerAccountPanel() {
  const { user, session, sendAccessLink, signOut } = useOwnerAuth();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function access() {
    setError(null);
    setFeedback(null);

    const normalizedEmail = email.trim();
    if (!normalizedEmail) {
      setError("Informe o e-mail do proprietário para receber o link de acesso.");
      return;
    }

    setBusy(true);
    const res = await sendAccessLink(normalizedEmail);
    setBusy(false);

    if (res.error) setError(res.error.message);
    else
      setFeedback(
        "Link de acesso enviado. Abra o e-mail do proprietário e toque no link para entrar — sem senha.",
      );
  }

  return (
    <Shell
      icon={KeyRound}
      title="Acesso do proprietário"
      description="Entrada sem senha por link seguro enviado ao e-mail do proprietário."
      right={<TruthBadge truth={session ? "IMPLEMENTED_VERIFIED" : "IMPLEMENTED_NOT_VERIFIED"} />}
    >
      {user ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg border border-success/40 bg-success/10 p-2 text-xs">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            <span>
              Sessão ativa como <strong>{user.email}</strong>.
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" className="h-8" onClick={() => void signOut()}>
              Encerrar sessão
            </Button>
          </div>
          {feedback ? <p className="text-xs text-success">{feedback}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="auth-email">E-mail do proprietário</Label>
            <Input
              id="auth-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="proprietario@empresa.com"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8" disabled={busy} onClick={() => void access()}>
              {busy ? "Enviando…" : "Enviar link de acesso"}
            </Button>
            <span className="text-xs text-muted-foreground">
              Nenhuma senha é criada, solicitada ou armazenada por este fluxo.
            </span>
          </div>
          {feedback ? <p className="text-xs text-success">{feedback}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      )}
    </Shell>
  );
}

/** MFA real (TOTP) via Auth: enroll, verificação de código e remoção. */
export function OwnerMfaPanel() {
  const { user, factors, enrollMfa, verifyMfa, unenrollMfa } = useOwnerAuth();
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [factorId, setFactorId] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const verified = factors.filter((f) => f.status === "verified");

  async function start() {
    setError(null);
    setFeedback(null);
    setBusy(true);
    const res = await enrollMfa();
    setBusy(false);
    if (res.error) {
      setError(
        /valid session and a registered user/i.test(res.error.message)
          ? "A autenticação exige e-mail confirmado antes de registrar o segundo fator. Confirme o e-mail da conta e tente novamente."
          : res.error.message,
      );
      return;
    }
    setQr(res.qr);
    setSecret(res.secret);
    setFactorId(res.factorId);
  }

  async function confirm() {
    if (!factorId) return;
    setError(null);
    setFeedback(null);
    setBusy(true);
    const res = await verifyMfa(factorId, code.trim());
    setBusy(false);
    if (res.error) setError(res.error.message);
    else {
      setFeedback("Fator de autenticação verificado e ativo.");
      setQr(null);
      setSecret(null);
      setFactorId(null);
      setCode("");
    }
  }

  return (
    <Shell
      icon={ShieldCheck}
      title="Autenticação em duas etapas (aplicativo autenticador)"
      description="Fator TOTP registrado na autenticação real. SMS e e-mail permanecem não conectados."
      right={
        <TruthBadge
          truth={verified.length > 0 ? "IMPLEMENTED_VERIFIED" : "IMPLEMENTED_NOT_VERIFIED"}
        />
      }
    >
      {!user ? (
        <p className="text-xs text-muted-foreground">
          Crie a conta ou entre acima para registrar o segundo fator.
        </p>
      ) : (
        <div className="space-y-3">
          {verified.length > 0 ? (
            <ul className="space-y-2">
              {verified.map((f) => (
                <li
                  key={f.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-success/40 bg-success/10 p-2 text-xs"
                >
                  <span className="font-mono">{f.friendlyName ?? f.id}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      ativo
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7"
                      onClick={() => void unenrollMfa(f.id)}
                    >
                      Remover
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}

          {qr ? (
            <div className="space-y-2 rounded-lg border border-border bg-surface-1 p-3">
              <p className="text-xs text-muted-foreground">
                Leia o código no seu aplicativo autenticador e informe os 6 dígitos.
              </p>
              <img src={qr} alt="Código QR para configurar o autenticador" className="h-40 w-40" />
              {secret ? (
                <p className="break-all font-mono text-[11px] text-muted-foreground">{secret}</p>
              ) : null}
              <div className="flex flex-wrap items-end gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="mfa-code">Código</Label>
                  <Input
                    id="mfa-code"
                    inputMode="numeric"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-28"
                  />
                </div>
                <Button size="sm" className="h-8" disabled={busy} onClick={() => void confirm()}>
                  Verificar código
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                size="sm"
                variant="outline"
                className="h-8"
                disabled={busy || !user.email_confirmed_at}
                onClick={() => void start()}
              >
                {busy
                  ? "Gerando…"
                  : user.email_confirmed_at
                    ? "Registrar autenticador"
                    : "Confirme o e-mail para registrar"}
              </Button>
              {!user.email_confirmed_at ? (
                <p className="text-xs text-muted-foreground">
                  Por que está assim: a autenticação só registra o segundo fator depois que o e-mail
                  da conta é confirmado. Próximo passo: abrir o link de confirmação enviado no
                  cadastro.
                </p>
              ) : null}
            </div>
          )}
          {feedback ? <p className="text-xs text-success">{feedback}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      )}
    </Shell>
  );
}

/** Persistência real do perfil do proprietário (tabela profiles, RLS por usuário). */
export function OwnerProfilePanel() {
  const { user, profile, saveProfile } = useOwnerAuth();
  const [form, setForm] = useState({
    full_name: "",
    company: "",
    phone: "",
    role_title: "",
    responsible_name: "",
    responsible_email: "",
    is_self_responsible: true,
  });
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    setForm({
      full_name: profile.full_name ?? "",
      company: profile.company ?? "",
      phone: profile.phone ?? "",
      role_title: profile.role_title ?? "",
      responsible_name: profile.responsible_name ?? "",
      responsible_email: profile.responsible_email ?? "",
      is_self_responsible: profile.is_self_responsible,
    });
  }, [profile]);

  async function save() {
    setError(null);
    setFeedback(null);
    setBusy(true);
    const res = await saveProfile(form);
    setBusy(false);
    if (res.error) setError(res.error.message);
    else setFeedback("Perfil salvo no ambiente do proprietário.");
  }

  return (
    <Shell
      icon={UserCheck}
      title="Perfil persistido do proprietário"
      description="Estes campos são gravados na sua conta e recarregados nos próximos acessos."
      right={<TruthBadge truth={profile ? "IMPLEMENTED_VERIFIED" : "IMPLEMENTED_NOT_VERIFIED"} />}
    >
      {!user ? (
        <p className="text-xs text-muted-foreground">
          Sem sessão autenticada os dados abaixo ficam apenas nesta tela. Crie a conta na etapa de
          Segurança para persistir o perfil.
        </p>
      ) : (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pf-name">Nome completo</Label>
              <Input
                id="pf-name"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-company">Empresa</Label>
              <Input
                id="pf-company"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-phone">Telefone</Label>
              <Input
                id="pf-phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pf-role">Cargo / função</Label>
              <Input
                id="pf-role"
                value={form.role_title}
                onChange={(e) => setForm({ ...form, role_title: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={form.is_self_responsible}
              onChange={(e) => setForm({ ...form, is_self_responsible: e.target.checked })}
              className="h-4 w-4 rounded border-border"
            />
            Sou o responsável principal
          </label>
          {!form.is_self_responsible ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pf-resp-name">Responsável alternativo</Label>
                <Input
                  id="pf-resp-name"
                  value={form.responsible_name}
                  onChange={(e) => setForm({ ...form, responsible_name: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pf-resp-email">E-mail do responsável</Label>
                <Input
                  id="pf-resp-email"
                  type="email"
                  value={form.responsible_email}
                  onChange={(e) => setForm({ ...form, responsible_email: e.target.value })}
                />
              </div>
            </div>
          ) : null}
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" className="h-8" disabled={busy} onClick={() => void save()}>
              {busy ? "Salvando…" : "Salvar perfil"}
            </Button>
            <span className="text-[11px] text-muted-foreground">
              Armazenamento de imagem segue não conectado: a foto continua em pré-visualização
              local.
            </span>
          </div>
          {feedback ? <p className="text-xs text-success">{feedback}</p> : null}
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
        </div>
      )}
    </Shell>
  );
}
