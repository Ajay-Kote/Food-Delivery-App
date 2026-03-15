const Restaurant = require('../models/Restaurant');
const MenuItem = require('../models/MenuItem');

const buildRestaurantFilter = (query) => {
  const filter = { isActive: true };
  if (query.cuisine) {
    filter.cuisine = { $in: query.cuisine.split(',') };
  }
  if (query.rating) {
    filter.rating = { $gte: Number(query.rating) };
  }
  if (query.veg === 'true') {
    // restaurants with at least one veg item, handled in query join if needed
  }
  return filter;
};

exports.getRestaurants = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = buildRestaurantFilter(req.query);

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
      Restaurant.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: restaurants,
      pagination: { page, limit, totalPages: Math.ceil(total / limit), total },
    });
  } catch (err) {
    next(err);
  }
};

exports.getMyRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ ownerId: req.user.id });
    res.json({ success: true, data: restaurant || null });
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

exports.createRestaurant = async (req, res, next) => {
  try {
    const data = { ...req.body, ownerId: req.user.id };
    const restaurant = await Restaurant.create(data);
    res.status(201).json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

exports.updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { _id: req.params.id, ownerId: req.user.id },
      req.body,
      { new: true }
    );
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found' });
    }
    res.json({ success: true, data: restaurant });
  } catch (err) {
    next(err);
  }
};

exports.search = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    if (!q) {
      return res.json({ success: true, data: { restaurants: [], menuItems: [] } });
    }
    const regex = new RegExp(q, 'i');
    const [restaurants, menuItems] = await Promise.all([
      Restaurant.find({ name: regex, isActive: true }),
      MenuItem.find({ name: regex, isAvailable: true }).populate('restaurantId', 'name'),
    ]);
    res.json({ success: true, data: { restaurants, menuItems } });
  } catch (err) {
    next(err);
  }
};


