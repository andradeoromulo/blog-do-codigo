const { promisify } = require("util");

module.exports = lista => {
    
    const asyncSet = promisify(lista.set).bind(lista);
    const asyncExists = promisify(lista.exists).bind(lista);
    const asyncGet = promisify(lista.get).bind(lista);
    const asyncDel = promisify(lista.del).bind(lista);
    
    return {
        async adiciona(chave, valor, dataExpiracao) {
            await asyncSet(chave, valor);
            lista.expireat(chave, dataExpiracao);
        },
        async contemChave(chave) {
            const resultado = await asyncExists(chave);
            return resultado === 1;

        },
        async buscaValor(chave) {
            return await asyncGet(chave);
        },
        async  deleta(chave) {
            await asyncDel(chave);
        }   
    }
}