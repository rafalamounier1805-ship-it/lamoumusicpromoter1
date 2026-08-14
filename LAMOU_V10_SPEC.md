# LAMOU Music Promoter — Especificação Oficial v10

Esta é a referência oficial para a reconstrução do aplicativo. A interface e o comportamento devem seguir este documento; scripts antigos não devem redefinir o fluxo.

## 1. Entrada e autenticação
- Tela de entrada com logo LAMOU consistente com o aplicativo, efeito visual elegante e layout limpo.
- Campos: usuário/e-mail e senha.
- Fluxos: entrar, primeiro acesso/cadastrar conta, alterar senha, esqueci minha senha, recuperação por e-mail e confirmação de e-mail.
- Senhas nunca em texto puro. Produção: hash seguro no backend, sessão segura e token temporário para recuperação.
- Opção de lembrar este aparelho.
- Cada usuário possui perfil, conexões, catálogo, histórico e resultados próprios.

## 2. Cabeçalho
Depois do login, apenas:
1. LAMOU / Usuário — abre perfil, código AD e conexões.
2. Rodar teste — testa as funções do app.
3. Sair — encerra sessão e retorna à entrada.

No perfil do usuário:
- alterar dados de usuário;
- trocar/conectar perfil do artista;
- informar código AD;
- conectar Spotify, Amuse/distribuidora quando houver integração oficial, Instagram/Meta, TikTok, YouTube e demais integrações necessárias;
- botão Conectar todos inicia a sequência das autorizações oficiais;
- status verde = conectado, amarelo = aguardando/renovar, vermelho = não conectado/erro.

Toda funcionalidade nova deve registrar também seu teste no diagnóstico do aplicativo.

## 3. Tela inicial
Após login, carregar automaticamente as informações autorizadas daquele usuário.

### Perfil do artista
Mostrar somente dados verificados e disponíveis nas fontes conectadas:
- artista;
- quantidade de álbuns/releases;
- quantidade de faixas;
- dados de desempenho disponibilizados oficialmente pelas plataformas conectadas.

Nunca inventar streams, ouvintes, saves ou rankings quando a fonte não fornecer o dado.

### Dashboard LAMOU
Mostrar dados do próprio aplicativo:
- músicas trabalhadas;
- divulgações concluídas;
- campanhas;
- ações Web;
- cliques e resultados rastreados;
- positivo/negativo/em evolução;
- evolução ao longo do tempo.

Navegação principal: Nova música | Histórico | Radar.

## 4. Nova música
Fluxo sempre progressivo, uma etapa por vez.

Primeira etapa:
- Divulgação rápida;
- Campanha;
- Divulgação na Web.

Depois: link da música e identidade (gênero, subgênero, clima, produção e demais características). Cada modalidade abre apenas suas próprias etapas.

## 5. Divulgação rápida
Sequência:
1. Música e identidade.
2. Criativo: IA escolher/criar, capa do Spotify, nova imagem ou vídeo.
3. Hook: upload do áudio, três sugestões automáticas e opção manual.
4. IA cria frase de impacto, descrição, CTA e hashtags com base na música e contexto.
5. Visualizar divulgação.
6. Selecionar canais ou Selecionar todos.
7. Revisão final.
8. PUBLICAR E SALVAR.

Regra de persistência: somente PUBLICAR E SALVAR cria registro no Histórico e conta no Dashboard. Abrir, editar, gerar, visualizar ou abandonar não conta.

## 6. Campanha
Mesmo início: música, identidade, criativo e hook.

Depois a IA cria três estratégias realmente diferentes para a faixa. Cada estratégia explica:
- objetivo;
- duração;
- frequência/intensidade;
- canais;
- conteúdo;
- sequência.

Ao escolher uma estratégia, detalhar cada item da campanha: data/momento, canal, criativo, hook, texto, CTA e hashtags.

Somente PUBLICAR E SALVAR cria histórico/métricas.

## 7. Divulgação na Web
Abrange revistas, portais, blogs, sites, curadores, playlists legítimas, web rádios, comunidades, diretórios, páginas de submissão e rankings/competições de música com IA.

A IA recomenda canais compatíveis. Para cada destino guardar:
- nome;
- tipo;
- país;
- idioma;
- estilos;
- grátis/pago;
- política de música com IA;
- método de envio;
- login necessário;
- link oficial;
- última verificação;
- status verde/amarelo/vermelho.

A base deve ser revalidada a cada 10 dias, incluindo SIQA e novos serviços relevantes.

Regras: sem spam, scraping privado, bypass de login/captcha, bots, compra de streams, promessa de playlist/stream garantido ou violação dos termos.

A IA adapta o pitch por destino. Somente ENVIAR/PUBLICAR E SALVAR cria Histórico.

## 8. Histórico
Somente ações finalizadas.

Para cada registro: música, modalidade, data, status, canais e métricas rastreáveis. Quando disponível: cliques, únicos, origem, país, dispositivo, horário e evolução.

IA comenta efetividade, pontos fortes, fracos e próxima ação.

Estados de campanha: ativa, concluída, interrompida e removida.

Separar:
- Remover do Histórico = remove o registro do LAMOU;
- Remover publicação externa = tenta excluir/cancelar na plataforma somente quando a API oficial permitir.

## 9. Radar técnico de IA
Exclusivamente técnico. NÃO usar SIQA/chart externo, plays, visualizações, likes, votos ou popularidade.

A IA identifica automaticamente o estilo das músicas e avalia:
- produção/master;
- qualidade sonora/equilíbrio;
- dinâmica;
- arranjo;
- composição/estrutura;
- hook;
- identidade;
- originalidade;
- adequação ao gênero;
- vocal quando aplicável;
- competitividade técnica.

Pesos variam por gênero.

Mostrar:
- ranking técnico geral do catálogo;
- ranking técnico dentro de cada gênero;
- estimativa técnica Brasil;
- estimativa técnica global;
- notas por dimensão;
- comentário da IA e recomendações.

Brasil/global são estimativas técnicas comparativas do LAMOU, nunca charts oficiais. Devem usar bases de referência reais antes de exibir percentil/posição.

## 10. Itens adicionais aprovados
### Rascunho automático invisível
Salvar progresso de Nova música sem inserir no Histórico/Dashboard. Ao retornar: Continuar rascunho ou Descartar.

### Validade das conexões
Mostrar Conectado, Renovar autorização ou Erro antes da etapa final.

### Log de publicação
Registrar resultado por plataforma. Se algumas falharem, oferecer Tentar novamente somente nas falhas.

### Versões do Radar
Guardar análises técnicas por versão/master e permitir comparação anterior x atual.

### Explicabilidade
Toda recomendação de IA deve ter Por quê? com critérios usados.

### Controle de custo da IA
Priorizar camada gratuita. Exibir consumo/estado. Ao atingir limite gratuito, avisar quando houver previsão de reset. Se o usuário autorizar, usar IA disponível no aparelho como fallback; depois heurística local. Nunca iniciar cobrança silenciosamente.

### Regra de confiança
O LAMOU nunca apresenta como fato um dado que não conseguiu verificar. Indisponível permanece indisponível; estimativas são identificadas como estimativas.

## 11. Arquitetura-alvo
- Front-end PWA limpo e progressivo.
- Backend Cloudflare Worker/Functions.
- D1 para usuários, perfis, conexões, músicas, campanhas, histórico, tracking e avaliações.
- Workers AI para geração/análise quando apropriado.
- Vectorize para vetores/referências técnicas; Vectorize não substitui extração de features/embeddings.
- AI Gateway para observabilidade/controle.
- R2/Queues apenas quando necessário.
- Tokens OAuth e segredos somente no backend.
- Toda integração externa usa APIs e permissões oficiais.

## 12. Estados de negócio
Rascunhos e ações devem usar estados claros como draft, ready, publishing, published, failed e removed. Histórico e métricas só recebem itens finalizados conforme a regra de cada modalidade.
