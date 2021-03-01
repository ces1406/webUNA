const {Router} = require('express');
const path = require('path');
const {start,Secciones,Temas} = require('../model/db');
const {Op} = require('sequelize');

class RutasSecciones {
    constructor(){
        this.router = Router();
        start();
        this.routes();
    }
    getSections = async (req,res)=>{
        try {
            const secciones = await Secciones.findAll();
            console.log('secciones: '+JSON.stringify(secciones));
            res.status(200).json({secciones})
        } catch (err){
            res.status(200).send({msg: errr.msg})
        }        
    }
    getSection = async (req,res)=>{
        console.log('->getSection-params: '+JSON.stringify(req.params));
        try {
            let temas = await Temas.findAll({
                where:{idSeccion:req.params.idSec},
                order:[['fechaCreacion','DESC']],
                offset:(req.params.pagActiva-1)*req.params.cantTems,
                limit:parseInt(req.params.cantTems,10)
            });
            console.log('->temas: '+JSON.stringify(temas));
            res.status(200)
        } catch (error) {
            console.log('->Error: '+JSON.stringify(error));
            res.status(500).send({ msg: error.msg })            
        }
    }
    checkSection = async (req,res)=>{
        try {
            let busq = await Secciones.count({where:{[Op.and]:[{idSeccion:req.params.idSec},{nombreSeccion:req.params.nombSec}]}});
            res.status(200).json({rta:busq?true:false})
        } catch (error) {
            res.status(500).send();            
        }
    }
    routes(){
        this.router.get('/', this.getSections);
        this.router.get('/checksection/:idSec/:nombSec',this.checkSection);
        this.router.get('/:idSec/:pagActiva/:cantTems', this.getSection);        
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