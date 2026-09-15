# Varredura funcional + UX — Instalação Owner

## Escopo
Trabalhar somente em `/install/owner`, preservando as sete etapas, o launcher, a persistência local já existente e a regra de Visual Lock invisível no produto. Nenhuma integração será simulada, promovida ou publicada.

## Implementação
1. Criar, dentro dos componentes já usados pela instalação, um padrão compacto de item acionável: ícone informativo com tooltip, estado, fonte, última verificação, impacto, responsável, próximo passo e detalhe expansível.
2. Substituir ações genéricas por CTAs explícitos. Ligar somente destinos reais já existentes (`/owner`, `/owner/mapa-vivo`, `/owner/apps`, `/owner/plans`, `/owner/settings`, `/owner/security`, `/owner/documents`, `/owner/integrations`, `/core`, `/core/tests`, `/core/observability`, `/labtest`). Quando não houver destino executável, manter ação desabilitada com motivo e truth-state correto.
3. Atualizar as sete etapas:
   - Verificação: reverificar somente conectividade local executável, sem transformar estados desconectados em aprovação.
   - Identidade: completar campos mínimos, responsável principal condicional e avatar com preview local e aviso de persistência.
   - Segurança: força/regras de senha, confirmação, MFA e recuperação com estados reais, sessão, dupla autorização e permissões acionáveis.
   - Consentimentos, Configurações, CORE e Testes: aplicar origem → estado → motivo → destino, remover testes simulados e diferenciar SOL operacional de hipóteses no LABTEST.
   - Prontidão: tornar a coluna Ação funcional quando existir rota; caso contrário, desabilitar e explicar o bloqueio.
4. Uniformizar altura e hierarquia de botões, badges e tags; manter seleção ciano/azul, vermelho apenas para bloqueio/erro, foco de teclado e quebra consistente no mobile.
5. Manter apenas a linha das sete etapas e o donut de Prontidão Técnica exclusivamente na etapa final.

## Validação
- Percorrer as sete etapas em 1440×900, 768×1024 e 360×800.
- Exercitar tooltips, detalhes, links reais, ações desabilitadas, avatar local, responsável alternativo e regras de senha.
- Confirmar ausência de screenshots/Visual Lock, rotas inexistentes e erros de console.
- Validar tipos, lint dos arquivos alterados e build automático.

## Estados preservados
`CANDIDATE_NOT_PROMOTED`, `SALVAR ≠ PROMOVER`, `NOT_CONNECTED`, `NOT_VERIFIED`, `PARTIAL` e `DOCUMENTED_ONLY` permanecem explícitos. Ações externas continuam bloqueadas até conexão real.
