const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const productRoute = require('./routes/product');
const categoryRoute = require('./routes/category');
const orderRoute = require('./routes/order');


const app = express();

// 1. Kết nối tới MongoDB
const db = 'mongodb+srv://duc:duc123@duc.3auokco.mongodb.net/cloud1';
mongoose.connect(db)
  .then(() => console.log('Kết nối tới cơ sở dữ liệu thành công!'))
  .catch(err => console.error('Kết nối cơ sở dữ liệu thất bại!', err));

// 2. Cấu hình view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// 3. Cấu hình các middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// 4. Cấu hình session
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: db }),
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

// Middleware để kiểm tra đăng nhập
function checkAuth(req, res, next) {
  if (req.session.user) {
    res.locals.user = req.session.user; // Make user available in all views
    next();
  } else {
    res.redirect('/login');
  }
}

// 5. Sử dụng các router
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/product', checkAuth, productRoute);
app.use('/category', checkAuth, categoryRoute);
app.use('/order', orderRoute);


// Route logout
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
    }
    res.redirect('/');
  });
});

// Catch 404 và forward tới error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Thiết lập cổng và khởi động server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;