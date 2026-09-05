// @file: src/repositories/tarefa.repository.js
// ======================================================
// ROTEIRO 14: Tarefa com Suporte a N:N (Tags)
// ======================================================
// ⭐ ETAPA 3: Modificações para incluir tags

import client from "../database/client.js";

export class TarefaRepository {
  // ======================================================
  // 1. LISTAR TODAS AS TAREFAS COM PROJETO (Mantido de B2-05)
  // ======================================================
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
  // 2. BUSCAR TAREFA POR ID COM TAGS ⭐ (MODIFICADO - ETAPA 3)
  // ======================================================
  // Strategy 1: UMA query com GROUP_AGG (achatamento)
  // Retorna uma única linha com string agregada de tags
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
        p.criado_em AS projeto_criado_em,
        STRING_AGG(tg.nome, ', ' ORDER BY tg.nome) AS tags_str,
        JSON_AGG(
          JSON_BUILD_OBJECT('id', tg.id, 'nome', tg.nome)
          ORDER BY tg.nome
        ) FILTER (WHERE tg.id IS NOT NULL) AS tags_json
      FROM tarefas t
      LEFT JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN tarefas_tags tt ON t.id = tt.tarefa_id
      LEFT JOIN tags tg ON tt.tag_id = tg.id
      WHERE t.id = $1
      GROUP BY t.id, t.descricao, t.concluido, t.criada_em, t.projeto_id, p.nome, p.criado_em
    `,
      [id]
    );

    if (resultado.rows.length === 0) {
      return null;
    }

    const row = resultado.rows[0];

    // Mapear a resposta: tags como array de objetos
    return {
      id: row.id,
      descricao: row.descricao,
      concluido: row.concluido,
      criada_em: row.criada_em,
      projeto_id: row.projeto_id,
      projeto_nome: row.projeto_nome,
      projeto_criado_em: row.projeto_criado_em,
      tags: row.tags_json || [], // Array de { id, nome }
    };
  }

  // ======================================================
  // 2B. ALTERNATIVA: buscarPorId SEM USAR JSON_AGG (mais explícito)
  // ======================================================
  // Use esta versão se JSON_AGG não funcionar no seu PostgreSQL
  async buscarPorIdAlt(id) {
    // Query 1: Buscar tarefa e projeto
    const tarefaResult = await client.query(
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
      [id]
    );

    if (tarefaResult.rows.length === 0) {
      return null;
    }

    const tarefa = tarefaResult.rows[0];

    // Query 2: Buscar tags da tarefa
    const tagsResult = await client.query(
      `
      SELECT
        tg.id,
        tg.nome
      FROM tags tg
      INNER JOIN tarefas_tags tt ON tg.id = tt.tag_id
      WHERE tt.tarefa_id = $1
      ORDER BY tg.nome
    `,
      [id]
    );

    // Retornar tarefa com array de tags
    return {
      ...tarefa,
      tags: tagsResult.rows,
    };
  }

  // ======================================================
  // 3. BUSCAR TAREFAS POR PROJETO COM TAGS
  // ======================================================
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
        STRING_AGG(tg.nome, ', ' ORDER BY tg.nome) AS tags_str
      FROM tarefas t
      INNER JOIN projetos p ON t.projeto_id = p.id
      LEFT JOIN tarefas_tags tt ON t.id = tt.tarefa_id
      LEFT JOIN tags tg ON tt.tag_id = tg.id
      WHERE t.projeto_id = $1
      GROUP BY t.id, t.descricao, t.concluido, t.criada_em, t.projeto_id, p.nome
      ORDER BY t.id
    `,
      [projetoId]
    );

    return resultado.rows;
  }

  // ======================================================
  // 4. CRIAR NOVA TAREFA
  // ======================================================
  async salvar(tarefa) {
    const resultado = await client.query(
      `
      INSERT INTO tarefas (descricao, concluido, projeto_id)
      VALUES ($1, $2, $3)
      RETURNING id, descricao, concluido, criada_em, projeto_id
    `,
      [tarefa.descricao, tarefa.concluido || false, tarefa.projetoId || null]
    );

    return resultado.rows[0];
  }

  // ======================================================
  // 5. ATUALIZAR TAREFA
  // ======================================================
  async atualizar(id, dados) {
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
    const resultado = await client.query(`
      DELETE FROM tarefas
      WHERE id = $1
    `, [id]);

    return resultado.rowCount > 0;
  }
}
