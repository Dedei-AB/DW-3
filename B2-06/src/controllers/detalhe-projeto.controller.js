// @file: src/controllers/detalhe-projeto.controller.js
export class DetalheProjetoController {
  constructor(service) {
    this.service = service;
  }

  async listar(request, reply) {
    const detalhes = await this.service.listarDetalhes();
    return reply.send(detalhes);
  }

  async buscarPorProjeto(request, reply) {
    const { projetoId } = request.params;
    const detalhe = await this.service.buscarPorProjetoId(projetoId);
    return reply.send(detalhe);
  }

  async criar(request, reply) {
    const detalhe = await this.service.criarDetalhe(request.body);
    return reply.status(201).send(detalhe);
  }

  async atualizar(request, reply) {
    const { projetoId } = request.params;
    const detalhe = await this.service.atualizarDetalhe(projetoId, request.body);
    return reply.send(detalhe);
  }

  async remover(request, reply) {
    const { projetoId } = request.params;
    await this.service.removerDetalhe(projetoId);
    return reply.status(204).send();
  }
}
