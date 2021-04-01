# Blog do código

## Sobre
API de um blog simples em Node.js com Express. Todas as implementações aqui foram feitas com base no acompanhamento dos cursos de [Node.js e JWT](https://cursos.alura.com.br/course/node-jwt-autenticacao-tokens), de [Node.js: Refresh Tokens](https://cursos.alura.com.br/course/nodejs-refresh-tokens-confirmacao-cadastro) e de [Node.js: Controle de acesso](https://cursos.alura.com.br/course/nodejs-controle-acesso-autorizacao-rbac), conduzidos pelo [Andrew Ijano](https://github.com/AndrewIjano) e [Matheus Hernandes](https://github.com/onhernandes/) na Alura. 

## Como usar
Para testar o projeto, basta clonar o repositório, subir um servidor Redis na porta padrão e configurar variáveis de ambiente. Em seguida:
```
$ npm install
$ npm start
```
Depois, basta consumir usar a [collection no Postman](https://www.getpostman.com/collections/3ca2e8a1606ec539c6df) para consumir a API.

Caso queira subir o redis e a aplicação de uma só vez por containers, basta ir mudar para a branch `container`.

## Tecnologias
Um pouco do que foi usado nesse projeto:
* `bcrypt` para gerar hashes utilizadas para armazenar senhas e chaves.
* `dotenv` para habilitar variáveis de ambiente.
* `jsonwebtoken` para manipular tokens JWT.
* `passport`, `passport-local` e `passport-http-bearer` para desenvolver as estratégias de autenticação.
* `redis` para armazenar uma blocklist de tokens.
* `sqlite` para armazenar o restante dos dados, como usuários e posts.
* `nodemailer` para verificação de e-mail.
* `accesscontrol` para controle de acesso com base em cargos.
