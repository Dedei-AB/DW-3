import client from "../../database/client.js";

export default async function laboratorioRoutes(server) {
  // GET /laboratorio/tarefas-db - Buscar todas as tarefas do banco
  server.get("/laboratorio/tarefas-db", async (request, reply) => {
    try {
      const resultado = await client.query(`
        SELECT id, descricao, concluido, criada_em
        FROM tarefas
        ORDER BY id
      `);

      return reply.send(resultado.rows);
    } catch (error) {
      console.error("Erro ao buscar tarefas do banco:", error);
      return reply.status(500).send({
        status: "error",
        message: "Erro ao buscar tarefas do banco de dados",
      });
    }
  });

  // POST /laboratorio/tarefas-db - Criar nova tarefa no banco
  server.post("/laboratorio/tarefas-db", async (request, reply) => {
    try {
      const { descricao } = request.body;

      // Validação da descrição
      if (
        !descricao ||
        typeof descricao !== "string" ||
        descricao.trim() === ""
      ) {
        return reply.status(400).send({
          status: "error",
          message: "Descrição é obrigatória e deve ser uma string não vazia",
        });
      }

      // Executar INSERT com SQL parametrizado
      const resultado = await client.query(
        `INSERT INTO tarefas (descricao)
         VALUES ($1)
         RETURNING id, descricao, concluido, criada_em`,
        [descricao.trim()],
      );

      return reply.status(201).send(resultado.rows[0]);
    } catch (error) {
      console.error("Erro ao criar tarefa no banco:", error);
      return reply.status(500).send({
        status: "error",
        message: "Erro ao criar tarefa no banco de dados",
      });
    }
  });

  server.get(
    "/laboratorio/tarefas-db/filtrar-concluidas",
    async (request, reply) => {
      try {
        const resultado = await client.query(`
        SELECT id, descricao, concluido, criada_em
        FROM tarefas
        WHERE concluido = true
        ORDER BY id
      `);

        return reply.send(resultado.rows);
      } catch (error) {
        console.error("Erro ao buscar tarefas concluídas do banco:", error);
        return reply.status(500).send({
          status: "error",
          message: "Erro ao buscar tarefas concluídas do banco de dados",
        });
      }
    },
  );

  server.patch("/laboratorio/tarefas-db/:id/concluir", async () => {
    try {
      const { id } = request.params;
      if (!id || isNaN(parseInt(id))) {
        return reply.status(400).send({
          status: "error",
          message: "ID inválido. Deve ser um número.",
        });
      }

      const resultado = await client.query(
        `UPDATE tarefas
         SET concluido = true
         WHERE id = $1
         RETURNING id, descricao, concluido, criada_em`,
        [parseInt(id)],
      );

      if (resultado.rowCount === 0) {
        return reply.status(404).send({
          status: "error",
          message: "Tarefa não encontrada",
        });
      }

      return reply.send(resultado.rows[0]);
    } catch (error) {
      console.error("Erro ao concluir tarefa no banco:", error);
      return reply.status(500).send({
        status: "error",
        message: "Erro ao concluir tarefa no banco de dados",
      });
    }
  });
}
