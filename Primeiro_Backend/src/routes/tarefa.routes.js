import {
  listarTarefas,
  criarTarefa,
  obterResumo,
  obterTarefa,
  atualizarTarefa,
  concluirTarefa,
  removerTarefa,
} from "../controller/tarefa.controller.js";

export async function tarefaRoutes(server) {
  // R: Ler todas as tarefas (sem ID, não precisa mudar)
  server.get("/", async (request, reply) => {
    console.log("Router: GET /tarefas chamada");
    await listarTarefas(request, reply);
  });

  // C: Criar tarefa (sem ID, não precisa mudar)
  server.post("/", async (request, reply) => {
    console.log("Router: POST /tarefas chamada");
    await criarTarefa(request, reply);
  });

  // Exercício 4: Rota de Estatísticas/Resumo (sem ID, não precisa mudar)
  server.get("/resumo", async (request, reply) => {
    console.log("Router GET /tarefas/resumo chamado");
    await obterResumo(request, reply);
  });

  // R: Ler uma tarefa específica (PRECISA DE CONVERSÃO)
  server.get("/:id", async (request, reply) => {
    console.log("Router: GET /tarefas/:id chamada");

    // Converte e valida o ID
    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply
        .status(400)
        .send({ error: "ID inválido. Deve ser um número." });
    }
    request.params.id = id; // Atualiza o valor no request para o controller usar

    await obterTarefa(request, reply);
  });

  // U: Atualizar uma tarefa parcialmente (PRECISA DE CONVERSÃO)
  server.patch("/:id", async (request, reply) => {
    console.log("Router: PATCH /tarefas/:id chamado");

    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply
        .status(400)
        .send({ error: "ID inválido. Deve ser um número." });
    }
    request.params.id = id;

    await atualizarTarefa(request, reply);
  });

  // Exercício 2: Rota de "Toggle" Concluir (PRECISA DE CONVERSÃO)
  server.patch("/:id/concluir", async (request, reply) => {
    console.log("Router: PATCH /tarefas/:id/concluir chamado");

    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply
        .status(400)
        .send({ error: "ID inválido. Deve ser um número." });
    }
    request.params.id = id;

    await concluirTarefa(request, reply);
  });

  // D: Deletar uma tarefa (PRECISA DE CONVERSÃO)
  server.delete("/:id", async (request, reply) => {
    console.log("Router: DELETE /tarefas/:id chamado");

    const id = Number(request.params.id);
    if (isNaN(id)) {
      return reply
        .status(400)
        .send({ error: "ID inválido. Deve ser um número." });
    }
    request.params.id = id;

    await removerTarefa(request, reply);
  });
}
