const postsControlador = require('./posts-controlador');
const middlewaresAutenticacao = require("../autenticacao/middlewares-autenticacao");
const autorizacao = require("../autenticacao/autorizacao");
const tentarAutenticar = require("../autenticacao/tentarAutenticar");
const tentarAutorizar = require("../autenticacao/tentarAutorizar");

module.exports = app => {
  app
    .route('/post')
    .get(
      [tentarAutenticar, tentarAutorizar("post", "ler")],
      postsControlador.lista
    )
    .post(
      [middlewaresAutenticacao.bearer, autorizacao("post", "criar")],
      postsControlador.adiciona
    );
  
  app
    .route("/post/:id")
      .get(
        [middlewaresAutenticacao.bearer, autorizacao("post", "ler")],
        postsControlador.obtemDetalhes
      )
      .delete(
        [middlewaresAutenticacao.bearer, autorizacao("post", "remover")],
        postsControlador.remove
      )
};
