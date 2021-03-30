class InvalidArgumentError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InvalidArgumentError';
  }
}

class InternalServerError extends Error {
  constructor(mensagem) {
    super(mensagem);
    this.name = 'InternalServerError';
  }
}

class NotFound extends Error {
  constructor(entidade) {
    super(`Não foi possível encontrar ${entidade}`);
    this.name = "NotFound";
  }
}

class NotAuthorized extends Error {
  constructor() {
    super("Não foi possível acessa este recurso");
    this.name = "NotAuthorized";
  }
}

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  InternalServerError: InternalServerError,
  NotFound,
  NotAuthorized
};
