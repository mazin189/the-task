const { z } = require('zod');

const invoiceValidator = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Product ID is required'),

        quantity: z
          .number()
          .int('Quantity must be an integer')
          .positive('Quantity must be positive'),
      })
    )
    .min(1, 'Invoice must contain at least one item'),
});

module.exports = {
  invoiceValidator,
};
  