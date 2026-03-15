const { getRecommendationsForUser } = require('../utils/recommendationEngine');

exports.getRecommendations = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const items = await getRecommendationsForUser(userId);
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};


