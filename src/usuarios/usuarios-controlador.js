const Usuario = require('./usuarios-modelo');
const { NotFound } = require('../erros');
const tokens = require("../autenticacao/tokens");
const { EmailVerificacao } = require("./emails");
const { verificaEmail } = require('./usuarios-dao');
const { ConversorUsuario } = require("../conversores");

function geraEndereco(rota, token) {
  const baseURL = process.env.BASE_URL;
  return `${baseURL}${rota}${token}`;
}

module.exports = {
  async adiciona(req, res, next) {
    const { nome, email, senha, cargo } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email,
        emailVerificado: false,
        cargo
      });

      await usuario.adicionaSenha(senha);
      await usuario.adiciona();

      const tokenVerificacao = tokens.verificacaoEmail.cria(usuario.id);
      const endereco = geraEndereco("/usuario/verificar-email/", tokenVerificacao);
      const emailVerificacao = new EmailVerificacao(usuario, endereco);
      emailVerificacao.enviaEmail().catch(console.log);

      res.status(201).json();

    } catch (erro) {
      next(erro);
    }
  },

  async login(req, res) {
    const accessToken = tokens.access.cria(req.user.id);
    const refreshToken = await tokens.refresh.cria(req.user.id);
    res.set("Authorization", accessToken);
    
    res.status(200).json({ refreshToken });
  },

  async logout(req, res, next) {
    try {
      const token = req.token;
      await tokens.access.invalida(token);
      res.status(204).json();
    } catch(erro) {
      next(erro);
    }
  },

  async lista(req, res) {
    const usuarios = await Usuario.lista();

    const conversor = new ConversorUsuario(
      "json",
      req.acesso.universal.concedido ? req.acesso.universal.permissoes : req.acesso.restrito.permissoes
    );

    res.send(conversor.converter(usuarios));
  },

  async verificaEmail(req, res, next) {
    try {
      const usuario = req.user;
      await usuario.verificaEmail();
      res.status(204).json();
    } catch(erro) {
      next(erro);
    }
  },

  async deleta(req, res, next) {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      if (!usuario) {
        throw new NotFound("usuário");
      }
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      next(erro);
    }
  }
};
