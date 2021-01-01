const {Sequelize, DataTypes} = require('sequelize');
console.log('process-->'+process.env.DATABASE_NAME)
const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASS,{
    host: process.env.DATABASE_HOSTNAME,
    dialect: 'mysql'
})

const start =async()=>{
    try{
        await sequelize.authenticate();
    }catch(err){
        console.log('->Error en conexion a la BD: '+err)
    }    
}

module.exports = start;