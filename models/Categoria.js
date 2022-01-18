const { sequelize } = require('./db');
const { Sequelize } = require('./db');
const db = require('./db');
const Model = Sequelize.Model;

class Categoria extends Model {}

Categoria.init({
    nome: {
        type: db.Sequelize.STRING,
        required: true
    },
    slug: {
        type: db.Sequelize.STRING,
        required: true,
        unique: true
    },
    date: {
        type: db.Sequelize.DATE,
        defaultValue: Sequelize.NOW
    }
}, {
    sequelize,
    modelName: 'categorias'
    // options
  });

//Categoria.sync({force: true}); //CRIADA 

module.exports = Categoria