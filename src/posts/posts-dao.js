const db = require('../../database');
const { InternalServerError } = require('../erros');
const { promisify } = require("util");

const asyncRun = promisify(db.run).bind(db);
const asyncAll = promisify(db.all).bind(db);
const asyncGet = promisify(db.get).bind(db);

module.exports = {
  async adiciona(post) {
    try {
      await asyncRun(
        `
          INSERT INTO posts (
            titulo, 
            conteudo,
            autor
          ) VALUES (?, ?, ?)
        `,
        [post.titulo, post.conteudo, post.autor]
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao adicionar o post')
    }
  },

  async listaPorAutor (idAutor) {
    try {
      return await as('SELECT id, titulo FROM posts WHERE autor = ?', [idAutor]);
    } catch (erro) {
      throw new InternalServerError('Erro ao listar os posts!');
    }
  },

  async listaTodos() {
    try {
      return await asyncAll(
        `SELECT * FROM posts`
      );
    } catch(erro) {
      throw new InternalServerError('Erro ao listar os posts')
    }
  },

  async buscaPorId (id, idAutor) {
    try {

      let instrucoes = "SELECT * FROM posts WHERE id = ?";
      const parametros = [id];

      idAutor = Number(idAutor);

      if(!isNaN(idAutor)) {
        instrucoes = `${instrucoes} AND autor = ?`;
        parametros.push(idAutor);
      }

      return await asyncGet(instrucoes, parametros);
    } catch (erro) {
      throw new InternalServerError('Não foi possível encontrar o post!');
    }
  },

  async remove ({ id, autor }) {
    try {
      return await asyncRun('DELETE FROM posts WHERE id = ? AND autor = ?', [id, autor]);
    } catch (erro) {
      throw new InternalServerError('Erro ao tentar remover o post!');
    }
  }
};
