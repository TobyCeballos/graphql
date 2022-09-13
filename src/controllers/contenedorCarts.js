const mongoose = require('mongoose');

const models = require('../models/schemaCarts');

const moment = require('moment');

const container = require('./contenedorProd.js');
const { json } = require('express');
const { remove } = require('../models/schemaProd');

require('dotenv').config()
mongoose.connect(`${process.env.DB_URL}`)


class Carts {
    constructor() {
        this.collection = models;
    }

    async getAllCarts() {
        try {
            const obj = await this.collection.find()
            return obj
        }
        catch (err) {
            return error;
        }
    }

    async crearCarrito(nameId) {
        try {
            const newCarrito = {
                id: nameId,
                productos: ''
            }
            const add = await this.collection.insertMany(newCarrito)
            console.log(`Carrito creado exitosamente`);
            return add
        } catch (err) {
            console.log(`${err} Error en la funcion crearCarrito`);
        }
    }

    //    async deleteCartByID(id) {
    //        try {
    //            const deleteCart = await this.collection.doc(id).delete();
    //            return `Carrito ${id} eliminado`;
    //        } catch (error) {
    //            return error;
    //        }
    //    }

    async getCartById(id) {
        try {
            const elemento = await this.collection.find({ id: id }, { _id: 0, __v: 0 })

            return elemento
        } catch (err) {
            return err;
        }
    }

    async getProdsOfCarts(id) {
        try {
            const elemento = await this.collection.find({ id: id }, { _id: 0, productos: 1 })
            return elemento
        } catch (err) {
            return err;
        }
    }


    async saveProdId(id_carrito, id_prod) {
        try {
            const arrProducts = await this.getProdsOfCarts(id_carrito)
            const jsonStr = JSON.stringify(arrProducts, null, 2)
            const str = jsonStr.substring(1, jsonStr.length - 1)

            const nose = JSON.parse(str)
            const prod = nose.productos
            if (prod.length > 0) {
                const producto = await container.getProdById(id_prod);
                const prodStr = JSON.stringify(producto)
                const str = prodStr.substring(1, prodStr.length - 1)
                const newArray = []
                newArray.push(prod, str)
                const agregado = await this.collection.updateOne({ id: id_carrito }, { $set: { productos: `${newArray}` } });
                return agregado;
            } else {
                const producto = await container.getProdById(id_prod);
                const stringProd = JSON.stringify(producto)
                const str = stringProd.substring(1, stringProd.length - 1)
                const agregado = await this.collection.updateOne({ id: id_carrito }, { $set: { productos: str } });
                return agregado;
            }
        }
        catch (err) {
            console.log(`${err} Error en la funcion saveProdId`)
        }
    }

    async deleteProdById(id_carrito, id_prod) {
        try {
            const arrProducts = await this.getProdsOfCarts(id_carrito)
            const jsonStr = JSON.stringify(arrProducts, null, 2)
            const str = jsonStr.substring(1, jsonStr.length - 1)
            const nose = JSON.parse(str)
            const prod = nose.productos
            const prods = JSON.parse('[' + prod + ']')
            if(prods.length > 1) {
                const del = prods.findIndex((item) => item.id == id_prod)
                await prods.splice(-1, del)
                const string = JSON.stringify(prods)
                const string2 = string.substring(1, string.length - 1)
                const removed = await this.collection.updateOne({ id: id_carrito }, { $set: { productos: string2 } });
                return removed;
            } else {
                const removed = await this.clearCart(id_carrito)
                return removed;
            }
        }
        catch (err) {
            console.log(`${err} Error en la funcion deleteProdById`)
        }
    }

    async clearCart(idCart) {
        try {
            const vacio = ''
            const removed = await this.collection.updateOne({ id: idCart }, { $set: { productos: vacio } });
            return removed;
        } catch (error) {
            return error;
        }
    }
}

const carts = new Carts();

module.exports = carts