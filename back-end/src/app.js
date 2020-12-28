const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();

app.set('port',process.env.PORT || 5000);

app.get('/',(req,res)=>{
    res.send('HOLA MUDO')
})

module.exports = app;