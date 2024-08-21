const express = require('express');
const router = express.Router();
const Order = require('../models/OrderModel');
const Product = require('../models/ProductModel');
const OrderModel = require('../models/OrderModel');

// Đơn hàng hiện tại
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('product') // Nếu trường này không đúng hoặc không tồn tại, lỗi sẽ xảy ra
      .populate('customer')
      .populate('user');


    console.log(orders);
    if (req.session.user && req.session.user.role === 'admin') {
      res.render('order/lista', { orders, user: req.session.user });
    } else {
      res.render('order/list', { orders, user: req.session.user });
     // const orders = await filterOrdersByCustomer(user._id);
    }
    // res.render('order/lista', { orders });

  } catch (err) {
    console.error(err); // In ra chi tiết lỗi để tiện theo dõi
    res.status(500).send('Internal Server Error');
  }
  // Đơn hàng hiện tại
  router.get('/', async (req, res) => {
    try {
      // Lấy thông tin người dùng từ session
      const user = req.session.user;
      if (!user) {
        return res.status(401).send('Unauthorized: No user in session');
      }

      // Lọc đơn hàng theo người dùng hiện tại
      const orders = await Order.find({ customer: user._id })
        .populate('product')
        .populate('customer');

      console.log(orders);

      res.render('order/list', { orders });
    } catch (err) {
      console.error(err); // In ra chi tiết lỗi để tiện theo dõi
      res.status(500).send('Internal Server Error');
    }
  });


});

const filterOrdersByCustomer = async (customerId) => {
  try {
    // Lọc các đơn hàng theo ID khách hàng
    const orders = await Order.find({ customer: customerId })
      .populate('product')   // Lấy thông tin chi tiết của sản phẩm nếu cần
      .populate('customer'); // Lấy thông tin chi tiết của khách hàng nếu cần

    return orders;
  } catch (error) {
    console.error('Error filtering orders:', error);
    throw error;
  }
};


router.get('/', async (req, res) => {
  let orders = await Order.find().populate('product').populate('custormer');
  // lay du lieu cua toy
  if (req.session.user && req.session.user.role === 'admin') {
    res.render('order/index', { orders, user: req.session.user });
  } else {
    res.render('order/list', { orders, user: req.session.user });
  }
})

router.post('/add', async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log(quantity);

    // Lấy thông tin người dùng từ session
    const user = req.session.user;
    if (!user || user.role === 'admin') {
      return res.status(401).send('Unauthorized: No user in session');
    }

    // Tìm sản phẩm theo productId
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send('Product not found');
    }


    // Tạo đơn hàng mới
    const newOrder = new Order({
      product: productId,
      quantity: quantity,
      customer: user._id,
      status: 'Pending'
    });

    // Lưu đơn hàng vào cơ sở dữ liệu
    await newOrder.save();

    // Giảm số lượng sản phẩm sau khi đặt hàng
    product.quantity -= quantity;
    await product.save();

    router.get('/', async (req, res) => {
      let product = await ProductModel.find({}).sort({ _id: -1 }).populate('category');
      // lay du lieu cua toy
      if (req.session.user && req.session.user.role === 'admin') {
        res.render('product/index', { product, user: req.session.user });
      } else {
        res.render('product/product-user', { product, user: req.session.user });
      }
    })

    // Redirect hoặc gửi phản hồi
    res.redirect('/order'); // Ví dụ: chuyển hướng đến trang danh sách đơn hàng
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});


module.exports = router;
