const express = require('express')
const router = express.Router()
var CategoryModel = require('../models/CategoryModel')
// get all books

router.get('/', async (req, res) => {
  let category = await CategoryModel.find({}).sort({ _id: -1 })
  // lay du lieu cua toy
  if (req.session.user && req.session.user.role === 'admin') {
    res.render('category/index', { category, user: req.session.user });
  } else {
    res.render('category/category-user', { category, user: req.session.user });
  }
})

router.get('/', async (req, res) => {
  // lay du lieu cua book
  let category = await CategoryModel.find({}).sort({ _id: -1 })
  res.render('category/category-user', { category })
})
// detail
router.get('/detail/:id', async (req, res) => {
  let id = req.params.id
  // return book data on id
  let category = await CategoryModel.findById(id)
  res.render('category/detail', { category})
})


// delete by id
router.get('/delete/:id', async (req, res) => {
  // lay du lieu ve
  let id = req.params.id
  // xoa du lieu di
  try {
    await CategoryModel.findByIdAndDelete(id)
    console.log('delete succeed!')
  } catch (err) {
    console.log('delete fail!')
    console.error(err)
  }
  res.redirect('/category')
})
//render form add
router.get('/add', (req, res) => {
  res.render('category/add')
})

// xu ly data and save database tu from
router.post('/add', async (req, res) => {
  let category = req.body
  //save to database
  await CategoryModel.create(category)
  // show meesage to console 
  console.log('Add category succeed')
  res.redirect('/category')
})
router.get('/edit/:id', async (req, res) => {
  let category = await CategoryModel.findById(req.params.id)
  res.render('category/edit', { category })
})

router.post('/edit/:id', async (req, res) => {
  let id = req.params.id
  let category = req.body

  try {
    await CategoryModel.findByIdAndUpdate(id, category)
    console.log('Edit product succeed!')
  } catch (err) {
    consonle.log("Edit product fail!")
    console.log(err)
  }
  res.redirect('/category')
})

module.exports = router