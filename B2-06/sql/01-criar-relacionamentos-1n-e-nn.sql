-- ======================================================
-- ROTEIRO 14: RELACIONAMENTOS 1:1 E N:N
-- Scripts de Migração do Banco de Dados
-- ======================================================
-- Partindo de B2-05, adicionamos:
-- 1. Relacionamento 1:1 (Projetos ↔ Detalhes de Projeto)
-- 2. Relacionamento N:N (Tarefas ↔ Tags)

-- ======================================================
-- PRERREQUISITO: Você deve ter B2-05 configurado
-- ======================================================
-- As tabelas `projetos` e `tarefas` já devem existir:
-- CREATE TABLE projetos (id SERIAL PK, nome TEXT, criado_em TIMESTAMP)
-- CREATE TABLE tarefas (id SERIAL PK, descricao TEXT, concluido BOOLEAN, criada_em TIMESTAMP, projeto_id INT FK)

-- ======================================================
-- ETAPA 1: RELACIONAMENTO 1:1
-- ======================================================
-- Um projeto pode ter no máximo UM detalhe
-- Um detalhe pertence a exatamente UM projeto

CREATE TABLE IF NOT EXISTS detalhes_projeto (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER NOT NULL UNIQUE,  -- UNIQUE garante 1:1
  descricao_longa TEXT,
  observacoes TEXT,
  prazo_final DATE,
  criado_em TIMESTAMP DEFAULT NOW(),
  CONSTRAINT fk_detalhes_projeto_projetos
    FOREIGN KEY (projeto_id)
    REFERENCES projetos(id)
    ON DELETE CASCADE  -- Se projeto for deletado, detalhe também será
);

-- ======================================================
-- ETAPA 1B: RELACIONAMENTO N:N
-- ======================================================
-- Muitas tarefas podem ter muitas tags
-- Muitas tags podem estar em muitas tarefas

-- Tabela 1 da relação N:N: TAGS
CREATE TABLE IF NOT EXISTS tags (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  criada_em TIMESTAMP DEFAULT NOW()
);

-- Tabela associativa (de junção) para N:N
CREATE TABLE IF NOT EXISTS tarefas_tags (
  tarefa_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (tarefa_id, tag_id),  -- Chave composta
  CONSTRAINT fk_tarefas_tags_tarefas
    FOREIGN KEY (tarefa_id)
    REFERENCES tarefas(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_tarefas_tags_tags
    FOREIGN KEY (tag_id)
    REFERENCES tags(id)
    ON DELETE CASCADE
);

-- ======================================================
-- DADOS DE EXEMPLO
-- ======================================================

-- Inserir tags
INSERT INTO tags (nome) VALUES
  ('backend'),
  ('frontend'),
  ('database'),
  ('urgente'),
  ('importante')
ON CONFLICT DO NOTHING;

-- Inserir detalhes de projetos (exemplo para projeto 1 e 2)
INSERT INTO detalhes_projeto (projeto_id, descricao_longa, observacoes, prazo_final) VALUES
  (1, 'Projeto de desenvolvimento web com foco em responsividade e SEO', 'Usar metodologia Agile', '2024-12-31'),
  (2, 'Estudo aprofundado de padrões de arquitetura backend', 'Foco em Clean Code e SOLID', '2024-11-15')
ON CONFLICT DO NOTHING;

-- Associar tags a tarefas (exemplo)
INSERT INTO tarefas_tags (tarefa_id, tag_id) VALUES
  (1, 2),  -- Tarefa 1 tem tag 'frontend'
  (1, 4),  -- Tarefa 1 tem tag 'urgente'
  (2, 1),  -- Tarefa 2 tem tag 'backend'
  (2, 5),  -- Tarefa 2 tem tag 'importante'
  (3, 1),  -- Tarefa 3 tem tag 'backend'
  (3, 3),  -- Tarefa 3 tem tag 'database'
  (4, 1),  -- Tarefa 4 tem tag 'backend'
  (4, 4)   -- Tarefa 4 tem tag 'urgente'
ON CONFLICT DO NOTHING;

-- ======================================================
-- VALIDAÇÃO
-- ======================================================
-- Verificar estrutura
SELECT 'detalhes_projeto' as tabela, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'detalhes_projeto'
ORDER BY ordinal_position;

SELECT 'tags' as tabela, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tags'
ORDER BY ordinal_position;

SELECT 'tarefas_tags' as tabela, column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tarefas_tags'
ORDER BY ordinal_position;

-- Verificar dados inseridos
SELECT * FROM detalhes_projeto;
SELECT * FROM tags;
SELECT * FROM tarefas_tags;
