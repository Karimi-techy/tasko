const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['delivery', 'pickup', 'data-entry', 'laundry', 'tutoring', 'babysitting', 'other'],
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: false // Changed to false to allow remote tasks
    },
    address: {
      type: String,
      required: false // Changed to false for remote tasks
    },
    isRemote: {
      type: Boolean,
      default: false
    }
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'assigned', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  escrow: {
    deposited: {
      type: Boolean,
      default: false
    },
    amount: {
      type: Number,
      default: 0
    },
    mpesaTransactionId: String
  },
  completedAt: Date,
  reviews: [{
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for location (only for non-remote tasks)
taskSchema.index({ location: '2dsphere' });
taskSchema.index({ status: 1 });
taskSchema.index({ client: 1 });
taskSchema.index({ worker: 1 });
taskSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Task', taskSchema);