const {ExtractJwt} = require('passport-jwt');
const StrategyJwt = require('passport-jwt').Strategy;
const passport = require('passport');

// Initializing passport and setting his verification's callback:
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const verifyCallback = (jwtPayload,done)=>{ 
    //AGREGAR: "BUSCAR AL USUARIO MEDIANTE EL jwtPayload.id" ??
    done(null,true) //done(null,true,{user:}) //-->NO por ahora(a utilizar a futuro)
}
const pasaporteJwt = new StrategyJwt(opts,verifyCallback);

// Authentication callback:
const autenticacionjwt = (req,res,next) => {
    passport.authenticate('autenticacionjwt', {session:false},(err,encontrado)=>{
        if (err) return next(err);
        if(!encontrado){
            let error = new Error();
            error.code = 401;
            error.message = 'Error 1 en el loggeo';
            next(error);
        }else{
            next();
        }     
    })(req,res,next)
};

module.exports = {pasaporteJwt, autenticacionjwt}