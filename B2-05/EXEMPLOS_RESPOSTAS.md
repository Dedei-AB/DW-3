# 📤 Exemplos de Respostas JSON

## PROJETOS

### GET /projetos - Listar Todos

**Resposta 200:**

```json
[
  {
    "id": 1,
    "nome": "Desenvolvimento Web",
    "criado_em": "2024-06-21T09:50:00.000Z"
  },
  {
    "id": 2,
    "nome": "Estudos de Backend",
    "criado_em": "2024-06-21T09:55:00.000Z"
  },
  {
    "id": 3,
    "nome": "Projeto Pessoal",
    "criado_em": "2024-06-21T10:00:00.000Z"
  }
]
```

---

### POST /projetos - Criar Novo Projeto

**Request:**

```json
{
  "nome": "Novo Projeto"
}
```

**Resposta 201:**

```json
{
  "id": 4,
  "nome": "Novo Projeto",
  "criado_em": "2024-06-21T10:15:00.000Z"
}
```

**Resposta 400 (Erro - nome vazio):**

```json
{
  "status": "error",
  "message": "O nome do projeto é obrigatório"
}
```

---

### GET /projetos/:id - Buscar Projeto por ID

**Request:**

```
GET /projetos/1
```

**Resposta 200:**

```json
{
  "id": 1,
  "nome": "Desenvolvimento Web",
  "criado_em": "2024-06-21T09:50:00.000Z"
}
```

**Resposta 404 (Não encontrado):**

```json
{
  "status": "error",
  "message": "Projeto não encontrado"
}
```

---

### PATCH /projetos/:id - Atualizar Projeto

**Request:**

```json
{
  "nome": "Desenvolvimento Web Avançado"
}
```

**Resposta 200:**

```json
{
  "id": 1,
  "nome": "Desenvolvimento Web Avançado",
  "criado_em": "2024-06-21T09:50:00.000Z"
}
```

---

### DELETE /projetos/:id - Remover Projeto

**Request:**

```
DELETE /projetos/4
```

**Resposta 204:** (Sem conteúdo - sucesso)

---

## TAREFAS

### GET /tarefas - Listar Todas (com JOIN)

**Resposta 200:**

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
  },
  {
    "id": 3,
    "descricao": "Estudar padrão Repository",
    "concluido": true,
    "criada_em": "2024-06-21T10:10:00.000Z",
    "projeto_id": 2,
    "projeto_nome": "Estudos de Backend",
    "projeto_criado_em": "2024-06-21T09:55:00.000Z"
  },
  {
    "id": 6,
    "descricao": "Tarefa sem projeto",
    "concluido": false,
    "criada_em": "2024-06-21T10:20:00.000Z",
    "projeto_id": null,
    "projeto_nome": null,
    "projeto_criado_em": null
  }
]
```

**Nota:** A tarefa 6 aparece com `projeto_nome: null` porque usa **LEFT JOIN**.

---

### POST /tarefas - Criar Tarefa

**Request (Sem projeto):**

```json
{
  "descricao": "Tarefa inicial"
}
```

**Resposta 201:**

```json
{
  "id": 7,
  "descricao": "Tarefa inicial",
  "concluido": false,
  "criada_em": "2024-06-21T10:30:00.000Z",
  "projeto_id": null
}
```

---

**Request (Com projeto):**

```json
{
  "descricao": "Estudar PostgreSQL",
  "projetoId": 2,
  "concluido": false
}
```

**Resposta 201:**

```json
{
  "id": 8,
  "descricao": "Estudar PostgreSQL",
  "concluido": false,
  "criada_em": "2024-06-21T10:35:00.000Z",
  "projeto_id": 2
}
```

**Resposta 400 (Erro - descrição vazia):**

```json
{
  "status": "error",
  "message": "A descrição é obrigatória"
}
```

**Resposta 500 (Erro - FK inválida):**

```json
{
  "status": "error",
  "message": "Internal Server Error"
}
```

(O projeto_id 999 não existe, violou a FK constraint)

---

### GET /tarefas/:id - Buscar Tarefa por ID

**Request:**

```
GET /tarefas/1
```

**Resposta 200:**

```json
{
  "id": 1,
  "descricao": "Implementar validação de formulário",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 1,
  "projeto_nome": "Desenvolvimento Web",
  "projeto_criado_em": "2024-06-21T09:50:00.000Z"
}
```

**Resposta 404:**

```json
{
  "status": "error",
  "message": "Tarefa não encontrada"
}
```

---

### PATCH /tarefas/:id - Atualizar Tarefa

**Request (Atualizar descrição):**

```json
{
  "descricao": "Implementar validação completa de formulário"
}
```

**Resposta 200:**

```json
{
  "id": 1,
  "descricao": "Implementar validação completa de formulário",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 1
}
```

---

**Request (Marcar como concluída):**

```json
{
  "concluido": true
}
```

**Resposta 200:**

```json
{
  "id": 1,
  "descricao": "Implementar validação de formulário",
  "concluido": true,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 1
}
```

---

**Request (Trocar de projeto):**

```json
{
  "projetoId": 3
}
```

**Resposta 200:**

```json
{
  "id": 1,
  "descricao": "Implementar validação de formulário",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": 3
}
```

---

**Request (Remover de um projeto):**

```json
{
  "projetoId": null
}
```

**Resposta 200:**

```json
{
  "id": 1,
  "descricao": "Implementar validação de formulário",
  "concluido": false,
  "criada_em": "2024-06-21T10:00:00.000Z",
  "projeto_id": null
}
```

---

### DELETE /tarefas/:id - Remover Tarefa

**Request:**

```
DELETE /tarefas/7
```

**Resposta 204:** (Sem conteúdo - sucesso)

---

## FILTRO POR PROJETO

### GET /tarefas/projeto/:projetoId - Listar Tarefas de um Projeto

**Request:**

```
GET /tarefas/projeto/1
```

**Resposta 200:**

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

**Nota:** Usa **INNER JOIN**, então tarefas sem projeto NÃO aparecem.

---

**Request (Projeto 2):**

```
GET /tarefas/projeto/2
```

**Resposta 200:**

```json
[
  {
    "id": 3,
    "descricao": "Estudar padrão Repository",
    "concluido": true,
    "criada_em": "2024-06-21T10:10:00.000Z",
    "projeto_id": 2,
    "projeto_nome": "Estudos de Backend",
    "projeto_criado_em": "2024-06-21T09:55:00.000Z"
  },
  {
    "id": 4,
    "descricao": "Implementar autenticação JWT",
    "concluido": false,
    "criada_em": "2024-06-21T10:15:00.000Z",
    "projeto_id": 2,
    "projeto_nome": "Estudos de Backend",
    "projeto_criado_em": "2024-06-21T09:55:00.000Z"
  }
]
```

---

**Request (Projeto sem tarefas):**

```
GET /tarefas/projeto/3
```

**Resposta 200:**

```json
[]
```

(Array vazio - nenhuma tarefa neste projeto)

---

## DIFERENÇAS IMPORTANTES

### LEFT JOIN (GET /tarefas)

```json
[
  // ✅ Tarefa COM projeto
  { "id": 1, "projeto_id": 1, "projeto_nome": "Desenvolvimento Web" },

  // ✅ Tarefa SEM projeto (ainda aparece!)
  { "id": 6, "projeto_id": null, "projeto_nome": null }
]
```

### INNER JOIN (GET /tarefas/projeto/1)

```json
[
  // ✅ Tarefa COM projeto
  { "id": 1, "projeto_id": 1, "projeto_nome": "Desenvolvimento Web" }

  // ❌ Tarefa SEM projeto NÃO aparece
]
```

---

## CÓDIGOS HTTP

| Código | Significado           | Quando Ocorre               |
| ------ | --------------------- | --------------------------- |
| `200`  | OK                    | GET, PATCH bem-sucedidos    |
| `201`  | Created               | POST bem-sucedido           |
| `204`  | No Content            | DELETE bem-sucedido         |
| `400`  | Bad Request           | Validação falhou            |
| `404`  | Not Found             | Recurso não existe          |
| `500`  | Internal Server Error | Erro inesperado no servidor |
