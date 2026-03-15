const Review = require('../models/Review');

exports.createReview = async (req, res, next) => {
  try {
    const review = await Review.create({ ...req.body, userId: req.user.id });
    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.json({ success: true, data: reviews });
  } catch (err) {
    next(err);
  }
};


