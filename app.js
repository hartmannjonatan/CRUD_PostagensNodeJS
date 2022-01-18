//carregando modules
const express = require('express');
const handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const app = express();
const admin = require("./routes/admin");
const path = require("path");
const session = require("express-session"); //módulo para as sessões
const flash = require("connect-flash"); // Módulo que tem um tipo de sessão que só aparece uma vez

// Configurações
    // Sessão
        app.use(session({
            secret: "chaveParaGerarSessão",
            resave: true,
            saveUninitialized: true
        }))
        app.use(flash());
    // Middleware //pode declarar variável global
        app.use((req, res, next) => {
            res.locals.success_msg = req.flash("success_msg"); //cria variável global "success_msg"
            res.locals.error_msg = req.flash("error_msg");
            next(); //passa para o próximo passo pq se não não aceitaria mais requisições
        })
    // Body parser
        app.use(bodyParser.urlencoded({extend: true}));
        app.use(bodyParser.json());
    // Handlebars
        app.engine('handlebars', handlebars.engine());
        app.set('view engine', 'handlebars');
        app.set('views', './views');
    // Public
        app.use(express.static(path.join(__dirname, "public"))) //Guardando os arquivos estáticos na pasta public

       /* app.use((req, res, next) => { //criação de um middleware, ele fica entre o servidor e o usuário, interceptando essa conexão
            console.log("Teste de middleware");
            next();
        }) */

// Rotas
    app.get('/', (req, res) => {
        res.render("admin/index")
    })
    app.use('/admin', admin); //rotas criadas com o refixo /admin

// Outros
const PORT = 8080;
app.listen(PORT, () => {
    console.log("Servidor rodando (Porta 8080)");
})