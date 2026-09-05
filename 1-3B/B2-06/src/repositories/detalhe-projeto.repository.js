// @file: src/repositories/detalhe-projeto.repository.js
// ======================================================
// ROTEIRO 14: Relacionamento 1:1 - DetalheProjetoRepository
// ======================================================
// Gerencia detalhes de projeto (1:1 com projetos)

import client from "../database/client.js";

export class DetalheProjetoRepository {
  // ======================================================
  // BUSCAR DETALHES POR PROJETO_ID
  // ======================================================
  async buscarPorProjetoId(projetoId) {
    const resultado = await client.query(
      `
      SELECT
        dp.id,
        dp.projeto_id,
        dp.descricao_longa,
        dp.observacoes,
        dp.prazo_final,
        dp.criado_em
      FROM detalhes_projeto dp
      WHERE dp.projeto_id = $1
    `,
      [projetoId]
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // BUSCAR TODOS OS DETALHES (com dados do projeto)
  // ======================================================
  async buscarTodos() {
    const resultado = await client.query(`
      SELECT
        dp.id,
        dp.projeto_id,
        dp.descricao_longa,
        dp.observacoes,
        dp.prazo_final,
        dp.criado_em,
        p.nome AS projeto_nome
      FROM detalhes_projeto dp
      INNER JOIN projetos p ON dp.projeto_id = p.id
      ORDER BY dp.id
    `);

    return resultado.rows;
  }

  // ======================================================
  // CRIAR DETALHE PARA UM PROJETO (1:1 - UNIQUE)
  // ======================================================
  async salvar(detalhe) {
    const resultado = await client.query(
      `
      INSERT INTO detalhes_projeto (projeto_id, descricao_longa, observacoes, prazo_final)
      VALUES ($1, $2, $3, $4)
      RETURNING id, projeto_id, descricao_longa, observacoes, prazo_final, criado_em
    `,
      [
        detalhe.projetoId,
        detalhe.descricaoLonga || null,
        detalhe.observacoes || null,
        detalhe.prazoFinal || null,
      ]
    );

    return resultado.rows[0];
  }

  // ======================================================
  // ATUALIZAR DETALHES DO PROJETO
  // ======================================================
  async atualizar(projetoId, dados) {
    const campos = [];
    const valores = [];
    let indiceParametro = 1;

    if (dados.descricaoLonga !== undefined) {
      campos.push(`descricao_longa = $${indiceParametro}`);
      valores.push(dados.descricaoLonga || null);
      indiceParametro++;
    }

    if (dados.observacoes !== undefined) {
      campos.push(`observacoes = $${indiceParametro}`);
      valores.push(dados.observacoes || null);
      indiceParametro++;
    }

    if (dados.prazoFinal !== undefined) {
      campos.push(`prazo_final = $${indiceParametro}`);
      valores.push(dados.prazoFinal || null);
      indiceParametro++;
    }

    if (campos.length === 0) {
      return null;
    }

    valores.push(projetoId);

    const sql = `
      UPDATE detalhes_projeto
      SET ${campos.join(", ")}
      WHERE projeto_id = $${indiceParametro}
      RETURNING id, projeto_id, descricao_longa, observacoes, prazo_final, criado_em
    `;

    const resultado = await client.query(sql, valores);
    return resultado.rows[0] || null;
  }

  // ======================================================
  // REMOVER DETALHES DO PROJETO
  // ======================================================
  async remover(projetoId) {
    const resultado = await client.query(`
      DELETE FROM detalhes_projeto
      WHERE projeto_id = $1
    `, [projetoId]);

    return resultado.rowCount > 0;
  }
}
