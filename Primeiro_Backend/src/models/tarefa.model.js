// @file: src/MODEL/tarefa.model.js

class TarefaModel {
  constructor() {
    this.tarefas = [
      { id: 1, descricao: "Fazer compras", concluido: false },
      { id: 2, descricao: "Lavar o carro", concluido: false },
      { id: 3, descricao: "Estudar Fastify", concluido: true },
      { id: 4, descricao: "Estudar JavaScript", concluido: true },
    ];
  }

  // Função para listar todas as tarefas. Ela pode receber opções de filtro, como busca por descrição ou filtro por status de conclusão.
  async listar(opcoes) {
    console.log("Model: listar chamado");

    const { busca } = opcoes;
    let resultado = this.tarefas;
    if (busca) {
      resultado = resultado.filter((t) =>
        t.descricao.toLowerCase().includes(busca.toLowerCase()),
      );
    }

    return resultado;
  }

  // Função para criar uma nova tarefa. Ela recebe a descrição da tarefa como parâmetro e retorna a tarefa criada.
  async criar(descricao) {
    console.log("Model: criar chamado");

    // Gerando um ID automaticamente no Backend
    const novoId =
      this.tarefas.length > 0
        ? this.tarefas[this.tarefas.length - 1].id + 1
        : 1;
    const novaTarefa = { id: novoId, descricao, concluido: false };

    this.tarefas.push(novaTarefa);
    return novaTarefa;
  }

  // Função para obter os detalhes de uma tarefa específica. Ela recebe o ID da tarefa como parâmetro e retorna a tarefa correspondente.
  async buscarPorId(id) {
    console.log("Model: buscarPorId chamado");

    const tarefa = this.tarefas.find((t) => t.id === id);

    return tarefa;
  }

  // Função para atualizar uma tarefa existente. Ela recebe o ID da tarefa e os dados atualizados como parâmetros, e retorna a tarefa atualizada.
  async atualizar(id, dadosAtualizados) {
    const index = this.tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return undefined;
    }

    this.tarefas[index] = { ...this.tarefas[index], ...dadosAtualizados, id };

    return this.tarefas[index];
  }

  // Função para alternar o status de conclusão de uma tarefa. Ela recebe o ID da tarefa como parâmetro.
  async alternarConcluido(id) {
    console.log("Model: alternarConcluido chamado");

    const index = this.tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return undefined;
    }

    this.tarefas[index].concluido = !this.tarefas[index].concluido;
    return this.tarefas[index];
  }

  // Função para remover uma tarefa. Ela recebe o ID da tarefa como parâmetro.
  async remover(id) {
    console.log("Model: remover chamado");
    const index = this.tarefas.findIndex((t) => t.id === id);

    if (index === -1) {
      return undefined;
    }

    this.tarefas.splice(index, 1);
    return { tarefas: this.tarefas };
  }

  // Função para obter o resumo das tarefas (quantas estão pendentes, quantas estão concluídas).
  async resumo() {
    console.log("Model: resumo chamado");

    const total = this.tarefas.length;
    const concluidas = this.tarefas.filter((t) => t.concluido).length;
    const pendentes = total - concluidas;

    return { total, concluidas, pendentes };
  }
}

export default new TarefaModel();
