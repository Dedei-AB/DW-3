// @file: src/services/detalhe-projeto.service.js
import { AppError } from "../errors/AppError.js";

export class DetalheProjetoService {
  constructor(repository) {
    this.repository = repository;
  }

  async listarDetalhes() {
    return await this.repository.buscarTodos();
  }

  async buscarPorProjetoId(projetoId) {
    const detalhe = await this.repository.buscarPorProjetoId(projetoId);
    if (!detalhe) {
      throw new AppError("Detalhe do projeto não encontrado", 404);
    }
    return detalhe;
  }

  async criarDetalhe(dados) {
    if (!dados.projetoId) {
      throw new AppError("O projetoId é obrigatório", 400);
    }

    // Validação: não pode criar dois detalhes para o mesmo projeto
    const detalheExistente = await this.repository.buscarPorProjetoId(
      dados.projetoId
    );
    if (detalheExistente) {
      throw new AppError(
        "Este projeto já possui um detalhe associado",
        400
      );
    }

    return await this.repository.salvar({
      projetoId: dados.projetoId,
      descricaoLonga: dados.descricaoLonga || null,
      observacoes: dados.observacoes || null,
      prazoFinal: dados.prazoFinal || null,
    });
  }

  async atualizarDetalhe(projetoId, dados) {
    await this.buscarPorProjetoId(projetoId);

    return await this.repository.atualizar(projetoId, dados);
  }

  async removerDetalhe(projetoId) {
    await this.buscarPorProjetoId(projetoId);

    return await this.repository.remover(projetoId);
  }
}
