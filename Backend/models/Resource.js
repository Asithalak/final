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
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

resourceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  if (this.quantity === 0) {
    this.status = 'out_of_stock';
  }
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
