const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

const router = express.Router();

router.post('/create-order', auth, createOrder);
router.post('/verify', auth, verifyPayment);

module.exports = router;


