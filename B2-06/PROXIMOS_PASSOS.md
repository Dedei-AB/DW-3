# 🔮 Próximos Passos - Preparando para Roteiro 15

Este arquivo documenta sugestões de aprimoramentos e próximas etapas após Roteiro 14.

---

## 📋 Roteiro 15 - Softdelete e Auditoria

### Objetivo
Adicionar capacidade de deletar "logicamente" (sem remover dados) e rastrear quem fez alterações.

### Tabelas Adicionais

#### audit_log (auditoria)
```sql
CREATE TABLE audit_log (
  id SERIAL PRIMARY KEY,
  tabela TEXT NOT NULL,        -- 'projetos', 'tarefas', etc
  operacao TEXT NOT NULL,       -- 'INSERT', 'UPDATE', 'DELETE'
  registro_id INTEGER,          -- ID do registro alterado
  dados_anteriores JSONB,       -- Estado anterior (UPDATE/DELETE)
  dados_novos JSONB,            -- Estado novo (INSERT/UPDATE)
  usuario_id INTEGER,           -- Quem fez (futura integração)
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_audit_tabela_operacao 
ON audit_log(tabela, operacao);
```

#### Tabelas com Softdelete
```sql
-- Adicionar coluna deleted_at em:
ALTER TABLE projetos ADD COLUMN deletado_em TIMESTAMP;
ALTER TABLE tarefas ADD COLUMN deletado_em TIMESTAMP;
ALTER TABLE tags ADD COLUMN deletado_em TIMESTAMP;
ALTER TABLE detalhes_projeto ADD COLUMN deletado_em TIMESTAMP;

-- Queries retornarão apenas WHERE deletado_em IS NULL
```

### Mudanças no Código

#### Repository Pattern
```javascript
// Antes
async buscarTodos() {
  const resultado = await client.query(`
    SELECT * FROM tarefas
  `);
}

// Depois (Softdelete)
async buscarTodos() {
  const resultado = await client.query(`
    SELECT * FROM tarefas
    WHERE deletado_em IS NULL
  `);
}

// DELETE muda para UPDATE
async remover(id) {
  // Em vez de: DELETE FROM tarefas WHERE id = $1
  // Agora: 
  await client.query(`
    UPDATE tarefas
    SET deletado_em = NOW()
    WHERE id = $1
  `);
  
  // Log auditoria
  await this.criarAudit('tarefas', 'DELETE', id, dados, null);
}
```

#### Service Layer
```javascript
// Service recebe todos os dados da auditoria
async remover(id, usuarioId) {
  const tarefa = await this.repository.buscarPorId(id);
  
  // Log: quem deletou, quando, dados
  await this.auditRepository.criar({
    tabela: 'tarefas',
    operacao: 'DELETE',
    registro_id: id,
    dados_anteriores: tarefa,
    usuario_id: usuarioId
  });
  
  return this.repository.remover(id);
}
```

### Endpoints Novos

```bash
# Ver histórico de um registro
GET /auditoria/tarefas/:id
# Retorna: [
#   { operacao: 'INSERT', criado_em: '...' },
#   { operacao: 'UPDATE', criado_em: '...' },
#   { operacao: 'DELETE', criado_em: '...' }
# ]

# Ver auditoria geral
GET /auditoria?tabela=tarefas&operacao=DELETE
```

---

## 🔐 Roteiro 16 - Autenticação e Autorização

### Objetivo
Adicionar login/logout e permissões.

### Tabelas
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha_hash TEXT NOT NULL,
  nome TEXT,
  criado_em TIMESTAMP DEFAULT NOW()
);

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  nome TEXT UNIQUE NOT NULL  -- 'admin', 'editor', 'viewer'
);

CREATE TABLE usuarios_roles (
  usuario_id INTEGER FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  role_id INTEGER FOREIGN KEY (role_id) REFERENCES roles(id),
  PRIMARY KEY (usuario_id, role_id)
);
```

### Middleware
```javascript
// src/middleware/auth.middleware.js
import jwt from '@fastify/jwt';

export async function autenticar(request, reply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.code(401).send({ error: 'Não autenticado' });
  }
}

export async function autorizar(rolesPermitidas) {
  return async (request, reply) => {
    await autenticar(request, reply);
    if (!rolesPermitidas.includes(request.user.role)) {
      reply.code(403).send({ error: 'Sem permissão' });
    }
  };
}
```

### Endpoints
```bash
POST /auth/registrar
{ "email": "user@example.com", "senha": "...", "nome": "..." }

POST /auth/login
{ "email": "user@example.com", "senha": "..." }
# Resposta: { token: "jwt_token" }

POST /auth/logout
# Headers: Authorization: Bearer token

GET /auth/me
# Retorna usuário logado
```

### Routes Protegidas
```javascript
// Criar tarefa requer autenticação
server.post('/tarefas', { onRequest: [autenticar] }, tarefaController.criar);

// Deletar tag requer role admin
server.delete('/tags/:id', { 
  onRequest: [autorizar(['admin'])] 
}, tagController.deletar);
```

---

## 📄 Roteiro 17 - Paginação e Filtros

### Objetivo
Retornar grandes datasets em páginas.

### Query Parameters
```bash
GET /tarefas?page=1&limit=10&ordenarPor=criada_em&ordem=DESC
# Retorna: { dados: [...], total: 150, pagina: 1, totalPaginas: 15 }

GET /tarefas?filtro[concluido]=true&filtro[projeto_id]=1
# Apenas tarefas concluídas do projeto 1
```

### SQL com Paginação
```javascript
async buscarComPaginacao(page, limit) {
  const offset = (page - 1) * limit;
  
  const [dados, total] = await Promise.all([
    client.query(`
      SELECT * FROM tarefas
      WHERE deletado_em IS NULL
      ORDER BY criada_em DESC
      LIMIT $1 OFFSET $2
    `, [limit, offset]),
    
    client.query(`
      SELECT COUNT(*) as count FROM tarefas
      WHERE deletado_em IS NULL
    `)
  ]);
  
  return {
    dados: dados.rows,
    total: total.rows[0].count,
    pagina: page,
    limite: limit,
    totalPaginas: Math.ceil(total.rows[0].count / limit)
  };
}
```

---

## 💾 Roteiro 18 - Cache com Redis

### Objetivo
Melhorar performance de queries frequentes.

### Estratégia
```javascript
// src/cache/redis.js
import redis from 'redis';

const client = redis.createClient({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT
});

export async function obterComCache(chave, funcao, ttl = 3600) {
  // Tentar get no Redis
  let dados = await client.get(chave);
  
  if (dados) {
    return JSON.parse(dados);
  }
  
  // Se não tiver, executar função
  dados = await funcao();
  
  // Guardar no Redis com TTL
  await client.setex(chave, ttl, JSON.stringify(dados));
  
  return dados;
}
```

### Uso no Repository
```javascript
async buscarTagsComContagem() {
  return obterComCache(
    'tags:contagem',
    () => this.repository.buscarTagsComContagem(),
    3600 // 1 hora
  );
}
```

### Invalidação de Cache
```javascript
// Ao criar/atualizar/deletar, invalidar cache
async criarTag(tag) {
  const resultado = await this.repository.salvar(tag);
  
  // Invalidar cache
  await cache.remover('tags:contagem');
  
  return resultado;
}
```

---

## 🧪 Roteiro 19 - Testes Automatizados

### Jest + Supertest

```javascript
// tests/tarefas.test.js
import request from 'supertest';
import { server } from '../src/server.js';

describe('Tarefas', () => {
  test('GET /tarefas retorna array', async () => {
    const response = await request(server)
      .get('/tarefas')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
  
  test('POST /tarefas cria nova tarefa', async () => {
    const response = await request(server)
      .post('/tarefas')
      .send({ descricao: 'Teste', projetoId: 1 })
      .expect(201);
    
    expect(response.body.id).toBeDefined();
  });
  
  test('GET /tarefas/:id retorna tarefa COM tags', async () => {
    const response = await request(server)
      .get('/tarefas/1')
      .expect(200);
    
    expect(Array.isArray(response.body.tags)).toBe(true);
  });
});

describe('Tags N:N', () => {
  test('POST /tarefas/1/tags associa tag', async () => {
    await request(server)
      .post('/tarefas/1/tags')
      .send({ tagId: 2 })
      .expect(201);
    
    const response = await request(server)
      .get('/tarefas/1/tags')
      .expect(200);
    
    expect(response.body.some(t => t.id === 2)).toBe(true);
  });
});
```

### Scripts
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

---

## 🚀 Roteiro 20 - Deployment

### Docker
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src
COPY sql ./sql

EXPOSE 3000

CMD ["npm", "start"]
```

### Docker Compose
```yaml
version: '3'

services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: dw3_roteiro14
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"

  app:
    build: .
    environment:
      DB_USER: postgres
      DB_PASSWORD: password
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: dw3_roteiro14
    ports:
      - "3000:3000"
    depends_on:
      - postgres
```

### Deploy Heroku
```bash
# Criar app
heroku create seu-app-name

# Adicionar PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main
```

---

## 📚 Arquitetura Completa (Visão Final)

```
┌─────────────────────────────────────────────┐
│            Frontend (React/Vue)             │
├─────────────────────────────────────────────┤
│                REST API (Fastify)           │
│  ┌──────────────────────────────────────┐  │
│  │ Middleware:                          │  │
│  │ - Autenticação (JWT)                │  │
│  │ - Autorização (Roles)               │  │
│  │ - Logging/Auditoria                 │  │
│  │ - Compressão/Rate Limit             │  │
│  └──────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│          Controllers → Services → Repositories
│          ┌─────────────────────────────┐   │
│          │ Business Logic Layer        │   │
│          │ (Validação, regras)         │   │
│          └─────────────────────────────┘   │
├─────────────────────────────────────────────┤
│  Cache Layer (Redis)                       │
│  ┌──────────────────────────────────────┐  │
│  │ tags:contagem (TTL: 1h)             │  │
│  │ tarefas:1 (TTL: 30m)                │  │
│  └──────────────────────────────────────┘  │
├─────────────────────────────────────────────┤
│         Database Layer (PostgreSQL)        │
│  ┌──────────────────────────────────────┐  │
│  │ projetos                             │  │
│  │ tarefas                              │  │
│  │ tags                                 │  │
│  │ tarefas_tags (N:N)                  │  │
│  │ detalhes_projeto (1:1)              │  │
│  │ usuarios (auth)                      │  │
│  │ audit_log (auditoria)               │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 📊 Roadmap

| Roteiro | Tema | Prioridade | Estimativa |
|---------|------|-----------|-----------|
| 14 | ✅ 1:1 + N:N | ✅ Completo | - |
| 15 | Softdelete + Auditoria | Alto | 2-3 dias |
| 16 | Autenticação + Autorização | Alto | 3-4 dias |
| 17 | Paginação + Filtros | Médio | 1-2 dias |
| 18 | Cache (Redis) | Médio | 2 dias |
| 19 | Testes Automatizados | Alto | 3-4 dias |
| 20 | Deployment (Docker) | Médio | 1-2 dias |

---

## 🎯 Foco Recomendado

1. **Roteiro 15** → Preparar para dados do mundo real (softdelete, auditoria)
2. **Roteiro 16** → Segurança (quem acessa o quê)
3. **Roteiro 19** → Qualidade (testes antes de Produção)
4. **Roteiro 20** → Deploy (colocar em produção)

---

**Você está pronto para o próximo nível! 🚀**

