const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');

exports.getMenuByRestaurant = async (req, res, next) => {
  try {
    const items = await MenuItem.find({ restaurantId: req.params.restaurantId, isAvailable: true });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.getMenuByRestaurantForOwner = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);
    if (!restaurant || String(restaurant.ownerId) !== String(req.user.id)) {
      return res.status(403).json({ success: false, message: 'Not your restaurant' });
    }
    const items = await MenuItem.find({ restaurantId: req.params.restaurantId });
    res.json({ success: true, data: items });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.create(req.body);
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = async (req, res, next) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    res.json({ success: true, message: 'Deleted' });
  } catch (err) {
    next(err);
  }
};


