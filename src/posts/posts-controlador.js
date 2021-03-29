const Post = require('./posts-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');

module.exports = {
  async adiciona(req, res, next) {
    try {
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

      if(!req.estaAutenticado) {
        posts = posts.map(post => ({ titulo: post.titulo, conteudo: post.conteudo }));
      }

      res.send(posts);
    } catch (erro) {
      next(erro);
    }
  },

  async obtemDetalhes (req, res, next) {
    try {
      const post = await Post.buscaPorId(req.params.id, req.user.id);
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
