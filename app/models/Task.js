const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  status: { type: String, enum: ['todo', 'in progress', 'done'], default: 'todo' },
  // Ajoutez d'autres champs selon les besoins
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
