import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";

import { TruthBadge } from "@/components/lamou/shell";
import { Button } from "@/components/ui/button";
import { visualLocksForStep, type VisualLockRef } from "@/lib/lamou/visual-locks";

function LockCard({ lock }: { lock: VisualLockRef }) {
  const [open, setOpen] = useState(false);
  return (
    <figure className="rounded-lg border border-border bg-surface-1 p-2">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="group block w-full overflow-hidden rounded-md border border-border/70 outline-none transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transform-none motion-reduce:transition-none"
      >
        <img
          src={lock.url}
          alt={`Visual Lock de referência: ${lock.surface}`}
          loading="lazy"
          className={open ? "w-full" : "h-28 w-full object-cover object-top"}
        />
      </button>
      <figcaption className="mt-2 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">{lock.id}</span>
          <TruthBadge truth={lock.truth} />
          <TruthBadge truth={lock.conformance} />
        </div>
        <p className="text-[11px] text-muted-foreground">{lock.caption}</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-[11px]"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Reduzir referência" : "Ver referência inteira"}
        </Button>
      </figcaption>
    </figure>
  );
}

/** Painel de referência visual da etapa. Referência ≠ aprovação: nada é promovido aqui. */
export function StepVisualLock({ step }: { step: string }) {
  const locks = visualLocksForStep(step);
  if (!locks.length) return null;
  return (
    <section className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <header className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4 text-primary" aria-hidden="true" />
        <h3 className="text-sm font-semibold">Referência visual (Visual Lock)</h3>
      </header>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Arquivo recebido do proprietário e conectado ao projeto como evidência. Serve de referência
        de layout — a conformidade desta tela contra a imagem segue NOT_VERIFIED.
      </p>
      <div className="mt-3 space-y-3">
        {locks.map((l) => (
          <LockCard key={l.id} lock={l} />
        ))}
      </div>
    </section>
  );
}
