# Comparação: Roteiro 12 vs Roteiro 13

## 📊 Antes (Roteiro 12) - Entidade Isolada

```
┌─────────────────────┐
│      TAREFAS        │
├─────────────────────┤
│ id (PK)             │
│ descricao           │
│ concluido           │
│ criada_em           │
└─────────────────────┘

Banco de dados SIMPLES:
- Uma tabela
- Sem relacionamentos
```

### Exemplo de Tarefa (Roteiro 12):

```json
{
  "id": 1,
  "descricao": "Estudar JavaScript",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z"
}
```

---

## 🎯 Depois (Roteiro 13) - Com Relacionamento 1:N

```
┌──────────────────────────┐         ┌─────────────────────┐
│     PROJETOS (1)         │ 1───→ N │      TAREFAS (N)    │
├──────────────────────────┤         ├─────────────────────┤
│ id (PK)                  │         │ id (PK)             │
│ nome                     │         │ descricao           │
│ criado_em                │         │ concluido           │
│                          │         │ criada_em           │
│                          │         │ projeto_id (FK) ───→
└──────────────────────────┘         └─────────────────────┘
                                              ↓
                                    (aponta para projetos.id)

Banco de dados RELACIONAL:
- Duas tabelas
- Relacionamento via Foreign Key (FK)
- Um projeto pode ter muitas tarefas
```

### Exemplo de Tarefa (Roteiro 13):

```json
{
  "id": 1,
  "descricao": "Estudar JavaScript",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 2,
  "projeto_nome": "Estudos de Backend",
  "projeto_criado_em": "2024-06-21T09:50:00.000Z"
}
```

---

## 🔄 Alterações no Código

### 1. BANCO DE DADOS

#### Roteiro 12:

```sql
CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE,
  criada_em TIMESTAMP DEFAULT NOW()
);
```

#### Roteiro 13:

```sql
-- Nova tabela
CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Tabela alterada
CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE,
  criada_em TIMESTAMP DEFAULT NOW(),
  projeto_id INTEGER,  -- ⭐ NOVO
  CONSTRAINT fk_tarefas_projetos
    FOREIGN KEY (projeto_id) REFERENCES projetos(id)
    ON DELETE SET NULL
);
```

---

### 2. REPOSITORY

#### Roteiro 12 - buscarTodos():

```javascript
async buscarTodos() {
  const resultado = await client.query(`
    SELECT id, descricao, concluido, criada_em
    FROM tarefas
    ORDER BY id
  `);
  return resultado.rows;
}
```

#### Roteiro 13 - buscarTodos() COM JOIN:

```javascript
async buscarTodos() {
  const resultado = await client.query(`
    SELECT
      t.id,
      t.descricao,
      t.concluido,
      t.criada_em,
      t.projeto_id,
      p.nome AS projeto_nome,                    -- ⭐ NOVO
      p.criado_em AS projeto_criado_em          -- ⭐ NOVO
    FROM tarefas t
    LEFT JOIN projetos p ON t.projeto_id = p.id -- ⭐ NOVO
    ORDER BY t.id
  `);
  return resultado.rows;
}
```

---

### 3. REPOSITORY - Salvar Tarefa

#### Roteiro 12:

```javascript
async salvar(tarefa) {
  const resultado = await client.query(
    `INSERT INTO tarefas (descricao, concluido)
     VALUES ($1, $2)
     RETURNING id, descricao, concluido, criada_em`,
    [tarefa.descricao, tarefa.concluido || false]
  );
  return resultado.rows[0];
}
```

#### Roteiro 13:

```javascript
async salvar(tarefa) {
  const resultado = await client.query(
    `INSERT INTO tarefas (descricao, concluido, projeto_id)
     VALUES ($1, $2, $3)
     RETURNING id, descricao, concluido, criada_em, projeto_id`,
    [
      tarefa.descricao,
      tarefa.concluido || false,
      tarefa.projetoId || null  -- ⭐ NOVO
    ]
  );
  return resultado.rows[0];
}
```

---

### 4. SERVICE

#### Roteiro 12:

```javascript
async criarTarefa(dados) {
  if (!dados.descricao || dados.descricao.trim() === "") {
    throw new AppError("A descrição é obrigatória", 400);
  }

  return await this.repository.salvar({
    descricao: dados.descricao.trim(),
    concluido: dados.concluido || false
  });
}
```

#### Roteiro 13:

```javascript
async criarTarefa(dados) {
  if (!dados.descricao || dados.descricao.trim() === "") {
    throw new AppError("A descrição é obrigatória", 400);
  }

  return await this.repository.salvar({
    descricao: dados.descricao.trim(),
    concluido: dados.concluido || false,
    projetoId: dados.projetoId || null  -- ⭐ NOVO
  });
}

// ⭐ NOVO: Buscar tarefas de um projeto
async buscarPorProjeto(projetoId) {
  return await this.repository.buscarPorProjeto(projetoId);
}
```

---

### 5. CONTROLLER

#### Roteiro 12:

```javascript
async criar(request, reply) {
  const tarefa = await this.service.criarTarefa(request.body);
  return reply.status(201).send(tarefa);
}
```

#### Roteiro 13:

```javascript
async criar(request, reply) {
  // request.body agora pode conter { descricao, projetoId, concluido }
  const tarefa = await this.service.criarTarefa(request.body);
  return reply.status(201).send(tarefa);
}

// ⭐ NOVO: Buscar por projeto
async buscarPorProjeto(request, reply) {
  const { projetoId } = request.params;
  const tarefas = await this.service.buscarPorProjeto(projetoId);
  return reply.send(tarefas);
}
```

---

### 6. ROTAS

#### Roteiro 12:

```javascript
server.get("/tarefas", ...);
server.post("/tarefas", ...);
server.get("/tarefas/:id", ...);
server.patch("/tarefas/:id", ...);
server.delete("/tarefas/:id", ...);
```

#### Roteiro 13:

```javascript
server.get("/tarefas", ...);
server.post("/tarefas", ...);
server.get("/tarefas/:id", ...);
server.patch("/tarefas/:id", ...);
server.delete("/tarefas/:id", ...);
server.get("/tarefas/projeto/:projetoId", ...);  -- ⭐ NOVO

// ⭐ NOVO: Endpoints para PROJETOS
server.get("/projetos", ...);
server.post("/projetos", ...);
server.get("/projetos/:id", ...);
server.patch("/projetos/:id", ...);
server.delete("/projetos/:id", ...);
```

---

## 📈 Evolução da Estrutura

```
Roteiro 12                          Roteiro 13
──────────────────────────────────────────────────────────

1. Entidade Isolada        →    Relacionamento 1:N
   └─ TAREFAS              →    ├─ PROJETOS (1)
                                 └─ TAREFAS (N)

2. Sem Foreign Key         →    Com Foreign Key (FK)
   └─ projeto_id = NULL    →    └─ projeto_id INTEGER FK

3. SELECT simples           →    SELECT com LEFT JOIN
   └─ Só dados da tabela    →    └─ Enriquece com projeto

4. Sem filtro por projeto   →    Filtro com INNER JOIN
   └─ Não existe             →    └─ GET /tarefas/projeto/:id

5. Sem CRUD de Projetos     →    CRUD completo de Projetos
   └─ Não existe             →    ├─ GET, POST, PATCH, DELETE
                              └─ Todos os endpoints
```

---

## 💡 Principais Conceitos Novos

| Conceito                  | Roteiro 12 | Roteiro 13 | Descrição                           |
| ------------------------- | ---------- | ---------- | ----------------------------------- |
| **Foreign Key**           | ❌         | ✅         | Vinculação entre tabelas            |
| **LEFT JOIN**             | ❌         | ✅         | Trazer dados relacionados com NULLs |
| **INNER JOIN**            | ❌         | ✅         | Trazer dados relacionados sem NULLs |
| **Entidade Projeto**      | ❌         | ✅         | Nova tabela e CRUD                  |
| **projeto_id**            | ❌         | ✅         | Nova coluna com FK                  |
| **CamelCase → SnakeCase** | Simples    | ✅         | Conversão JS ↔ SQL                  |

---

## 🎓 Aprendizado Progressivo

```
Roteiro 12: SQL Puro
    ↓
    Aprendemos a usar Pool, executar queries e estruturar
    o padrão Controller → Service → Repository

Roteiro 13: Relacionamentos 1:N ← VOCÊ ESTÁ AQUI
    ↓
    Aprendemos a criar relacionamentos com Foreign Keys
    e usar JOINs para trazer dados relacionados

Roteiro 14 (Próximo): Relacionamentos M:N
    ↓
    Tabela de junção, queries mais complexas
```

---
