const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');

const getTimeBonusCategory = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour <= 11) return 'breakfast';
  if (hour >= 12 && hour <= 15) return 'lunch';
  if (hour >= 16 && hour <= 19) return 'snacks';
  if (hour >= 20 && hour <= 23) return 'dinner';
  return null;
};

const computeScore = (item, bonusCategory) => {
  const orderCount = item.orderCount || 0;
  const avgRating = item.avgRating || 0;
  let timeBonus = 0;
  if (bonusCategory && item.category === bonusCategory) {
    timeBonus = 2;
  }
  return orderCount * 3 + avgRating * 2 + timeBonus;
};

const getRecommendationsForUser = async (userId) => {
  const bonusCategory = getTimeBonusCategory();

  const userOrders = await Order.find({ customerId: userId }).select('items');
  const hasHistory = userOrders.length > 0;

  let menuItems;

  if (!hasHistory) {
    menuItems = await MenuItem.find({ isAvailable: true }).limit(50);
  } else {
    const itemCounts = {};
    userOrders.forEach((order) => {
      order.items.forEach((it) => {
        const key = String(it.menuItemId);
        itemCounts[key] = (itemCounts[key] || 0) + it.quantity;
      });
    });
    const topItemIds = Object.entries(itemCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 50)
      .map(([id]) => id);
    menuItems = await MenuItem.find({ _id: { $in: topItemIds }, isAvailable: true });
  }

  const scored = menuItems.map((item) => ({
    item,
    score: computeScore(item, bonusCategory),
  }));

  scored.sort((a, b) => b.score - a.score);

  return scored.slice(0, 8).map((s) => s.item);
};

module.exports = {
  getRecommendationsForUser,
};


