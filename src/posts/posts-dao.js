const db = require('../../database');
const { InternalServerError } = require('../erros');
const { promisify } = require("util");

const asyncRun = promisify(db.run).bind(db);
const asyncAll = promisify(db.all).bind(db);

module.exports = {
  async adiciona(post) {
    try {
      await asyncRun(
        `
          INSERT INTO posts (
            titulo, 
            conteudo
          ) VALUES (?, ?)
        `,
        [post.titulo, post.conteudo]
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao adicionar o post')
    }
  },

  async lista() {
    try {
      return await asyncAll(
        `SELECT * FROM posts`
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao listar os posts')
    }
  }
};
