const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");
const redis = require("redis");
const manipulaLista = require("./manipula-lista");

const blocklist = redis.createClient({ host: "redis", prefix: "blocklist-access-token" });
const manipulaBlocklist = manipulaLista(blocklist);

function geraTokenHash(token) {
    return createHash("sha256").update(token).digest("hex");
}

module.exports = {
    adiciona: async token => {
        const dataExpiracao = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await manipulaBlocklist.adiciona(tokenHash, "", dataExpiracao);
    },
    contemToken: async token => {
        const tokenHash = geraTokenHash(token);
        return await manipulaBlocklist.contemChave(tokenHash);
    }
}