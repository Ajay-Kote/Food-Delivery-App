const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: {
    type: String,
    enum: ['breakfast', 'lunch', 'snacks', 'dinner'],
    required: true,
  },
  image: { type: String },
  isVeg: { type: Boolean, default: true },
  avgRating: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;


