const usuariosControlador = require('./usuarios-controlador');
const middlewaresAutenticacao = require("..//autenticacao/middlewares-autenticacao");

module.exports = app => {
  app
    .route("/usuario/login")
    .post(
      middlewaresAutenticacao.local, 
      usuariosControlador.login
  );

  app 
    .route("/usuario/logout")
    .post(
      [middlewaresAutenticacao.bearer, middlewaresAutenticacao.refresh],
      usuariosControlador.logout
  );

  app
    .route("/usuario/refresh")
    .post(
      middlewaresAutenticacao.refresh,
      usuariosControlador.  login
    );

  app
    .route('/usuario')
    .post(usuariosControlador.adiciona)
    .get(usuariosControlador.lista);

  app
    .route('/usuario/:id')
    .delete(
      middlewaresAutenticacao.bearer,
      usuariosControlador.deleta
    );
};
