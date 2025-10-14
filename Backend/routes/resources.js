const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authenticate, isAdmin, isCarpenter } = require('../middleware/auth');
const upload = require('../middleware/upload');

// @route   GET /api/resources
// @desc    Get all approved resources
// @access  Private
router.get('/', authenticate, async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { isApproved: true, status: 'approved' };

    if (type) {
      query.type = type;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const resources = await Resource.find(query)
      .populate('seller', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/resources/:id
// @desc    Get single resource
// @access  Private
router.get('/:id', authenticate, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('seller', 'name email phone specialization');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/resources
// @desc    Upload new resource
// @access  Private (Carpenter)
router.post('/', authenticate, isCarpenter, upload.array('images', 3), async (req, res) => {
  try {
    const { name, type, description, quantity, unit, pricePerUnit, specifications } = req.body;

    const images = req.files ? req.files.map(file => file.path) : [];

    const resource = await Resource.create({
      name,
      type,
      description,
      quantity,
      unit,
      pricePerUnit,
      seller: req.user._id,
      images,
      specifications: specifications ? JSON.parse(specifications) : {},
      isApproved: false,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Resource uploaded successfully. Pending admin approval.',
      resource
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/resources/:id
// @desc    Update resource
// @access  Private (Carpenter - own resources)
router.put('/:id', authenticate, isCarpenter, upload.array('images', 3), async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check ownership
    if (resource.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updates = req.body;
    if (req.files && req.files.length > 0) {
      updates.images = req.files.map(file => file.path);
    }

    Object.assign(resource, updates);
    await resource.save();

    res.json({ message: 'Resource updated successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/resources/:id/approve
// @desc    Approve resource listing
// @access  Private (Admin)
router.put('/:id/approve', authenticate, isAdmin, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    resource.isApproved = true;
    resource.status = 'approved';
    await resource.save();

    res.json({ message: 'Resource approved successfully', resource });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/resources/:id/purchase
// @desc    Purchase resource
// @access  Private (Admin)
router.post('/:id/purchase', authenticate, isAdmin, async (req, res) => {
  try {
    const { quantity, recipientCarpenter } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    if (resource.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity available' });
    }

    // Reduce quantity
    resource.quantity -= quantity;
    await resource.save();

    res.json({
      message: `Successfully purchased ${quantity} ${resource.unit} of ${resource.name}`,
      resource,
      totalCost: resource.pricePerUnit * quantity
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   DELETE /api/resources/:id
// @desc    Delete resource
// @access  Private (Admin or Carpenter - own resources)
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && resource.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
