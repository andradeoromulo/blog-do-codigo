const postsDao = require('./posts-dao');
const validacoes = require('../validacoes-comuns');

class Post {
  constructor(post) {
    this.id = post.id;
    this.titulo = post.titulo;
    this.conteudo = post.conteudo;
    this.autor = post.autor;
    this.valida();
  }

  adiciona() {
    return postsDao.adiciona(this);
  }

  static async buscaPorId (id, idAutor) {
    const post = await postsDao.buscaPorId(id, idAutor);
    if (!post) {
      return null;
    }

    return new Post(post);
  }

  valida() {
    validacoes.campoStringNaoNulo(this.titulo, 'título');
    validacoes.campoTamanhoMinimo(this.titulo, 'título', 5);

    validacoes.campoStringNaoNulo(this.conteudo, 'conteúdo');
    validacoes.campoTamanhoMaximo(this.conteudo, 'conteúdo', 140);
  }

  remove() {
    return postsDao.remove(this)
  }

  static lista() {
    return postsDao.lista();
  }

  static listaPorAutor(idAutor) {
    return postsDao.listaPorAutor(idAutor)
  }

}

module.exports = Post;
