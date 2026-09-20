import { PROFESSIONAL_ROLES } from "@/lib/lamou/council-data";

export const LAMOU_PROMPT_REVIEW = {
  id: "PROMPT-REVIEW-2026-09-20",
  state: "CANDIDATE_NOT_PROMOTED",
  executionMode: "LOCAL_CHECKLISTS_ONLY",
  providerState: "NOT_CONNECTED",
  humanApprovalRequired: true,
  scope: "LAMOU IA Gestão + CORE Proprietário + LABTEST + Cliente; instalação fora do escopo",
  reviewers: [
    {
      roleId: "product-manager",
      lens: "Produto",
      acceptedRules: [
        "Cada página começa pelo problema/decisão do usuário, não por componentes.",
        "Separar gestão, engenharia, validação e cliente.",
        "Não criar item raiz quando o assunto cabe como detalhe contextual.",
        "Todo KPI precisa levar a decisão, ação ou investigação.",
      ],
    },
    {
      roleId: "software-architect",
      lens: "Software / Web CORE",
      acceptedRules: [
        "Reusar shell, rotas, contratos, componentes e assets existentes.",
        "LAMOU IA consome resultado; CORE executa engenharia; LABTEST valida.",
        "SALVAR ≠ PROMOVER e FROZEN não pode ser sobrescrito.",
        "Ação externa sem conexão deve ser NOT_CONNECTED, não simulada como sucesso.",
      ],
    },
    {
      roleId: "product-designer",
      lens: "Tela / UX",
      acceptedRules: [
        "Todo card contém informação útil, contexto e destino real.",
        "Criticidade é filtro funcional; vermelho apenas para erro/bloqueio/crítico.",
        "Resumo primeiro, detalhe contextual depois; sem drawer que empurra a tela.",
        "Dois temas e duas cores de acento controladas: cyan + violet.",
      ],
    },
    {
      roleId: "ui-designer",
      lens: "UI",
      acceptedRules: [
        "Dark navy/charcoal premium e light executivo.",
        "Ícones 3D inventariados quando disponíveis; microações com ícone funcional.",
        "Gráficos com unidade, legenda, fonte, período e estado de verdade.",
        "Ritmo visual consistente entre cards, tags, tabelas, gráficos e ações.",
      ],
    },
    {
      roleId: "learning-experience-designer",
      lens: "Pedagógico / Didático",
      acceptedRules: [
        "Organizar conteúdo na ordem: o que acontece → por que importa → evidência → o que fazer.",
        "Usar ⓘ, microcopy e exemplos curtos em conceitos técnicos.",
        "Estado vazio ensina o próximo passo e não apenas diz 'sem dados'.",
        "Página deve ser compreensível sem treinamento externo e sem remover profundidade.",
      ],
    },
    {
      roleId: "frontend-engineer",
      lens: "Responsivo",
      acceptedRules: [
        "Validar 360, 768, 1440 e Visual Lock 1672×941.",
        "Zero overflow horizontal indevido.",
        "Responsivo reorganiza prioridade; não é desktop reduzido.",
        "Loading, vazio, erro, offline, sem permissão e sem conexão são estados obrigatórios.",
      ],
    },
    {
      roleId: "qa-test-architect",
      lens: "Qualidade",
      acceptedRules: [
        "Botão clicável precisa executar ação real local ou navegar para destino real.",
        "Dados DEMO e não conectados devem ser marcados.",
        "Cada mudança deve passar TypeScript, testes, lint e build.",
        "Validation Gate continua separado de score/maturidade.",
      ],
    },
    {
      roleId: "accessibility-specialist",
      lens: "Acessibilidade",
      acceptedRules: [
        "Operação por teclado, foco visível e labels acessíveis.",
        "Contraste compatível com texto pequeno.",
        "Reduced motion e sem dependência exclusiva de cor.",
        "Alertas e mudanças de estado devem ser compreensíveis por tecnologia assistiva.",
      ],
    },
  ],
} as const;

export function validatedPromptReview() {
  const known = new Set(PROFESSIONAL_ROLES.map((role) => role.id));
  const missing = LAMOU_PROMPT_REVIEW.reviewers
    .map((reviewer) => reviewer.roleId)
    .filter((id) => !known.has(id));
  return {
    ...LAMOU_PROMPT_REVIEW,
    missingRoles: missing,
    valid: missing.length === 0,
  };
}
