const nodemailer = require('nodemailer')
require('dotenv').config()


const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: `${process.env.SERVER_EMAIL}`,
        pass: `${process.env.SERVER_PASS}`
    }
});

module.exports = async function sendMailToAdmin(asunto, mensaje) {
    try {
        const info = await transporter.sendMail({
            from: `${process.env.SERVER_EMAIL}`,
            to: `${process.env.ADMIN_EMAIL}`,
            subject: asunto,
            text: mensaje,
        })
        return info
    } catch (error) {
        return (`sendMailToAdmin ERROR! -> ${error}`)
    }
}



