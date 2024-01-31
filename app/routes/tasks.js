const express = require('express');
const Task = require('../models/Task');
const router = express.Router();

// Route pour créer une nouvelle tâche
router.post('/', async (req, res) => {

});

// Route pour lister toutes les tâches d'un projet
router.get('/project/:projectId', async (req, res) => {

});



module.exports = router;
