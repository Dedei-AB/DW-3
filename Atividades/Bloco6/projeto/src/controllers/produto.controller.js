import ProdutoModel from "../models/produto.model.js";

export default class ProdutoController {
  constructor() {
    this.model = new ProdutoModel();
  }

  async getAll(req, reply) {
    const produtos = await this.model.findAll();
    return reply.send(produtos);
  }

  async getById(req, reply) {
    const produto = await this.model.findById(Number(req.params.id));
    if (!produto)
      return reply.code(404).send({ erro: "Produto não encontrado." });
    return reply.send(produto);
  }

  async create(req, reply) {
    const resultado = ProdutoModel.validar(req.body);
    if (!resultado.valido) {
      return reply.code(400).send({ erros: resultado.erros });
    }
    const produto = await this.model.create(req.body);
    return reply.code(201).send(produto);
  }

  async delete(req, reply) {
    const removido = await this.model.delete(Number(req.params.id));
    if (!removido)
      return reply.code(404).send({ erro: "Produto não encontrado." });
    return reply.code(204).send();
  }
}
