const express = require('express');
const auth = require('../middleware/authMiddleware');
const { createReview, getRestaurantReviews } = require('../controllers/reviewController');

const router = express.Router();

router.post('/', auth, createReview);
router.get('/restaurant/:restaurantId', getRestaurantReviews);

module.exports = router;


