const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'worker'],
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    },
    address: String
  },
  // Worker specific fields
  skills: [{
    type: String
  }],
  availability: {
    type: String, // e.g., 'weekdays', 'weekends', 'anytime'
    default: 'anytime'
  },
  bio: String,
  // Verification and badges
  isVerified: {
    type: Boolean,
    default: false
  },
  badges: [{
    type: String // e.g., 'verified', 'top-worker', '50-tasks'
  }],
  reliabilityScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  // Client specific
  // Maybe later
}, {
  timestamps: true
});

// Index for location
userSchema.index({ location: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);