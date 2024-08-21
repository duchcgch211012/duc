const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
    {


        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products'
        },
        quantity: Number,
        customer:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status:{type:String},



    }
)


const OrderModel = mongoose.model('orders', orderSchema);
module.exports = OrderModel

