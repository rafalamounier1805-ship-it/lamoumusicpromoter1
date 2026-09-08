# CODEX PROMPT-MESTRE — LAMOU IA CORE V2.2

## Papel
Evoluir o LAMOU IA CORE em versão derivada, preservando integralmente as baselines congeladas e sem declarar como executável qualquer capability que não possua código, testes e evidência.

## Objetivo
Implementar e documentar uma arquitetura transversal em que cada capability do CORE possua identidade, contrato, dependências, política de segurança, dados envolvidos, continuidade, reverse path, evidência e ficha visual clicável.

## Regras obrigatórias
1. Nunca sobrescrever baseline congelada; criar branch/versão derivada com changelog.
2. Estados válidos: PROPOSTO → CATALOGADO → IMPLEMENTADO → TESTADO → HOMOLOGADO → PRODUÇÃO.
3. Nenhum estado pode avançar sem evidência correspondente.
4. Módulo/capability ≠ plugin/provider.
5. Hard rules de segurança vencem recomendação de IA.
6. IA pode elevar proteção; não pode reduzir controle crítico obrigatório sem política explícita e aprovação quando exigida.
7. Toda capability crítica deve declarar Plan X, Y, Z e Safe quando aplicável, além de Reverse Path.
8. `CORE-DTRUST` deve apontar dependências comuns para evitar falsa redundância.
9. Segredos nunca ficam em código-fonte, log, analytics, prompt ou localStorage de produção.
10. Senhas de usuário são hash; não são recuperáveis.
11. Segredos de sistema usam identidade lógica (`CORE-SID`), purpose binding, rotação e KMS/HSM/Vault; threshold apenas quando risco justificar.
12. Rota móvel/alias efêmero é defesa adicional, nunca segurança baseada em obscuridade.
13. Auditoria crítica preserva evidência mínima e não registra segredo, share, token ou rota completa.
14. Dados devem usar política "mova apenas o que mudou" quando tecnicamente seguro.
15. `CORE-BUF` é buffer transitório durável, não source of truth.
16. Só mostrar “Concluído” em operação crítica após commit definitivo + verificação.
17. Arquivos grandes devem usar `CORE-INDEX` + lazy/chunk loading; alterações devem usar `CORE-DELTA` + `CORE-ALLOC` + `CORE-COMMIT` sempre que o formato/contrato permitir.
18. XLSX usado frequentemente deve preferencialmente ser importado para modelo estruturado; arquivo completo fica como import/export/snapshot.
19. Todos os códigos do CORE devem ter ficha clicável com: quando atua; entradas; saídas; dados e segurança; dependências; Plan X/Y/Z/Safe; source path real ou contrato proposto; status e evidência.
20. Propostas diferenciadas recebem selo visual `✦` com classificação BASE CONHECIDA, DIFERENCIAL LAMOU ou CANDIDATO A PESQUISA/IP. O selo nunca afirma patenteabilidade.

## Arquitetura de dados
```text
Alteração
→ CORE-DELTA
→ CORE-BUF (durável + criptografado + TTL)
→ ACK RECEBIDO
→ CORE-PROJ (estado PENDENTE para telas autorizadas)
→ CORE-SEC-ORCH
→ CORE-ALLOC
→ CORE-STOR
→ CORE-COMMIT (idempotente/versionado)
→ CORE-VER
→ CORE-BDR
→ purge do payload transitório
```

## Arquitetura de leitura incremental
```text
Abrir arquivo
→ CORE-INDEX
→ metadados/abas
→ abrir aba/range solicitado
→ carregar somente chunk necessário
→ próxima faixa sob demanda
```

## Arquitetura de segurança
```text
Ação/Dado
→ Classificação de risco
→ Policy Gate / hard rules
→ análise contextual de IA
→ Security Plan
→ Purpose/RBAC/Step-up/Approval
→ KMS/HSM/Threshold quando necessário
→ execução
→ CORE-VER
→ CORE-FORENSIC/AUD
```

## Continuidade
```text
CORE-RES
→ CORE-XY
→ X preferido
   falha/degrada?
→ Y hot standby
→ Z alternativa segura
→ Safe Mode
→ CORE-RPATH
→ reconcile
→ verify
```

## Códigos prioritários desta derivada
- CORE-TRUTH / CORE-VTR
- CORE-TASK / CORE-EVAL / CORE-RES / CORE-LUP
- CORE-SEC-ORCH / CORE-CRYPT / CORE-KMS / CORE-SID / CORE-ROT / CORE-PURPOSE / CORE-EPH
- CORE-THRESH / CORE-DTRUST / CORE-MROUTE / CORE-EID / CORE-ROUTEVAULT / CORE-FORENSIC
- CORE-STOR / CORE-DLOC / CORE-SAVE / CORE-BUF / CORE-PROJ / CORE-COMMIT / CORE-INDEX / CORE-DELTA / CORE-ALLOC / CORE-BDR
- CORE-XY / CORE-RPATH
- CORE-LOC / CORE-SIG / CORE-ACK / CORE-ESC
- CORE-A11Y / CORE-AT / CORE-SENSORY

## Critérios de aceite
- Baseline principal intacta.
- Branch derivada identificável.
- Catálogo de códigos carregado sem erro de sintaxe.
- Cada código abre ficha navegável.
- Nenhum PROPOSTO aparece como PRODUÇÃO.
- Source path mostrado onde existir.
- Contrato proposto rotulado onde não houver runtime.
- Dados críticos não são expostos em UI/log.
- Buffer possui estados recebido/pendente/commitado/verificado/falha.
- Operações críticas não usam optimistic success falso.
- Changelog e documentação atualizados.
- Testes de parse/smoke executados antes da promoção.
