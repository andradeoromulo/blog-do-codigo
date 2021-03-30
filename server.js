require("dotenv").config();

const app = require('./app');
const port = 3000;
const db = require('./database');
require("./redis/blocklist-access-token");
require("./redis/allowlist-refresh-token");

const routes = require('./rotas');
const { InvalidArgumentError, NotFound, NotAuthorized } = require("./src/erros");
const jwt = require("jsonwebtoken");
const { ConversorErro } = require("./src/conversores");

app.use((req, res, next) => {
    const accept = req.header("accept");

    if(accept.indexOf("application/json") === -1 && accept.indexOf("*/*") === -1) {
        res.status(406).end();
        return;
    }

    res.set({ "Content-Type": "application/json" });
    next();
});

routes(app);

app.use((error, req, res, next) => {
    let status = 500;
    const body = {
        erro: error.message
    };

    if(error instanceof InvalidArgumentError)
        status = 400;
    else if(error instanceof jwt.JsonWebTokenError)
        status = 401;
    else if(error instanceof jwt.TokenExpiredError) {
        status = 401;
        body.expiradoEm = error.expiredAt;
    } else if(error instanceof NotFound)
        status = 404;
    else if(error instanceof NotAuthorized)
        status = 401;

    const conversor = new ConversorErro("json");

    res.status(status).send(conversor.converter(body));
});

app.listen(port, () => console.log(`App listening on port ${port}`));
