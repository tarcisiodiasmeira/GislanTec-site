# Gislan Tec — site inicial

Página estática em HTML, CSS e JavaScript, pronta para publicar no GitHub Pages. O seletor funciona em três etapas: marca, modelo e tipo de conserto. Também aceita um modelo digitado para marcas que não estão na lista.

## Antes de publicar

1. Abra `config.js` e informe o WhatsApp oficial da assistência no formato internacional, só com números (DDI + DDD + número), sem `+`, espaços ou traços.
2. Revise a lista de modelos em `script.js` e ajuste marcas, aparelhos e serviços para o que a assistência realmente atende.
3. Confira o nome “Gislan Tec” e os textos do site. A arte do telefone está em `assets/telefone-gislan.svg`.

Sem o WhatsApp configurado, a seleção do aparelho continua funcionando, mas o botão final avisa que falta configurar o contato.

## Publicar no GitHub

Envie todos os arquivos e a pasta `assets` para a raiz do repositório. Em **Settings → Pages**, selecione a branch usada pelo repositório e a pasta `/ (root)`. O arquivo inicial é `index.html`.

## Layout

O conteúdo se ajusta a telas largas e estreitas, com regras específicas para celular em retrato e em paisagem, navegação por teclado, foco visível e respeito à preferência por movimento reduzido.

