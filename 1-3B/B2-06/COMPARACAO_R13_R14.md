# 📊 Comparação: Roteiro 13 vs Roteiro 14

## Evolução da Arquitetura

### Roteiro 13 (B2-05)
```
Projetos (1)
    │
    N
    │
Tarefas
```

**Apenas 1:N**

---

### Roteiro 14 (B2-06)
```
Projetos (1) ─── 1 ──── Detalhes
    │
    N
    │
Tarefas ─── N ──── Tags
            via tarefas_tags
```

**1:N + 1:1 + N:N**

---

## Tabelas

| Roteiro | Tabelas | Novas em R14 |
|---------|---------|------------|
| R13 | `projetos`, `tarefas` | - |
| R14 | `projetos`, `tarefas`, `detalhes_projeto`, `tags`, `tarefas_tags` | 3 tabelas |

---

## Relacionamentos

| Tipo | R13 | R14 |
|------|-----|-----|
| 1:N (Projetos → Tarefas) | ✅ | ✅ |
| 1:1 (Projetos → Detalhes) | ❌ | ✅ **NOVO** |
| N:N (Tarefas ↔ Tags) | ❌ | ✅ **NOVO** |

---

## Repositories

### R13
```
TarefaRepository
├─ buscarTodos()
├─ buscarPorId(id)
├─ buscarPorProjeto(projetoId)
├─ salvar(tarefa)
├─ atualizar(id, dados)
└─ remover(id)

ProjetoRepository
├─ buscarTodos()
├─ buscarPorId(id)
├─ salvar(projeto)
├─ atualizar(id, dados)
└─ remover(id)
```

### R14 (Adicionados)
```
DetalheProjetoRepository ⭐
├─ buscarTodos()
├─ buscarPorProjetoId(projetoId)  # 1:1
├─ salvar(detalhe)
├─ atualizar(projetoId, dados)
└─ remover(projetoId)

TagRepository ⭐
├─ buscarTodos()
├─ buscarPorId(id)
├─ buscarPorNome(nome)
├─ salvar(tag)
├─ atualizar(id, dados)
├─ remover(id)
├─ buscarTagsPorTarefaId(tarefaId)  # N:N
├─ associarTarefa(tarefaId, tagId)  # N:N INSERT
├─ desassociarTarefa(tarefaId, tagId)  # N:N DELETE
├─ removerTodasTagsTarefa(tarefaId)
├─ buscarTagsComContagem()
└─ buscarTarefasComMultiplasTags(minTags)  # GROUP BY + HAVING
```

### Modificações em TarefaRepository
```diff
  async buscarPorId(id) {
+   // Agora retorna com TAGS agregadas
+   // Usa JSON_AGG para mapear tags
+   return {
+     ...tarefa,
+     tags: tagsAgregadas
+   }
  }
```

---

## SQL Queries Adicionadas

### R13
- SELECT simples com 1 LEFT JOIN (tarefas + projetos)
- INSERT tarefa com projeto_id
- UPDATE tarefa (com projeto_id)

### R14 (Novas)
- SELECT com 3 LEFT JOINs (tarefas + projetos + tags)
- JSON_AGG para agregar tags em array
- GROUP BY + HAVING para filtros em agregação
- UNIQUE em FK para garantir 1:1
- Chave primária composta em tabela associativa
- ON DELETE CASCADE

---

## Endpoints

### R13 (11 total)
```
Projetos: 5 endpoints
Tarefas: 6 endpoints
```

### R14 (25+ total)
```
Projetos: 5 endpoints (mantidos)
Tarefas: 6 endpoints (modificado: GET /:id mostra tags)
Detalhes de Projeto: 5 endpoints ⭐ NOVO
Tags: 5 endpoints ⭐ NOVO
N:N Operations: 4 endpoints ⭐ NOVO
Queries Especiais: 1 endpoint ⭐ NOVO
```

---

## Padrões SQL

### R13
```sql
-- LEFT JOIN (2 tabelas)
SELECT t.*, p.nome
FROM tarefas t
LEFT JOIN projetos p ON t.projeto_id = p.id

-- INSERT simples
INSERT INTO tarefas (descricao, projeto_id) VALUES (...)

-- UPDATE simples
UPDATE tarefas SET descricao = ... WHERE id = ...
```

### R14 (Adicionados)
```sql
-- LEFT JOIN com JSON_AGG (agregação)
SELECT t.*, JSON_AGG(JSON_BUILD_OBJECT(...)) AS tags
FROM tarefas t
LEFT JOIN tags ON ...
GROUP BY t.id

-- INNER JOIN 3 tabelas (N:N)
SELECT t.*, tg.nome
FROM tarefas t
INNER JOIN tarefas_tags tt ON ...
INNER JOIN tags tg ON ...

-- GROUP BY + HAVING (filtro em agregação)
GROUP BY t.id
HAVING COUNT(tg.id) > 1

-- Chave composta
PRIMARY KEY (tarefa_id, tag_id)

-- UNIQUE em FK (garante 1:1)
ALTER TABLE detalhes_projeto
ADD CONSTRAINT UNIQUE (projeto_id)
```

---

## Tipos de Dados de Resposta

### R13 - GET /tarefas/:id
```json
{
  "id": 1,
  "descricao": "...",
  "projeto_id": 1,
  "projeto_nome": "..."
}
```

### R14 - GET /tarefas/:id
```json
{
  "id": 1,
  "descricao": "...",
  "projeto_id": 1,
  "projeto_nome": "...",
  "tags": [              ⭐ NOVO
    { "id": 1, "nome": "..." }
  ]
}
```

---

## Conversão CamelCase ↔ SnakeCase

### R13
```javascript
// JS
projetoId → SQL → projeto_id

// R13 só tinha isso
```

### R14 (Mais casos)
```javascript
// JS → SQL conversão
projetoId → projeto_id
tarefaId → tarefa_id
tagId → tag_id
descricaoLonga → descricao_longa
prazoFinal → prazo_final
```

---

## Validações

### R13
- Descrição obrigatória em tarefas
- Nome obrigatório em projetos

### R14 (Adicionadas)
- Um projeto tem no máximo 1 detalhe (UNIQUE)
- Nome de tag deve ser único
- Não pode associar tag que não existe
- projetoId obrigatório ao criar detalhe
- Nome obrigatório em tags

---

## Cascata de Deleção

### R13
```sql
projeto_id INTEGER FK
  ON DELETE SET NULL
-- Tarefa não é deletada, apenas perde projeto
```

### R14 (Adicionadas)
```sql
-- Detalhe
projeto_id INTEGER FK
  ON DELETE CASCADE
-- Detalhe é deletado junto com projeto

-- Tarefas_Tags
tarefa_id FK ON DELETE CASCADE
tag_id FK ON DELETE CASCADE
-- Associação é deletada se tarefa ou tag for deletada
```

---

## Complexidade SQL

| Operação | R13 | R14 |
|----------|-----|-----|
| SELECT simples | ⭐ | ⭐⭐ |
| JOINs | 2 tabelas | 3-4 tabelas |
| Agregação | Não | Sim (JSON_AGG, COUNT) |
| GROUP BY | Não | Sim (com HAVING) |
| Composição PK | Não | Sim (tarefas_tags) |

---

## Performance

### R13
- Sem agregação → queries rápidas
- Poucas JOINs

### R14
- JSON_AGG pode ser mais lenta com muitas tags
- GROUP BY requer índices em 3+ tabelas
- Alternativa: 2 queries em vez de 1 (sem JSON_AGG)

**Otimização implementada:**
```javascript
// Opção 1: 1 query com JSON_AGG (complexa)
async buscarPorId(id) { ... }

// Opção 2: 2 queries simples (rápido)
async buscarPorIdAlt(id) { ... }
```

---

## Arquivo Mudança

### SQL Scripts
```
B2-05/sql/ → sql/01-criar-relacionamento-1n.sql
B2-06/sql/ → sql/01-criar-relacionamentos-1n-e-nn.sql
         → sql/02-queries-teste-etapa-2.sql
```

### Repositories
```
B2-05:
  - TarefaRepository (1 query com LEFT JOIN)
  - ProjetoRepository

B2-06:
  - TarefaRepository (MODIFICADO com JSON_AGG) ⭐
  - ProjetoRepository (mantido)
  - DetalheProjetoRepository ⭐ NOVO
  - TagRepository ⭐ NOVO
```

---

## Takeaways

### R13 ensinou:
- ✅ 1:N com FK
- ✅ LEFT JOIN

### R14 adiciona:
- ✅ 1:1 com UNIQUE
- ✅ N:N com tabela associativa
- ✅ JSON_AGG para agregação
- ✅ GROUP BY + HAVING
- ✅ Chave primária composta
- ✅ Queries mais complexas

---

