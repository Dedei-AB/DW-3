// @file: src/routes/projeto.routes.js
import { ProjetoController } from "../controllers/projeto.controller.js";
import { ProjetoService } from "../services/projeto.service.js";
import { ProjetoRepository } from "../repositories/projeto.repository.js";

export default async function projetoRoutes(server) {
  const repository = new ProjetoRepository();
  const service = new ProjetoService(repository);
  const controller = new ProjetoController(service);

  server.get("/projetos", (request, reply) =>
    controller.listar(request, reply),
  );

  server.get("/projetos/:id", (request, reply) =>
    controller.buscar(request, reply),
  );

  server.post("/projetos", (request, reply) =>
    controller.criar(request, reply),
  );

  server.patch("/projetos/:id", (request, reply) =>
    controller.atualizar(request, reply),
  );

  server.delete("/projetos/:id", (request, reply) =>
    controller.remover(request, reply),
  );
}
