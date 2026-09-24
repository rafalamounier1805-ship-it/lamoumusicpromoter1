import { Link } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useState } from "react";

import { CrudBlock, StatusItem } from "@/components/lamou/governed-crud";
import { Panel } from "@/components/lamou/shell";
import { Button } from "@/components/ui/button";
import { RADAR_OPPORTUNITY_PROMPT } from "@/lib/lamou/b144-candidate";
import { CLIENTS, CONTRACTS } from "@/lib/lamou/demo-data";
import type { CrudSpec, SettingsStatus } from "@/lib/lamou/settings-data";
import { PLAN_LABEL } from "@/lib/lamou/types";
import { cn } from "@/lib/utils";

const CLIENT_CRUD: CrudSpec = {
  id: "com-clients",
  title: "Clientes comerciais",
  description: "Empresa, segmento, plano e ambiente. A ficha completa fica em Central > Clientes.",
  fields: [
    { key: "empresa", label: "Empresa", type: "text", required: true },
    { key: "segmento", label: "Segmento", type: "text", required: true },
    {
      key: "plano",
      label: "Plano",
      type: "select",
      options: Object.values(PLAN_LABEL),
    },
    { key: "ambiente", label: "Ambiente", type: "select", options: ["TESTE", "OFICIAL"] },
    { key: "contrato", label: "Contrato vinculado", type: "text" },
  ],
  seed: CLIENTS.map((c) => ({
    id: c.id.toUpperCase(),
    empresa: c.name,
    segmento: c.segment,
    plano: PLAN_LABEL[c.plan],
    ambiente: c.environment,
    contrato: c.contractId,
  })),
};

const CONTRACT_CRUD: CrudSpec = {
  id: "com-contracts",
  title: "Contratos",
  description: "Contrato, plano, status e licenças declaradas. Valores não auditados.",
  fields: [
    { key: "contrato", label: "Contrato", type: "text", required: true },
    { key: "empresa", label: "Empresa", type: "text", required: true },
    { key: "plano", label: "Plano", type: "select", options: Object.values(PLAN_LABEL) },
    {
      key: "status",
      label: "Status",
      type: "select",
      options: ["ativo", "em negociação", "suspenso"],
    },
    { key: "licencas", label: "Licenças (usuários/dispositivos)", type: "text" },
  ],
  seed: CONTRACTS.map((c) => ({
    id: c.id,
    contrato: c.id,
    empresa: c.company,
    plano: PLAN_LABEL[c.plan],
    status: c.status,
    licencas: `${c.licenses.users} / ${c.licenses.devices}`,
  })),
};

const BILLING_CRUD: CrudSpec = {
  id: "com-billing",
  title: "Cobranças",
  description: "Ciclo, empresa e situação declarada. Nenhuma cobrança é emitida por esta tela.",
  fields: [
    { key: "ciclo", label: "Ciclo", type: "text", required: true },
    { key: "empresa", label: "Empresa", type: "text", required: true },
    { key: "contrato", label: "Contrato", type: "text" },
    {
      key: "situacao",
      label: "Situação",
      type: "select",
      options: ["em dia", "pendente", "em análise", "inadimplente"],
    },
  ],
  seed: CONTRACTS.map((c) => ({
    id: `COB-${c.id.slice(-6)}`,
    ciclo: "Ciclo corrente",
    empresa: c.company,
    contrato: c.id,
    situacao: c.payments[0]?.status ?? "em análise",
  })),
};

const PENDING_CRUD: CrudSpec = {
  id: "com-pendings",
  title: "Pendências comerciais",
  description: "Pendência, responsável, prazo e criticidade — registro local governado.",
  fields: [
    { key: "pendencia", label: "Pendência", type: "text", required: true },
    { key: "empresa", label: "Empresa", type: "text", required: true },
    { key: "responsavel", label: "Responsável", type: "text" },
    { key: "prazo", label: "Prazo", type: "text" },
    {
      key: "criticidade",
      label: "Criticidade",
      type: "select",
      options: ["baixa", "média", "alta", "crítica"],
    },
  ],
  seed: [
    {
      id: "PEN-000001",
      pendencia: "Valor contratado não informado no app",
      empresa: CONTRACTS[0]?.company ?? "—",
      responsavel: "Proprietário",
      prazo: "não definido",
      criticidade: "alta",
    },
    {
      id: "PEN-000002",
      pendencia: "Entitlements sem binding técnico reconciliado",
      empresa: CONTRACTS[1]?.company ?? "—",
      responsavel: "Proprietário",
      prazo: "não definido",
      criticidade: "média",
    },
  ],
};

const STATUSES: SettingsStatus[] = [
  {
    title: "Faturamento e emissão",
    definition: "Serviço que emite cobrança e concilia pagamento.",
    source: "Provider financeiro",
    truth: "NOT_CONNECTED",
    reason: "Nenhum provider financeiro conectado: nada é cobrado nem conciliado a partir daqui.",
    nextStep: "Conectar provider financeiro antes de tratar cobrança como real.",
    destination: "/owner/integrations",
    actionLabel: "Configurar",
  },
  {
    title: "Entitlements × binding técnico",
    definition: "O que o contrato libera precisa corresponder ao que o CORE entrega.",
    source: "CORE > Apps & Bindings",
    truth: "PARTIAL",
    reason: "Entitlements declarados; reconciliação com capabilities pendente.",
    nextStep: "Reconciliar entitlement com capability e CALL por app.",
    destination: "/core/architecture",
    actionLabel: "Abrir módulo",
  },
  {
    title: "Valores e receita",
    definition: "Receita recorrente, potencial e método de cálculo.",
    source: "Contratos (fixtures)",
    truth: "NOT_VERIFIED",
    reason: "Valores não informados no app; nenhum número é estimado.",
    nextStep: "Registrar valores no contrato e anexar evidência documental.",
    destination: "/owner/documents",
    actionLabel: "Abrir origem",
  },
];

const TABS = [
  { id: "clients", label: "Clientes", crud: CLIENT_CRUD },
  { id: "contracts", label: "Contratos", crud: CONTRACT_CRUD },
  { id: "billing", label: "Cobranças", crud: BILLING_CRUD },
  { id: "pendings", label: "Pendências", crud: PENDING_CRUD },
] as const;

export function CommercialView() {
  const [tab, setTab] = useState<string>(TABS[0].id);
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <div className="space-y-4">
      <Panel title="Comercial — Showroom & Radar de Oportunidades">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
            <p className="text-sm font-medium">LAMOU Showroom V0.4</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Módulo comercial independente para demonstração de soluções, ligado a esta área sem
              ser absorvido pelo Comercial.
            </p>
            <Button asChild size="sm" variant="outline" className="mt-3">
              <Link to="/apps/showroom">Abrir Showroom</Link>
            </Button>
          </div>
          <div className="rounded-lg border border-border/50 bg-surface-1/40 p-3">
            <p className="text-sm font-medium">Radar de Oportunidades</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Prompt compartilhado: {RADAR_OPPORTUNITY_PROMPT.id}. Comercial e Oportunidades usam o
              mesmo opportunity_id e a mesma proveniência; runtime ainda NOT_CONNECTED.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button asChild size="sm" variant="outline">
                <Link to="/owner/opportunities">Abrir Radar</Link>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <Link to="/apps/opportunity-intelligence">Opportunity Intelligence</Link>
              </Button>
            </div>
          </div>
        </div>
      </Panel>

      <Panel
        title="Estado e origem"
        action={
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link to="/owner/clients">
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Abrir ficha do cliente
            </Link>
          </Button>
        }
      >
        <div className="space-y-2">
          {STATUSES.map((s) => (
            <StatusItem key={s.title} status={s} />
          ))}
        </div>
      </Panel>

      <div
        role="tablist"
        aria-label="Seções comerciais"
        className="flex flex-wrap gap-2 rounded-xl border border-border/60 bg-card/70 p-2 backdrop-blur"
      >
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={t.id === current.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium outline-none motion-safe:transition-colors focus-visible:ring-2 focus-visible:ring-ring",
              t.id === current.id
                ? "border-primary/60 bg-primary/10 text-foreground"
                : "border-border/50 bg-surface-1/40 text-muted-foreground hover:border-primary/40 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <CrudBlock key={current.crud.id} spec={current.crud} />

      <Panel title="Ligação com a ficha do cliente">
        <p className="text-xs text-muted-foreground">
          Cliente, contrato, cobrança e pendência se encontram na ficha Cliente 360, onde ficam
          implantação, apps, testes, documentos e suporte. Provisionamento continua sendo disparado
          em Central &gt; Clientes.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm" variant="outline" className="h-8">
            <Link to="/owner/clients">Central &gt; Clientes</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-8">
            <Link to="/owner/plans">Planos &amp; melhorias</Link>
          </Button>
          <Button asChild size="sm" variant="ghost" className="h-8">
            <Link to="/core/architecture">Binding técnico</Link>
          </Button>
        </div>
      </Panel>
    </div>
  );
}
