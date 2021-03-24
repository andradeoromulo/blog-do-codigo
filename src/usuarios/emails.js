const nodemailer = require("nodemailer");

class Email {

    async  enviaEmail() {
        const contaTeste = await nodemailer.createTestAccount();
    
        const transportador = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            auth: contaTeste
        });
    
        const info = await transportador.sendMail(this);
    
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