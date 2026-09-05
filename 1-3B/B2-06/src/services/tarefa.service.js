// @file: src/services/tarefa.service.js
import { AppError } from "../errors/AppError.js";

export class TarefaService {
  constructor(repository) {
    this.repository = repository;
  }

  async listarTarefas() {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id) {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa) {
      throw new AppError("Tarefa não encontrada", 404);
    }
    return tarefa;
  }

  async buscarPorProjeto(projetoId) {
    return await this.repository.buscarPorProjeto(projetoId);
  }

  async criarTarefa(dados) {
    if (!dados.descricao || dados.descricao.trim() === "") {
      throw new AppError("A descrição é obrigatória", 400);
    }

    return await this.repository.salvar({
      descricao: dados.descricao.trim(),
      concluido: dados.concluido || false,
      projetoId: dados.projetoId || null,
    });
  }

  async atualizarTarefa(id, dados) {
    await this.buscarPorId(id);

    if (dados.descricao !== undefined && dados.descricao.trim() === "") {
      throw new AppError("A descrição não pode ser vazia", 400);
    }

    return await this.repository.atualizar(id, dados);
  }

  async removerTarefa(id) {
    await this.buscarPorId(id);

    return await this.repository.remover(id);
  }
}
