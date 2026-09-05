# Explicação da Arquitetura - Roteiro 11

## 1. Por que o SQL não deve permanecer no server.js?

**Resposta:** Manter SQL no `server.js` viola o princípio de **Separação de Responsabilidades**. Razões:

- **Violação de Responsabilidade:** `server.js` seria responsável por configurar o servidor E acessar o banco de dados. Uma classe/arquivo deve ter UMA responsabilidade.
- **Difícil de Testar:** Seria impossível testar a lógica SQL isoladamente do servidor web.
- **Código Difícil de Manter:** Misturar configuração de rotas com acesso a banco cria código "spaghetti".
- **Reutilização Impedida:** Se múltiplas rotas precisam dos mesmos dados, o SQL seria duplicado.
- **Mudanças em Cascata:** Alterar a estrutura do banco exigiria mexer em `server.js` (onde não deveria ter dados).

**Exemplo ruim:**

```javascript
// ❌ RUIM: SQL no server.js
server.get("/tarefas", async (request, reply) => {
  const resultado = await client.query("SELECT * FROM tarefas");
  reply.send(resultado.rows);
});
```

**Exemplo bom:**

```javascript
// ✅ BOM: SQL isolado no Repository
server.get("/tarefas", async (request, reply) => {
  const tarefas = await repository.listarTodos();
  reply.send(tarefas);
});
```

---

## 2. Por que Repository é a camada correta para persistência?

**Resposta:** Repository encapsula TODO acesso aos dados. Responsabilidades do Repository:

- **Abstração de Dados:** Esconde detalhes de como os dados são persistidos (BD, arquivo, API externa).
- **Proteção Contra SQL Injection:** Usa parâmetros (`$1`, `$2`) em vez de concatenação.
- **Consultas Eficientes:** Aplica filtros no banco de dados, não em memória.
- **Facilita Testes:** Pode ser mockado para testes unitários do Service/Controller.
- **Ponto Único de Mudança:** Se trocar de PostgreSQL para MongoDB, só o Repository muda.

**Stack da Arquitetura:**

```
┌─────────────────────────────────┐
│      Routes (tarefas.routes.js) │  ← Configura endpoints HTTP
├─────────────────────────────────┤
│   Controller (tarefas.controller.js)  │  ← Recebe requisição HTTP
├─────────────────────────────────┤
│    Service (tarefas.service.js)  │  ← Lógica de negócio
├─────────────────────────────────┤
│  Repository (tarefas.repository.js) │  ← Acesso a dados
├─────────────────────────────────┤
│   Database (PostgreSQL)         │  ← Armazena dados
└─────────────────────────────────┘
```

---

## 3. O que mudou ao migrar de array para PostgreSQL?

**O que MUDOU:**

1. **Armazenamento de Dados:**
   - ❌ Antes: Array em memória (`[]`) - perdido ao reiniciar
   - ✅ Agora: PostgreSQL - persistência permanente

2. **Localização da Filtragem:**
   - ❌ Antes: Em memória com `.filter()` em JavaScript
   - ✅ Agora: No banco com SQL (`WHERE`, `ILIKE`)

   ```javascript
   // ❌ ANTES: Carregar tudo, depois filtrar
   const tarefas = [...]; // Array com 10.000 tarefas
   const filtradas = tarefas.filter(t =>
     t.descricao.includes("estudar")
   );

   // ✅ AGORA: Filtrar no banco
   SELECT * FROM tarefas WHERE descricao ILIKE '%estudar%'
   ```

3. **Segurança:**
   - ❌ Antes: String concatenation era viável (poucos dados)
   - ✅ Agora: Parâmetros obrigatórios para prevenir SQL Injection

4. **Métodos do Repository:**
   - Antes: Retornava arrays diretamente
   - Agora: Executa queries SQL e transforma resultados

---

## 4. O que permaneceu igual na arquitetura?

**Responsabilidades NÃO mudaram:**

| Camada         | Antes                       | Agora                       | Status                                         |
| -------------- | --------------------------- | --------------------------- | ---------------------------------------------- |
| **Routes**     | Registra endpoints          | Registra endpoints          | ✅ Igual                                       |
| **Controller** | Recebe HTTP, valida entrada | Recebe HTTP, valida entrada | ✅ Igual                                       |
| **Service**    | Lógica de negócio, regras   | Lógica de negócio, regras   | ✅ Igual                                       |
| **Repository** | Acesso aos dados            | Acesso aos dados            | ✅ Mesma responsabilidade, implementação mudou |

**Exemplo - Validação de Descrição Duplicada:**

```javascript
// ❌ ANTES (array)
async criarTarefa(dados) {
  const tarefas = await this.repository.listarTodos();
  const existe = tarefas.some(t =>
    t.descricao.toLowerCase() === dados.descricao.toLowerCase()
  );
  if (existe) throw new AppError("Já existe essa tarefa");
  return this.repository.salvar(dados);
}

// ✅ AGORA (PostgreSQL)
async criarTarefa(dados) {
  const tarefas = await this.repository.listarTodos();
  const existe = tarefas.some(t =>
    t.descricao.toLowerCase() === dados.descricao.toLowerCase()
  );
  if (existe) throw new AppError("Já existe essa tarefa");
  return this.repository.salvar(dados);
}
// ↑ O Service continua igual! Só o Repository mudou internamente.
```

---

## Resumo da Migração

| Aspecto         | Array                                         | PostgreSQL               |
| --------------- | --------------------------------------------- | ------------------------ |
| Persistência    | ❌ Em memória                                 | ✅ Permanente            |
| Filtragem       | JavaScript `.filter()`                        | SQL `WHERE`              |
| Segurança       | Vulnerável                                    | Protegido (parâmetros)   |
| Performance     | Carregar tudo (lento)                         | Carregar só o necessário |
| Escalabilidade  | Limitado                                      | Ilimitado                |
| **Arquitetura** | ✅ Routes → Controller → Service → Repository | ✅ **Igual**             |

---

## Exercícios Implementados

### Exercício 1: Filtro por Descrição

- **Camada:** Repository (SQL)
- **Método:** `listarComFiltros(descricao?)`
- **SQL:** `WHERE descricao ILIKE '%texto%'`
- **Proteção:** Parâmetros (`$1`)

### Exercício 2: Filtro por Concluído

- **Camada:** Repository (SQL)
- **Método:** `listarComFiltros(..., concluido?)`
- **SQL:** `WHERE concluido = true/false`
- **Vantagem:** Filtra no banco, não carrega tarefas desnecessárias

### Exercício 3: Resumo com Agregação

- **Camada:** Repository (SQL)
- **Método:** `obterResumo()`
- **SQL:** `COUNT(*)`, `COUNT(CASE WHEN...)`
- **Benefício:** Uma única query é infinitamente mais rápida que carregar 1 milhão de tarefas

### Exercício 4: Documentação

- **Arquivo:** `EXPLICACAO_ARQUITETURA.md`
- **Foco:** Princípios de separação de responsabilidades
