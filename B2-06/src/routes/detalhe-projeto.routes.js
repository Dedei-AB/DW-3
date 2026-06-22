// @file: src/routes/detalhe-projeto.routes.js
import { DetalheProjetoController } from "../controllers/detalhe-projeto.controller.js";
import { DetalheProjetoService } from "../services/detalhe-projeto.service.js";
import { DetalheProjetoRepository } from "../repositories/detalhe-projeto.repository.js";

export default async function detalheProjetoRoutes(server) {
  const repository = new DetalheProjetoRepository();
  const service = new DetalheProjetoService(repository);
  const controller = new DetalheProjetoController(service);

  server.get("/detalhes-projeto", (request, reply) =>
    controller.listar(request, reply)
  );

  server.get("/detalhes-projeto/:projetoId", (request, reply) =>
    controller.buscarPorProjeto(request, reply)
  );

  server.post("/detalhes-projeto", (request, reply) =>
    controller.criar(request, reply)
  );

  server.patch("/detalhes-projeto/:projetoId", (request, reply) =>
    controller.atualizar(request, reply)
  );

  server.delete("/detalhes-projeto/:projetoId", (request, reply) =>
    controller.remover(request, reply)
  );
}
