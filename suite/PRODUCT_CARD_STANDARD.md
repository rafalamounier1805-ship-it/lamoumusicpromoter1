# LAMOU IA — Padrão do Card de Produto

## Regra principal
O card de um aplicativo é a porta de entrada completa do produto. Clicar em qualquer área livre do card deve abrir a **Central do Produto**.

## Primeira tela obrigatória
A Central do Produto deve mostrar, sem exigir navegação escondida:
- imagem/preview do aplicativo;
- logo e screenshots;
- ambiente TESTE / DEMO;
- ambiente OFICIAL / REAL / PRODUÇÃO;
- versões anteriores;
- documentos;
- arquivos e downloads;
- links principais;
- repositório quando aplicável;
- arquitetura/estrutura;
- direitos, autoria, titularidade e evidências;
- marketing e posicionamento;
- histórico de compartilhamentos/envios.

## TESTE x OFICIAL
TESTE/DEMO é um ambiente permanente de experimentação, homologação e demonstração e pode conter dados simulados. OFICIAL/REAL é o ambiente limpo destinado à entrega e ao uso real. Um teste só deve ser marcado como ativo quando existir uma demonstração funcional; smoke pages, placeholders `ok`/`teste` e páginas que exibem caminhos locais não contam como ambiente de teste válido.

## Botões do card
- **Abrir tudo** — abre a Central do Produto.
- **TESTE** — abre a demonstração funcional quando existir; caso contrário abre a configuração do canal TESTE.
- **OFICIAL** — abre a versão real publicada quando existir; caso contrário abre a configuração do canal OFICIAL.

## Imagens
Cada produto deve poder guardar imagem principal, logo e screenshots adicionais. Se não houver imagem vinculada, a Central deve indicar claramente que o preview está pendente, sem inventar screenshot.
