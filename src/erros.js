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
    this.mensagem = `Não foi possível encontrar ${entidade}`;
    super(mensagem);
    this.name = "NotFound";
  }
}

class NotAuthorized extends Error {
  constructor() {
    this.mensagem = "Não foi possível acessa este recurso";
    super(mensagem);
    this.name = "NotAuthorized";
  }
}

module.exports = {
  InvalidArgumentError: InvalidArgumentError,
  InternalServerError: InternalServerError,
  NotFound,
  NotAuthorized
};
