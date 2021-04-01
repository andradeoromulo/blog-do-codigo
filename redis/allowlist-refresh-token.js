const redis = require("redis");
const manipulaLista = require("./manipula-lista");

const allowlist = redis.createClient({ host: "redis", prefix: "allowlist-refresh-token" });
module.exports = manipulaLista(allowlist);