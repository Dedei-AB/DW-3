import Fastify from "fastify";

const server = Fastify({ logger: true });

const tarefas = [
  { id: 1, titulo: "Comprar leite", concluida: false },
  { id: 2, titulo: "Estudar JavaScript", concluida: true },
  { id: 3, titulo: "Comprar lenço umedecido", concluida: false },
  { id: 4, titulo: "Comprar leite", concluida: false },
];

server.get("/", async (request, reply) => {
  console.log("Nova requisição");
  reply.send("Linux > Windows > MacOS");
});

server.get("/tarefas", async (request, reply) => {
  console.log("Tarefas request");
  reply.send(tarefas);
});

server.post("/tarefas", async (request, reply) => {
  const novaTarefa = request.body;
  tarefas.push(novaTarefa);
  reply.send({ status: "sucesso", tarefa: novaTarefa });
});

server.get("/json", async (request, reply) => {
  console.log("Json request");
  reply.send({ message: "Corinthians > Palmeiras" });
});

server.get("/html", async (request, reply) => {
  console.log("Html request");
  reply
    .type("text/html; charset=utf-8")
    .send(`<h1>Palmeiras não tem mundial 💩🤣🤣🤣</h1>`);
});

try {
  console.log("Servidor rodando na porta 3000: http://localhost:3000");
  await server.listen({ port: 3000 });
} catch (erro) {
  console.error("Erro ao iniciar o servidor:", erro);
}
