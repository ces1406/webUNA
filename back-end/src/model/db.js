const {Sequelize, DataTypes} = require('sequelize');
console.log('process-->'+process.env.DATABASE_NAME)

const sequelize = new Sequelize(process.env.DATABASE_NAME,process.env.DATABASE_USER,process.env.DATABASE_PASS,{
    host: process.env.DATABASE_HOSTNAME,
    dialect: 'mysql'
})
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
const Apuntes = sequelize.define('unaApunte',{
    idApunte:{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    autores:{type: DataTypes.STRING(100)},
    titulo:{type: DataTypes.STRING(100)},
    materia:{type: DataTypes.STRING(120)},
    catedra:{type: DataTypes.STRING(60)},
    fechaSubida:{type: DataTypes.DATE},
    usuario:{type: DataTypes.INTEGER, references:{model:Usuarios,key:'idUsuario'}},
    dirurl:{type: DataTypes.STRING(270)}
},{timestamps:false});
const Secciones = sequelize.define('unaSeccione',{
    idSeccion:{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    nombreSeccion:{type: DataTypes.STRING(45), allowNull:false},
    descripcion:{type: DataTypes.STRING(100), allowNull:false},
    img: {type: DataTypes.STRING(12), allowNull:null}
},{timestamps:false});
const Catedras = sequelize.define('unaCatedra',{
    idCatedra:{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    catedra:{type: DataTypes.STRING(60)},
    materia:{type: DataTypes.STRING(120)},
    profesores:{type: DataTypes.STRING(100)},
    fechaHora:{type: DataTypes.DATE},
    idAutor:{type: DataTypes.INTEGER,references:{model:Usuarios,key:'idUsuario'}}
},{timestamps:false});
const ComentariosCatedra = sequelize.define('unaComentarioXcatedra',{
    idComentario:{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    idCatedra:{type: DataTypes.INTEGER, references:{model:Catedras,key:'idCatedra'}},
    idUsuario:{type: DataTypes.INTEGER, references:{model:Usuarios,key:'idUsuario'}},
    contenido:{type: DataTypes.TEXT, allowNull:false},
    fechaHora:{type: DataTypes.DATE}
},{timestamps:false});
const Temas = sequelize.define('unaTema',{
    idTema :{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    titulo :{type: DataTypes.STRING(180), allowNull:false},
    idSeccion:{type: DataTypes.INTEGER, references:{model:Secciones,key:'idSeccion'}},
    idUsuario:{type: DataTypes.INTEGER, references:{model:Usuarios,key:'idUsuario'}},
    palabraClave1:{type: DataTypes.STRING(24), allowNull:true},
    palabraClave2:{type: DataTypes.STRING(24), allowNull:true},
    palabraClave3:{type: DataTypes.STRING(24), allowNull:true},
    fechaCreacion:{type: DataTypes.DATE, allowNull:false},
    comentarioInicial:{type: DataTypes.TEXT, allowNull:false}
},{timestamps:false});

const start = async()=>{
    try{
        await sequelize.authenticate();
    }catch(err){
        console.log('->Error en conexion a la BD: '+err)
    }    
}

module.exports = {start,Secciones,Usuarios,Temas,Apuntes,Catedras,ComentariosCatedra};