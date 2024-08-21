const mongoose = require('mongoose')
const CategorySchema = new mongoose.Schema({
    title:String,
    img:String
})
const Category = mongoose.model('categories', CategorySchema);
module.exports = Category;