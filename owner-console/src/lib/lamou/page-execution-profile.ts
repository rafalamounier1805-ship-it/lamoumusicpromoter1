export type LamouPageAudience = "owner" | "core-owner" | "labtest" | "client" | "core-client";

export interface LamouPageExecutionProfile {
  id: string;
  audience: LamouPageAudience;
  title: string;
  purpose: string;
  primaryQuestion: string;
  decisions: string[];
  requiredBlocks: string[];
  requiredFields: string[];
  criticality: {
    enabled: boolean;
    modes: string[];
    rule: string;
  };
  visual: {
    themes: string[];
    accents: string[];
    density: string;
    cardRule: string;
    graphRule: string;
    assetRule: string;
  };
  pedagogy: {
    sequence: string[];
    infoRule: string;
    progressiveDisclosure: string;
    emptyStateRule: string;
  };
  responsive: {
    visualLock: string;
    breakpoints: number[];
    rule: string;
  };
  truth: {
    required: boolean;
    states: string[];
    evidenceRule: string;
  };
}

export const LAMOU_PAGE_EXECUTION_PROFILES: LamouPageExecutionProfile[] = [
  {
    id: "PAGE-OWNER-COGNITIVE",
    audience: "owner",
    title: "LAMOU IA · Cognitive / Visão Geral",
    purpose:
      "Transformar sinais do negócio e do ecossistema em compreensão, decisão e próxima ação, sem executar engenharia profunda.",
    primaryQuestion: "O que preciso saber, decidir ou fazer agora?",
    decisions: [
      "priorizar atenção",
      "abrir cliente/produto/contrato",
      "criar plano ou oportunidade",
      "encaminhar ocorrência ao CORE",
      "acompanhar resultado",
    ],
    requiredBlocks: [
      "contexto e período",
      "criticidade",
      "KPIs com meta/denominador",
      "o que exige atenção",
      "saúde resumida",
      "gráfico do CORE",
      "próximas ações",
      "gestão do ecossistema",
      "mudanças recentes",
      "fonte/evidência",
    ],
    requiredFields: [
      "ID",
      "nome",
      "status",
      "responsável",
      "cliente",
      "produto",
      "versão",
      "origem",
      "fonte",
      "última atualização",
      "truth-state",
      "evidência",
      "impacto",
      "próxima ação",
      "histórico",
    ],
    criticality: {
      enabled: true,
      modes: ["Todos os dados", "Somente críticos", "Somente probabilidade"],
      rule: "Crítico inclui apenas crítico/falha; probabilidade é atenção separada. Vermelho somente para erro, bloqueio, crítico ou falha comprovada.",
    },
    visual: {
      themes: ["Dark Owner", "Light executivo"],
      accents: ["cyan", "violet"],
      density: "alta densidade com hierarquia e respiro; nenhum card ornamental",
      cardRule:
        "Todo card precisa responder o que é, valor/estado, contexto/meta, origem/truth-state e possuir ação ou destino real quando clicável.",
      graphRule:
        "Gráficos devem vir do contrato Visual & Media CORE, exibir unidade, período, baseline, fonte e truth-state; nunca gráfico decorativo.",
      assetRule:
        "Reusar ícones 3D inventariados e Visual Locks existentes; microações podem usar ícones funcionais leves. Não inventar arte oficial.",
    },
    pedagogy: {
      sequence: [
        "O que está acontecendo",
        "Por que importa",
        "Qual evidência",
        "O que fazer agora",
      ],
      infoRule:
        "Usar ⓘ e microcopy curta em conceitos técnicos; explicar unidade, estado e consequência sem esconder o detalhe.",
      progressiveDisclosure:
        "Resumo primeiro, detalhe contextual depois. Não deslocar o canvas com drawers; usar coluna contextual já existente, página dedicada ou expansão natural.",
      emptyStateRule:
        "Estado vazio deve explicar o que falta, por que está vazio e qual ação real pode preencher o dado.",
    },
    responsive: {
      visualLock: "1672×941 como referência desktop",
      breakpoints: [360, 768, 1440, 1672],
      rule: "Sem pan/overflow horizontal. Reorganizar blocos por prioridade; não apenas encolher desktop. Scroll vertical natural.",
    },
    truth: {
      required: true,
      states: [
        "FACT/EVIDENCED",
        "IMPLEMENTED_VERIFIED",
        "PARTIAL",
        "NOT_VERIFIED",
        "NOT_CONNECTED",
        "SYNTHETIC_DEMO",
        "HYPOTHESIS",
      ],
      evidenceRule:
        "CONNECTED, PASS, FACT e score só podem aparecer quando existe evidência compatível; toda métrica deve apontar fonte/evidência.",
    },
  },
  {
    id: "PAGE-CORE-OWNER",
    audience: "core-owner",
    title: "LAMOU CORE · Proprietário",
    purpose:
      "Executar engenharia, rastrear dependências, investigar problemas, versionar, validar e recuperar o ecossistema.",
    primaryQuestion: "Como isso funciona, onde falhou e como provar a correção?",
    decisions: [
      "investigar caso",
      "comparar versão",
      "abrir evidência",
      "enviar candidate ao LABTEST",
      "gerar build",
      "distribuir após gate",
      "rollback/restaurar",
    ],
    requiredBlocks: [
      "Mapa Vivo técnico",
      "execução e indicadores",
      "produtos/aplicativos técnicos",
      "casos e soluções",
      "radar técnico",
      "documentos",
      "versões/distribuição/recovery",
      "governança",
      "configurações",
    ],
    requiredFields: [
      "ID",
      "versão",
      "branch",
      "commit",
      "build",
      "CORE",
      "capability",
      "provider",
      "API",
      "dados",
      "integração",
      "ambiente",
      "tenant",
      "dependências",
      "clientes afetados",
      "métricas",
      "alertas",
      "evidências",
      "histórico",
    ],
    criticality: {
      enabled: true,
      modes: ["Todos os dados", "Dados críticos"],
      rule: "Crítico é calculado/derivado apenas por regra publicada ou estado explícito, nunca por cor decorativa.",
    },
    visual: {
      themes: ["Dark Owner", "Light executivo"],
      accents: ["cyan", "violet"],
      density: "técnica, rastreável e legível",
      cardRule: "Todo card técnico deve expor estado, origem, dependências, ação e evidência.",
      graphRule:
        "Incluir gráficos reais de saúde, performance, falhas, latência, uso e evolução quando houver fonte.",
      assetRule: "Reusar ícones Owner/CORE aprovados e Visual Locks do CORE.",
    },
    pedagogy: {
      sequence: ["Sinal", "Impacto", "Causa", "Evidência", "Ação", "Validação", "Eficácia"],
      infoRule:
        "Termos de engenharia devem ter explicação contextual curta sem retirar nomenclatura técnica.",
      progressiveDisclosure: "Resumo técnico → relação → evidência → histórico.",
      emptyStateRule:
        "Mostrar NOT_CONNECTED/NOT_VERIFIED e o próximo passo para conectar ou verificar.",
    },
    responsive: {
      visualLock: "1672×941",
      breakpoints: [360, 768, 1440, 1672],
      rule: "Árvore, tabelas e gráficos precisam adaptar sem overflow horizontal obrigatório.",
    },
    truth: {
      required: true,
      states: [
        "IMPLEMENTED_VERIFIED",
        "PARTIAL",
        "NOT_VERIFIED",
        "NOT_CONNECTED",
        "SYNTHETIC_DEMO",
        "TEST_ONLY",
      ],
      evidenceRule: "Nenhum PASS, CONNECTED ou saúde calculada sem metodologia e evidência.",
    },
  },
  {
    id: "PAGE-LABTEST",
    audience: "labtest",
    title: "LAMOU LABTEST",
    purpose:
      "Experimentar uma mudança de cada vez, medir contra baseline, guardar evidência e controlar Validation Gate.",
    primaryQuestion: "A mudança funciona melhor, é segura e tem evidência suficiente para avançar?",
    decisions: [
      "executar",
      "comparar",
      "retestar",
      "reprovar",
      "aprovar com ressalva",
      "liberar candidate",
    ],
    requiredBlocks: [
      "baseline PINNED/FROZEN",
      "hipótese",
      "uma variável",
      "runner",
      "ambiente",
      "métricas",
      "evidências",
      "resultado",
      "reteste",
      "Validation Gate",
    ],
    requiredFields: [
      "Test ID",
      "objeto",
      "versão",
      "objetivo",
      "hipótese",
      "critério",
      "cenário",
      "dataset",
      "baseline",
      "variação",
      "métrica",
      "limiar",
      "resultado esperado",
      "resultado real",
      "evidência",
      "executor",
      "revisor",
      "resultado",
      "eficácia",
    ],
    criticality: {
      enabled: true,
      modes: ["Falhas obrigatórias", "Todos os testes"],
      rule: "Gate obrigatório não é substituído por nota média.",
    },
    visual: {
      themes: ["Dark Owner", "Light executivo"],
      accents: ["cyan", "violet"],
      density: "científica e comparativa",
      cardRule:
        "Todo experimento deve mostrar hipótese, baseline, mudança, métrica, evidência e conclusão.",
      graphRule: "Comparativos A/B/C, baseline e tendência com unidade e amostra explícitas.",
      assetRule: "Reusar Visual & Media CORE e assets de Testes/Evidências.",
    },
    pedagogy: {
      sequence: [
        "Pergunta",
        "Hipótese",
        "Como testar",
        "O que medir",
        "Resultado",
        "O que significa",
        "Próximo passo",
      ],
      infoRule: "Explicar diferença entre testado, aprovado, real e demo.",
      progressiveDisclosure:
        "Mostrar protocolo antes do resultado para reduzir interpretação enviesada.",
      emptyStateRule: "Sem runner/evidência deve aparecer NOT_RUN/NOT_CONNECTED, nunca PASS.",
    },
    responsive: {
      visualLock: "1672×941",
      breakpoints: [360, 768, 1440, 1672],
      rule: "Comparações viram cards empilhados em telas menores mantendo baseline visível.",
    },
    truth: {
      required: true,
      states: ["NOT_RUN", "NOT_CONNECTED", "PASS", "FAIL", "PARTIAL", "SYNTHETIC_DEMO"],
      evidenceRule: "PASS exige evidência anexada e critério de aceite atendido.",
    },
  },
  {
    id: "PAGE-CLIENT",
    audience: "client",
    title: "LAMOU IA · Cliente",
    purpose:
      "Mostrar serviço contratado, uso, resultados, documentos, suporte e conta sem expor inteligência proprietária.",
    primaryQuestion: "O que tenho, como está, qual resultado recebi e onde consigo ajuda?",
    decisions: ["abrir app", "ver resultado", "baixar documento", "abrir chamado", "gerir acesso"],
    requiredBlocks: ["início", "aplicativos", "resultados", "documentos", "suporte", "minha conta"],
    requiredFields: [
      "produto",
      "app",
      "plano",
      "versão autorizada",
      "status",
      "usuários",
      "utilização",
      "resultado",
      "documentos",
      "tickets",
      "licenças",
      "acessos",
    ],
    criticality: {
      enabled: true,
      modes: ["Precisa de atenção", "Tudo"],
      rule: "Expor somente impacto e informação autorizada daquele tenant.",
    },
    visual: {
      themes: ["Light executivo", "Dark"],
      accents: ["cyan", "violet"],
      density: "mais simples que Owner",
      cardRule: "Card do cliente deve dizer serviço, estado, resultado/uso e ação.",
      graphRule: "Somente métricas e resultados autorizados do contrato.",
      assetRule: "Mesma família visual, sem assets internos de engenharia.",
    },
    pedagogy: {
      sequence: ["O que você tem", "Como está", "Resultado", "O que pode fazer"],
      infoRule: "Evitar jargão interno; quando necessário, explicar em PT-BR.",
      progressiveDisclosure: "Resultado e ação primeiro; detalhe técnico autorizado depois.",
      emptyStateRule:
        "Explicar quando não há resultado porque ainda não existe período/dado suficiente.",
    },
    responsive: {
      visualLock: "desktop coerente com LAMOU; mobile é prioridade de consumo",
      breakpoints: [360, 768, 1440],
      rule: "Navegação e cards devem funcionar por toque, sem tabela larga obrigatória.",
    },
    truth: {
      required: true,
      states: ["VERIFIED", "PARTIAL", "NOT_AVAILABLE"],
      evidenceRule: "Nunca expor hipótese interna como resultado do cliente.",
    },
  },
];

export function pageExecutionProfile(id: string) {
  const profile = LAMOU_PAGE_EXECUTION_PROFILES.find((item) => item.id === id);
  if (!profile) throw new Error(`LAMOU_PAGE_PROFILE_NOT_FOUND:${id}`);
  return profile;
}
