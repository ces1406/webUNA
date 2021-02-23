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
module.exports = {validaRegistro, validaLogin, validadUserRecup}