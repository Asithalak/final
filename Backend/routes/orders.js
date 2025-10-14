const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Furniture = require('../models/Furniture');
const { authenticate, isAdmin } = require('../middleware/auth');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private (Customer)
router.post('/', authenticate, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, notes } = req.body;

    // Calculate total and check stock
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const furniture = await Furniture.findById(item.furniture);
      
      if (!furniture) {
        return res.status(404).json({ message: `Furniture ${item.furniture} not found` });
      }

      orderItems.push({
        furniture: furniture._id,
        quantity: item.quantity,
        price: furniture.price,
        carpenter: furniture.carpenter
      });

      totalAmount += furniture.price * item.quantity;

      // Check stock
      if (furniture.stockQuantity < item.quantity) {
        // Mark as needs production
        continue;
      } else {
        // Reduce stock
        furniture.stockQuantity -= item.quantity;
        await furniture.save();
      }
    }

    const order = await Order.create({
      customer: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      notes,
      status: 'pending'
    });

    await order.populate('items.furniture');
    
    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders (Admin sees all, others see their own)
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'customer') {
      query.customer = req.user._id;
    } else if (req.user.role === 'carpenter') {
      query['items.carpenter'] = req.user._id;
    }
    // Admin sees all orders

    const orders = await Order.find(query)
      .populate('customer', 'name email phone')
      .populate('items.furniture', 'name price images')
      .populate('items.carpenter', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/orders/:id
// @desc    Get single order
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('items.furniture', 'name price images category')
      .populate('items.carpenter', 'name email phone specialization')
      .populate('assignedCarpenter', 'name email phone');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && 
        order.customer._id.toString() !== req.user._id.toString() &&
        !order.items.some(item => item.carpenter._id.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin)
router.put('/:id/status', authenticate, isAdmin, async (req, res) => {
  try {
    const { status, assignedCarpenter, productionStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (status) order.status = status;
    if (assignedCarpenter) order.assignedCarpenter = assignedCarpenter;
    if (productionStatus) order.productionStatus = productionStatus;

    await order.save();
    
    res.json({ message: 'Order status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private (Admin)
router.put('/:id/payment', authenticate, isAdmin, async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    res.json({ message: 'Payment status updated successfully', order });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/orders/:id
// @desc    Cancel order
// @access  Private (Customer - own orders, Admin)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && order.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Can only cancel pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Cannot cancel order in current status' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
