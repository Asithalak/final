const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource');
const { authenticate, isAdmin, isCarpenter } = require('../middleware/auth');
const upload = require('../middleware/upload');

const toUploadPaths = (files = []) => files.map(file => `uploads/${file.filename}`.replace(/\\/g, '/'));
const normalizeFurnitureCategory = (category = '') => {
  const normalized = String(category).trim().toLowerCase();
  if (normalized === 'sofas') return 'sofa';
  if (normalized === 'cabinets') return 'cabinet';
  if (normalized === 'others') return 'other';
  return normalized;
};

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
    
    const {
      name,
      type,
      category,
      description,
      furnitureCategory,
      quantity,
      unit,
      pricePerUnit,
      specifications,
      supplierName
    } = req.body;

    const normalizedName = String(name || '').trim();
    const normalizedType = String(type || category || '').trim().toLowerCase();
    const normalizedDescription = String(description || normalizedName).trim();
    const normalizedUnit = String(unit || '').trim().toLowerCase();
    const normalizedFurnitureCategory = normalizeFurnitureCategory(furnitureCategory || 'other');

    // Validate required fields
    if (!normalizedName || !normalizedType || !normalizedDescription || quantity === undefined || !normalizedUnit || pricePerUnit === undefined) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({ 
        message: 'Missing required fields: name, type, description, quantity, unit, pricePerUnit'
      });
    }

    const allowedTypes = new Set(['lumber', 'wood', 'metal', 'fabric', 'glass', 'hardware', 'paint', 'other']);
    if (!allowedTypes.has(normalizedType)) {
      return res.status(400).json({
        message: `Invalid resource type "${normalizedType}". Allowed: ${Array.from(allowedTypes).join(', ')}`
      });
    }

    const allowedUnits = new Set(['piece', 'kg', 'meter', 'sqft', 'liter', 'box']);
    if (!allowedUnits.has(normalizedUnit)) {
      return res.status(400).json({
        message: `Invalid unit "${normalizedUnit}". Allowed: ${Array.from(allowedUnits).join(', ')}`
      });
    }

    const allowedFurnitureCategories = new Set(['bed', 'chair', 'desk', 'table', 'sofa', 'cabinet', 'other']);
    if (!allowedFurnitureCategories.has(normalizedFurnitureCategory)) {
      return res.status(400).json({
        message: `Invalid furniture category "${normalizedFurnitureCategory}". Allowed: ${Array.from(allowedFurnitureCategories).join(', ')}`
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

    const parsedQuantity = Number(quantity);
    const parsedPricePerUnit = Number(pricePerUnit);

    if (!Number.isFinite(parsedQuantity) || parsedQuantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a valid non-negative number' });
    }

    if (!Number.isFinite(parsedPricePerUnit) || parsedPricePerUnit < 0) {
      return res.status(400).json({ message: 'Price per unit must be a valid non-negative number' });
    }

    let parsedSpecifications = {};
    if (specifications) {
      try {
        parsedSpecifications = typeof specifications === 'string'
          ? JSON.parse(specifications)
          : specifications;
      } catch {
        return res.status(400).json({ message: 'Invalid specifications format' });
      }
    }

    const images = toUploadPaths(req.files);

    console.log('Creating resource with data:', {
      name: normalizedName,
      type: normalizedType,
      description: normalizedDescription,
      quantity: parsedQuantity,
      unit: normalizedUnit,
      pricePerUnit: parsedPricePerUnit,
      seller: req.user._id
    });

    const resource = await Resource.create({
      name: normalizedName,
      type: normalizedType,
      description: normalizedDescription,
      quantity: parsedQuantity,
      unit: normalizedUnit,
      pricePerUnit: parsedPricePerUnit,
      seller: req.user._id,
      supplierName: supplierName ? String(supplierName).trim() : '',
      furnitureCategory: normalizedFurnitureCategory,
      images,
      specifications: parsedSpecifications,
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
    if (error?.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation failed',
        error: error.message,
        details: Object.keys(error.errors).map(k => error.errors[k].message)
      });
    }

    if (error?.name === 'SyntaxError') {
      return res.status(400).json({
        message: 'Invalid JSON payload',
        error: error.message
      });
    }

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

    const { name, type, description, quantity, unit, pricePerUnit, supplierName, furnitureCategory } = req.body;
    
    // Update fields with type conversion
    if (name) resource.name = String(name).trim();
    if (type) resource.type = String(type).trim();
    if (description) resource.description = String(description).trim();
    if (quantity !== undefined) resource.quantity = Number(quantity);
    if (unit) resource.unit = String(unit).trim();
    if (pricePerUnit !== undefined) resource.pricePerUnit = Number(pricePerUnit);
    if (supplierName !== undefined) resource.supplierName = String(supplierName).trim();
    if (furnitureCategory !== undefined) {
      resource.furnitureCategory = normalizeFurnitureCategory(furnitureCategory);
    }
    
    if (req.files && req.files.length > 0) {
      resource.images = toUploadPaths(req.files);
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
