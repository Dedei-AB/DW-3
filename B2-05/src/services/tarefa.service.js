// @file: src/services/tarefa.service.js
import { AppError } from "../errors/AppError.js";

export class TarefaService {
  constructor(repository) {
    this.repository = repository;
  }

  // ======================================================
  // LISTAR TODAS AS TAREFAS
  // ======================================================
  async listarTarefas() {
    return await this.repository.buscarTodos();
  }

  // ======================================================
  // BUSCAR TAREFA POR ID
  // ======================================================
  async buscarPorId(id) {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa) {
      throw new AppError("Tarefa não encontrada", 404);
    }
    return tarefa;
  }

  // ======================================================
  // LISTAR TAREFAS DE UM PROJETO ESPECÍFICO
  // ======================================================
  async buscarPorProjeto(projetoId) {
    return await this.repository.buscarPorProjeto(projetoId);
  }

  // ======================================================
  // CRIAR NOVA TAREFA COM PROJETO
  // ======================================================
  async criarTarefa(dados) {
    // Validação: descrição obrigatória
    if (!dados.descricao || dados.descricao.trim() === "") {
      throw new AppError("A descrição é obrigatória", 400);
    }

    // projetoId é opcional (pode ser null)
    // O banco de dados via FK vai validar se o projetoId existe quando não for null

    return await this.repository.salvar({
      descricao: dados.descricao.trim(),
      concluido: dados.concluido || false,
      projetoId: dados.projetoId || null,
    });
  }

  // ======================================================
  // ATUALIZAR TAREFA
  // ======================================================
  async atualizarTarefa(id, dados) {
    // Buscar tarefa para garantir que existe
    await this.buscarPorId(id);

    // Validações opcionais
    if (dados.descricao !== undefined && dados.descricao.trim() === "") {
      throw new AppError("A descrição não pode ser vazia", 400);
    }

    return await this.repository.atualizar(id, dados);
  }

  // ======================================================
  // REMOVER TAREFA
  // ======================================================
  async removerTarefa(id) {
    // Buscar tarefa para garantir que existe
    await this.buscarPorId(id);

    return await this.repository.remover(id);
  }
}
