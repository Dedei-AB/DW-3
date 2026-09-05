# Roteiro 13 - Modelando Relacionamentos 1:N no Backend

## 📚 O Que Foi Implementado

Este projeto implementa o **Roteiro 13**, que ensina como modelar relacionamentos **Um para Muitos (1:N)** em um backend Node.js com PostgreSQL puro (usando `pg` com `Pool`).

### Mudança Principal

- **Antes (Roteiro 12)**: Apenas a entidade `tarefas` isolada
- **Depois (Roteiro 13)**: Relacionamento 1:N entre `projetos` e `tarefas`
  - Um **Projeto** pode ter **N Tarefas**
  - Uma **Tarefa** pertence a **Um Projeto** (ou nenhum)

---

## 🗂️ Estrutura do Projeto

```
B2-05/
├── src/
│   ├── database/
│   │   └── client.js              # Configuração do Pool PostgreSQL
│   ├── errors/
│   │   └── AppError.js            # Classe de erro customizada
│   ├── controllers/
│   │   ├── tarefa.controller.js
│   │   └── projeto.controller.js
│   ├── services/
│   │   ├── tarefa.service.js
│   │   └── projeto.service.js
│   ├── repositories/
│   │   ├── tarefa.repository.js   # ⭐ COM JOINS (LEFT e INNER)
│   │   └── projeto.repository.js
│   ├── routes/
│   │   ├── tarefa.routes.js
│   │   └── projeto.routes.js
│   └── server.js
├── sql/
│   ├── 01-criar-relacionamento-1n.sql    # Migração com ALTER TABLE
│   └── 02-criar-tabelas-do-zero.sql      # Criação from scratch
├── package.json
├── .env.example
└── server-teste.http              # Exemplos de requisições
```

---

## 🎯 Etapas Implementadas

### ETAPA 1: Scripts SQL de Migração

#### 1.1 Criar Tabela `projetos`

```sql
CREATE TABLE IF NOT EXISTS projetos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);
```

#### 1.2 Adicionar `projeto_id` em `tarefas` (Foreign Key)

```sql
ALTER TABLE tarefas
ADD COLUMN IF NOT EXISTS projeto_id INTEGER,
ADD CONSTRAINT fk_tarefas_projetos
FOREIGN KEY (projeto_id) REFERENCES projetos(id)
ON DELETE SET NULL;
```

#### 1.3 Inserir Dados de Exemplo

```sql
INSERT INTO projetos (nome) VALUES
  ('Desenvolvimento Web'),
  ('Estudos de Backend'),
  ('Projeto Pessoal');

INSERT INTO tarefas (descricao, concluido, projeto_id) VALUES
  ('Implementar validação de formulário', false, 1),
  ('Criar página de login', false, 1),
  ('Estudar padrão Repository', true, 2),
  -- ...
```

---

### ETAPA 2: Atualização do Fluxo de Cadastro (POST /tarefas)

#### 2.1 Controller - Extrai `projetoId` do Body

```javascript
// tarefa.controller.js
async criar(request, reply) {
  // request.body agora contém { descricao, projetoId }
  const tarefa = await this.service.criarTarefa(request.body);
  return reply.status(201).send(tarefa);
}
```

#### 2.2 Service - Repassa para o Repository

```javascript
// tarefa.service.js
async criarTarefa(dados) {
  if (!dados.descricao || dados.descricao.trim() === "") {
    throw new AppError("A descrição é obrigatória", 400);
  }

  return await this.repository.salvar({
    descricao: dados.descricao.trim(),
    concluido: dados.concluido || false,
    projetoId: dados.projetoId || null,  // ⭐ Novo parâmetro
  });
}
```

#### 2.3 Repository - INSERT com `projeto_id`

```javascript
// tarefa.repository.js
async salvar(tarefa) {
  const resultado = await client.query(
    `
    INSERT INTO tarefas (descricao, concluido, projeto_id)
    VALUES ($1, $2, $3)
    RETURNING id, descricao, concluido, criada_em, projeto_id
    `,
    [tarefa.descricao, tarefa.concluido || false, tarefa.projetoId || null]
  );

  return resultado.rows[0];
}
```

**Alterações Principais:**

- Convertemos `projetoId` (CamelCase JS) para `projeto_id` (SnakeCase SQL)
- Incluímos `projeto_id` na lista de colunas do INSERT
- Usamos `RETURNING` para devolver a tarefa criada

---

### ETAPA 3: Consultas com JOIN (Listagem e Busca por ID)

#### 3.1 Buscar Todas as Tarefas (LEFT JOIN)

```javascript
// tarefa.repository.js
async buscarTodos() {
  const resultado = await client.query(`
    SELECT
      t.id,
      t.descricao,
      t.concluido,
      t.criada_em,
      t.projeto_id,
      p.nome AS projeto_nome,
      p.criado_em AS projeto_criado_em
    FROM tarefas t
    LEFT JOIN projetos p ON t.projeto_id = p.id
    ORDER BY t.id
  `);

  return resultado.rows;
}
```

**Por que LEFT JOIN?**

- Tarefas **com** projeto retornam os dados do projeto
- Tarefas **sem** projeto (projeto_id = NULL) ainda aparecem na listagem com `projeto_nome = null`

#### 3.2 Buscar Tarefa por ID (LEFT JOIN)

```javascript
// tarefa.repository.js
async buscarPorId(id) {
  const resultado = await client.query(
    `
    SELECT
      t.id,
      t.descricao,
      t.concluido,
      t.criada_em,
      t.projeto_id,
      p.nome AS projeto_nome,
      p.criado_em AS projeto_criado_em
    FROM tarefas t
    LEFT JOIN projetos p ON t.projeto_id = p.id
    WHERE t.id = $1
    `,
    [id]
  );

  return resultado.rows[0] || null;
}
```

---

### ETAPA 4: Novo Filtro por Projeto (Exercício 2)

#### 4.1 Buscar Tarefas de um Projeto (INNER JOIN)

```javascript
// tarefa.repository.js
async buscarPorProjeto(projetoId) {
  const resultado = await client.query(
    `
    SELECT
      t.id,
      t.descricao,
      t.concluido,
      t.criada_em,
      t.projeto_id,
      p.nome AS projeto_nome,
      p.criado_em AS projeto_criado_em
    FROM tarefas t
    INNER JOIN projetos p ON t.projeto_id = p.id
    WHERE t.projeto_id = $1
    ORDER BY t.id
    `,
    [projetoId]
  );

  return resultado.rows;
}
```

**Por que INNER JOIN?**

- Retorna **APENAS** tarefas que têm um projeto vinculado
- Tarefas sem projeto não aparecem (projeto_id = NULL é excluído)

#### 4.2 Rota para Filtro por Projeto

```javascript
// tarefa.routes.js
server.get("/tarefas/projeto/:projetoId", (request, reply) =>
  controller.buscarPorProjeto(request, reply),
);
```

---

## 🚀 Como Usar

### 1. Configurar o Banco de Dados

Crie um arquivo `.env`:

```bash
cp .env.example .env
```

Edite `.env` com suas credenciais PostgreSQL.

### 2. Executar Scripts SQL

Usando `psql`:

```bash
psql -U postgres -h localhost -d dw3_roteiro13 -f sql/01-criar-relacionamento-1n.sql
```

Ou copie e cole os comandos SQL diretamente no DBeaver/pgAdmin.

### 3. Instalar Dependências

```bash
npm install
```

### 4. Iniciar o Servidor

```bash
npm run dev    # Modo desenvolvimento com watch
npm start      # Produção
```

### 5. Testar as Rotas

Use o arquivo `server-teste.http` no VS Code com a extensão **REST Client**, ou use `curl`:

```bash
# Listar todas as tarefas
curl http://localhost:3000/tarefas

# Criar tarefa com projeto
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Nova tarefa","projetoId":1}'

# Listar tarefas de um projeto
curl http://localhost:3000/tarefas/projeto/1
```

---

## 📋 Comparação: LEFT JOIN vs INNER JOIN

| Operação             | JOIN      | Resultado                              |
| -------------------- | --------- | -------------------------------------- |
| `buscarTodos()`      | **LEFT**  | Todas as tarefas, com ou sem projeto   |
| `buscarPorProjeto()` | **INNER** | Apenas tarefas vinculadas a um projeto |

---

## 🔄 Padrão Arquitetural (MVC + Repository)

```
Request
  ↓
Controller     (Recebe HTTP, chama Service)
  ↓
Service        (Lógica de Negócio, validações)
  ↓
Repository     (Executa SQL puro, retorna dados)
  ↓
Database       (PostgreSQL)
  ↓
Response
```

---

## ✅ Checklist de Implementação

- [x] **ETAPA 1**: Scripts SQL de migração (CREATE TABLE, ALTER TABLE, INSERT)
- [x] **ETAPA 2**: Controller, Service, Repository adaptados para `projeto_id`
- [x] **ETAPA 3**: Consultas com LEFT JOIN (buscarTodos, buscarPorId)
- [x] **ETAPA 4**: Rota e método para filtro por projeto (INNER JOIN)
- [x] **Bônus**: CRUD completo para Projetos
- [x] **Bônus**: Arquivo HTTP com exemplos de requisições
- [x] **Bônus**: Documentação detalhada

---

## 🎓 Conceitos Aprendidos

1. **Relacionamento 1:N**: Um projeto tem muitas tarefas
2. **Foreign Key (FK)**: Vinculação entre tabelas via `projeto_id`
3. **LEFT JOIN**: Trazer dados relacionados, permitindo NULLs
4. **INNER JOIN**: Trazer dados relacionados, excluindo NULLs
5. **Padrão Repository**: Abstrair lógica SQL do resto da aplicação
6. **SQL Puro com `pg`**: Usar strings SQL e `pool.query()` sem ORM

---

## 📝 Próximos Passos (Roteiro 14)

- [ ] Criar relacionamento **M:N** (Muitos para Muitos) com tabela de junção
- [ ] Implementar paginação em listagens
- [ ] Adicionar filtros mais avançados (data, ordenação, busca full-text)
- [ ] Validações em cascade (ao deletar projeto, o que fazer com tarefas?)

---

**Desenvolvido como parte do Roteiro 13 - DW-3**
