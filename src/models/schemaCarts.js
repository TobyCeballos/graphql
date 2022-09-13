const mongoose = require('mongoose');

const cartCollection = 'carrito';

const cartSchema = new mongoose.Schema({
    id: {type: String, required: true},
    productos: {type: String}
})

const carts = mongoose.model(cartCollection, cartSchema);

module.exports = carts;