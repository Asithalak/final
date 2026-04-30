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

// @route   GET /api/resources/my-resources
// @desc    Get carpenter's own resources
// @access  Private (Carpenter)
router.get('/my-resources', authenticate, isCarpenter, async (req, res) => {
  try {
    const { type, search } = req.query;
    let query = { seller: req.user._id };

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
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/resources/carpenter/:carpenterId
// @desc    Get all resources by a specific carpenter
// @access  Public
router.get('/carpenter/:carpenterId', async (req, res) => {
  try {
    const resources = await Resource.find({ 
      seller: req.params.carpenterId,
      isApproved: true,
      status: 'approved'
    })
    .populate('seller', 'name email phone')
    .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/resources
// @desc    Upload new resource
// @access  Private (Carpenter)
router.post('/', authenticate, isCarpenter, upload.array('images', 3), async (req, res) => {
  try {
    console.log('Creating resource...');
    console.log('User:', req.user?._id, req.user?.role);
    console.log('Body:', req.body);
    console.log('Files:', req.files?.length);
    
    const { name, type, description, quantity, unit, pricePerUnit, specifications, supplierName } = req.body;

    // Validate required fields
    if (!name || !type || !description || quantity === undefined || !unit || pricePerUnit === undefined) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'Missing required fields: name, type, description, quantity, unit, pricePerUnit'
      });
    }

    // Check resource limit (max 100 resources per carpenter)
    const existingResourceCount = await Resource.countDocuments({ seller: req.user._id });
    if (existingResourceCount >= 100) {
      return res.status(400).json({ 
        message: 'You have reached the maximum resource limit (100). Please delete some resources before adding new ones.',
        resourceCount: existingResourceCount,
        limit: 100
      });
    }

    const images = req.files ? req.files.map(file => file.path) : [];

    console.log('Creating resource with data:', {
      name,
      type,
      description,
      quantity,
      unit,
      pricePerUnit,
      seller: req.user._id
    });

    const resource = await Resource.create({
      name: String(name).trim(),
      type: String(type).trim(),
      description: String(description).trim(),
      quantity: Number(quantity),
      unit: String(unit).trim(),
      pricePerUnit: Number(pricePerUnit),
      seller: req.user._id,
      supplierName: supplierName ? String(supplierName).trim() : '',
      images,
      specifications: specifications ? JSON.parse(specifications) : {},
      isApproved: true,  // Auto-approve carpenter's own resources
      status: 'approved'
    });

    console.log('Resource created successfully:', resource._id);

    res.status(201).json({
      message: 'Resource added successfully.',
      resource,
      resourceCount: existingResourceCount + 1,
      limit: 100
    });
  } catch (error) {
    console.error('Resource creation error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
      errors: error.errors
    });
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      details: error.errors ? Object.keys(error.errors).map(k => error.errors[k].message) : undefined
    });
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

    const { name, type, description, quantity, unit, pricePerUnit, supplierName } = req.body;
    
    // Update fields with type conversion
    if (name) resource.name = String(name).trim();
    if (type) resource.type = String(type).trim();
    if (description) resource.description = String(description).trim();
    if (quantity !== undefined) resource.quantity = Number(quantity);
    if (unit) resource.unit = String(unit).trim();
    if (pricePerUnit !== undefined) resource.pricePerUnit = Number(pricePerUnit);
    if (supplierName !== undefined) resource.supplierName = String(supplierName).trim();
    
    if (req.files && req.files.length > 0) {
      resource.images = req.files.map(file => file.path);
    }

    await resource.save();

    res.json({ message: 'Resource updated successfully', resource });
  } catch (error) {
    console.error('Resource update error:', error);
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
