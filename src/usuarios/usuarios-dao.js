const db = require('../../database');
const { InternalServerError } = require('../erros');
const { promisify } = require("util");

const asyncRun = promisify(db.run).bind(db);
const asyncGet = promisify(db.get).bind(db);
const asyncAll = promisify(db.all).bind(db);

module.exports = {
  async adiciona(usuario) {
    try{
      await asyncRun(
        `
          INSERT INTO usuarios (
            nome,
            email,
            senhaHash
          ) VALUES (?, ?, ?)
        `,
        [usuario.nome, usuario.email, usuario.senhaHash]
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao adicionar o usuário');
    }
  },

  async buscaPorId(id) {
    try {
      return await asyncGet(
        `
          SELECT *
          FROM usuarios
          WHERE id = ?
        `,
        [id]
      );
    } catch(erro) {
      throw new InternalServerError('Não foi possível encontrar o usuário!');
    }
  },

  async buscaPorEmail(email) {
    try{
      return await asyncGet(
        `
          SELECT *
          FROM usuarios
          WHERE email = ?
        `,
        [email]
      );
    } catch(erro) {
      throw new InternalServerError('Não foi possível encontrar o usuário!');
    }
  },

  async lista() {
    try {
      return await asyncAll(
        `
          SELECT * FROM usuarios
        `
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao listar usuários');
    }
  },

  async deleta(usuario) {
    try {
      await asyncRun(
        `
          DELETE FROM usuarios
          WHERE id = ?
        `,
        [usuario.id]
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao deletar o usuário');
    }
  }
};
