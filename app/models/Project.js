const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completion: { 
    type: Number, 
    min: 0, 
    max: 100, 
    default: 0 
  },
  // Ajoutez d'autres champs selon les besoins
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
