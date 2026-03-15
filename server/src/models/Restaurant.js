const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema(
  {
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    cuisine: [{ type: String }],
    address: { type: String, required: true },
    location: {
      lat: Number,
      lng: Number,
    },
    rating: { type: Number, default: 0 },
    image: { type: String },
    deliveryFee: { type: Number, default: 0 },
    estimatedDeliveryTime: { type: Number, default: 30 },
    openingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '23:00' },
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

module.exports = Restaurant;


