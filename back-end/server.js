const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
app.set('port',process.env.PORT || 3000);

// Middleware morgan para loggear llegada de requests:
app.use(morgan('dev'));
// url-encodeando: (para parsear application/x-www-form-urlencoded)
app.use(express.urlencoded({extended:false}))
// JSONificando el request que llega: (para parsear application/json)
app.use(express.json());

app.use(express.static(path.join(__dirname,'../front-end/dist')));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'../front-end/dist/index.html'))
})

module.exports = app;