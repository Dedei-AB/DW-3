// @file: src/repositories/tarefa.repository.js
// ======================================================
// ROTEIRO 13: Relacionamentos 1:N - TarefaRepository
// ======================================================
// Neste repositório, implementamos:
// 1. Salvar tarefa com projeto_id (foreign key)
// 2. Buscar todas as tarefas com dados do projeto (LEFT JOIN)
// 3. Buscar tarefa por ID com dados do projeto (LEFT JOIN)
// 4. Buscar tarefas por projeto específico (INNER JOIN)

import client from "../database/client.js";

export class TarefaRepository {
  // ======================================================
  // 1. LISTAR TODAS AS TAREFAS COM DADOS DO PROJETO (LEFT JOIN)
  // ======================================================
  // LEFT JOIN garante que tarefas SEM projeto apareçam na listagem
  async buscarTodos() {
    const resultado = await client.query(`
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        t.criada_em,
        t.projeto_id,
        p.nome AS projeto_nome,
        p.criado_em AS projeto_criado_em
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      ORDER BY t.id
    `);

    return resultado.rows;
  }

  // ======================================================
  // 2. BUSCAR TAREFA POR ID COM DADOS DO PROJETO (LEFT JOIN)
  // ======================================================
  async buscarPorId(id) {
    const resultado = await client.query(
      `
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        t.criada_em,
        t.projeto_id,
        p.nome AS projeto_nome,
        p.criado_em AS projeto_criado_em
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      WHERE t.id = $1
    `,
      [id],
    );

    return resultado.rows[0] || null;
  }

  // ======================================================
  // 3. BUSCAR TAREFAS POR PROJETO ESPECÍFICO (INNER JOIN)
  // ======================================================
  // INNER JOIN garante que APENAS tarefas com projeto apareçam
  async buscarPorProjeto(projetoId) {
    const resultado = await client.query(
      `
      SELECT
        t.id,
        t.descricao,
        t.concluido,
        t.criada_em,
        t.projeto_id,
        p.nome AS projeto_nome,
        p.criado_em AS projeto_criado_em
      FROM tarefas t
      INNER JOIN projetos p ON t.projeto_id = p.id
      WHERE t.projeto_id = $1
      ORDER BY t.id
    `,
      [projetoId],
    );

    return resultado.rows;
  }

  // ======================================================
  // 4. CRIAR NOVA TAREFA COM PROJETO_ID (FOREIGN KEY)
  // ======================================================
  // Convertemos projetoId (CamelCase JS) para projeto_id (SnakeCase SQL)
  async salvar(tarefa) {
    const resultado = await client.query(
      `
      INSERT INTO tarefas (descricao, concluido, projeto_id)
      VALUES ($1, $2, $3)
      RETURNING
        id,
        descricao,
        concluido,
        criada_em,
        projeto_id
    `,
      [tarefa.descricao, tarefa.concluido || false, tarefa.projetoId || null],
    );

    return resultado.rows[0];
  }

  // ======================================================
  // 5. ATUALIZAR TAREFA (pode trocar de projeto)
  // ======================================================
  async atualizar(id, dados) {
    // Construir dinamicamente quais campos serão atualizados
    const campos = [];
    const valores = [];
    let indiceParametro = 1;

    if (dados.descricao !== undefined) {
      campos.push(`descricao = $${indiceParametro}`);
      valores.push(dados.descricao);
      indiceParametro++;
    }

    if (dados.concluido !== undefined) {
      campos.push(`concluido = $${indiceParametro}`);
      valores.push(dados.concluido);
      indiceParametro++;
    }

    if (dados.projetoId !== undefined) {
      campos.push(`projeto_id = $${indiceParametro}`);
      valores.push(dados.projetoId || null);
      indiceParametro++;
    }

    if (campos.length === 0) {
      return null;
    }

    // Adicionar o ID ao final da lista de valores
    valores.push(id);

    const sql = `
      UPDATE tarefas
      SET ${campos.join(", ")}
      WHERE id = $${indiceParametro}
      RETURNING id, descricao, concluido, criada_em, projeto_id
    `;

    const resultado = await client.query(sql, valores);
    return resultado.rows[0] || null;
  }

  // ======================================================
  // 6. REMOVER TAREFA
  // ======================================================
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
