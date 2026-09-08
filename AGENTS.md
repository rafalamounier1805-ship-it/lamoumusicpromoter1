# LAMOU IA — Instruções para Codex

## Fonte de verdade
- A Central oficial é `suite/`.
- Leia `suite/README.md` antes de alterar qualquer arquivo da Central ou do CORE.
- O CORE transversal/base macro NÃO é o mesmo que o aplicativo LAMOU CORE Studio.
- O LAMOU CORE Studio vive em `suite/core-studio/` e governa/catalogha a base transversal.

## Regra máxima de publicação
- PROJETO, TESTE e PRODUÇÃO são estados diferentes.
- Nunca interpretar a existência de uma URL como aprovação para produção.
- Nunca publicar, promover, apontar domínio de produção ou marcar uma versão como oficial sem instrução explícita do usuário.
- Toda versão nova nasce como RASCUNHO/TESTE.
- A versão pode ser executada em ambiente de teste, receber checks/evidências, ser aprovada e só depois virar candidata.
- O comando visual “PUBLICAR NO AR” só pode executar ação real quando houver integração segura de deploy. Sem integração, deve ficar bloqueado e explicar o motivo. Zero botão cenográfico.
- Dados DEMO/simulados nunca são promovidos para produção.

## Controle de versões por aplicativo
Cada aplicativo deve manter, no mesmo card/dossiê:
- lista de versões;
- canal: TESTE/DEMO ou OFICIAL/PRODUÇÃO;
- estado: rascunho, pronto para teste, em teste, aprovado, candidato, publicado, arquivado;
- URL/artefato executável quando existir;
- versão selecionada para rodar/testar;
- checks e evidências por versão;
- uma única versão oficial publicada por produto;
- histórico preservado sem criar cards duplicados.

## Gate de qualidade obrigatório antes de produção
Registrar pelo menos:
- smoke test;
- E2E/fluxos críticos;
- acessibilidade;
- segurança/privacidade;
- limpeza de dados DEMO;
- documentação/changelog.
Uma versão não pode ser promovida a candidata enquanto os gates obrigatórios não estiverem aprovados.

## Segurança
- Nunca inserir senha, token, chave de API ou segredo no frontend, GitHub ou arquivos versionados.
- Testes internos devem ser privados/protegidos sempre que a plataforma permitir.
- Se um deploy estiver publicamente acessível e não houver decisão explícita de publicação, sinalizar como risco e não tratá-lo como produção aprovada.
- Autenticação local é DEMO, não segurança de produção.

## Fluxo de trabalho esperado do Codex
1. Auditar antes de modificar quando a tarefa afetar arquitetura, publicação ou dados.
2. Trabalhar em branch/PR; não empurrar mudanças arriscadas diretamente para `main`.
3. Executar testes aplicáveis e registrar o que foi realmente validado.
4. Não declarar “funciona” sem evidência executável.
5. Não criar novos domínios/projetos para cada versão.
6. Preservar a regra de um card por aplicativo.
7. Preferir mudanças incrementais e reversíveis.
