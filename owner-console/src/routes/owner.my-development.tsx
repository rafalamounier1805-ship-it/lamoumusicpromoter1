import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/lamou/app-shell";
import { PageHeader, Panel, TruthBadge } from "@/components/lamou/shell";
import { Button } from "@/components/ui/button";
import { useOwnerAuth } from "@/lib/lamou/owner-auth";

export const Route = createFileRoute("/owner/my-development")({
  head: () => ({
    meta: [
      { title: "Meu Desenvolvimento — Atalho do módulo móvel | LAMOU IA" },
      {
        name: "description",
        content:
          "Atalho do módulo móvel Meu Desenvolvimento, ligado ao perfil e aos dados permitidos do usuário atual.",
      },
    ],
  }),
  component: MyDevelopmentBridge,
});

function MyDevelopmentBridge() {
  const { user, profile } = useOwnerAuth();

  return (
    <AppShell group="owner">
      <PageHeader
        title="Meu Desenvolvimento"
        subtitle="Atalho do módulo móvel. Esta tela apenas resolve identidade/contexto e preserva o aplicativo original como módulo independente."
        right={<TruthBadge truth={profile ? "PARTIAL" : "NOT_CONNECTED"} />}
      />

      <Panel title="Dados vinculados ao usuário atual">
        <dl className="grid gap-2 sm:grid-cols-2">
          <Field label="Nome" value={profile?.full_name ?? "não informado"} />
          <Field label="E-mail" value={profile?.email ?? user?.email ?? "não conectado"} />
          <Field label="Empresa" value={profile?.company ?? "não informada"} />
          <Field label="Cargo / função" value={profile?.role_title ?? "não informado"} />
          <Field label="Responsável" value={profile?.responsible_name ?? "próprio usuário / não definido"} />
          <Field
            label="Estado do vínculo"
            value={profile ? "perfil carregado do Owner Auth" : "sessão/perfil não conectado"}
          />
        </dl>
      </Panel>

      <Panel title="Regra de integração">
        <p className="text-sm text-muted-foreground">
          O aplicativo LAMU IA — Meu Desenvolvimento mantém arquitetura, fluxo, dados e versão próprios.
          O LAMOU Central fornece apenas identidade/contexto permitido e o atalho de acesso.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link to="/owner/settings">Editar meu nome e perfil</Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link to="/owner/products">Abrir ficha do módulo</Link>
          </Button>
        </div>
      </Panel>
    </AppShell>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
      <dt className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  );
}
