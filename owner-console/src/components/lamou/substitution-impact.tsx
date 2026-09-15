import { Link } from "@tanstack/react-router";
import { Workflow } from "lucide-react";
import { useState } from "react";

import { TruthBadge } from "@/components/lamou/shell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/**
 * Prévia governada de substituição de plugin / provider / modelo.
 * Nenhum percentual é estimado: sem benchmark real, o impacto fica NOT_VERIFIED.
 * A aplicação permanece NOT_CONNECTED. SALVAR ≠ PROMOVER.
 */
export const SUBSTITUTION_DIMENSIONS: readonly (readonly [string, string])[] = [
  ["Capabilities ganhas/perdidas", "Não mensuradas; depende do candidato selecionado."],
  [
    "Apps, módulos e CALLs",
    "Consumidores ainda não reconciliados para uma substituição específica.",
  ],
  ["Compatibilidade", "Não testada."],
  ["Qualidade / score de testes", "0 testes comparativos executados."],
  ["Latência", "Sem medição de baseline ou candidato."],
  ["Custo / consumo", "Quota e unidade de custo não configuradas."],
  ["Segurança / permissões / scopes", "Scopes do candidato ainda não declarados."],
  ["Cobertura de dados / fontes", "Cobertura não verificada."],
  ["Fallback / recovery", "Sem fallback validado."],
  ["Risco operacional", "Alto enquanto compatibilidade, segurança e recovery não forem testados."],
];

export interface SubstitutionImpactProps {
  /** Item em uso hoje (SOL). */
  currentLabel: string;
  currentTruth?: string;
  /** Candidato pretendido. */
  candidateLabel: string;
  candidateTruth?: string;
  /** Fallback/recovery declarado para a troca. */
  fallback: string;
  /** Risco operacional conhecido da substituição. */
  risk: string;
  /** Origem/data do benchmark documentado. */
  evidence: string;
  triggerLabel?: string;
  triggerClassName?: string;
}

export function SubstitutionImpactPreview({
  currentLabel,
  currentTruth = "NOT_CONNECTED",
  candidateLabel,
  candidateTruth = "NOT_VERIFIED",
  fallback,
  risk,
  evidence,
  triggerLabel = "Prévia de substituição",
  triggerClassName = "mt-2 w-full sm:w-auto",
}: SubstitutionImpactProps) {
  const [criticalAcknowledged, setCriticalAcknowledged] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className={triggerClassName}>
          <Workflow className="h-4 w-4" aria-hidden="true" />
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="pr-8">
          <SheetTitle>Impacto da substituição</SheetTitle>
          <SheetDescription>
            Comparação prévia, sem aplicar alterações no SOL. SALVAR ≠ PROMOVER.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-5 space-y-4">
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <div className="rounded-lg border border-border bg-surface-1 p-3">
              <p className="text-xs text-muted-foreground">Atual</p>
              <p className="mt-1 text-sm font-medium">{currentLabel}</p>
              <TruthBadge truth={currentTruth} />
            </div>
            <span className="text-center text-xs font-medium text-muted-foreground">→</span>
            <div className="rounded-lg border border-border bg-surface-1 p-3">
              <p className="text-xs text-muted-foreground">Novo</p>
              <p className="mt-1 text-sm font-medium">{candidateLabel}</p>
              <TruthBadge truth={candidateTruth} />
            </div>
          </div>

          <div className="rounded-lg border border-warning/40 bg-warning/10 p-3">
            <p className="text-sm font-semibold">Impacto percentual não verificado</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Não existe benchmark real suficiente para calcular redução ou ganho percentual. Nenhum
              número foi estimado.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
              <p className="font-medium">Risco operacional</p>
              <p className="mt-1 text-muted-foreground">{risk}</p>
            </div>
            <div className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
              <p className="font-medium">Fallback / recovery</p>
              <p className="mt-1 text-muted-foreground">{fallback}</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dimensão</TableHead>
                  <TableHead>Diferença conhecida</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {SUBSTITUTION_DIMENSIONS.map(([dimension, known]) => (
                  <TableRow key={dimension}>
                    <TableCell className="font-medium">{dimension}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{known}</TableCell>
                    <TableCell>
                      <TruthBadge truth="NOT_VERIFIED" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="rounded-lg border border-border bg-surface-1 p-3 text-xs">
            <p className="font-medium">Evidência e benchmark</p>
            <p className="mt-1 text-muted-foreground">{evidence}</p>
          </div>

          <label className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <Checkbox
              checked={criticalAcknowledged}
              onCheckedChange={(value) => setCriticalAcknowledged(Boolean(value))}
              aria-label="Confirmar ciência das perdas críticas não verificadas"
              className="mt-0.5"
            />
            <span className="text-xs">
              Confirmo que compatibilidade, segurança e recovery ainda não foram validados e podem
              causar perda crítica.
            </span>
          </label>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Button asChild variant="outline" size="sm">
              <Link to="/labtest">Testar antes no LABTEST</Link>
            </Button>
            <Button variant="outline" size="sm" disabled>
              Aplicação ainda não conectada
            </Button>
          </div>
          {criticalAcknowledged ? (
            <p className="text-xs text-muted-foreground">
              Ciência registrada apenas nesta sessão. A aplicação continua bloqueada até existir
              integração, teste one-change-at-a-time e evidência aprovada.
            </p>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Slots de plugin/provider/modelo sujeitos a troca governada. */
export const SUBSTITUTION_SLOTS = [
  {
    id: "SLOT-AI-MODEL",
    label: "Provider e modelo de IA",
    current: "Nenhum provider conectado",
    candidate: "Provider/modelo candidato (a definir)",
    scope: "análise de casos, hipóteses, rascunhos",
    fallback: "timeout 30s · sem fallback definido",
    risk: "Perda de capability de análise se o candidato não cobrir os mesmos escopos; sem teste comparativo.",
  },
  {
    id: "SLOT-STORAGE",
    label: "Storage de evidências",
    current: "Nenhum storage conectado",
    candidate: "Storage candidato (a definir)",
    scope: "anexos, relatórios, provas de teste",
    fallback: "sem fallback · evidência não persiste",
    risk: "Evidência aprovada pode ficar inacessível; retenção e permissões não declaradas.",
  },
  {
    id: "SLOT-ANALYTICS",
    label: "Analytics / telemetria",
    current: "Nenhuma telemetria conectada",
    candidate: "Provider de telemetria candidato (a definir)",
    scope: "uso das superfícies do proprietário",
    fallback: "degradação silenciosa",
    risk: "Indicadores de saúde e observabilidade perdem série histórica na troca.",
  },
  {
    id: "SLOT-PLUGIN",
    label: "Plugins e integrações permitidas",
    current: "Nenhuma integração conectada",
    candidate: "Plugin/adaptador candidato (a definir)",
    scope: "repositório, documentos, reuniões",
    fallback: "operação manual",
    risk: "CALLs dependentes podem quebrar contrato, escopo ou auth sem teste one-change-at-a-time.",
  },
] as const;

/**
 * Painel de troca governada, reutilizado em Configurações (Central) e no CORE.
 * A confirmação só existe depois da comparação Atual → Novo.
 */
export function SubstitutionGovernancePanel({ context }: { context: "central" | "core" }) {
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {context === "core"
          ? "Trocar plugin, provider ou modelo exige comparação Atual → Novo com risco e fallback antes de confirmar. Nenhuma substituição é aplicada no SOL a partir desta tela."
          : "Nenhuma troca de plugin, provider ou modelo é feita às cegas: a comparação Atual → Novo abre antes de qualquer confirmação."}
      </p>
      {SUBSTITUTION_SLOTS.map((slot) => (
        <div key={slot.id} className="rounded-lg border border-border/60 bg-surface-1/40 p-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] text-muted-foreground">{slot.id}</span>
            <span className="min-w-0 flex-1 text-sm font-medium">{slot.label}</span>
            <TruthBadge truth="NOT_CONNECTED" />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Atual: {slot.current} · escopo: {slot.scope} · fallback: {slot.fallback}
          </p>
          <SubstitutionImpactPreview
            currentLabel={slot.current}
            candidateLabel={slot.candidate}
            risk={slot.risk}
            fallback={slot.fallback}
            evidence={`Fonte: LABTEST LT-PROV-0001 · ${slot.id} · atualização documental 12/09/2026 · 0 testes comparativos concluídos. Estado NOT_CONNECTED.`}
            triggerLabel="Comparar Atual → Novo"
          />
        </div>
      ))}
    </div>
  );
}
