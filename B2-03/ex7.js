class ValidationError extends Error {
  constructor(message, details) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

function validarAluno(aluno) {
  const erros = [];

  if (!aluno.nome) {
    erros.push("Nome é obrigatório");
  }

  if (!aluno.email || !aluno.email.includes("@")) {
    erros.push("Email inválido");
  }

  if (typeof aluno.idade !== "number" || aluno.idade < 16) {
    erros.push("Idade deve ser maior ou igual a 16");
  }

  if (erros.length > 0) {
    throw new ValidationError("Dados inválidos", erros);
  }

  return true;
}

try {
  validarAluno({
    nome: "",
    email: "teste.com",
    idade: 15,
  });
} catch (erro) {
  console.log(erro.message);
  console.log(erro.details);
}
