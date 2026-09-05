# Roteiro 15

Este projeto dá continuidade ao banco relacional construído no R14. A API mantém
o PostgreSQL, o pacote `pg` e o `Pool` já utilizados, mas acrescenta o Drizzle
como uma forma alternativa de representar e consultar as tabelas no código.

## O que foi acrescentado

- `src/database/schema.js`: representação inicial das tabelas `tarefas` e
  `projetos` com Drizzle.
- `src/database/drizzle.js`: criação do cliente Drizzle a partir do `Pool`
  existente, sem abrir uma conexão paralela.
- `src/scripts/testa-drizzle.js`: pequeno laboratório que lista as tarefas,
  insere uma tarefa de teste quando necessário e lista os registros novamente.
- `src/scripts/lista-projetos-drizzle.js`: consulta de projetos usando Drizzle.

O laboratório é executado separadamente do servidor HTTP, mas usa o banco
indicado por `DATABASE_URL`. Por isso, ele não é um banco isolado: a inserção
de teste permanece na base configurada, salvo se for removida manualmente.

## Estrutura principal

- `sql/schema.sql`: criação do esquema relacional completo, incluindo os
  relacionamentos 1:1, 1:N e N:N.
- `sql/dados-iniciais.sql`: carga inicial de projetos, tarefas, detalhes e tags.
- `src/index.js`: servidor Express.
- `src/db.js`: conexão PostgreSQL compartilhada pelo backend e pelo Drizzle.
- `src/repository/tarefasRepository.js`: consulta da API escrita em SQL puro.

Assim, SQL puro e Drizzle convivem no mesmo projeto, expressando operações
diferentes sobre o mesmo PostgreSQL. O Drizzle não substitui o schema SQL nem
faz alterações no banco automaticamente; neste roteiro, ele funciona como uma
camada de leitura e escrita para experimentação.

## Como executar

1. Crie um banco PostgreSQL e defina `DATABASE_URL` no ambiente ou em um arquivo
   `.env`.
2. Instale as dependências com `npm install`.
3. Crie e preencha as tabelas:
   `psql "$DATABASE_URL" -f sql/schema.sql` e
   `psql "$DATABASE_URL" -f sql/dados-iniciais.sql`.
4. Inicie a API com `npm start`.

Para executar os exemplos de Drizzle, use:

```text
node src/scripts/testa-drizzle.js
node src/scripts/lista-projetos-drizzle.js
```

## Endpoint

- `GET /tarefas/:id`: retorna uma tarefa com suas tags agregadas.
