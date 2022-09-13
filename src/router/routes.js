
const express = require("express")
const { Router } = express
const ruta = new Router()
const passport = require('passport')
const container = require('../controllers/contenedorProd')
const carts = require('../controllers/contenedorCarts');
const fork = require('fork')
const path = require('path')

function isAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next()
    } else {
        res.redirect('/login')
    }
}

ruta.get('/register', async (req, res) => {
    res.render('register')
})

ruta.post('/register', passport.authenticate('register', { failureRedirect: '/failregister', successRedirect: '/login' }))

ruta.get('/failregister', async (req, res) => {
    res.render('register-error')
})

//---------------------------------------------------//
// RUTAS LOGIN

ruta.get('/login', async (req, res) => {
    res.render('login')
})

ruta.post('/login', passport.authenticate('login', { failureRedirect: '/faillogin', successRedirect: '/datos' }))

ruta.get('/faillogin', async (req, res) => {
    res.render('login-error')
})

//---------------------------------------------------//
// RUTAS DATOS

ruta.get('/datos', isAuth, async (req, res) => {
    const user = req.user.user
    const email = req.user.email
    const avatar = req.user.avatar

    const datos = { user, email, avatar }
    res.render('index', {datos})
})

//---------------------------------------------------//
// RUTAS LOGOUT

ruta.get('/logout', async (req, res) => {
    req.logout(err => {
        req.session.destroy()
        res.redirect('/login')
    })
})

//---------------------------------------------------//
// RUTAS INICIO

ruta.get('/', async(req, res) => {
    res.redirect('/datos')
})

//---------------------------------------------------//
// RUTAS INFO

ruta.get('/info', isAuth, async(req, res) => {
    const processId = process.pid
    const nodeVersion = process.version
    const operativeSystem = process.platform
    const usedMemory = process.memoryUsage().rss
    const currentPath = process.cwd()

    const info = { processId, nodeVersion, operativeSystem, usedMemory, currentPath }
    res.render('info', {info})
})


ruta.get('/randoms', isAuth, async(req, res) => {
    const cant = req.query.cant || 10000
    const computo = fork(path.resolve(__dirname, './src/fork/getRamdoms.js'))
    computo.on('message', numbers => {
        if(numbers === 'listo') {
        computo.send(cant)
        } else {
        res.json({numbers})
        }
    })
})

// CUENTA

ruta.get('/account', isAuth, async(req, res) => {
    const email = req.user.email
    const avatar = req.user.avatar
    const user = req.user.user
    const phone = req.user.phone
    const direction = req.user.direction
    const age = req.user.age
    
    const datos = { email, avatar, user, phone, direction, age}
    res.render('account', {datos})
})

ruta.get('/delete/:id', async (req, res) => {
    const deleteProd = req.params.id
    const deleted = container.deleteById(deleteProd)
    res.redirect('/datos')
})


ruta.get('/cart', isAuth, async (req, res) => {
    const email = req.user.email
    const avatar = req.user.avatar
    const user = req.user.user
    const phone = req.user.phone
    const direction = req.user.direction
    const age = req.user.age
    
    const datos = { email, avatar, user, phone, direction, age}
    const prodCart = await carts.getProdsOfCarts(user)

    const jsonStr = JSON.stringify(prodCart, null, 2)
    const str =jsonStr.substring(1,jsonStr.length - 1)

    const nose = JSON.parse(str, null, 2)
    const car = nose.productos
    const carros = JSON.parse('[' + car + ']')
    res.render('cart', {datos, carros})
})

module.exports = ruta