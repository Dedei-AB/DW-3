// @file: src/controllers/tag.controller.js
export class TagController {
  constructor(service) {
    this.service = service;
  }

  async listar(request, reply) {
    const tags = await this.service.listarTags();
    return reply.send(tags);
  }

  async buscar(request, reply) {
    const { id } = request.params;
    const tag = await this.service.buscarPorId(id);
    return reply.send(tag);
  }

  async criar(request, reply) {
    const tag = await this.service.criarTag(request.body);
    return reply.status(201).send(tag);
  }

  async atualizar(request, reply) {
    const { id } = request.params;
    const tag = await this.service.atualizarTag(id, request.body);
    return reply.send(tag);
  }

  async remover(request, reply) {
    const { id } = request.params;
    await this.service.removerTag(id);
    return reply.status(204).send();
  }

  async listarTagsTarefa(request, reply) {
    const { tarefaId } = request.params;
    const tags = await this.service.buscarTagsTarefa(tarefaId);
    return reply.send(tags);
  }

  async associarTarefa(request, reply) {
    const { tarefaId } = request.params;
    const { tagId } = request.body;

    if (!tagId) {
      return reply.status(400).send({ erro: "tagId obrigatório" });
    }

    const sucesso = await this.service.associarTagTarefa(tarefaId, tagId);
    return reply.status(201).send({ sucesso });
  }

  async desassociarTarefa(request, reply) {
    const { tarefaId, tagId } = request.params;
    const sucesso = await this.service.desassociarTagTarefa(tarefaId, tagId);
    return reply.send({ sucesso });
  }

  async listarTarefasComMultiplasTags(request, reply) {
    const { minTags = 2 } = request.query;
    const tarefas = await this.service.buscarTarefasComMultiplasTags(
      parseInt(minTags)
    );
    return reply.send(tarefas);
  }
}
