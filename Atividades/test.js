class Usuario {
  constructor(nome) {
    this.nome = nome;
  }

  exibir() {
    return this.nome;
  }
}

const u1 = new Usuario("Bruno");
const fn = u1.exibir;
console.log(fn);
const fnOk = u1.exibir.bind(u1);
console.log(fnOk);
