const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, phone, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      location: location ? {
        type: 'Point',
        coordinates: [location.lng, location.lat],
        address: location.address
      } : undefined
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        skills: user.skills,
        availability: user.availability,
        bio: user.bio,
        isVerified: user.isVerified,
        badges: user.badges,
        reliabilityScore: user.reliabilityScore,
        completedTasks: user.completedTasks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone,
      location: req.user.location,
      skills: req.user.skills,
      availability: req.user.availability,
      bio: req.user.bio,
      isVerified: req.user.isVerified,
      badges: req.user.badges,
      reliabilityScore: req.user.reliabilityScore,
      completedTasks: req.user.completedTasks
    }
  });
});

// Update profile
router.put('/profile', auth, async (req, res) => {
  try {
    const updates = req.body;
    // Prevent updating password here, or handle separately
    delete updates.password;
    delete updates.email; // Prevent email change for simplicity

    if (updates.location) {
      updates.location = {
        type: 'Point',
        coordinates: [updates.location.lng, updates.location.lat],
        address: updates.location.address
      };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        location: user.location,
        skills: user.skills,
        availability: user.availability,
        bio: user.bio,
        isVerified: user.isVerified,
        badges: user.badges,
        reliabilityScore: user.reliabilityScore,
        completedTasks: user.completedTasks
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;