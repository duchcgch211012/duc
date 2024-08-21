const mongoose = require('mongoose')
const ProductSchema = new mongoose.Schema(
  {

    title : {
     type: String,
     require: true,
     minLength:5,
     maxLength:50
    },
    category : {
      type:mongoose.Schema.Types.ObjectId,
      ref:'categories'
    },
    price : {
      type: Number,
      require: true,
      minLength: 1,
      maxLength: 200,
    },
    cover : String,
    quantity: Number,
    description: String

  }
)
const ProductModel = mongoose.model('products', ProductSchema) // books : table name
module.exports = ProductModel