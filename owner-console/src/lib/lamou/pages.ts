import type { PageSpec } from "@/components/lamou/module-page";
import type { TruthState } from "@/lib/lamou/council-data";
import {
  ACTION_PLANS,
  APPS,
  CONTRACTS,
  IMPROVEMENTS,
  SECURITY,
  TESTS,
  VERSIONS,
} from "@/lib/lamou/demo-data";
import { CALL_REGISTRY, DOC_STRUCTURE, VISUAL_LOCKS, WAVE1_APPS } from "@/lib/lamou/registry";
import { IMPROVEMENT_ROUTE_LABEL, PLAN_LABEL, TEST_SUBJECT_LABEL } from "@/lib/lamou/types";

const DEMO: TruthState = "SYNTHETIC_DEMO";

export const OWNER_PAGES: Record<string, PageSpec> = {
  plans: {
    title: "Projetos, Planos de Ação & Melhorias",
    subtitle:
      "Ocorrência enviada para Plano de Ação entra como AGUARDANDO DEFINIÇÃO com ID, origem, problema e evidências. Melhoria pode virar projeto, versão, experimento, backlog ou estudo.",
    truth: DEMO,
    kpis: [
      { label: "Planos (fixture)", value: String(ACTION_PLANS.length), truth: DEMO },
      {
        label: "Aguardando definição",
        value: String(ACTION_PLANS.filter((p) => p.status === "AGUARDANDO DEFINIÇÃO").length),
        truth: DEMO,
      },
      { label: "Melhorias registradas", value: String(IMPROVEMENTS.length), truth: DEMO },
      { label: "Eficácia consolidada", value: "—", truth: "NOT_VERIFIED" },
    ],
    sections: [
      {
        title: "Planos de Ação",
        items: ACTION_PLANS.map((p) => ({
          label: `${p.id} · ${p.title}`,
          value: p.status,
          truth: DEMO,
          note: `Origem: ${p.origin}. Problema: ${p.problem}. Responsável: ${p.owner || "não definido"}. Prazo: ${p.dueDate || "não definido"}. Critério de conclusão: ${p.completionCriteria || "não definido"}.`,
        })),
      },
      {
        title: "Melhorias e destinos",
        items: IMPROVEMENTS.map((i) => ({
          label: i.title,
          value: i.route ? IMPROVEMENT_ROUTE_LABEL[i.route] : "sem destino",
          truth: DEMO,
          note: `${i.description} — origem: ${i.origin}`,
        })),
      },
      {
        title: "Regras de fechamento",
        items: [
          { label: "Resultado obtido", truth: "DOCUMENTED_ONLY" },
          { label: "Eficácia comprovada", truth: "DOCUMENTED_ONLY" },
          { label: "Recorrência avaliada", truth: "DOCUMENTED_ONLY" },
          { label: "Aprendizado e regra candidata", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
    next: [
      "Ligar planos ao Mapa Vivo por ID de caso, com persistência real.",
      "Exigir responsável, prazo, prioridade e critério antes de permitir execução.",
    ],
  },
  tests: {
    title: "Testes & Qualidade",
    subtitle:
      "Visão consolidada de Teste³ IA, Validation Gate e Lab. Nenhuma execução automatizada foi rodada neste build.",
    truth: "IMPLEMENTED_NOT_VERIFIED",
    kpis: [
      { label: "Execuções (fixture)", value: String(TESTS.length), truth: DEMO },
      {
        label: "Aprovados",
        value: String(TESTS.filter((t) => t.result === "aprovado").length),
        truth: DEMO,
      },
      { label: "Suíte automatizada", value: "não conectada", truth: "NOT_CONNECTED" },
      { label: "Cobertura real", value: "—", truth: "NOT_VERIFIED" },
    ],
    sections: [
      {
        title: "Execuções registradas",
        items: TESTS.map((t) => ({
          label: `${t.id} · ${t.target}`,
          value: t.result,
          truth: DEMO,
          note: `Objeto: ${TEST_SUBJECT_LABEL[t.subject]}. Executor: ${t.executor}. Eficácia: ${t.effectiveness}. Reteste: ${t.retest ? "sim" : "não"}. ${t.notes}`,
        })),
      },
      {
        title: "Camadas de qualidade",
        items: [
          {
            label: "Teste³ IA — executor transversal",
            truth: "NOT_CONNECTED",
            note: "Executor definido em contrato, sem runtime conectado neste build.",
          },
          {
            label: "Validation Gate — gate de evidência",
            truth: "DOCUMENTED_ONLY",
            note: "Gate exige evidência por item antes de promover qualquer candidata.",
          },
          {
            label: "LAMOU Lab — experimentos",
            truth: "SIMULATED",
            note: "Conceitos experimentais permanecem em LUA, isolados do CORE Padrão.",
          },
        ],
      },
    ],
    next: [
      "Conectar Teste³ a um runner real e gravar evidência por execução.",
      "Publicar matriz de casos negativos e de isolamento de tenant.",
    ],
  },
  commercial: {
    title: "Comercial & Contratos",
    subtitle:
      "Empresas, contratos, planos, entitlements, licenças, pagamentos e uso. Nenhum preço é inventado.",
    truth: DEMO,
    kpis: [
      { label: "Contratos (fixture)", value: String(CONTRACTS.length), truth: DEMO },
      {
        label: "Ativos",
        value: String(CONTRACTS.filter((c) => c.status === "ativo").length),
        truth: DEMO,
      },
      { label: "Faturamento real", value: "—", truth: "NOT_CONNECTED" },
      { label: "Planos disponíveis", value: "4", truth: "FACT/EVIDENCED" },
    ],
    sections: [
      {
        title: "Contratos",
        items: CONTRACTS.map((c) => ({
          label: `${c.id} · ${c.company}`,
          value: `${PLAN_LABEL[c.plan]} · ${c.status}`,
          truth: DEMO,
          note: `Entitlements: ${c.entitlements.join(", ")}. Licenças: ${c.licenses.users} usuários / ${c.licenses.devices} dispositivos. Valor atual: ${c.value.current} · potencial: ${c.value.potential}. Método: ${c.value.method}. Evidência: ${c.value.evidence}`,
        })),
      },
      {
        title: "Planos",
        items: (Object.keys(PLAN_LABEL) as (keyof typeof PLAN_LABEL)[]).map((k) => ({
          label: PLAN_LABEL[k],
          value: "preço não definido",
          truth: "NOT_VERIFIED",
          note: "Preço, limites e entitlements comerciais dependem de definição do proprietário.",
        })),
      },
    ],
    next: ["Definir entitlements por plano no Registry antes de expor ao cliente."],
  },
  opportunities: {
    title: "Oportunidades",
    subtitle:
      "Cadeia Research Scout → Benchmarker → Opportunity Intelligence. Ficha de oportunidade e gate de validação seguem o Build Pack.",
    truth: "NOT_CONNECTED",
    kpis: [
      { label: "Fontes conectadas", value: "0", truth: "NOT_CONNECTED" },
      { label: "Oportunidades validadas", value: "0", truth: "NOT_VERIFIED" },
      { label: "Benchmarks executados", value: "0", truth: "NOT_VERIFIED" },
      { label: "Ficha padrão", value: "definida", truth: "DOCUMENTED_ONLY" },
    ],
    sections: [
      {
        title: "Ficha de oportunidade (campos obrigatórios)",
        items: [
          { label: "Origem e sinal", truth: "DOCUMENTED_ONLY" },
          { label: "Problema e hipótese", truth: "DOCUMENTED_ONLY" },
          { label: "Evidência externa", truth: "DOCUMENTED_ONLY" },
          { label: "Esforço, risco e custo", truth: "DOCUMENTED_ONLY" },
          { label: "Teste necessário e falsificador", truth: "DOCUMENTED_ONLY" },
          {
            label: "Destino: projeto, versão, experimento, backlog ou estudo",
            truth: "DOCUMENTED_ONLY",
          },
        ],
      },
      {
        title: "Gate de validação",
        items: [
          { label: "Sem evidência não avança de hipótese", truth: "DOCUMENTED_ONLY" },
          { label: "Similaridade não é probabilidade", truth: "DOCUMENTED_ONLY" },
          { label: "Promoção exige decisão registrada", truth: "DOCUMENTED_ONLY" },
        ],
      },
      {
        title: "Visual Locks de referência",
        items: VISUAL_LOCKS.filter((v) => v.file.includes("OPPORTUNITY")).map((v) => ({
          label: v.file,
          value: v.surface,
          truth: v.read ? "EXTERNAL_EVIDENCE" : "NOT_VERIFIED",
          note: v.read
            ? "Arquivo lido."
            : "Arquivo não lido nesta sessão — nenhum conector de Drive autorizado.",
        })),
      },
    ],
    next: [
      "Autorizar leitura dos Visual Locks e reconciliar o APP-ID canônico de Opportunity Intelligence.",
    ],
  },
  documents: {
    title: "Documentos & Documentação Viva",
    subtitle:
      "Estrutura documental do Build Pack V1. Os arquivos são referências de contrato; nenhum repositório foi lido neste build.",
    truth: "DOCUMENTED_ONLY",
    kpis: [
      { label: "Pastas", value: String(DOC_STRUCTURE.length), truth: "FACT/EVIDENCED" },
      {
        label: "Documentos previstos",
        value: String(DOC_STRUCTURE.reduce((a, f) => a + f.files.length, 0)),
        truth: "FACT/EVIDENCED",
      },
      { label: "GitHub", value: "não verificado", truth: "NOT_CONNECTED" },
      { label: "Drive", value: "não verificado", truth: "NOT_CONNECTED" },
    ],
    sections: DOC_STRUCTURE.map((f) => ({
      title: f.folder,
      items: f.files.map((file) => ({ label: file, truth: "DOCUMENTED_ONLY" as TruthState })),
    })),
    next: ["Sincronizar com o repositório canônico e marcar cada documento com versão e commit."],
  },
  security: {
    title: "Segurança",
    subtitle:
      "Visão defensiva: alertas, integridade, snapshots, incidentes, permissões, isolamento e evidências. Sem qualquer capacidade ofensiva.",
    truth: DEMO,
    kpis: [
      { label: "Alertas (fixture)", value: String(SECURITY.length), truth: DEMO },
      {
        label: "Abertos",
        value: String(SECURITY.filter((s) => s.status === "aberto").length),
        truth: DEMO,
      },
      { label: "Isolamento de tenant", value: "requisito", truth: "NOT_VERIFIED" },
      { label: "Scan real", value: "não executado", truth: "NOT_VERIFIED" },
    ],
    sections: [
      {
        title: "Alertas",
        items: SECURITY.map((s) => ({
          label: `${s.id} · ${s.title}`,
          value: `${s.area} · ${s.status}`,
          truth: DEMO,
          note: `Evidência: ${s.evidence} (${s.at})`,
        })),
      },
      {
        title: "Requisitos de segurança",
        items: [
          {
            label: "Nenhum segredo no frontend",
            truth: "FACT/EVIDENCED",
            note: "Nenhuma chave é lida ou armazenada no cliente nesta candidata.",
          },
          { label: "RBAC/ABAC por superfície", truth: "DOCUMENTED_ONLY" },
          { label: "Isolamento de tenant testado", truth: "NOT_VERIFIED" },
          { label: "Trilha de auditoria", truth: "NOT_CONNECTED" },
        ],
      },
    ],
    next: ["Executar testes negativos de isolamento antes de declarar segurança verificada."],
  },
  versions: {
    title: "Versões",
    subtitle:
      "Histórico, baseline FROZEN, candidatas, evidências e gate de promoção. SALVAR ≠ PROMOVER.",
    truth: DEMO,
    kpis: [
      { label: "Registros", value: String(VERSIONS.length), truth: DEMO },
      {
        label: "Baseline FROZEN",
        value: String(VERSIONS.filter((v) => v.state === "BASELINE FROZEN").length),
        truth: DEMO,
      },
      {
        label: "Candidatas",
        value: String(VERSIONS.filter((v) => v.state === "CANDIDATA").length),
        truth: DEMO,
      },
      { label: "Promoção automática", value: "bloqueada", truth: "FACT/EVIDENCED" },
    ],
    sections: [
      {
        title: "Histórico",
        items: VERSIONS.map((v) => ({
          label: `${v.build} · ${v.label}`,
          value: v.state,
          truth: v.state === "BASELINE FROZEN" ? "FACT/EVIDENCED" : DEMO,
          note: `${v.notes} Gate: ${v.gate.map((g) => `${g.label}=${g.ok ? "ok" : "pendente"}`).join(", ")}`,
        })),
      },
      {
        title: "Regras",
        items: [
          { label: "Baseline FROZEN não editável", truth: "FACT/EVIDENCED" },
          { label: "Promoção exige gate completo com evidência", truth: "FACT/EVIDENCED" },
          { label: "Backup / restore / rollback real", truth: "NOT_CONNECTED" },
        ],
      },
    ],
    next: ["Conectar build/commit reais e anexar evidência por item de gate."],
  },
  integrations: {
    title: "Integrações",
    subtitle:
      "Disponibilidade de conector não é conexão comprovada. Nada aparece CONNECTED sem teste executado neste turno.",
    truth: "NOT_CONNECTED",
    kpis: [
      { label: "Integrações mapeadas", value: "6", truth: "FACT/EVIDENCED" },
      { label: "Verificadas em runtime", value: "0", truth: "NOT_VERIFIED" },
      { label: "Segredos no cliente", value: "0", truth: "FACT/EVIDENCED" },
      { label: "Chave de IA", value: "não configurada", truth: "NOT_CONNECTED" },
    ],
    sections: [
      {
        title: "Estado por integração",
        items: [
          {
            label: "GitHub — repositório canônico",
            truth: "NOT_CONNECTED",
            note: "Conector não autorizado nesta sessão; nenhum commit foi lido ou escrito.",
          },
          {
            label: "Supabase externo LAMOU-IA-CORE",
            truth: "NOT_CONNECTED",
            note: "Nenhuma conexão foi aberta ou testada neste build.",
          },
          {
            label: "Google Drive — Visual Locks",
            truth: "NOT_CONNECTED",
            note: "Os 11 Visual Locks não foram lidos; a UI seguiu o Design System documentado.",
          },
          { label: "PostHog — analytics", truth: "NOT_CONNECTED" },
          {
            label: "Bridge local do LAMOU Version",
            truth: "BLOCKED",
            note: "Operações locais em Windows exigem agente nativo, inexistente aqui.",
          },
          {
            label: "Provider de IA",
            truth: "NOT_CONNECTED",
            note: "Chave deve ficar server-side como secret; nunca no frontend ou em localStorage.",
          },
        ],
      },
      {
        title: "Contratos de CALL",
        items: CALL_REGISTRY.slice(0, 8).map((c) => ({
          label: `${c.id} · ${c.fn}`,
          value: c.app,
          truth: c.status,
          note: `Origem: ${c.source} → destino: ${c.target}. Auth: ${c.auth}. Fallback: ${c.fallback}. Testes: ${c.tests.filter((t) => t.result === "PASS").length}/${c.tests.length} PASS.`,
        })),
      },
    ],
    next: ["Autorizar cada conector e registrar evidência de chamada antes de marcar CONNECTED."],
  },
  settings: {
    title: "Configurações",
    subtitle:
      "Identidade, usuários, permissões, tenants, IA e chaves, plugins, storage, backup, auditoria, LGPD, quotas e modo Painel/TV.",
    truth: "PARTIAL",
    sections: [
      {
        title: "IA & Chaves",
        items: [
          {
            label: "Provider de IA",
            value: "NÃO CONFIGURADA",
            truth: "NOT_CONNECTED",
            note: "A chave precisa ser cadastrada como secret server-side. O frontend nunca exibe nem armazena segredo.",
          },
          { label: "Registro de uso e custo", value: "sem dados", truth: "NOT_VERIFIED" },
        ],
      },
      {
        title: "Governança",
        items: [
          { label: "Identidade e marca (Visual Lock)", truth: "DOCUMENTED_ONLY" },
          { label: "Usuários, permissões e tenants", truth: "NOT_CONNECTED" },
          { label: "Auditoria e LGPD", truth: "DOCUMENTED_ONLY" },
          { label: "Backup, restore e retenção", truth: "NOT_CONNECTED" },
          { label: "Modo Painel/TV por cargo e contexto", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
    next: ["Cadastrar o secret do provider de IA e habilitar registro de uso."],
  },
};

export const CORE_PAGES: Record<string, PageSpec> = {
  overview: {
    title: "LAMOU CORE — Visão Geral",
    subtitle:
      "Camada técnica do proprietário. SOL é a referência operacional corrente; LUA reúne candidatas e experiências.",
    truth: "PARTIAL",
    kpis: [
      {
        label: "Capabilities mapeadas",
        value: String(CALL_REGISTRY.length),
        truth: "FACT/EVIDENCED",
      },
      { label: "CALLs verificadas", value: "0", truth: "NOT_VERIFIED" },
      { label: "Apps Wave 1", value: String(WAVE1_APPS.length), truth: "FACT/EVIDENCED" },
      { label: "Backend runtime", value: "não conectado", truth: "NOT_CONNECTED" },
    ],
    sections: [
      {
        title: "Camadas",
        items: [
          {
            label: "CORE Padrão (SOL)",
            truth: "PARTIAL",
            note: "Referência corrente: contratos, registries e superfícies definidas; runtime não verificado.",
          },
          {
            label: "CORE Cubo (LUA)",
            truth: "SIMULATED",
            note: "Cubo, Prisma, Snapshot, Cubo Fantasma, Cubo da Relação e Caleidoscópio permanecem experimentais e isolados.",
          },
        ],
      },
      {
        title: "Escala operacional",
        items: [
          { label: "Normal", truth: "DOCUMENTED_ONLY" },
          { label: "Sinal de Tendência", truth: "DOCUMENTED_ONLY" },
          { label: "Alerta de Probabilidade", truth: "DOCUMENTED_ONLY" },
          { label: "Crítico", truth: "DOCUMENTED_ONLY" },
          { label: "Falha", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
  },
  architecture: {
    title: "Arquitetura Técnica",
    subtitle:
      "Fundação compartilhada: superfícies, contratos, registries e limites entre Owner e Cliente.",
    truth: "PARTIAL",
    sections: [
      {
        title: "Superfícies oficiais",
        items: [
          {
            label: "1. Instalação do Proprietário",
            value: "/install/owner",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
          {
            label: "1.1 Instalação do Cliente",
            value: "/install/client",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
          {
            label: "2. LAMOU IA Central — Proprietário",
            value: "/owner",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
          {
            label: "3. LAMOU CORE — Proprietário",
            value: "/core",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
          {
            label: "3.1 LAMOU CORE — Cliente",
            value: "fora deste app",
            truth: "NOT_APPLICABLE",
            note: "Cliente nunca acessa a visão do proprietário.",
          },
        ],
      },
      {
        title: "Fundação de execução",
        items: [
          { label: "UI — TanStack Start + React + Tailwind", truth: "FACT/EVIDENCED" },
          { label: "Registry-first: apps, CALLs, VAs, documentos", truth: "FACT/EVIDENCED" },
          { label: "Banco e Auth externos", truth: "NOT_CONNECTED" },
          { label: "CI/CD fora do Lovable", truth: "NOT_VERIFIED" },
        ],
      },
    ],
  },
  apps: {
    title: "Apps & Bindings",
    subtitle: "Ligação entre cada app da Wave 1 e as capabilities do CORE.",
    truth: "PARTIAL",
    sections: [
      {
        title: "Bindings",
        items: WAVE1_APPS.map((a) => ({
          label: `${a.id} · ${a.name}`,
          value: a.shell,
          truth: a.truth,
          note: `Capabilities: ${a.capabilities.join(", ")}.${a.note ? ` ${a.note}` : ""}`,
        })),
      },
      {
        title: "Regra de binding",
        items: [
          { label: "App só abre rota real quando existir tela", truth: "FACT/EVIDENCED" },
          { label: "Cada CALL exige contrato e teste próprio", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
  },
  data: {
    title: "Dados & Fontes",
    subtitle: "Contratos de dado, fontes, retenção e isolamento. Todas as fixtures são sintéticas.",
    truth: "NOT_CONNECTED",
    sections: [
      {
        title: "Fontes",
        items: [
          {
            label: "Fixtures locais SYNTHETIC_DEMO",
            truth: DEMO,
            note: "Único dado presente nesta candidata.",
          },
          { label: "Postgres externo LAMOU", truth: "NOT_CONNECTED" },
          { label: "Storage de evidências", truth: "NOT_CONNECTED" },
        ],
      },
      {
        title: "Contratos de dado",
        items: [
          { label: "professional_roles / professional_questions", truth: "DOCUMENTED_ONLY" },
          { label: "council_runs / decisions", truth: "DOCUMENTED_ONLY" },
          { label: "theories / studies / experiments / evidence_items", truth: "DOCUMENTED_ONLY" },
          { label: "applicability_assessments / api_usage", truth: "DOCUMENTED_ONLY" },
          { label: "RLS e isolamento por tenant", truth: "NOT_VERIFIED" },
        ],
      },
    ],
    next: ["Criar as tabelas no banco externo e provar RLS com teste negativo."],
  },
  ai: {
    title: "IA, Prompts, Skills & VAs",
    subtitle: "Conselho profissional adaptativo, Router V0.2 e agentes governados por Registry.",
    truth: "PARTIAL",
    sections: [
      {
        title: "Conselho & Router",
        items: [
          { label: "Perfis profissionais operacionais", value: "38", truth: "FACT/EVIDENCED" },
          { label: "Modos AUTO / CONSELHO / PROFUNDO", truth: "IMPLEMENTED_NOT_VERIFIED" },
          { label: "Value of Information nas perguntas", truth: "IMPLEMENTED_NOT_VERIFIED" },
          { label: "Decision & Provenance Gate", truth: "IMPLEMENTED_NOT_VERIFIED" },
        ],
      },
      {
        title: "Execução",
        items: [
          { label: "Provider de modelo", truth: "NOT_CONNECTED" },
          { label: "Custo e uso por execução", truth: "NOT_VERIFIED" },
          { label: "Prompts versionados no Registry", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
  },
  security: {
    title: "Segurança CORE, RBAC/ABAC & Tenants",
    subtitle: "Permissões por superfície, isolamento de tenant e entitlements.",
    truth: "NOT_VERIFIED",
    sections: [
      {
        title: "Controles",
        items: [
          {
            label: "Separação Owner × Cliente",
            truth: "FACT/EVIDENCED",
            note: "Nenhuma rota de cliente existe neste app.",
          },
          { label: "RBAC por superfície", truth: "DOCUMENTED_ONLY" },
          { label: "ABAC por tenant e entitlement", truth: "DOCUMENTED_ONLY" },
          { label: "Isolamento de tenant testado", truth: "NOT_VERIFIED" },
        ],
      },
      {
        title: "Segredos",
        items: [
          { label: "Nenhum segredo no bundle do cliente", truth: "FACT/EVIDENCED" },
          { label: "Service-role apenas server-side", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
  },
  tests: {
    title: "Testes, Validation & Evidence",
    subtitle:
      "Cada CALL gera testes de sucesso, não autorizado, schema inválido, timeout, indisponibilidade, isolamento e recuperação.",
    truth: "NOT_VERIFIED",
    sections: [
      {
        title: "Matriz obrigatória por CALL",
        items: [
          { label: "Sucesso", truth: "NOT_VERIFIED" },
          { label: "Não autorizado", truth: "NOT_VERIFIED" },
          { label: "Schema inválido", truth: "NOT_VERIFIED" },
          { label: "Timeout", truth: "NOT_VERIFIED" },
          { label: "Indisponibilidade do provider", truth: "NOT_VERIFIED" },
          { label: "Isolamento de tenant", truth: "NOT_VERIFIED" },
          { label: "Recuperação / fallback", truth: "NOT_VERIFIED" },
        ],
      },
      {
        title: "Evidência",
        items: [
          { label: "Toda promoção exige evidência anexada", truth: "DOCUMENTED_ONLY" },
          { label: "Nenhuma execução automatizada neste build", truth: "FACT/EVIDENCED" },
        ],
      },
    ],
  },
  observability: {
    title: "Observabilidade",
    subtitle: "Logs, métricas, traços, erros e alertas do CORE.",
    truth: "NOT_CONNECTED",
    sections: [
      {
        title: "Sinais",
        items: [
          { label: "Log estruturado por CALL", truth: "NOT_CONNECTED" },
          { label: "Métricas de latência e custo", truth: "NOT_CONNECTED" },
          {
            label: "Erros de runtime da UI",
            truth: "PARTIAL",
            note: "Captura de erro do app existe; agregação externa não.",
          },
          { label: "Analytics de produto", truth: "NOT_CONNECTED" },
        ],
      },
    ],
  },
  versions: {
    title: "Versões, Builds & Rollback",
    subtitle: "Baseline preservada, candidata corrente, backup, restore e rollback.",
    truth: "PARTIAL",
    sections: [
      {
        title: "Estado",
        items: [
          {
            label: "Candidata corrente",
            value: "candidate/lamou-owner-platform",
            truth: "IMPLEMENTED_NOT_VERIFIED",
          },
          { label: "Baseline FROZEN preservada", truth: "FACT/EVIDENCED" },
          { label: "Backup / restore automatizado", truth: "NOT_CONNECTED" },
          { label: "Rollback testado", truth: "NOT_VERIFIED" },
        ],
      },
      {
        title: "Gate de promoção",
        items: [
          { label: "SALVAR ≠ PROMOVER", truth: "FACT/EVIDENCED" },
          { label: "Promoção manual com evidência", truth: "DOCUMENTED_ONLY" },
        ],
      },
    ],
  },
  "sol-lua": {
    title: "SOL / LUA / LAB",
    subtitle:
      "SOL é a referência operacional corrente. LUA é laboratório de candidatas. Alternar visão não promove nada.",
    truth: "PARTIAL",
    sections: [
      {
        title: "SOL — CORE Padrão",
        items: [
          { label: "Papel", value: "referência corrente", truth: "PARTIAL" },
          { label: "Mudança", value: "incremental e compatível", truth: "DOCUMENTED_ONLY" },
          { label: "Experimentos incorporados", value: "nenhum", truth: "FACT/EVIDENCED" },
        ],
      },
      {
        title: "LUA — CORE Cubo e experiências",
        items: [
          { label: "Cubo", truth: "SIMULATED" },
          { label: "Prisma", truth: "SIMULATED" },
          { label: "Snapshot", truth: "SIMULATED" },
          { label: "Cubo Fantasma", truth: "HYPOTHESIS" },
          { label: "Cubo da Relação", truth: "HYPOTHESIS" },
          { label: "Caleidoscópio", truth: "HYPOTHESIS" },
        ],
      },
      {
        title: "Regra de convivência",
        items: [
          { label: "SOL e LUA coexistem sem se misturar", truth: "FACT/EVIDENCED" },
          { label: "Promoção só por Promotion Gate explícito", truth: "FACT/EVIDENCED" },
          { label: "Probabilidade sem método → não calculável", truth: "FACT/EVIDENCED" },
        ],
      },
    ],
  },
};

export interface AppPageSpec {
  slug: string;
  id: string;
  name: string;
  purpose: string;
  chain: string;
  truth: TruthState;
  status: string;
  docs: string[];
  calls: { label: string; truth: TruthState }[];
  next: string[];
  notes?: string;
}

const NOT_CONNECTED_CALLS: { label: string; truth: TruthState }[] = [
  { label: "CALL de leitura de dados", truth: "NOT_CONNECTED" },
  { label: "CALL de execução / job", truth: "NOT_CONNECTED" },
  { label: "CALL de registro de evidência", truth: "NOT_CONNECTED" },
];

export const APP_PAGES: AppPageSpec[] = [
  {
    slug: "research-scout",
    id: "APP-034 (candidato)",
    name: "Research Scout",
    purpose: "Varredura de fontes e sinais externos para alimentar a cadeia de oportunidade.",
    chain: "Etapa 1 — alimenta o Benchmarker.",
    truth: "NOT_CONNECTED",
    status: "Ficha e rota reais; nenhuma fonte externa conectada.",
    docs: ["30_CONTRACTS/CALL_REGISTRY.md", "10_PRODUCT/PRODUCT_SPEC.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Definir fontes autorizadas, freshness e classificação de sinal."],
  },
  {
    slug: "benchmarker",
    id: "APP-BENCH (ID canônico não reconciliado)",
    name: "Benchmarker",
    purpose: "Comparação estruturada entre soluções, versões e alternativas.",
    chain: "Etapa 2 — recebe sinais do Research Scout.",
    truth: "NOT_VERIFIED",
    status: "Ficha e rota reais; nenhum benchmark executado.",
    docs: ["10_PRODUCT/BUSINESS_RULES.md", "70_VALIDATION/EVIDENCE_REQUIREMENTS.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Reconciliar APP-ID canônico no Registry."],
  },
  {
    slug: "opportunity-intelligence",
    id: "ID canônico pendente — não inventado",
    name: "Opportunity Intelligence",
    purpose: "Transforma sinais comparados em ficha de oportunidade com gate de validação.",
    chain: "Etapa 3 — entrega ao Showroom.",
    truth: "NOT_VERIFIED",
    status: "Ficha e rota reais; ID canônico permanece pendente de reconciliação.",
    docs: ["70_VALIDATION/GATES.md", "70_VALIDATION/TRUTH_STATE.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Reconciliar APP-ID e ligar à Ficha de Oportunidade do Build Pack."],
  },
  {
    slug: "showroom",
    id: "APP-SHOWROOM",
    name: "Showroom",
    purpose: "Vitrine de soluções, provas e demonstrações para clientes e prospects.",
    chain: "Etapa 4 — alimenta o Diagnóstico 360.",
    truth: "NOT_VERIFIED",
    status: "Rota real com ficha; conteúdo de vitrine ainda não montado.",
    docs: ["90_UI/SCREEN_SPEC.md", "90_UI/VISUAL_BINDING.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Aplicar o Visual Lock do Showroom quando o arquivo puder ser lido."],
  },
  {
    slug: "diagnostico-360",
    id: "APP-DIAG360",
    name: "Diagnóstico 360",
    purpose: "Diagnóstico estruturado da situação atual do cliente em múltiplas dimensões.",
    chain: "Etapa 5 — entrega ao Digital Improvement.",
    truth: "NOT_VERIFIED",
    status: "Rota real com ficha; questionário e scoring não implementados.",
    docs: ["10_PRODUCT/PRODUCT_SPEC.md", "60_TESTS/TEST_CASES.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Definir dimensões, perguntas e critérios de evidência."],
  },
  {
    slug: "digital-improvement",
    id: "APP-DIGIMP",
    name: "Digital Improvement",
    purpose: "Converte diagnóstico em plano de melhoria digital priorizado.",
    chain: "Etapa 6 — entrega ao Teste³.",
    truth: "NOT_VERIFIED",
    status: "Rota real com ficha; priorização não implementada.",
    docs: ["10_PRODUCT/BUSINESS_RULES.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Ligar ao módulo de Planos & Melhorias da Central."],
  },
  {
    slug: "meeting-architect",
    id: "APP-MEETARCH",
    name: "Diagnostic / Meeting Architect",
    purpose: "Estrutura reuniões diagnósticas: pauta, perguntas, evidências e decisões.",
    chain: "Apoio transversal à cadeia.",
    truth: "NOT_VERIFIED",
    status: "Rota real com ficha; geração de pauta não conectada.",
    docs: ["10_PRODUCT/ACCEPTANCE.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Reutilizar as perguntas obrigatórias do Conselho por tipo de tarefa."],
  },
  {
    slug: "teste3",
    id: "APP-TESTE3",
    name: "Teste³ IA",
    purpose: "Executor transversal de testes com evidência e reteste.",
    chain: "Etapa 7 — entrega ao Validation Gate.",
    truth: "NOT_CONNECTED",
    status: "Rota real com ficha; nenhum runner conectado.",
    docs: ["60_TESTS/TEST_MASTER_PLAN.md", "60_TESTS/NEGATIVE_TESTS.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Conectar runner e persistir evidência por execução."],
  },
  {
    slug: "validation-gate",
    id: "APP-VALGATE",
    name: "Validation Gate",
    purpose: "Gate que autoriza ou bloqueia promoção com base em evidência.",
    chain: "Etapa 8 — entrega ao Lab ou ao Version.",
    truth: "DOCUMENTED_ONLY",
    status: "Regras documentadas; execução não conectada.",
    docs: ["70_VALIDATION/VALIDATION_CONTRACT.md", "70_VALIDATION/GATES.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Implementar bloqueio efetivo de promoção sem evidência."],
  },
  {
    slug: "lab",
    id: "APP-LAB",
    name: "LAMOU Lab",
    purpose: "Laboratório de teorias, experimentos e conceitos experimentais (LUA).",
    chain: "Etapa 9 — devolve aprendizado ao Version/Registry.",
    truth: "SIMULATED",
    status: "Conceitos preservados como EXPERIMENTAL / NÃO VALIDADO.",
    docs: ["80_AI/EVALS.md", "70_VALIDATION/TRUTH_STATE.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Publicar a Matriz de Verdade Científica com as quatro métricas separadas."],
  },
  {
    slug: "orbit",
    id: "APP-ORBIT",
    name: "Orbit / Agenda / LifeOS",
    purpose:
      "Agenda e sistema de vida operacional do proprietário. Não é Version nem Intelligence 360.",
    chain: "Apoio transversal.",
    truth: "NOT_VERIFIED",
    status: "Rota real com ficha; agenda não conectada.",
    docs: ["10_PRODUCT/USER_ROLES.md"],
    calls: NOT_CONNECTED_CALLS,
    next: ["Definir fonte de agenda antes de qualquer sincronização."],
  },
  {
    slug: "version",
    id: "APP-VERSION",
    name: "LAMOU Version",
    purpose: "Arquivos, builds, documentos, versionamento, retenção e deduplicação.",
    chain: "Etapa 10 — fecha o ciclo com o Registry.",
    truth: "BLOCKED",
    status: "Operações locais em Windows exigem bridge/agente nativo, ausente neste ambiente.",
    docs: ["00_MASTER/VERSION_MANIFEST.md", "95_OPERATIONS/BACKUP_RESTORE.md"],
    calls: [
      { label: "CALL de varredura local de arquivos", truth: "BLOCKED" },
      { label: "CALL de deduplicação", truth: "NOT_CONNECTED" },
      { label: "CALL de retenção", truth: "NOT_CONNECTED" },
    ],
    next: ["Especificar o agente nativo antes de qualquer operação local."],
  },
];

export function appSpecToPage(a: AppPageSpec): PageSpec {
  return {
    title: a.name,
    subtitle: a.purpose,
    truth: a.truth,
    sections: [
      {
        title: "Resumo e estado",
        items: [
          { label: "Propósito", note: a.purpose, truth: "FACT/EVIDENCED" },
          { label: "Estado atual", note: a.status, truth: a.truth },
          { label: "CORE usado", value: "CORE Padrão (SOL)", truth: "PARTIAL" },
        ],
      },
      {
        title: "Testes e evidências",
        items: [
          { label: "Testes executados neste build", value: "0", truth: "NOT_VERIFIED" },
          { label: "Evidência anexada", value: "nenhuma", truth: "NOT_VERIFIED" },
        ],
      },
    ],
    next: a.next,
  };
}
