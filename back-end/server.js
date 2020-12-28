const app = require('./src/app');

async function iniciar (){
    app.listen(app.get('port'));
}

iniciar();