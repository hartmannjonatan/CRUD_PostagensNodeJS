//Conexão com o MySql
const Sequelize = require("sequelize");          //usa o modulo sequelize

const sequelize = new Sequelize('bdBlogapp', 'root', 'lisandrabeppler', { //conecta com o banco de dados mysql
    host: "localhost",
    dialect: "mysql"
});

module.exports = { //exportando o sequelize para demais módulos da aplicação
    Sequelize: Sequelize,
    sequelize: sequelize
};