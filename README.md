# Mini Navegador

Projeto web simples desenvolvido com HTML, CSS e TypeScript para simular um mini navegador com:

- campo para navegar por URL
- botoes de ir, voltar e avancar
- historico de navegacao
- lista de favoritos
- persistencia de historico e favoritos com `localStorage`

## Estrutura

- `index.html`: interface principal
- `style.css`: estilos da aplicacao
- `src/script.ts`: codigo-fonte em TypeScript
- `dist/script.js`: arquivo compilado usado pela pagina

## Como executar

1. Instale as dependencias:
   ```bash
   npm install
   ```
2. Compile o TypeScript:
   ```bash
   npx tsc
   ```
3. Abra `index.html` no navegador.

## Observacao

Alguns sites podem bloquear exibicao em `iframe` por politicas de seguranca do proprio site.
