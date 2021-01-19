const validator = require('validator');

const sanitizaUsuario = (req,res,next)=>{
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

module.exports = sanitizaUsuario;