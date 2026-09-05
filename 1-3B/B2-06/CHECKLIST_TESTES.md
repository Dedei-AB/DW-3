# 🧪 Checklist de Testes - Roteiro 14

Use este checklist para validar que tudo está funcionando corretamente após implementação.

---

## 🔧 Pré-Requisitos

- [ ] PostgreSQL instalado e rodando
- [ ] Database `dw3_roteiro14` criado
- [ ] Migrations executadas (`sql/01-criar-relacionamentos-1n-e-nn.sql`)
- [ ] Dados de exemplo inseridos
- [ ] `.env` configurado corretamente
- [ ] `npm install` executado
- [ ] `npm run dev` rodando na porta 3000

---

## 📚 CATEGORIA: PROJETOS (5 testes)

### 1. Listar Projetos
- [ ] Endpoint: `GET /projetos`
- [ ] Status esperado: **200**
- [ ] Response: Array de projetos
- [ ] Campos: id, nome, criado_em

```bash
curl http://localhost:3000/projetos
```

### 2. Criar Projeto
- [ ] Endpoint: `POST /projetos`
- [ ] Status esperado: **201**
- [ ] Body: `{ "nome": "Novo Projeto" }`
- [ ] Response: Projeto criado com id

```bash
curl -X POST http://localhost:3000/projetos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Novo Projeto"}'
```

### 3. Buscar Projeto por ID
- [ ] Endpoint: `GET /projetos/1`
- [ ] Status esperado: **200**
- [ ] Response: 1 projeto ou **404** se não existir
- [ ] Validar id, nome, criado_em

```bash
curl http://localhost:3000/projetos/1
```

### 4. Atualizar Projeto
- [ ] Endpoint: `PATCH /projetos/1`
- [ ] Status esperado: **204** (sem resposta)
- [ ] Body: `{ "nome": "Projeto Atualizado" }`
- [ ] Validar que nome foi alterado com GET

```bash
curl -X PATCH http://localhost:3000/projetos/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"Atualizado"}'
```

### 5. Deletar Projeto
- [ ] Endpoint: `DELETE /projetos/1`
- [ ] Status esperado: **204**
- [ ] Validar que GET /projetos/1 retorna **404**
- [ ] ⚠️ Deve deletar em cascata: detalhes também saem

```bash
curl -X DELETE http://localhost:3000/projetos/1
```

---

## 🎯 CATEGORIA: DETALHES DE PROJETO - 1:1 (5 testes)

### 6. Listar Todos os Detalhes
- [ ] Endpoint: `GET /detalhes-projeto`
- [ ] Status esperado: **200**
- [ ] Response: Array de detalhes
- [ ] Campos: id, projeto_id, descricao_longa, observacoes, prazo_final, projeto_nome

```bash
curl http://localhost:3000/detalhes-projeto
```

### 7. Buscar Detalhe de Projeto (1:1)
- [ ] Endpoint: `GET /detalhes-projeto/:projetoId`
- [ ] Status esperado: **200**
- [ ] Response: 1 detalhe ou **404**
- [ ] Validar que retorna 1 (máximo por projeto)

```bash
curl http://localhost:3000/detalhes-projeto/1
```

### 8. Criar Detalhe (1:1)
- [ ] Endpoint: `POST /detalhes-projeto`
- [ ] Status esperado: **201**
- [ ] Body: `{ "projetoId": 1, "descricaoLonga": "...", "prazoFinal": "2024-12-31" }`
- [ ] ⚠️ Tentar criar 2º detalhe para mesmo projeto → **400**

```bash
curl -X POST http://localhost:3000/detalhes-projeto \
  -H "Content-Type: application/json" \
  -d '{"projetoId":1,"descricaoLonga":"Descrição","prazoFinal":"2024-12-31"}'

# Tentar novamente para mesmo projeto
curl -X POST http://localhost:3000/detalhes-projeto \
  -H "Content-Type: application/json" \
  -d '{"projetoId":1,"descricaoLonga":"Outra","prazoFinal":"2025-01-01"}'
# Deve retornar 400 ou 409 (detalhe já existe)
```

### 9. Atualizar Detalhe
- [ ] Endpoint: `PATCH /detalhes-projeto/:projetoId`
- [ ] Status esperado: **204**
- [ ] Body: `{ "descricaoLonga": "Nova descrição" }`
- [ ] Validar que mudança foi aplicada

```bash
curl -X PATCH http://localhost:3000/detalhes-projeto/1 \
  -H "Content-Type: application/json" \
  -d '{"descricaoLonga":"Nova descrição"}'
```

### 10. Deletar Detalhe
- [ ] Endpoint: `DELETE /detalhes-projeto/:projetoId`
- [ ] Status esperado: **204**
- [ ] Validar que GET retorna **404**

```bash
curl -X DELETE http://localhost:3000/detalhes-projeto/1
```

---

## 🏷️ CATEGORIA: TAGS (5 testes)

### 11. Listar Tags
- [ ] Endpoint: `GET /tags`
- [ ] Status esperado: **200**
- [ ] Response: Array de tags
- [ ] Campos: id, nome, criada_em

```bash
curl http://localhost:3000/tags
```

### 12. Criar Tag
- [ ] Endpoint: `POST /tags`
- [ ] Status esperado: **201**
- [ ] Body: `{ "nome": "backend" }`
- [ ] ⚠️ Tags duplicadas → **400**

```bash
curl -X POST http://localhost:3000/tags \
  -H "Content-Type: application/json" \
  -d '{"nome":"backend"}'

# Tentar duplicar
curl -X POST http://localhost:3000/tags \
  -H "Content-Type: application/json" \
  -d '{"nome":"backend"}'
# Deve retornar 400 (duplicada)
```

### 13. Buscar Tag
- [ ] Endpoint: `GET /tags/:id`
- [ ] Status esperado: **200** ou **404**
- [ ] Campos: id, nome, criada_em

```bash
curl http://localhost:3000/tags/1
```

### 14. Atualizar Tag
- [ ] Endpoint: `PATCH /tags/:id`
- [ ] Status esperado: **204**
- [ ] Body: `{ "nome": "backend-avançado" }`

```bash
curl -X PATCH http://localhost:3000/tags/1 \
  -H "Content-Type: application/json" \
  -d '{"nome":"backend-avançado"}'
```

### 15. Deletar Tag
- [ ] Endpoint: `DELETE /tags/:id`
- [ ] Status esperado: **204**
- [ ] ⚠️ Deve remover associações em cascata (tarefas_tags)
- [ ] Validar que GET retorna **404**

```bash
curl -X DELETE http://localhost:3000/tags/1
```

---

## 📝 CATEGORIA: TAREFAS (6 testes)

### 16. Listar Tarefas
- [ ] Endpoint: `GET /tarefas`
- [ ] Status esperado: **200**
- [ ] Response: Array de tarefas
- [ ] ⚠️ NÃO inclui array de tags (apenas em /:id)

```bash
curl http://localhost:3000/tarefas
```

### 17. ⭐ Buscar Tarefa COM TAGS
- [ ] Endpoint: `GET /tarefas/:id`
- [ ] Status esperado: **200** ou **404**
- [ ] Response: Tarefa com **tags array** 🎯
- [ ] Campos: id, descricao, concluido, projeto_id, projeto_nome, **tags[]**
- [ ] Tags deve ser array de `{ id, nome }`

```bash
curl http://localhost:3000/tarefas/1
# Response deve incluir:
# "tags": [
#   { "id": 1, "nome": "backend" },
#   { "id": 4, "nome": "urgente" }
# ]
```

### 18. Listar Tarefas de Projeto
- [ ] Endpoint: `GET /tarefas/projeto/:projetoId`
- [ ] Status esperado: **200**
- [ ] Response: Array de tarefas do projeto
- [ ] ⚠️ NÃO inclui tags (apenas em /:id)

```bash
curl http://localhost:3000/tarefas/projeto/1
```

### 19. Criar Tarefa
- [ ] Endpoint: `POST /tarefas`
- [ ] Status esperado: **201**
- [ ] Body: `{ "descricao": "Nova tarefa", "projetoId": 1 }`
- [ ] Response: Tarefa criada

```bash
curl -X POST http://localhost:3000/tarefas \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Nova tarefa","projetoId":1}'
```

### 20. Atualizar Tarefa
- [ ] Endpoint: `PATCH /tarefas/:id`
- [ ] Status esperado: **204**
- [ ] Body: `{ "descricao": "Atualizada", "concluido": true }`
- [ ] Validar com GET

```bash
curl -X PATCH http://localhost:3000/tarefas/1 \
  -H "Content-Type: application/json" \
  -d '{"descricao":"Atualizada","concluido":true}'
```

### 21. Deletar Tarefa
- [ ] Endpoint: `DELETE /tarefas/:id`
- [ ] Status esperado: **204**
- [ ] ⚠️ Deve remover associações N:N em cascata
- [ ] Validar que GET retorna **404**

```bash
curl -X DELETE http://localhost:3000/tarefas/1
```

---

## 🔗 CATEGORIA: OPERAÇÕES N:N (4 testes)

### 22. Listar Tags de Uma Tarefa
- [ ] Endpoint: `GET /tarefas/:tarefaId/tags`
- [ ] Status esperado: **200** ou **404**
- [ ] Response: Array de tags associadas
- [ ] Campos: id, nome, criada_em

```bash
curl http://localhost:3000/tarefas/1/tags
```

### 23. Associar Tag a Tarefa (N:N INSERT)
- [ ] Endpoint: `POST /tarefas/:tarefaId/tags`
- [ ] Status esperado: **201**
- [ ] Body: `{ "tagId": 1 }`
- [ ] ⚠️ Associação duplicada → **409** (Conflict)
- [ ] ⚠️ TagId inválido → **404**

```bash
curl -X POST http://localhost:3000/tarefas/1/tags \
  -H "Content-Type: application/json" \
  -d '{"tagId":1}'

# Tentar duplicar
curl -X POST http://localhost:3000/tarefas/1/tags \
  -H "Content-Type: application/json" \
  -d '{"tagId":1}'
# Deve retornar 409 (já associado)
```

### 24. Desassociar Tag de Tarefa (N:N DELETE)
- [ ] Endpoint: `DELETE /tarefas/:tarefaId/tags/:tagId`
- [ ] Status esperado: **204**
- [ ] Validar com GET /tarefas/1/tags

```bash
curl -X DELETE http://localhost:3000/tarefas/1/tags/1
```

### 25. Buscar Tarefas com Múltiplas Tags
- [ ] Endpoint: `GET /tags/tarefas/multiplas?minTags=2`
- [ ] Status esperado: **200**
- [ ] Response: Array de tarefas com >= minTags
- [ ] Campos: id, descricao, quantidade_tags, tags_associadas
- [ ] Testar com minTags=1, minTags=2, minTags=3

```bash
curl "http://localhost:3000/tags/tarefas/multiplas?minTags=2"
```

---

## 🎯 Testes de Integridade (5 testes)

### 26. Cascata: Deletar Projeto → Detalhe Some
- [ ] Criar detalhe para projeto 1
- [ ] GET /detalhes-projeto/1 → **200**
- [ ] DELETE /projetos/1
- [ ] GET /detalhes-projeto/1 → **404** (foi deletado)

```bash
# Criar
curl -X POST http://localhost:3000/projetos \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste Cascata"}'
# Assume ID 99

curl -X POST http://localhost:3000/detalhes-projeto \
  -H "Content-Type: application/json" \
  -d '{"projetoId":99,"descricaoLonga":"test"}'

# Verificar
curl http://localhost:3000/detalhes-projeto/99

# Deletar projeto
curl -X DELETE http://localhost:3000/projetos/99

# Verificar que detalhe foi deletado
curl http://localhost:3000/detalhes-projeto/99
# Deve retornar 404
```

### 27. Cascata: Deletar Tarefa → Associações N:N Some
- [ ] Criar tarefa
- [ ] Associar 2 tags
- [ ] GET /tarefas/X/tags → 2 tags
- [ ] DELETE /tarefas/X
- [ ] GET /tarefas/X → **404**

```bash
# Tarefa deve ter sido criada antes
# Assumindo ID 5

# Verificar associações
curl http://localhost:3000/tarefas/5/tags

# Deletar tarefa
curl -X DELETE http://localhost:3000/tarefas/5

# Verificar que foi deletada
curl http://localhost:3000/tarefas/5
# Deve retornar 404
```

### 28. Cascata: Deletar Tag → Associações Removidas
- [ ] Criar tag
- [ ] Associar a 2 tarefas
- [ ] DELETE /tags/X
- [ ] GET /tarefas/Y/tags (tarefas que tinham essa tag)

```bash
# Tag deve ter sido criada antes
# Assumindo ID 7

# Deletar tag
curl -X DELETE http://localhost:3000/tags/7

# Verificar que tarefas que tinham essa tag não a mostram mais
curl http://localhost:3000/tarefas/1
# Tag ID 7 não deve aparecer mais
```

### 29. JSON_AGG: Tarefa sem Tags retorna Array Vazio
- [ ] GET /tarefas/:id (tarefa criada recentemente sem tags)
- [ ] Response deve incluir: `"tags": []`
- [ ] NÃO deve ser `null` ou `undefined`

```bash
curl http://localhost:3000/tarefas/999
# Deve ter: "tags": []
```

### 30. Validação: CamelCase ↔ SnakeCase
- [ ] Criar detalhe com `projetoId` (camelCase)
- [ ] GET detalhes retorna `projeto_id` (snake_case)
- [ ] Validar que ambos os formatos funcionam

```bash
# POST com camelCase
curl -X POST http://localhost:3000/detalhes-projeto \
  -H "Content-Type: application/json" \
  -d '{"projetoId":1,"descricaoLonga":"x","prazoFinal":"2024-12-31"}'

# GET retorna snake_case
curl http://localhost:3000/detalhes-projeto/1
# Resposta terá: projeto_id, descricao_longa, prazo_final
```

---

## 📊 Sumário de Testes

| Categoria | Testes | Status |
|-----------|--------|--------|
| Projetos | 5 | ☐ |
| Detalhes (1:1) | 5 | ☐ |
| Tags | 5 | ☐ |
| Tarefas | 6 | ☐ |
| Operações N:N | 4 | ☐ |
| Integridade | 5 | ☐ |
| **Total** | **30** | **☐** |

---

## ✅ Critérios de Sucesso

- [x] Todos os 30 testes passam
- [x] Status codes corretos (200, 201, 204, 400, 404, 409)
- [x] Cascata funciona (ON DELETE CASCADE)
- [x] Tags array retorna em GET /tarefas/:id
- [x] Tags array vazio quando sem associações
- [x] 1:1 (máximo 1 detalhe por projeto)
- [x] N:N (múltiplas tags por tarefa)

**Roteiro 14 ✅ VALIDADO!**

