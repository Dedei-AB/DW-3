// @file: src/routes/tag.routes.js
import { TagController } from "../controllers/tag.controller.js";
import { TagService } from "../services/tag.service.js";
import { TagRepository } from "../repositories/tag.repository.js";

export default async function tagRoutes(server) {
  const repository = new TagRepository();
  const service = new TagService(repository);
  const controller = new TagController(service);

  server.get("/tags", (request, reply) =>
    controller.listar(request, reply)
  );

  server.get("/tags/:id", (request, reply) =>
    controller.buscar(request, reply)
  );

  server.post("/tags", (request, reply) =>
    controller.criar(request, reply)
  );

  server.patch("/tags/:id", (request, reply) =>
    controller.atualizar(request, reply)
  );

  server.delete("/tags/:id", (request, reply) =>
    controller.remover(request, reply)
  );

  // N:N - Operações da relação Tarefas ↔ Tags
  server.get("/tarefas/:tarefaId/tags", (request, reply) =>
    controller.listarTagsTarefa(request, reply)
  );

  server.post("/tarefas/:tarefaId/tags", (request, reply) =>
    controller.associarTarefa(request, reply)
  );

  server.delete("/tarefas/:tarefaId/tags/:tagId", (request, reply) =>
    controller.desassociarTarefa(request, reply)
  );

  // Queries especiais
  server.get("/tags/tarefas/multiplas", (request, reply) =>
    controller.listarTarefasComMultiplasTags(request, reply)
  );
}
