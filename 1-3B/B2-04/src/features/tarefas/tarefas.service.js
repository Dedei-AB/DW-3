// @file: src/features/tarefas/tarefas.service.js
import { AppError } from "../../errors/AppError.js";

export class TarefaService {
  constructor(repository) {
    this.repository = repository;
  }

  async listarTarefas(filtros = {}) {
    // Exercício 1 e 2: Delegar filtros para o Repository (executar no banco de dados)
    // Isso é mais eficiente do que carregar todas as tarefas e filtrar em memória

    const filtrosRepository = {};

    // Suportar "busca" (compat. com código anterior) ou "descricao" (exercício 1)
    if (filtros.busca) {
      filtrosRepository.descricao = filtros.busca;
    } else if (filtros.descricao) {
      filtrosRepository.descricao = filtros.descricao;
    }

    // Suportar "status" (compat. com código anterior) ou "concluido" (exercício 2)
    if (filtros.status !== undefined) {
      // Converter "pendente" e "concluida" para booleano
      filtrosRepository.concluido =
        filtros.status === "concluida" || filtros.status === true;
    } else if (filtros.concluido !== undefined) {
      filtrosRepository.concluido = filtros.concluido;
    }

    return await this.repository.listarComFiltros(filtrosRepository);
  }

  // Exercício 3: Obter resumo das tarefas
  async obterResumo() {
    return await this.repository.obterResumo();
  }

  async buscarPorId(id) {
    const tarefa = await this.repository.buscarPorId(id);
    if (!tarefa) {
      // 404: Not Found (Não Encontrado)
      throw new AppError("Tarefa não encontrada", 404);
    }
    return tarefa;
  }

  async criarTarefa(dados) {
    if (!dados.descricao || dados.descricao.trim() === "") {
      throw new AppError("A descrição é obrigatória", 400);
    }

    const tarefas = await this.repository.listarTodos();
    const descricaoJaExiste = tarefas.some(
      (t) => t.descricao.toLowerCase() === dados.descricao.toLowerCase().trim(),
    );

    if (descricaoJaExiste) {
      throw new AppError("Já existe uma tarefa com essa descrição", 400);
    }

    return this.repository.salvar({
      descricao: dados.descricao,
      concluido: false,
    });
  }

  async atualizarTarefa(id, dados) {
    const tarefa = await this.buscarPorId(id); // Se não achar, o método acima já lança o AppError 404

    if (tarefa.concluido) {
      throw new AppError(
        "Não é possível atualizar uma tarefa já concluída",
        400,
      );
    }

    return this.repository.atualizar(id, dados);
  }

  async concluirTarefa(id) {
    const tarefa = await this.buscarPorId(id);

    const novoConcluido = !tarefa.concluido;
    return this.repository.atualizar(id, { concluido: novoConcluido });
  }

  async removerTarefa(id) {
    const tarefa = await this.buscarPorId(id);

    if (tarefa.concluido) {
      throw new AppError("Não é possível remover uma tarefa já concluída", 400);
    }

    return this.repository.remover(id);
  }

  // Exercício 3: Obter resumo das tarefas
  async obterResumo() {
    return await this.repository.obterResumo();
  }
}
