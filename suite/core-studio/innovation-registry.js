window.CORE_INNOVATIONS = [
  {
    "id": "CORE-SEC-ORCH",
    "name": "Security Decision & Enforcement Engine",
    "short": "Segurança adaptativa governada",
    "level": "DIFERENCIAL LAMOU",
    "icon": "✦",
    "area": "Segurança",
    "what": "Orquestra o nível de proteção de cada operação combinando políticas determinísticas, análise contextual por IA, aprovações e evidências.",
    "does": ["Classifica risco e criticidade","Aplica controles mínimos obrigatórios","Permite que IA eleve proteção, sem reduzir regra crítica","Seleciona tecnologia/provedor de segurança autorizado","Exige aprovação humana quando a política determinar","Registra por que a decisão foi tomada"],
    "existed": "Já existem Zero Trust, policy engines, acesso condicional baseado em risco, SOAR/XDR e ferramentas de análise assistida por IA.",
    "lamou": "O diferencial proposto é colocar política, IA, resolver de tecnologia, continuidade X/Y/Z/S, reverse path e evidência em uma única cadeia decisória reutilizável por todos os apps.",
    "flow": ["Ação/Dado","Classificação","Policy Gate","Análise IA","Plano de Segurança","Execução","Evidência"],
    "ux": ["Card de risco com justificativa","Controles obrigatórios x adicionais","Provider selecionado e fallback","Botão 'Por que esta decisão?'","Linha do tempo de evidências"],
    "status": "PROPOSTO / ARQUITETURA",
    "evidence": "Ainda não é runtime de produção. Precisa de implementação, testes e security review."
  },
  {
    "id": "CORE-XY","name": "Dual/Multi Execution & Continuity","short": "Plan X / Y / Z / Safe","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Resiliência",
    "what": "Padroniza múltiplos caminhos de execução para a mesma capability sem obrigar o app a conhecer o provider.",
    "does": ["Plan X preferido","Plan Y hot standby","Plan Z alternativa segura/degradada","Plan S Safe Mode","Circuit breaker e fallback","Teste de failover e evidência"],
    "existed": "Alta disponibilidade, active/passive, multi-region, circuit breaker, fallback e multi-cloud já são práticas conhecidas.",
    "lamou": "A proposta transforma isso em contrato transversal do CORE e exige que cada capability crítica declare seus caminhos e a independência real entre eles.",
    "flow": ["Contrato CORE","Plan X","Health Gate","Plan Y","Plan Z","Safe Mode","Recovery"],
    "ux": ["Indicador de plano ativo","Saúde X/Y/Z","Último teste de troca","Dependências compartilhadas","Ação de simular failover em ambiente de teste"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Conceito consolidado; falta engine executável de failover no runtime."
  },
  {
    "id": "CORE-DTRUST","name": "Distributed Trust & Independence Engine","short": "Independence Score","level": "CANDIDATO A PESQUISA/IP","icon": "◈","area": "Segurança / Resiliência",
    "what": "Mede se caminhos supostamente redundantes são realmente independentes ou compartilham o mesmo ponto de falha.",
    "does": ["Analisa provider e região","Analisa conta/credencial","Analisa identidade/KMS","Analisa rede/pipeline/administração","Calcula risco de falha correlacionada","Bloqueia falsa redundância"],
    "existed": "Arquiteturas de failure domains, fault isolation, multi-cloud e análise de dependências já tratam falhas correlacionadas.",
    "lamou": "O diferencial é formalizar isso como um score transversal usado automaticamente pelo Resolver antes de aceitar um Plan Y/Z como contingência real.",
    "flow": ["Planos candidatos","Mapa de dependências","Correlação","Independence Score","Gate","Aprova/Recusa fallback"],
    "ux": ["Radar de dependências comuns","Score por dimensão","Explicação do ponto único de falha","Recomendação de separação"],
    "status": "PROPOSTO / PESQUISA","evidence": "Requer definição matemática, benchmark e validação contra cenários reais."
  },
  {
    "id": "CORE-THRESH","name": "Threshold Trust Engine","short": "Confiança distribuída A/B/C","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Criptografia",
    "what": "Distribui confiança entre múltiplas partes para que um único comprometimento não seja suficiente para usar um segredo crítico.",
    "does": ["Políticas 2-de-3, 3-de-5 etc.","Integra KMS/HSM/Vault","Evita reconstrução completa quando tecnologia permitir","Registra participação sem registrar segredo","Integra com rotação e purpose binding"],
    "existed": "Secret sharing, threshold cryptography e multi-party computation são tecnologias estabelecidas e em evolução.",
    "lamou": "A proposta é o CORE decidir quando usar threshold conforme criticidade e integrar isso com identidade lógica do segredo, Plan X/Y e rota móvel.",
    "flow": ["Secret ID","Policy","Shares A/B/C","Threshold Gate","Operação Criptográfica","Resultado"],
    "ux": ["Mapa A/B/C sem revelar segredo","Quórum exigido","Domínios independentes","Estado dos shares","Teste controlado de recuperação"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Usar primitivas e bibliotecas auditadas; não implementar criptografia própria."
  },
  {
    "id": "CORE-SID","name": "Secret Identity & Rotation","short": "Identidade fixa, material mutável","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Segredos",
    "what": "Mantém um secret_id lógico estável enquanto alias, versão, provider, shares, rota e material criptográfico podem mudar.",
    "does": ["Secret ID imutável","Aliases substituíveis","Rotação versionada","Abstração de provider","Revogação e janela de transição","Aplicativo não precisa conhecer localização"],
    "existed": "KMSs já usam IDs, aliases, versões e rotação de chaves.",
    "lamou": "O desenho estende a abstração para provider, shares, purpose, rota e contingência, mantendo o contrato lógico do app estável.",
    "flow": ["SEC-ID","Alias atual","Versão ativa","Provider/Share atual","Operação","Rotação"],
    "ux": ["Ficha do segredo sem exibir valor","Versão atual/anterior","Alias atual","Purpose","Rotação e saúde"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Nunca armazenar segredo real na UI, frontend ou repositório."
  },
  {
    "id": "CORE-PURPOSE","name": "Purpose-Bound Secret Policy","short": "Segredo só serve ao propósito","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Segredos",
    "what": "Limita segredos críticos por finalidade, aplicativo, ambiente e operação, reduzindo reutilização indevida.",
    "does": ["Purpose obrigatório","Allowlist de app/tenant/ambiente","Operações permitidas","Exportação bloqueada quando aplicável","Step-up por finalidade crítica"],
    "existed": "Least privilege, scoped credentials, IAM policies e key usage constraints já existem.",
    "lamou": "A proposta torna o purpose parte explícita da identidade e do ciclo de vida do segredo, integrado ao Security Orchestrator.",
    "flow": ["Solicitação","Secret ID","Purpose Gate","Context Gate","Operação permitida","Evidência"],
    "ux": ["Purpose visível","Operações autorizadas","Ambientes permitidos","Motivo de bloqueio"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Depende de enforcement backend; UI é apenas explicativa."
  },
  {
    "id": "CORE-MROUTE","name": "Moving Route Security","short": "Rota operacional mutável","level": "CANDIDATO A PESQUISA/IP","icon": "◈","area": "Segurança",
    "what": "Rotaciona identificadores, aliases, endpoints lógicos, shares e credenciais temporárias para reduzir reutilização de informação capturada.",
    "does": ["Alias efêmero","Endpoint lógico mutável","Token de curta duração","Share participante variável","Ordem de resolução variável","Runtime conhece apenas rota atual"],
    "existed": "Moving Target Defense, ephemeral credentials, service discovery e rotating endpoints já têm precedentes.",
    "lamou": "A combinação proposta liga a rota móvel à identidade lógica do segredo, threshold, purpose binding, Plan X/Y/Z e auditoria mínima.",
    "flow": ["Secret ID","EID temporário","Route Vault","Rota atual","Operação","Expira/Invalida","Nova rota"],
    "ux": ["Mostra somente estado atual","Histórico operacional não reutilizável","Indicador de rotação","Evidência forense separada"],
    "status": "PROPOSTO / PESQUISA","evidence": "Não depender de obscuridade; segurança deve resistir mesmo com arquitetura conhecida."
  },
  {
    "id": "CORE-FORENSIC","name": "Minimal Immutable Forensic Audit","short": "Evidência sem expor segredo","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Auditoria",
    "what": "Preserva prova suficiente para investigação sem armazenar senha, chave, share, token ou rota completa reutilizável.",
    "does": ["Eventos imutáveis","Pseudonimização","Integridade e correlação","Separação de audit vault","Redação de dados sensíveis","Retenção governada"],
    "existed": "Immutable logging, SIEM, tamper-evident logs e secret redaction são padrões conhecidos.",
    "lamou": "A proposta separa explicitamente histórico operacional reutilizável de evidência forense mínima, alinhada à rota móvel.",
    "flow": ["Evento","Redação","Pseudônimo","Assinatura/Hash","Audit Vault","Investigação"],
    "ux": ["Timeline sem segredos","Quem/quando/policy/result","Integridade verificada","Acesso restrito à auditoria"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Logs não devem ser eliminados para 'não deixar rastro'; devem ser minimizados e protegidos."
  },
  {
    "id": "CORE-RES-EVAL","name": "Universal Capability Resolver + Evaluation","short": "Melhor tecnologia por atividade","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Orquestração",
    "what": "Classifica a atividade e escolhe a melhor implementação autorizada usando políticas, benchmark, health, custo, segurança e histórico.",
    "does": ["Classifica tarefa","Gera requisitos","Elimina candidatos proibidos","Compara providers","Usa benchmark e telemetria","Define primário + fallback + reverse path"],
    "existed": "Model routers, service meshes, schedulers, load balancers e policy-based routing existem em domínios separados.",
    "lamou": "A proposta é um resolver universal que escolhe IA, storage, segurança, comunicação, fila, observabilidade e outras capabilities com a mesma lógica governada.",
    "flow": ["Task Classifier","Requirements","Policy/Security Gate","Candidates","Benchmark/Health/Cost","Ranking","X/Y/Z"],
    "ux": ["Score explicado","Candidatos eliminados e motivo","Fonte/versão dos dados","Provider ativo/fallback"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Decisões críticas usam gates eliminatórios antes de qualquer score."
  },
  {
    "id": "CORE-LUP","name": "Learning & Update Policy Engine","short": "Aprender sem alterar produção sozinho","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Governança",
    "what": "Define como cada módulo aprende, com que frequência é reavaliado e quando uma atualização pode ser promovida.",
    "does": ["Modos NONE/OBSERVE/ASSISTED/GENERATIVE_GATED","Cadência por criticidade","Update T0-T4","Candidatos de conhecimento","Teste e aprovação","Rollback obrigatório"],
    "existed": "MLOps, change management, dependency management, policy-as-code e release governance já existem.",
    "lamou": "O diferencial é uma política de aprendizado e atualização por capability/código, distinguindo observar, aprender, propor e promover.",
    "flow": ["Observe","Learn","Hypothesis","Compare","Evidence","Test","Approve","Promote"],
    "ux": ["Modo de aprendizado","Última/Próxima revisão","Janela de atualização","Gate de promoção","Rollback"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Segurança crítica e auditoria nunca usam aprendizado generativo autônomo como autoridade."
  },
  {
    "id": "CORE-DATA-SAFE","name": "Storage, Autosave & Recovery","short": "Salvar, localizar e recuperar","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Dados",
    "what": "Une autosave, sincronização, localização do dado, source of truth, backup e caminho de recuperação.",
    "does": ["Autosave local temporário","Sync cloud","Data Location Registry","Storage Resolver","Versionamento/PITR quando aplicável","Restore Test"],
    "existed": "Autosave, offline sync, databases, object storage, backup e DR são tecnologias comuns.",
    "lamou": "O diferencial é tornar localização, estado de sync, integridade, backup e reverse path visíveis e governados pelo mesmo CORE.",
    "flow": ["Edição","Autosave","Fila Sync","Source of Truth","Versionamento","Backup","Restore Test"],
    "ux": ["✓ Salvo / ↻ Sincronizando / Offline","Onde está salvo","Último backup","Integridade","Recuperar versão"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Cloud operacional não é backup."
  },
  {
    "id": "CORE-LOC-SIG","name": "Location, Point Interaction & Signal Router","short": "Um toque aciona o ponto","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Operação / Comunicação",
    "what": "Transforma locais físicos, setores, salas, máquinas e pontos lógicos em entidades acionáveis por um toque.",
    "does": ["Point Registry","Chat contextual","Som/push/vibração/visual","Acknowledgement","Escalonamento","Fallback offline/canal alternativo"],
    "existed": "Paging, dispatch, indoor location, chat operacional e incident management já existem.",
    "lamou": "A proposta une ponto físico/lógico, ação de um toque, chat contextual, sinal personalizado, ACK e acessibilidade multimodal dentro do CORE.",
    "flow": ["Ponto","Toque","Permission Gate","Signal Router","Canal","ACK","Escalation"],
    "ux": ["Planta/cards de pontos","Estado por cor","Ações em um toque","Quem recebeu/confirmou","Linha do tempo de atendimento"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Geolocalização de pessoas exige transparência, finalidade e autorização."
  },
  {
    "id": "CORE-A11Y-ORCH","name": "Accessibility & Assistive Technology Orchestration","short": "Acessibilidade como infraestrutura","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Acessibilidade",
    "what": "Trata acessibilidade como capability transversal e roteia informação pelo canal perceptível ao usuário e dispositivo.",
    "does": ["WCAG foundation","Assistive Technology Registry","Screen reader compatibility","Caption/transcription","Libras adapter","Alternative input","Multimodal alerts","A11Y quality gate"],
    "existed": "WCAG, screen readers, captioning, switch/voice input, VLibras e ferramentas de teste já existem.",
    "lamou": "O diferencial é colocar preferências e tecnologias assistivas no Signal Router, para que a mesma informação chegue por som, texto, vibração, visual ou leitor de tela conforme contexto.",
    "flow": ["Evento","Perfil A11Y","Dispositivo","Contexto","Canal adequado","Entrega","ACK"],
    "ux": ["Perfil de acessibilidade","Prévia multimodal","Teste com tecnologia assistiva","Estado de compatibilidade"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Automação não substitui testes reais com usuários e tecnologias assistivas."
  },
  {
    "id": "CORE-TRUTH","name": "CORE Truth Guard","short": "Catálogo não corre na frente do código","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Governança / Release",
    "what": "Impede que documentação ou catálogo declare uma capability ativa sem evidência executável.",
    "does": ["Lifecycle com estados","Validação de versão","Evidência por estado","CI bloqueia drift","Source paths obrigatórios","Testes e release evidence"],
    "existed": "CI/CD gates, policy-as-code, SBOM, provenance, release attestations e GitOps já existem.",
    "lamou": "A proposta amarra catálogo, runtime, versão, testes, App Passport e evidência em uma regra de verdade única para o CORE.",
    "flow": ["Proposto","Catalogado","Implementado","Testado","Homologado","Produção"],
    "ux": ["Selo de verdade por módulo","Evidência clicável","Divergência de versão destacada","Bloqueio visual de promoção"],
    "status": "PROPOSTO / PRIORIDADE ALTA","evidence": "Esse componente é necessário antes de chamar novas capabilities de 'implementadas'."
  },
  {
    "id": "CORE-RPATH","name": "Reverse Path & Safe Recovery","short": "Toda ida crítica nasce com ré","level": "DIFERENCIAL LAMOU","icon": "✦","area": "Recuperação",
    "what": "Exige um caminho de retorno antes de qualquer mudança crítica ser promovida.",
    "does": ["Rollback de código/config","Fallback de provider","Safe Mode","Compensação de efeitos irreversíveis","Reconciliation","Teste de retorno"],
    "existed": "Rollback, DR, compensating transactions, feature flags e canary deployments já são práticas conhecidas.",
    "lamou": "O diferencial é tornar o reverse path um artefato obrigatório da decisão e do App Passport, não uma ação improvisada após a falha.",
    "flow": ["Forward Plan","Reverse Plan","Gate","Canary","Monitor","Rollback/Safe","Reconcile"],
    "ux": ["Caminho de ida x volta","RTO/RPO","Itens reversíveis x irreversíveis","Botão de simulação em teste"],
    "status": "PROPOSTO / ARQUITETURA","evidence": "Nunca restaurar estado antigo por cima de eventos irreversíveis sem reconciliação."
  }
];