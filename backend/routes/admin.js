const express = require('express');
const User = require('../models/User');
const Task = require('../models/Task');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// All admin routes require admin role
router.use(auth, requireRole(['admin']));

// Get all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify user
router.post('/users/:id/verify', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    if (!user.badges.includes('verified')) {
      user.badges.push('verified');
    }
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('client worker');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get payouts (mock)
router.get('/payouts', async (req, res) => {
  try {
    const completedTasks = await Task.find({ status: 'completed' }).populate('worker');
    const payouts = completedTasks.map(task => ({
      taskId: task._id,
      worker: task.worker.name,
      amount: task.price * 0.9,
      status: 'pending' // mock
    }));
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;