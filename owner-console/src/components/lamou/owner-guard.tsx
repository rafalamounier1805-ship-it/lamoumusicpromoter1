import { Link } from "@tanstack/react-router";
import { KeyRound, Loader2, ShieldAlert } from "lucide-react";
import type { ReactNode } from "react";

import { useOwnerAuth } from "@/lib/lamou/owner-auth";

function Frame({
  icon: Icon,
  title,
  description,
  tone,
  children,
  live,
}: {
  icon: typeof KeyRound;
  title: string;
  description: string;
  tone: "neutral" | "blocked";
  children?: ReactNode;
  live?: boolean;
}) {
  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground"
      aria-busy={live ? true : undefined}
    >
      <section
        role={live ? "status" : "alert"}
        aria-live={live ? "polite" : undefined}
        className="w-full max-w-md space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
      >
        <header className="flex items-start gap-3">
          <span
            className={
              tone === "blocked"
                ? "rounded-lg border border-destructive/40 bg-destructive/10 p-2"
                : "rounded-lg border border-primary/40 bg-primary/10 p-2"
            }
          >
            <Icon
              className={tone === "blocked" ? "h-5 w-5 text-destructive" : "h-5 w-5 text-primary"}
              aria-hidden="true"
            />
          </span>
          <div className="space-y-1">
            <h1 className="text-base font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </header>
        {children}
      </section>
    </main>
  );
}

function EntryLinks({ showReset = true }: { showReset?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        to="/install/owner"
        className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        Ir para Instalação do Proprietário
      </Link>
      {showReset ? (
        <Link
          to="/reset-password"
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
        >
          Recuperar credencial
        </Link>
      ) : null}
    </div>
  );
}

export function OwnerGuard({ children }: { children: ReactNode }) {
  const { loading, session, authz } = useOwnerAuth();

  if (loading || (session && !authz)) {
    return (
      <Frame
        icon={Loader2}
        tone="neutral"
        live
        title="Verificando autorização"
        description="Confirmando sessão e permissão de Proprietário no backend canônico."
      />
    );
  }

  if (!session || authz?.kind === "no-session") {
    return (
      <Frame
        icon={KeyRound}
        tone="neutral"
        title="Acesso restrito ao Proprietário"
        description="Entre com a conta do Proprietário para abrir esta superfície. Nenhum dado administrativo é carregado antes da autorização."
      >
        <EntryLinks />
      </Frame>
    );
  }

  if (authz?.kind !== "authorized") {
    return (
      <Frame
        icon={ShieldAlert}
        tone="blocked"
        title="403 — sem autorização de Proprietário"
        description={
          authz?.message ??
          "Autorização de Proprietário não comprovada neste ambiente. Acesso negado por padrão."
        }
      >
        <EntryLinks showReset={false} />
      </Frame>
    );
  }

  return <>{children}</>;
}
