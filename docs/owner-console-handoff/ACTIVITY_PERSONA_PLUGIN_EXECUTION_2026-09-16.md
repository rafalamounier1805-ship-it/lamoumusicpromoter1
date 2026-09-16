# LAMOU CORE — Matriz de Atividades, Personas e Plugins

Data: 2026-09-16  
Branch: `candidate/lamou-owner-console-codex-2026-09-15`  
Estado: `CANDIDATE_NOT_PROMOTED`

## Regra de execução

Cada atividade do ecossistema recebe personas profissionais específicas e capacidades de plugin adequadas ao contexto. A seleção é determinística e auditável. O lote local executa os contratos de cobertura, perguntas obrigatórias, evidências exigidas, critérios de pronto, personas e plugins. Isso **não** equivale a dizer que um provider externo de IA executou especialistas quando o provider está `NOT_CONNECTED`.

O resultado `PASS` abaixo significa somente: **contrato local de distribuição e validação executado sem inconsistências**. Resultado de negócio, diagnóstico real e conclusão especializada permanecem dependentes de dados/evidências e, quando aplicável, de provider conectado.

## Distribuição completa

| Atividade | Personas principais | Plugins/capacidades | Execução local |
|---|---|---|---|
| Cognitive / Cockpit | Product Manager; Data Scientist; Systems Engineer | usage-telemetry; data-auth; error-monitoring | LOCAL_CONTRACT_ONLY |
| Mapa Vivo | Systems Engineer; Data Scientist; Product Designer | map-routing; usage-telemetry; data-auth | LOCAL_CONTRACT_ONLY |
| Cliente 360 | Product Manager; Data Architect; Security Architect | data-auth; billing-contracts; usage-telemetry | LOCAL_CONTRACT_ONLY |
| Produtos & Aplicativos | Product Manager; Software Architect; QA/Test Architect | version-registry; validation-gate; usage-telemetry | LOCAL_CONTRACT_ONLY |
| Comercial, Contratos e Oportunidades | Product Manager; Financial/ROI Analyst; Data Scientist | billing-contracts; usage-telemetry; document-registry | LOCAL_CONTRACT_ONLY |
| Saúde & Observabilidade | Systems Engineer; Data Engineer; QA/Test Architect | usage-telemetry; error-monitoring; validation-gate | LOCAL_CONTRACT_ONLY |
| Arquitetura, Dados e Bindings | Software Architect; Data Architect; Backend Engineer; Security Architect | data-auth; data-router; object-storage; version-registry | LOCAL_CONTRACT_ONLY |
| Problemas, Hipóteses e Melhorias | Research Scientist; Data Scientist; Systems Engineer; Product Manager | validation-gate; usage-telemetry; document-registry | LOCAL_CONTRACT_ONLY |
| Testes & Validation Gate | QA/Test Architect; Security Architect; Software Engineer | validation-gate; error-monitoring; version-registry | LOCAL_CONTRACT_ONLY |
| Versões, Release e Recuperação | Software Architect; QA/Test Architect; Systems Engineer | version-registry; validation-gate; document-registry | LOCAL_CONTRACT_ONLY |
| Instalação Proprietário | Security Architect; Backend Engineer; QA/Test Architect; Product Designer | data-auth; validation-gate; object-storage; usage-telemetry | LOCAL_CONTRACT_ONLY |
| Instalação Cliente | Backend Engineer; Security Architect; Product Designer; QA/Test Architect | data-auth; validation-gate; billing-contracts; usage-telemetry | LOCAL_CONTRACT_ONLY |
| LABTEST | Research Scientist; QA/Test Architect; Data Scientist; Software Architect | validation-gate; data-router; version-registry; usage-telemetry | LOCAL_CONTRACT_ONLY |
| Aplicativo LAMOU | Product Manager; Full-stack Engineer; QA/Test Architect | data-auth; usage-telemetry; error-monitoring; validation-gate | LOCAL_CONTRACT_ONLY |
| Documentos / MuDoc | Data Architect; Product Manager; QA/Test Architect | document-registry; object-storage; usage-telemetry | LOCAL_CONTRACT_ONLY |
| IA, Conselho e Orquestrador | Software Architect; Data Scientist; Security Architect; Research Scientist | ai-provider; data-router; validation-gate; usage-telemetry | LOCAL_CONTRACT_ONLY; provider NOT_CONNECTED |
| Planilhão / Cubo / Cubo Mágico / Caleidoscópio | Data Architect; Data Engineer; Software Architect; Systems Engineer; Research Scientist | data-router; object-storage; usage-telemetry; validation-gate | LOCAL_CONTRACT_ONLY |

## Estado atual das capacidades

| Capacidade | Estado | Observação |
|---|---|---|
| usage-telemetry | IMPLEMENTED_VERIFIED | `usage.v1` integrado ao Owner Console e ledger do CORE. |
| validation-gate | IMPLEMENTED_VERIFIED | Contratos/testes locais impedem PASS sintético sem evidência. |
| map-routing | IMPLEMENTED_VERIFIED | Mapa detecta/encaminha; investigação pertence ao CORE. |
| data-auth | PARTIAL | Supabase/RLS existem; MFA e gates restantes de produção ainda exigem fechamento. |
| version-registry | PARTIAL | Governança existe; cobertura completa de todos os apps ainda não comprovada. |
| document-registry | PARTIAL | Estrutura documental existe; adoção universal ainda não comprovada. |
| visual-library | PARTIAL | Assets oficiais existem; cobertura total das superfícies ainda é gate. |
| billing-contracts | PARTIAL | Modelos/fontes existem; cobrança real de produção não está comprovada. |
| error-monitoring | NOT_CONNECTED | Provider externo de erros/observabilidade não comprovado. |
| ai-provider | NOT_CONNECTED | Nenhuma execução externa deve ser simulada. |
| object-storage | NOT_CONNECTED | Storage universal de evidências/mídia ainda não está conectado. |
| data-router | DOCUMENTED_ONLY | Arquitetura Planilhão/Cubo/Cubo Mágico/Caleidoscópio precisa de benchmark e implementação experimental. |

## O que foi executado neste lote

1. Todas as 17 atividades foram registradas com no mínimo três personas e duas capacidades de plugin.
2. Todas as personas referenciadas são resolvidas no catálogo profissional existente.
3. Para cada atividade, o CORE consolida perguntas obrigatórias, evidências necessárias e critérios de pronto das personas selecionadas.
4. O batch local falha se houver persona inexistente, plugin inexistente, duplicidade, objetivo vazio ou persona sem perguntas/evidência/DoD.
5. A telemetria do Owner Console registra a atividade, personas e capacidades associadas ao uso da superfície.
6. O CI passa a executar a suíte de testes, além de TypeScript, lint e build.

## Limite de verdade

`LOCAL_CONTRACT_ONLY PASS` não deve ser convertido em `especialista executou análise`, `provider conectado`, `resultado validado` ou `produção pronta`. Esses estados precisam de evidência própria. Em especial, IA externa, monitoramento externo, object storage universal, faturamento real e Data Router experimental permanecem separados por truth-state.

SALVAR ≠ PROMOVER. `main/FROZEN` permanece fora deste lote.
