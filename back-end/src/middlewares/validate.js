const validator = require('validator');
const validaRegistro = (req, res, next) => {
    if (!validator.isEmail(req.body.mail)) res.status(409).send();
    if (validator.isEmpty(req.body.apodo) || validator.isEmpty(req.body.pass1) || validator.isEmpty(req.body.pass2)) res.status(409).send();
    if (!validator.equals(req.body.pass1, req.body.pass2)) res.status(409).send();
    if (req.body.apodo.length > 40) res.status(409).send();
    if (req.body.facebook.length > 140 || req.body.blog.length > 140 || req.body.youtube.length > 140) res.status(409).send();
    if (req.body.pass1.length > 8 || req.body.pass1.length < 6 || req.body.pass1 !== req.body.pass2){
        res.status(409).send();
    }else { 
        next();
    }
};
const validaLogin = (req, res, next) => {
    if (validator.isEmpty(req.body.apodo) || validator.isEmpty(req.body.password) || (req.body.password.length > 8 || req.body.password.length < 6) ){
        res.statusMessage = 'Usuario o contraseña erróneos';
        res.status(400).send()
        next(new Error());
    } else {
        next()
    }
}
const validadUserRecup = (req, res, next) => {
    if (!validator.isEmail(req.body.mail)) {
        res.statusMessage = 'mail incorrecto';
        res.status(400).send();
    }
    if (validator.isEmpty(req.body.apodo)) {
        res.statusMessage = 'apodo incorrecto';
        res.status(400).send();
    };
    next();
}
const validaApunte = (req,res,next) => {
    //console.log('-->temas.js->validadorUpApunte->req.body: '+JSON.stringify(req.body))  
    if (req.body.titulo.length > 100 || req.body.autor.length > 100 || req.body.materia.length > 120 || req.body.catedra.length > 100) {
        res.status(201).send({ msj: 'Algunos campos son demasiado extensos' })        
    } else {
        next();
    }
}
const validaEnlace = (req,res,next) => {
    if (req.body.link.length > 270) {
        res.status(201).send({ msj: 'Dirección del enlace demasiado extensa' })        
    } else {
        next();
    }
}
const validaForo = (req, res, next) => {
    if (req.body.profesor > 100 || req.body.materia.length > 120 || req.body.catedra.length > 60) {
        res.status(500).send({ msj: 'algunos campos son demasiado extensos' })
    } else if(req.body.materia.length==0||req.body.materia==null){
        res.status(500).send({msj:'completa con una materia'})
    }else if(!validator.isInt(req.body.idAutor)){
        res.status(500).send({msj:'-error-'})
    }else {
        next();
    }
}
module.exports = {validaRegistro, validaLogin, validadUserRecup, validaApunte, validaEnlace, validaForo}