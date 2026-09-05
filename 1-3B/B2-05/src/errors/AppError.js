// @file: src/errors/AppError.js
// Classe customizada para representar erros de negócio (intencional)
// Esses erros são diferenciados de erros inesperados do sistema

export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
  }
}
