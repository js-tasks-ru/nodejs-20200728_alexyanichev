const Order = require('../models/Order');
const getErrorMessagesByKeys = require('../../01-registration/controllers/registration')
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  try {
    const {product, phone, address} = ctx.request.body;

    const user = ctx.user;
    const order = await new Order({user: user._id, product, phone, address});
    await order.save();
    const order_id = order._id;

    await sendMail({template: "order-confirmation", to: user.email, subject: 'order', locals: {id: order_id, product}})

    ctx.status = 200;
    ctx.body = {order: order_id};
  } catch (error) {
    if (error.errors) {
      ctx.status = 400;
      ctx.body = { errors: getErrorMessagesByKeys(error) };
    } else {
      ctx.status = 500;
      ctx.body = { error: "Неизвестная ошибка" };
    }
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  try {
    const orders = await Order.find({user: ctx.user._id}).populate('Product');

    ctx.status = 200;
    ctx.body = {orders}
  } catch (error) {
    ctx.status = 500;
    ctx.body = { error: "Неизвестная ошибка" };
  }
};
