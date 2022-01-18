const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const Categoria = require("../models/Categoria");
const Postagem = require("../models/Postagem")

router.get('/', (req, res) => {
    res.render("admin/index");
}); //rotas em arquivos separado usa-se router.[] ao inves de app.[]

router.get('/posts', (req, res) => {
    res.send("Página de Posts");
});

router.get('/categorias', (req, res) => {
    const categorias = Categoria.findAll({
        order: [['id', 'DESC']]
    });
    categorias.then(result => {
        res.render('admin/categorias', {categorias: result.map(result => result.toJSON())});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    });
});

router.get('/categorias/add', (req, res) => {
    res.render("admin/addcategorias");
})

router.post('/categorias/nova', (req, res) => {

    // Criando validação de formulários
    erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){ //valida se o nome for vazio undefined ou null
        erros.push("Nome inválido")
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){ //valida se o slug for vazio undefined ou null
        erros.push("Slug inválido")
    }
    if(req.body.nome.length < 2){ //verifica se o nome da categoria é pequeno demais
        erros.push("Nome da categoria é muito pequeno.")
    }

    if(erros[0] != undefined){
        if(erros.length > 1){
            req.flash("error_msg", "Campos inválidos, verifique e tente novamente!")
            res.redirect("/admin/categorias")
        } else{
            req.flash("error_msg", erros[0])
            res.redirect("/admin/categorias")
        }
    } else{
        Categoria.create({ //enviando dados para o bd
            nome: req.body.nome,
            slug: req.body.slug
        }).then(function(){ //mensagem de erro ou sucesso
            req.flash("success_msg", "Categoria criada com sucesso!") //flash é responsável por controlar as variáveis globais e sessões, então armazenamos uma mensagem na variável global success_msg
            res.redirect("/admin/categorias")
        }).catch(function(err){
            if(err.errno = 1062){
                req.flash("error_msg", "O slug deve ter um nome diferente dos demais, digite outro!")
            } else{
                req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
            }
            res.redirect("/admin/categorias")
        })
    }
});

router.get("/categorias/edit/:id", (req, res) => {
        var categoria = Categoria.findByPk(req.params.id);
        categoria.then(result => {
            res.render('admin/editcategorias', {categoria: result.toJSON()});
        }).catch((erro) => {
            console.log(erro);
            req.flash("error_msg", "Esta categoria não existe!")
            res.redirect("/admin/categorias")
        });
});

router.post("/categorias/edit", (req, res) => {
    // Criando validação de formulários
    var erros = [];

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){ //valida se o nome for vazio undefined ou null
        erros.push({texto: "Nome inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){ //valida se o slug for vazio undefined ou null
        erros.push({texto: "Slug inválido"})
    }
    if(req.body.nome.length < 2){ //verifica se o nome da categoria é pequeno demais
        erros.push({texto: "Nome da categoria é muito pequeno."})
    }

    if(erros.length > 0){
        var categoria = Categoria.findByPk(req.body.id);
        categoria.then(result => {
            res.render('admin/editcategorias', {categoria: result.toJSON(), erros: erros});
        });
    } else{
            Categoria.findByPk(req.body.id).then((categoria) => {
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!");
                res.redirect("/admin/categorias");
            }).catch((err) => {
                if(err.errno = 1062){
                    req.flash("error_msg", "O slug deve ter um nome diferente dos demais, digite outro!")
                } else{
                    req.flash("error_msg", "Houve um erro ao salvar a categoria, tente novamente!")
                }
                res.redirect("/admin/categorias")
            })
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro ao editar a categoria")
            res.redirect("/admin/categorias")
        })
    }
})

router.get("/categorias/delete/:id", (req, res) => {
    var categoria = Categoria.findByPk(req.params.id);
    categoria.then(result => {
        res.render('admin/deletecategorias', {categoria: result.toJSON()});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg", "Esta categoria não existe!")
        res.redirect("/admin/categorias")
    });
});

router.post("/categorias/delete", (req, res) => {
    Categoria.findByPk(req.body.id).then((categoria) => {
        categoria.destroy({force: true}).then(() => {
            req.flash("success_msg", "Categoria deletada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch((erro) => {
            req.flash("error_msg", "Houve um erro interno ao deletar esta categoria");
            res.redirect("/admin/categorias");
        })
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg", "Houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/categorias/:slug", (req, res) => {
    const postagens = Postagem.findAll({
        include: [{
            model: Categoria,
            attributes: ['nome', 'slug', 'createdAt', 'updatedAt'],
            where: {slug: req.params.slug}
        }],
        order: [['id', 'DESC']]
    });
    postagens.then(result => {
        console.log(result.map(result => result.toJSON()));
        res.render('admin/listCategoria', {postagens: result.map(result => result.toJSON())});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg", "Houve um erro ao listar essa categoria.")
        res.redirect("/admin")
    });
})

//Rotas das postagens:

router.get('/postagens', (req, res) => {
    const postagens = Postagem.findAll({
        include: [{
            model: Categoria,
            attributes: ['nome', 'slug']
        }],
        order: [['id', 'DESC']]
    });
    postagens.then(result => {
        res.render('admin/postagens', {postagens: result.map(result => result.toJSON())});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    });
});

router.get("/postagens/add", (req, res) => {
    const categorias = Categoria.findAll({
        order: [['id', 'DESC']]
    });
    categorias.then(result => {
        console.log(result);
        if(result.length > 0){
            res.render('admin/addpostagens', {categorias: result.map(result => result.toJSON())});
        } else{
            var erros = [];
            erros.push({texto: "Você deve criar uma categoria primeiro!"});
            res.render("admin/addcategorias", {erros: erros}) 
        }
    }).catch((erro) => {
        req.flash("error_msg", "Houve um erro interno ao verificar as categorias")
        res.redirect("/admin")
    });


})

router.post("/postagens/nova", (req, res) => {
    // Criando validação de formulários
    var erros = [];

    if(!req.body.titulo || typeof req.body.titulo == undefined || req.body.titulo == null){ //valida se o nome for vazio undefined ou null
        erros.push({texto: "Título inválido"})
    }
    if(!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null){ //valida se o slug for vazio undefined ou null
        erros.push({texto: "Slug inválido"})
    }
    if(!req.body.descricao || typeof req.body.descricao == undefined || req.body.descricao == null){ //valida se o slug for vazio undefined ou null
        erros.push({texto: "Descrição inválida"})
    }
    if(!req.body.conteudo || typeof req.body.conteudo == undefined || req.body.conteudo == null){ //valida se o slug for vazio undefined ou null
        erros.push({texto: "Conteúdo inválido"})
    }
    if(!req.body.categoria || typeof req.body.categoria == undefined || req.body.categoria == null){ //valida se o slug for vazio undefined ou null
        erros.push({texto: "Categoria inválida"})
    }
    if(req.body.titulo.length < 2){ //verifica se o título é pequeno demais
        erros.push({texto: "Nome do título é muito pequeno."})
    }
    if(req.body.conteudo.length < 10){ //verifica se o conteúdo é pequeno demais
        erros.push({texto: "Conteúdo é muito pequeno."})
    }
    if(req.body.descricao.length < 5){ //verifica se a descrição é pequena demais
        erros.push({texto: "Descrição é muito pequena."})
    }

    if(erros.length > 0){
        if(erros.length > 1){
            req.flash("error_msg", "Campos inválidos, verifique e tente novamente!")
            res.redirect("add")
        } else{
            req.flash("error_msg", erros[0].texto)
            res.redirect("add")
        }
        
    } else{
        Postagem.create({ //enviando dados para o bd
            titulo: req.body.titulo,
            slug: req.body.slug,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            img_url: req.body.img,
            categoriaId: req.body.categoria
        }).then(function(){ //mensagem de erro ou sucesso
            req.flash("success_msg", "Postagem criada com sucesso!") //flash é responsável por controlar as variáveis globais e sessões, então armazenamos uma mensagem na variável global success_msg
            res.redirect("/admin/postagens")
        }).catch(function(){
            req.flash("error_msg", "Houve um erro ao publicar sua postagem, tente novamente!")
            res.send("Ocorreu um erro: "+erro)
        })
    }
})

router.get("/postagens/readMore/:slug", (req, res) => {
    var postagem = Postagem.findAll({
        where: {slug: req.params.slug},
        include: [{
            model: Categoria,
            attributes: ['nome']
        }],
        order: [['id', 'DESC']]
    });
    postagem.then(result => {
        var e = result.map(result => result.toJSON());
        console.log(e);
        res.render('admin/readMore', {postagem: result.map(result => result.toJSON())});
    }).catch((erro) => {
        req.flash("error_msg", "Esta postagem não existe!")
        res.redirect("/admin/postagens")
    });
})

router.get("/postagens/delete/:id", (req, res) => {
    var postagem = Postagem.findByPk(req.params.id);
    postagem.then(result => {
        res.render('admin/deletepostagens', {postagem: result.toJSON()});
    }).catch((erro) => {
        console.log(erro);
        req.flash("error_msg", "Esta postagem não existe!")
        res.redirect("/admin/categorias")
    });
});

module.exports = router;