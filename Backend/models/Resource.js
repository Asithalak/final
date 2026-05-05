const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['lumber', 'wood', 'metal', 'fabric', 'glass', 'hardware', 'paint', 'other']
  },
  description: {
    type: String,
    required: true
  },
  furnitureCategory: {
    type: String,
    enum: ['bed', 'chair', 'desk', 'table', 'sofa', 'cabinet', 'other'],
    default: 'other'
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['piece', 'kg', 'meter', 'sqft', 'liter', 'box']
  },
  pricePerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  supplierName: {
    type: String,
    trim: true,
    default: ''
  },
  images: [{
    type: String
  }],
  specifications: {
    type: Map,
    of: String
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'out_of_stock'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Resource', resourceSchema);
