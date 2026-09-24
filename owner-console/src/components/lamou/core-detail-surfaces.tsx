import { Link } from "@tanstack/react-router";

import { Panel } from "@/components/lamou/shell";
import { CORE_DETAIL_SURFACES } from "@/lib/lamou/nav";

/** Superfícies técnicas de detalhe do CORE.
 *  O menu do CORE tem apenas os 9 itens canônicos; estes destinos continuam
 *  acessíveis por dentro da área a que pertencem. */
export function CoreDetailSurfaces({ parent }: { parent: string }) {
  const items = CORE_DETAIL_SURFACES.filter((s) => s.parent === parent);
  if (items.length === 0) return null;

  return (
    <Panel title={`Detalhe técnico desta área (${items.length})`}>
      <p className="mb-3 text-xs text-muted-foreground">
        Estas superfícies pertencem a esta área e não são itens raiz do CORE. O menu técnico
        permanece com os 9 itens canônicos.
      </p>
      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.to}
              to={s.to}
              className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs outline-none motion-safe:transition-colors hover:border-primary/50 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Icon className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="min-w-0 truncate font-medium">{s.label}</span>
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}
