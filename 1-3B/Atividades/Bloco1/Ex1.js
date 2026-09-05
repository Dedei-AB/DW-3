class ContaBancaria {
  constructor(titular, saldo) {
    this.titular = titular;
    this.saldo = saldo;
  }

  depositar(valor) {
    this.saldo += valor;
  }

  sacar(valor) {
    if (valor > this.saldo) {
      console.log("Saldo insuficiente.");
      return;
    }
    this.saldo -= valor;
  }

  exibirSaldo() {
    console.log(
      `Titular: ${this.titular} | Saldo: R$ ${this.saldo.toFixed(2)}`,
    );
  }
}

const contaAna = new ContaBancaria("Ana", 100);
contaAna.depositar(50);
contaAna.exibirSaldo();

const contaCarlos = new ContaBancaria("Carlos", 120);
contaCarlos.sacar(40);
contaCarlos.exibirSaldo();
