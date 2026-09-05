// @file: src/features/tarefas/tarefa.routes.js

// 1. Os imports agora são locais (na mesma pasta), repare no './'
import { TarefaRepository } from "./tarefas.repository.js";
import { TarefaService } from "./tarefas.service.js";
import { TarefaController } from "./tarefas.controller.js";

export default async function tarefaRoutes(server) {
  // ==========================================
  // INJEÇÃO DE DEPENDÊNCIA (A MONTAGEM)
  // ==========================================

  const repository = new TarefaRepository();
  const service = new TarefaService(repository);
  const controller = new TarefaController(service);

  // ==========================================
  // REGISTRO DAS ROTAS
  // ==========================================

  server.get("/tarefas", async (request, reply) =>
    controller.listar(request, reply),
  );
  // Exercício 3: Rota de resumo - deve vir ANTES de /tarefas/:id
  server.get("/tarefas/resumo", async (request, reply) =>
    controller.resumo(request, reply),
  );
  server.post("/tarefas", async (request, reply) =>
    controller.criar(request, reply),
  );
  server.get("/tarefas/:id", async (request, reply) =>
    controller.buscar(request, reply),
  );
  server.patch("/tarefas/:id", async (request, reply) =>
    controller.atualizar(request, reply),
  );
  server.patch("/tarefas/:id/concluir", async (request, reply) =>
    controller.concluir(request, reply),
  );
  server.delete("/tarefas/:id", async (request, reply) =>
    controller.remover(request, reply),
  );
}
