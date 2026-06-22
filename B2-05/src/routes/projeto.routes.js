// @file: src/routes/projeto.routes.js
import { ProjetoController } from "../controllers/projeto.controller.js";
import { ProjetoService } from "../services/projeto.service.js";
import { ProjetoRepository } from "../repositories/projeto.repository.js";

export default async function projetoRoutes(server) {
  const repository = new ProjetoRepository();
  const service = new ProjetoService(repository);
  const controller = new ProjetoController(service);

  // GET /projetos - Listar todos os projetos
  server.get("/projetos", (request, reply) =>
    controller.listar(request, reply),
  );

  // GET /projetos/:id - Buscar projeto por ID
  server.get("/projetos/:id", (request, reply) =>
    controller.buscar(request, reply),
  );

  // POST /projetos - Criar novo projeto
  server.post("/projetos", (request, reply) =>
    controller.criar(request, reply),
  );

  // PATCH /projetos/:id - Atualizar projeto
  server.patch("/projetos/:id", (request, reply) =>
    controller.atualizar(request, reply),
  );

  // DELETE /projetos/:id - Remover projeto
  server.delete("/projetos/:id", (request, reply) =>
    controller.remover(request, reply),
  );
}
