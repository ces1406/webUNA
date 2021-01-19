const multer = require('multer');
const path = require('path');

const guardarImg = multer.diskStorage({
    destination: function (req, file, cb) { cb(null, path.join(__dirname, '../../usersimgs')) },
    filename: function (req, file, cb) { cb(null, Date.now() + path.extname(file.originalname).toLowerCase()) }
});
const filterImg = (req, file, cb) => {
    const fileTypes = /jpeg|png|webp|jpg/;
    const mimeTypes = fileTypes.test(file.mimetype);
    const extension = fileTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeTypes && extension) {
        return cb(null, true)
    } else {
        return cb("Tipo de archivo de la imagen no soportado", false)
    }
};

const subirImg = multer({ storage: guardarImg, limits: { fileSize: 10000 }, fileFilter: filterImg }).single('imgAvatar');

const uploadImagen = (req, res, next) => {
    subirImg(req, res, function (err) {
        if (err) {
            res.statusMessage = (err.code === 'LIMIT_FILE_SIZE') ? 'la imagen es demasiado grande (debe ser menor a 10 Kb)' :
                'El tipo de imagen y su extension son erroneos (deben ser jpg, jpeg, png, o webp)';
            res.status(409).send(err.msg)
            next(err)
        } else {
            next()
        }
    })
}

module.exports = uploadImagen;