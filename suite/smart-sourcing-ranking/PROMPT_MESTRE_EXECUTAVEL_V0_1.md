# PROMPT-MESTRE EXECUTÁVEL V0.1 — SMART SOURCING RANKING — TEST/DEMO

Você é simultaneamente arquiteto de software sênior, engenheiro de produto, especialista em varejo omnichannel, supply chain/logística, procurement/RFQ, marketplaces, pricing, negociação, CRM, fidelidade, marketing, UX/UI, dados, segurança e IA explicável. Sua missão é construir um MVP funcional, navegável e testável de uma plataforma de decisão de compra/contratação. Não entregue landing page nem mockup estático.

## NOME
O nome comercial está EM DEFINIÇÃO. No produto use apenas “Ranking Inteligente — DEMO” ou “Projeto Ranking — DEMO”. Não consolidar Meu Ranking, QuoteOn ou Quarion como marca.

## CORE
O produto nasce sobre o APP CORE CUSTOM. Considere já resolvidos e reutilize: autenticação DEMO persistente, usuários/organizações/workspaces, RBAC/ABAC, segurança/LGPD, persistência/autosave, responsividade, acessibilidade, notificações, logs/auditoria, configurações, tratamento de erros, PWA, feature flags, observabilidade, testes e design system básico. Não recrie telas administrativas do CORE se não forem necessárias ao fluxo do MVP. Todo recurso DEMO/simulado deve ser identificado como DEMO/SIMULAÇÃO.

## OBJETIVO
O comprador descreve o que quer por texto, voz simulada, imagem/foto ou link de referência; o sistema estrutura a necessidade, pergunta apenas o que falta, separa requisitos obrigatórios/importantes/desejáveis, encontra produtos/serviços/fornecedores compatíveis, aceita propostas e negociação, considera benefícios econômicos e locais, ranqueia de forma transparente conforme os critérios do comprador, permite contratação e registra promessa versus entrega para reputação futura.

## TIPOS DE SOLUÇÃO
1. Já existe — produto/serviço pronto em loja física ou virtual.
2. Quero negociar — empresas enviam e melhoram propostas até prazo definido.
3. Pode fazer para mim — fabricante, artesão, profissional ou prestador produz sob demanda.
4. Aceito qualquer solução — comparar pronto, negociação e sob medida no mesmo ranking.

## PERSONAS
COMPRADOR: pessoa física ou empresa.
FORNECEDOR: loja física, loja virtual, omnichannel, fabricante, produtor, artesão/maker, prestador, distribuidor ou integrador. Uma empresa pode acumular perfis.

## FLUXO COMPRADOR
### Tela 1 — Home
Cabeçalho “O que você quer encontrar hoje?”. Campo grande para texto + botões Foto, Link e Falar (fala pode ser simulação visual). Ações rápidas: Produto pronto, Negociar, Fazer para mim. Abaixo: rankings ativos, negociações aguardando resposta, benefícios próximos e histórico recente.

### Tela 2 — Criar necessidade
Exemplo DEMO padrão: “Quero um sofá retrátil cinza para minha sala”. Permitir anexar foto demonstrativa ou link. Classificar automaticamente como Produto/Serviço/Sob medida/Projeto e permitir corrigir.

### Tela 3 — Requirement Engine
Formulário dinâmico por categoria. Para sofá: largura máxima, lugares, retrátil/reclinável, cor, material, prazo, montagem. Para armário sob medida: foto/local, largura, altura, profundidade, obstáculos, tomadas, material, acabamento, montagem. Para cortina: largura/altura janela, instalação, varão/trilho, tecido/blackout. Para terno: tamanho padrão ou medidas, tecido, corte, ocasião, prazo. Para serviço digital: escopo, objetivo, prazo, entregáveis, tecnologias/referências. Use campos obrigatórios, condicionais e opcionais.

### Tela 4 — Measurement Capture
Quando aplicável oferecer: estimativa por foto; foto com referência; câmera/AR simulada; LiDAR/laser quando disponível; informar manualmente; solicitar medição profissional. Sempre exibir nível de confiança: baixa/média/boa/alta. Nunca apresentar foto simples como medida exata.

### Tela 5 — Prioridades
Cada critério recebe: Obrigatório (gate eliminatório), Muito importante/Importante, Desejável ou Não importa. Permitir sliders de peso para os não eliminatórios. Mostrar soma/normalização. Preferências existem em 3 camadas: geral, categoria e compra atual.

### Tela 6 — Match
Mostrar simultaneamente opções de loja física, loja virtual e produtor/artesão. Cada card mostra compatibilidade, preço, prazo e badges de benefícios. Dados DEMO coerentes.

### Tela 7 — Smart Flex
Rodar em paralelo sem quebrar o ranking principal. Exemplo: “Entrega em até 2 dias eliminou 73% das opções. Se aceitar 4 dias, aparecem 11 opções e economia estimada de 18%.” Botões “Ver alternativas” e “Alterar requisito”. Só “Alterar requisito” cria nova versão de critérios e recalcula. Exibir versão v1/v2.

### Tela 8 — Propostas
Tabela/cards comparáveis: preço, frete, prazo, garantia, escopo, montagem, cashback, troca física, personalização, assistência local, reputação. Separar “valor financeiro” de “conveniência”.

### Tela 9 — Negociação
Timeline de versões: proposta inicial, contraproposta, proposta final. Permitir fornecedor melhorar preço, prazo, frete, garantia ou benefício. Exibir prazo de encerramento. Ao fechar, congelar propostas.

### Tela 10 — Ranking Inteligente
Primeiro elimine quem não cumpre obrigatório. Depois calcule score ponderado. Mostrar Melhor geral, Menor custo, Melhor produto/serviço, Melhor opção local, Mais rápido e Mais benefícios. Cada resultado precisa de “Por que ficou nesta posição?”. Nada de score secreto.

### Tela 11 — Detalhes do vencedor
Mostrar score, critérios atendidos, pontos fortes, eventuais trade-offs, benefícios, pontos de serviço físicos, histórico/reputação e CTA “Contratar esta proposta”. Não fingir pagamento real: em DEMO, simular contratação e registrar pedido.

### Tela 12 — Pós-venda
Timeline: contratado → produção/separação → pronto → entregue. Ao concluir, comparar Prometido x Entregue: preço, prazo, montagem, benefícios, qualidade. Gerar Trust Score e alimentar reputação.

## LOCAL+ / LOJA FÍSICA
Lojas físicas não recebem bônus oculto. Elas ganham score apenas quando entregam benefícios relevantes ao usuário: retirada imediata, troca/devolução presencial, provador/teste/demonstração, montagem, instalação, configuração, ajuste, reparo, assistência técnica, reserva, estoque local, garantia, retirada de embalagem/produto antigo, atendimento especializado. Criar “Pontos de Serviço” com Retirada, Troca, Assistência, Instalação, Ajuste, Experimentação e Devolução. No MVP pode usar mapa ilustrativo/lista por distância, sem fingir geolocalização real.

## BENEFITS ENGINE
Catálogo padrão: financeiro, logística, loja física, pós-venda, serviços, fidelidade e ecossistema. Fornecedor pode criar benefício exclusivo; classificar antes de usá-lo no score. Exemplos de parceria: roupa → acessórios/calçados; móvel → montagem/decoração; evento → bolo/flores/fotografia. Exibir valor monetário quando verificável e conveniência separadamente.

## FORNECEDOR — DASHBOARD
Home com oportunidades compatíveis, propostas em aberto, negociações, vitórias, perdas e reputação. Seções: Oportunidades; Produtos/Serviços; Capacidades; Benefícios; Parcerias; Lojas/Unidades; Propostas; Negociações; Pedidos/Contratos; Reputação; Rankings; Inteligência Comercial. Cadastro de fornecedor deve permitir múltiplos perfis e múltiplas unidades físicas.

## RANKINGS DE MERCADO
Criar telas DEMO para: melhores propostas, melhores empresas, melhores negociadores, custo-benefício, qualidade, prazo, confiabilidade, melhores lojas físicas, melhores lojas virtuais, melhores produtores/artesãos e revelação do mês. Sempre por categoria/subcategoria e, quando aplicável, região. Novo fornecedor deve aparecer como “Ranking provisório” até amostra mínima.

## REGRAS DO RANKING ENGINE
- obrigatório = eliminatório no ranking principal;
- Smart Flex apenas sugere alternativa;
- mudança de critério após disputa aberta gera nova versão e log;
- fornecedor favorito só entra se peso explícito estiver ativado;
- monetização/premium nunca altera score técnico;
- desempates devem ser documentados;
- feedback para perdedor não revela proposta confidencial de concorrente;
- score deve exibir composição por critérios e explicação textual curta.

## DADOS DEMO OBRIGATÓRIOS
Crie ao menos 1 comprador DEMO e 6 fornecedores DEMO misturando loja física, virtual, omnichannel e artesão/fabricante. Crie um ranking de sofá ou móvel sob medida com 5 propostas, pelo menos 1 eliminada por obrigatório, 1 Smart Flex útil, 2 rodadas de negociação e 1 fornecedor Local+ com troca/montagem/parceria. Crie também pequenos exemplos de Serviço Digital e Terno sob medida para demonstrar schemas diferentes.

## DESIGN
Mobile-first e desktop impecável. Base branca/branco-gelo, azul profundo estrutural, índigo/roxo apenas para IA/ranking, verde para ganho/confirmado, âmbar para Smart Flex, vermelho para eliminatório. Cards limpos, sombra leve, bordas médias, muito espaço em branco. Evitar neon, dashboards carregados e visual genérico de IA. Navegação inferior no mobile e sidebar retrátil no desktop. Componentes com microanimações discretas.

## FUNCIONALIDADE
Não criar botão morto. Fluxos principais devem funcionar com estado real do app. Pode usar persistência local-first para TEST/DEMO, claramente marcada, enquanto backend oficial não estiver conectado. Salvar rascunho, preferências, propostas, versões, ranking e pedido DEMO. Criar troca rápida de persona Comprador/Fornecedor no modo DEMO.

## NÃO FAZER
- não inventar integração real com lojas, pagamentos, Google Shopping, mapas, AR/LiDAR ou APIs;
- não afirmar medidas exatas quando simuladas;
- não transformar publicidade em score;
- não escolher vencedor fora das regras definidas;
- não esconder por que uma proposta perdeu;
- não usar nome comercial definitivo.

## CRITÉRIO DE ACEITE DO MVP
O usuário deve conseguir, do início ao fim: criar uma necessidade, ver formulário dinâmico, informar/estimar medidas quando aplicável, definir prioridades, receber opções variadas, ver Smart Flex, abrir negociação, comparar versões, fechar a rodada, obter ranking explicável, contratar em DEMO, acompanhar entrega e gerar reputação. O fornecedor deve conseguir ver oportunidade, cadastrar benefício, enviar/melhorar proposta e receber feedback de resultado.

Entregue produto funcional, não uma apresentação do conceito.
