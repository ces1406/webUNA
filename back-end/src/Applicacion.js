const express = require('express');
const morgan = require('morgan');
const path = require('path');
const passport = require('passport');
const {pasaporteJwt} = require ('./middlewares/passport');
const RutasSecciones = require('./routes/RutasSecciones');
const RutasUsuarios = require('./routes/RutasUsuarios');
const RutasTemas = require('./routes/RutasTemas');

class Applicacion {
    constructor(){
        this.app = express();
        this.setPort();
        this.setMiddlewares();
        this.enrutar();
    }
    setPort = ()=>{
        this.app.set('port',process.env.PORT||5000);
    }
    setMiddlewares = ()=>{
        this.app.use(morgan('dev'));
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(express.json());
        this.app.use(this.handleCors);
        this.app.use(passport.initialize());
        passport.use('autenticacionjwt',pasaporteJwt);
        //this.app.use(express.static(path.join(__dirname,'../static_files')));
    }
    enrutar = ()=>{
        const rutasSecciones = new RutasSecciones();
        const rutasUsuarios = new RutasUsuarios();
        const rutasTemas = new RutasTemas();
        this.app.use('/sections',rutasSecciones.router);
        this.app.use('/user',rutasUsuarios.router);
        this.app.use('/temas',rutasTemas.router);
    }
    handleCors = (req,res,next)=>{
        res.set('Access-Control-Allow-Origin','*');
        next(); 
    }
    startServer = ()=>{
        this.app.listen(this.app.get('port'),()=>{console.log('Servidor corriendo en el puerto->',this.app.get('port'))});
    }
}

module.exports = Applicacion;