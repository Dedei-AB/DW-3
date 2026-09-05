// @file: src/server.js
import Fastify from "fastify";
import tarefaRoutes from "./routes/tarefa.routes.js";
import projetoRoutes from "./routes/projeto.routes.js";
import { AppError } from "./errors/AppError.js";
import client from "./database/client.js";

const server = Fastify({ logger: true });

// ==========================================
// TRATAMENTO DE ERROS GLOBAL (A Rede de Segurança)
// ==========================================
server.setErrorHandler((error, request, reply) => {
  // 1. Verifica se o erro foi intencional (Regra de Negócio / Validação)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: "error",
      message: error.message,
    });
  }

  // 2. Se o erro NÃO for um AppError, é um erro inesperado
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
