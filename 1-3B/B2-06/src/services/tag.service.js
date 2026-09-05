// @file: src/services/tag.service.js
import { AppError } from "../errors/AppError.js";

export class TagService {
  constructor(repository) {
    this.repository = repository;
  }

  async listarTags() {
    return await this.repository.buscarTodos();
  }

  async buscarPorId(id) {
    const tag = await this.repository.buscarPorId(id);
    if (!tag) {
      throw new AppError("Tag não encontrada", 404);
    }
    return tag;
  }

  async criarTag(dados) {
    if (!dados.nome || dados.nome.trim() === "") {
      throw new AppError("O nome da tag é obrigatório", 400);
    }

    // Verificar duplicação
    const tagExistente = await this.repository.buscarPorNome(dados.nome);
    if (tagExistente) {
      throw new AppError("Uma tag com este nome já existe", 400);
    }

    return await this.repository.salvar({
      nome: dados.nome.trim(),
    });
  }

  async atualizarTag(id, dados) {
    await this.buscarPorId(id);

    if (dados.nome !== undefined && dados.nome.trim() === "") {
      throw new AppError("O nome da tag não pode ser vazio", 400);
    }

    return await this.repository.atualizar(id, dados);
  }

  async removerTag(id) {
    await this.buscarPorId(id);

    return await this.repository.remover(id);
  }

  async buscarTagsTarefa(tarefaId) {
    return await this.repository.buscarTagsPorTarefaId(tarefaId);
  }

  async associarTagTarefa(tarefaId, tagId) {
    // Validar que a tag existe
    await this.buscarPorId(tagId);

    return await this.repository.associarTarefa(tarefaId, tagId);
  }

  async desassociarTagTarefa(tarefaId, tagId) {
    return await this.repository.desassociarTarefa(tarefaId, tagId);
  }

  async buscarTarefasComMultiplasTags(minTags = 2) {
    return await this.repository.buscarTarefasComMultiplasTags(minTags);
  }
}
