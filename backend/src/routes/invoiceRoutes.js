const express = require('express');
const {
  createInvoice,
  getInvoices,
} = require('../controllers/invoiceController');
const validate = require('../middleware/validate');
const { invoiceValidator } = require('../validators/invoiceValidator');


const router = express.Router();

router.route('/').post(validate(invoiceValidator),createInvoice).get(getInvoices);
module.exports = router;
