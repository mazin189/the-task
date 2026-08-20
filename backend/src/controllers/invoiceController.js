const Product = require('../models/Product');
const Invoice = require('../models/Invoice');
const asyncHandler = require('express-async-handler');


const createInvoice = asyncHandler(async (req, res) => {
  const items = req.body.items;

  const invoiceItems = [];
  let totalPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stockQuantity < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock for ${product.name}`,
      });
    }

    product.stockQuantity -= item.quantity;
    await product.save();

    const subtotal = product.price * item.quantity;

    totalPrice += subtotal;

    invoiceItems.push({
      product: product._id,
      productName: product.name,
      quantity: item.quantity,
      price: product.price,
      subtotal,
    });
  }

  const invoice = await Invoice.create({
    items: invoiceItems,
    totalPrice,
    timestamp: new Date(),
  });

  res.status(201).json({
    success: true,
    data: invoice,
  });
});



const getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({}).sort({
    timestamp: -1,
  });

  res.status(200).json({
    success: true,
    count: invoices.length,
    data: invoices,
  });
});

module.exports = {
  createInvoice,
  getInvoices,
};