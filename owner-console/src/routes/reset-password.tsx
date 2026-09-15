import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Definir nova senha — LAMOU IA" },
      {
        name: "description",
        content:
          "Página de recuperação de acesso do proprietário: definir nova senha com segurança.",
      },
      { property: "og:title", content: "Definir nova senha — LAMOU IA" },
      {
        property: "og:description",
        content: "Recuperação de acesso do ambiente do proprietário LAMOU IA.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void supabase.auth.getSession().then(({ data }) => setReady(Boolean(data.session)));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") setReady(Boolean(session));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function submit() {
    setError(null);
    setMessage(null);
    if (password.length < 8) {
      setError("Use ao menos 8 caracteres.");
      return;
    }
    if (password !== confirm) {
      setError("As senhas não conferem.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) setError(updateError.message);
    else setMessage("Senha atualizada. Você já pode voltar à instalação.");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="font-display text-2xl font-semibold">Definir nova senha</h1>
      {!ready ? (
        <p className="text-sm text-muted-foreground">
          Abra esta página pelo link enviado por e-mail. Sem o link de recuperação válido, a senha
          não pode ser alterada aqui.
        </p>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="new-password">Nova senha</Label>
        <Input
          id="new-password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm-password">Confirmar nova senha</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      {message ? <p className="text-sm text-success">{message}</p> : null}

      <div className="flex flex-wrap gap-2">
        <Button onClick={submit} disabled={!ready || busy}>
          {busy ? "Salvando…" : "Salvar nova senha"}
        </Button>
        <Button asChild variant="ghost">
          <Link to="/install/owner">Voltar à instalação</Link>
        </Button>
      </div>
    </main>
  );
}
