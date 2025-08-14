import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  status: { type: String, enum: ['todo','in-progress','done'], default: 'todo' },
  priority: { type: String, enum: ['low','medium','high'], default: 'medium' },
  tags: [{ type: String }],
  dueDate: { type: Date },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true })

const Task = mongoose.model('Task', taskSchema)
export default Task
