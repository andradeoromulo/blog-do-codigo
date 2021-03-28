const Post = require('./posts-modelo');
const { InvalidArgumentError, InternalServerError } = require('../erros');

module.exports = {
  async adiciona(req, res) {
    try {
      const post = new Post(req.body);
      await post.adiciona();
      
      res.status(201).send(post);
    } catch (erro) {
      if (erro instanceof InvalidArgumentError) {
        res.status(422).json({ erro: erro.message });
      } else if (erro instanceof InternalServerError) {
        res.status(500).json({ erro: erro.message });
      } else {
        res.status(500).json({ erro: erro.message });
      }
    }
  },

  async lista(req, res) {
    try {
      let posts = await Post.listaTodos();

      if(!req.estaAutenticado) {
        posts = posts.map(post => ({ titulo: post.titulo, conteudo: post.conteudo }));
      }

      res.send(posts);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  },

  async obtemDetalhes (req, res) {
    try {
      const post = await Post.buscaPorId(req.params.id, req.user.id);
      res.json(post);
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  },

  async remove (req, res) {
    try {
      let post;

      if(req.acesso.universal.concedido) 
        post = await Post.buscaPorId(req.params.id);
      else if(req.acesso.restrito.concedido)
        post = await Post.buscaPorIdAutor(req.params.id, req.user.id);

      post.remove();

      res.status(204).end();
      
    } catch (erro) {
      return res.status(500).json({ erro: erro.message });
    }
  }
};
