const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');
const Restaurant = require('./models/Restaurant');
const MenuItem = require('./models/MenuItem');

dotenv.config();

const run = async () => {
  await connectDB();

  await Promise.all([User.deleteMany({}), Restaurant.deleteMany({}), MenuItem.deleteMany({})]);

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin',
    isApproved: true,
  });

  const customer = await User.create({
    name: 'Test Customer',
    email: 'customer@example.com',
    password: 'password123',
    role: 'customer',
    isApproved: true,
  });

  const owner = await User.create({
    name: 'Restaurant Owner',
    email: 'owner@example.com',
    password: 'password123',
    role: 'owner',
    isApproved: true,
  });

  const restaurant = await Restaurant.create({
    ownerId: owner._id,
    name: 'Spice Garden',
    description: 'Delicious Indian cuisine',
    cuisine: ['Indian'],
    address: '123 Food Street',
    deliveryFee: 30,
    estimatedDeliveryTime: 35,
  });

  await MenuItem.insertMany([
    {
      restaurantId: restaurant._id,
      name: 'Masala Dosa',
      description: 'Crispy dosa with spicy potato filling',
      price: 120,
      category: 'breakfast',
      isVeg: true,
      avgRating: 4.5,
      orderCount: 50,
    },
    {
      restaurantId: restaurant._id,
      name: 'Paneer Butter Masala',
      description: 'Creamy tomato gravy with paneer',
      price: 220,
      category: 'dinner',
      isVeg: true,
      avgRating: 4.8,
      orderCount: 80,
    },
  ]);

  console.log('Seed data created');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


