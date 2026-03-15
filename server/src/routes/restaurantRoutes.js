const express = require('express');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const {
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  createRestaurant,
  updateRestaurant,
  search,
} = require('../controllers/restaurantController');

const router = express.Router();

router.get('/', getRestaurants);
router.get('/search', search);
router.get('/mine', auth, role('owner'), getMyRestaurant);
router.get('/:id', getRestaurantById);
router.post('/', auth, role('owner'), createRestaurant);
router.put('/:id', auth, role('owner'), updateRestaurant);

module.exports = router;


