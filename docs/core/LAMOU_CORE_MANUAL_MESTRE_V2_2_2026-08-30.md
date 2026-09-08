# LAMOU IA CORE — MANUAL MESTRE DE MÓDULOS, CÓDIGOS E ARQUITETURA

**Documento:** Manual Mestre derivado do CORE  
**Versão documental:** V2.2 — 30/08/2026  
**Baseline preservada:** CORE Studio 2.1 / MUIA Central v10.1 não sobrescritos  
**Status:** ARQUITETURA DERIVADA / ESPECIFICAÇÃO / NÃO DECLARAR COMO PRODUÇÃO SEM EVIDÊNCIA

## 1. Objetivo
Este manual consolida a arquitetura transversal do LAMOU IA CORE, seus módulos, códigos funcionais, regras de segurança, armazenamento, continuidade, acessibilidade, localização, inteligência de decisão e governança. Ele também define como o CORE Studio deve apresentar cada código de forma clicável e explicável.

## 2. Regra de verdade
- **Proposto**: ideia/contrato arquitetural.
- **Catalogado**: consta do mapa do CORE.
- **Implementado**: existe fonte executável identificada.
- **Testado**: possui teste executado e evidência.
- **Homologado**: aprovado para uso controlado.
- **Produção**: release/deploy/health comprovados.

Nenhuma tela, prompt ou documento pode promover um item automaticamente. O `CORE-TRUTH` deve bloquear divergência entre catálogo, código, testes e release.

## 3. Arquitetura macro
```text
APLICATIVOS LAMOU
      ↓
CORE CONTRACTS / SDK
      ↓
IDENTIDADE + POLICY + SEGURANÇA
      ↓
TASK CLASSIFIER → RESOLVER → PLAN X/Y/Z/SAFE
      ↓
DADOS / IA / STORAGE / COMUNICAÇÃO / LOCALIZAÇÃO / A11Y
      ↓
OBSERVABILIDADE + EVIDÊNCIA
      ↓
VERIFICAÇÃO + REVERSE PATH + LEARNING
```

## 4. Regra visual do CORE Studio
Cada código deve ser clicável. A ficha abre, no mínimo, estas abas:
1. **Quando atua** — gatilho, momento e objetivo.
2. **Entrada & Saída** — dados recebidos e resultado produzido.
3. **Dados & Segurança** — classificação, retenção, criptografia, auditoria e proibições.
4. **Planos & Dependências** — dependências e Plan X/Y/Z/Safe quando aplicável.
5. **Código / Contrato** — source path real quando existir; caso contrário, contrato proposto explicitamente rotulado.

Itens muito bons/diferenciados recebem `✦`; candidatos a pesquisa de anterioridade/IP recebem selo específico. O selo não prova patenteabilidade.

## 5. Catálogo de códigos
O catálogo navegável completo fica em `suite/core-studio/core-code-registry.js`. Nesta derivada estão registrados os blocos: identidade/acesso, decisão/governança, IA/orquestração, resiliência, segurança distribuída, dados/armazenamento, comunicação/localização, acessibilidade e Truth Guard.

Destaques: `CORE-ID`, `CORE-RBAC`, `CORE-DEC`, `CORE-APR`, `CORE-VER`, `CORE-AUD`, `CORE-KNW`, `CORE-EXT`, `CORE-GIT`, `CORE-DOC`, `CORE-AI`, `CORE-TASK`, `CORE-EVAL`, `CORE-RES`, `CORE-LUP`, `CORE-XY`, `CORE-DTRUST`, `CORE-RPATH`, `CORE-FIN`, `CORE-SEC-ORCH`, `CORE-CRYPT`, `CORE-KMS`, `CORE-THRESH`, `CORE-SID`, `CORE-ROT`, `CORE-PURPOSE`, `CORE-EPH`, `CORE-MROUTE`, `CORE-EID`, `CORE-ROUTEVAULT`, `CORE-FORENSIC`, `CORE-STOR`, `CORE-DLOC`, `CORE-SAVE`, `CORE-BUF`, `CORE-PROJ`, `CORE-COMMIT`, `CORE-INDEX`, `CORE-DELTA`, `CORE-ALLOC`, `CORE-BDR`, `CORE-LOC`, `CORE-SIG`, `CORE-ACK`, `CORE-ESC`, `CORE-A11Y`, `CORE-AT`, `CORE-SENSORY`, `CORE-TRUTH`, `CORE-VTR`, `CORE-BRG`.

## 6. Dados e armazenamento
### 6.1 Princípio
O CORE não movimenta ou regrava o objeto inteiro quando apenas um fragmento mudou. A regra é: **mover o mínimo necessário, preservar a verdade e manter recuperação**.

### 6.2 Fluxo de escrita rápida
```text
ALTERAÇÃO
  ↓
CORE-DELTA — calcula somente a mudança
  ↓
CORE-BUF — buffer transitório durável e criptografado
  ↓                ↘
ACK: RECEBIDO        CORE-PROJ → telas autorizadas (PENDENTE)
  ↓
CORE-SEC-ORCH — regras + risco + IA governada
  ↓
CORE-ALLOC — identifica tabela/aba/range/chunk/objeto
  ↓
CORE-STOR — escolhe storage apropriado
  ↓
CORE-COMMIT — commit idempotente e versionado
  ↓
CORE-VER — valida integridade/resultado
  ↓
CORE-BDR — backup/recovery conforme política
  ↓
PURGE do payload transitório
```

### 6.3 “Banco fantasma” (`CORE-BUF`)
O buffer é **transitório** e **não é source of truth**. Ele serve para receber rapidamente a alteração, emitir ACK durável, alimentar projeções autorizadas e desacoplar a experiência do usuário do processamento final.

Regras:
- ACK “recebido” só após persistência durável mínima;
- payload criptografado;
- TTL e purge após commit/verificação;
- idempotency key;
- version/checksum;
- retry;
- conflito não sobrescreve silenciosamente;
- operações críticas só mostram “concluído” depois do commit definitivo.

### 6.4 Arquivos e planilhas grandes
`CORE-INDEX` cria índice de estrutura (abas, ranges, chunks, versões). `CORE-DELTA` calcula apenas a alteração. `CORE-ALLOC` encaixa a mudança na posição correta.

```text
ABRIR XLSX GRANDE
   ↓
CORE-INDEX → metadados + nomes das abas
   ↓
usuário abre uma aba
   ↓
carrega apenas range/chunk necessário
   ↓
usuário altera uma célula/registro
   ↓
CORE-DELTA → patch
   ↓
CORE-ALLOC → destino exato
   ↓
CORE-COMMIT
```

Para uso operacional frequente, o arquivo deve ser importado para modelo estruturado; XLSX fica como fonte de importação/exportação e snapshot, não como banco operacional principal.

### 6.5 Estados visuais
- `Recebido` — buffer durável confirmou.
- `Pendente` — outras telas podem enxergar projeção ainda não consolidada.
- `Sincronizando` — worker/commit em curso.
- `Salvo` — fonte oficial confirmou.
- `Verificado` — integridade/eficácia confirmadas.
- `Conflito` — requer reconciliação.
- `Falha` — reverse path/retry/ação humana conforme política.

## 7. Segurança adaptativa e distribuída
### 7.1 Autoridade
A segurança resulta de **hard rules determinísticas + análise contextual de IA + proteção proporcional ao risco**. IA pode recomendar/elevar proteção; não reduz controles críticos obrigatórios.

Hierarquia: Lei/regulação → política CORE/tenant → hard rules → análise de risco → recomendação IA → aprovação humana quando exigida → execução → evidência.

### 7.2 Segredos críticos
Senha de usuário: hash forte; não é recuperável. Segredos de sistema: `CORE-SID` + `CORE-KMS` + `CORE-PURPOSE` + `CORE-ROT`; para criticidade elevada: `CORE-THRESH`, `CORE-DTRUST`, `CORE-MROUTE`, `CORE-EID`.

```text
SECRET_ID ESTÁVEL
     ↓
material/alias/localização rotativos
     ↓
Purpose Gate
     ↓
Threshold / KMS / HSM
     ↓
Operação
     ↓
Acesso efêmero expira
     ↓
Auditoria forense mínima
```

A rota pode mudar, mas a segurança **não depende de esconder a rota**. Mesmo com topologia conhecida, uma parte isolada não deve ser suficiente para revelar o segredo.

### 7.3 Plan X / Y / Z / Safe
- **X** — caminho preferido.
- **Y** — hot standby.
- **Z** — alternativa segura/degradada.
- **S** — Safe Mode.

`CORE-DTRUST` mede independência real; redundância com mesma conta/região/credencial/provider pode ser falsa. `CORE-RPATH` define a ré antes da mudança crítica.

## 8. Localização, comunicação e acessibilidade
`CORE-LOC` modela ponto geográfico, organizacional, planta interna e ponto lógico. `CORE-SIG` roteia chat/push/som/visual/vibração/painel. `CORE-ACK` comprova entrega/leitura/aceite; `CORE-ESC` escala.

Acessibilidade não é um botão: `CORE-A11Y`, `CORE-AT` e `CORE-SENSORY` adaptam interação e alerta conforme dispositivo/perfil. Alertas críticos não podem depender apenas de som.

## 9. Diferenciais e inovação
Classificação visual:
- **BASE CONHECIDA** — padrão/técnica já consolidada.
- **✦ DIFERENCIAL LAMOU** — combinação/uso arquitetural diferenciado.
- **✦ CANDIDATO A PESQUISA/IP** — merece busca formal de anterioridade antes de qualquer alegação de novidade jurídica.

Destaques atuais: Security Orchestration integrada, Plan X/Y/Z/Safe por capability, Independence Score, identidade lógica de segredos com material/alias/rota rotativos, reverse path obrigatório, buffer transitório + delta + alocação incremental integrados ao Storage Resolver e Truth Guard.

## 10. Prompt-Mestre atualizado e aplicado
O prompt de implementação deve obrigar o executor a:
- preservar baseline;
- trabalhar em versão derivada;
- não chamar proposta de implementada;
- abrir ficha por código;
- manter source path/evidência;
- implementar dados por delta/chunk sempre que possível;
- usar `CORE-BUF` apenas como buffer, nunca source of truth;
- usar `CORE-SEC-ORCH` antes de dados/segredos críticos;
- declarar X/Y/Z/Safe e reverse path para capabilities críticas;
- bloquear hard rules contra redução por IA;
- registrar inovação/diferencial sem alegar patenteabilidade;
- atualizar changelog e Truth Guard.

## 11. Próxima implementação recomendada
P0: `CORE-TRUTH`, `CORE-VTR`, contratos e lifecycle.  
P1: `CORE-SAVE`, `CORE-BUF`, `CORE-DELTA`, `CORE-ALLOC`, `CORE-COMMIT`, `CORE-STOR`.  
P1 segurança: `CORE-SEC-ORCH`, `CORE-KMS`, `CORE-SID`, `CORE-PURPOSE`, `CORE-ROT`.  
P2: `CORE-XY`, `CORE-DTRUST`, `CORE-RPATH`, `CORE-BDR`.  
P2 UX: fichas clicáveis, mapa de arquitetura e selo ✦.

## 12. Regra final
**O CORE deve saber: o que está sendo feito, por quem, com quais dados, onde cada fragmento pertence, qual proteção é obrigatória, qual caminho executa, qual caminho assume se falhar, como voltar e qual evidência prova que deu certo.**
