export default class ProdutoModel {
  #produtos = [
    { id: 1, nome: "Produto 1", preco: 10.0 },
    { id: 2, nome: "Produto 2", preco: 20.0 },
    { id: 3, nome: "Produto 3", preco: 30.0 },
  ];
  #proximoId = 4;

  async findAll() {
    return this.#produtos;
  }

  async findById(id) {
    return this.#produtos.find((produto) => produto.id === id);
  }

  async create(dados) {
    const novoProduto = { id: this.#proximoId, ...dados };
    this.#produtos.push(novoProduto);
    this.#proximoId++;
    return novoProduto;
  }

  async delete(id) {
    const index = this.#produtos.findIndex((produto) => produto.id === id);
    if (index === -1) return false;
    this.#produtos.splice(index, 1);
    return true;
  }

  static validar(dados) {
    const erros = [];
    if (
      !dados.nome ||
      typeof dados.nome !== "string" ||
      dados.nome.trim() === ""
    ) {
      erros.push("Nome é obrigatório e não pode ser vazio.");
    }
    if (!dados.preco || typeof dados.preco !== "number" || dados.preco <= 0) {
      erros.push("Preço é obrigatório e deve ser um número maior que 0.");
    }
    return erros.length === 0 ? { valido: true } : { valido: false, erros };
  }
}
