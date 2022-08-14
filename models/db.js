const Sequelize = require('sequelize');
const sequelize = new Sequelize('node_exemplo','root','12345678',{
    host: '127.0.0.1',
    dialect: 'mysql',
    define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
        timestamps: true
    },
    logging: false
}) 

// sequelize.authenticate().then(()=> console.log('Conexao bem sucedida!')).catch((err)=> console.log('Conexão falhou! ' + err ))

module.exports = {Sequelize, sequelize}