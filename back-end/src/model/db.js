const {Sequelize, DataTypes} = require('sequelize');
console.log('process-->'+process.env.DATABASE_NAME)

const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASS,{
    host: process.env.DATABASE_HOSTNAME,
    dialect: 'mysql'
})

const Secciones = sequelize.define('unaSeccione',{
    idSeccion:{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    nombreSeccion:{type: DataTypes.STRING(45), allowNull:false},
    descripcion:{type: DataTypes.STRING(100), allowNull:false},
    img: {type: DataTypes.STRING(12), allowNull:null}
},{timestamps:false});

const Usuarios = sequelize.define('unaUsuario',{
    idUsuario:{type: DataTypes.INTEGER, allowNull:false, autoIncrement:true ,unique:true, primaryKey:true},
    apodo:{type: DataTypes.STRING(40), allowNull:false, unique:true},
    contrasenia:{type: DataTypes.STRING(255), allowNull:false},
    mail:{type: DataTypes.STRING(80), allowNull:false, unique:true},
    rol:{type: DataTypes.STRING(4)},
    fechaIngreso:{type: DataTypes.DATE},
    estadoCuenta:{type: DataTypes.STRING(7)},
    dirImg:{type: DataTypes.STRING(45)},
    token:{type: DataTypes.STRING(35)},
    redSocial1:{type: DataTypes.STRING(140)},
    redSocial2:{type: DataTypes.STRING(140)},
    redSocial3:{type: DataTypes.STRING(140)},
    redSocial4:{type: DataTypes.STRING(140)}
},{timestamps:false});

const start = async()=>{
    try{
        await sequelize.authenticate();
    }catch(err){
        console.log('->Error en conexion a la BD: '+err)
    }    
}

module.exports = {start,Secciones,Usuarios};