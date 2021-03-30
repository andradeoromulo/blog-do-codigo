class ConversorPost {
    constructor(tipoDeConteudo) {
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ["titulo", "conteudo"];
    }

    filtrar(dados) {
        let dadosFiltrados;

        if(Array.isArray(dados))
            dadosFiltrados = dados.map((post) => this.filtrarObjeto(post));
        else
            dadosFiltrados = this.filtrarObjeto(dados);

        return dadosFiltrados;
    }

    filtrarObjeto(objeto) {
        const objetoFiltrado = {};

        this.camposPublicos.forEach((campo) => {
            if(Reflect.has(objeto, campo)) 
                objetoFiltrado[campo] = objeto[campo];
        });

        return objetoFiltrado;
    }

    converter(dados) {
        let dadosFiltrados = this.filtrar(dados);

        if(this.tipoDeConteudo === "json")
            return this.json(dadosFiltrados);
    }

    json(dados) {
        return JSON.stringify(dados);
    }

}

module.exports = ConversorPost;
