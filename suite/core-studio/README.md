# LAMOU CORE Studio — Registro Oficial da Base

## O que este aplicativo é
O LAMOU CORE Studio é a interface navegável do APP CORE CUSTOM. Ele **não cria aplicativos** e não possui catálogo de produtos finais.

Sua função é manter a biblioteca mestre de capacidades reutilizáveis da LAMOU IA para construção de sites, aplicativos e sistemas.

## Relação com a Central
- **Aba CORE da Central:** mostra a cobertura/aplicação da base transversal na própria Central e nos produtos.
- **LAMOU CORE Studio:** aplicativo separado que documenta e governa a biblioteca completa da base.
- **Projetos/aplicativos:** consomem os módulos do CORE; não são criados dentro do CORE Studio.

## Unidade principal: Módulo
Cada módulo deve possuir:
- nome e identificador;
- categoria;
- classificação CORE / recomendado / opcional;
- descrição objetiva do que faz;
- dependências;
- plugins/engines/provedores usados;
- substituições compatíveis;
- regra de troca automática, semiautomática ou manual;
- estratégia de continuidade se houver falha ou limite de plano gratuito;
- política de versão do plugin;
- versão do módulo;
- histórico de versões baseado em evidência;
- status e compatibilidade.

## Regra plugin != módulo
Um módulo representa uma capacidade. Um plugin é apenas uma implementação possível dessa capacidade.

Exemplo: `AI Core / Gateway` continua sendo o módulo mesmo que o provedor mude entre OpenAI, Gemini, Anthropic, Workers AI ou modelo local.

## Regra de continuidade
O uso de serviço gratuito ou free tier não pode fazer o aplicativo parar silenciosamente.

O CORE deve prever uma das estratégias:
1. fallback automático, quando o contrato técnico for compatível e seguro;
2. fallback/degradação segura, quando a função for não crítica;
3. migração controlada, quando houver dados, autenticação, cobrança, segurança ou outro risco de integridade.

Troca automática é proibida quando puder gerar perda de dados, quebra de login, duplicidade de cobrança, alteração de permissões ou redução de segurança.

## Versões
O manifesto oficial atual é CORE `2.1.0`.

O catálogo não deve inventar versões históricas de módulos ou plugins. Uma versão anterior só entra no histórico quando houver evidência: commit, tag, release, changelog, lockfile, artefato ou registro equivalente.

## Fonte
- Interface: `suite/core-studio/index.html`
- Catálogo de módulos/plugins: `suite/core-studio/modules.js`
- Manifesto: `suite/app-core-manifest.json`
