const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true,
      default: ''
    }
  },
  { timestamps: true }
);

const furnitureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      enum: ['chair', 'table', 'sofa', 'bed', 'cabinet', 'desk', 'shelf', 'other'],
      lowercase: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    images: [
      {
        type: String
      }
    ],
    materials: [
      {
        type: String,
        trim: true
      }
    ],
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: { type: String, default: 'cm', trim: true }
    },
    stockQuantity: {
      type: Number,
      min: 0,
      default: 0
    },
    timeRequired: {
      type: String,
      trim: true,
      default: ''
    },
    brand: {
      type: String,
      trim: true,
      default: ''
    },
    carpenter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
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
    reviews: [reviewSchema],
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Furniture', furnitureSchema);
