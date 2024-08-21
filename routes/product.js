const express = require('express')
const router = express.Router()
var ProductModel = require('../models/ProductModel')
var CategoryModel = require('../models/CategoryModel')
// get all books
router.get('/', async (req, res) => {
  let product = await ProductModel.find({}).sort({ _id: -1 }).populate('category');
  // lay du lieu cua toy
  if (req.session.user && req.session.user.role === 'admin') {
    res.render('product/index', { product, user: req.session.user });
  } else {
    res.render('product/product-user', { product, user: req.session.user });
  }
})

router.get('/', async (req, res) => {
  // lay du lieu cua toy
  let product = await ProductModel.find({}).sort({ _id: -1 })
  res.render('product/product-user', { product, user: req.session.user })
})

router.get('/detail/:id', async (req, res) => {
  let id = req.params.id
  // return book data on id
  let product = await ProductModel.findById(id)
  res.render('product/detail', { product })
})
// delete by id
router.get('/delete/:id', async (req, res) => {
  // lay du lieu ve
  let id = req.params.id
  // xoa du lieu di
  try {
    await ProductModel.findByIdAndDelete(id)
    console.log('delete succeed!')
  } catch (err) {
    console.log('delete fail!')
    console.error(err)
  }
  res.redirect('/product')
})
//render form add
router.get('/add', async (req, res) => {
  let categories = await CategoryModel.find()

  res.render('product/add', { categories })
})

// xu ly data and save database tu from
router.post('/add', async (req, res) => {
  let product = req.body
  //save to database
  await ProductModel.create(product)
  // show meesage to console 
  console.log('Add product succeed')
  res.redirect('/product')
})
router.get('/edit/:id', async (req, res) => {
  let product = await ProductModel.findById(req.params.id)
  res.render('product/edit', { product })
})


router.post('/edit/:id', async (req, res) => {
  let id = req.params.id
  let product = req.body

  try {
    await ProductModel.findByIdAndUpdate(id, product)
    console.log('Edit product succeed!')
  } catch (err) {
    consonle.log("Edit product fail!")
    console.log(err)
  }
  res.redirect('/product')
})

module.exports = router