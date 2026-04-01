import Fastify from "fastify";

const server = Fastify({ logger: true });
const PORT = 3000;

const tarefas = [
  { id: 1, descricao: "Fazer compras", concluido: false },
  { id: 2, descricao: "Lavar o carro", concluido: false },
  { id: 3, descricao: "Estudar Fastify", concluido: true },
];

server.get("/", async (request, reply) => {
  console.log("Nova requisição");
  reply.send("Linux > Windows > MacOS");
});

server.delete("/tarefas/:id", async (request, reply) => {
  const id = request.params.id;

  const index = tarefas.findIndex((t) => t.id === parseInt(id));

  if (index === -1) {
    return reply.status(404).send({ error: "Tarefa não encontrada" });
  }

  tarefas.splice(index, 1);
  return reply.status(204).send();
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
