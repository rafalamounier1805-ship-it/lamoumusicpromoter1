import {
  AppWindow,
  Boxes,
  Database,
  FlaskConical,
  GitBranch,
  KeyRound,
  Radio,
  Rocket,
  ShieldCheck,
  Bot,
  Cable,
  type LucideIcon,
} from "lucide-react";

import { CALL_REGISTRY, VA_REGISTRY, WAVE1_APPS } from "@/lib/lamou/registry";

/**
 * Modelo de saúde compartilhado entre Cognitive (Central) e Saúde & Evidências (CORE).
 * Regra: nenhum percentual de saúde é inventado. Sem metodologia de peso publicada,
 * peso e contribuição ficam explicitamente indefinidos.
 */

export type HealthStatus = "verificado" | "parcial" | "nao-verificado" | "nao-conectado";

export const HEALTH_LABEL: Record<HealthStatus, string> = {
  verificado: "COMPROVADO",
  parcial: "PARCIAL",
  "nao-verificado": "NÃO VERIFICADO",
  "nao-conectado": "NÃO CONECTADO",
};

export const HEALTH_TRUTH: Record<HealthStatus, string> = {
  verificado: "IMPLEMENTED_VERIFIED",
  parcial: "PARTIAL",
  "nao-verificado": "NOT_VERIFIED",
  "nao-conectado": "NOT_CONNECTED",
};

export const HEALTH_MEANING: Record<HealthStatus, string> = {
  verificado: "Existe execução real com evidência registrada.",
  parcial: "Implementado, porém a comprovação está incompleta — sempre dizemos parcial de quê.",
  "nao-verificado": "Nada foi executado para comprovar; o número não pode ser afirmado.",
  "nao-conectado": "A integração não existe neste ambiente; nada é medido nem enviado por aqui.",
};

/** Rotas reais desta candidata usadas como destino de correção. */
export type HealthRoute =
  | "/core/tests"
  | "/core/observability"
  | "/core/settings"
  | "/core/versions"
  | "/core/architecture"
  | "/core/apps"
  | "/owner/plans"
  | "/owner/mapa-vivo"
  | "/labtest";

export interface HealthEvidence {
  id: string;
  kind: string;
  source: string;
  at: string;
  owner: string;
  status: HealthStatus;
}

export interface HealthIndicator {
  id: string;
  label: string;
  domain: string;
  icon: LucideIcon;
  definition: string;
  value: string;
  /** Meta/denominador explícito. Quando não existe, diz que não existe. */
  target: string;
  status: HealthStatus;
  /** Peso na Saúde Geral. null = metodologia não publicada. */
  weight: number | null;
  impact: "positivo" | "negativo" | "neutro";
  trend: string;
  why: string;
  source: string;
  updatedAt: string;
  owner: string;
  ratio?: { value: number; total: number };
  evidences: HealthEvidence[];
  where: { label: string; to: HealthRoute };
}

const verifiedCalls = CALL_REGISTRY.filter((c) => c.tests.some((t) => t.result === "PASS")).length;

export const HEALTH_INDICATORS: HealthIndicator[] = [
  {
    id: "HS-UI",
    label: "UI / navegação",
    domain: "Experiência & Navegação",
    icon: AppWindow,
    definition:
      "Interface e rotas executáveis do console: Central, CORE, LABTEST, aplicativos e instalações.",
    value: `${WAVE1_APPS.length} apps + Central + CORE`,
    target: "meta: 1 teste de interface registrado por superfície — 0 registrados",
    status: "parcial",
    weight: null,
    impact: "neutro",
    trend: "sem série histórica",
    why: "As rotas existem e navegam, mas nenhuma execução automatizada de interface foi registrada nesta candidata.",
    source: "Registro de rotas da candidata + inspeção manual.",
    updatedAt: "sem verificação automatizada registrada",
    owner: "responsável: proprietário",
    ratio: { value: 0, total: WAVE1_APPS.length },
    evidences: [],
    where: { label: "Abrir Testes & Qualidade", to: "/core/tests" },
  },
  {
    id: "HS-DADOS",
    label: "Dados & persistência",
    domain: "Dados & Conhecimento",
    icon: Database,
    definition: "Tabelas reais em uso, com isolamento por proprietário, e telas ainda em fixtures.",
    value: "4 tabelas reais em uso",
    target: "demais telas ainda em fixtures — cobertura total não medida",
    status: "parcial",
    weight: null,
    impact: "positivo",
    trend: "cresceu nesta candidata (planos, cobranças, slots, checagens)",
    why: "Parte das telas grava e lê de banco real com isolamento; o resto continua em dados de demonstração.",
    source: "Migrações aplicadas da candidata.",
    updatedAt: "sem auditoria de cobertura registrada",
    owner: "responsável: proprietário",
    evidences: [
      {
        id: "EV-DB-0001",
        kind: "migração aplicada",
        source: "0001_core_billing_providers",
        at: "aplicada nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
      {
        id: "EV-DB-0002",
        kind: "migração aplicada",
        source: "0002_owner_avatars_policies",
        at: "aplicada nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
    ],
    where: { label: "Abrir Configurações do CORE", to: "/core/settings" },
  },
  {
    id: "HS-AUTH",
    label: "Identidade & acesso",
    domain: "Segurança & Identidade",
    icon: KeyRound,
    definition: "Provedor de identidade que sustenta conta, sessão, perfil e segundo fator.",
    value: "conta, sessão e perfil reais",
    target: "segundo fator: 0 de 1 registrado (depende de e-mail confirmado)",
    status: "parcial",
    weight: null,
    impact: "positivo",
    trend: "perfil verificado nesta candidata",
    why: "Criação de conta, sessão e gravação de perfil foram verificadas. O autenticador não pôde ser registrado porque exige e-mail confirmado.",
    source: "Fluxo de acesso da instalação do proprietário.",
    updatedAt: "última verificação manual desta candidata",
    owner: "responsável: proprietário",
    ratio: { value: 0, total: 1 },
    evidences: [
      {
        id: "EV-AUTH-0001",
        kind: "verificação manual",
        source: "gravação e leitura de perfil do proprietário",
        at: "nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
    ],
    where: { label: "Abrir Configurações do CORE", to: "/core/settings" },
  },
  {
    id: "HS-CAPABILITIES",
    label: "Capabilities do CORE",
    domain: "Plataforma & Runtime",
    icon: Boxes,
    definition:
      "Capability = capacidade técnica que o CORE oferece e que os aplicativos consomem. Aqui: quantas existem declaradas e quantas têm execução comprovada.",
    value: `0 comprovadas de ${CALL_REGISTRY.length} declaradas`,
    target: `meta: ${CALL_REGISTRY.length} de ${CALL_REGISTRY.length} com runtime executado`,
    status: "parcial",
    weight: null,
    impact: "negativo",
    trend: "sem execução de runtime registrada",
    why: "Contratos e registries estão definidos, mas o runtime das capabilities não foi executado nesta candidata. SOL segue isolado de LUA.",
    source: "Registry de capabilities e contratos do CORE.",
    updatedAt: "sem execução de runtime registrada",
    owner: "responsável: proprietário",
    ratio: { value: 0, total: CALL_REGISTRY.length },
    evidences: [],
    where: { label: "Abrir Arquitetura Técnica", to: "/core/architecture" },
  },
  {
    id: "HS-CALLS",
    label: "CALLs verificadas",
    domain: "Integrações & APIs",
    icon: Cable,
    definition:
      "CALL = chamada contratada entre superfícies. Cada uma exige sete cenários: sucesso, não autorizado, schema inválido, timeout, provider indisponível, isolamento de tenant e recuperação.",
    value: `${verifiedCalls} de ${CALL_REGISTRY.length}`,
    target: `meta: ${CALL_REGISTRY.length} de ${CALL_REGISTRY.length} com os 7 cenários aprovados`,
    status: verifiedCalls > 0 ? "parcial" : "nao-verificado",
    weight: null,
    impact: verifiedCalls > 0 ? "neutro" : "negativo",
    trend: "sem execução registrada",
    why: "Nenhum conjunto completo de cenários foi executado, então a chamada não pode ser declarada confiável.",
    source: "CALL Registry da candidata.",
    updatedAt: "sem execução registrada",
    owner: "responsável: proprietário",
    ratio: { value: verifiedCalls, total: CALL_REGISTRY.length },
    evidences: [],
    where: { label: "Abrir Testes & Qualidade", to: "/core/tests" },
  },
  {
    id: "HS-TESTES",
    label: "Testes automatizados",
    domain: "Qualidade & Validação",
    icon: FlaskConical,
    definition: "Suítes executadas com resultado registrado e evidência anexada.",
    value: "0 execuções",
    target: "meta: 1 execução completa por candidata — 0 registradas",
    status: "nao-verificado",
    weight: null,
    impact: "negativo",
    trend: "sem execução registrada",
    why: "Teste³ não está conectado a um executor, portanto nenhuma suíte foi rodada.",
    source: "Teste³ (sem runner conectado).",
    updatedAt: "sem execução registrada",
    owner: "responsável: proprietário",
    ratio: { value: 0, total: 1 },
    evidences: [],
    where: { label: "Abrir Testes & Qualidade", to: "/core/tests" },
  },
  {
    id: "HS-SEGURANCA",
    label: "Gate de segurança",
    domain: "Segurança & Identidade",
    icon: ShieldCheck,
    definition:
      "Conjunto mínimo de comprovações: teste negativo de isolamento entre tenants e trilha de auditoria conectada.",
    value: "0 de 2 comprovações",
    target: "meta: 2 de 2 (isolamento testado + auditoria conectada)",
    status: "nao-verificado",
    weight: null,
    impact: "negativo",
    trend: "sem execução registrada",
    why: "Sem teste negativo de isolamento e sem trilha de auditoria conectada, o gate não pode ser declarado aprovado.",
    source: "Política de governança da candidata.",
    updatedAt: "sem execução registrada",
    owner: "responsável: proprietário",
    ratio: { value: 0, total: 2 },
    evidences: [],
    where: { label: "Abrir Observabilidade", to: "/core/observability" },
  },
  {
    id: "HS-OBS",
    label: "Observabilidade & evidências",
    domain: "Operação & Observabilidade",
    icon: Radio,
    definition:
      "Evidência = artefato real (log, medição, print, documento) que sustenta o estado declarado.",
    value: "3 evidências reais registradas",
    target: "sem meta de cobertura definida — demais áreas sem artefato",
    status: "parcial",
    weight: null,
    impact: "positivo",
    trend: "medições de provider passaram a ser gravadas",
    why: "Existem medições reais de latência de provider gravadas em banco. Fora disso, áreas seguem sem artefato anexado.",
    source: "Registro de checagens de provider.",
    updatedAt: "última medição registrada na base",
    owner: "responsável: proprietário",
    evidences: [
      {
        id: "EV-AI-0001",
        kind: "medição de latência",
        source: "checagem real de provider de IA",
        at: "registrada na base nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
      {
        id: "EV-ST-0001",
        kind: "upload verificado",
        source: "armazenamento privado de imagem do proprietário",
        at: "registrado nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
      {
        id: "EV-BIL-0001",
        kind: "registro em banco",
        source: "plano e cobrança gravados com isolamento por proprietário",
        at: "registrado nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
    ],
    where: { label: "Abrir Observabilidade", to: "/core/observability" },
  },
  {
    id: "HS-VERSAO",
    label: "Versão & promoção",
    domain: "Governança & Versões",
    icon: GitBranch,
    definition: "Estado da candidata frente à baseline congelada.",
    value: "candidata não promovida",
    target: "promoção exige gate completo · SALVAR ≠ PROMOVER",
    status: "parcial",
    weight: null,
    impact: "neutro",
    trend: "sem promoção registrada",
    why: "A baseline congelada permanece intacta e nenhuma promoção foi executada — por decisão explícita de governança.",
    source: "Registro de versões.",
    updatedAt: "sem promoção registrada",
    owner: "responsável: proprietário",
    evidences: [],
    where: { label: "Abrir Versões & Atualizações", to: "/core/versions" },
  },
  {
    id: "HS-DEPLOY",
    label: "Deploy",
    domain: "Governança & Versões",
    icon: Rocket,
    definition: "Publicação em produção do artefato desta candidata.",
    value: "não publicado",
    target: "nada publicado nesta rodada, conforme instrução do proprietário",
    status: "nao-conectado",
    weight: null,
    impact: "neutro",
    trend: "sem publicação",
    why: "A publicação está suspensa por decisão do proprietário; não é uma falha técnica.",
    source: "Decisão de governança do proprietário.",
    updatedAt: "sem publicação",
    owner: "responsável: proprietário",
    evidences: [],
    where: { label: "Abrir Versões & Atualizações", to: "/core/versions" },
  },
  {
    id: "HS-AGENTES",
    label: "Agentes / VAs",
    domain: "IA & Orquestração",
    icon: Bot,
    definition: "Agentes descritos em contrato que dependem de provider de modelo para executar.",
    value: `0 executados de ${VA_REGISTRY.length} registrados`,
    target: `meta: ${VA_REGISTRY.length} de ${VA_REGISTRY.length} com execução ponta a ponta`,
    status: "parcial",
    weight: null,
    impact: "negativo",
    trend: "provider responde em teste manual",
    why: "O provider de modelo responde em teste manual medido, mas nenhum agente foi executado ponta a ponta.",
    source: "VA Registry + checagens de provider.",
    updatedAt: "sem execução ponta a ponta",
    owner: "responsável: proprietário",
    ratio: { value: 0, total: VA_REGISTRY.length },
    evidences: [
      {
        id: "EV-AI-0001",
        kind: "medição de latência",
        source: "checagem real de provider de IA",
        at: "registrada na base nesta candidata",
        owner: "proprietário",
        status: "verificado",
      },
    ],
    where: { label: "Abrir Configurações do CORE", to: "/core/settings" },
  },
];

export interface HealthCoverage {
  total: number;
  verificado: number;
  parcial: number;
  naoVerificado: number;
  naoConectado: number;
  /** Percentual de indicadores com evidência comprovada — cobertura, não saúde. */
  coveragePct: number;
  computable: boolean;
  reason: string;
}

export function healthCoverage(): HealthCoverage {
  const total = HEALTH_INDICATORS.length;
  const count = (s: HealthStatus) => HEALTH_INDICATORS.filter((i) => i.status === s).length;
  const verificado = count("verificado");
  return {
    total,
    verificado,
    parcial: count("parcial"),
    naoVerificado: count("nao-verificado"),
    naoConectado: count("nao-conectado"),
    coveragePct: Math.round((verificado / total) * 100),
    computable: HEALTH_INDICATORS.every((i) => i.weight !== null),
    reason:
      "Saúde geral não calculável ainda: não existe metodologia de peso publicada nem série histórica. O que existe é cobertura de evidência por indicador.",
  };
}

export interface NextAction {
  id: string;
  title: string;
  impact: string;
  effort: string;
  owner: string;
  due: string;
  origin: string;
  urgency: "critico" | "atencao" | "informativo";
  to: HealthRoute;
  ctaLabel: string;
}

/** Ordenado por impacto/urgência. Nenhum CTA aponta para rota inexistente. */
export const NEXT_ACTIONS: NextAction[] = [
  {
    id: "ACT-0001",
    title: "Executar os 7 cenários de pelo menos uma CALL e anexar evidência",
    impact: `Sai de ${verifiedCalls} de ${CALL_REGISTRY.length} CALLs verificadas; desbloqueia o gate de qualidade.`,
    effort: "esforço não estimado (sem base histórica)",
    owner: "proprietário",
    due: "prazo não definido",
    origin: "Indicador CALLs verificadas · NÃO VERIFICADO",
    urgency: "critico",
    to: "/core/tests",
    ctaLabel: "Abrir Testes & Qualidade",
  },
  {
    id: "ACT-0002",
    title: "Comprovar isolamento entre tenants e ligar trilha de auditoria",
    impact: "Fecha 2 de 2 comprovações do gate de segurança, hoje em 0.",
    effort: "esforço não estimado (sem base histórica)",
    owner: "proprietário",
    due: "prazo não definido",
    origin: "Indicador Gate de segurança · NÃO VERIFICADO",
    urgency: "critico",
    to: "/core/observability",
    ctaLabel: "Abrir Observabilidade",
  },
  {
    id: "ACT-0003",
    title: "Executar um agente ponta a ponta usando o provider já medido",
    impact: `Sai de 0 executados de ${VA_REGISTRY.length} registrados e gera a primeira evidência de IA em uso real.`,
    effort: "esforço não estimado (sem base histórica)",
    owner: "proprietário",
    due: "prazo não definido",
    origin: "Indicador Agentes / VAs · PARCIAL",
    urgency: "atencao",
    to: "/core/settings",
    ctaLabel: "Abrir Configurações do CORE",
  },
  {
    id: "ACT-0004",
    title: "Tratar as criticidades abertas dos módulos gerenciais",
    impact: "Reduz a fila de criticidade da Central e alimenta planos com origem rastreável.",
    effort: "esforço não estimado (sem base histórica)",
    owner: "proprietário",
    due: "prazo não definido",
    origin: "Cockpit · módulos em criticidade (SYNTHETIC_DEMO)",
    urgency: "atencao",
    to: "/owner/plans",
    ctaLabel: "Abrir Problemas, Planos & Projetos",
  },
  {
    id: "ACT-0005",
    title: "Registrar execução de runtime de uma capability do CORE",
    impact: `Primeira comprovação entre ${CALL_REGISTRY.length} capabilities declaradas.`,
    effort: "esforço não estimado (sem base histórica)",
    owner: "proprietário",
    due: "prazo não definido",
    origin: "Indicador Capabilities do CORE · PARCIAL",
    urgency: "informativo",
    to: "/core/architecture",
    ctaLabel: "Abrir Arquitetura Técnica",
  },
];
