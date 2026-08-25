// models/Task.js

import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'សូមបញ្ចូលចំណងជើងកិច្ចការ'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  dueDate: {
    type: Date
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

export default Task;