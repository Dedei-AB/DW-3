// @file: src/ROUTES/tarefa.routes.js
import model from "../models/tarefa.model.js";

class TarefasController {
  constructor() {
    this.model = model;
  }
  // Processa requisições da rota `GET /tarefas`
  async listarTarefas(request, reply) {
    // LOG para indicar que a função foi chamada
    console.log("Controller: listarTarefas chamado");

    const { busca } = request.query;

    const resultado = await this.model.listar({ busca });
    /* ------------------------------------------------------------------------ */

    return reply.send(resultado);
  }

  // Processa requisições da rota `POST /tarefas`
  async criarTarefa(request, reply) {
    console.log("Controller: criarTarefa chamado");

    const { descricao } = request.body;
    if (!descricao || descricao.trim() === "") {
      return reply.status(400).send({
        status: "error",
        message: "A descrição da tarefa é obrigatória",
      });
    }

    const resultado = await this.model.criar(descricao);

    return reply.status(201).send(resultado);
  }

  // Processa requisições da rota `GET /tarefas/resumo`
  async obterResumo(request, reply) {
    console.log("Controller: obterResumo chamado");

    return reply.send(await this.model.resumo());
  }

  // Processa requisições da rota `GET /tarefas/:id`
  async obterTarefa(request, reply) {
    console.log("Controller: obterTarefa chamado");

    const id = Number(request.params.id);

    const resultado = await this.model.buscarPorId(id);

    if (!resultado) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    return reply.send(resultado);
  }

  // Processa requisições da rota `PATCH /tarefas/:id`
  async atualizarTarefa(request, reply) {
    console.log("Controller: atualizarTarefa chamado");

    const id = Number(request.params.id);
    const { dados } = request.body;

    const resultado = await this.model.atualizar(id, dados);

    if (!resultado) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    return reply.send(resultado);
  }

  // Processa requisições da rota `PATCH /tarefas/:id/concluir`
  async concluirTarefa(request, reply) {
    console.log("Controller: concluirTarefa chamado");
    const id = Number(request.params.id);

    const resultado = await this.model.alternarConcluido(id);
    if (!resultado) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    return reply.send(resultado);
  }

  // Processa requisições da rota `DELETE /tarefas/:id`
  async removerTarefa(request, reply) {
    console.log("Controller: removerTarefa chamado");
    const id = Number(request.params.id);
    const resultado = await this.model.remover(id);

    if (!resultado) {
      return reply
        .status(404)
        .send({ status: "error", message: "Tarefa não encontrada" });
    }

    return reply.status(204).send(resultado);
  }
}

export default new TarefasController();
