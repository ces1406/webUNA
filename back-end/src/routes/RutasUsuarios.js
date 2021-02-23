const {Router} = require('express');
const path = require('path');
const {start,Usuarios} = require('../model/db');
const cargarImg = require('../middlewares/multer');
const mailer = require ('../common_utilities/mailer');
const {sanitizaRegistro, sanitizaLogin, sanitizaUserRecup} = require('../middlewares/sanitize');
const {validaRegistro, validaLogin, validadUserRecup} = require('../middlewares/validate');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');
const validator = require('validator');
const {autenticarJwt} = require('../middlewares/passport');
const jwt = require ('jsonwebtoken');

class RutasUsuarios {
    constructor(){
        this.router = Router();
        start();
        this.routes();
    }    
    mailExist = (unMail) => {
        return new Promise(async (res,rej)=>{
            const cant = await Usuarios.count({where:{mail:unMail}});
            if(cant===0) {
                console.log('no esiste el mail')
                res(true); //por devolver algo
            }else{
                rej({ code: 400,msj:'El mail indicado ya esta registrado' })
            }
        })
    }
    nicknameExist = (unApodo) => {
        return new Promise(async (res,rej)=>{
            const cant = await Usuarios.count({where:{apodo:unApodo}})
            if(cant===0) {
                console.log('cant 0 => no existe el apodo')
                res(true);
            }else{
                console.log('cant 1 => si existe el apodo')
                res(false);//rej({ code: 400, msj:'El apodo indicado ya esta registrado' })
            }
        })
    }
    crearRandomString = () => {
        return new Promise((res,rej) => {
            crypto.randomBytes(17, (err,buff)=>{
                console.log('randombidtes')
                if(err) rej({code:500})
                res (buff.toString('hex'));
            });      
        })
    }
    crearToken = (iduser,apodo)=>{
        const token = jwt.sign({id:iduser,nick:apodo}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME});
        return token;
    }
    validarImg = (req, res, next) => {
        cargarImg(req, res, function (err) {
            if (err) {
                res.statusMessage = (err.code === 'LIMIT_FILE_SIZE') ? 'la imagen es demasiado grande (debe ser menor a 10 Kb)' :
                    'El tipo de imagen y su extension son erroneos (deben ser jpg, jpeg, png, o webp)';
                res.status(409).send(err.msg)
                next(err)
            } else {
                console.log('-->cargar ung ok -> llendo a next') 
                next();
            }
        })
    }

    /*getUsuario = async (req,res)=>{
        console.log('req.body: '+JSON.stringify(req.body))
    }*/
    postUsuario = async (req,res)=>{
        console.log('req.body: '+JSON.stringify(req.body));
        this.mailExist(req.body.mail)
            .then(async (rta) => {
                if(await this.nicknameExist(req.body.apodo) ){
                    console.log('No esiste el apodox')
                    return true;
                }else{
                    console.log('Vamo a tirar el throw')
                    throw ({ code:400, msj:'El apodo indicado ya esta registrado' });
                }
            })
            .then(rta => bcrypt.genSalt(10))
            .then(salt => bcrypt.hash(req.body.pass1, salt) )
            .then(async(hash)=>{
                let token = await this.crearRandomString();
                var user = await Usuarios.create({
                    apodo:req.body.apodo,
                    contrasenia:hash,
                    mail:req.body.mail,
                    rol:'USER',
                    fechaIngreso: (new Date()).toJSON().slice(0,19).replace('T',' '),
                    estadoCuenta:'SINCONF',
                    token: token,
                    dirImg: req.file? ('user-'+req.body.apodo+path.extname(req.file.originalname).toLowerCase() ): false,
                    redSocial1:req.body.facebook,
                    redSocial2:req.body.blog,
                    redSocial3:req.body.youtube });
                return {user,token};
            })
            .then(rta => {
                console.log('user creado: ');
                console.log(JSON.stringify(rta));
                console.log('user creado 2: ');
                let asunto = 'Registro en el sitio UNAweb';
                let contenido = 'Hola '+req.body.apodo+', haz click en el siguiente enlace para finalizar tu registro en el sitio:\n';
                contenido += process.env.URL_BACKEND + '/user/confirmregister/' + rta.user.idUsuario+ '/' + rta.token;
                console.log('user creado3: ');                
                mailer(req.body.mail,asunto,contenido);
                console.log('mail enviado...')
            })
            .then(rta => {
                if (req.file) {
                    fs.rename(  path.join(__dirname, '../../usersimgs/' + req.file.filename), 
                                path.join(__dirname, '../../usersimgs/user-' + req.body.apodo + path.extname(req.file.originalname).toLowerCase()), 
                                (errf) => {
                                    if (errf) throw errf
                                });
                }
            })
            .then(rta=>{
                console.log('otro then')
                res.status(201).send({msj: 'Te has unido a unaweb, te enviamos un mail para confirmar tu registro.'});
            })
            .catch(err=>{
                console.log('catch error--> '+err);
                if (req.file) {
                    fs.unlink(path.join(__dirname, '../../usersimgs/' + req.file.filename), (errf) => {
                        if (errf) throw errf
                    });
                }
                res.statusMessage = err.msj
                res.status(err.code?err.code:409).send()
            })
    }
    getUsuarios = async (req,res)=>{
        try{
            const usuarios = await Usuarios.findAll();
            console.log('usuarios: '+JSON.stringify(usuarios));
            res.json({usuarios})
        }catch (err) {
            res.statusMessage = 'Error';
            return res.status(err.code).send();
        }        
    }
    checkNickname = (req,res)=>{
        if(this.nicknameExist(validator.escape(validator.trim(req.params.nick)))){
            res.status(200).send({disponible: true});
        }else{
            res.status(200).send({disponible: false});
        }
    }
    habilitaUsuario = async (req,res)=>{
        try{      
            let users = await Usuarios.findAll({where:{idUsuario:req.params.idUsuario}});        
            if (req.params.token === users[0].token){
                console.log('-->habilitaUsuario: '+users[0].idUsuario)
                console.log('-->token OK');
                await Usuarios.update({estadoCuenta:'HABILIT'},{where:{idUsuario:req.params.idUsuario}});
                res.status(200).send({ registro: 'Finalizaste tu registro con éxito en UNAweb' })
            }      
        }catch (err) {
            res.statusMessage = 'Error';
            return res.status(err.code?err.code:500).send();
        }         
    }
    login = async (req,res)=>{
        try{
            console.log('Me llegó:'+req.body.apodo+' - '+req.body.password);
            if( await this.nicknameExist(req.body.apodo)) throw ({code:400});
            let user = await Usuarios.findAll({where:{apodo:req.body.apodo}});
            bcrypt.compare(req.body.password,user[0].contrasenia,(err,rta)=>{
                console.log('comparando:',rta)
                if(rta){
                    if(err) throw err;
                    if(user[0].estadoCuenta === 'HABILIT'){
                        console.log('usuario habilitado')
                        return res.status(201).json({usuario:{
                            apodo:user[0].apodo, idUsuario:user[0].idUsuario, mail:validator.unescape(user[0].mail),
                            redSocial1: (user[0].redSocial1 === null) ? null : validator.unescape(user[0].redSocial1), 
                            redSocial2: (user[0].redSocial2 === null) ? null : validator.unescape(user[0].redSocial2),
                            redSocial3: (user[0].redSocial3 === null) ? null : validator.unescape(user[0].redSocial3), 
                            dirImg: user[0].dirImg, rol: user[0].rol
                        },token: this.crearToken(user[0].idUsuario, user[0].apodo), msj: 'bienvenido a unaWeb'})
                    }else{
                        res.statusMessage = 'todavía no estas habilitado, chequea tu casilla de mail para terminar de registrarte'
                        return res.status(401).send()
                    }
                }else{//no coinciden:
                    // contrasenia incorrecta
                    res.statusMessage = 'Error en el usuario o contraseña';
                    return res.status(401).send()
                }
            })            
        }catch(err){
            return res.status(err.code?err.code:500).send();
        }
    }
    recuperarpassw = async (req,res)=>{
        try{
            console.log('Recupera pass->Me llegó:'+req.body.apodo+' - '+req.body.mail);
            if( await this.nicknameExist(req.body.apodo)) throw ({code:400});
            if( await Usuarios.count({where:{mail:req.body.mail}}) === 0) {console.log('??');throw ({code:400});}
            let user1 = await Usuarios.findAll({where:{apodo:req.body.apodo}});
            let user2 = await Usuarios.findAll({where:{mail:req.body.mail}});
            if(user1[0].idUsuario !== user2[0].idUsuario){
                console.log('->recuperarpassw: los user no coinciden')
                res.statusMessage = 'Error en el usuario o el mail indicado';
                return res.status(401).send()
            }else{
                console.log('los users SI coinciden');
                var pass = crypto.randomBytes(4);
                let asunto = 'olvido de contraseña en unavisuales';
                let contenido = 'Hola ' + req.body.apodo + ', tu nueva contraseña es: ' + pass.toString('hex') + ' .Si nunca solicitaste una nueva contraseña'
                contenido += ' entonces otra persona esta en conocimiento de tu apodo y tu dirección de mail registrados en nuestro sitio.';
                mailer(req.body.mail,asunto,contenido);
                console.log('se mando el mail con la pass: '+pass.toString('hex'));
                //return ({ id: rta.idUsuario, pass: pass.toString('hex') });
                bcrypt.hash(pass.toString('hex'), 10, (err, hash) => { //en lugar de usar genSalt() pongo el 10 directamente
                    if (err) throw ({ code: 500, msj: 'Tuvimos un inconviente, intenta mas tarde' });
                    console.log('usuario updateado')
                    Usuarios.update({contrasenia:hash},{where:{idUsuario:user1[0].idUsuario}});
                });
                res.status(201).send({ msj: 'Revisa tu correo para conocer tu nueva contraseña' })
            }            
        }catch(err){
            return res.status(err.code?err.code:500).send();
        }
    }
    updateUsuario = async (req,res)=>{
            console.log('-->users.js->actualizando usuario->req.body: ' + JSON.stringify(req.body)); 
            if (validator.isEmpty(validator.escape(validator.trim(req.body.idUser)))) rej({ code: 'FIELD_ERROR', msj: 'completa correctamente' });
            switch (req.body.tipo) {
                case 'img':
                    console.log('-->users.js->actualizando usuario->IMG ') 
                        if (req.file) {
                            // Eliminar la imagen anterior si existe
                            if (fs.existsSync(path.join(__dirname, '../../usersimgs/user-' +req.body.apodo+'.webp'))) {
                                console.log('-->users.js->actualizando usuario-> existia una img') 
                                fs.unlinkSync(path.join(__dirname, '../../usersimgs/user-' + req.body.apodo+'.webp'));
                            }else if(fs.existsSync(path.join(__dirname, '../../usersimgs/user-' +req.body.apodo+'.jpeg'))){
                                fs.unlinkSync(path.join(__dirname, '../../usersimgs/user-' + req.body.apodo+'.jpeg'));
                            }else if(fs.existsSync(path.join(__dirname, '../../usersimgs/user-' +req.body.apodo+'.jpg'))){
                                fs.unlinkSync(path.join(__dirname, '../../usersimgs/user-' + req.body.apodo+'.jpg'));
                            }else if(fs.existsSync(path.join(__dirname, '../../usersimgs/user-' +req.body.apodo+'.png'))){
                                fs.unlinkSync(path.join(__dirname, '../../usersimgs/user-' + req.body.apodo+'.png'));
                            }
                            fs.rename(path.join(__dirname,  '../../usersimgs/' + req.file.filename),
                                path.join(__dirname, '../../usersimgs/user-' + req.body.apodo + path.extname(req.file.originalname).toLowerCase()),
                                (err1) => {
                                    if (err1){
                                        res.statusMessage = 'Tuvimos un inconviente, intenta mas tarde' 
                                        res.status(500).send();//err1;
                                    }else{
                                        Usuarios.update({dirImg:'user-'+req.body.apodo+path.extname(req.file.originalname).toLowerCase()},{where:{idUsuario:req.body.idUser}});
                                        res.status(201).send({ msj: 'La imagen fue reemplazada con exito' })
                                    }
                                });
                        }                        
                    break;
                case 'pass':
                    console.log('-->users.js->actualizando usuario->PASS ') 
                    if (validator.isEmpty(validator.escape(validator.trim(req.body.password0))) ||
                        validator.isEmpty(validator.escape(validator.trim(req.body.password1))) ||
                        validator.isEmpty(validator.escape(validator.trim(req.body.password2)))) {
                            console.log('-->users.js->actualizando usuario->MAL LAS PASS ') 
                        return res0.status(401).send()
                    } else {
                        console.log('-->users.js->actualizando usuario->BIEN LAS PASS ') 
                        let usuario = await Usuarios.findAll({where:{idUsuario:validator.trim(req.body.idUser)}});//database.searchUserById(validator.escape(validator.trim(req.body.idUser)));
                        console.log('-->users.js->actualizando usuarioS:',usuario); 
                        if (usuario[0] === undefined) return res0.status(401).send();
                        if (usuario[0].contrasenia) {
                            console.log('-->users.js->actualizando usuario->TIENE CONTRASENIA') 
                            bcrypt.compare(req.body.password0, usuario[0].contrasenia, (err, rta) => {
                                if (rta) {
                                    if (err) return res0.status(401).send();
                                    if (usuario[0].estadoCuenta === 'HABILIT') {
                                        console.log('-->users.js->actualizando usuario->USUARIO HABILITADO ') 
                                        bcrypt.hash(req.body.password1, 10)
                                            .then(passHashed => Usuarios.update({contrasenia:passHashed},{where:{idUsuario:req.body.idUser}}) )
                                                //database.updateUserPromise('contrasenia', passHashed, req.body.idUser))
                                            .then(rta => { res.status(201).send({ msj: rta.msg }) })
                                            .catch((err) => {
                                                res.statusMessage = err.msj || err;
                                                res.status(409).send();
                                            });
                                    } else {
                                        return res.status(401).send();
                                    };
                                } else {
                                    // contrasenia incorrecta
                                    res.statusMessage = 'Error en el usuario o contraseña';
                                    return res.status(401).send()
                                }
                            });
                        } else {
                            // contrasenia vacía
                            res.statusMessage = 'Error en el usuario o contraseña';
                            return res.status(401).send()
                        }
                    }
                    break;
                case 'mail':
                    if (!validator.isEmail(validator.escape(validator.trim(req.body.mail)))) {
                        res.status(409).send()
                    } else {
                        database.mailRepeatPromise(req.body.mail, 'apodoficticio')
                            .then(() => Usuarios.update({mail:req.body.mail},{where:{idUsuario:req.body.idUser}}) )
                            //database.updateUserPromise('mail', req.body.mail, req.body.idUser))
                            .then(rta => {
                                res.status(201).send({ msj: rta.msj })
                            })
                            .catch((err) => {
                                res.statusMessage = err.msj || err;
                                res.status(409).send();
                            });
                    }
                    break;
                case 'redSoc1':
                    let redSoc1 = (validator.trim(req.body.redSoc1)).startsWith('http')?validator.escape(validator.trim(req.body.redSoc1)):validator.escape('http://'+validator.trim(req.body.redSoc1));        
                    Usuarios.update({redSocial1:redSoc1},{where:{idUsuario:req.body.idUser}})
                        .then(rta => {
                            res.status(201).send({ msj: rta.msj })
                        })
                        .catch((err) => {
                            res.statusMessage = err.msj || err;
                            res.status(409).send()
                        });
                    break;
                case 'redSoc2':
                    let redSoc2 = (validator.trim(req.body.redSoc2)).startsWith('http')?validator.escape(validator.trim(req.body.redSoc2)):validator.escape('http://'+validator.trim(req.body.redSoc2));
                    Usuarios.update({redSocial2:redSoc2},{where:{idUsuario:req.body.idUser}})
                        .then(rta => {
                            res.status(201).send({ msj: rta.msj })
                        })
                        .catch((err) => {
                            res.statusMessage = err.msj || err;
                            res.status(409).send()
                        });
                    break;
                case 'redSoc3':
                    let redSoc3 = (validator.trim(req.body.redSoc3)).startsWith('http')?validator.escape(validator.trim(req.body.redSoc3)):validator.escape('http://'+validator.trim(req.body.redSoc3));
                    Usuarios.update({redSocial3:redSoc3},{where:{idUsuario:req.body.idUser}})
                        .then(rta => {
                            res.status(201).send({ msj: rta.msj })
                        })
                        .catch((err) => {
                            res.statusMessage = err.msj || err;
                            res.status(409).send()
                        });
                    break;
                case 'estado':
                    if (validator.isEmpty(validator.escape(validator.trim(req.body.estado)))) {
                        res.status(409).send()
                    } else {
                        Usuarios.update({estadoCuenta:req.body.estado},{where:{idUsuario:req.body.idUser}})
                            .then(rta => {
                                res.status(201).send({ msj: rta.msj })
                            })
                            .catch((err) => {
                                res.statusMessage = err.msj || err;
                                res.status(409).send()
                            });
                    }
                    break;
                default:
                    break;
            }
    }
    routes(){
        //this.router.get('/', this.getUsuarios);
        this.router.post('/', this.validarImg, sanitizaRegistro, validaRegistro, this.postUsuario);
        this.router.post('/login',sanitizaLogin, validaLogin, this.login);
        this.router.post('/recuperapass',sanitizaUserRecup, validadUserRecup, this.recuperarpassw)   
        this.router.get('/checknick/:nick',this.nicknameExist);
        this.router.post('/update/', this.validarImg,this.updateUsuario);//autenticarJwt,this.validarImg,this.updateUsuario);
        //this.router.get('/:idUsuario', this.getUsuario);
        this.router.get('/confirmregister/:idUsuario/:token',this.habilitaUsuario)
    }
}

module.exports = RutasUsuarios;