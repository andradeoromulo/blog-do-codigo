const controle = require("./controleDeAcesso");

const metodos = {
    ler: {
        universal: "readAny",
        restrito: "readOwn"
    },
    criar: {
        universal: "createAny",
        restrito: "createOwn"
    },
    remover: {
        universal: "deleteAny",
        restrito: "deleteOwn"
    }
};

module.exports = (entidade, acao) => (req, res, next) => {

    const permissoesDoCargo = controle.can(req.user.cargo);

    const acoes = metodos[acao];
    const permissoesUniversais = permissoesDoCargo[acoes.universal](entidade);
    const permissoesRestritas = permissoesDoCargo[acoes.restrito](entidade);

    if(!(permissoesUniversais.granted || permissoesRestritas.granted)) {
        res.status(403).end();
        return;
    }

    req.acesso = {
        universal: {
            permissoes: permissoesUniversais.attributes,
            concedidas: permissoesUniversais.granted
        },
        restrito: {
            permissoes: permissoesRestritas.attributes,
            concedidas: permissoesRestritas.granted
        }
    };

    next();
}