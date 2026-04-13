import Fastify from "fastify";
import cors from "@fastify/cors";
import { tarefaRoutes } from "./routes/tarefa.routes.js";

const server = Fastify();
const PORT = 3000;

// Habilita o CORS para permitir requisições do Frontend
server.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
});

server.register(tarefaRoutes, { prefix: "/tarefas" });

server.setNotFoundHandler((request, reply) => {
  reply.code(404).send({
    status: "error",
    message: "O recurso solicitado não existe nesta API.",
  });
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
