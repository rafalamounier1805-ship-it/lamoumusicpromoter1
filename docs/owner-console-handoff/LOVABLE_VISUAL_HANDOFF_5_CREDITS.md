# LAMOU Owner Console — LOVABLE VISUAL HANDOFF — 5 CREDITS

**Estado:** CANDIDATE_NOT_PROMOTED  
**Fonte técnica obrigatória:** `candidate/lamou-owner-console-codex-2026-09-15`  
**Commit base verificado:** `920a3a372430741010b4f160a1c441d168fb758e`  
**Projeto Lovable:** `bee5a2f8-878d-4954-a168-029ef7399b36`  
**Snapshot Lovable histórico:** `532025926ff73e837c5f38be08fd76665ff457e5`  
**Regra:** o snapshot histórico não é a candidata final. Não reimportar por cima do código mais novo. SALVAR != PROMOVER.

## Objetivo da rodada
Aplicar **uma única rodada de acabamento visual**, estritamente limitada aos três itens abaixo. Não alterar rotas, dados, auth, integrações, truth-states, arquitetura, contratos, navegação canônica ou as nove raízes do CORE. Não criar assets novos e não usar screenshots como interface.

## Ajuste 1 — Mapa Vivo / legibilidade + hierarquia do painel contextual
- **Rota:** `/owner/mapa-vivo`
- **Arquivos/componentes principais:** `owner-console/src/routes/owner.mapa-vivo.tsx` + estilos compartilhados já existentes.
- **Problema observado:** mapa, contexto lateral e ações competem visualmente; em larguras menores o painel lateral pode comprimir conteúdo e aumentar risco de overflow.
- **Referência:** Visual Lock `Mapa Vivo do Ecossistema LAMOU IA.png`; preservar cidade/ecossistema, caso vivo, contexto lateral e cadeia de proveniência.
- **Mudança mínima:** ajustar grid/flex responsivo, largura mínima/máxima do painel contextual, hierarquia de títulos/tags, espaçamento e estados hover/focus. Manter todos os elementos interativos reais.
- **Aceite:** sem overflow horizontal em 360, 768 e 1440 px; caso/contexto continuam visíveis; foco de teclado perceptível; nenhuma função ou informação escondida para caber.

## Ajuste 2 — Shell compartilhado / consistência entre Central, CORE, LABTEST e Instalação
- **Rotas:** superfícies Owner, `/core/*`, `/labtest/*`, `/install/owner`, `/install/client`.
- **Arquivos/componentes principais:** `owner-console/src/lamou-shell-polish.css`, `owner-console/src/routes/__root.tsx` e componentes compartilhados existentes.
- **Problema observado:** pequenas variações de padding, densidade de cards, tags, botões e quebra de conteúdo prejudicam a sensação de uma única família visual, principalmente no tablet/mobile.
- **Referência:** padrão aprovado dark navy/charcoal com cyan/violet controlado; light executivo somente onde já definido.
- **Mudança mínima:** consolidar tokens/spacing/radius/focus/overflow em CSS compartilhado antes de tocar componentes isolados. Vermelho somente para erro ou bloqueio real. Respeitar `prefers-reduced-motion`.
- **Aceite:** tipografia, botões, tags e cards coerentes nas superfícies citadas; nenhum menu/raiz removido; navegação e truth-states inalterados; 360/768/1440 sem clipping relevante.

## Ajuste 3 — Tabelas, filtros e painéis densos / leitura responsiva sem perda funcional
- **Rotas prioritárias:** `/owner/clients`, `/owner/products`/`/owner/apps`, `/core/apps`, `/core/health` e documentos/painéis densos equivalentes.
- **Arquivos/componentes principais:** rotas existentes e componentes de tabela/filtro já utilizados.
- **Problema observado:** densidade elevada e controles em linha podem gerar compressão, quebra ruim ou leitura difícil em 360/768.
- **Referência:** cockpit aprovado e padrão executivo/tecnológico atual; não redesenhar.
- **Mudança mínima:** permitir wrapping controlado, `min-width: 0`, scroll interno apenas onde semanticamente necessário, header/filtros que se reorganizam e alvo de toque/foco adequado. Não remover colunas, filtros ou ações.
- **Aceite:** filtros continuam funcionais e acessíveis; nenhum controle desaparece; tabelas/painéis continuam legíveis; teclado/foco preservados; sem regressão em 1440.

## Restrições de custo e execução
- Uma única mensagem de build no Lovable.
- `max_mode=false`.
- Sem rodada exploratória, sem redesign geral e sem geração de novos assets.
- Se a API não expuser estimativa confiável de créditos, registrar essa limitação antes do build; não prometer custo exato.

## Validação mínima após a rodada
Verificar as rotas alteradas em 360x800, 768x1024 e 1440x900; foco/teclado; console; TypeScript; lint/build conforme disponível. Declarar explicitamente qualquer teste não executado.

## Retorno para Codex
Entregar commit/identificador da versão Lovable, lista de arquivos modificados, antes/depois objetivo e testes realizados. Não publicar. Não promover. As mudanças devem voltar para reconciliação na linha `candidate/lamou-owner-console-codex-2026-09-15`.
