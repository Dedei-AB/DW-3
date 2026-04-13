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
  // R: Ler todas as tarefas (com filtro opcional usando Query String)
  server.get("/", async (request, reply) => {
    console.log("Router: GET /tarefas chamada");
    // Chama a função do controller;
    await listarTarefas(request, reply);
  });

  server.post("/", async (request, reply) => {
    console.log("Router: POST /tarefas chamada");
    // Chama a função do controller;
    await criarTarefa(request, reply);
  });

  // Exercício 4: Rota de Estatísticas/Resumo (GET)
  server.get("/resumo", async (request, reply) => {
    console.log("Router GET /tarefas/resumo chamado");
    // Chama a função de controller;
    await obterResumo(request, reply);
  });

  // R: Ler uma tarefa específica (READ)
  server.get("/:id", async (request, reply) => {
    console.log("Router: GET /tarefas/:id chamada");
    // Chama a função do controller;
    await obterTarefa(request, reply);
  });

  // U: Atualizar uma tarefa parcialmente (UPDATE - PATCH)
  server.patch("/:id", async (request, reply) => {
    console.log("Router: /tarefas/:id chamado");

    await atualizarTarefa(request, reply);
  });

  // Exercício 2: Rota de "Toggle" Concluir (PATCH)
  server.patch("/:id/concluir", async (request, reply) => {
    console.log("Router /tarefas/:id/concluir");

    await concluirTarefa(request, reply);
  });

  // D: Deletar uma tarefa (DELETE)
  server.delete("/:id", async (request, reply) => {
    console.log("Router /tarefas/:id chamado");

    await removerTarefa(request, reply);
  });
}
