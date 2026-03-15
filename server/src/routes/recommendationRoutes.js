const express = require('express');
const auth = require('../middleware/authMiddleware');
const { getRecommendations } = require('../controllers/recommendationController');

const router = express.Router();

router.get('/:userId', auth, getRecommendations);

module.exports = router;


