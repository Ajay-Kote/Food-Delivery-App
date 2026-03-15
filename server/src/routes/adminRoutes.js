const express = require('express');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  getDashboardStats,
  getUsers,
  approveUser,
  getAllOrders,
} = require('../controllers/adminController');

const router = express.Router();

router.use(auth, role('admin'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/users', getUsers);
router.patch('/approve/:userId', approveUser);
router.get('/orders', getAllOrders);

module.exports = router;


