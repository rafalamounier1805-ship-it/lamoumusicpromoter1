import { useState } from "react";

import { LivePanel } from "@/components/lamou/core-live-panels";
import { CrudBlock, StatusItem } from "@/components/lamou/governed-crud";
import { Panel, TruthBadge } from "@/components/lamou/shell";
import { SubstitutionGovernancePanel } from "@/components/lamou/substitution-impact";
import { SETTINGS_SECTIONS, type SettingsSection } from "@/lib/lamou/settings-data";
import { cn } from "@/lib/utils";

export function SettingsView({
  sections = SETTINGS_SECTIONS,
  context = "central",
}: {
  sections?: SettingsSection[];
  context?: "central" | "core";
}) {
  const SECTIONS = sections.length > 0 ? sections : SETTINGS_SECTIONS;
  const [active, setActive] = useState(SECTIONS[0]!.id);
  const section = SECTIONS.find((s) => s.id === active) ?? SECTIONS[0]!;

  return (
    <div className="grid gap-4 lg:grid-cols-[260px_minmax(0,1fr)]">
      <nav aria-label="Menu de configurações" className="min-w-0 lg:sticky lg:top-4 lg:self-start">
        <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const selected = s.id === section.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setActive(s.id)}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs outline-none motion-safe:transition-colors focus-visible:ring-2 focus-visible:ring-ring lg:w-full",
                  selected
                    ? "border-primary/60 bg-primary/10 text-foreground"
                    : "border-border/50 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate font-medium">{s.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="min-w-0 space-y-4">
        <div className="rounded-xl border border-border/60 bg-card/70 p-4 backdrop-blur">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="min-w-0 flex-1 font-display text-lg font-semibold">{section.title}</h2>
            <TruthBadge truth={section.truth} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{section.subtitle}</p>
        </div>

        <Panel title="Estado e origem">
          <div className="space-y-2">
            {section.statuses.map((s) => (
              <StatusItem key={s.title} status={s} />
            ))}
          </div>
        </Panel>

        {section.live ? <LivePanel key={section.live} id={section.live} /> : null}

        {section.crud ? <CrudBlock key={section.crud.id} spec={section.crud} /> : null}

        {section.substitution ? (
          <Panel title="Troca de plugin, provider ou modelo">
            <SubstitutionGovernancePanel context={context} />
          </Panel>
        ) : null}
      </div>
    </div>
  );
}
