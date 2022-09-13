const mongoose = require('mongoose');

const models = require('../models/schemaProd.js');

const moment = require('moment');

require('dotenv').config()
mongoose.connect(`${process.env.DB_URL}`)

class Contenedor {
    constructor() {
        this.coleccion = models
    }

    async updateById(productId, {name, description, price, stock, thumbnail}) {
        try {
            const update = await this.coleccion.findOneAndUpdate({ id: productId },{name: name, description: description, price: price, stock: stock, thumbnail: thumbnail});
            return update;
        }
        catch (err) {
            console.log('ERROR ->', err);
        }
    }


    async saveProd({name, description, price, stock, thumbnail}) {
        try {
            const objs = await this.getProds();
            let newId = 1;
            if (objs.length > 0) {
                newId = objs[objs.length - 1].id + 1;
            }
            console.log(newId)
            const newObj = {
                id: newId,
                name: name,
                description:description,
                price: price,
                stock: stock,
                thumbnail: thumbnail,
                timestamp: moment().format('YYYY-MM-DD HH:mm:ss')
            }
            const add = await this.coleccion.insertMany(newObj)
            return add;
        } catch (error) {
            console.log('ERROR => ', error);
        }
    };

    async deleteById(idProducto) {
        try {
            const deleteById = this.coleccion.findOneAndDelete({id: idProducto})
            return deleteById;
        } catch (error) {
            console.log('ERROR ->', error);
        }
    }

    async getProdById(idProducto) {
        try {
            const obj = await this.coleccion.find({id: idProducto}, {_id:0, __v:0})
            return obj
        } catch (error) {
            console.log('ERROR ->', error);
        }
    }

    async getProds() {
        try {
            const objs = await this.coleccion.find()
            return objs;
        } catch (error) {
            console.log('ERROR ->', error);
        }
    }
};

const prod = new Contenedor();

module.exports = prod;
