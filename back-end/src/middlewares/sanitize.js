const validator = require('validator');

const sanitizaRegistro = (req,res,next)=>{
    req.body.apodo = validator.escape(validator.trim(req.body.apodo));
    req.body.facebook = (validator.trim(req.body.facebook)).startsWith('http')? validator.escape(validator.trim(req.body.facebook))
                                                                                :validator.escape('http://'+validator.trim(req.body.facebook));
    req.body.blog = (validator.trim(req.body.blog)).startsWith('http')? validator.escape(validator.trim(req.body.blog))
                                                                        :validator.escape('http://'+validator.trim(req.body.blog));
    req.body.youtube = (validator.trim(req.body.youtube)).startsWith('http')?   validator.escape(validator.trim(req.body.youtube))
                                                                                :validator.escape('http://'+validator.trim(req.body.youtube));
    req.body.mail = validator.escape(validator.trim(req.body.mail));
    req.body.facebook = validator.escape(validator.trim(req.body.facebook));
    req.body.blog = validator.escape(validator.trim(req.body.blog));
    req.body.youtube = validator.escape(validator.trim(req.body.youtube));
    req.body.pass1 = validator.escape(validator.trim(req.body.pass1));
    req.body.pass2 = validator.escape(validator.trim(req.body.pass2));
    next();
}
const sanitizaLogin = (req,res,next)=>{
    req.body.apodo = validator.escape(validator.trim(req.body.apodo.toString()));
    req.body.password = validator.escape(validator.trim(req.body.password.toString()));
    next()
}
const sanitizaUserRecup = (req, res, next) => {
    req.body.apodo = validator.escape(validator.trim(req.body.apodo));
    req.body.mail = validator.escape(validator.trim(req.body.mail));
    next();
}
const sanitizaApunte = (req,res,next) => {
    req.body.titulo = validator.escape(validator.trim(req.body.titulo))
    req.body.autor = validator.escape(validator.trim(req.body.autor));
    req.body.materia = validator.escape(validator.trim(req.body.materia));
    req.body.catedra = validator.escape(validator.trim(req.body.catedra));
    next();
}
const sanitizaLink = (req,res,next) => {  
    req.body.link = (validator.trim(req.body.link)).startsWith('http')?validator.escape(validator.trim(req.body.link)):validator.escape('http://'+validator.trim(req.body.link));                  
    next();
}
const sanitizaForo = (req, res, next) => {      
    req.body.profesor = validator.escape(validator.trim(req.body.profesor))
    req.body.materia = validator.escape(validator.trim(req.body.materia));
    req.body.catedra = validator.escape(validator.trim(req.body.catedra));
    req.body.idAutor = req.body.idAutor.toString();
    next();
}

module.exports = {sanitizaRegistro, sanitizaLogin, sanitizaUserRecup, sanitizaApunte, sanitizaLink, sanitizaForo}