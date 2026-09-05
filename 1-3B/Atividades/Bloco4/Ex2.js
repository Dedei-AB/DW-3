class Livro {
  constructor(titulo, autor) {
    this.titulo = titulo;
    this.autor = autor;
    this.disponivel = true;
  }

  emprestar() {
    if (!this.disponivel) {
      console.log("Livro indisponível.");
      return;
    }
    this.disponivel = false;
  }

  devolver() {
    this.disponivel = true;
  }

  exibir() {
    const status = this.disponivel ? "Disponível" : "Indisponível";
    return `${this.titulo} — ${this.autor} — ${status}`;
  }
}

class Biblioteca {
  constructor(nome) {
    this.nome = nome;
    this.acervo = [];
  }

  adicionar(livro) {
    this.acervo.push(livro);
  }

  buscar(titulo) {
    return this.acervo.find((livro) => livro.titulo === titulo) || null;
  }

  emprestar(titulo) {
    const livro = this.buscar(titulo);
    if (!livro) {
      console.log("Livro não encontrado.");
      return;
    }
    livro.emprestar();
  }

  devolver(titulo) {
    const livro = this.buscar(titulo);
    if (!livro) {
      console.log("Livro não encontrado.");
      return;
    }
    livro.devolver();
  }

  exibirAcervo() {
    this.acervo.forEach((livro) => {
      console.log(livro.exibir());
    });
  }
}

const biblioteca = new Biblioteca("Biblioteca Central");
const livro1 = new Livro("O Alquimista", "Paulo Coelho");
const livro2 = new Livro("Dom Casmurro", "Machado de Assis");
const livro3 = new Livro("1984", "George Orwell");

biblioteca.adicionar(livro1);
biblioteca.adicionar(livro2);
biblioteca.adicionar(livro3);

biblioteca.emprestar("Dom Casmurro");
biblioteca.emprestar("1984");
biblioteca.devolver("1984");

biblioteca.exibirAcervo();
