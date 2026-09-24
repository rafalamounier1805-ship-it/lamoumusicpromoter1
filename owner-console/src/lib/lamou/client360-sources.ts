import type { TruthState } from "@/lib/lamou/council-data";

export const CLIENT360_TABS = [
  "Visão geral",
  "Pacote & Entitlements",
  "Cobrança & Contrato",
  "Versões & Atualizações",
  "Backup & Restore",
  "Comunicações",
  "Apps & CORE",
  "Suporte & Timeline",
] as const;

export type Client360Domain =
  | "perfil"
  | "pacote"
  | "cobranca-fixture"
  | "cobranca-db"
  | "gateway"
  | "versoes"
  | "backup"
  | "comunicacoes"
  | "apps-core"
  | "suporte";

export interface Client360Source {
  domain: Client360Domain;
  source: string;
  truth: TruthState;
  executor: "fixture" | "database" | "external" | "none";
  note: string;
}

export const CLIENT360_SOURCES: Client360Source[] = [
  {
    domain: "perfil",
    source: "CLIENTS fixture local",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Cadastro exibido pela ficha do Cliente 360 ainda não é um domínio real consolidado.",
  },
  {
    domain: "pacote",
    source: "CLIENT_360 fixture + catálogo de pacotes",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Alterar pacote registra evento local; entitlement real não é aplicado.",
  },
  {
    domain: "cobranca-fixture",
    source: "CLIENT_360 invoices fixture",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Faturas da ficha são dados de demonstração.",
  },
  {
    domain: "cobranca-db",
    source: "billing_charges com sessão Owner/RLS",
    truth: "PARTIAL",
    executor: "database",
    note: "Registros reais podem existir no banco; não significam cobrança processada por gateway.",
  },
  {
    domain: "gateway",
    source: "gateway de pagamento / emissão fiscal",
    truth: "NOT_CONNECTED",
    executor: "none",
    note: "Nenhum pagamento, emissão ou conciliação externa é executado pelo Cliente 360.",
  },
  {
    domain: "versoes",
    source: "CLIENT_360 updates fixture",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Agendamento local não executa atualização nem rollback no ambiente do cliente.",
  },
  {
    domain: "backup",
    source: "CLIENT_360 backups fixture",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Não existe executor de backup/restore conectado; fixture nunca equivale a backup OK.",
  },
  {
    domain: "comunicacoes",
    source: "rascunhos locais de comunicação",
    truth: "NOT_CONNECTED",
    executor: "none",
    note: "E-mail, WhatsApp e SMS não são enviados.",
  },
  {
    domain: "apps-core",
    source: "CLIENT_360 clientCore fixture",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Bindings do CORE Cliente ainda não vêm de provisionamento real.",
  },
  {
    domain: "suporte",
    source: "CLIENTS fixture + eventos locais da sessão",
    truth: "SYNTHETIC_DEMO",
    executor: "fixture",
    note: "Não existe backend de SAC conectado nesta candidata.",
  },
];

export function client360Source(domain: Client360Domain): Client360Source {
  const found = CLIENT360_SOURCES.find((item) => item.domain === domain);
  if (!found) throw new Error(`Fonte do Cliente 360 não definida: ${domain}`);
  return found;
}
