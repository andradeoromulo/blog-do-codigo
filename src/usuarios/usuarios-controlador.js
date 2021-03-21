const Usuario = require('./usuarios-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');
const blocklist = require("../../redis/manipula-blocklist");
const allowlist = require("../../redis/allowlist-refresh-token");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const moment = require("moment");

function criaTokenJWT(usuario) {
  const payload = {
    id: usuario.id
  };

  const token = jwt.sign(payload, process.env.CHAVE_JWT, { expiresIn: "15m" });
  return token;
}

async function criaTokenOpaco(usuario) {
  const tokenOpaco = crypto.randomBytes(24).toString("hex");
  const dataExpiracao = moment().add(5, "d").unix();

  await allowlist.adiciona(tokenOpaco, usuario.id, dataExpiracao);

  return tokenOpaco;
}

module.exports = {
  async adiciona(req, res) {
    const { nome, email, senha } = req.body;

    try {
      const usuario = new Usuario({
        nome,
        email
      });

      await usuario.adicionaSenha(senha);

      await usuario.adiciona();

      res.status(201).json();
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) 
        res.status(400).json({ erro: erro.message });
      
      res.status(500).json({ erro: erro.message });
    }
  },

  async login(req, res) {
    const accessToken = criaTokenJWT(req.user);
    const refreshToken = await criaTokenOpaco(req.user);
    res.set("Authorization", accessToken);
    
    res.status(200).json({ refreshToken });
  },

  async logout(req, res) {
    try {
      const token = req.token;
      await blocklist.adiciona(token);
      res.status(204).json();
    } catch(erro) {
      res.status(500).json({ erro: erro.message });
    }
  },

  async lista(req, res) {
    const usuarios = await Usuario.lista();
    res.json(usuarios);
  },

  async deleta(req, res) {
    const usuario = await Usuario.buscaPorId(req.params.id);
    try {
      await usuario.deleta();
      res.status(200).send();
    } catch (erro) {
      res.status(500).json({ erro: erro });
    }
  }
};
