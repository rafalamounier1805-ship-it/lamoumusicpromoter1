import {
  Activity,
  Bell,
  Boxes,
  Brain,
  Building2,
  Coins,
  Database,
  FlaskConical,
  HardDriveDownload,
  KeyRound,
  Layers,
  Palette,
  Plug,
  ScrollText,
  ShieldCheck,
  ToggleLeft,
  UserCog,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/** Rotas reais já existentes: nenhum CTA aponta para superfície inexistente. */
export type SettingsRoute =
  | "/owner"
  | "/owner/clients"
  | "/owner/apps"
  | "/owner/products"
  | "/owner/plans"
  | "/owner/security"
  | "/owner/documents"
  | "/owner/integrations"
  | "/owner/versions"
  | "/owner/tests"
  | "/owner/commercial"
  | "/owner/mapa-vivo"
  | "/core"
  | "/core/ai"
  | "/core/architecture"
  | "/core/data"
  | "/core/security"
  | "/core/tests"
  | "/core/observability"
  | "/core/versions"
  | "/core/calls"
  | "/labtest"
  | "/install/owner"
  | "/install/client";

export interface SettingsStatus {
  title: string;
  /** Definição curta exibida no “i”. */
  definition: string;
  /** De onde vem a informação. */
  source: string;
  truth: string;
  /** Por que está nesse estado. */
  reason: string;
  /** Próximo passo objetivo. */
  nextStep: string;
  destination?: SettingsRoute;
  actionLabel?: string;
}

export type FieldType = "text" | "email" | "select";

export interface CrudField {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
}

export interface CrudSpec {
  id: string;
  title: string;
  description: string;
  fields: CrudField[];
  /** Registros iniciais: persistência local DEMO, nunca dado real de operação. */
  seed: Record<string, string>[];
}

export interface SettingsSection {
  id: string;
  label: string;
  icon: LucideIcon;
  title: string;
  subtitle: string;
  truth: string;
  statuses: SettingsStatus[];
  crud?: CrudSpec;
  /** Mostra a prévia governada de substituição de plugin/provider/modelo. */
  substitution?: boolean;
  /** Painel ligado a backend real (dados medidos/persistidos). */
  live?: "providers" | "billing" | "storage" | "sol";
}

const rid = (p: string, n: number) => `${p}-${String(n).padStart(4, "0")}`;

export const SETTINGS_SECTIONS: SettingsSection[] = [
  {
    id: "workspace",
    label: "Workspace",
    icon: Building2,
    title: "Workspace do proprietário",
    subtitle: "Identidade do ambiente, fuso, idioma e limites do workspace Owner.",
    truth: "PARTIAL",
    statuses: [
      {
        title: "Identidade do workspace",
        definition: "Nome, marca e ambiente exibidos em todas as superfícies Owner.",
        source: "Instalação do Proprietário · registro local",
        truth: "PARTIAL",
        reason: "Definido na instalação, sem persistência em banco.",
        nextStep: "Revisar identidade na instalação até existir tabela de workspace.",
        destination: "/install/owner",
        actionLabel: "Abrir origem",
      },
      {
        title: "Separação Owner × Cliente",
        definition: "O workspace Owner nunca compartilha dados com tenants de cliente.",
        source: "Arquitetura canônica",
        truth: "IMPLEMENTED_NOT_VERIFIED",
        reason: "Regra implementada na navegação; isolamento não testado com dados reais.",
        nextStep: "Testar isolamento por tenant no CORE.",
        destination: "/core/security",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "workspace-limits",
      title: "Limites e políticas do workspace",
      description: "Registro local governado; aplicar limite real depende de backend.",
      fields: [
        { key: "nome", label: "Limite / política", type: "text", required: true },
        { key: "valor", label: "Valor declarado", type: "text", required: true },
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["DOCUMENTED_ONLY", "NOT_CONNECTED", "PARTIAL"],
        },
      ],
      seed: [
        {
          id: rid("WS", 1),
          nome: "Sessões simultâneas",
          valor: "não definido",
          estado: "NOT_CONNECTED",
        },
        {
          id: rid("WS", 2),
          nome: "Retenção de auditoria",
          valor: "não definida",
          estado: "DOCUMENTED_ONLY",
        },
      ],
    },
  },
  {
    id: "owner",
    label: "Proprietário",
    icon: UserCog,
    title: "Perfil do proprietário",
    subtitle: "Dados do responsável pelo ambiente, contato e continuidade.",
    truth: "PARTIAL",
    statuses: [
      {
        title: "Perfil e responsável principal",
        definition: "Nome, cargo, empresa, e-mail e responsável pelo ambiente.",
        source: "Instalação do Proprietário · etapa Identidade",
        truth: "PARTIAL",
        reason: "Coletado na instalação; sem storage conectado, o avatar é preview local.",
        nextStep: "Concluir identidade e conectar storage de perfil.",
        destination: "/install/owner",
        actionLabel: "Abrir origem",
      },
      {
        title: "Plano B / sucessão do ambiente",
        definition: "Quem assume o ambiente em caso de indisponibilidade do proprietário.",
        source: "Documentação viva",
        truth: "DOCUMENTED_ONLY",
        reason: "Procedimento descrito, sem execução nem chave de recuperação implementada.",
        nextStep: "Registrar procedimento no Documento Vivo e validar em teste.",
        destination: "/owner/documents",
        actionLabel: "Abrir origem",
      },
    ],
  },
  {
    id: "users",
    label: "Usuários",
    icon: Users,
    title: "Usuários do ambiente Owner",
    subtitle: "Cadastro local governado; criação de credencial real depende de Auth.",
    truth: "SYNTHETIC_DEMO",
    statuses: [
      {
        title: "Provedor de identidade / Auth",
        definition: "Serviço que cria e autentica credenciais reais.",
        source: "Backend do projeto",
        truth: "NOT_CONNECTED",
        reason: "Auth ainda não conectado a esta candidata; nenhuma credencial é criada aqui.",
        nextStep: "Conectar Auth e definir política de convite antes de qualquer acesso real.",
        destination: "/owner/security",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "users",
      title: "Usuários",
      description: "Criar, editar e remover registros locais. Nenhum convite é enviado.",
      fields: [
        { key: "nome", label: "Nome", type: "text", required: true },
        { key: "email", label: "E-mail", type: "email", required: true },
        {
          key: "papel",
          label: "Papel",
          type: "select",
          options: ["Proprietário", "Administrador", "Operador", "Auditor", "Convidado"],
        },
        {
          key: "mfa",
          label: "MFA",
          type: "select",
          options: ["não configurado", "pendente", "declarado"],
        },
      ],
      seed: [
        {
          id: rid("USR", 1),
          nome: "Proprietário do ambiente",
          email: "não informado",
          papel: "Proprietário",
          mfa: "não configurado",
        },
      ],
    },
  },
  {
    id: "roles",
    label: "Papéis & permissões",
    icon: ShieldCheck,
    title: "Papéis e permissões",
    subtitle: "Papéis declarados e escopos por superfície. Aplicação real exige RLS.",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    statuses: [
      {
        title: "Aplicação de permissão no dado",
        definition: "Regra que impede leitura ou escrita fora do papel autorizado.",
        source: "Políticas de banco",
        truth: "NOT_CONNECTED",
        reason: "Papéis existem apenas como declaração; nenhuma política protege dados ainda.",
        nextStep: "Criar tabela de papéis e políticas antes de liberar acesso.",
        destination: "/core/security",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "roles",
      title: "Papéis",
      description: "Papel, escopo e ações permitidas — registro local governado.",
      fields: [
        { key: "papel", label: "Papel", type: "text", required: true },
        { key: "escopo", label: "Escopo", type: "text", required: true },
        {
          key: "critico",
          label: "Ações críticas",
          type: "select",
          options: ["bloqueadas", "com dupla autorização", "permitidas"],
        },
      ],
      seed: [
        {
          id: rid("ROL", 1),
          papel: "Proprietário",
          escopo: "todas as superfícies Owner",
          critico: "com dupla autorização",
        },
        {
          id: rid("ROL", 2),
          papel: "Auditor",
          escopo: "leitura de evidências e auditoria",
          critico: "bloqueadas",
        },
      ],
    },
  },
  {
    id: "mfa",
    label: "MFA & sessão",
    icon: KeyRound,
    title: "MFA, sessão e ações críticas",
    subtitle: "Segundo fator, duração de sessão e dupla autorização.",
    truth: "PARTIAL",
    statuses: [
      {
        title: "Segundo fator (app, SMS, e-mail)",
        definition: "Fator adicional exigido no acesso do proprietário.",
        source: "Instalação · etapa Segurança",
        truth: "NOT_CONNECTED",
        reason: "Escolha registrada localmente; nenhum fator é validado sem Auth.",
        nextStep: "Conectar Auth e ativar o fator escolhido.",
        destination: "/install/owner",
        actionLabel: "Abrir origem",
      },
      {
        title: "Duração de sessão e reautenticação",
        definition: "Tempo de sessão e quando pedir senha novamente.",
        source: "Instalação · etapa Segurança",
        truth: "PARTIAL",
        reason: "Preferência declarada, sem sessão real para aplicar.",
        nextStep: "Aplicar duração após conectar Auth.",
        destination: "/owner/security",
        actionLabel: "Abrir módulo",
      },
      {
        title: "Dupla autorização para ação crítica",
        definition: "Promoção, rollback e exclusão exigem segunda confirmação.",
        source: "Governança da candidata",
        truth: "IMPLEMENTED_NOT_VERIFIED",
        reason: "Confirmação existe na interface; não há trilha assinada.",
        nextStep: "Registrar confirmações em auditoria persistida.",
        destination: "/owner/versions",
        actionLabel: "Abrir módulo",
      },
    ],
  },
  {
    id: "clients",
    label: "Clientes & tenants",
    icon: Boxes,
    title: "Clientes e tenants",
    subtitle: "Provisionamento e isolamento por tenant. A gestão fica na Central.",
    truth: "SYNTHETIC_DEMO",
    statuses: [
      {
        title: "Provisionamento de cliente",
        definition: "Jornada própria que cria tenant, contrato e CORE Cliente.",
        source: "Central > Clientes",
        truth: "PARTIAL",
        reason: "Jornada existe; criação real de tenant depende de backend.",
        nextStep: "Disparar provisionamento a partir da ficha do cliente.",
        destination: "/owner/clients",
        actionLabel: "Abrir módulo",
      },
      {
        title: "Isolamento entre tenants",
        definition: "Um cliente nunca acessa dado de outro nem o CORE Proprietário.",
        source: "CORE > Segurança & Tenants",
        truth: "NOT_VERIFIED",
        reason: "Sem dados reais, o isolamento não foi testado.",
        nextStep: "Executar teste de isolamento e anexar evidência.",
        destination: "/core/security",
        actionLabel: "Rever teste",
      },
    ],
  },
  {
    id: "ai",
    label: "IA & modelos",
    icon: Brain,
    title: "IA, modelos e agentes",
    subtitle: "Provider, modelo, escopo, limites e substituição governada.",
    truth: "NOT_CONNECTED",
    statuses: [
      {
        title: "Provider de IA",
        definition: "Serviço que executa análise, hipótese e rascunho.",
        source: "CORE > IA, Prompts & Agentes",
        truth: "NOT_CONNECTED",
        reason: "Nenhum provider configurado: nenhuma resposta de IA é produzida ou simulada.",
        nextStep: "Configurar provider, escopo, timeout e fallback.",
        destination: "/core/ai",
        actionLabel: "Configurar",
      },
    ],
    substitution: true,
  },
  {
    id: "apis",
    label: "APIs & chaves",
    icon: Plug,
    title: "APIs, chaves e escopos",
    subtitle: "Segredos são server-side: nenhuma chave é digitada nesta tela.",
    truth: "NOT_CONNECTED",
    statuses: [
      {
        title: "Chaves e segredos",
        definition: "Credenciais de acesso a serviços externos.",
        source: "Cofre de segredos do backend",
        truth: "NOT_CONNECTED",
        reason: "Nenhuma chave está vinculada a esta candidata; o frontend não guarda segredo.",
        nextStep: "Registrar segredo no backend e declarar escopo no Registry.",
        destination: "/core/calls",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "api-scopes",
      title: "Escopos declarados",
      description: "Declaração de escopo e limite por API. Nenhum valor secreto é armazenado.",
      fields: [
        { key: "api", label: "API", type: "text", required: true },
        { key: "escopo", label: "Escopo autorizado", type: "text", required: true },
        { key: "limite", label: "Limite / quota", type: "text" },
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["NOT_CONNECTED", "DOCUMENTED_ONLY", "PARTIAL"],
        },
      ],
      seed: [
        {
          id: rid("API", 1),
          api: "Repositório de código",
          escopo: "leitura",
          limite: "não definido",
          estado: "NOT_CONNECTED",
        },
      ],
    },
    substitution: true,
  },
  {
    id: "integrations",
    label: "Integrações",
    icon: Layers,
    title: "Integrações e plugins",
    subtitle: "Contrato, auth, timeout, retry, fallback e evidência por integração.",
    truth: "NOT_CONNECTED",
    statuses: [
      {
        title: "Integrações permitidas",
        definition: "Serviços autorizados a ler ou escrever conforme escopo.",
        source: "Central > Integrações",
        truth: "NOT_CONNECTED",
        reason: "Nenhuma integração conectada; nenhum botão executa chamada real.",
        nextStep: "Conectar integração e validar contrato com teste.",
        destination: "/owner/integrations",
        actionLabel: "Configurar",
      },
      {
        title: "CALLs e contratos",
        definition: "Cada chamada declarada com origem, destino, auth e fallback.",
        source: "CALL Registry",
        truth: "PARTIAL",
        reason: "Contratos declarados; testes de contrato pendentes.",
        nextStep: "Executar teste de contrato por CALL.",
        destination: "/core/calls",
        actionLabel: "Rever teste",
      },
    ],
    substitution: true,
  },
  {
    id: "data",
    label: "Dados & fontes",
    icon: Database,
    title: "Dados, fontes e proveniência",
    subtitle: "Toda informação exibida deve poder voltar à fonte.",
    truth: "SYNTHETIC_DEMO",
    statuses: [
      {
        title: "Origem dos dados exibidos",
        definition: "Fonte, dono, atualização e truth-state de cada conjunto.",
        source: "CORE > Dados & Fontes",
        truth: "SYNTHETIC_DEMO",
        reason: "As telas usam fixtures identificados como sintéticos.",
        nextStep: "Conectar fonte real e reconciliar proveniência.",
        destination: "/core/data",
        actionLabel: "Abrir origem",
      },
    ],
  },
  {
    id: "notifications",
    label: "Notificações",
    icon: Bell,
    title: "Notificações e alertas",
    subtitle: "Regras locais de alerta; nenhum envio real acontece.",
    truth: "DOCUMENTED_ONLY",
    statuses: [
      {
        title: "Canal de envio",
        definition: "E-mail, push ou webhook usado para notificar.",
        source: "Provider de mensagens",
        truth: "NOT_CONNECTED",
        reason: "Sem provider conectado, nenhuma notificação sai do ambiente.",
        nextStep: "Conectar canal antes de ativar regra.",
        destination: "/owner/integrations",
        actionLabel: "Configurar",
      },
    ],
    crud: {
      id: "notification-rules",
      title: "Regras de notificação",
      description: "Evento, destino e criticidade — registro local governado.",
      fields: [
        { key: "evento", label: "Evento", type: "text", required: true },
        { key: "destino", label: "Destino", type: "text", required: true },
        {
          key: "criticidade",
          label: "Criticidade",
          type: "select",
          options: ["informativa", "atenção", "crítica"],
        },
      ],
      seed: [
        {
          id: rid("NTF", 1),
          evento: "Falha em CALL crítica",
          destino: "proprietário",
          criticidade: "crítica",
        },
        {
          id: rid("NTF", 2),
          evento: "Promoção de versão",
          destino: "proprietário",
          criticidade: "atenção",
        },
      ],
    },
  },
  {
    id: "backup",
    label: "Backup & restore",
    icon: HardDriveDownload,
    title: "Backup, restore e continuidade",
    subtitle: "Rotina, retenção e teste de restauração.",
    truth: "NOT_CONNECTED",
    statuses: [
      {
        title: "Rotina de backup",
        definition: "Frequência, escopo e retenção das cópias.",
        source: "Backend do projeto",
        truth: "NOT_CONNECTED",
        reason: "Sem backend conectado a esta candidata, nenhuma cópia é gerada aqui.",
        nextStep: "Definir rotina e escopo após conectar backend.",
        destination: "/core/versions",
        actionLabel: "Abrir módulo",
      },
      {
        title: "Teste de restauração",
        definition: "Prova de que o backup restaura o ambiente.",
        source: "Testes & Qualidade",
        truth: "NOT_VERIFIED",
        reason: "Nenhuma restauração foi executada nem evidenciada.",
        nextStep: "Executar restore em ambiente de teste e anexar evidência.",
        destination: "/core/tests",
        actionLabel: "Rever teste",
      },
    ],
  },
  {
    id: "environments",
    label: "Ambientes",
    icon: Activity,
    title: "Ambientes e promoção",
    subtitle: "SOL operacional, candidata e experimento. SALVAR ≠ PROMOVER.",
    truth: "PARTIAL",
    statuses: [
      {
        title: "Estado da candidata",
        definition: "Build atual e condição de promoção.",
        source: "Versões, Builds & Rollback",
        truth: "IMPLEMENTED_NOT_VERIFIED",
        reason: "Build é candidata; promoção depende de gates com evidência.",
        nextStep: "Rodar gates antes de qualquer promoção.",
        destination: "/core/versions",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "environments",
      title: "Ambientes declarados",
      description: "Nome, papel e estado — registro local governado.",
      fields: [
        { key: "nome", label: "Ambiente", type: "text", required: true },
        {
          key: "papel",
          label: "Papel",
          type: "select",
          options: ["SOL (operacional)", "LUA (candidata)", "LABTEST"],
        },
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["ativo", "candidato", "experimental", "congelado"],
        },
      ],
      seed: [
        { id: rid("ENV", 1), nome: "Preview Owner", papel: "LUA (candidata)", estado: "candidato" },
        { id: rid("ENV", 2), nome: "Laboratório", papel: "LABTEST", estado: "experimental" },
      ],
    },
  },
  {
    id: "appearance",
    label: "Aparência",
    icon: Palette,
    title: "Aparência e acessibilidade",
    subtitle: "Tema, densidade, movimento reduzido e modo Painel/TV.",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    statuses: [
      {
        title: "Tema e densidade",
        definition: "Dark tecnológico nas superfícies de gestão; light executivo na instalação.",
        source: "Design system LAMOU",
        truth: "IMPLEMENTED_VERIFIED",
        reason: "Tokens e componentes aplicados nas superfícies atuais.",
        nextStep: "Manter consistência ao criar novas telas.",
      },
      {
        title: "Movimento reduzido e foco de teclado",
        definition: "Animações só em motion-safe; foco sempre visível.",
        source: "Padrão global de interação",
        truth: "IMPLEMENTED_NOT_VERIFIED",
        reason: "Implementado; auditoria completa de acessibilidade não executada.",
        nextStep: "Auditar acessibilidade por superfície e registrar evidência.",
        destination: "/core/tests",
        actionLabel: "Rever teste",
      },
    ],
  },
  {
    id: "licenses",
    label: "Licenças",
    icon: ScrollText,
    title: "Licenças e entitlements",
    subtitle: "Pacotes, limites e o que cada cliente pode usar.",
    truth: "SYNTHETIC_DEMO",
    statuses: [
      {
        title: "Entitlements por contrato",
        definition: "Capacidades liberadas conforme plano contratado.",
        source: "Comercial & Contratos",
        truth: "SYNTHETIC_DEMO",
        reason: "Contratos são fixtures; nenhum entitlement é aplicado tecnicamente.",
        nextStep: "Reconciliar entitlement com binding técnico do CORE.",
        destination: "/owner/commercial",
        actionLabel: "Abrir módulo",
      },
    ],
  },
  {
    id: "costs",
    label: "Custos & consumo",
    icon: Coins,
    title: "Custos, consumo e limites",
    subtitle: "Quota por provider, teto de gasto e alerta de consumo.",
    truth: "NOT_VERIFIED",
    statuses: [
      {
        title: "Medição de consumo",
        definition: "Uso real por provider, app e tenant.",
        source: "Observabilidade",
        truth: "NOT_CONNECTED",
        reason: "Sem telemetria conectada, não há consumo medido — nenhum número é estimado.",
        nextStep: "Conectar telemetria e definir unidade de custo.",
        destination: "/core/observability",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "cost-limits",
      title: "Tetos e alertas declarados",
      description: "Limite declarado por item. Aplicação real depende de provider conectado.",
      fields: [
        { key: "item", label: "Item", type: "text", required: true },
        { key: "teto", label: "Teto declarado", type: "text", required: true },
        {
          key: "acao",
          label: "Ao atingir",
          type: "select",
          options: ["alertar", "bloquear", "não definido"],
        },
      ],
      seed: [
        { id: rid("CST", 1), item: "Provider de IA", teto: "não definido", acao: "não definido" },
      ],
    },
  },
  {
    id: "audit",
    label: "Auditoria",
    icon: ScrollText,
    title: "Auditoria e trilha de decisão",
    subtitle: "Quem fez, quando, com qual evidência e por qual decisão.",
    truth: "PARTIAL",
    statuses: [
      {
        title: "Trilha persistida",
        definition: "Registro imutável de ações críticas.",
        source: "Backend do projeto",
        truth: "NOT_CONNECTED",
        reason: "Ações ficam apenas na sessão local; nada é assinado ou preservado.",
        nextStep: "Persistir trilha antes de tratar qualquer ação como evidência.",
        destination: "/owner/documents",
        actionLabel: "Abrir origem",
      },
      {
        title: "Decision & Provenance Gate",
        definition: "Nenhuma remoção acontece sem decisão registrada.",
        source: "Governança da candidata",
        truth: "IMPLEMENTED_NOT_VERIFIED",
        reason: "Gate aplicado na interface, sem trilha persistida.",
        nextStep: "Ligar gate à auditoria persistida.",
        destination: "/owner/plans",
        actionLabel: "Abrir módulo",
      },
    ],
  },
  {
    id: "flags",
    label: "Feature flags",
    icon: ToggleLeft,
    title: "Feature flags",
    subtitle: "Ligar recurso por ambiente sem promover candidata.",
    truth: "SYNTHETIC_DEMO",
    statuses: [
      {
        title: "Aplicação da flag",
        definition: "Efeito real da flag no runtime.",
        source: "Runtime da candidata",
        truth: "NOT_CONNECTED",
        reason: "Flags são registro local: nenhuma altera comportamento em produção.",
        nextStep: "Conectar serviço de flags e mapear consumidores.",
        destination: "/core/architecture",
        actionLabel: "Abrir módulo",
      },
    ],
    crud: {
      id: "flags",
      title: "Flags declaradas",
      description: "Nome, ambiente e estado — registro local governado.",
      fields: [
        { key: "nome", label: "Flag", type: "text", required: true },
        {
          key: "ambiente",
          label: "Ambiente",
          type: "select",
          options: ["candidata", "LABTEST", "SOL"],
        },
        {
          key: "estado",
          label: "Estado",
          type: "select",
          options: ["desligada", "ligada (local)"],
        },
      ],
      seed: [
        {
          id: rid("FLG", 1),
          nome: "Prévia de substituição",
          ambiente: "candidata",
          estado: "ligada (local)",
        },
        { id: rid("FLG", 2), nome: "Mapa Vivo técnico", ambiente: "LABTEST", estado: "desligada" },
      ],
    },
  },
  {
    id: "lab",
    label: "LAB & experimentos",
    icon: FlaskConical,
    title: "LAB e experimentos",
    subtitle: "Hipótese e candidata pertencem ao LABTEST, nunca ao operacional.",
    truth: "HYPOTHESIS",
    statuses: [
      {
        title: "Experimentos ativos",
        definition: "Candidatas em teste, comparadas com o SOL.",
        source: "LABTEST",
        truth: "HYPOTHESIS",
        reason: "Experimentos são hipóteses até existir evidência aprovada.",
        nextStep: "Rodar comparação one-change-at-a-time no LABTEST.",
        destination: "/labtest",
        actionLabel: "Abrir módulo",
      },
    ],
    substitution: true,
  },
];
