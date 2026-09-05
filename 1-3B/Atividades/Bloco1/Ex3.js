class Aluno {
  constructor(nome, notas) {
    this.nome = nome;
    this.notas = notas;
  }
  adicionarNota(nota) {
    this.notas.push(nota);
  }

  calcularMedia() {
    let soma = 0;
    this.notas.forEach((n) => (soma += n));
    const media = soma / this.notas.length;
    return media;
  }

  situacao() {
    if (this.calcularMedia() >= 6) return "Aprovado";
    return "Reprovado";
  }

  exibir() {
    console.log(
      `${this.nome} | Média: ${this.calcularMedia()} | ${this.situacao()}`,
    );
  }
}

const alunaAna = new Aluno("Ana", [8, 7, 9, 6, 8, 7, 10, 5, 8]);
alunaAna.adicionarNota(7);
alunaAna.exibir();
// - `adicionarNota(nota)` — adiciona uma nota ao array
// - `calcularMedia()` — retorna a média aritmética das notas. Se não houver notas, retorna `0`
// - `situacao()` — retorna `"Aprovado"` se a média for maior ou igual a 6, `"Reprovado"` caso contrário
// - `exibir()` — exibe `"Ana | Média: 7.50 | Aprovado"`
