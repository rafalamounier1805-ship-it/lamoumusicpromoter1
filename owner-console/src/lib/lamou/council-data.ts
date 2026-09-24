/**
 * LAMOU OWNER — Conselho & Skills (Router V0.2)
 * Perfis profissionais = skill/lente. Plugin = dados/execução (não incluído aqui).
 * Todos os perfis são definições operacionais internas (FACT/EVIDENCED como
 * definição), sem alegação de execução automática de terceiros.
 */

export type TaskType =
  | "produto"
  | "ux"
  | "arquitetura"
  | "implementacao"
  | "dados-ia"
  | "matematica"
  | "fisica"
  | "telecom"
  | "biologia"
  | "farmaceutica"
  | "qualidade"
  | "seguranca"
  | "inovacao"
  | "industria"
  | "financeiro";

export const TASK_TYPE_LABEL: Record<TaskType, string> = {
  produto: "Produto",
  ux: "UX / Interface",
  arquitetura: "Arquitetura",
  implementacao: "Implementação",
  "dados-ia": "Dados & IA",
  matematica: "Matemática / Modelagem",
  fisica: "Física",
  telecom: "Telecom / Fotônica",
  biologia: "Biologia / Sistemas complexos",
  farmaceutica: "Farmacêutica / PAT / QbD",
  qualidade: "Qualidade & Validação",
  seguranca: "Segurança",
  inovacao: "Inovação / Scouting",
  industria: "Indústria / Manufatura / Processo",
  financeiro: "Financeiro / ROI",
};

export type RoleFamily =
  | "produto"
  | "engenharia"
  | "dados"
  | "ciencia"
  | "vida"
  | "industria"
  | "qualidade"
  | "estrategia";

export const ROLE_FAMILY_LABEL: Record<RoleFamily, string> = {
  produto: "Produto & Design",
  engenharia: "Engenharia de Software",
  dados: "Dados, IA & Estatística",
  ciencia: "Ciências Exatas & Física",
  vida: "Ciências da Vida",
  industria: "Indústria & Processo",
  qualidade: "Qualidade, Validação & Segurança",
  estrategia: "Estratégia, Inovação & Valor",
};

export type TruthState =
  | "FACT/EVIDENCED"
  | "EXTERNAL_EVIDENCE"
  | "HYPOTHESIS"
  | "SYNTHETIC_DEMO"
  | "NOT_VERIFIED"
  | "BLOCKED"
  | "IMPLEMENTED_VERIFIED"
  | "IMPLEMENTED_NOT_VERIFIED"
  | "PARTIAL"
  | "SIMULATED"
  | "DOCUMENTED_ONLY"
  | "NOT_CONNECTED"
  | "NOT_APPLICABLE";

export interface ProfessionalRole {
  id: string;
  name: string;
  family: RoleFamily;
  mission: string;
  competencies: string[];
  mandatoryQuestions: string[];
  adaptiveQuestions: string[];
  evidenceNeeded: string[];
  criteria: string[];
  redFlags: string[];
  dod: string[];
  limits: string[];
  fit: Partial<Record<TaskType, number>>;
}

const familyDefaults: Record<
  RoleFamily,
  { evidence: string[]; criteria: string[]; redFlags: string[]; dod: string[]; limits: string[] }
> = {
  produto: {
    evidence: ["Registro de problema com origem rastreável", "Sinal de uso ou relato do Owner"],
    criteria: ["Problema descrito antes da solução", "Critério de sucesso observável"],
    redFlags: ["Solução sem problema declarado", "Escopo crescendo sem evidência"],
    dod: ["Problema, decisão e critério registrados", "Impacto de não fazer documentado"],
    limits: ["Não decide viabilidade técnica sozinho"],
  },
  engenharia: {
    evidence: ["Trecho de código, log ou erro real", "Dependências e consumidores mapeados"],
    criteria: ["Mudança reversível ou com rollback", "Sem quebra de contrato existente"],
    redFlags: ["Remover código sem provenance gate", "Refatoração sem teste ou evidência"],
    dod: ["Build verde e comportamento verificado", "Decisão registrada com provenance"],
    limits: ["Não valida ciência do domínio"],
  },
  dados: {
    evidence: ["Fonte de dados identificada com data", "Distribuição, tamanho de amostra e ruído"],
    criteria: ["Métrica separada de opinião", "Incerteza declarada e não decorativa"],
    redFlags: ["Percentual sem base calibrada", "Correlação apresentada como causa"],
    dod: ["Método, dados e limitações registrados", "Truth-state atribuído ao resultado"],
    limits: ["Não converte estimativa heurística em probabilidade científica"],
  },
  ciencia: {
    evidence: [
      "Referência externa com fonte/DOI/URL e data",
      "Ordem de grandeza e limites físicos",
    ],
    criteria: [
      "Mecanismo plausível e falsificável",
      "Distinção entre ciência existente e hipótese LAMOU",
    ],
    redFlags: ["Violação de limite físico conhecido", "Mecanismo declarado sem teste possível"],
    dod: ["Hipótese, falsificadores e teste mínimo definidos", "Truth-state explícito"],
    limits: ["Não afirma resultado sem experimento"],
  },
  vida: {
    evidence: ["Estudo externo citado com tipo e limitações", "Dados biológicos com contexto"],
    criteria: ["Sem alegação clínica", "Escopo pesquisa/hipótese declarado"],
    redFlags: ["Promessa terapêutica", "Extrapolação de in vitro para humano"],
    dod: ["Escopo de pesquisa e limites registrados", "Truth-state explícito"],
    limits: ["Nenhuma recomendação clínica ou diagnóstica"],
  },
  industria: {
    evidence: ["Dados de processo com unidade e período", "Especificação e faixa de controle"],
    criteria: ["Rastreabilidade do lote/processo", "Controle antes de otimização"],
    redFlags: ["Otimizar processo fora de controle", "Alterar parâmetro sem registro"],
    dod: ["Parâmetro crítico e evidência registrados", "Impacto em qualidade avaliado"],
    limits: ["Não substitui validação regulatória formal"],
  },
  qualidade: {
    evidence: ["Evidência de teste com data, executor e resultado", "Trilha de auditoria"],
    criteria: ["Teste reproduzível", "Falso positivo/negativo tratado explicitamente"],
    redFlags: ["Aprovação sem evidência anexada", "Teste rodado só no ambiente de quem escreveu"],
    dod: ["Evidência anexada e reteste definido", "Estado de aprovação justificado"],
    limits: ["Não promove versão sem gate completo"],
  },
  estrategia: {
    evidence: ["Fonte de mercado ou contrato real", "Custo e uso observados"],
    criteria: ["Valor atual separado de valor potencial", "Método de cálculo explícito"],
    redFlags: ["Projeção sem método", "Valor potencial exibido como receita"],
    dod: ["Método, premissa e faixa registrados", "Truth-state explícito"],
    limits: ["Não garante resultado comercial"],
  },
};

type RoleSeed = [
  id: string,
  name: string,
  family: RoleFamily,
  mission: string,
  competencies: string[],
  mandatory: string[],
  adaptive: string[],
  fit: Partial<Record<TaskType, number>>,
];

const seeds: RoleSeed[] = [
  [
    "product-manager",
    "Product Manager",
    "produto",
    "Garantir que cada evolução resolva problema real do Owner e não vire escopo solto.",
    [
      "Descoberta de problema",
      "Priorização por impacto",
      "Definição de critério de sucesso",
      "Trade-off escopo/risco",
    ],
    [
      "Qual problema exatamente deixa de existir?",
      "Como saberemos que resolveu?",
      "O que acontece se não fizermos?",
    ],
    ["Existe algo já no app que resolve parcialmente?", "Quem consome essa saída hoje?"],
    { produto: 95, ux: 70, inovacao: 65, financeiro: 55, arquitetura: 40 },
  ],
  [
    "product-designer",
    "Product Designer",
    "produto",
    "Traduzir fluxo Owner em telas legíveis, sem botão fake e sem sobrecarga cognitiva.",
    [
      "Fluxo e arquitetura de telas",
      "Hierarquia visual",
      "Estados vazios e de erro",
      "Consistência de padrão",
    ],
    ["Qual decisão o usuário toma nesta tela?", "Qual é o estado quando não há dado real?"],
    ["Essa tela precisa existir ou é uma aba?", "Há duplicidade com módulo existente?"],
    { ux: 95, produto: 75, implementacao: 45 },
  ],
  [
    "ux-researcher",
    "UX Researcher",
    "produto",
    "Separar o que é evidência de uso do que é suposição do time.",
    [
      "Roteiro de entrevista",
      "Análise qualitativa",
      "Teste de usabilidade",
      "Triangulação de sinais",
    ],
    ["Que evidência de uso já existe?", "Essa dor foi observada ou suposta?"],
    ["Qual amostra sustentaria essa conclusão?", "Que sinal falsificaria a hipótese?"],
    { ux: 90, produto: 70, "dados-ia": 40 },
  ],
  [
    "ui-designer",
    "UI Designer",
    "produto",
    "Manter acabamento premium dark, contraste e ritmo visual do Owner Console.",
    ["Tipografia e escala", "Cor e contraste", "Densidade de informação", "Microestados"],
    ["Qual token semântico cobre essa cor?", "O contraste passa em texto pequeno?"],
    ["Precisa de novo componente ou variação?", "Esse ícone já existe na Biblioteca Visual?"],
    { ux: 92, implementacao: 40 },
  ],
  [
    "design-system-architect",
    "Design System Architect",
    "produto",
    "Proteger tokens, códigos imutáveis de asset e evitar divergência visual.",
    [
      "Tokens semânticos",
      "Versionamento de asset",
      "Change request de visual",
      "Governança de componentes",
    ],
    ["Esse asset tem código e versão?", "A mudança exige change request?"],
    ["Existe componente equivalente para reuso?", "O asset está CONGELADO?"],
    { ux: 85, arquitetura: 60, qualidade: 45 },
  ],
  [
    "accessibility-specialist",
    "Accessibility Specialist",
    "produto",
    "Garantir navegação por teclado, foco visível e leitura assistiva.",
    ["WCAG 2.2", "Foco e ordem de tabulação", "Semântica ARIA", "Contraste"],
    ["Dá para operar tudo sem mouse?", "O foco é visível em fundo escuro?"],
    ["Há rótulo acessível em cada controle?", "Alertas são anunciados?"],
    { ux: 88, implementacao: 50, qualidade: 45 },
  ],
  [
    "software-architect",
    "Software Architect",
    "engenharia",
    "Preservar separação Owner × Cliente e CORE Padrão × CORE Cubo.",
    ["Fronteiras de módulo", "Contratos de dados", "Estratégia de estado", "Custo de mudança"],
    ["Que fronteira essa mudança atravessa?", "Quais consumidores dependem disso?"],
    ["Isso é candidata derivada ou alteração de baseline?", "Existe caminho reversível?"],
    { arquitetura: 96, implementacao: 75, seguranca: 55, "dados-ia": 45 },
  ],
  [
    "software-engineer",
    "Software Engineer",
    "engenharia",
    "Implementar com o menor diff correto e sem quebrar o que existe.",
    ["Refatoração segura", "Tipagem estrita", "Tratamento de erro", "Leitura de código legado"],
    ["O que já existe que faz parte disso?", "Como isso falha e o que o usuário vê?"],
    ["Precisa de teste antes da mudança?", "Há duplicação a mesclar?"],
    { implementacao: 95, arquitetura: 65, qualidade: 50 },
  ],
  [
    "frontend-engineer",
    "Front-end Engineer",
    "engenharia",
    "Entregar telas responsivas e acessíveis sem estado fantasma.",
    ["React 19 / TanStack Router", "Estado de UI", "Performance de render", "Responsividade"],
    ["Qual estado da tela em carregamento, vazio e erro?", "Isso quebra em mobile?"],
    ["Precisa persistir estado local?", "Há re-render desnecessário?"],
    { implementacao: 92, ux: 65, arquitetura: 50 },
  ],
  [
    "backend-engineer",
    "Back-end Engineer",
    "engenharia",
    "Manter segredo no servidor e dados isolados por Owner autenticado.",
    ["Server functions", "Postgres/RLS", "Autenticação", "Idempotência"],
    ["Quem pode chamar isso?", "O segredo fica fora do frontend?"],
    ["Precisa de índice ou paginação?", "Como isso se comporta sem sessão?"],
    { implementacao: 88, arquitetura: 70, seguranca: 70, "dados-ia": 45 },
  ],
  [
    "fullstack-engineer",
    "Full-stack Engineer",
    "engenharia",
    "Fechar o fluxo ponta a ponta, da tela à tabela, sem botão fake.",
    [
      "Fluxo ponta a ponta",
      "Contrato cliente-servidor",
      "Migração incremental",
      "Depuração cruzada",
    ],
    ["O botão faz algo real hoje?", "Qual parte fica em modo local declarado?"],
    ["A persistência pode ser migrada agora?", "Qual estado é fonte de verdade?"],
    { implementacao: 90, arquitetura: 65, produto: 45 },
  ],
  [
    "systems-engineer",
    "Systems Engineer",
    "engenharia",
    "Ver o sistema inteiro: interfaces, requisitos e modos de falha.",
    ["Requisitos e rastreabilidade", "FMEA", "Interfaces e integração", "Margens de projeto"],
    ["Quais interfaces e requisitos são afetados?", "Quais modos de falha aparecem?"],
    ["Qual margem existe antes da falha?", "Há requisito não rastreado?"],
    { arquitetura: 80, fisica: 60, telecom: 60, qualidade: 65 },
  ],
  [
    "data-scientist",
    "Data Scientist",
    "dados",
    "Extrair sinal de dado real e recusar número sem base.",
    ["Modelagem preditiva", "Validação cruzada", "Feature engineering", "Comunicação de incerteza"],
    ["Qual é o dado real e de quando?", "Qual baseline vence o modelo?"],
    ["Há vazamento de informação?", "Qual métrica reflete a decisão?"],
    { "dados-ia": 95, matematica: 70, produto: 45 },
  ],
  [
    "data-engineer",
    "Data Engineer",
    "dados",
    "Garantir pipeline rastreável, com origem, data e reprocessamento.",
    [
      "Ingestão e ETL",
      "Qualidade de dados",
      "Versionamento de dataset",
      "Observabilidade de pipeline",
    ],
    ["De onde vem, com que frequência e quem escreve?", "Como reprocessamos?"],
    ["Há schema evolutivo?", "Qual volume esperado?"],
    { "dados-ia": 88, arquitetura: 60, implementacao: 55 },
  ],
  [
    "data-architect",
    "Data Architect",
    "dados",
    "Modelar domínio LAMOU sem perder conceito nem misturar Owner e cliente.",
    ["Modelagem relacional", "Governança e isolamento", "Linhagem de dado", "Chaves e integridade"],
    ["Esse conceito já tem tabela?", "O isolamento por Owner está garantido?"],
    ["Precisa de coluna nova ou tabela nova?", "Quem consome esse dado?"],
    { arquitetura: 82, "dados-ia": 80, seguranca: 55 },
  ],
  [
    "statistician",
    "Statistician",
    "dados",
    "Proteger o app de probabilidade decorativa e inferência indevida.",
    ["Inferência", "Poder de teste e amostra", "Intervalos de confiança", "Múltiplas comparações"],
    ["Essa estimativa é calibrada?", "Qual amostra e qual incerteza?"],
    ["O desenho permite inferência causal?", "Qual intervalo é honesto exibir?"],
    { matematica: 90, "dados-ia": 85, farmaceutica: 60, biologia: 55 },
  ],
  [
    "operations-research",
    "Operations Research Analyst",
    "dados",
    "Formular decisão como otimização com restrições declaradas.",
    ["Programação linear/inteira", "Filas e simulação", "Heurísticas", "Análise de sensibilidade"],
    ["Qual objetivo e quais restrições?", "Qual custo de decisão errada?"],
    ["Há solução ótima ou só heurística?", "Qual sensibilidade aos parâmetros?"],
    { matematica: 88, "dados-ia": 65, industria: 60, financeiro: 55 },
  ],
  [
    "mathematical-modeler",
    "Mathematical Modeler",
    "dados",
    "Formalizar mecanismo antes de qualquer número.",
    ["EDO/EDP", "Modelo dimensional", "Validação de modelo", "Análise de estabilidade"],
    ["Qual é a equação/mecanismo assumido?", "Quais unidades e escalas?"],
    ["O modelo é identificável com os dados?", "Qual regime de validade?"],
    { matematica: 95, fisica: 70, biologia: 60 },
  ],
  [
    "theoretical-physicist",
    "Theoretical Physicist",
    "ciencia",
    "Checar se o conceito respeita leis físicas antes de virar engenharia.",
    [
      "Formalismo teórico",
      "Simetrias e conservação",
      "Limites assintóticos",
      "Estimativa de ordem de grandeza",
    ],
    ["Qual lei física limita isso?", "Qual é o limite superior teórico?"],
    ["Qual aproximação é aceitável?", "Existe análogo conhecido na literatura?"],
    { fisica: 96, matematica: 75, telecom: 55 },
  ],
  [
    "quantum-physics-phd",
    "Quantum Physics PhD Specialist",
    "ciencia",
    "Distinguir efeito quântico real de metáfora quântica.",
    [
      "Estados e emaranhamento",
      "Decoerência e ruído",
      "Medição e no-cloning",
      "Metrologia quântica",
    ],
    [
      "Existe coerência mensurável nesse regime?",
      "Isso viola no-cloning ou apenas copia clássica?",
    ],
    ["Qual temperatura/ruído é tolerável?", "O ganho sobrevive à decoerência?"],
    { fisica: 94, telecom: 70, matematica: 60 },
  ],
  [
    "complex-systems-physicist",
    "Complex Systems Physicist",
    "ciencia",
    "Ler o sistema LAMOU como rede com emergência e transições.",
    [
      "Redes e criticalidade",
      "Transição de fase",
      "Sinais precoces de ruptura",
      "Sistemas dinâmicos",
    ],
    ["Qual variável de ordem descreve o estado?", "Há sinal precoce antes da falha?"],
    ["O sistema está perto de criticalidade?", "Qual acoplamento domina?"],
    { fisica: 88, biologia: 75, matematica: 70, "dados-ia": 60 },
  ],
  [
    "experimental-physicist",
    "Experimental Physicist",
    "ciencia",
    "Definir o experimento mínimo que falsifica a hipótese.",
    [
      "Desenho de bancada",
      "Instrumentação e calibração",
      "Controle de artefato",
      "Propagação de erro",
    ],
    ["Qual medição decide isso?", "Qual controle elimina artefato?"],
    ["Qual instrumento e incerteza?", "O experimento é repetível fora do laboratório?"],
    { fisica: 92, telecom: 65, qualidade: 60 },
  ],
  [
    "photonics-engineer",
    "Photonics / Optical Communications Engineer",
    "ciencia",
    "Avaliar caminhos ópticos, perdas e multiplexação com números reais.",
    [
      "Fibra e amplificação",
      "WDM/roteamento óptico",
      "Orçamento de potência e OSNR",
      "Modulação e detecção",
    ],
    ["Qual é o orçamento de potência e perda por ramo?", "Qual penalidade de OSNR ao dividir?"],
    ["Precisa de regeneração ou amplificação por ramo?", "Qual latência acrescentada?"],
    { telecom: 96, fisica: 80, arquitetura: 45 },
  ],
  [
    "systems-biologist",
    "Systems Biologist",
    "vida",
    "Tratar biologia como rede regulada, sem alegação clínica.",
    ["Vias e regulação", "Modelos multiescala", "Homeostase e robustez", "Perturbação e resposta"],
    ["Qual via ou rede é afetada?", "Isso é in silico, in vitro ou hipótese?"],
    ["Qual perturbação testável existe?", "Qual robustez do sistema?"],
    { biologia: 95, "dados-ia": 55, farmaceutica: 55 },
  ],
  [
    "computational-biologist",
    "Computational Biologist / Bioinformatician",
    "vida",
    "Analisar dado biológico com pipeline e controle de qualidade explícitos.",
    ["Ômicas", "Pipelines reprodutíveis", "Anotação e bancos públicos", "Controle de FDR"],
    ["Qual conjunto de dados público ou próprio?", "Qual controle de falso descobrimento?"],
    ["Qual pipeline e versão?", "Como o batch effect é tratado?"],
    { biologia: 90, "dados-ia": 75, matematica: 55 },
  ],
  [
    "biostatistician",
    "Biostatistician",
    "vida",
    "Impedir conclusão biológica sem desenho estatístico.",
    ["Desenho de estudo", "Sobrevivência e modelos mistos", "Tamanho de amostra", "Vieses"],
    ["Qual desenho e qual poder estatístico?", "Quais vieses conhecidos?"],
    ["Há confundidores medidos?", "A análise foi pré-especificada?"],
    { biologia: 85, farmaceutica: 75, matematica: 75 },
  ],
  [
    "pharmaceutical-scientist",
    "Pharmaceutical Scientist",
    "vida",
    "Avaliar formulação e estabilidade em escopo de pesquisa.",
    ["Formulação", "Estabilidade e degradação", "Dissolução", "Caracterização físico-química"],
    ["Qual atributo crítico de qualidade está em jogo?", "Qual escopo: pesquisa ou produto?"],
    ["Qual método analítico sustenta isso?", "Existe dado de estabilidade?"],
    { farmaceutica: 92, industria: 65, biologia: 60 },
  ],
  [
    "pharma-process-engineer",
    "Pharmaceutical Process Engineer",
    "industria",
    "Ligar parâmetro de processo a atributo de qualidade com rastreabilidade.",
    [
      "Scale-up",
      "Balanço de massa e energia",
      "Controle de processo",
      "Transferência de tecnologia",
    ],
    ["Quais parâmetros críticos e faixas?", "O processo está sob controle estatístico?"],
    ["Qual impacto no atributo de qualidade?", "Qual risco no scale-up?"],
    { farmaceutica: 90, industria: 90, qualidade: 65 },
  ],
  [
    "pat-specialist",
    "PAT Specialist",
    "industria",
    "Medir em linha o que hoje só se mede no fim.",
    [
      "Espectroscopia em linha (NIR/Raman)",
      "Quimiometria",
      "Modelos de calibração",
      "Monitoramento contínuo",
    ],
    [
      "Qual sinal em linha correlaciona com o atributo?",
      "Qual conjunto de calibração e validação?",
    ],
    ["O modelo tem transferência entre equipamentos?", "Como detectar deriva do sensor?"],
    { farmaceutica: 94, industria: 85, "dados-ia": 70 },
  ],
  [
    "qbd-specialist",
    "QbD Specialist",
    "industria",
    "Definir espaço de projeto por risco, não por tentativa.",
    ["QTPP e CQA", "Análise de risco", "DoE e espaço de projeto", "Estratégia de controle"],
    ["Qual é o QTPP e quais CQAs?", "Qual espaço de projeto está demonstrado?"],
    ["Qual DoE cobre as interações?", "Qual estratégia de controle resultante?"],
    { farmaceutica: 93, industria: 80, qualidade: 75 },
  ],
  [
    "gmp-csv-validation",
    "GMP / CSV / CSA Validation Specialist",
    "qualidade",
    "Exigir trilha de auditoria, rastreabilidade e evidência antes de aprovar.",
    [
      "GxP e integridade de dados (ALCOA+)",
      "CSV/CSA por risco",
      "Qualificação IQ/OQ/PQ",
      "Gestão de mudança",
    ],
    ["Qual evidência de validação existe?", "A trilha de auditoria é íntegra?"],
    ["Qual classificação de risco do sistema?", "A mudança exige revalidação?"],
    { qualidade: 95, farmaceutica: 85, seguranca: 60 },
  ],
  [
    "qa-test-architect",
    "QA / Test Architect",
    "qualidade",
    "Transformar dúvida em teste com evidência e reteste.",
    ["Estratégia de teste", "Falso positivo/negativo", "Automação", "Critério de aceite"],
    ["Qual teste falsifica a mudança?", "Qual evidência será anexada?"],
    ["Precisa de reteste após correção?", "Qual cobertura é suficiente?"],
    { qualidade: 96, implementacao: 65, "dados-ia": 45 },
  ],
  [
    "security-architect",
    "Security Architect",
    "qualidade",
    "Proteger isolamento, segredo e permissão do Owner.",
    [
      "Modelagem de ameaça",
      "Autenticação e autorização",
      "Gestão de segredo",
      "Isolamento multi-tenant",
    ],
    ["Quem pode ler e escrever isso?", "Onde o segredo vive?"],
    ["Qual superfície fica pública?", "Como detectamos abuso?"],
    { seguranca: 96, arquitetura: 70, implementacao: 60 },
  ],
  [
    "technology-scout",
    "Technology Scout",
    "estrategia",
    "Mapear o que já existe fora antes de inventar dentro.",
    [
      "Vigilância tecnológica",
      "Análise de patente e literatura",
      "Benchmark de fornecedores",
      "Maturidade (TRL)",
    ],
    ["Isso já existe pronto no mercado?", "Qual TRL e quem já publicou?"],
    ["Há patente bloqueando?", "Comprar, integrar ou construir?"],
    { inovacao: 95, arquitetura: 45, financeiro: 50 },
  ],
  [
    "innovation-strategist",
    "Innovation Strategist",
    "estrategia",
    "Escolher onde a aposta LAMOU vale o risco.",
    [
      "Portfólio de apostas",
      "Horizontes 1/2/3",
      "Hipótese de valor",
      "Gestão de risco de inovação",
    ],
    ["Qual hipótese de valor e qual horizonte?", "Qual o menor teste que gera aprendizado?"],
    ["Quanto perdemos se falhar?", "Qual sinal encerra a aposta?"],
    { inovacao: 92, produto: 60, financeiro: 60 },
  ],
  [
    "research-scientist",
    "Research Scientist / Experimental Design",
    "ciencia",
    "Escrever o protocolo que separa achado de ilusão.",
    [
      "Protocolo e hipótese",
      "Controles e cegamento",
      "Replicação",
      "Registro de resultado negativo",
    ],
    ["Qual hipótese nula?", "Quais controles e replicatas?"],
    ["O resultado negativo será registrado?", "Quem replica de forma independente?"],
    { fisica: 70, biologia: 70, qualidade: 65, "dados-ia": 55, farmaceutica: 60 },
  ],
  [
    "financial-roi-analyst",
    "Financial / ROI Analyst",
    "estrategia",
    "Separar valor atual de valor potencial com método visível.",
    ["Modelagem de custo", "ROI e payback", "Precificação por plano", "Sensibilidade de cenário"],
    ["Qual custo real e qual receita observada?", "Qual método sustenta o potencial?"],
    ["Qual cenário pessimista?", "Qual premissa domina o resultado?"],
    { financeiro: 96, inovacao: 60, produto: 50 },
  ],
];

export const PROFESSIONAL_ROLES: ProfessionalRole[] = seeds.map(
  ([id, name, family, mission, competencies, mandatoryQuestions, adaptiveQuestions, fit]) => ({
    id,
    name,
    family,
    mission,
    competencies,
    mandatoryQuestions,
    adaptiveQuestions,
    evidenceNeeded: familyDefaults[family].evidence,
    criteria: familyDefaults[family].criteria,
    redFlags: familyDefaults[family].redFlags,
    dod: familyDefaults[family].dod,
    limits: [
      ...familyDefaults[family].limits,
      "Não afirma integração, dado ou evidência que não exista no app",
    ],
    fit,
  }),
);

export type RouterMode = "AUTO" | "CONSELHO" | "PROFUNDO";

export const ROUTER_MODES: {
  mode: RouterMode;
  summary: string;
  behaviour: string[];
  minRoles: number;
  extras: string[];
}[] = [
  {
    mode: "AUTO",
    summary: "Seleciona apenas os especialistas pertinentes ao tipo de tarefa.",
    behaviour: [
      "Ordena perfis por aderência ao tipo de tarefa",
      "Convoca o núcleo mínimo suficiente",
      "Mostra 'O que já sabemos?' antes de qualquer pergunta",
    ],
    minRoles: 3,
    extras: [],
  },
  {
    mode: "CONSELHO",
    summary: "Amplia a revisão com lentes adjacentes e registro de divergência.",
    behaviour: [
      "Inclui perfis de famílias adjacentes",
      "Exige registro de divergência quando houver conflito",
      "Consolida critérios e Definition of Done por perfil",
    ],
    minRoles: 6,
    extras: ["Revisão cruzada entre famílias"],
  },
  {
    mode: "PROFUNDO",
    summary: "Revisão independente, contraditor/Red Team e síntese final.",
    behaviour: [
      "Executa revisão independente sem ver a conclusão inicial",
      "Aplica contraditor/Red Team para tentar derrubar a proposta",
      "Gera síntese com truth-state e pendências abertas",
    ],
    minRoles: 9,
    extras: ["Revisão independente", "Contraditor / Red Team", "Síntese com truth-state"],
  },
];

export interface KnownItem {
  label: string;
  value: string;
  truth: TruthState;
}

/** "O que já sabemos?" — base para não repetir perguntas ao Owner. */
export const KNOWN_BASE: KnownItem[] = [
  {
    label: "Escopo do projeto",
    value: "CORE PROPRIETÁRIO / OWNER privado, isolado de cliente",
    truth: "FACT/EVIDENCED",
  },
  {
    label: "Regra de promoção",
    value: "SALVAR ≠ PROMOVER; FROZEN não editável",
    truth: "FACT/EVIDENCED",
  },
  { label: "Idioma da interface", value: "PT-BR, Owner premium, dark", truth: "FACT/EVIDENCED" },
  {
    label: "Autenticação",
    value: "E-mail/senha com sessão persistente (backend Lovable Cloud)",
    truth: "FACT/EVIDENCED",
  },
  {
    label: "Dados dos módulos legados",
    value: "Conjunto DEMO marcado, salvo localmente",
    truth: "SYNTHETIC_DEMO",
  },
  {
    label: "Conceitos do Cubo/Prisma",
    value: "Isolados como EXPERIMENTAL / NÃO VALIDADO",
    truth: "HYPOTHESIS",
  },
  {
    label: "Chave de IA",
    value: "Deve viver server-side; estado exibido em Configurações",
    truth: "NOT_VERIFIED",
  },
];

export interface VoiQuestion {
  id: string;
  question: string;
  impact: number; // Value of Information 0-100
  interestedRoles: string[];
  state: "aberta" | "respondida" | "dispensada";
  decisionInfluenced: string;
  answer?: string;
  alreadyKnown?: string;
}

export const VOI_QUESTIONS: VoiQuestion[] = [
  {
    id: "VOI-001",
    question: "Quais módulos passam a persistir no banco nesta etapa e quais seguem locais?",
    impact: 92,
    interestedRoles: ["software-architect", "data-architect", "backend-engineer"],
    state: "respondida",
    decisionInfluenced: "Escopo da migração de persistência",
    answer:
      "Conselho, Decisões, Lab e uso de IA vão ao banco; módulos legados seguem locais e marcados.",
  },
  {
    id: "VOI-002",
    question: "O Owner aceita confirmação de e-mail no primeiro acesso?",
    impact: 78,
    interestedRoles: ["security-architect", "product-manager"],
    state: "aberta",
    decisionInfluenced: "Fluxo de criação da primeira conta Owner",
    alreadyKnown: "Auto-confirmação não é ativada sem pedido explícito.",
  },
  {
    id: "VOI-003",
    question: "Existe dado real de bancada para qualquer conceito do Lab?",
    impact: 88,
    interestedRoles: ["experimental-physicist", "photonics-engineer", "research-scientist"],
    state: "aberta",
    decisionInfluenced: "Evidência específica LAMOU sai de 0 e readiness pode subir",
    alreadyKnown: "Hoje nenhum conceito tem evidência interna: métrica exibida como INDETERMINADO.",
  },
  {
    id: "VOI-004",
    question: "Qual provedor de IA será configurado como secret server-side?",
    impact: 70,
    interestedRoles: ["backend-engineer", "security-architect", "financial-roi-analyst"],
    state: "aberta",
    decisionInfluenced: "Registro de custo e uso por execução do Conselho",
    alreadyKnown: "Nenhuma chave está configurada; estado NÃO CONFIGURADA.",
  },
  {
    id: "VOI-005",
    question: "Alguma retirada de campo/módulo está pedida hoje?",
    impact: 64,
    interestedRoles: ["product-manager", "software-architect"],
    state: "respondida",
    decisionInfluenced: "Uso do Decision & Provenance Gate",
    answer: "Nenhuma. Nada foi removido; tudo preservado e ampliado como candidata derivada.",
  },
];

export type DecisionOutcome = "KEEP" | "IMPROVE" | "RELOCATE" | "MERGE" | "DEPRECATE" | "REMOVE";

export const DECISION_OUTCOMES: DecisionOutcome[] = [
  "KEEP",
  "IMPROVE",
  "RELOCATE",
  "MERGE",
  "DEPRECATE",
  "REMOVE",
];

export interface ProvenanceDecision {
  id: string;
  subject: string;
  whyExists: string;
  origin: string;
  requestedBy: string;
  dependencies: string;
  consumers: string;
  evidence: string;
  history: string;
  removalImpact: string;
  outcome: DecisionOutcome | null;
  justification: string;
  truth: TruthState;
  at: string;
  persisted: boolean;
}

export const DECISIONS_SEED: ProvenanceDecision[] = [
  {
    id: "DEC-0001",
    subject: "CORE Cubo / Prisma / Snapshot",
    whyExists:
      "Linha experimental de investigação LAMOU sobre estados e ramificação de informação.",
    origin: "Conceito próprio do Owner, registrado antes desta versão do app.",
    requestedBy: "Rafael Lamounier (Owner)",
    dependencies: "Research & Theory Lab, Caleidoscópio, Matriz de Verdade Científica.",
    consumers: "Owner; nenhum cliente; nenhum app em produção.",
    evidence: "Sem evidência interna; base externa parcial por analogia de literatura.",
    history: "Mantido isolado do CORE Padrão desde a definição da governança.",
    removalImpact: "Perda total da linha de pesquisa e do histórico conceitual. Irreversível.",
    outcome: "KEEP",
    justification:
      "Preservação obrigatória: conceito é ativo de pesquisa, isolado e sem risco ao CORE Padrão.",
    truth: "HYPOTHESIS",
    at: "2026-09-10",
    persisted: false,
  },
  {
    id: "DEC-0002",
    subject: "Dados DEMO dos módulos legados",
    whyExists: "Permitir navegação e validação de fluxo antes de integração real.",
    origin: "Primeira versão do Owner Console.",
    requestedBy: "Rafael Lamounier (Owner)",
    dependencies: "Cockpit, Mapa Vivo, Clientes, Comercial, Testes, Versões.",
    consumers: "Owner, durante avaliação de layout e fluxo.",
    evidence: "Marcados como SYNTHETIC_DEMO em cada tela.",
    history: "Criados junto do design system dark.",
    removalImpact: "Telas ficariam vazias sem fluxo demonstrável; perda de referência de layout.",
    outcome: "IMPROVE",
    justification: "Manter com marcação DEMO e migrar por módulo conforme integração real existir.",
    truth: "SYNTHETIC_DEMO",
    at: "2026-09-10",
    persisted: false,
  },
];

export interface CouncilRun {
  id: string;
  task: string;
  taskType: TaskType;
  mode: RouterMode;
  roles: string[];
  status: "rascunho" | "concluída" | "bloqueada";
  synthesis: string;
  divergences: { roles: string[]; topic: string; positions: string[]; resolution: string }[];
  openQuestions: string[];
  truth: TruthState;
  at: string;
  cost: { tokens: number | null; usd: number | null; source: "NÃO CONECTADO" | "registrado" };
  persisted: boolean;
}

export const COUNCIL_RUNS_SEED: CouncilRun[] = [
  {
    id: "RUN-0001",
    task: "Finalizar telas do Owner Console e adicionar Conselho + Lab preservando tudo",
    taskType: "arquitetura",
    mode: "PROFUNDO",
    roles: [
      "software-architect",
      "product-manager",
      "frontend-engineer",
      "backend-engineer",
      "security-architect",
      "design-system-architect",
      "qa-test-architect",
      "data-architect",
      "research-scientist",
    ],
    status: "concluída",
    synthesis:
      "Nada foi removido. Módulos legados preservados em modo local marcado; novos módulos (Conselho, Lab, Decisões, Uso de IA) com tabelas próprias e isolamento por Owner autenticado. Conceitos do Cubo permanecem EXPERIMENTAL / NÃO VALIDADO.",
    divergences: [
      {
        roles: ["backend-engineer", "product-manager"],
        topic: "Migrar todos os módulos para banco agora",
        positions: [
          "Back-end: migrar tudo exige remodelar 12 conjuntos DEMO e aumenta risco de build",
          "Produto: Owner precisa navegar tudo hoje",
        ],
        resolution:
          "Migrar apenas os novos módulos; legado segue local e explicitamente marcado NÃO CONECTADO.",
      },
    ],
    openQuestions: ["VOI-002", "VOI-003", "VOI-004"],
    truth: "FACT/EVIDENCED",
    at: "2026-09-10",
    cost: { tokens: null, usd: null, source: "NÃO CONECTADO" },
    persisted: false,
  },
];

export function rankRoles(taskType: TaskType, mode: RouterMode): ProfessionalRole[] {
  const target = ROUTER_MODES.find((m) => m.mode === mode)?.minRoles ?? 3;
  return [...PROFESSIONAL_ROLES]
    .map((r) => ({ r, score: r.fit[taskType] ?? 0 }))
    .sort((a, b) => b.score - a.score)
    .slice(0, target)
    .map((x) => x.r);
}
