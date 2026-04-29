class Produto {
  constructor(nome, preco, estoque) {
    this.nome = nome;
    this.preco = preco;
    this.estoque = estoque;
  }
  disponivel() {
    if (this.estoque > 0) return true;
    return false;
  }

  exibir() {
    console.log(
      `${this.nome} — ${this.preco} — ${this.disponivel() ? "Em estoque" : "Fora de estoque"}`,
    );
  }
}

const produtoNotebook = new Produto("Notebook", 3500, 2);
produtoNotebook.exibir();
const produtoFone = new Produto("Fone de ouvido", 150, 0);
produtoFone.exibir();
