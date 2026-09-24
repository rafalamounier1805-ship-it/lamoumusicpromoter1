import type { ReactNode } from "react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

/**
 * Padrão global de interação LAMOU.
 * Elevação/halo discretos no hover, estado pressionado, foco de teclado explícito,
 * seleção persistente e transições curtas. Movimento só em motion-safe.
 */
const BASE =
  "group relative w-full rounded-xl border text-left outline-none " +
  "motion-safe:transition-[transform,box-shadow,border-color,background-color] motion-safe:duration-150 " +
  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const IDLE =
  "border-border/60 bg-card/70 backdrop-blur " +
  "hover:border-primary/45 hover:bg-card/90 hover:shadow-[var(--shadow-glow)] motion-safe:hover:-translate-y-[3px] " +
  "active:translate-y-0 active:shadow-none";

const SELECTED =
  "border-primary/70 bg-primary/10 shadow-[var(--shadow-glow)] " +
  "hover:border-primary/80 motion-safe:hover:-translate-y-[2px] active:translate-y-0";

export function InteractiveCard({
  selected = false,
  onOpen,
  className,
  children,
  label,
}: {
  selected?: boolean;
  onOpen?: () => void;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={selected}
      aria-label={label}
      data-state={selected ? "selected" : "idle"}
      className={cn(BASE, selected ? SELECTED : IDLE, "p-4", className)}
    >
      {children}
    </button>
  );
}

export function InteractiveRow({
  selected = false,
  onOpen,
  className,
  children,
  label,
}: {
  selected?: boolean;
  onOpen?: () => void;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={selected}
      aria-label={label}
      data-state={selected ? "selected" : "idle"}
      className={cn(
        BASE,
        selected
          ? "border-primary/60 bg-primary/10"
          : "border-border/50 bg-surface-1/40 hover:border-primary/40 hover:bg-surface-1/70 hover:shadow-[var(--shadow-glow)] motion-safe:hover:-translate-y-[2px] active:translate-y-0 active:shadow-none",
        "p-3 text-xs",
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Painel lateral contextual — padrão de inspeção (nunca modal central). */
export function ContextDetailSheet({
  open,
  onOpenChange,
  title,
  description,
  side = "right",
  children,
  footer,
  desktopHalf = false,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  side?: "right" | "bottom";
  children: ReactNode;
  footer?: ReactNode;
  desktopHalf?: boolean;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={side}
        className={cn(
          "flex w-full flex-col gap-0 border-border/60 bg-card/95 p-0 backdrop-blur sm:max-w-xl",
          desktopHalf ? "lg:w-1/2 lg:max-w-none" : "lg:max-w-2xl",
        )}
      >
        <SheetHeader className="border-b border-border/60 px-5 py-4 text-left">
          <SheetTitle className="font-display text-base">{title}</SheetTitle>
          {description ? (
            <SheetDescription className="text-xs">{description}</SheetDescription>
          ) : null}
        </SheetHeader>
        <div className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto px-5 py-4">
          {children}
        </div>
        {footer ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-5 py-3">
            {footer}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
