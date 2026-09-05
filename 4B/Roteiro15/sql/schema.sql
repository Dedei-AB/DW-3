DROP TABLE IF EXISTS tarefas_tags;
DROP TABLE IF EXISTS detalhes_projeto;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS tarefas;
DROP TABLE IF EXISTS projetos;

CREATE TABLE projetos (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL
);

CREATE TABLE tarefas (
  id SERIAL PRIMARY KEY,
  descricao TEXT NOT NULL,
  concluido BOOLEAN NOT NULL DEFAULT false,
  projeto_id INTEGER NOT NULL,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

CREATE TABLE detalhes_projeto (
  id SERIAL PRIMARY KEY,
  projeto_id INTEGER NOT NULL UNIQUE,
  descricao_longa TEXT,
  observacoes TEXT,
  prazo_final DATE,
  FOREIGN KEY (projeto_id) REFERENCES projetos(id) ON DELETE CASCADE
);

CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE
);

CREATE TABLE tarefas_tags (
  tarefa_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  PRIMARY KEY (tarefa_id, tag_id),
  FOREIGN KEY (tarefa_id) REFERENCES tarefas(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
