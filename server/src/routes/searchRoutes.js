const express = require('express');
const { search } = require('../controllers/restaurantController');

const router = express.Router();
router.get('/', search);

module.exports = router;
