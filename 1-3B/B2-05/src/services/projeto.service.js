// @file: src/services/projeto.service.js
import { AppError } from "../errors/AppError.js";

export class ProjetoService {
  constructor(repository) {
    this.repository = repository;
  }

  // ======================================================
  // LISTAR TODOS OS PROJETOS
  // ======================================================
  async listarProjetos() {
    return await this.repository.buscarTodos();
  }

  // ======================================================
  // BUSCAR PROJETO POR ID
  // ======================================================
  async buscarPorId(id) {
    const projeto = await this.repository.buscarPorId(id);
    if (!projeto) {
      throw new AppError("Projeto não encontrado", 404);
    }
    return projeto;
  }

  // ======================================================
  // CRIAR NOVO PROJETO
  // ======================================================
  async criarProjeto(dados) {
    // Validação: nome obrigatório
    if (!dados.nome || dados.nome.trim() === "") {
      throw new AppError("O nome do projeto é obrigatório", 400);
    }

    return await this.repository.salvar({
      nome: dados.nome.trim(),
    });
  }

  // ======================================================
  // ATUALIZAR PROJETO
  // ======================================================
  async atualizarProjeto(id, dados) {
    // Buscar projeto para garantir que existe
    await this.buscarPorId(id);

    // Validação
    if (dados.nome !== undefined && dados.nome.trim() === "") {
      throw new AppError("O nome do projeto não pode ser vazio", 400);
    }

    return await this.repository.atualizar(id, dados);
  }

  // ======================================================
  // REMOVER PROJETO
  // ======================================================
  async removerProjeto(id) {
    // Buscar projeto para garantir que existe
    await this.buscarPorId(id);

    return await this.repository.remover(id);
  }
}
