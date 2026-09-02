# COMPOSER OS — Histórico e Quarentena de Versões

Este diretório define a política de histórico. Ele não é fonte de runtime.

## Regra

Após a primeira versão aprovada pelo RUN CONTRACT, qualquer branch/build anterior deve ser classificado explicitamente como:

- `OBSOLETE_NON_EXECUTABLE` — histórico preservado, não pode ser publicado/selecionado como versão ativa;
- `ARCHIVED_ROLLBACK` — histórico preservado e autorizado apenas para rollback controlado;
- `REJECTED` — não usar como referência funcional/visual oficial.

Somente `ACTIVE_VERIFIED`, registrado em `../ACTIVE_VERSION.json` e em `public.app_versions`, pode ser tratado como versão rodável oficial.

## Proibições

- deploy antigo não prova versão ativa;
- branch existente não prova versão suportada;
- URL antiga não prova produção;
- `localStorage`, seed, mock, DEMO e dados sintéticos não provam backend real;
- workflow não pode selecionar automaticamente uma branch histórica;
- arquivos históricos não podem ser importados silenciosamente por build ativo.

## Snapshots iniciais

- `history/composer-os-v2-ux-baseline` — baseline de UX preservada, não executável como produção;
- `archive/legacy-pre-composer-os` — snapshot legado do `main` anterior ao primeiro RUN real.

O próximo passo depois do primeiro RUN aprovado é registrar commit/build/evidência no `ACTIVE_VERSION.json` e marcar explicitamente as demais linhas como obsoletas, rollback ou rejeitadas.
