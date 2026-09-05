// @file: src/server.js
import Fastify from "fastify";
import tarefaRoutes from "./routes/tarefa.routes.js";
import projetoRoutes from "./routes/projeto.routes.js";
import detalheProjetoRoutes from "./routes/detalhe-projeto.routes.js";
import tagRoutes from "./routes/tag.routes.js";
import { AppError } from "./errors/AppError.js";
import client from "./database/client.js";

const server = Fastify({ logger: true });

// ==========================================
// TRATAMENTO DE ERROS GLOBAL
// ==========================================
server.setErrorHandler((error, request, reply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message,
    });
  }

  console.error("🔥 ERRO INTERNO:", error);

  return reply.status(500).send({
    status: "error",
    message: "Internal Server Error",
  });
});

// ==========================================
// REGISTRO DE ROTAS
// ==========================================
server.register(projetoRoutes, { prefix: "/projetos" });
server.register(tarefaRoutes, { prefix: "/tarefas" });
server.register(detalheProjetoRoutes);
server.register(tagRoutes);

const start = async () => {
  try {
    await client.connect();
    console.log("✅ Conectado ao PostgreSQL com sucesso!");
  } catch (error) {
    console.error("❌ Falha na conexão com o banco de dados:", error.message);
    process.exit(1);
  }

  await server.listen({ port: 3000 });
};
start();
