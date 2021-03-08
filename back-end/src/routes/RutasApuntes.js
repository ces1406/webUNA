const {Router} = require('express');
const path = require('path');
const {start,Apuntes, Usuarios} = require('../model/db');
const {sanitizaApunte, sanitizaLink} = require('../middlewares/sanitize');
const {validaApunte, validaEnlace} = require('../middlewares/validate');
const {autenticacionjwt} = require('../middlewares/passport');
const {Op} = require('sequelize');

class RutasApuntes {
    constructor(){
        this.router = Router();
        start();
        this.routes();
    }
    uploadApunte = async (req,res)=>{
        try {
            if(await Apuntes.count({where:{dirurl:req.body.link}})!==0){
                res.statusMessage='Ya existe un enlace a ese apunte';
                res.status(400).send();
            }else{
                var apunte = await Apuntes.create({
                    autores:req.body.autor,
                    materia:req.body.materia,
                    titulo:req.body.titulo,
                    dirurl:req.body.link,
                    catedra:req.body.catedra,
                    usuario:req.body.idUsuario,
                    fechaSubida: (new Date()).toJSON().slice(0,19).replace('T',' ')
                });
                res.status(201).send({msg:'El apunte fue subido'}); // TODO: opcion->contestar con el apunte creado-segun REST-
            }
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    search = async (req,res) => {
        console.log('search')
        try {
            let rta = await Apuntes.findAll({
                include:[{
                    model:Usuarios,
                    required:true,
                    attributes:['apodo'],                    
                }],
                where:{
                    [Op.and]:[
                        {autores:{[Op.like]:'%'+req.body.autor+'%'}},
                        {materia:{[Op.like]:'%'+req.body.materia+'%'}},
                        {titulo:{[Op.like]:'%'+req.body.titulo+'%'}}
                    ]
                },
                order:[['fechaSubida','ASC']],
                offset:(req.params.pagActiva-1)*req.params.cantPorPag,
                limit:parseInt(req.params.cantPorPag,10)
            })
            console.log('rta: ',rta)
            return res.status(201).json(rta)
        } catch (err) {
            res.status(500).send({ msg: err.msg })
        }
    }
    delete = async (req,res) => {
        try {
            //TODO: chequear que sea un Admin
            await Apuntes.destroy({where:{idApunte:req.body.idApunte}});
            res.status(201).send({ msj: 'el apunte se elimino' })
        } catch (error) {
            res.status(500).send({ msg: error.msg })
        }
    }
    routes(){
        this.router.post('/', sanitizaLink, sanitizaApunte, validaApunte, validaEnlace, autenticacionjwt, this.uploadApunte);
        this.router.post('/search/:pagActiva/:cantPorPag', sanitizaApunte, validaApunte, this.search);
        this.router.post('/delapunte', this.delete); 
    }
}

module.exports = RutasApuntes;