import Fastify from "fastify";
import cors from "@fastify/cors";

const server = Fastify({ logger: true });
server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});
const PORT = 3000;

const tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true },
];

// Rota de busca de tarefas (GET /tarefas)
server.get("/tarefas", async (request, reply) => {
  let tarefasFiltradas = tarefas;

  const concluido = request.query.concluido;
  const descricao = request.query.busca;

  if (descricao !== undefined) {
    tarefasFiltradas = tarefasFiltradas.filter((t) =>
      t.descricao.toLowerCase().includes(String(descricao).toLowerCase()),
    );
  }
  if (concluido !== undefined) {
    tarefasFiltradas = tarefasFiltradas.filter(
      (t) => String(t.concluido) === concluido,
    );
  }

  return reply.send(tarefasFiltradas);
});

// Rota de criação de tarefa (POST /tarefas)
server.post("/tarefas", async (request, reply) => {
  const descricao = request.body.descricao;

  if (descricao === undefined || !descricao.trim()) {
    return reply.status(400).send({ error: "O campo 'descrição' está vazio." });
  }
  const novaTarefa = {
    id: tarefas.length + 1,
    descricao,
    concluido: false,
  };
  tarefas.push(novaTarefa);
  return reply.status(201).send(novaTarefa);
});

// Rota do checkbox (PATCH /tarefas/:id/concluir)
server.patch("/tarefas/:id/concluir", async (request, reply) => {
  const id = Number(request.params.id);
  const tarefa = tarefas.findIndex((t) => t.id === id);

  if (tarefa === -1) {
    return reply.status(404).send({ error: "Tarefa não encontrada." });
  }

  tarefas[tarefa].concluido = !tarefas[tarefa].concluido;
  return reply.send(tarefas[tarefa]);
});

// Rota de resumo (GET /tarefas/resumo)
server.get("/tarefas/resumo", async (request, reply) => {
  const resumoTarefas = {
    total: tarefas.length,
    concluidas: tarefas.filter((t) => t.concluido).length,
    pendentes: tarefas.filter((t) => !t.concluido).length,
  };
  return reply.send(resumoTarefas);
});

// Rota de exclusão de tarefa (DELETE /tarefas/:id)
server.delete("/tarefas/:id", async (request, reply) => {
  const id = Number(request.params.id);
  const index = tarefas.findIndex((t) => t.id === id);

  if (index === -1) {
    return reply.send(404).send({ error: "Tarefa não encontrada." });
  }

  tarefas.splice(index, 1);

  return reply.status(204).send(tarefas);
});

const start = async () => {
  try {
    await server.listen({ port: PORT });
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  } catch (erro) {
    console.error(erro);
    process.exit(1);
  }
};

start();
