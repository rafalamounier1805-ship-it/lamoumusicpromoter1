import { createFileRoute, Link } from "@tanstack/react-router";

import { CoreMark, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OWNER_INSTALL_KEY, useInstallDone } from "@/components/lamou/wizard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LAMOU IA — CORE Proprietário / Owner" },
      {
        name: "description",
        content:
          "Entrada da plataforma LAMOU IA: instalação do proprietário, Central Owner de gestão e CORE técnico do proprietário.",
      },
      { property: "og:title", content: "LAMOU IA — CORE Proprietário / Owner" },
      {
        property: "og:description",
        content:
          "Plataforma privada do proprietário LAMOU IA: instalação, central gerencial e CORE técnico.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SURFACES: { to: "/install/owner" | "/owner" | "/core"; label: string; text: string }[] = [
  {
    to: "/install/owner",
    label: "1 · Instalação do Proprietário",
    text: "Jornada pré-acesso: ambiente, identidade, segurança, consentimentos, configurações, CORE e prontidão.",
  },
  {
    to: "/owner",
    label: "2 · LAMOU IA Central — Proprietário",
    text: "Camada gerencial: cockpit, mapa vivo, portfólio de aplicativos, clientes, comercial, testes, oportunidades e versões. É aqui que você abre um aplicativo.",
  },
  {
    to: "/core",
    label: "3 · LAMOU CORE — Proprietário",
    text: "Camada técnica: arquitetura, capabilities, bindings de aplicativos, dados, IA, segurança, observabilidade, SOL e LUA.",
  },
];

function Index() {
  const installed = useInstallDone(OWNER_INSTALL_KEY);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6 md:py-16">
        <header className="flex flex-wrap items-center gap-3">
          <CoreMark className="h-9 w-9" />
          <div className="min-w-0 flex-1">
            <p className="font-display text-lg font-semibold tracking-tight">LAMOU IA</p>
            <p className="text-xs text-muted-foreground">
              CORE PROPRIETÁRIO / OWNER — privado e global
            </p>
          </div>
          <Badge variant="outline" className="border-warning/40 font-mono text-[10px] text-warning">
            CANDIDATE_NOT_PROMOTED
          </Badge>
        </header>

        <section className="mt-10 max-w-3xl">
          <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            {installed
              ? "Bem-vindo de volta ao console do proprietário"
              : "Comece pela Instalação do Proprietário"}
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {installed
              ? "A jornada de instalação de interface já foi concluída neste navegador. Você pode entrar na Central de gestão ou na camada técnica do CORE. Aplicativos são abertos pela Central."
              : "Nenhuma instalação foi registrada neste navegador. Percorra a jornada do proprietário — ambiente, identidade, segurança, consentimentos, SOL/LUA e prontidão — antes de operar a Central."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/install/owner">
                {installed
                  ? "Rever Instalação do Proprietário"
                  : "Iniciar Instalação do Proprietário"}
              </Link>
            </Button>
            {installed ? (
              <Button asChild size="lg" variant="outline">
                <Link to="/owner">Abrir Central Owner</Link>
              </Button>
            ) : null}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            O provisionamento de cliente é disparado dentro da Central, em Clientes — não a partir
            desta página.
          </p>
          {installed ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Registro local da jornada: {new Date(installed).toLocaleString("pt-BR")}
            </p>
          ) : null}
        </section>

        <section className="mt-12 grid gap-4 md:grid-cols-3">
          {SURFACES.map((s) => (
            <Link
              key={s.to}
              to={s.to}
              className="group rounded-2xl border border-border/60 bg-card/70 p-5 outline-none backdrop-blur transition-colors hover:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="font-display text-base font-semibold group-hover:text-primary">
                {s.label}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
            </Link>
          ))}
        </section>

        <section className="mt-12 rounded-2xl border border-border/60 bg-card/60 p-5">
          <h2 className="font-display text-sm font-semibold tracking-wide">
            Estado desta candidata
          </h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {[
              { label: "Interface navegável (Central e CORE)", truth: "IMPLEMENTED_NOT_VERIFIED" },
              { label: "Fixtures marcadas como demonstração", truth: "SYNTHETIC_DEMO" },
              { label: "Banco de dados e autenticação", truth: "NOT_CONNECTED" },
              { label: "Visual Locks do Drive", truth: "NOT_VERIFIED" },
              { label: "Repositório canônico (GitHub)", truth: "NOT_CONNECTED" },
              { label: "Separação Proprietário × Cliente", truth: "FACT/EVIDENCED" },
            ].map((i) => (
              <li
                key={i.label}
                className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-3 text-sm"
              >
                <span className="min-w-0 flex-1">{i.label}</span>
                <TruthBadge truth={i.truth} />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
