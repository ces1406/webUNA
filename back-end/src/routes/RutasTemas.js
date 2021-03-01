const {Router} = require('express');
const RutasApuntes = require('./RutasApuntes');
const RutasCursos = require('./RutasCursos');
const path = require('path');
const {start,Secciones,Temas} = require('../model/db');
const {Op} = require('sequelize');

class RutasTemas {
    constructor(){
        start();
        this.router = Router();
        this.enrutar()
        this.routes();
    }
    enrutar = ()=>{
        const rutasCursos = new RutasCursos();
        const rutasApuntes = new RutasApuntes();
        this.router.use('/cursos',rutasCursos.router);
        this.router.use('/apuntes',rutasApuntes.router);
    }
    checkSection = async (req,res)=>{
        try {
            console.log('checkSection');
            res.status(200)
        } catch (error) {
            console.log('->Error: '+JSON.stringify(error));
            res.status(500).send({ msg: error.msg }) 
        }
    }
    getSections = async (req,res)=>{
        try {
            console.log('getSections');
            res.status(200)
        } catch (error) {
            console.log('->Error: '+JSON.stringify(error));
            res.status(500).send({ msg: error.msg }) 
        }
    }
    getSection = async (req,res)=>{
        try {
            console.log('getSection');
            res.status(200)
        } catch (error) {
            console.log('->Error: '+JSON.stringify(error));
            res.status(500).send({ msg: error.msg }) 
        }
    }
    routes(){
        this.router.get('/', this.getSections);
        this.router.get('/checksection/:idSec/:nombSec',this.checkSection);
        this.router.get('/:idSec/:pagActiva/:cantTems', this.getSection);        
    }
}

module.exports = RutasTemas;