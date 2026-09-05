// @file: src/services/projeto.service.js
import { AppError } from "../errors/AppError.js";

export class ProjetoService {
  constructor(repository) {
    this.repository = repository;
  }

  async listarProjetos() {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id) {
    const projeto = await this.repository.buscarPorId(id);
    if (!projeto) {
      throw new AppError("Projeto não encontrado", 404);
    }
    return projeto;
  }

  async criarProjeto(dados) {
    if (!dados.nome || dados.nome.trim() === "") {
      throw new AppError("O nome do projeto é obrigatório", 400);
    }

    return await this.repository.salvar({
      nome: dados.nome.trim(),
    });
  }

  async atualizarProjeto(id, dados) {
    await this.buscarPorId(id);

    if (dados.nome !== undefined && dados.nome.trim() === "") {
      throw new AppError("O nome do projeto não pode ser vazio", 400);
    }

    return await this.repository.atualizar(id, dados);
  }

  async removerProjeto(id) {
    await this.buscarPorId(id);

    return await this.repository.remover(id);
  }
}
