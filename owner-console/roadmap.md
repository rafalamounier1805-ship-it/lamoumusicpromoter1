# Roadmap

- [x] Corrigir `/install/owner`: remover Visual Lock da UI, eliminar progresso redundante e validar sete etapas em desktop/tablet/mobile.
- [x] Fazer varredura funcional + UX de `/install/owner`: itens acionáveis, Identidade, Segurança, CTAs reais e validação responsiva.
- [x] Incluir prévia governada do impacto de substituir provider/plugin/modelo na instalação Owner.
- [x] Estender a prévia de impacto de substituição para Configurações (Central) e CORE (IA/providers).
- [x] Transformar Configurações em superfície real com menu completo, CRUD e status acionável (sem overflow em 360px).
- [x] Implementar Comercial & Contratos com CRUD de clientes, contratos, cobranças e pendências + link para ficha do cliente.
- [x] Conectar Auth real em /install/owner: cadastro, login, recuperação, MFA TOTP e perfil persistido (tabela profiles com RLS).
- [x] Perfil do proprietário verificado com sessão real: gravação e leitura confirmadas na tabela profiles (IMPLEMENTED_VERIFIED).
- [ ] MFA TOTP: registro recusado pela autenticação enquanto o e-mail da conta não é confirmado; UI já explica motivo e próximo passo — IMPLEMENTED_NOT_VERIFIED (bloqueio externo: confirmação de e-mail).
- [x] CORE com menu canônico de 9 itens; Segurança, Dados, CALLs, IA, Treinamentos e SOL/LUA passam a ser detalhe interno (rotas preservadas) e nova tela Configurações do CORE.
- [ ] Ligar faturamento (planos + cobrança), armazenamento de imagem e providers reais ao CORE com status acionável.
- [ ] Conectar superfícies técnicas de /core/settings: ambientes, providers, APIs, segurança e custos com status real e CTA funcional.
- [ ] Criar superfície real do SOL em /core/settings e ligar ambientes/providers/APIs ao LABTEST para a comparação Atual → Novo usar dados reais.
- [ ] (SUSPENSO por pedido posterior: não publicar/promover) Publicar a candidata e habilitar contas reais com confirmação de e-mail e autenticador.
- [x] Mapa Vivo compacto com painel lateral direito (abas Resumo, Fonte/Proveniência, Problema/Hipótese, Plano/Ação, Evidências, Histórico) sem abrir novas telas.
- [x] Central/Cognitive finalizada: bloco "Gestão do ecossistema" com falhas, clientes, contratos/valores, produtos, planos, versões e oportunidades; detalhe lateral com fonte/origem, truth-state e destino real.
- [x] Produtos/Portfólio com busca e filtros + abas Aplicativos, CORE/Plataforma, Plugins/Providers e Qualidade & SAC (indicadores sem fonte permanecem NOT_CONNECTED/NOT_VERIFIED).
- [x] Cliente 360 — ficha com 8 abas + cobranças reais em base real (RLS por proprietário).
- [ ] Sequência seguinte: reconciliação CORE 9 itens; LABTEST; Instalação Cliente e pós-instalação; varredura final.



- [ ] Ajuste visual: mais dark/neon executivo, menos branco/azul claro, vermelho só para crítico real.
