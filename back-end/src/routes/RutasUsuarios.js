const {Router} = require('express');
const path = require('path');
const {start,Usuarios} = require('../model/db');
const uploadImagen = require('../middlewares/multer');
const mailer = require ('../common_utilities/mailer');
const sanitizaUsuario = require('../middlewares/sanitize');
const validaUsuario = require('../middlewares/validate');
const {Op} = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const fs = require('fs');

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

    getUsuario = async (req,res)=>{
        console.log('req.body: '+JSON.stringify(req.body))
    }
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
                //console.log('llegando con hash: '+hash);
                //console.log('req.file: '+JSON.stringify(req.file));
                //console.log('path.extname:'+path.extname(req.file.originalname).toLowerCase());
                //let fecha = (new Date()).toJSON().slice(0,19).replace('T',' ');
                //let withImg = req.file? path.extname(req.file.originalname).toLowerCase() : false;
                let token = await this.crearRandomString();
                var user = await Usuarios.create({
                    apodo:req.body.apodo,
                    contrasenia:req.body.pass1,
                    mail:req.body.mail,
                    rol:'USER',
                    fechaIngreso: (new Date()).toJSON().slice(0,19).replace('T',' '),
                    estadoCuenta:'SINCONF',
                    token: token,
                    dirImg: req.file? ('user-'+req.body.apodo+path.extname(req.file.originalname).toLowerCase() ): false,
                    redSocial1:req.body.facebook,
                    redSocial2:req.body.blog,
                    redSocial3:req.body.youtube });
                console.log('chau...usuario subido a BD--->',user);
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
        const usuarios = await Usuarios.findAll();
        console.log('usuarios: '+JSON.stringify(usuarios));
        res.json({usuarios})
    }
    checkNickname = async (req,res)=>{
        if(this.nicknameExist(validator.escape(validator.trim(req.params.nick)))){
            res.status(200).send({disponible: true});
        }else{
            res.status(200).send({disponible: false});
        }
    }
    habilitaUsuario = async (req,res)=>{
        let users = await Usuarios.findAll({where:{idUsuario:req.params.idUsuario}});        
        if (req.params.token === users[0].token){
            console.log('-->habilitaUsuario: '+users[0].idUsuario)
            console.log('-->token OK');
            await Usuarios.update({estadoCuenta:'HABILIT'},{where:{idUsuario:req.params.idUsuario}});
            res.status(200).send({ registro: 'Finalizaste tu registro con éxito en UNAweb' })
        }
    }
    routes(){
        this.router.post('/', uploadImagen, sanitizaUsuario, validaUsuario, this.postUsuario);
        this.router.get('/', this.getUsuarios);
        this.router.get('/checknick/:nick',this.nicknameExist);
        this.router.get('/:idUsuario', this.getUsuario);
        this.router.get('/confirmregister/:idUsuario/:token',this.habilitaUsuario)
    }
}

module.exports = RutasUsuarios;