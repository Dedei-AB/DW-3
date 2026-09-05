-- ======================================================
-- ETAPA 2: QUERIES DE TESTE E VALIDAÇÃO
-- ======================================================
-- Exemplos de queries para validar e entender o funcionamento

-- ======================================================
-- QUERY 1: Projetos que NÃO possuem detalhamento (LEFT JOIN Anti-Join)
-- ======================================================
-- Usa LEFT JOIN e verifica onde detalhes_projeto.id IS NULL
SELECT
  p.id,
  p.nome,
  p.criado_em,
  dp.id AS detalhe_id
FROM projetos p
LEFT JOIN detalhes_projeto dp ON p.id = dp.projeto_id
WHERE dp.id IS NULL
ORDER BY p.id;

-- Resultado esperado:
-- Qualquer projeto que não tenha um detalhe associado (projeto 3, por exemplo)

---

-- ======================================================
-- QUERY 2: Todos os projetos COM seus detalhes (LEFT JOIN)
-- ======================================================
-- Garante que projetos sem detalhes também apareçam (com valores NULL)
SELECT
  p.id,
  p.nome,
  p.criado_em,
  dp.id AS detalhe_id,
  dp.descricao_longa,
  dp.observacoes,
  dp.prazo_final,
  dp.criado_em AS detalhe_criado_em
FROM projetos p
LEFT JOIN detalhes_projeto dp ON p.id = dp.projeto_id
ORDER BY p.id;

-- Resultado esperado:
-- | id | nome                  | criado_em | detalhe_id | descricao_longa | observacoes | prazo_final | detalhe_criado_em |
-- |----|-----------------------|-----------|------------|-----------------|-------------|-------------|-------------------|
-- | 1  | Desenvolvimento Web   | ...       | 1          | Projeto de...   | Usar...     | 2024-12-31  | ...               |
-- | 2  | Estudos de Backend    | ...       | 2          | Estudo...       | Foco...     | 2024-11-15  | ...               |
-- | 3  | Projeto Pessoal       | ...       | NULL       | NULL            | NULL        | NULL        | NULL              |

---

-- ======================================================
-- QUERY 3: Tarefas COM suas tags (INNER JOIN nas 3 tabelas)
-- ======================================================
-- Traça tarefa → tarefas_tags → tags
-- Só traz tarefas que têm tags
SELECT
  t.id AS tarefa_id,
  t.descricao AS tarefa_descricao,
  t.concluido,
  tg.nome AS tag_nome,
  tg.id AS tag_id
FROM tarefas t
INNER JOIN tarefas_tags tt ON t.id = tt.tarefa_id
INNER JOIN tags tg ON tt.tag_id = tg.id
ORDER BY t.id, tg.id;

-- Resultado esperado (exemplo):
-- | tarefa_id | tarefa_descricao                     | concluido | tag_nome  | tag_id |
-- |-----------|-------------------------------------|-----------|-----------|--------|
-- | 1         | Implementar validação de formulário | false     | frontend  | 2      |
-- | 1         | Implementar validação de formulário | false     | urgente   | 4      |
-- | 2         | Criar página de login               | false     | backend   | 1      |
-- | 2         | Criar página de login               | false     | importante| 5      |
-- | 3         | Estudar padrão Repository           | true      | backend   | 1      |
-- | 3         | Estudar padrão Repository           | true      | database  | 3      |

-- ⚠️ Nota: A tarefa 1 aparece 2 vezes (uma por tag), pois tem 2 tags

---

-- ======================================================
-- QUERY 4: Tarefas com MAIS DE UMA tag (GROUP BY + HAVING)
-- ======================================================
-- Agrupa tarefas por tarefa_id e conta quantas tags cada uma tem
-- Filtra apenas as que têm mais de uma tag
SELECT
  t.id AS tarefa_id,
  t.descricao AS tarefa_descricao,
  t.concluido,
  COUNT(tg.id) AS quantidade_tags,
  STRING_AGG(tg.nome, ', ') AS tags_associadas
FROM tarefas t
INNER JOIN tarefas_tags tt ON t.id = tt.tarefa_id
INNER JOIN tags tg ON tt.tag_id = tg.id
GROUP BY t.id, t.descricao, t.concluido
HAVING COUNT(tg.id) > 1
ORDER BY t.id;

-- Resultado esperado:
-- | tarefa_id | tarefa_descricao                     | concluido | quantidade_tags | tags_associadas        |
-- |-----------|-------------------------------------|-----------|-----------------|------------------------|
-- | 1         | Implementar validação de formulário | false     | 2               | frontend, urgente      |
-- | 2         | Criar página de login               | false     | 2               | backend, importante    |
-- | 3         | Estudar padrão Repository           | true      | 2               | backend, database      |
-- | 4         | Implementar autenticação JWT        | false     | 2               | backend, urgente       |

---

-- ======================================================
-- QUERY 5: BÔNUS - Projeto com detalhes E tarefas com tags
-- ======================================================
-- Join complexo: projetos → detalhes E tarefas → tags
SELECT
  p.id AS projeto_id,
  p.nome AS projeto_nome,
  dp.descricao_longa,
  dp.prazo_final,
  t.id AS tarefa_id,
  t.descricao AS tarefa_descricao,
  STRING_AGG(tg.nome, ', ') AS tags_tarefa
FROM projetos p
LEFT JOIN detalhes_projeto dp ON p.id = dp.projeto_id
LEFT JOIN tarefas t ON p.id = t.projeto_id
LEFT JOIN tarefas_tags tt ON t.id = tt.tarefa_id
LEFT JOIN tags tg ON tt.tag_id = tg.id
GROUP BY p.id, p.nome, dp.id, dp.descricao_longa, dp.prazo_final, t.id, t.descricao
ORDER BY p.id, t.id;

-- Resultado esperado:
-- Vista completa de projeto → detalhes e tarefas → tags

---

-- ======================================================
-- QUERY 6: BÔNUS - Encontrar tarefas sem nenhuma tag
-- ======================================================
SELECT
  t.id,
  t.descricao,
  t.concluido
FROM tarefas t
LEFT JOIN tarefas_tags tt ON t.id = tt.tarefa_id
WHERE tt.tarefa_id IS NULL
ORDER BY t.id;

-- ⚠️ Se houver tarefas que não têm tags associadas

---

-- ======================================================
-- QUERY 7: BÔNUS - Contar quantas tarefas cada tag tem
-- ======================================================
SELECT
  tg.id,
  tg.nome,
  COUNT(t.id) AS quantidade_tarefas
FROM tags tg
LEFT JOIN tarefas_tags tt ON tg.id = tt.tag_id
LEFT JOIN tarefas t ON tt.tarefa_id = t.id
GROUP BY tg.id, tg.nome
ORDER BY quantidade_tarefas DESC, tg.nome;

-- Resultado esperado:
-- | id | nome      | quantidade_tarefas |
-- |----|-----------|-------------------|
-- | 1  | backend   | 3                 |
-- | 4  | urgente   | 2                 |
-- | 5  | importante| 1                 |
-- etc...

-- ======================================================
