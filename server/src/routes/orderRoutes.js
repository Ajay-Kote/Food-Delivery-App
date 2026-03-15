const express = require('express');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  createOrder,
  getUserOrders,
  getRestaurantOrders,
  getAgentOrders,
  updateOrderStatus,
} = require('../controllers/orderController');

const router = express.Router();

router.post('/', auth, role('customer'), createOrder);
router.get('/user/:userId', auth, getUserOrders);
router.get('/restaurant/:restaurantId', auth, role('owner', 'admin'), getRestaurantOrders);
router.get('/agent/:agentId', auth, role('agent'), getAgentOrders);
router.patch('/:id/status', auth, updateOrderStatus);

module.exports = router;


