// @file: src/repositories/projeto.repository.js
// ======================================================
// ROTEIRO 13: Relacionamentos 1:N - ProjetoRepository
// ======================================================

import client from "../database/client.js";

export class ProjetoRepository {
  // ======================================================
  // LISTAR TODOS OS PROJETOS
  // ======================================================
  async buscarTodos() {
    const resultado = await client.query(`
      SELECT id, nome, criado_em
      FROM projetos
      ORDER BY id
    `);

    return resultado.rows;
  }

  // ======================================================
  // BUSCAR PROJETO POR ID
  // ======================================================
  async buscarPorId(id) {
    const resultado = await client.query(
      `
      SELECT id, nome, criado_em
      FROM projetos
      WHERE id = $1
    `,
      [id],
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // CRIAR NOVO PROJETO
  // ======================================================
  async salvar(projeto) {
    const resultado = await client.query(
      `
      INSERT INTO projetos (nome)
      VALUES ($1)
      RETURNING id, nome, criado_em
    `,
      [projeto.nome],
    );

    return resultado.rows[0];
  }

  // ======================================================
  // ATUALIZAR PROJETO
  // ======================================================
  async atualizar(id, dados) {
    const resultado = await client.query(
      `
      UPDATE projetos
      SET nome = $1
      WHERE id = $2
      RETURNING id, nome, criado_em
    `,
      [dados.nome, id],
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // REMOVER PROJETO
  // ======================================================
  async remover(id) {
    const resultado = await client.query(
      `
      DELETE FROM projetos
      WHERE id = $1
    `,
      [id],
    );

    return resultado.rowCount > 0;
  }
}
