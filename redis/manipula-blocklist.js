const blocklist = require("./blocklist");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const { createHash } = require("crypto");

const setAsync = promisify(blocklist.set).bind(blocklist);
const existsAsync = promisify(blocklist.exists).bind(blocklist);

function geraTokenHash(token) {
    return createHash("sha256").update(token).digest("hex");
}

module.exports = {
    adiciona: async token => {
        const dataExpiracao = jwt.decode(token).exp;
        const tokenHash = geraTokenHash(token);
        await setAsync(tokenHash, "");
        blocklist.expireat(tokenHash, dataExpiracao);
    },
    contemToken: async token => {
        const tokenHash = geraTokenHash(token);
        const resultado = await existsAsync(tokenHash);
        return resultado === 1;
    }
}