class Carrinho {
  constructor() {
    this.itens = [];
  }

  adicionar(nome, preco, quantidade) {
    this.itens.push({ nome, preco, quantidade });
  }

  remover(nome) {
    const tamanhoOriginal = this.itens.length;
    this.itens = this.itens.filter(
      (item) => item.nome.toLowerCase() !== nome.toLowerCase(),
    );

    if (this.itens.length === tamanhoOriginal) {
      console.log("Item não encontrado.");
    }
  }

  total() {
    return this.itens.reduce(
      (acc, item) => acc + item.preco * item.quantidade,
      0,
    );
  }

  exibir() {
    this.itens.forEach((item) => {
      console.log(
        `${item.quantidade}x ${item.nome} — R$ ${item.preco.toFixed(2)}`,
      );
    });
    console.log(`Total: R$ ${this.total().toFixed(2)}`);
  }
}
const meuCarrinho = new Carrinho();

meuCarrinho.adicionar("Arroz", 10.0, 2);
meuCarrinho.adicionar("Sabão", 5.5, 1);
meuCarrinho.adicionar("Feijão", 8.0, 3);

meuCarrinho.remover("Feijão");

meuCarrinho.exibir();
