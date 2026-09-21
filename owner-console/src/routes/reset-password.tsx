import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Acesso sem senha — LAMOU IA" },
      {
        name: "description",
        content: "O proprietário entra por link seguro enviado ao e-mail, sem criar senha.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PasswordlessAccessPage,
});

function PasswordlessAccessPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
      <h1 className="font-display text-2xl font-semibold">Acesso sem senha</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        A senha do proprietário foi removida deste fluxo. Para entrar, use o link seguro enviado ao
        e-mail do proprietário na etapa de Segurança da instalação.
      </p>
      <div>
        <Button asChild>
          <Link to="/install/owner">Voltar à instalação do proprietário</Link>
        </Button>
      </div>
    </main>
  );
}
