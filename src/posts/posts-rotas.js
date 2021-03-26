const postsControlador = require('./posts-controlador');
const middlewaresAutenticacao = require("../autenticacao/middlewares-autenticacao");
const autorizacao = require("../autenticacao/autorizacao");

module.exports = app => {
  app
    .route('/post')
    .get(
      middlewaresAutenticacao.bearer,
      postsControlador.lista
    )
    .post(
      middlewaresAutenticacao.bearer,
      postsControlador.adiciona
    );
  
  app
    .route("/post/:id")
      .get(
        middlewaresAutenticacao.bearer,
        postsControlador.obtemDetalhes
      )
      .delete(
        [middlewaresAutenticacao.bearer, autorizacao(["admin", "editor"])],
        postsControlador.remove
      )
};
