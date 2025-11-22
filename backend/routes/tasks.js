const express = require('express');
const Task = require('../models/Task');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create task
router.post('/', auth, requireRole(['client']), async (req, res) => {
  try {
    const { title, description, category, price, location, deadline } = req.body;

    // Prepare task data
    const taskData = {
      client: req.user._id,
      title,
      description,
      category,
      price,
      deadline: new Date(deadline)
    };

    // Handle location based on whether it's remote or not
    if (location.isRemote) {
      taskData.location = {
        isRemote: true,
        type: 'Point',
        coordinates: [0, 0], // Default coordinates for remote tasks
        address: 'Remote'
      };
    } else {
      taskData.location = {
        type: 'Point',
        coordinates: [parseFloat(location.lng), parseFloat(location.lat)],
        address: location.address,
        isRemote: false
      };
    }

    const task = new Task(taskData);
    await task.save();
    await task.populate('client', 'name email');

    res.status(201).json(task);
  } catch (error) {
    console.error('Task creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tasks for client
router.get('/client', auth, requireRole(['client']), async (req, res) => {
  try {
    const tasks = await Task.find({ client: req.user._id })
      .populate('worker', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get available tasks for workers (nearby)
router.get('/available', auth, requireRole(['worker']), async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in km

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Location required' });
    }

    // Find both nearby tasks and remote tasks
    const tasks = await Task.find({
      status: 'open',
      $or: [
        {
          'location.isRemote': true
        },
        {
          location: {
            $near: {
              $geometry: {
                type: 'Point',
                coordinates: [parseFloat(lng), parseFloat(lat)]
              },
              $maxDistance: radius * 1000 // meters
            }
          }
        }
      ]
    }).populate('client', 'name email phone').limit(50);

    res.json(tasks);
  } catch (error) {
    console.error('Available tasks error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get tasks for worker
router.get('/worker', auth, requireRole(['worker']), async (req, res) => {
  try {
    const tasks = await Task.find({
      $or: [
        { worker: req.user._id },
        { status: 'open' }
      ]
    }).populate('client', 'name email phone').sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Accept task
router.post('/:id/accept', auth, requireRole(['worker']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.status !== 'open') {
      return res.status(400).json({ message: 'Task not available' });
    }

    task.worker = req.user._id;
    task.status = 'assigned';
    await task.save();
    await task.populate('client', 'name email phone');
    await task.populate('worker', 'name email phone');

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Deposit MPESA (mock for now)
router.post('/:id/deposit', auth, requireRole(['client']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.client.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.escrow.deposited) {
      return res.status(400).json({ message: 'Already deposited' });
    }

    // Mock MPESA deposit
    task.escrow.deposited = true;
    task.escrow.amount = task.price;
    task.escrow.mpesaTransactionId = 'mock_' + Date.now();
    await task.save();

    res.json({ message: 'Deposit successful', task });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Start task
router.post('/:id/start', auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    const isClient = task.client.toString() === req.user._id.toString();
    const isWorker = task.worker && task.worker.toString() === req.user._id.toString();

    if (!isClient && !isWorker) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (task.status !== 'assigned' || !task.escrow.deposited) {
      return res.status(400).json({ message: 'Cannot start task' });
    }

    task.status = 'in-progress';
    await task.save();

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Complete task
router.post('/:id/complete', auth, requireRole(['worker']), async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task || task.worker.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.status !== 'in-progress') {
      return res.status(400).json({ message: 'Task not in progress' });
    }

    task.status = 'completed';
    task.completedAt = new Date();
    await task.save();

    // Update worker stats
    const worker = await User.findById(task.worker);
    worker.completedTasks += 1;

    // Check badges
    if (worker.completedTasks >= 50 && !worker.badges.includes('50-tasks')) {
      worker.badges.push('50-tasks');
    }

    await worker.save();

    // Calculate commission and payout (mock)
    const commission = task.price * 0.1;
    const payout = task.price - commission;

    res.json({ task, commission, payout });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Review task
router.post('/:id/review', auth, requireRole(['client']), async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task || task.client.toString() !== req.user._id.toString() || task.status !== 'completed') {
      return res.status(404).json({ message: 'Task not found or not completed' });
    }

    task.reviews.push({
      reviewer: req.user._id,
      rating: parseInt(rating),
      comment
    });

    await task.save();

    // Update worker reliability score
    const workerTasks = await Task.find({ worker: task.worker, status: 'completed' }).populate('reviews');
    const totalRating = workerTasks.reduce((sum, t) => sum + t.reviews.reduce((s, r) => s + r.rating, 0), 0);
    const totalReviews = workerTasks.reduce((sum, t) => sum + t.reviews.length, 0);
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0;

    await User.findByIdAndUpdate(task.worker, { reliabilityScore: averageRating });

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;