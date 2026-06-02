function processarPagamento(valor) {
  if (valor <= 0) {
    throw new Error("Valor inválido");
  }

  return "Pagamento aprovado";
}

try {
  const resultado = processarPagamento(100);
  console.log(resultado);
} catch (erro) {
  console.log(erro.message);
}
