// @file: src/controllers/tarefa.controller.js
export class TarefaController {
  constructor(service) {
    this.service = service;
  }

  // ======================================================
  // GET /tarefas - Listar todas as tarefas
  // ======================================================
  async listar(request, reply) {
    const tarefas = await this.service.listarTarefas();
    return reply.send(tarefas);
  }

  // ======================================================
  // GET /tarefas/:id - Buscar tarefa por ID
  // ======================================================
  async buscar(request, reply) {
    const { id } = request.params;
    const tarefa = await this.service.buscarPorId(id);
    return reply.send(tarefa);
  }

  // ======================================================
  // GET /tarefas/projeto/:projetoId - Listar tarefas de um projeto
  // ======================================================
  async buscarPorProjeto(request, reply) {
    const { projetoId } = request.params;
    const tarefas = await this.service.buscarPorProjeto(projetoId);
    return reply.send(tarefas);
  }

  // ======================================================
  // POST /tarefas - Criar nova tarefa
  // ETAPA 2: Agora aceita projetoId no request.body
  // ======================================================
  async criar(request, reply) {
    const tarefa = await this.service.criarTarefa(request.body);
    return reply.status(201).send(tarefa);
  }

  // ======================================================
  // PATCH /tarefas/:id - Atualizar tarefa
  // ======================================================
  async atualizar(request, reply) {
    const { id } = request.params;
    const tarefa = await this.service.atualizarTarefa(id, request.body);
    return reply.send(tarefa);
  }

  // ======================================================
  // DELETE /tarefas/:id - Remover tarefa
  // ======================================================
  async remover(request, reply) {
    const { id } = request.params;
    await this.service.removerTarefa(id);
    return reply.status(204).send();
  }
}
