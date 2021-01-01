const Secciones = require('./database/sectionModel');

class Sections {
    constructor(props){}
    giveSections(){
        const seccs = await Secciones.findAll();
    }
}