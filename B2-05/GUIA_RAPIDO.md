# Guia Rápido - Roteiro 13

## 🚀 Passo a Passo para Começar

### 1. Preparar o Ambiente

```bash
# Copiar arquivo de configuração
cp .env.example .env

# Editar .env com suas credenciais PostgreSQL
# DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
```

### 2. Criar o Banco de Dados

```bash
# Via psql
psql -U postgres -h localhost -c "CREATE DATABASE dw3_roteiro13;"

# Executar migrations
psql -U postgres -h localhost -d dw3_roteiro13 -f sql/01-criar-relacionamento-1n.sql
```

### 3. Instalar e Rodar

```bash
npm install
npm run dev
```

Servidor rodará em **http://localhost:3000**

---

## 📡 Endpoints Disponíveis

### PROJETOS

```
GET    /projetos              → Listar todos
POST   /projetos              → Criar novo
GET    /projetos/:id          → Buscar por ID
PATCH  /projetos/:id          → Atualizar
DELETE /projetos/:id          → Deletar
```

### TAREFAS

```
GET    /tarefas               → Listar todas (com projeto)
POST   /tarefas               → Criar nova (com projetoId opcional)
GET    /tarefas/:id           → Buscar por ID (com projeto)
PATCH  /tarefas/:id           → Atualizar (pode trocar projeto)
DELETE /tarefas/:id           → Deletar
GET    /tarefas/projeto/:id   → Listar tarefas de um projeto
```

---

## 📝 Exemplos de Requisições

### Criar Projeto

```json
POST /projetos
{
  "nome": "Meu Projeto"
}
```

### Criar Tarefa VINCULADA a um Projeto

```json
POST /tarefas
{
  "descricao": "Fazer algo importante",
  "projetoId": 1,
  "concluido": false
}
```

### Listar Tarefas de um Projeto

```
GET /tarefas/projeto/1
```

Resposta:

```json
[
  {
    "id": 1,
    "descricao": "Fazer algo importante",
    "concluido": false,
    "criada_em": "2024-06-21T10:00:00.000Z",
    "projeto_id": 1,
    "projeto_nome": "Meu Projeto",
    "projeto_criado_em": "2024-06-21T09:50:00.000Z"
  }
]
```

---

## 🔍 Diferenças Chave

| Operação                     | SQL        | Resultado                  |
| ---------------------------- | ---------- | -------------------------- |
| Listar todas as tarefas      | LEFT JOIN  | Inclui tarefas SEM projeto |
| Listar tarefas de um projeto | INNER JOIN | APENAS tarefas COM projeto |

---

## 📂 Arquivos Importantes

- **`tarefa.repository.js`** - Contém os JOINs (LEFT e INNER)
- **`sql/01-criar-relacionamento-1n.sql`** - Migration do BD
- **`server-teste.http`** - Exemplos de requisições

---

## ❓ Dúvidas Frequentes

**P: Por que usar LEFT JOIN em buscarTodos()?**

- R: Porque tarefas antigas sem projeto devem aparecer na listagem

**P: Por que usar INNER JOIN em buscarPorProjeto()?**

- R: Porque queremos APENAS tarefas vinculadas àquele projeto

**P: O que acontece ao deletar um projeto?**

- R: As tarefas não são deletadas, apenas perdem a vinculação (projeto_id vira NULL)

**P: Preciso atualizar de CamelCase para SnakeCase?**

- R: Sim! JavaScript usa camelCase, SQL usa snake_case. O Repository faz a conversão.

---

## 📚 Leia Também

- `README.md` - Documentação completa
- `sql/03-referencia-queries-e-dados.sql` - Exemplos de queries e resultados
- `server-teste.http` - Todos os endpoints com exemplos
