import type { PlanKey } from "@/lib/lamou/types";

/**
 * Fixtures do Cliente 360 — vida operacional pós-venda.
 * TODO o conteúdo é SYNTHETIC_DEMO: não há cliente real, cobrança real,
 * mensagem enviada nem integração conectada.
 */

export interface PackageDef {
  key: PlanKey;
  name: string;
  apps: string[];
  entitlements: string[];
  limits: { label: string; value: string }[];
  price: string;
  requiresApproval: boolean;
}

export const PACKAGES: PackageDef[] = [
  {
    key: "essencial",
    name: "Essencial",
    apps: ["Condomínio Reclame"],
    entitlements: ["Portal do cliente", "Documentos básicos"],
    limits: [
      { label: "Usuários", value: "até 5" },
      { label: "Armazenamento", value: "5 GB" },
      { label: "Ambientes", value: "1 (OFICIAL)" },
    ],
    price: "— / NOT_VERIFIED",
    requiresApproval: false,
  },
  {
    key: "profissional",
    name: "Profissional",
    apps: ["Condomínio Reclame", "Teste³ IA"],
    entitlements: ["Portal do cliente", "Documentos", "Evidências de teste"],
    limits: [
      { label: "Usuários", value: "até 25" },
      { label: "Armazenamento", value: "50 GB" },
      { label: "Ambientes", value: "2 (TESTE + OFICIAL)" },
    ],
    price: "— / NOT_VERIFIED",
    requiresApproval: true,
  },
  {
    key: "premium",
    name: "Premium",
    apps: ["Condomínio Reclame", "Teste³ IA", "Metration 360"],
    entitlements: [
      "Portal do cliente",
      "Documentos",
      "Evidências de teste",
      "Painel de resultados",
    ],
    limits: [
      { label: "Usuários", value: "até 100" },
      { label: "Armazenamento", value: "250 GB" },
      { label: "Ambientes", value: "3 (TESTE + HOMOLOGAÇÃO + OFICIAL)" },
    ],
    price: "— / NOT_VERIFIED",
    requiresApproval: true,
  },
  {
    key: "privado",
    name: "Privado / Enterprise",
    apps: ["Portfólio negociado por contrato"],
    entitlements: ["Escopo definido em contrato"],
    limits: [
      { label: "Usuários", value: "negociado" },
      { label: "Armazenamento", value: "negociado" },
      { label: "Ambientes", value: "negociado" },
    ],
    price: "— / NOT_VERIFIED",
    requiresApproval: true,
  },
];

export interface Invoice {
  id: string;
  period: string;
  amount: string;
  due: string;
  status: "em dia" | "em aberto" | "vencida" | "em análise";
}

export interface UpdateSchedule {
  id: string;
  version: string;
  window: string;
  owner: string;
  status: "agendada" | "concluída" | "falha" | "revertida";
  note: string;
}

export interface BackupItem {
  id: string;
  at: string;
  size: string;
  status: "concluído" | "parcial" | "não verificado";
  restoreTested: boolean;
}

export interface CommItem {
  id: string;
  event: string;
  template: string;
  channel: "e-mail" | "WhatsApp" | "SMS" | "portal";
  to: string;
  at: string;
  status: "preparada" | "agendada" | "não enviada";
}

export interface Client360 {
  contact: { name: string; role: string; email: string; phone: string };
  accountOwner: string;
  health: string;
  storage: string;
  users: string;
  environments: string;
  entitlements: string[];
  packageHistory: { at: string; from: string; to: string; reason: string }[];
  invoices: Invoice[];
  contractChanges: { at: string; text: string }[];
  currentVersion: string;
  channel: string;
  availableVersion: string | null;
  updates: UpdateSchedule[];
  backupPolicy: string;
  nextBackup: string;
  backups: BackupItem[];
  comms: CommItem[];
  clientCore: { name: string; state: string }[];
  timeline: { at: string; text: string }[];
}

const EMPTY_INVOICES: Invoice[] = [];

export const CLIENT_360: Record<string, Client360> = {
  "cli-meridiano": {
    contact: {
      name: "Síndica Helena Braga",
      role: "Síndica",
      email: "sindico@demo.local",
      phone: "+55 (31) 0000-0000",
    },
    accountOwner: "Rafael Lamounier",
    health: "Estável com pendência de storage isolado",
    storage: "18 GB de 50 GB",
    users: "14 ativos / 25 licenciados",
    environments: "TESTE + OFICIAL",
    entitlements: ["Portal do cliente", "Documentos", "Evidências de teste"],
    packageHistory: [
      { at: "2026-06-10", from: "—", to: "Profissional", reason: "Contratação inicial" },
    ],
    invoices: [
      {
        id: "FAT-2026-0091",
        period: "09/2026",
        amount: "— / NOT_VERIFIED",
        due: "2026-09-20",
        status: "em aberto",
      },
      {
        id: "FAT-2026-0082",
        period: "08/2026",
        amount: "— / NOT_VERIFIED",
        due: "2026-08-20",
        status: "em dia",
      },
    ],
    contractChanges: [{ at: "2026-06-10", text: "CT-2026-014 assinado — pacote Profissional" }],
    currentVersion: "0.9.3",
    channel: "OFICIAL",
    availableVersion: "0.9.4-candidata",
    updates: [
      {
        id: "UPD-0001",
        version: "0.9.3",
        window: "2026-09-02 01:00–02:00",
        owner: "Rafael Lamounier",
        status: "concluída",
        note: "Sem rollback registrado",
      },
    ],
    backupPolicy: "Diário 03:00 · retenção 30 dias (política declarada, execução não conectada)",
    nextBackup: "não agendado por sistema conectado",
    backups: [
      {
        id: "BKP-0007",
        at: "2026-09-14 03:00",
        size: "— / NOT_VERIFIED",
        status: "não verificado",
        restoreTested: false,
      },
    ],
    comms: [
      {
        id: "MSG-0001",
        event: "Boas-vindas",
        template: "TPL-WELCOME",
        channel: "e-mail",
        to: "sindico@demo.local",
        at: "2026-06-10",
        status: "não enviada",
      },
    ],
    clientCore: [
      { name: "CORE Cliente (sintetizado)", state: "declarado — não conectado" },
      { name: "Condomínio Reclame", state: "licenciado" },
      { name: "Teste³ IA", state: "licenciado" },
    ],
    timeline: [
      { at: "2026-09-06", text: "Chamado aberto: dúvida sobre prova de envio" },
      { at: "2026-09-02", text: "Atualização 0.9.3 aplicada no ambiente OFICIAL" },
      { at: "2026-06-10", text: "Cliente criado" },
    ],
  },
  "cli-aurora": {
    contact: {
      name: "Conselho Aurora",
      role: "Conselho",
      email: "conselho@demo.local",
      phone: "—",
    },
    accountOwner: "Rafael Lamounier",
    health: "Piloto em avaliação",
    storage: "1 GB de 5 GB",
    users: "3 ativos / 5 licenciados",
    environments: "TESTE",
    entitlements: ["Portal do cliente"],
    packageHistory: [{ at: "2026-08-29", from: "—", to: "Essencial", reason: "Piloto" }],
    invoices: EMPTY_INVOICES,
    contractChanges: [{ at: "2026-08-29", text: "Proposta registrada — piloto sem cobrança" }],
    currentVersion: "0.9.2",
    channel: "TESTE",
    availableVersion: "0.9.3",
    updates: [],
    backupPolicy: "Não definida para ambiente de piloto",
    nextBackup: "não agendado",
    backups: [],
    comms: [],
    clientCore: [
      { name: "CORE Cliente (sintetizado)", state: "declarado — não conectado" },
      { name: "Condomínio Reclame", state: "licenciado" },
    ],
    timeline: [
      { at: "2026-08-30", text: "Ambiente TESTE criado" },
      { at: "2026-08-29", text: "Piloto iniciado" },
    ],
  },
};

export const CLIENT_360_FALLBACK: Client360 = {
  contact: { name: "—", role: "—", email: "—", phone: "—" },
  accountOwner: "Rafael Lamounier",
  health: "sem ficha operacional preenchida",
  storage: "— / NOT_VERIFIED",
  users: "— / NOT_VERIFIED",
  environments: "— / NOT_VERIFIED",
  entitlements: [],
  packageHistory: [],
  invoices: EMPTY_INVOICES,
  contractChanges: [],
  currentVersion: "— / NOT_VERIFIED",
  channel: "— / NOT_VERIFIED",
  availableVersion: null,
  updates: [],
  backupPolicy: "não definida",
  nextBackup: "não agendado",
  backups: [],
  comms: [],
  clientCore: [],
  timeline: [],
};

export const MSG_TEMPLATES: Record<
  string,
  (ctx: { client: string; a?: string; b?: string }) => string
> = {
  packageChange: ({ client, a, b }) =>
    `Olá, ${client}.\n\nRegistramos a alteração do seu pacote LAMOU de ${a} para ${b}.\n` +
    `Os aplicativos e limites do novo pacote passam a valer conforme o contrato vigente.\n` +
    `Qualquer efeito de cobrança será confirmado por Comercial & Contratos.\n\nEquipe LAMOU IA.`,
  preUpdate: ({ client, a, b }) =>
    `Olá, ${client}.\n\nSua atualização para a versão ${b} está agendada para ${a}.\n` +
    `Faremos backup prévio e validação antes de aplicar; avisaremos ao concluir.\n\nEquipe LAMOU IA.`,
};
