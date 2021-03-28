const middlewaresAutenticacao = require("./middlewares-autenticacao");

module.exports = (req, res, next) => {
    req.estaAutenticado = false;

    if(req.get("Authorization")) {
        return middlewaresAutenticacao.bearer(req, res, next);
    }

    next();
}