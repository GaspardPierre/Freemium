const express = require ('express')
const usersRouter = require('./users');
const tasksRouter = require('./tasks');
const projectsRouter = require('./projects');
const router = express.Router();


router.use('/users', usersRouter);
router.use('/projects', projectsRouter);
router.use('/tasks', tasksRouter);

module.exports = router