// CARTS
const express = require("express")
const { Router } = express
const contenedor = require('../controllers/contenedorProd');
const container = require('../controllers/contenedorCarts');
const carts = new Router()
const sendWhatsappToAdmin = require('../controllers/contenedorTwilio')


carts.get('/:id', async (req, res) => {
    const id = req.params.id
    const carro = await container.getCartById(id)
    res.send(carro)
})

carts.delete('/:id', async (req, res) => {
    const id = req.params.id
    const deleteCart = await container.deleteCartByID(id)
    if(isNaN(id)) {
        res.send('El valor ingresado no es un numero')
    } else {
        res.send(deleteCart)
    }
})

carts.get('/:id/productos', async (req, res) => {
    const id = req.params.id
    const idProd = await container.getByIdProds(id)
    res.send(idProd)
})

carts.get('/:id/productos/:id_prod', async(req, res) =>{
    try{
        await container.saveProdId(req.params.id, req.params.id_prod);
        res.redirect('/')
    } catch(err){
        res.send(`${err} Error en el router.post-producto`)
    }
})

carts.get('/:id/deleteProd/:id_prod', async (req, res) => {
    const id = req.params.id
    const id_prod = req.params.id_prod
    const updCartId = await container.deleteProdById(id, id_prod)
    res.redirect('/cart')
})

carts.get('/:id/finishPurchase', async (req,res) => {
    const idCart = req.params.id
    const email = req.user.email
    console.log(idCart)
    await sendWhatsappToAdmin(idCart, email)
    res.redirect('/cart')
})

module.exports = carts