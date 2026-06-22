# Roteiro 14 - Modelando Relacionamentos 1:1 e N:N no Backend

## 📚 Visão Geral

Este projeto implementa o **Roteiro 14**, expandindo a aplicação do **Roteiro 13** (B2-05) com dois novos tipos de relacionamentos:

1. **Relacionamento 1:1 (One-to-One)**: Projetos ↔ Detalhes de Projeto
2. **Relacionamento N:N (Many-to-Many)**: Tarefas ↔ Tags

### Arquitetura
```
Projetos (1) ──────1──── Detalhes de Projeto
     │
     N
     │
  Tarefas ──────N──── Tags (através de tarefas_tags)
```

---

## 🗂️ Estrutura do Projeto

```
B2-06/
├── src/
│   ├── database/
│   │   └── client.js
│   ├── errors/
│   │   └── AppError.js
│   ├── controllers/
│   │   ├── projeto.controller.js
│   │   ├── tarefa.controller.js
│   │   ├── detalhe-projeto.controller.js
│   │   └── tag.controller.js
│   ├── services/
│   │   ├── projeto.service.js
│   │   ├── tarefa.service.js
│   │   ├── detalhe-projeto.service.js
│   │   └── tag.service.js
│   ├── repositories/
│   │   ├── projeto.repository.js
│   │   ├── tarefa.repository.js
│   │   ├── detalhe-projeto.repository.js  ⭐ NOVO (1:1)
│   │   └── tag.repository.js               ⭐ NOVO (N:N)
│   ├── routes/
│   │   ├── projeto.routes.js
│   │   ├── tarefa.routes.js
│   │   ├── detalhe-projeto.routes.js      ⭐ NOVO
│   │   └── tag.routes.js                  ⭐ NOVO
│   └── server.js
├── sql/
│   ├── 01-criar-relacionamentos-1n-e-nn.sql
│   └── 02-queries-teste-etapa-2.sql
├── package.json
├── .env.example
└── server-teste.http
```

---

## 🎯 3 Etapas Implementadas

### ✅ ETAPA 1: Scripts SQL

#### 1:1 - Detalhes do Projeto
```sql
CREATE TABLE detalhes_projeto (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER NOT NULL UNIQUE,  -- UNIQUE garante 1:1
  descricao_longa TEXT,
  observacoes TEXT,
  prazo_final DATE,
  criado_em TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);
```

**Características:**
- `UNIQUE` em `projeto_id` garante que cada projeto tenha no máximo 1 detalhe
- `ON DELETE CASCADE` remove detalhes quando projeto é deletado

#### N:N - Tags e Tarefas_Tags
```sql
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  criada_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE tarefas_tags (
  tarefa_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (tarefa_id, tag_id),  -- Chave composta
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
```

**Características:**
- Tabela associativa (tabela de junção)
- Chave primária composta permite múltiplas tags por tarefa
- Cascata em ambas as direções

---

### ✅ ETAPA 2: Queries de Teste

#### Query 1: Projetos SEM detalhes (LEFT JOIN Anti-join)
```sql
SELECT p.* FROM projetos p
LEFT JOIN detalhes_projeto dp ON p.id = dp.projeto_id
WHERE dp.id IS NULL;
```

#### Query 2: Todos os projetos COM detalhes (LEFT JOIN)
```sql
SELECT p.*, dp.*
FROM projetos p
LEFT JOIN detalhes_projeto dp ON p.id = dp.projeto_id;
```

#### Query 3: Tarefas COM tags (INNER JOIN 3 tabelas)
```sql
SELECT t.descricao, tg.nome
FROM tarefas t
INNER JOIN tarefas_tags tt ON t.id = tt.tarefa_id
INNER JOIN tags tg ON tt.tag_id = tg.id;
```

#### Query 4: Tarefas COM MÚLTIPLAS tags (GROUP BY + HAVING)
```sql
SELECT t.id, t.descricao, COUNT(tg.id) as quantidade_tags,
       STRING_AGG(tg.nome, ', ') as tags
FROM tarefas t
INNER JOIN tarefas_tags tt ON t.id = tt.tarefa_id
INNER JOIN tags tg ON tt.tag_id = tg.id
GROUP BY t.id
HAVING COUNT(tg.id) > 1;
```

---

### ✅ ETAPA 3: Implementação no Backend

#### Modificação Principal: TarefaRepository.buscarPorId()

**Antes (B2-05):**
```javascript
async buscarPorId(id) {
  const resultado = await client.query(`
    SELECT t.*, p.nome
    FROM tarefas t
    LEFT JOIN projetos p ON t.projeto_id = p.id
    WHERE t.id = $1
  `, [id]);
  return resultado.rows[0];
}
```

**Depois (B2-06) - COM TAGS:**
```javascript
async buscarPorId(id) {
  const resultado = await client.query(`
    SELECT
      t.id, t.descricao, t.concluido, t.criada_em, t.projeto_id,
      p.nome AS projeto_nome,
      JSON_AGG(
        JSON_BUILD_OBJECT('id', tg.id, 'nome', tg.nome)
        ORDER BY tg.nome
      ) FILTER (WHERE tg.id IS NOT NULL) AS tags_json
    FROM tarefas t
    LEFT JOIN projetos p ON t.projeto_id = p.id
    LEFT JOIN tarefas_tags tt ON t.id = tt.tarefa_id
    LEFT JOIN tags tg ON tt.tag_id = tg.id
    WHERE t.id = $1
    GROUP BY t.id, p.id
  `, [id]);
  
  return {
    ...resultado.rows[0],
    tags: resultado.rows[0].tags_json || []
  };
}
```

**Mapeamento de CamelCase:**
- JS: `projetoId`, `tarefaId`, `tagId`, `descricaoLonga`
- SQL: `projeto_id`, `tarefa_id`, `tag_id`, `descricao_longa`

---

## 📡 Endpoints Disponíveis

### Projetos (5)
```
GET    /projetos              Listar todos
POST   /projetos              Criar novo
GET    /projetos/:id          Buscar por ID
PATCH  /projetos/:id          Atualizar
DELETE /projetos/:id          Deletar
```

### Detalhes de Projeto (5) - **NOVO**
```
GET    /detalhes-projeto      Listar todos
GET    /detalhes-projeto/:projetoId  Buscar (1:1)
POST   /detalhes-projeto      Criar
PATCH  /detalhes-projeto/:projetoId  Atualizar
DELETE /detalhes-projeto/:projetoId  Deletar
```

### Tarefas (6)
```
GET    /tarefas               Listar todas
GET    /tarefas/:id           Buscar por ID ⭐ COM TAGS
GET    /tarefas/projeto/:id   Listar por projeto
POST   /tarefas               Criar nova
PATCH  /tarefas/:id           Atualizar
DELETE /tarefas/:id           Deletar
```

### Tags (5) - **NOVO**
```
GET    /tags                  Listar todas
GET    /tags/:id              Buscar por ID
POST   /tags                  Criar nova
PATCH  /tags/:id              Atualizar
DELETE /tags/:id              Deletar
```

### Relação N:N (4) - **NOVO**
```
GET    /tarefas/:tarefaId/tags              Listar tags de uma tarefa
POST   /tarefas/:tarefaId/tags              Associar tag a tarefa
DELETE /tarefas/:tarefaId/tags/:tagId       Desassociar tag
GET    /tags/tarefas/multiplas?minTags=2    Tarefas com N tags
```

**Total: 25+ endpoints**

---

## 🔑 Conceitos Implementados

| Conceito | Local | Descrição |
|----------|-------|-----------|
| **Relacionamento 1:1** | `detalhes_projeto` | UNIQUE em FK |
| **Relacionamento N:N** | `tarefas_tags` | Tabela associativa |
| **Chave Primária Composta** | `tarefas_tags` | PK de dois FKs |
| **LEFT JOIN** | `tarefa.repository.js` | Inclui NULLs |
| **INNER JOIN** | `tag.repository.js` | Exclui NULLs |
| **JSON_AGG** | `tarefa.repository.js` | Agrega dados em array JSON |
| **GROUP BY + HAVING** | `tag.repository.js` | Filtro em agregação |
| **STRING_AGG** | SQL queries | Concatena strings com separador |
| **ON DELETE CASCADE** | Schema | Cascata automática |

---

## 🚀 Como Começar

### 1. Setup
```bash
cd B2-06
cp .env.example .env
# Edite .env com suas credenciais
```

### 2. Criar Banco de Dados
```bash
# Criar banco
psql -U postgres -c "CREATE DATABASE dw3_roteiro14;"

# Executar migrations (a partir de B2-05!)
# Primeiro execute os scripts de B2-05:
psql -U postgres -d dw3_roteiro14 -f ../B2-05/sql/01-criar-relacionamento-1n.sql

# Depois execute os novos scripts de B2-06:
psql -U postgres -d dw3_roteiro14 -f sql/01-criar-relacionamentos-1n-e-nn.sql
psql -U postgres -d dw3_roteiro14 -f sql/02-queries-teste-etapa-2.sql
```

### 3. Instalar e Rodar
```bash
npm install
npm run dev
```

### 4. Testar
Use o arquivo `server-teste.http` ou curl:
```bash
curl http://localhost:3000/tarefas/1  # Mostra tags!
```

---

## 📋 Exemplo de Resposta (Tarefa com Tags)

```json
{
  "id": 1,
  "descricao": "Implementar validação de formulário",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 1,
  "projeto_nome": "Desenvolvimento Web",
  "tags": [
    { "id": 2, "nome": "frontend" },
    { "id": 4, "nome": "urgente" }
  ]
}
```

---

## 📊 Comparação: Roteiro 13 vs Roteiro 14

| Aspecto | R13 | R14 |
|---------|-----|-----|
| Tabelas | 2 | 4 |
| Relacionamentos | 1:N | 1:N + 1:1 + N:N |
| Repositories | 2 | 4 |
| Services | 2 | 4 |
| Controllers | 2 | 4 |
| Routes | 2 | 4 |
| Endpoints | 11 | 25+ |

---

## 🎓 O Que Você Aprendeu

- ✅ Relacionamento 1:1 com UNIQUE em FK
- ✅ Relacionamento N:N com tabela associativa
- ✅ Chave primária composta
- ✅ JSON_AGG para agregação
- ✅ GROUP BY + HAVING para filtros em agregação
- ✅ Cascata com ON DELETE CASCADE
- ✅ String_agg para concatenação SQL
- ✅ Anti-join com LEFT JOIN + WHERE IS NULL

---

## 🔄 Próximos Passos (Roteiro 15+)

- [ ] Softdelete (deletar sem remover fisicamente)
- [ ] Auditoria (log de alterações)
- [ ] Permissões e autorização
- [ ] Paginação com LIMIT/OFFSET
- [ ] Cache com Redis
- [ ] Testes automatizados

---

**Roteiro 14 Completo! 🎉**

