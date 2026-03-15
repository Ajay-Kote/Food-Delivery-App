const express = require('express');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  getMenuByRestaurant,
  getMenuByRestaurantForOwner,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} = require('../controllers/menuController');

const router = express.Router();

router.get('/owner/:restaurantId', auth, role('owner'), getMenuByRestaurantForOwner);
router.get('/:restaurantId', getMenuByRestaurant);
router.post('/', auth, role('owner'), createMenuItem);
router.put('/:id', auth, role('owner'), updateMenuItem);
router.delete('/:id', auth, role('owner'), deleteMenuItem);

module.exports = router;


