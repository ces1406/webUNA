require('dotenv').config({ path:'.development.env'});
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = require('./src/app');

async function iniciar (){
    app.listen(app.get('port'));
}

iniciar();