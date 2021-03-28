const passport = require("passport");
const Usuario = require("../usuarios/usuarios-modelo");
const tokens = require("./tokens");

module.exports = {
    local(req, res, next) {
        passport.authenticate(
            "local",
            { session: false },
            (erro, usuario, info) => {
                
                if(erro) {
                    if(erro.name === "InvalidArgumentError") 
                        return res.status(401).json({ erro: erro.message });
                    else 
                        return res.status(500).json({ erro: erro.message });
                }

                if(!usuario) {
                    return res.status(401).json();
                }

                req.user = usuario;
                req.estaAutenticado = true;
                return next();
            }
        )(req, res, next);
    },
    bearer(req, res, next) {
        passport.authenticate(
            "bearer",
            { session: false },
            (erro, usuario, info) => {

                if(erro) {
                    if(erro.name === "JsonWebTokenError")
                        return res.status(401).json({ erro: erro.message });
                    else if(erro.name === "TokenExpiredError")
                        return res.status(401).json({ erro: erro.message, expiradoEm: erro.expiredAt });
                    else
                        return res.status(500).json({ erro: erro.message });
                }

                if(!usuario) {
                    return res.status(401).json();
                }

                req.token = info.token;
                req.user = usuario;
                req.estaAutenticado = true;
                return next();
            }
        )(req, res, next);
    },
    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.body;
            const usuarioId = await tokens.refresh.verifica(refreshToken);
            await tokens.refresh.invalida(refreshToken);
            req.user = await Usuario.buscaPorId(usuarioId);
            return next();
        } catch(erro) {
            if(erro.name === "InvalidArgumentError")
                return res.status(401).json({ erro: erro.message });
            
            return res.status(500).json({ erro: erro.message });
        }
    },
    async verificacaoEmail(req, res, next) {
        try {
            const { tokenVerificacao } = req.params;
            const id = await tokens.verificacaoEmail.verifica(tokenVerificacao);
            const usuario = await Usuario.buscaPorId(id);
            req.user = usuario;
            next();
        } catch(erro) {
            if(erro.name === "JsonWebTokenError") 
                return res.status(401).json({ erro: erro.message });
            else if(erro.name === "TokenExpiredError")
                return res.status(401).json({ erro: erro.message, expiradoEm: erro.expiredAt });

            return res.status(500).json({ erro: erro.message });

        }
    }
};