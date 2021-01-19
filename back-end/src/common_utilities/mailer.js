const nodemailer = require('nodemailer');

mailer = async(usermail,asunto,contenido) => {
    console.log('en sendmail()CON: '+process.env.MAIL_BACKEND+'-'+process.env.MAIL_HOST)
    var transporter = await nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: false,
        auth: {
            user: process.env.MAIL_BACKEND,
            pass: process.env.MAIL_PASS
        }
    });
    var mailOptions = {
        from: process.env.MAIL_BACKEND,
        to: usermail,
        subject: asunto,
        text: contenido,
    }
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log('Error al enviar el mail err: ' + err)
        } else {
            console.log('Mail enviado exitosamente, respuesta: ' + info.response)
        }
    })
}

module.exports = mailer;