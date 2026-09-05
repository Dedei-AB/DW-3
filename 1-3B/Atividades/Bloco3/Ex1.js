class FilaAtendimento {
  constructor() {
    this._fila = [];
    this.contador = 1;
  }

  entrar(nome) {
    this._fila.push({ senha: this.contador, nome });
    console.log(`Senha ${this.contador} gerada para ${nome}.`);
    this.contador++;
  }

  chamarProximo() {
    if (this._fila.length === 0) {
      console.log("Fila vazia.");
      return null;
    }
    const proximo = this._fila.shift();
    console.log(`Chamando senha ${proximo.senha} — ${proximo.nome}`);
    return proximo;
  }

  tamanho() {
    return this._fila.length;
  }
}

const fila = new FilaAtendimento();
fila.entrar("Ana");
fila.entrar("Bruno");
fila.entrar("Carla");
fila.chamarProximo();
fila.chamarProximo();
console.log(`Pessoas na fila: ${fila.tamanho()}`);
