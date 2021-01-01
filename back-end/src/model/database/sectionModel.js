const {Sequelize, DataTypes} = require('sequelize');

const Secciones = sequelize.define('unaSeccione',{
    idSeccion:{type: DataTypes.INTEGER, allowNull:false, unique:true, primaryKey:true},
    nombreSeccion:{type: DataTypes.STRING(45), allowNull:false},
    descripcion:{type: DataTypes.STRING(100), allowNull:false},
    img: {type: DataTypes.STRING(12), allowNull:null}
},{
    timestamps:false
})

module.exports = Secciones