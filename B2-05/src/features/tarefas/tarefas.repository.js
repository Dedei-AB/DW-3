// @file: src/features/tarefas/tarefas.repository.js
import client from "../../database/client.js";

export class TarefaRepository {
  async listarTodos() {
    const resultado = await client.query(`
      SELECT id, descricao, concluido, criada_em
      FROM tarefas
      ORDER BY id
    `);

    return resultado.rows;
  }

  async buscarPorId(id) {
    const resultado = await client.query(
      `
        SELECT id, descricao, concluido, criada_em
        FROM tarefas
        WHERE id = $1
      `,
      [id],
    );

    return resultado.rows[0] ?? null;
  }

  async salvar(tarefa) {
    const resultado = await client.query(
      `
        INSERT INTO tarefas (descricao, concluido)
        VALUES ($1, $2)
        RETURNING id, descricao, concluido, criada_em
      `,
      [tarefa.descricao, tarefa.concluido],
    );

    return resultado.rows[0];
  }

  async atualizar(id, dadosAtualizados) {
    // 1. Buscar tarefa existente
    const tarefaExistente = await this.buscarPorId(id);
    if (!tarefaExistente) return null;

    // 2. Mesclar dados atuais e novos
    const dadosMerged = {
      descricao: dadosAtualizados.descricao ?? tarefaExistente.descricao,
      concluido: dadosAtualizados.concluido ?? tarefaExistente.concluido,
    };

    // 3. Executar UPDATE
    const resultado = await client.query(
      `
        UPDATE tarefas
        SET descricao = $1, concluido = $2
        WHERE id = $3
        RETURNING id, descricao, concluido, criada_em
      `,
      [dadosMerged.descricao, dadosMerged.concluido, id],
    );

    return resultado.rows[0] ?? null;
  }

  async remover(id) {
    const resultado = await client.query(
      `
        DELETE FROM tarefas
        WHERE id = $1
      `,
      [id],
    );

    return resultado.rowCount > 0;
  }
}
