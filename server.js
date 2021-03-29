require("dotenv").config();

const app = require('./app');
const port = 3000;
const db = require('./database');
require("./redis/blocklist-access-token");
require("./redis/allowlist-refresh-token");
const { InvalidArgumentError, NotFound, NotAuthorized } = require("./src/erros");
const jwt = require("jsonwebtoken");

const routes = require('./rotas');
const { InvalidArgumentError } = require("./src/erros");
routes(app);

app.use((error, req, res, next) => {
    let status = 500;
    const body = {
        erro: error.message
    };

    if(erro instanceof InvalidArgumentError)
        status = 400;
    else if(erro instanceof jwt.JsonWebTokenError)
        status = 401;
    else if(erro instanceof jwt.TokenExpiredError) {
        status = 401;
        body.expiradoEm = erro.expiredAt;
    } else if(erro instanceof NotFound)
        status = 404;
    else if(erro instanceof NotAuthorized)
        status = 401;

    res.status(status).json(body);
});

app.listen(port, () => console.log(`App listening on port ${port}`));
