const twilio = require('twilio')
require('dotenv').config()
const accountSid = `${process.env.ACCOUNT_SID}`
const authToken = `${process.env.AUTH_TOKEN}`
const carts = require('./contenedorCarts')

const twilioClient = twilio(accountSid, authToken)


module.exports = async function sendWhatsappToAdmin(idCart, email) {
    try {
        const arrProducts = await carts.getProdsOfCarts(idCart)
        const jsonStr = JSON.stringify(arrProducts, null, 2)
        const str = jsonStr.substring(1, jsonStr.length - 1)
        const nose = JSON.parse(str)
        const prod = nose.productos
        const prods = JSON.parse('[' + prod + ']')
        const from = 'whatsapp:+14155238886'
        const to = `whatsapp:${process.env.ADMIN_NUMBER}`
        const repeat = await prods.map(element => element.name);
        console.log(repeat)
        const body = 
        `Nuevo pedido del usuario: 
            - Nombre: ${idCart},
            - Email: ${email}
            
        Contenido del pedido:
            ${repeat}`
        console.log(body)
        const info = await twilioClient.messages.create({body, from, to})
        await carts.clearCart(idCart)
        return info
    } catch (error) {
        return (`sendMailToAdmin ERROR! -> ${error}`)
    }
}



