// @file: src/repositories/tarefa.repository.js

export class TarefaRepository {
  #tarefas = [
    {
      id: 1,
      titulo: "Fazer compras",
      descricao: "Comprar pão e leite",
      concluido: false,
    },
    {
      id: 2,
      titulo: "Lavar o carro",
      descricao: "Lavar o carro e passar a aspiradora",
      concluido: false,
    },
    {
      id: 3,
      titulo: "Estudar Fastify",
      descricao: "Estudar a documentação do Fastify",
      concluido: true,
    },
    {
      id: 4,
      titulo: "Estudar JavaScript",
      descricao: "Praticar exercícios de JavaScript",
      concluido: true,
    },
  ];
  #proximoId = 5;

  async listarTodos() {
    return [...this.#tarefas];
  }

  async buscarPorId(id) {
    return this.#tarefas.find((t) => t.id === Number(id)) || null;
  }

  async salvar(tarefa) {
    const novaTarefa = {
      id: this.#proximoId++,
      ...tarefa,
      criadaEm: new Date().toISOString(),
    };
    this.#tarefas.push(novaTarefa);
    return novaTarefa;
  }

  async atualizar(id, dados) {
    const tarefa = await this.buscarPorId(id);
    if (!tarefa) return null;

    Object.assign(tarefa, dados);
    return tarefa;
  }

  async remover(id) {
    const index = this.#tarefas.findIndex((t) => t.id === Number(id));
    if (index === -1) return false;

    this.#tarefas.splice(index, 1);
    return true;
  }
}
