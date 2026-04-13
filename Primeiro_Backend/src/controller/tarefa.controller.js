// @file: src/ROUTES/tarefa.routes.js
import {
  listar,
  criar,
  buscarPorId,
  atualizar,
  alternarConcluido,
  remover,
  resumo,
} from "../models/tarefa.model.js";

// Processa requisições da rota `GET /tarefas`
export async function listarTarefas(request, reply) {
  // LOG para indicar que a função foi chamada
  console.log("Controller: listarTarefas chamado");

  const { busca } = request.query;

  const resultado = await listar({ busca });
  /* ------------------------------------------------------------------------ */

  return reply.send(resultado);
}

// Processa requisições da rota `POST /tarefas`
export async function criarTarefa(request, reply) {
  console.log("Controller: criarTarefa chamado");

  const { descricao } = request.body;
  if (!descricao || descricao.trim() === "") {
    return reply.status(400).send({
      status: "error",
      message: "A descrição da tarefa é obrigatória",
    });
  }

  const resultado = await criar(descricao);

  return reply.status(201).send(resultado);
}

// Processa requisições da rota `GET /tarefas/resumo`
export async function obterResumo(request, reply) {
  console.log("Controller: obterResumo chamado");

  return reply.send(await resumo());
}

// Processa requisições da rota `GET /tarefas/:id`
export async function obterTarefa(request, reply) {
  console.log("Controller: obterTarefa chamado");

  const id = Number(request.params.id);

  const resultado = await buscarPorId(id);

  if (!resultado) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  return reply.send(resultado);
}

// Processa requisições da rota `PATCH /tarefas/:id`
export async function atualizarTarefa(request, reply) {
  console.log("Controller: atualizarTarefa chamado");

  const id = Number(request.params.id);
  const { dados } = request.body;

  const resultado = await atualizar(id, dados);

  if (!resultado) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  return reply.send(resultado);
}

// Processa requisições da rota `PATCH /tarefas/:id/concluir`
export async function concluirTarefa(request, reply) {
  console.log("Controller: concluirTarefa chamado");
  const id = Number(request.params.id);

  const resultado = await alternarConcluido(id);
  if (!resultado) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  return reply.send(resultado);
}

// Processa requisições da rota `DELETE /tarefas/:id`
export async function removerTarefa(request, reply) {
  console.log("Controller: removerTarefa chamado");
  const id = Number(request.params.id);
  const resultado = await remover(id);

  if (!resultado) {
    return reply
      .status(404)
      .send({ status: "error", message: "Tarefa não encontrada" });
  }

  return reply.status(204).send(resultado);
}
