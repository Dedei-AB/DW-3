// @file: src/controllers/projeto.controller.js
export class ProjetoController {
  constructor(service) {
    this.service = service;
  }

  // ======================================================
  // GET /projetos - Listar todos os projetos
  // ======================================================
  async listar(request, reply) {
    const projetos = await this.service.listarProjetos();
    return reply.send(projetos);
  }

  // ======================================================
  // GET /projetos/:id - Buscar projeto por ID
  // ======================================================
  async buscar(request, reply) {
    const { id } = request.params;
    const projeto = await this.service.buscarPorId(id);
    return reply.send(projeto);
  }

  // ======================================================
  // POST /projetos - Criar novo projeto
  // ======================================================
  async criar(request, reply) {
    const projeto = await this.service.criarProjeto(request.body);
    return reply.status(201).send(projeto);
  }

  // ======================================================
  // PATCH /projetos/:id - Atualizar projeto
  // ======================================================
  async atualizar(request, reply) {
    const { id } = request.params;
    const projeto = await this.service.atualizarProjeto(id, request.body);
    return reply.send(projeto);
  }

  // ======================================================
  // DELETE /projetos/:id - Remover projeto
  // ======================================================
  async remover(request, reply) {
    const { id } = request.params;
    await this.service.removerProjeto(id);
    return reply.status(204).send();
  }
}
