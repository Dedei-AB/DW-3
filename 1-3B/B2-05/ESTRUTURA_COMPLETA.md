# 📁 Estrutura Completa do B2-05

## Árvore de Arquivos

```
B2-05/
├── src/
│   ├── database/
│   │   └── client.js                          [1] Conexão com PostgreSQL
│   ├── errors/
│   │   └── AppError.js                        [2] Erro customizado
│   ├── repositories/
│   │   ├── tarefa.repository.js               [3] ⭐ JOINs e queries SQL
│   │   └── projeto.repository.js              [4] CRUD de projetos
│   ├── services/
│   │   ├── tarefa.service.js                  [5] Lógica de negócio (tarefas)
│   │   └── projeto.service.js                 [6] Lógica de negócio (projetos)
│   ├── controllers/
│   │   ├── tarefa.controller.js               [7] HTTP handlers (tarefas)
│   │   └── projeto.controller.js              [8] HTTP handlers (projetos)
│   ├── routes/
│   │   ├── tarefa.routes.js                   [9] Endpoints de tarefas
│   │   └── projeto.routes.js                  [10] Endpoints de projetos
│   └── server.js                              [11] Servidor Fastify
├── sql/
│   ├── 01-criar-relacionamento-1n.sql         [12] ⭐ Migration principal
│   ├── 02-criar-tabelas-do-zero.sql           [13] Criação alternativa
│   └── 03-referencia-queries-e-dados.sql      [14] Exemplos de queries
├── package.json                                [15] Dependências
├── .env.example                                [16] Configuração
├── server-teste.http                           [17] Testes de requisições
├── README.md                                   [18] Documentação completa
├── GUIA_RAPIDO.md                             [19] Passo a passo rápido
└── COMPARACAO_R12_R13.md                      [20] Antes vs Depois

20 arquivos criados
```

---

## 📋 Responsabilidade de Cada Arquivo

### CAMADA DE DADOS

| Arquivo       | Responsabilidade                               |
| ------------- | ---------------------------------------------- |
| `client.js`   | Cria Pool PostgreSQL com credenciais do .env   |
| `AppError.js` | Define erro customizado para regras de negócio |

### CAMADA DE PERSISTÊNCIA (Repositories)

| Arquivo                 | Métodos                | SQL                   |
| ----------------------- | ---------------------- | --------------------- |
| `tarefa.repository.js`  | `buscarTodos()`        | LEFT JOIN             |
|                         | `buscarPorId(id)`      | LEFT JOIN             |
|                         | `buscarPorProjeto(id)` | **INNER JOIN** ⭐     |
|                         | `salvar(tarefa)`       | INSERT com projeto_id |
|                         | `atualizar(id, dados)` | UPDATE com projeto_id |
|                         | `remover(id)`          | DELETE                |
| `projeto.repository.js` | `buscarTodos()`        | SELECT simples        |
|                         | `buscarPorId(id)`      | SELECT simples        |
|                         | `salvar(projeto)`      | INSERT                |
|                         | `atualizar(id, dados)` | UPDATE                |
|                         | `remover(id)`          | DELETE                |

### CAMADA DE LÓGICA (Services)

| Arquivo              | Responsabilidade                          |
| -------------------- | ----------------------------------------- |
| `tarefa.service.js`  | Validações, regras de negócio de tarefas  |
| `projeto.service.js` | Validações, regras de negócio de projetos |

### CAMADA DE APRESENTAÇÃO (Controllers)

| Arquivo                 | Responsabilidade                                       |
| ----------------------- | ------------------------------------------------------ |
| `tarefa.controller.js`  | HTTP handlers para tarefas (GET, POST, PATCH, DELETE)  |
| `projeto.controller.js` | HTTP handlers para projetos (GET, POST, PATCH, DELETE) |

### CAMADA DE ROTEAMENTO

| Arquivo             | Responsabilidade                                |
| ------------------- | ----------------------------------------------- |
| `tarefa.routes.js`  | Define rotas `/tarefas` e `tarefas/projeto/:id` |
| `projeto.routes.js` | Define rotas `/projetos`                        |

### SERVIDOR

| Arquivo     | Responsabilidade                                   |
| ----------- | -------------------------------------------------- |
| `server.js` | Cria servidor Fastify, registra rotas, trata erros |

### BANCO DE DADOS

| Arquivo                             | Responsabilidade                 |
| ----------------------------------- | -------------------------------- |
| `01-criar-relacionamento-1n.sql`    | **⭐ Migration com ALTER TABLE** |
| `02-criar-tabelas-do-zero.sql`      | Criação from scratch             |
| `03-referencia-queries-e-dados.sql` | Exemplos e referência de queries |

### DOCUMENTAÇÃO E CONFIGURAÇÃO

| Arquivo                 | Responsabilidade                     |
| ----------------------- | ------------------------------------ |
| `package.json`          | Scripts e dependências (fastify, pg) |
| `.env.example`          | Template de variáveis de ambiente    |
| `server-teste.http`     | Exemplos de requisições HTTP         |
| `README.md`             | Documentação completa do projeto     |
| `GUIA_RAPIDO.md`        | Como começar rapidamente             |
| `COMPARACAO_R12_R13.md` | Antes vs Depois                      |

---

## 🔄 Fluxo de uma Requisição

```
POST /tarefas { descricao: "...", projetoId: 1 }
    ↓
server.js (POST handler)
    ↓
tarefa.controller.js (criar)
    ├─ Recebe request.body
    └─ Chama service.criarTarefa()
    ↓
tarefa.service.js (criarTarefa)
    ├─ Valida descricao
    ├─ Prepara dados com projetoId
    └─ Chama repository.salvar()
    ↓
tarefa.repository.js (salvar) ⭐
    ├─ Converte projetoId → projeto_id
    ├─ Executa: INSERT INTO tarefas (descricao, concluido, projeto_id)
    └─ RETURNING id, descricao, concluido, criada_em, projeto_id
    ↓
PostgreSQL Database
    ├─ Insere tarefa
    ├─ Valida FK (projeto_id referencia projetos.id)
    └─ Retorna tarefa criada
    ↓
tarefa.repository.js
    └─ Retorna resultado.rows[0]
    ↓
tarefa.service.js
    └─ Retorna tarefa
    ↓
tarefa.controller.js
    └─ reply.status(201).send(tarefa)
    ↓
Response: 201 Created { id, descricao, concluido, projeto_id, ... }
```

---

## 📊 Diagrama ER (Entity Relationship)

```
┌──────────────────────────────────┐
│           PROJETOS (1)           │
├──────────────────────────────────┤
│ PK  id SERIAL PRIMARY KEY        │  Uma Projeto
│     nome TEXT NOT NULL           │  pode ter
│     criado_em TIMESTAMP          │  MUITAS
│                                  │  tarefas
└────────────────┬─────────────────┘
                 │
                 │ 1:N
                 │ Foreign Key
                 │
┌────────────────▼─────────────────┐
│           TAREFAS (N)            │
├──────────────────────────────────┤
│ PK  id SERIAL PRIMARY KEY        │  Cada tarefa
│     descricao TEXT NOT NULL      │  pertence a UM
│     concluido BOOLEAN            │  projeto
│     criada_em TIMESTAMP          │  (ou NENHUM)
│ FK  projeto_id INTEGER → P(id)   │
│     ON DELETE SET NULL           │
└──────────────────────────────────┘
```

---

## 🎯 SQL Executado em Cada Camada

### 1. CREATE TABLE (Migration)

```sql
CREATE TABLE projetos (id, nome, criado_em);
ALTER TABLE tarefas ADD COLUMN projeto_id;
ALTER TABLE tarefas ADD FOREIGN KEY (projeto_id) REFERENCES projetos(id);
```

### 2. INSERT (Salvar Tarefa)

```sql
INSERT INTO tarefas (descricao, concluido, projeto_id)
VALUES ('...', false, 1)
RETURNING id, descricao, concluido, criada_em, projeto_id;
```

### 3. SELECT com LEFT JOIN (Buscar Todos)

```sql
SELECT
  t.id, t.descricao, t.concluido, t.criada_em, t.projeto_id,
  p.nome AS projeto_nome, p.criado_em AS projeto_criado_em
FROM tarefas t
LEFT JOIN projetos p ON t.projeto_id = p.id
ORDER BY t.id;
```

### 4. SELECT com INNER JOIN (Buscar por Projeto)

```sql
SELECT
  t.id, t.descricao, t.concluido, t.criada_em, t.projeto_id,
  p.nome AS projeto_nome, p.criado_em AS projeto_criado_em
FROM tarefas t
INNER JOIN projetos p ON t.projeto_id = p.id
WHERE t.projeto_id = $1
ORDER BY t.id;
```

### 5. UPDATE (Atualizar Tarefa)

```sql
UPDATE tarefas
SET descricao = $1, concluido = $2, projeto_id = $3
WHERE id = $4
RETURNING id, descricao, concluido, criada_em, projeto_id;
```

### 6. DELETE (Remover Tarefa)

```sql
DELETE FROM tarefas WHERE id = $1;
```

---

## 🧪 Testes com HTTP

Use o arquivo `server-teste.http` com a extensão REST Client do VS Code:

```
1. GET /projetos              (Listar projetos)
2. POST /projetos             (Criar projeto)
3. POST /tarefas              (Criar tarefa com projetoId)
4. GET /tarefas               (Listar todas as tarefas com projeto)
5. GET /tarefas/1             (Buscar tarefa 1 com dados do projeto)
6. GET /tarefas/projeto/1     (Listar tarefas do projeto 1)
7. PATCH /tarefas/1           (Atualizar tarefa)
8. DELETE /tarefas/1          (Deletar tarefa)
```

---

## 📚 Próximos Passos

- [ ] Roteiro 14: Relacionamentos M:N (muitos para muitos)
- [ ] Adicionar validação de FK constraints no Service
- [ ] Implementar paginação em listagens
- [ ] Adicionar busca full-text em descrições
- [ ] Usar transações SQL para operações em cascata
