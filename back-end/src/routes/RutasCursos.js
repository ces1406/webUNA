const {Router} = require('express');
const path = require('path');
const {start,Secciones,Temas} = require('../model/db');
const {sanitizaForo} = require('../middlewares/sanitize');
const {validaForo} = require('../middlewares/validate');
const {autenticacionjwt} = require('../middlewares/passport');
const {Op} = require('sequelize');

class RutasCursos {
    constructor(){
        this.router = Router();
        start();
        this.routes();
    }
    postForo = async (req,res)=>{
        try {
            res.status(201).send({msg:'posteo de foro'});
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    searchForo = async (req,res)=>{
        try {
            res.status(201).send({msg:'search de foro'});
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    postOpinion = async (req,res)=>{
        try {
            res.status(201).send({msg:'posteo de opinion'});
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    deleteForo = async (req,res)=>{
        try {
            res.status(201).send({msg:'delete de foro'});
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    getOpiniones = async (req,res)=>{
        try {
            res.status(201).send({msg:'get opiniones'});
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    getCatedra = async (req,res)=>{
        try {
            res.status(201).send({msg:'get catedra'});
        } catch (error) {
            res.status(500).send({msg:error.msg});
        }
    }
    routes(){
        this.router.post('/', this.postForo);
        this.router.post('/search/:pagActiva/:cantPorPag', this.searchForo);
        this.router.post('/opinion',this.postOpinion);
        this.router.post('/delforo',this.deleteForo);
        this.router.get('/opiniones/:idCatedra/:pagActiva/:cantCom',this.getOpiniones);
        this.router.get('/catedra/:idCatedra',this.getCatedra)
    }
}

module.exports = RutasCursos;