//Model que conterá toda a tabela de postagem -- Nome no singular e com primeira letra maiúscula
const { sequelize } = require('./db');
const { Sequelize } = require('./db');
const db = require('./db');
const Model = Sequelize.Model;
const Categoria = require('./Categoria');

class Postagem extends Model {}

Postagem.init({
    titulo: {
        type: db.Sequelize.STRING,
        required: true
    },
    slug: {
        type: db.Sequelize.STRING,
        required: true
    },
    descricao:{
        type: db.Sequelize.TEXT,
        require: true
    },
    conteudo: {
        type: db.Sequelize.TEXT,
        required: true
    },
    date: {
        type: db.Sequelize.DATE,
        defaultValue: db.Sequelize.NOW
    },
    img_url: {
        type: db.Sequelize.TEXT
    },
    categoriaId: {
        type: db.Sequelize.INTEGER
    }
}, {
    sequelize,
    modelName: 'postagens'
    // options
  });

//Postagem.sync({force: true})  //Tabela postagens criada

Categoria.hasMany(Postagem, {foreignKey: 'categoriaId'});
Postagem.belongsTo(Categoria, {foreignKey: 'categoriaId'});

module.exports = Postagem;