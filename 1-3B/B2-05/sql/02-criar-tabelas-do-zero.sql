-- ======================================================
-- SCRIPT ALTERNATIVO: SE CRIANDO TABELAS DO ZERO
-- ======================================================
-- Use este script se você está começando um banco de dados novo

-- ======================================================
-- CRIAR TABELA projetos
-- ======================================================
DROP TABLE IF EXISTS tarefas CASCADE;
DROP TABLE IF EXISTS projetos CASCADE;

CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ======================================================
-- CRIAR TABELA tarefas COM FOREIGN KEY
-- ======================================================
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

-- ======================================================
-- INSERIR DADOS DE EXEMPLO
-- ======================================================

-- Projetos
INSERT INTO projetos (nome) VALUES
  ('Desenvolvimento Web'),
  ('Estudos de Backend'),
  ('Projeto Pessoal');

-- Tarefas
INSERT INTO tarefas (descricao, concluido, projeto_id) VALUES
  ('Implementar validação de formulário', false, 1),
  ('Criar página de login', false, 1),
  ('Estudar padrão Repository', true, 2),
  ('Implementar autenticação JWT', false, 2),
  ('Fazer exercícios de JavaScript', false, 3),
  ('Tarefa sem projeto', false, NULL);

-- ======================================================
-- VERIFICAR DADOS
-- ======================================================
SELECT * FROM projetos;
SELECT * FROM tarefas;
