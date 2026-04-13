// @file: src/MODEL/tarefa.model.js

const tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true },
  { id: 4, descricao: "Estudar JavaScript", concluido: true },
];

// Função para listar todas as tarefas. Ela pode receber opções de filtro, como busca por descrição ou filtro por status de conclusão.
export async function listar(opcoes) {
  console.log("Model: listar chamado");

  const { busca } = opcoes;
  let resultado = tarefas;
  if (busca) {
    resultado = resultado.filter((t) =>
      t.descricao.toLowerCase().includes(busca.toLowerCase()),
    );
  }

  return resultado;
}

// Função para criar uma nova tarefa. Ela recebe a descrição da tarefa como parâmetro e retorna a tarefa criada.
export async function criar(descricao) {
  console.log("Model: criar chamado");

  // Gerando um ID automaticamente no Backend
  const novoId = tarefas.length > 0 ? tarefas[tarefas.length - 1].id + 1 : 1;
  const novaTarefa = { id: novoId, descricao, concluido: false };

  tarefas.push(novaTarefa);
  return novaTarefa;
}

// Função para obter os detalhes de uma tarefa específica. Ela recebe o ID da tarefa como parâmetro e retorna a tarefa correspondente.
export async function buscarPorId(id) {
  console.log("Model: buscarPorId chamado");

  const tarefa = tarefas.find((t) => t.id === id);

  return tarefa;
}

// Função para atualizar uma tarefa existente. Ela recebe o ID da tarefa e os dados atualizados como parâmetros, e retorna a tarefa atualizada.
export async function atualizar(id, dadosAtualizados) {
  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    return undefined;
  }

  tarefas[index] = { ...tarefas[index], ...dadosAtualizados, id };

  return tarefas[index];
}

// Função para alternar o status de conclusão de uma tarefa. Ela recebe o ID da tarefa como parâmetro.
export async function alternarConcluido(id) {
  console.log("Model: alternarConcluido chamado");

  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    return undefined;
  }

  tarefas[index].concluido = !tarefas[index].concluido;
  return tarefas[index];
}

// Função para remover uma tarefa. Ela recebe o ID da tarefa como parâmetro.
export async function remover(id) {
  console.log("Model: remover chamado");
  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    return undefined;
  }

  tarefas.splice(index, 1);
  return { tarefas };
}

// Função para obter o resumo das tarefas (quantas estão pendentes, quantas estão concluídas).
export async function resumo() {
  console.log("Model: resumo chamado");

  const total = tarefas.length;
  const concluidas = tarefas.filter((t) => t.concluido).length;
  const pendentes = total - concluidas;

  return { total, concluidas, pendentes };
}
