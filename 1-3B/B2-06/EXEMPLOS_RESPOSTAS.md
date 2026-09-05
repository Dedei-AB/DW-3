# 📋 Exemplos de Respostas JSON - Roteiro 14

## DETALHES DE PROJETO (1:1)

### POST /detalhes-projeto - Criar

**Request:**
```json
{
  "projetoId": 1,
  "descricaoLonga": "Projeto de desenvolvimento web com foco em responsividade",
  "observacoes": "Usar metodologia Agile",
  "prazoFinal": "2024-12-31"
}
```

**Response 201:**
```json
{
  "id": 1,
  "projeto_id": 1,
  "descricao_longa": "Projeto de desenvolvimento web com foco em responsividade",
  "observacoes": "Usar metodologia Agile",
  "prazo_final": "2024-12-31",
  "criado_em": "2024-06-21T10:00:00.000Z"
}
```

---

### GET /detalhes-projeto/:projetoId - Buscar (1:1)

**Request:**
```
GET /detalhes-projeto/1
```

**Response 200:**
```json
{
  "id": 1,
  "projeto_id": 1,
  "descricao_longa": "Projeto de desenvolvimento web...",
  "observacoes": "Usar metodologia Agile",
  "prazo_final": "2024-12-31",
  "criado_em": "2024-06-21T10:00:00.000Z"
}
```

**Response 404 (sem detalhe):**
```json
{
  "status": "error",
  "message": "Detalhe do projeto não encontrado"
}
```

---

### GET /detalhes-projeto - Listar Todos

**Response 200:**
```json
[
  {
    "id": 1,
    "projeto_id": 1,
    "descricao_longa": "Projeto de desenvolvimento web...",
    "observacoes": "Usar metodologia Agile",
    "prazo_final": "2024-12-31",
    "criado_em": "2024-06-21T10:00:00.000Z",
    "projeto_nome": "Desenvolvimento Web"
  },
  {
    "id": 2,
    "projeto_id": 2,
    "descricao_longa": "Estudo aprofundado de padrões...",
    "observacoes": "Foco em Clean Code",
    "prazo_final": "2024-11-15",
    "criado_em": "2024-06-21T10:05:00.000Z",
    "projeto_nome": "Estudos de Backend"
  }
]
```

---

## TAGS (N:N)

### GET /tags - Listar Todas

**Response 200:**
```json
[
  {
    "id": 1,
    "nome": "backend",
    "criada_em": "2024-06-21T10:00:00.000Z"
  },
  {
    "id": 2,
    "nome": "frontend",
    "criada_em": "2024-06-21T10:01:00.000Z"
  },
  {
    "id": 3,
    "nome": "database",
    "criada_em": "2024-06-21T10:02:00.000Z"
  },
  {
    "id": 4,
    "nome": "urgente",
    "criada_em": "2024-06-21T10:03:00.000Z"
  }
]
```

---

### POST /tags - Criar

**Request:**
```json
{
  "nome": "urgente"
}
```

**Response 201:**
```json
{
  "id": 4,
  "nome": "urgente",
  "criada_em": "2024-06-21T10:03:00.000Z"
}
```

---

## ⭐ TAREFAS COM TAGS (Principal - ETAPA 3)

### GET /tarefas/:id - Buscar Tarefa COM Tags

**Request:**
```
GET /tarefas/1
```

**Response 200 (com tags):**
```json
{
  "id": 1,
  "descricao": "Implementar validação de formulário",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 1,
  "projeto_nome": "Desenvolvimento Web",
  "projeto_criado_em": "2024-06-21T09:50:00.000Z",
  "tags": [
    {
      "id": 2,
      "nome": "frontend"
    },
    {
      "id": 4,
      "nome": "urgente"
    }
  ]
}
```

**Response 200 (sem tags):**
```json
{
  "id": 6,
  "descricao": "Tarefa sem tags",
  "concluido": false,
  "criada_em": "2024-06-21T10:20:00.000Z",
  "projeto_id": null,
  "projeto_nome": null,
  "projeto_criado_em": null,
  "tags": []
}
```

---

### GET /tarefas - Listar Todas

**Response 200:**
```json
[
  {
    "id": 1,
    "descricao": "Implementar validação de formulário",
    "concluido": false,
    "criada_em": "2024-06-21T10:00:00.000Z",
    "projeto_id": 1,
    "projeto_nome": "Desenvolvimento Web",
    "projeto_criado_em": "2024-06-21T09:50:00.000Z"
  },
  {
    "id": 2,
    "descricao": "Criar página de login",
    "concluido": false,
    "criada_em": "2024-06-21T10:05:00.000Z",
    "projeto_id": 1,
    "projeto_nome": "Desenvolvimento Web",
    "projeto_criado_em": "2024-06-21T09:50:00.000Z"
  }
]
```

---

## OPERAÇÕES N:N

### GET /tarefas/:tarefaId/tags - Listar Tags de Uma Tarefa

**Request:**
```
GET /tarefas/1/tags
```

**Response 200:**
```json
[
  {
    "id": 2,
    "nome": "frontend",
    "criada_em": "2024-06-21T10:01:00.000Z"
  },
  {
    "id": 4,
    "nome": "urgente",
    "criada_em": "2024-06-21T10:03:00.000Z"
  }
]
```

---

### POST /tarefas/:tarefaId/tags - Associar Tag

**Request:**
```json
{
  "tagId": 1
}
```

**Response 201:**
```json
{
  "sucesso": true
}
```

---

### DELETE /tarefas/:tarefaId/tags/:tagId - Desassociar Tag

**Request:**
```
DELETE /tarefas/1/tags/4
```

**Response 200:**
```json
{
  "sucesso": true
}
```

---

## QUERIES ESPECIAIS

### GET /tags/tarefas/multiplas?minTags=2 - Tarefas com N Tags

**Request:**
```
GET /tags/tarefas/multiplas?minTags=2
```

**Response 200:**
```json
[
  {
    "id": 1,
    "descricao": "Implementar validação de formulário",
    "concluido": false,
    "quantidade_tags": 2,
    "tags_associadas": "frontend, urgente"
  },
  {
    "id": 2,
    "descricao": "Criar página de login",
    "concluido": false,
    "quantidade_tags": 2,
    "tags_associadas": "backend, importante"
  },
  {
    "id": 3,
    "descricao": "Estudar padrão Repository",
    "concluido": true,
    "quantidade_tags": 2,
    "tags_associadas": "backend, database"
  }
]
```

**Request (com minTags=1):**
```
GET /tags/tarefas/multiplas?minTags=1
```

**Response 200 (inclui todas as com >= 1 tag):**
```json
[
  { "id": 1, "quantidade_tags": 2, "tags_associadas": "frontend, urgente" },
  { "id": 2, "quantidade_tags": 2, "tags_associadas": "backend, importante" },
  { "id": 3, "quantidade_tags": 2, "tags_associadas": "backend, database" },
  { "id": 4, "quantidade_tags": 1, "tags_associadas": "backend" }
]
```

---

## ERROS

### 400 - Bad Request

**Detalhe já existe:**
```json
{
  "status": "error",
  "message": "Este projeto já possui um detalhe associado"
}
```

**Projeto não encontrado ao criar detalhe:**
```json
{
  "status": "error",
  "message": "O projetoId é obrigatório"
}
```

**Tag duplicada:**
```json
{
  "status": "error",
  "message": "Uma tag com este nome já existe"
}
```

---

### 404 - Not Found

**Tag não existe:**
```json
{
  "status": "error",
  "message": "Tag não encontrada"
}
```

**Detalhe não existe:**
```json
{
  "status": "error",
  "message": "Detalhe do projeto não encontrado"
}
```

**Tarefa não existe:**
```json
{
  "status": "error",
  "message": "Tarefa não encontrada"
}
```

---

### 500 - Internal Server Error

**Chave estrangeira inválida (tag não existe):**
```json
{
  "status": "error",
  "message": "Internal Server Error"
}
```

---

## 📊 Estrutura Resumida

```
DETALHE PROJETO (1:1)
├─ id
├─ projeto_id (FK, UNIQUE)
├─ descricao_longa
├─ observacoes
├─ prazo_final
└─ criado_em

TAG (N:N)
├─ id
├─ nome (UNIQUE)
└─ criada_em

TAREFA (com array de tags)
├─ id
├─ descricao
├─ concluido
├─ criada_em
├─ projeto_id
├─ projeto_nome
└─ tags[] ← NEW!
   ├─ [0]
   │  ├─ id
   │  └─ nome
   └─ [1]
      ├─ id
      └─ nome
```

