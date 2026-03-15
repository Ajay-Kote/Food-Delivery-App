const Order = require('../models/Order');

const paginate = (query, page, limit) => {
  const skip = (page - 1) * limit;
  return query.skip(skip).limit(limit);
};

exports.createOrder = async (req, res, next) => {
  try {
    const data = { ...req.body, customerId: req.user.id };
    const order = await Order.create(data);

    if (global.io) {
      global.io.to(String(order.restaurantId)).emit('order:placed', order);
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};

exports.getUserOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const query = Order.find({ customerId: req.params.userId }).sort({ createdAt: -1 });
    const [orders, total] = await Promise.all([
      paginate(query, page, limit),
      Order.countDocuments({ customerId: req.params.userId }),
    ]);
    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, totalPages: Math.ceil(total / limit), total },
    });
  } catch (err) {
    next(err);
  }
};

exports.getRestaurantOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = { restaurantId: req.params.restaurantId };
    const query = Order.find(filter).sort({ createdAt: -1 });
    const [orders, total] = await Promise.all([paginate(query, page, limit), Order.countDocuments(filter)]);
    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, totalPages: Math.ceil(total / limit), total },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAgentOrders = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const filter = { agentId: req.params.agentId };
    const query = Order.find(filter).sort({ createdAt: -1 });
    const [orders, total] = await Promise.all([paginate(query, page, limit), Order.countDocuments(filter)]);
    res.json({
      success: true,
      data: orders,
      pagination: { page, limit, totalPages: Math.ceil(total / limit), total },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, agentId: req.body.agentId },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (global.io) {
      global.io.to(String(order.customerId)).emit('order:statusUpdate', order);
      if (req.body.status === 'Confirmed') {
        global.io.to(String(order.customerId)).emit('order:confirmed', order);
      }
      if (order.agentId) {
        global.io.to(String(order.agentId)).emit('agent:assigned', order);
      }
    }

    res.json({ success: true, data: order });
  } catch (err) {
    next(err);
  }
};


