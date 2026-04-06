import fs from "fs";
import path from "path";
const tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true },
  { id: 4, descricao: "Estudar JavaScript", concluido: true },
];

export async function tarefaRoutes(server) {
  // R: Ler todas as tarefas (com filtro opcional usando Query String)
  server.get("/", async (request, reply) => {
    // request.query acessa os parâmetros passados na URL após o '?' (ex: ?busca=estudar)
    const busca = request.query.busca;

    if (busca) {
      // Filtra as tarefas garantindo a busca correta independente de maiúsculas/minúsculas
      const tarefasFiltradas = tarefas.filter((t) =>
        t.descricao.toLowerCase().includes(busca.toLowerCase()),
      );
      return reply.send(tarefasFiltradas);
    }

    return reply.send(tarefas);
  });

  server.post("/", async (request, reply) => {
    const { descricao } = request.body;

    // Exercício 1: Validação de dados
    if (!descricao || descricao.trim() === "") {
      return reply.status(400).send({
        status: "error",
        message: "A descrição da tarefa é obrigatória",
      });
    }

    // Gerando um ID automaticamente no Backend
    const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;
    const novaTarefa = { id: novoId, descricao, concluido: false };

    tarefas.push(novaTarefa);
    // Retornar 201 Created é uma boa prática ao criar um recurso
    return reply.status(201).send(novaTarefa);
  });

  // R: Ler uma tarefa específica (READ)
  server.get("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const tarefa = tarefas.find((t) => t.id === id);

    if (!tarefa) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    reply.send(tarefa);
  });

  // U: Atualizar uma tarefa parcialmente (UPDATE - PATCH)
  server.patch("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    const tarefaAtualizada = request.body;
    tarefas[index] = { ...tarefas[index], ...tarefaAtualizada, id };

    return reply.send(tarefas[index]);
  });

  // Exercício 2: Rota de "Toggle" Concluir (PATCH)
  server.patch("/:id/concluir", async (request, reply) => {
    const id = Number(request.params.id);
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    tarefas[index].concluido = !tarefas[index].concluido;
    return reply.send(tarefas[index]);
  });

  // D: Deletar uma tarefa (DELETE)
  server.delete("/:id", async (request, reply) => {
    const id = Number(request.params.id);
    const index = tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    tarefas.splice(index, 1);
    // 204 No Content indica sucesso sem corpo de resposta
    return reply.status(204).send();
  });

  // Exercício 4: Rota de Estatísticas/Resumo (GET)
  server.get("/resumo", async (request, reply) => {
    const total = tarefas.length;
    const concluidas = tarefas.filter((t) => t.concluido).length;
    const pendentes = total - concluidas;

    return reply.send({
      total,
      concluidas,
      pendentes,
    });
  });
}
