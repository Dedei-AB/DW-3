// @file: src/routes/tarefa.routes.js
import { TarefaController } from "../controllers/tarefa.controller.js";
import { TarefaService } from "../services/tarefa.service.js";
import { TarefaRepository } from "../repositories/tarefa.repository.js";

export default async function tarefaRoutes(server) {
  const repository = new TarefaRepository();
  const service = new TarefaService(repository);
  const controller = new TarefaController(service);

  server.get("/tarefas", (request, reply) =>
    controller.listar(request, reply)
  );

  server.get("/tarefas/:id", (request, reply) =>
    controller.buscar(request, reply)
  );

  server.get("/tarefas/projeto/:projetoId", (request, reply) =>
    controller.buscarPorProjeto(request, reply)
  );

  server.post("/tarefas", (request, reply) =>
    controller.criar(request, reply)
  );

  server.patch("/tarefas/:id", (request, reply) =>
    controller.atualizar(request, reply)
  );

  server.delete("/tarefas/:id", (request, reply) =>
    controller.remover(request, reply)
  );
}
