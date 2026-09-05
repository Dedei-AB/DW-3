class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotFoundError";
  }
}

const usuarios = [
  { id: 1, nome: "Ana" },
  { id: 2, nome: "Bruno" },
  { id: 3, nome: "Carla" },
];

function buscarUsuarioPorId(id) {
  if (typeof id !== "number") {
    throw new ValidationError("ID deve ser numérico");
  }

  const usuario = usuarios.find((u) => u.id === id);

  if (!usuario) {
    throw new NotFoundError("Usuário não encontrado");
  }

  return usuario;
}

try {
  const usuario = buscarUsuarioPorId(1);
  console.log(usuario);
} catch (erro) {
  console.log(`${erro.name}: ${erro.message}`);
}
