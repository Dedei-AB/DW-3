// @file: src/controllers/tarefa.controller.js
export class TarefaController {
  constructor(service) {
    this.service = service;
  }

  async listar(request, reply) {
    const tarefas = await this.service.listarTarefas();
    return reply.send(tarefas);
  }

  async buscar(request, reply) {
    const { id } = request.params;
    const tarefa = await this.service.buscarPorId(id);
    return reply.send(tarefa);
  }

  async buscarPorProjeto(request, reply) {
    const { projetoId } = request.params;
    const tarefas = await this.service.buscarPorProjeto(projetoId);
    return reply.send(tarefas);
  }

  async criar(request, reply) {
    const tarefa = await this.service.criarTarefa(request.body);
    return reply.status(201).send(tarefa);
  }

  async atualizar(request, reply) {
    const { id } = request.params;
    const tarefa = await this.service.atualizarTarefa(id, request.body);
    return reply.send(tarefa);
  }

  async remover(request, reply) {
    const { id } = request.params;
    await this.service.removerTarefa(id);
    return reply.status(204).send();
  }
}
