const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({  
  title: { type: String, required: true },  
  description: { type: String, required: false },  
  status: {
    type: String,  
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date, default: null }
});

// Create a model from the schema
module.exports = mongoose.model('Task', taskSchema);
