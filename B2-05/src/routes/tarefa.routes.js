// @file: src/routes/tarefa.routes.js
import { TarefaController } from "../controllers/tarefa.controller.js";
import { TarefaService } from "../services/tarefa.service.js";
import { TarefaRepository } from "../repositories/tarefa.repository.js";

export default async function tarefaRoutes(server) {
  const repository = new TarefaRepository();
  const service = new TarefaService(repository);
  const controller = new TarefaController(service);

  // GET /tarefas - Listar todas as tarefas
  server.get("/tarefas", (request, reply) => controller.listar(request, reply));

  // GET /tarefas/:id - Buscar tarefa por ID
  server.get("/tarefas/:id", (request, reply) =>
    controller.buscar(request, reply),
  );

  // GET /tarefas/projeto/:projetoId - Listar tarefas de um projeto
  server.get("/tarefas/projeto/:projetoId", (request, reply) =>
    controller.buscarPorProjeto(request, reply),
  );

  // POST /tarefas - Criar nova tarefa
  server.post("/tarefas", (request, reply) => controller.criar(request, reply));

  // PATCH /tarefas/:id - Atualizar tarefa
  server.patch("/tarefas/:id", (request, reply) =>
    controller.atualizar(request, reply),
  );

  // DELETE /tarefas/:id - Remover tarefa
  server.delete("/tarefas/:id", (request, reply) =>
    controller.remover(request, reply),
  );
}
