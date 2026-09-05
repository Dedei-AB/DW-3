-- ======================================================
-- ROTEIRO 13: MODELANDO RELACIONAMENTOS 1:N NO BACKEND
-- Scripts de Migração do Banco de Dados
-- ======================================================

-- ======================================================
-- ETAPA 1: CRIAR TABELA PROJETOS
-- ======================================================
-- Cria a entidade "Projeto" que será o lado "1" do relacionamento 1:N
-- Uma Projeto pode ter N Tarefas

CREATE TABLE IF NOT EXISTS projetos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT NOW()
);

-- ======================================================
-- ETAPA 2: ADICIONAR COLUNA projeto_id EM tarefas
-- ======================================================
-- Adiciona a coluna que será a chave estrangeira (Foreign Key)
-- Isso vincula cada tarefa a um projeto

-- NOTA: Se a tabela já existe, use ALTER TABLE
-- Se está criando do zero, crie a tabela com a coluna já presente

ALTER TABLE tarefas
ADD COLUMN IF NOT EXISTS projeto_id INTEGER,
ADD CONSTRAINT fk_tarefas_projetos
FOREIGN KEY (projeto_id) REFERENCES projetos(id)
ON DELETE SET NULL;  -- Se um projeto for deletado, as tarefas terão projeto_id = NULL

-- ======================================================
-- ETAPA 3: INSERIR PROJETOS DE EXEMPLO
-- ======================================================
-- Dados iniciais para testar o relacionamento 1:N

INSERT INTO projetos (nome) VALUES
  ('Desenvolvimento Web'),
  ('Estudos de Backend'),
  ('Projeto Pessoal')
ON CONFLICT DO NOTHING;  -- Previne erro se os dados já existem

-- ======================================================
-- ETAPA 4: INSERIR TAREFAS DE EXEMPLO
-- ======================================================
-- Tarefas vinculadas aos projetos criados

-- Limpar tarefas antigas (opcional)
-- DELETE FROM tarefas;

-- Inserir novas tarefas com projeto_id
INSERT INTO tarefas (descricao, concluido, projeto_id) VALUES
  ('Implementar validação de formulário', false, 1),
  ('Criar página de login', false, 1),
  ('Estudar padrão Repository', true, 2),
  ('Implementar autenticação JWT', false, 2),
  ('Fazer exercícios de JavaScript', false, 3),
  ('Tarefa sem projeto', false, NULL)
ON CONFLICT DO NOTHING;

-- ======================================================
-- TESTES: VERIFICAR SE TUDO FUNCIONOU
-- ======================================================

-- Ver a estrutura da tabela tarefas
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'tarefas'
ORDER BY ordinal_position;

-- Ver todos os projetos
SELECT * FROM projetos;

-- Ver todas as tarefas com dados do projeto (LEFT JOIN)
SELECT
  t.id,
  t.descricao,
  t.concluido,
  t.criada_em,
  p.nome AS projeto_nome
FROM tarefas t
LEFT JOIN projetos p ON t.projeto_id = p.id
ORDER BY t.id;

-- Ver tarefas de um projeto específico (INNER JOIN)
SELECT
  t.id,
  t.descricao,
  t.concluido,
  t.criada_em,
  p.nome AS projeto_nome
FROM tarefas t
INNER JOIN projetos p ON t.projeto_id = p.id
WHERE p.id = 1
ORDER BY t.id;
