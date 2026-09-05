// @file: src/repositories/tag.repository.js
// ======================================================
// ROTEIRO 14: Relacionamento N:N - TagRepository
// ======================================================
// Gerencia tags e suas associações com tarefas

import client from "../database/client.js";

export class TagRepository {
  // ======================================================
  // LISTAR TODAS AS TAGS
  // ======================================================
  async buscarTodos() {
    const resultado = await client.query(`
      SELECT
        id,
        nome,
        criada_em
      FROM tags
      ORDER BY nome
    `);

    return resultado.rows;
  }

  // ======================================================
  // BUSCAR TAG POR ID
  // ======================================================
  async buscarPorId(id) {
    const resultado = await client.query(
      `
      SELECT
        id,
        nome,
        criada_em
      FROM tags
      WHERE id = $1
    `,
      [id]
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // BUSCAR TAG POR NOME
  // ======================================================
  async buscarPorNome(nome) {
    const resultado = await client.query(
      `
      SELECT
        id,
        nome,
        criada_em
      FROM tags
      WHERE nome = $1
    `,
      [nome]
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // CRIAR NOVA TAG
  // ======================================================
  async salvar(tag) {
    const resultado = await client.query(
      `
      INSERT INTO tags (nome)
      VALUES ($1)
      RETURNING id, nome, criada_em
    `,
      [tag.nome]
    );

    return resultado.rows[0];
  }

  // ======================================================
  // ATUALIZAR TAG
  // ======================================================
  async atualizar(id, dados) {
    const resultado = await client.query(
      `
      UPDATE tags
      SET nome = $1
      WHERE id = $2
      RETURNING id, nome, criada_em
    `,
      [dados.nome, id]
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // REMOVER TAG
  // ======================================================
  async remover(id) {
    const resultado = await client.query(`
      DELETE FROM tags
      WHERE id = $1
    `, [id]);

    return resultado.rowCount > 0;
  }

  // ======================================================
  // BUSCAR TAGS DE UMA TAREFA (RELAÇÃO N:N)
  // ======================================================
  async buscarTagsPorTarefaId(tarefaId) {
    const resultado = await client.query(
      `
      SELECT
        t.id,
        t.nome,
        t.criada_em
      FROM tags t
      INNER JOIN tarefas_tags tt ON t.id = tt.tag_id
      WHERE tt.tarefa_id = $1
      ORDER BY t.nome
    `,
      [tarefaId]
    );

    return resultado.rows;
  }

  // ======================================================
  // ASSOCIAR TAG A UMA TAREFA (N:N - INSERT na tabela associativa)
  // ======================================================
  async associarTarefa(tarefaId, tagId) {
    try {
      const resultado = await client.query(
        `
        INSERT INTO tarefas_tags (tarefa_id, tag_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
        RETURNING tarefa_id, tag_id
      `,
        [tarefaId, tagId]
      );

      return resultado.rowCount > 0;
    } catch (error) {
      // Chave estrangeira inválida ou erro de constraint
      throw error;
    }
  }

  // ======================================================
  // DESASSOCIAR TAG DE UMA TAREFA (N:N - DELETE da tabela associativa)
  // ======================================================
  async desassociarTarefa(tarefaId, tagId) {
    const resultado = await client.query(
      `
      DELETE FROM tarefas_tags
      WHERE tarefa_id = $1 AND tag_id = $2
    `,
      [tarefaId, tagId]
    );

    return resultado.rowCount > 0;
  }

  // ======================================================
  // REMOVER TODAS AS TAGS DE UMA TAREFA
  // ======================================================
  async removerTodasTagsTarefa(tarefaId) {
    const resultado = await client.query(
      `
      DELETE FROM tarefas_tags
      WHERE tarefa_id = $1
    `,
      [tarefaId]
    );

    return resultado.rowCount > 0;
  }

  // ======================================================
  // CONTAR QUANTAS TAREFAS TEM CADA TAG (AGREGAÇÃO)
  // ======================================================
  async buscarTagsComContagem() {
    const resultado = await client.query(`
      SELECT
        t.id,
        t.nome,
        t.criada_em,
        COUNT(tt.tarefa_id) AS quantidade_tarefas
      FROM tags t
      LEFT JOIN tarefas_tags tt ON t.id = tt.tag_id
      GROUP BY t.id, t.nome, t.criada_em
      ORDER BY quantidade_tarefas DESC, t.nome
    `);

    return resultado.rows;
  }

  // ======================================================
  // ENCONTRAR TAREFAS COM MÚLTIPLAS TAGS
  // ======================================================
  async buscarTarefasComMultiplasTags(minTags = 2) {
    const resultado = await client.query(
      `
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        COUNT(tg.id) AS quantidade_tags,
        STRING_AGG(tg.nome, ', ') AS tags_associadas
      FROM tarefas t
      INNER JOIN tarefas_tags tt ON t.id = tt.tarefa_id
      INNER JOIN tags tg ON tt.tag_id = tg.id
      GROUP BY t.id, t.descricao, t.concluido
      HAVING COUNT(tg.id) >= $1
      ORDER BY quantidade_tags DESC, t.id
    `,
      [minTags]
    );

    return resultado.rows;
  }
}
