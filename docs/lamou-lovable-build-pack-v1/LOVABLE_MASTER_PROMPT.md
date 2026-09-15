# PROMPT MESTRE - LOVABLE / LAMOU BUILD PACK V1

Voce esta construindo o ecossistema LAMOU a partir de um pacote normativo versionado.

## MISSAO

Implementar uma aplicacao full-stack modular, responsiva e testavel para o LAMOU sem recriar arquitetura ja definida e sem gerar dependencia proprietaria do Lovable.

## LEITURA OBRIGATORIA

Leia, nesta ordem, todo o Build Pack. Arquivos de contrato e manifestos tem precedencia sobre inferencias do modelo.

## GOVERNANCA

- SALVAR != PROMOVER.
- Nunca sobrescreva FROZEN.
- Nunca marque integracao como conectada sem teste real.
- Nunca marque teste como PASS sem evidencia do mesmo commit/build/ambiente.
- Nunca exponha segredo no frontend.
- Nao invente nova nomenclatura quando existe ID/nome canonico.
- SPEC != IMPLEMENTADO; SIMULADO != REAL.

## ARQUITETURA

GitHub e a fonte de verdade do codigo e contratos. Lovable e ferramenta de construcao. O projeto deve ser executavel e mantido por Git/IDE/CI sem Lovable.

Backend e providers devem ser acessados por contracts/adapters substituiveis. Toda dependencia externa precisa de timeout, retry quando seguro, fallback, observabilidade, auth/scope, teste e estado.

## VISUAL

Use os Visual Locks do Build Pack. Nao use as imagens como screenshot de fundo. Reconstrua em componentes reais, responsivos e acessiveis.

Mantenha os tres perfis: A Operacional, B Visual, C Hibrido. Compartilhe Design System, tokens, icones, shells e estados.

## PRIMEIRO ESCOPO

1. Instalacao Owner.
2. Instalacao Cliente.
3. LAMOU IA Owner + Mapa Vivo.
4. CORE Owner + Mapa Vivo tecnico + SOL/LUA.
5. Shell e contratos compartilhados.
6. Primeira onda: Orbit, Version, Showroom, Diagnostico 360, Digital Improvement, Meeting Architect, Teste3, Lab, Validation Gate, Research Scout, Opportunity Intelligence e Benchmarker.

## CALLS

Toda chamada deve ter CALL-ID e registro no Call Registry. Implementar testes de sucesso, auth, autorizacao, tenant, timeout, schema, indisponibilidade, fallback, recuperacao e auditoria.

## IA / VAs / SKILLS

Nenhum agente pode chamar ferramenta nao declarada. Cada agente/VA deve ter ID, finalidade, skills, tools/calls permitidas, dados permitidos, limites de autonomia, aprovacao humana quando necessaria, evals, custo/latencia e fallback.

## DEFINITION OF DONE

Uma pagina nao esta pronta porque renderizou. Deve ter rota, estado loading/empty/error/offline, permissao, responsivo, teclado, acessibilidade, observabilidade e teste.

Um aplicativo nao esta pronto sem Documento Mestre, contratos, testes, seguranca, evidencia, versionamento, backup/restore e pagina Arquitetura & Saude.

Ao encontrar fonte ausente ou conflitante, pare aquela afirmacao e marque `NOT_VERIFIED` ou `BLOCKED`; nao invente.

## LOCK-IN PROIBIDO

Nao criar dependencia obrigatoria de hosting, banco, storage ou IA proprietarios do Lovable quando houver alternativa padrao. Codigo e contratos devem permanecer no GitHub; segredos fora do repo; dados e assets exportaveis; deploy reproduzivel fora do editor.
