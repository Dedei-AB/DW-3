-- ======================================================
-- ARQUIVO DE REFERÊNCIA: Estrutura e Exemplos de Dados
-- ======================================================

-- ======================================================
-- ESTRUTURA FINAL DO BANCO DE DADOS
-- ======================================================

-- TABELA: projetos
-- Lado "1" do relacionamento 1:N
CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- Exemplo de dados:
-- | id | nome                  | criado_em           |
-- |----|----------------------|---------------------|
-- | 1  | Desenvolvimento Web  | 2024-06-21 10:00:00|
-- | 2  | Estudos de Backend   | 2024-06-21 10:05:00|
-- | 3  | Projeto Pessoal      | 2024-06-21 10:10:00|

-- TABELA: tarefas
-- Lado "N" do relacionamento 1:N (muitas tarefas por projeto)
CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  concluido BOOLEAN DEFAULT FALSE,
  criada_em TIMESTAMP DEFAULT NOW(),
  projeto_id INTEGER,
  CONSTRAINT fk_tarefas_projetos
    FOREIGN KEY (projeto_id)
    REFERENCES projetos(id)
    ON DELETE SET NULL
);

-- Exemplo de dados:
-- | id | descricao                               | concluido | criada_em | projeto_id |
-- |----|----------------------------------------|-----------|-----------|------------|
-- | 1  | Implementar validação de formulário    | false     | ...       | 1          |
-- | 2  | Criar página de login                  | false     | ...       | 1          |
-- | 3  | Estudar padrão Repository              | true      | ...       | 2          |
-- | 4  | Implementar autenticação JWT           | false     | ...       | 2          |
-- | 5  | Fazer exercícios de JavaScript         | false     | ...       | 3          |
-- | 6  | Tarefa sem projeto                     | false     | ...       | NULL       |

-- ======================================================
-- QUERIES DE REFERÊNCIA E SEUS RESULTADOS
-- ======================================================

-- Query 1: Listar TODAS as tarefas COM dados do projeto (LEFT JOIN)
-- Nota: tarefas com projeto_id = NULL ainda aparecem
SELECT
  t.id,
  t.descricao,
  t.concluido,
  p.nome AS projeto_nome
FROM tarefas t
LEFT JOIN projetos p ON t.projeto_id = p.id
ORDER BY t.id;

-- Resultado esperado:
-- | id | descricao                              | concluido | projeto_nome             |
-- |----|--------------------------------------|-----------|--------------------------|
-- | 1  | Implementar validação de formulário  | false     | Desenvolvimento Web      |
-- | 2  | Criar página de login                | false     | Desenvolvimento Web      |
-- | 3  | Estudar padrão Repository            | true      | Estudos de Backend       |
-- | 4  | Implementar autenticação JWT         | false     | Estudos de Backend       |
-- | 5  | Fazer exercícios de JavaScript       | false     | Projeto Pessoal          |
-- | 6  | Tarefa sem projeto                   | false     | NULL (sem projeto)       |
-- ↑ Note que a tarefa 6 aparece com projeto_nome = NULL

---

-- Query 2: Buscar tarefa específica COM dados do projeto (LEFT JOIN)
SELECT
  t.id,
  t.descricao,
  t.concluido,
  t.projeto_id,
  p.nome AS projeto_nome,
  p.criado_em AS projeto_criado_em
FROM tarefas t
LEFT JOIN projetos p ON t.projeto_id = p.id
WHERE t.id = 1;

-- Resultado esperado:
-- | id | descricao                             | concluido | projeto_id | projeto_nome        | projeto_criado_em |
-- |----|-------------------------------------|-----------|------------|---------------------|-------------------|
-- | 1  | Implementar validação de formulário | false     | 1          | Desenvolvimento Web | 2024-06-21 10:00:00|

---

-- Query 3: Listar tarefas de um projeto ESPECÍFICO (INNER JOIN)
-- Nota: tarefas com projeto_id = NULL NÃO aparecem
SELECT
  t.id,
  t.descricao,
  t.concluido,
  p.nome AS projeto_nome
FROM tarefas t
INNER JOIN projetos p ON t.projeto_id = p.id
WHERE t.projeto_id = 1
ORDER BY t.id;

-- Resultado esperado:
-- | id | descricao                              | concluido | projeto_nome        |
-- |----|--------------------------------------|-----------|---------------------|
-- | 1  | Implementar validação de formulário  | false     | Desenvolvimento Web |
-- | 2  | Criar página de login                | false     | Desenvolvimento Web |
-- ↑ Note que a tarefa 6 (sem projeto) NÃO aparece

---

-- Query 4: Listar tarefas do projeto 2
SELECT
  t.id,
  t.descricao,
  t.concluido,
  p.nome AS projeto_nome
FROM tarefas t
INNER JOIN projetos p ON t.projeto_id = p.id
WHERE t.projeto_id = 2
ORDER BY t.id;

-- Resultado esperado:
-- | id | descricao                       | concluido | projeto_nome       |
-- |----|-------------------------------|-----------|------------------|
-- | 3  | Estudar padrão Repository      | true      | Estudos de Backend|
-- | 4  | Implementar autenticação JWT   | false     | Estudos de Backend|

---

-- Query 5: Contar tarefas por projeto
SELECT
  p.id,
  p.nome,
  COUNT(t.id) AS total_tarefas,
  COUNT(CASE WHEN t.concluido = true THEN 1 END) AS tarefas_concluidas,
  COUNT(CASE WHEN t.concluido = false THEN 1 END) AS tarefas_pendentes
FROM projetos p
LEFT JOIN tarefas t ON t.projeto_id = p.id
GROUP BY p.id, p.nome
ORDER BY p.id;

-- Resultado esperado:
-- | id | nome                 | total_tarefas | tarefas_concluidas | tarefas_pendentes |
-- |----|---------------------|---------------|------------------|------------------|
-- | 1  | Desenvolvimento Web | 2             | 0                  | 2                 |
-- | 2  | Estudos de Backend  | 2             | 1                  | 1                 |
-- | 3  | Projeto Pessoal     | 1             | 0                  | 1                 |

---

-- Query 6: Tarefas SEM projeto (projeto_id = NULL)
SELECT
  t.id,
  t.descricao,
  t.concluido
FROM tarefas t
WHERE t.projeto_id IS NULL
ORDER BY t.id;

-- Resultado esperado:
-- | id | descricao            | concluido |
-- |----|-------------------|-----------|
-- | 6  | Tarefa sem projeto | false     |

---

-- ======================================================
-- OPERAÇÕES COM CHAVE ESTRANGEIRA (FK)
-- ======================================================

-- Comportamento ao DELETAR um projeto:
-- DELETE FROM projetos WHERE id = 1;
--
-- Como temos ON DELETE SET NULL na FK:
-- - O projeto com id=1 é deletado
-- - Todas as tarefas com projeto_id=1 terão projeto_id setado para NULL
-- - As tarefas NÃO são deletadas

-- Antes do DELETE:
-- | id | descricao                            | projeto_id |
-- |----|-----------------------------------|------------|
-- | 1  | Implementar validação de form...   | 1          |
-- | 2  | Criar página de login              | 1          |

-- Depois do DELETE:
-- | id | descricao                            | projeto_id |
-- |----|-----------------------------------|------------|
-- | 1  | Implementar validação de form...   | NULL       |
-- | 2  | Criar página de login              | NULL       |

---

-- ======================================================
-- DIFERENÇAS ENTRE LEFT JOIN E INNER JOIN
-- ======================================================

-- Cenário:
-- - Projeto 1 tem 2 tarefas
-- - Projeto 2 tem 2 tarefas
-- - Projeto 3 tem 0 tarefas (nenhuma tarefa vinculada)
-- - Existe 1 tarefa sem projeto (projeto_id = NULL)

-- LEFT JOIN projetos COM tarefas:
SELECT p.*, COUNT(t.id) FROM projetos p
LEFT JOIN tarefas t ON p.id = t.projeto_id
GROUP BY p.id, p.nome, p.criado_em;

-- Resultado:
-- | id | nome                | criado_em | count |
-- |----|------------------|-----------|-------|
-- | 1  | Desenvolvimento  | ...       | 2     |
-- | 2  | Estudos Backend  | ...       | 2     |
-- | 3  | Projeto Pessoal  | ...       | 0     | ← Projeto SEM tarefas ainda aparece
-- ↑ LEFT JOIN garante que todos os projetos apareçam

-- INNER JOIN tarefas COM projetos:
SELECT p.*, COUNT(t.id) FROM projetos p
INNER JOIN tarefas t ON p.id = t.projeto_id
GROUP BY p.id, p.nome, p.criado_em;

-- Resultado:
-- | id | nome                | criado_em | count |
-- |----|------------------|-----------|-------|
-- | 1  | Desenvolvimento  | ...       | 2     |
-- | 2  | Estudos Backend  | ...       | 2     |
-- ↑ INNER JOIN não mostra o Projeto 3 (que não tem tarefas)

-- ======================================================
