TRUNCATE TABLE tarefas_tags, detalhes_projeto, tags, tarefas, projetos RESTART IDENTITY CASCADE;

INSERT INTO projetos (nome) VALUES
  ('Projeto API DW3'),
  ('Projeto Banco Relacional'),
  ('Projeto Integração Frontend');

INSERT INTO tarefas (descricao, concluido, projeto_id) VALUES
  ('Criar endpoints do projeto', false, 1),
  ('Integrar PostgreSQL', false, 1),
  ('Refatorar Repository', false, 2),
  ('Modelar relacionamentos N:N', false, 2),
  ('Ajustar resposta da API', true, 3);

INSERT INTO detalhes_projeto (projeto_id, descricao_longa, observacoes, prazo_final)
VALUES (
  1,
  'Projeto focado na evolução da API de tarefas',
  'Organizar endpoints e persistência',
  '2026-07-10'
)
ON CONFLICT DO NOTHING;

INSERT INTO tags (nome) VALUES
  ('backend'),
  ('postgres'),
  ('api'),
  ('arquitetura'),
  ('urgente')
ON CONFLICT (nome) DO NOTHING;

INSERT INTO tarefas_tags (tarefa_id, tag_id) VALUES
  (2, 1),
  (2, 2),
  (2, 3),
  (3, 1),
  (3, 4)
ON CONFLICT (tarefa_id, tag_id) DO NOTHING;
