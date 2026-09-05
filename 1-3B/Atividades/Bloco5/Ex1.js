// Exercício 5.1 — Identificar e corrigir

// Código original com problema:
// class Timer {
//   constructor(nome) {
//     this.nome = nome
//     this.segundos = 0
//   }

//   iniciar() {
//     setInterval(function() {
//       this.segundos++
//       console.log(`${this.nome}: ${this.segundos}s`)
//     }, 1000)
//   }
// }

// const t = new Timer('Cronômetro')
// t.iniciar()

// 1. Qual é o erro e por que ele acontece?
// O erro é que dentro da função passada para setInterval, o 'this' não se refere à instância da classe Timer,
// mas ao objeto global (no Node.js, global, no browser, window). Isso acontece porque funções regulares
// têm seu próprio contexto 'this', que não é herdado da função pai.

// 2. Corrija o código usando arrow function.
// Arrow functions não têm seu próprio 'this', elas herdam o 'this' do contexto onde foram definidas.

class Timer {
  constructor(nome) {
    this.nome = nome;
    this.segundos = 0;
  }

  iniciar() {
    setInterval(() => {
      this.segundos++;
      console.log(`${this.nome}: ${this.segundos}s`);
    }, 1000);
  }
}

const t = new Timer("Cronômetro");
t.iniciar();

// 3. O que muda no comportamento do 'this' ao usar uma arrow function?
// Arrow functions não criam um novo contexto 'this'. Elas capturam o 'this' do contexto léxico onde foram definidas,
// que neste caso é o método 'iniciar' da classe Timer, então 'this' se refere corretamente à instância da classe.

// Saída esperada:
// Cronômetro: 1s
// Cronômetro: 2s
// Cronômetro: 3s
// (continua incrementando a cada segundo)
