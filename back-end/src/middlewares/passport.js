const {ExtractJwt} = require('passport-jwt');
const StrategyJwt = require('passport-jwt').Strategy;
const passport = require('passport');

var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

const pasaporteJwt = new StrategyJwt(opts,(jwtPayload,done)=>{
    done(null,true);
});

const autenticacionjwt = (req,res,next) => {
    passport.authenticate('autenticacionjwt', {session:false},(err,encontrado)=>{
        if (err) return next(err);
        if(!encontrado){
            let error = new Error();
            error.code = 401;
            error.message = 'Error en el loggeo';
            next(error);
        }else{
            next();
        }     
    })(req,res,next)
};

module.exports = {pasaporteJwt, autenticacionjwt}