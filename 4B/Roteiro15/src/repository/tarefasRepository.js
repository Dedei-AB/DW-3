import db from '../db.js';

const buscarPorId = async (id) => {
  const { rows } = await db.query(
    `
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        t.projeto_id,
        json_agg(
          json_build_object('id', tg.id, 'nome', tg.nome)
          ORDER BY tg.nome
        ) FILTER (WHERE tg.id IS NOT NULL) AS tags
      FROM tarefas t
      LEFT JOIN tarefas_tags tt
        ON tt.tarefa_id = t.id
      LEFT JOIN tags tg
        ON tg.id = tt.tag_id
      WHERE t.id = $1
      GROUP BY t.id
    `,
    [id],
  );

  if (!rows[0]) {
    return null;
  }

  return {
    ...rows[0],
    tags: rows[0].tags ?? [],
  };
};

export default {
  buscarPorId,
};
