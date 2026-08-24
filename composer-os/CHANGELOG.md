# COMPOSER OS — Changelog

## v2.1 — Workflow-first

### Produto
- Início redesenhado como **Hoje**, orientado a trabalho e próxima ação.
- Remoção do protagonismo de scores/rankings.
- Fluxo do catálogo em estados operacionais: Em produção → Organizando direitos → Pode apresentar → No mercado → Em negociação.
- Cada música passa a ter **gates comerciais**: Publisher/Intérprete, Sync e Label/Master, com motivo explícito quando bloqueada.
- Dossiê por música com Decisões, Produção, Direitos, Registro, IA/Proveniência, Documentos, Pitching e Receitas.
- Plano de 30 dias com dependências e desbloqueio progressivo.
- CRM musical com pipeline completo até negociação, ganho e perdido.
- Divulgação/Lançamentos e Receitas/Royalties com registros operacionais reais no workspace local.

### Composer Intelligence
- Sai o conceito de copiloto/ranking separado.
- Entra um drawer contextual dentro do fluxo de trabalho.
- Ações: detectar blockers, sugerir próxima ação, preparar pitch, revisar direitos, montar checklist de sync e transformar blockers em tarefas.
- Fallback local baseado em regras quando IA cloud não estiver disponível.
- Endpoint server-side `/api/intelligence` preparado para OpenAI Responses API via `OPENAI_API_KEY`.
- Guardrail: não inventar contatos, métricas, interesse de mercado, situação jurídica ou receita.

### Deploy
- Produção v2.1: https://composer-os-v21.vercel.app

### Ainda pendente para produção real
- Backend cloud e autenticação.
- Storage privado de documentos/áudio.
- Spotify Web API real.
- Configuração da `OPENAI_API_KEY` no ambiente Vercel.
- Conexão CI/CD GitHub → Vercel para deploy automático de commits.
