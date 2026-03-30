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

server.get("/tarefas", async (request, reply) => {
  const concluido = request.query.concluido;

  if (concluido !== undefined) {
    const tarefasFiltradas = tarefas.filter(
      (t) => String(t.concluido) === concluido,
    );
    return reply.send(tarefasFiltradas);
  }

  return reply.send(tarefas);
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
