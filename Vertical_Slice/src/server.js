// @file: src/server.js (Exemplo de como deve ficar)

import Fastify from "fastify";
// Atualize o caminho da importação para buscar na nova pasta de features
import tarefaRoutes from "./features/tarefas/tarefas.routes.js";

const server = Fastify({ logger: true });
const PORT = 3000;

// Registra as rotas da feature de tarefas
server.register(tarefaRoutes);

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
