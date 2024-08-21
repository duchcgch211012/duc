const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.get('/', (req, res) => {
  res.render('index', { user: req.session.user });
});


router.get('/signup', (req, res) => {
  res.render('signup');
});

router.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword, role: 'user' });
  try {
    await newUser.save();
    req.session.user = newUser;
    res.redirect('/');
  } catch (err) {
    res.redirect('/signup');
  }
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/products', (req, res) => { // ra admin
  res.render('product');
});

router.get('/product-user', (req, res) => { // ra user
  res.render('product/product-user');
});
router.get('/categories', (req, res) => { // ra admin catefory
  res.render('category');
});

router.get('/category-user', (req, res) => { // ra category user
  res.render('category/category-user');
});



router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    if(user.role === 'user') {
      res.redirect('/product');
    } else if(user.role === 'admin') {
      res.redirect('/product');
    }
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
