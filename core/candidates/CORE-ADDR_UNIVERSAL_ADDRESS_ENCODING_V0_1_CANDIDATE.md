# CORE-ADDR — Universal Address & Encoding Contract

**Versão:** V0.1 CANDIDATE  
**Estado:** CANDIDATA — SALVAR ≠ PROMOVER  
**Escopo:** transversal LAMOU IA / CORE  

## 1. Objetivo

Criar um endereço lógico universal, legível por pessoas e máquinas, capaz de identificar de forma determinística a origem e o destino lógico de grandes objetos de informação do ecossistema LAMOU IA.

O endereço canônico é independente do meio físico. O MESMO endereço pode ser representado como texto, bytes/bits, QR/Data Matrix, NFC/RFID, mensagem de rede, áudio ou padrão háptico/vibração.

**Regra principal:** identidade lógica != meio de transporte.

## 2. Prefixo universal

Todo endereço CORE-ADDR começa com `C` no formato humano.

Formato base V0.1:

`C1-Ssss-Eeeeeee-Kkkkkkkkk-Tttt-Ooooooooooo-Vvvvv-Nn`

Exemplo:

`C1-S001-E000001-K00000042-TIMG-O0000000123-V0002-N1`

Leitura:
- `C1` = família CORE-ADDR, versão do esquema 1;
- `S001` = sistema 001 (ex.: CORE, conforme System Registry);
- `E000001` = empresa/tenant 000001;
- `K00000042` = contrato 00000042;
- `TIMG` = tipo do objeto: imagem;
- `O0000000123` = objeto 123 dentro do namespace resolvido;
- `V0002` = versão 2 do objeto;
- `N1` = ambiente/contexto operacional conforme Environment Registry.

Os valores numéricos acima são EXEMPLOS. A associação `S001 = CORE` só se torna oficial após registro no System Registry.

## 3. Segmentos obrigatórios

| Segmento | Função | Exemplo |
|---|---|---|
| `C1` | família + versão do esquema | `C1` |
| `S` | sistema/aplicativo/capability principal | `S001` |
| `E` | empresa/tenant | `E000001` |
| `K` | contrato/entitlement raiz | `K00000042` |
| `T` | tipo do objeto | `TIMG`, `TDOC`, `TDAT`, `TAPP` |
| `O` | identidade sequencial/registrada do objeto | `O0000000123` |
| `V` | versão lógica do objeto | `V0002` |
| `N` | ambiente/contexto | `N1` |

O código pode ganhar extensões futuras, mas nenhuma extensão pode alterar silenciosamente o significado de um endereço V0.1 já emitido.

## 4. Type Registry inicial candidato

Tipos devem ser resolvidos por registry, não por interpretação livre.

- `APP` — aplicativo/produto;
- `SYS` — sistema/capability;
- `DOC` — documento;
- `DAT` — dado/dataset/registro lógico de alto nível;
- `IMG` — imagem/logo/ícone/asset visual;
- `AUD` — áudio;
- `VID` — vídeo;
- `CMP` — componente;
- `COD` — artefato de código;
- `BLD` — build;
- `CFG` — configuração;
- `USR` — identidade de usuário quando permitido;
- `CON` — contrato;
- `LIC` — licença/entitlement;
- `EVD` — evidência;
- `RISK` — risco;
- `TST` — teste;
- `SRC` — fonte/proveniência;

Lista é candidata e deve reconciliar prefixos/códigos já existentes antes de promoção.

## 5. Resolução do endereço

O código NÃO precisa conter o caminho físico completo. Ele é a chave para um resolver canônico.

Exemplo:

`C1-S001-E000001-K00000042-TIMG-O0000000123-V0002-N1`

pode resolver para:
- registry record;
- Storage object atual;
- Git path/commit quando objeto for código;
- Documento Mestre;
- banco/tabela/chave;
- URL/API autorizada;
- hash;
- owner;
- classificação;
- estado (`EFFECTIVE`, `FROZEN`, `OBSOLETE` etc.);
- provenance;
- bindings e consumidores.

Mudança de caminho físico NÃO muda identidade lógica. Mudança de identidade cria novo endereço.

## 6. CURRENT versus PINNED

O endereço pode ser usado de duas formas:

- `CURRENT`: resolve a versão `EFFECTIVE` atual daquele objeto lógico;
- `PINNED`: resolve exatamente a versão codificada em `V`.

Documento/tela viva pode usar CURRENT. Evidência, snapshot, documento FROZEN ou assinado usa PINNED.

## 7. Forma binária

CORE-ADDR deve possuir uma representação binária determinística para transporte e processamento.

### Frame binário candidato de 128 bits

- 8 bits — family/schema (`0xC1` para CORE-ADDR V1);
- 12 bits — System ID;
- 20 bits — Enterprise ID;
- 24 bits — Contract ID;
- 8 bits — Object Type ID;
- 40 bits — Object ID;
- 12 bits — Version;
- 4 bits — Environment.

Total: 128 bits.

Integridade de transporte (CRC/MAC/assinatura) fica FORA dos 128 bits de identidade para não misturar endereço com segurança/transmissão.

## 8. Proveniência do dado

Um dado relevante deve possuir ou herdar um CORE-ADDR resolvível. Para granularidade maior, um registro pode apontar para:
- `source_address` — de onde veio;
- `object_address` — onde está registrado;
- `parent_address` — objeto pai;
- `evidence_address` — evidência correspondente;
- `contract_address` — contrato/entitlement aplicável.

Assim o sistema consegue responder não só “qual é o dado?”, mas “de qual sistema, empresa, contrato, objeto, versão e ambiente ele veio?”.

## 9. Representação háptica / vibração

Vibração é um CANAL de codificação do endereço ou de um token derivado dele.

### Regra
Não atribuir significado direto a “uma vibração” sem protocolo. O significado vem do frame CORE-ADDR e do Haptic Encoding Profile.

### Perfil háptico candidato

Para comunicação curta:
- preâmbulo reconhecível;
- `0` e `1` representados por padrões temporais distintos e autocronometrados;
- checksum/CRC do frame háptico;
- token curto pode apontar para o CORE-ADDR completo no registry.

Para endereços completos de 128 bits, transmissão puramente por vibração pode ser lenta. Portanto o padrão deve admitir:
1. `FULL_FRAME` — transmite todos os bits quando necessário;
2. `ROUTING_TOKEN` — transmite token curto resolvido pelo registry;
3. `EVENT_PATTERN` — vibração representa evento/estado já vinculado a um endereço conhecido.

Exemplo conceitual: dispositivo recebe um evento associado a `C1-S001-E000001-K00000042-TIMG-O0000000123-V0002-N1`; o motor háptico reproduz o padrão registrado para aquele evento. A vibração não substitui a identidade canônica — ela a transporta ou referencia.

## 10. Logo/imagem

Uma logo não é apenas arquivo. Ela recebe CORE-ADDR do tipo `IMG`.

Exemplo candidato:

`C1-S001-E000001-K00000042-TIMG-O0000000123-V0002-N1`

Um documento/sidebar pode manter referência CURRENT ao objeto lógico. Quando V0003 for promovida como EFFECTIVE, consumidores LIVE passam a resolver V0003; snapshots PINNED continuam em V0002.

## 11. Segurança

CORE-ADDR identifica; não autoriza.

Conhecer um endereço não concede acesso ao objeto. Resolução deve respeitar Auth, RBAC/ABAC, tenant/workspace, contrato, entitlement, RLS, classificação e demais políticas.

Nunca codificar segredo, senha, token de autenticação ou dado pessoal sensível diretamente no endereço.

## 12. Registry mínimo necessário

- System Registry;
- Enterprise/Tenant Registry;
- Contract Registry;
- Type/Prefix Registry;
- Object Registry;
- Version Registry;
- Environment Registry;
- Resolver Registry;
- Binding Registry;
- Provenance Registry.

Cada emissão de endereço deve ser única, auditável e não reutilizável para outro objeto.

## 13. Mid-Run Coherence Gate

Ao criar ou resolver códigos durante execução complexa, o Mid-Run Coherence Gate deve verificar:
- segmento ausente;
- registry não resolvido;
- colisão de ID;
- empresa/contrato incompatível;
- objeto estrangeiro sem binding;
- CURRENT/PINNED incorreto;
- origem/proveniência ausente;
- endereço apontando para versão obsoleta/rejeitada.

## 14. Estado real

Esta especificação é CANDIDATA. Ela consolida a pendência já existente de `Type/Prefix Registry por empresa` e amplia para endereço hierárquico universal e codificações físicas. Não deve ser tratada como runtime implementado até existirem registries, resolver, banco, testes e evidências.