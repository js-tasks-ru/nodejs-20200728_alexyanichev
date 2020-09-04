const mongoose = require('mongoose');
const Product = require("../models/Product");

const formatProduct = product => ({
  id: product.id,
  title:  product.title,
  description: product.description,
  price: product.price,
  category: product.category,
  subcategory: product.subcategory,
  images: product.images,
});

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const subcategory_id = ctx.request.query.subcategory;
  if (mongoose.Types.ObjectId.isValid(subcategory_id)) {
    const products = await Product.find({subcategory: subcategory_id});
    ctx.body = {products: products.map(formatProduct)};
  } else {
    return next()
  }
};

module.exports.productList = async function productList(ctx, next) {
  const products = await Product.find();
  ctx.body = {products: products.map(formatProduct)}
};

module.exports.productById = async function productById(ctx, next) {
  const id = ctx.params.id;

  if (mongoose.Types.ObjectId.isValid(id)) {
    const product = await Product.findById(id);
    if (product) {
      ctx.body = {product: formatProduct(product)};
    } else {
      ctx.status = 404;
      ctx.body = {};
    }
  } else {
    ctx.status = 400;
    ctx.body = {};
  }
};

