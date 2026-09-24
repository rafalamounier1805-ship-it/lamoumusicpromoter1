import { Link } from "@tanstack/react-router";
import { ExternalLink, Info, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Panel, TruthBadge } from "@/components/lamou/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { CrudSpec, SettingsStatus } from "@/lib/lamou/settings-data";

const STORAGE_KEY = "lamou.owner.settings.crud";

type Row = Record<string, string> & { id: string };

function loadRows(): Record<string, Row[]> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, Row[]>) : {};
  } catch {
    return {};
  }
}

export function InfoTip({ label, text }: { label: string; text: string }) {
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
        <TooltipContent className="max-w-xs text-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function StatusItem({ status }: { status: SettingsStatus }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-w-0 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">{status.title}</span>
            <TruthBadge truth={status.truth} />
          </span>
          <span className="mt-1 block truncate text-xs text-muted-foreground">
            Origem: {status.source}
          </span>
        </button>
        <InfoTip label={status.title} text={`${status.definition} Origem: ${status.source}.`} />
      </div>

      {open ? (
        <div className="mt-3 space-y-2 border-t border-border/50 pt-3 text-xs text-muted-foreground">
          <p>
            <span className="font-medium text-foreground/80">O que é: </span>
            {status.definition}
          </p>
          <p>
            <span className="font-medium text-foreground/80">Por que está nesse estado: </span>
            {status.reason}
          </p>
          <p>
            <span className="font-medium text-foreground/80">Próximo passo: </span>
            {status.nextStep}
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {status.destination ? (
              <Button asChild size="sm" variant="outline" className="h-8">
                <Link to={status.destination}>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  {status.actionLabel ?? "Abrir módulo"}
                </Link>
              </Button>
            ) : (
              <Button size="sm" variant="outline" className="h-8" disabled>
                Superfície ainda não conectada
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CrudBlock({ spec }: { spec: CrudSpec }) {
  const [rows, setRows] = useState<Row[]>([]);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadRows();
    const base = stored[spec.id] ?? (spec.seed as Row[]);
    // Seeds podem não trazer id: garante identidade estável para render e edição.
    setRows(base.map((r, i) => (r.id ? r : ({ ...r, id: `${spec.id}-seed-${i + 1}` } as Row))));
  }, [spec.id, spec.seed]);

  function persist(next: Row[]) {
    setRows(next);
    if (typeof window === "undefined") return;
    const all = loadRows();
    all[spec.id] = next;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function openNew() {
    setEditing({ id: "" } as Row);
    setForm(Object.fromEntries(spec.fields.map((f) => [f.key, f.options?.[0] ?? ""])));
    setError(null);
  }

  function openEdit(row: Row) {
    setEditing(row);
    setForm({ ...row });
    setError(null);
  }

  function save() {
    const missing = spec.fields.find((f) => f.required && !String(form[f.key] ?? "").trim());
    if (missing) {
      setError(`Informe ${missing.label.toLowerCase()}.`);
      return;
    }
    if (editing && editing.id) {
      persist(rows.map((r) => (r.id === editing.id ? ({ ...r, ...form } as Row) : r)));
    } else {
      const id = `${spec.id.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
      persist([...rows, { ...form, id } as Row]);
    }
    setEditing(null);
  }

  return (
    <Panel
      title={spec.title}
      action={
        <Button size="sm" variant="outline" className="h-8" onClick={openNew}>
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Novo
        </Button>
      }
    >
      <p className="text-xs text-muted-foreground">
        {spec.description} Persistência local do navegador (SYNTHETIC_DEMO): nada é gravado em banco
        nem promovido.
      </p>

      <div className="space-y-2">
        {rows.length === 0 ? (
          <p className="rounded-lg border border-border/50 bg-surface-1/40 p-3 text-xs text-muted-foreground">
            Nenhum registro. Use “Novo” para criar o primeiro.
          </p>
        ) : null}
        {rows.map((row) => (
          <div
            key={row.id}
            className="flex flex-wrap items-center gap-2 rounded-lg border border-border/50 bg-surface-1/40 p-3"
          >
            <Badge variant="outline" className="font-mono text-[10px]">
              {row.id}
            </Badge>
            <div className="flex min-w-0 flex-1 flex-wrap gap-x-3 gap-y-1">
              {spec.fields.map((f) => (
                <span key={f.key} className="text-xs">
                  <span className="text-muted-foreground">{f.label}: </span>
                  <span className="font-medium">{row[f.key] || "—"}</span>
                </span>
              ))}
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-8"
              onClick={() => openEdit(row)}
              aria-label={`Editar ${row.id}`}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Editar
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-destructive hover:text-destructive"
              onClick={() => persist(rows.filter((r) => r.id !== row.id))}
              aria-label={`Excluir ${row.id}`}
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Excluir
            </Button>
          </div>
        ))}
      </div>

      {editing ? (
        <div className="space-y-3 rounded-lg border border-primary/40 bg-primary/5 p-3">
          <p className="text-sm font-medium">
            {editing.id ? `Editar ${editing.id}` : "Novo registro"}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {spec.fields.map((f) => (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={`${spec.id}-${f.key}`} className="text-xs">
                  {f.label}
                  {f.required ? " *" : ""}
                </Label>
                {f.type === "select" ? (
                  <Select
                    value={form[f.key] ?? ""}
                    onValueChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))}
                  >
                    <SelectTrigger id={`${spec.id}-${f.key}`} className="h-9">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((o) => (
                        <SelectItem key={o} value={o}>
                          {o}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={`${spec.id}-${f.key}`}
                    type={f.type === "email" ? "email" : "text"}
                    className="h-9"
                    value={form[f.key] ?? ""}
                    onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  />
                )}
              </div>
            ))}
          </div>
          {error ? <p className="text-xs text-destructive">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="h-8" onClick={save}>
              Salvar registro local
            </Button>
            <Button size="sm" variant="ghost" className="h-8" onClick={() => setEditing(null)}>
              Cancelar
            </Button>
            <span className="self-center text-[11px] text-muted-foreground">SALVAR ≠ PROMOVER</span>
          </div>
        </div>
      ) : null}
    </Panel>
  );
}
