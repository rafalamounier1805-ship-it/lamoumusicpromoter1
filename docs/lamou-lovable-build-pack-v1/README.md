# LAMOU Lovable Build Pack V1

**Estado:** CANDIDATE_NOT_PROMOTED  
**Data:** 2026-09-15  
**Regra:** SALVAR != PROMOVER

Este diretorio e o handoff canonico para construir Instalacao, LAMOU IA, CORE e a primeira onda de aplicativos no Lovable **sem tornar o Lovable a fonte de verdade do produto**.

## Regra simples

- GitHub = codigo, contratos, historico, branches e releases.
- Lovable = ferramenta de construcao/refatoracao, substituivel.
- Supabase = backend/Auth/RLS/Storage quando autorizado, acessado por contratos/adapters.
- Vercel = runtime/deploy de referencia, substituivel.
- LAMOU Version/MuDoc + Registry = documentos vivos, identidade, CURRENT/PINNED e evidencias.
- Teste3 + Validation Gate + Lab = testes, evidencias e gates.

Se Lovable for removido, o sistema deve continuar compilando, testando, mantendo e publicando pelo GitHub/CI.

## Leia nesta ordem

1. `ARCHITECTURE_AND_FLOWS.md`
2. `APPLICATION_CONTRACT_STANDARD.md`
3. `CALL_CONTRACT_STANDARD.json`
4. `VA_CONTRACT_STANDARD.json`
5. `ASSET_REGISTRY.json`
6. `VISUAL_LOCK_IMPORT.md`
7. `LOVABLE_MASTER_PROMPT.md`

## Visual Locks

Os arquivos full-resolution acompanham o **LAMOU Build Pack V1** entregue ao Owner e cada um esta identificado em `ASSET_REGISTRY.json` com ID, papel e SHA256. Eles nao ficam presos ao Lovable.

No import inicial, os assets devem ser copiados para o repositorio do produto (`public/assets/visual-locks/`) ou para storage proprio governado pela LAMOU, mantendo o mesmo `asset_id`, hash, proveniencia e binding. Imagem e referencia de estrutura/direcao; a implementacao deve usar componentes reais, responsivos e acessiveis, nunca um screenshot clicavel.

Os binarios full-resolution ainda nao foram commitados neste branch de documentacao; o pacote mestre e o registro de hashes sao a fonte do handoff visual nesta candidata. Nao declarar um binding de asset como concluido antes do import + verificacao de hash.

## Verdade operacional

Nenhuma integracao pode ser marcada `CONNECTED`, nenhum teste pode ser marcado `PASS` e nenhuma versao pode ser marcada `PRODUCTION_READY` sem evidencia do mesmo commit/build/ambiente.

Estados permitidos quando aplicavel: `IMPLEMENTED_VERIFIED`, `IMPLEMENTED_NOT_VERIFIED`, `PARTIAL`, `SIMULATED`, `DOCUMENTED_ONLY`, `NOT_CONNECTED`, `BLOCKED`, `NOT_APPLICABLE`.
