const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: false, // Not required initially, as tasks can be unassigned
  },
  status: {
    type: String,
    enum: ['pending','assigned', 'accepted','rejected', 'finished'],
    default: 'pending', // Default status is 'assigned' when the admin assigns a task
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Task', taskSchema);
