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

  // Exercício 1 e 2: Listar com filtros por descrição e/ou concluído
  async listarComFiltros(filtros = {}) {
    let sql = `SELECT id, descricao, concluido, criada_em FROM tarefas WHERE 1=1`;
    const parametros = [];
    let indiceParametro = 1;

    // Filtro por descrição (Exercício 1)
    if (filtros.descricao) {
      sql += ` AND descricao ILIKE $${indiceParametro}`;
      parametros.push(`%${filtros.descricao}%`);
      indiceParametro++;
    }

    // Filtro por concluído (Exercício 2)
    if (filtros.concluido !== undefined && filtros.concluido !== null) {
      sql += ` AND concluido = $${indiceParametro}`;
      parametros.push(filtros.concluido);
      indiceParametro++;
    }

    sql += ` ORDER BY id`;

    const resultado = await client.query(sql, parametros);
    return resultado.rows;
  }

  // Exercício 3: Obter resumo com agregações SQL
  async obterResumo() {
    const resultado = await client.query(`
      SELECT
        COUNT(*) as total,
        COUNT(CASE WHEN concluido = true THEN 1 END) as concluidas,
        COUNT(CASE WHEN concluido = false THEN 1 END) as pendentes
      FROM tarefas
    `);

    const linha = resultado.rows[0];
    return {
      total: parseInt(linha.total),
      concluidas: parseInt(linha.concluidas),
      pendentes: parseInt(linha.pendentes),
    };
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
