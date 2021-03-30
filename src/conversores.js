class Conversor {
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
        if(this.camposPublicos.indexOf("*") === -1) 
            dados = this.filtrar(dados);

        if(this.tipoDeConteudo === "json")
            return this.json(dados);
    }

    json(dados) {
        return JSON.stringify(dados);
    }
};

class ConversorPost extends Conversor {
    constructor(tipoDeConteudo, camposExtras = []) {
        super();
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ["titulo", "conteudo"].concat(camposExtras);
    }
};

class ConversorUsuario extends Conversor {
    constructor(tipoDeConteudo, camposExtras = []) {
        super();
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ["nome"].concat(camposExtras);
    }
}

class ConversorErro extends Conversor {
    constructor(tipoDeConteudo) {
        super();
        this.tipoDeConteudo = tipoDeConteudo;
        this.camposPublicos = ["erro"];
    }
};

module.exports = {
    ConversorPost,
    ConversorUsuario,
    ConversorErro
}
