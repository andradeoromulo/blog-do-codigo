const Post = require('./posts-modelo');
const { ConversorPost } = require("../conversores");
const { NotFound } = require('../erros');

module.exports = {
  async adiciona(req, res, next) {
    try {
      req.body.autor = req.user.id;
      const post = new Post(req.body);
      await post.adiciona();
      
      res.status(201).send(post);
    } catch (erro) {
      next(erro);
    }
  },

  async lista(req, res, next) {
    try {
      let posts = await Post.listaTodos();

      let conversor;

      if(!req.estaAutenticado) {
        posts = posts.map(post => {
          post.conteudo = post.conteudo.substr(0, 10) + 
            "... Você precisa assinar o blog para ler o restante do post";
          return post;
        });
        conversor = new ConversorPost("json");
      } else {
        conversor = new ConversorPost(
          "json",
          req.acesso.universal.concedido ? req.acesso.universal.permissoes : req.acesso.restrito.permissoes
        );
      }

      res.send(conversor.converter(posts));
    } catch (erro) {
      next(erro);
    }
  },

  async obtemDetalhes (req, res, next) {
    try {
      const post = await Post.buscaPorIdAutor(req.params.id, req.user.id);
      if(!post) {
        throw new NotFound("post");
      }
      res.json(post);
    } catch (erro) {
      next(erro);
    }
  },

  async remove (req, res, next) {
    try {
      let post;

      if(req.acesso.universal.concedido) 
        post = await Post.buscaPorId(req.params.id);
      else if(req.acesso.restrito.concedido)
        post = await Post.buscaPorIdAutor(req.params.id, req.user.id);

      post.remove();

      res.status(204).end();
      
    } catch (erro) {
      next(erro);
    }
  }
};
