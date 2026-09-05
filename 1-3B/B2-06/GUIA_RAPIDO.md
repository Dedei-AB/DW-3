# 🚀 Guia Rápido - Roteiro 14

## Setup (5 minutos)

### 1. Clonar de B2-05
```bash
# B2-06 usa o banco de B2-05
# Garanta que B2-05 está configurado primeiro
```

### 2. Configurar Ambiente
```bash
cd B2-06
cp .env.example .env
# Editar .env com mesmo banco de B2-05 (ou novo: dw3_roteiro14)
```

### 3. Criar Tabelas Novas
```bash
# Execute primeiro os scripts de B2-05 se não estiverem lá
psql -U postgres -d dw3_roteiro14 -f sql/01-criar-relacionamentos-1n-e-nn.sql
```

### 4. Instalar
```bash
npm install
npm run dev
```

---

## 🎯 O Que São os Relacionamentos

### 1:1 (Um para Um)
```
Um Projeto tem no máximo UM Detalhe
Um Detalhe pertence a exatamente UM Projeto
```

**Exemplo:** Projeto "Desenvolvimento Web" possui 1 Detalhe com prazo_final: "2024-12-31"

**SQL:** `UNIQUE` em `projeto_id` garante que cada projeto tenha máximo um detalhe.

### N:N (Muitos para Muitos)
```
Muitas Tarefas podem ter muitas Tags
Muitas Tags podem estar em muitas Tarefas
```

**Exemplo:** 
- Tarefa "Fazer login" tem tags: ["frontend", "urgente"]
- Tarefa "Validar form" tem tags: ["frontend", "urgente"]
- Tag "frontend" está em múltiplas tarefas

**SQL:** Tabela `tarefas_tags` com chave composta (tarefa_id, tag_id) conecta as duas.

---

## 📡 Endpoints Principais

### Detalhes de Projeto (1:1)
```bash
# Criar detalhe para projeto 1
POST /detalhes-projeto
{ "projetoId": 1, "descricaoLonga": "...", "prazoFinal": "2024-12-31" }

# Buscar detalhe do projeto 1 (1:1 - retorna 1 ou null)
GET /detalhes-projeto/1
```

### Tags (N:N)
```bash
# Listar todas as tags
GET /tags

# Criar tag
POST /tags
{ "nome": "backend" }

# Associar tag 1 à tarefa 5
POST /tarefas/5/tags
{ "tagId": 1 }

# Ver tags da tarefa 5
GET /tarefas/5/tags

# Desassociar tag 1 de tarefa 5
DELETE /tarefas/5/tags/1
```

### ⭐ Tarefa COM Tags (Principal)
```bash
# Buscar tarefa 1 - MOSTRA TAGS INCLUÍDAS!
GET /tarefas/1

Resposta:
{
  "id": 1,
  "descricao": "...",
  "tags": [
    { "id": 1, "nome": "backend" },
    { "id": 4, "nome": "urgente" }
  ]
}
```

---

## 🔍 Queries Especiais

```bash
# Tarefas que têm 2 ou mais tags
GET /tags/tarefas/multiplas?minTags=2

# Tarefas que têm 1 ou mais tags
GET /tags/tarefas/multiplas?minTags=1
```

---

## 📝 Estrutura de Dados

### Detalhe de Projeto
```json
{
  "id": 1,
  "projeto_id": 1,
  "descricao_longa": "Descrição...",
  "observacoes": "Observações...",
  "prazo_final": "2024-12-31",
  "criado_em": "2024-06-21T10:00:00.000Z"
}
```

### Tag
```json
{
  "id": 1,
  "nome": "backend",
  "criada_em": "2024-06-21T10:00:00.000Z"
}
```

### Tarefa (com tags)
```json
{
  "id": 1,
  "descricao": "Fazer login",
  "concluido": false,
  "projeto_id": 1,
  "projeto_nome": "Desenvolvimento Web",
  "tags": [
    { "id": 2, "nome": "frontend" },
    { "id": 4, "nome": "urgente" }
  ]
}
```

---

## 🆚 Diferenças 1:1 vs N:N

### 1:1
```
Projeto ←→ Detalhe
1 : 1

Projeto 1 → Detalhe X (existente)
Projeto 2 → Detalhe Y (existente)
Projeto 3 → (null - sem detalhe)
```

### N:N
```
Tarefa ←→ Tag
N : N (via tarefas_tags)

Tarefa 1 → [Tag A, Tag B]
Tarefa 2 → [Tag B, Tag C]
Tarefa 3 → [Tag A]
```

---

## 🐛 Dicas de Troubleshooting

**Erro: "detalhe já existe para este projeto"**
- Cada projeto tem no máximo 1 detalhe (UNIQUE)
- Atualize o detalhe em vez de criar novo

**Tag não aparece na tarefa**
- Verifique se a associação foi criada: `GET /tarefas/5/tags`
- Se vazio, use `POST /tarefas/5/tags { "tagId": X }`

**Erro ao deletar projeto**
- Cascata automática (`ON DELETE CASCADE`) deleta detalhes
- Tarefas com `projeto_id = X` terão `projeto_id = NULL`

---

## 📖 Leia Também

- `README.md` - Documentação completa
- `sql/01-criar-relacionamentos-1n-e-nn.sql` - Schema SQL
- `sql/02-queries-teste-etapa-2.sql` - Queries de teste
- `server-teste.http` - Exemplos de requisições

