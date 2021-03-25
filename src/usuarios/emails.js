const nodemailer = require("nodemailer");

async function criaConfiguracaoEmail() {
    if(process.env.NODE_ENV === "production") {
        const configuracaoProducao = {
            host: process.env.EMAIL_HOST,
            auth: {
                user: process.env.EMAIL_USUARIO,
                pass: process.env.EMAIL_SENHA
            },
            secure: true
        };
        return configuracaoProducao;
    } else {
        const contaTeste = await nodemailer.createTestAccount()
        const configuracaoTeste = {
            host: "smtp.ethereal.email",
            auth: contaTeste
        };
        return configuracaoTeste;
    }
}

class Email {

    async  enviaEmail() {
        
        const configuracaoEmail = await criaConfiguracaoEmail();

        const transportador = nodemailer.createTransport(configuracaoEmail);
        const info = await transportador.sendMail(this);
    
        if(process.env.NODE_ENV !== "producion")
            console.log("URL do e-mail enviado: " + nodemailer.getTestMessageUrl(info));    

    };

}

class EmailVerificacao extends Email {
    constructor(usuario, endereco) {
        super();
        this.from = '"Blog do Código <noreply@blogdocodigo.com>';
        this.to = usuario.email;
        this.subject = "Verificação de E-mail";
        this.text = `Olá! Boas vindas ao Blog do Código. Para verificar seu e-mail, basta clicar no link: ${endereco}.`; 
        this.html = `<h1>Olá, ${usuario.nome}!</h1> <h3>Boas vindas ao Blog do Código.</h3><p> Para verificar seu e-mail, basta clicar no link: <a href="${endereco}">${endereco}</a>.</p>` ;
    }
}


module.exports = { EmailVerificacao };