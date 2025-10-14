const express = require('express');
const router = express.Router();
const Furniture = require('../models/Furniture');
const { authenticate, isAdmin, isCarpenter } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/furniture
// @desc    Get all approved furniture
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice } = req.query;
    let query = { isApproved: true, status: 'approved' };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const furniture = await Furniture.find(query)
      .populate('carpenter', 'name email specialization')
      .sort({ createdAt: -1 });

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/furniture/:id
// @desc    Get single furniture item
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id)
      .populate('carpenter', 'name email specialization phone')
      .populate('reviews.user', 'name');

    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }

    res.json(furniture);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/furniture
// @desc    Create new furniture design
// @access  Private (Carpenter)
router.post('/', authenticate, isCarpenter, upload.array('images', 5), async (req, res) => {
  try {
    const { name, description, category, price, materials, dimensions, stockQuantity, brand } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const furniture = await Furniture.create({
      name,
      description,
      category,
      price,
      images,
      materials: JSON.parse(materials),
      dimensions: JSON.parse(dimensions),
      stockQuantity: stockQuantity || 0,
      brand,
      carpenter: req.user._id,
      isApproved: false,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Furniture design uploaded successfully. Pending admin approval.',
      furniture
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/furniture/:id
// @desc    Update furniture
// @access  Private (Carpenter - own items)
router.put('/:id', authenticate, isCarpenter, upload.array('images', 5), async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }

    // Check ownership
    if (furniture.carpenter.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    Object.assign(furniture, updates);
    await furniture.save();

    res.json({ message: 'Furniture updated successfully', furniture });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/furniture/:id/approve
// @desc    Approve furniture design
// @access  Private (Admin)
router.put('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }

    furniture.isApproved = true;
    furniture.status = 'approved';
    await furniture.save();

    res.json({ message: 'Furniture approved successfully', furniture });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/furniture/:id
// @desc    Delete furniture
// @access  Private (Admin or Carpenter - own items)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && furniture.carpenter.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await furniture.deleteOne();
    res.json({ message: 'Furniture deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/furniture/:id/review
// @desc    Add review to furniture
// @access  Private (Customer)
router.post('/:id/review', authenticate, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const furniture = await Furniture.findById(req.params.id);

    if (!furniture) {
      return res.status(404).json({ message: 'Furniture not found' });
    }

    // Check if already reviewed
    const alreadyReviewed = furniture.reviews.find(
      r => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    const review = {
      user: req.user._id,
      rating: Number(rating),
      comment
    };

    furniture.reviews.push(review);

    // Update average rating
    furniture.rating = furniture.reviews.reduce((acc, item) => item.rating + acc, 0) / furniture.reviews.length;

    await furniture.save();
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
