const { z } = require('zod');

const productValidator = z.object({
  name: z.string().min(1, 'Product name is required'),

  price: z.number().positive('Product price must be positive'),

  stockQuantity: z
    .number()
    .int('Stock quantity must be an integer')
    .min(0, 'Stock quantity cannot be negative'),
});

module.exports = {
  productValidator,
};