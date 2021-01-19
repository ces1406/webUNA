const {Router} = require('express');
const path = require('path');
const {start,Secciones} = require('../model/db');

class RutasSecciones {
    constructor(){
        this.router = Router();
        start();
        this.routes();
    }
    getSections = async (req,res)=>{
        const secciones = await Secciones.findAll();
        console.log('secciones: '+JSON.stringify(secciones));
        res.json({secciones})
    }
    getSection = async (req,res)=>{
        console.log('req.body: '+JSON.stringify(req.body))
    }
    routes(){
        this.router.get('/', this.getSections);
        this.router.get('/:idSeccion', this.getSection);
    }
}

module.exports = RutasSecciones;

/*const routerSecciones = Router();
routerSecciones.get('/sections',async(req,res)=>{
    await start();
    console.log('SEcciones.findAll: '+JSON.stringify(Secciones.findAll()))
    res.send(await Secciones.findAll());
})
module.exports = routerSecciones*/