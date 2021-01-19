const validator = require('validator');

const validaUsuario = (req, res, next) => {
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

module.exports = validaUsuario;